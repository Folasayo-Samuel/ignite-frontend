"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudents } from "@/api/student";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface ActivityCommentDialogProps {
    activityId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCommentAdded: () => void;
}

export function ActivityCommentDialog({
    activityId,
    open,
    onOpenChange,
    onCommentAdded,
}: ActivityCommentDialogProps) {
    const { currentUser } = useAuthStore();
    const { getActivityComments, addActivityComment } = useStudents();

    const { data: commentsData, isLoading, refetch } = getActivityComments(activityId, { enabled: open && !!activityId });
    const { mutateAsync: performAddComment, isPending } = addActivityComment;

    const [newComment, setNewComment] = useState("");

    const comments = (commentsData as any)?.data?.items || (commentsData as any)?.items || [];

    const handleSubmitComment = async () => {
        if (!currentUser) {
            toast.error("Please log in to comment");
            return;
        }

        if (newComment.trim() && activityId) {
            try {
                await performAddComment({ activityId, content: newComment });
                setNewComment("");
                refetch(); // Refresh comments list
                onCommentAdded(); // Notify parent to update count
                toast.success("Comment added!");
            } catch (error) {
                console.error("Failed to add comment:", error);
                toast.error("Failed to add comment");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                    <DialogDescription>Activity comments</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
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
                            ) : comments.length > 0 ? (
                                comments.map((comment: any) => (
                                    <div key={comment._id || comment.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={comment.author?.avatar || comment.authorAvatar || "/placeholder.svg"}
                                                alt={comment.author?.name || comment.authorName || "User"}
                                            />
                                            <AvatarFallback>
                                                {(comment.author?.name || comment.authorName || "U")
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{comment.author?.name || comment.authorName || "User"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
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
