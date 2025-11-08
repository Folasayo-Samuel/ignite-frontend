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
import { MessageCircle, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

interface CommentDialogProps {
  projectTitle: string;
  commentCount: number;
  onCommentAdded: () => void;
  open: boolean;
  onOpenChange: any;
  postId: string;
}

export function CommentDialog({
  projectTitle,
  commentCount,
  onCommentAdded,
  open,
  onOpenChange,
  postId,
}: CommentDialogProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      authorAvatar: "/placeholder.svg",
      content: "This is amazing! Love the design and functionality.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      author: "Michael Chen",
      authorAvatar: "/placeholder.svg",
      content: "Great work! How did you implement the authentication?",
      timestamp: "5 hours ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        authorAvatar: "/placeholder.svg",
        content: newComment,
        timestamp: "Just now",
      };
      setComments([comment, ...comments]);
      setNewComment("");
      onCommentAdded();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{commentCount + comments.length - 2}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>{projectTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleSubmitComment}
              className="w-full"
              disabled={!newComment.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.authorAvatar || "/placeholder.svg"}
                      alt={comment.author}
                    />
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.timestamp}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
