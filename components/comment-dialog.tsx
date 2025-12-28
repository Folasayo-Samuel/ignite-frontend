"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects } from "@/api/projects";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

interface CommentDialogProps {
  projectTitle?: string;
  commentCount?: number;
  onCommentAdded: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  postId?: string;
}

export function CommentDialog({
  projectTitle,
  commentCount,
  onCommentAdded,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  postId,
}: CommentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { getComments, addComment } = useProjects();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  // Fetch comments only when dialog is open and postId exists
  const { data: comments, isLoading } = getComments(postId || "");
  const { mutateAsync: performAddComment, isPending } = addComment;

  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = async () => {
    if (!currentUser) {
      router.push("/auth/login?redirect=/home/showcase");
      if (onOpenChange) onOpenChange(false);
      return;
    }

    if (newComment.trim() && postId) {
      try {
        await performAddComment({ projectId: postId, content: newComment });
        setNewComment("");
        onCommentAdded(); // Update parent count
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const formattedComments = comments || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{commentCount || 0}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>{projectTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            {!currentUser && (
              <div className="text-sm text-muted-foreground mb-2 bg-muted p-2 rounded">
                Please <span className="font-semibold text-primary cursor-pointer" onClick={() => router.push("/auth/login?redirect=/home/showcase")}>login</span> to leave a comment.
              </div>
            )}
            <Textarea
              placeholder={currentUser ? "Write a comment..." : "Login to write a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              disabled={!currentUser || isPending}
            />
            <Button
              onClick={handleSubmitComment}
              className="w-full"
              disabled={!newComment.trim() || !currentUser || isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Post Comment
            </Button>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : formattedComments.length > 0 ? (
                formattedComments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.authorAvatar || "/placeholder.svg"}
                        alt={comment.authorName}
                      />
                      <AvatarFallback>
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{comment.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
