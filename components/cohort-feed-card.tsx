"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CommentDialog } from "@/components/comment-dialog";
import { toast } from "sonner";
import { useStudents } from "@/api/student";
import { Skeleton } from "@/components/ui/skeleton";

export function CohortFeedCard() {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const { getCohortFeed, getMyCohort } = useStudents();
  const { data, isPending } = getCohortFeed();
  const { data: cohort, isLoading: loadingCohort } = getMyCohort();
  const cohortFeed = (data as any)?.data?.items || (data as any)?.items || [];

  const isEnrolled = cohort?.cohortId && cohort?.status !== "none";

  const handleLike = (id: string) => {
    // This previously updated local state that wasn't used for rendering.
    // In a real implementation join this with a mutation to the backend.
    toast.info("Liking peer activities will be available soon!");
  };

  const handleComment = (id: string) => {
    setSelectedPost(id);
    setCommentDialogOpen(true);
  };

  if (loadingCohort) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isEnrolled) {
    return (
      <Card className="border-2 border-dashed bg-muted/30">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Cohort Feed Locked</CardTitle>
          <CardDescription>
            Join a cohort to see what your peers are working on and share your progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <Button asChild>
            <Link href="/learner/dashboard">Find and Join a Cohort</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Cohort Feed</CardTitle>
        <CardDescription>See what your peers are working on</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {isPending ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cohortFeed.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No updates yet from your cohort.
            </p>
            <p className="text-xs text-muted-foreground">
              Be the first to share what you’re working on.
            </p>
          </div>
        ) : (
          // Feed Data
          <div className="space-y-6">
            {cohortFeed.map((item: any, index: number) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage
                      src={item.avatar || "/placeholder.svg"}
                      alt={item.user}
                    />
                    <AvatarFallback>
                      {item.user
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{item.user}</p>
                      <span className="text-sm text-muted-foreground">
                        • {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${item.isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                    />
                    <span className="text-sm">{item.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => handleComment(item.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{item.comments}</span>
                  </Button>
                </div>

                {index < cohortFeed.length - 1 && (
                  <div className="border-t border-border" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        postId={selectedPost || ""}
        onCommentAdded={() => { }}
      />
    </Card>
  );
}
