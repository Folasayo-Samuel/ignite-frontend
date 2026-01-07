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
import { ActivityCommentDialog } from "@/components/activity-comment-dialog";
import { toast } from "sonner";
import { useStudents } from "@/api/student";
import { Skeleton } from "@/components/ui/skeleton";

export function CohortFeedCard() {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, { likedByMe: boolean; likesCount: number }>>({});

  const { getCohortFeed, getMyCohort, likeActivity, unlikeActivity } = useStudents();
  const { data, isPending, refetch } = getCohortFeed();
  const { data: cohort, isLoading: loadingCohort } = getMyCohort();
  const { mutate: doLike, isPending: isLiking } = likeActivity;
  const { mutate: doUnlike, isPending: isUnliking } = unlikeActivity;

  const cohortFeed = (data as any)?.data?.items || (data as any)?.items || [];

  const isEnrolled = cohort?.cohortId && cohort?.status !== "none";

  const handleLike = (activityId: string, currentlyLiked: boolean, currentLikesCount: number) => {
    if (isLiking || isUnliking) return;

    // Optimistic update - immediately update UI
    setOptimisticLikes(prev => ({
      ...prev,
      [activityId]: {
        likedByMe: !currentlyLiked,
        likesCount: currentlyLiked ? currentLikesCount - 1 : currentLikesCount + 1
      }
    }));

    const clearOptimistic = () => setOptimisticLikes(prev => {
      const newState = { ...prev };
      delete newState[activityId];
      return newState;
    });

    if (currentlyLiked) {
      doUnlike({ activityId }, {
        onSuccess: () => { clearOptimistic(); refetch(); },
        onError: () => { clearOptimistic(); toast.error("Failed to unlike"); },
      });
    } else {
      doLike({ activityId }, {
        onSuccess: () => { clearOptimistic(); refetch(); },
        onError: () => { clearOptimistic(); toast.error("Failed to like"); },
      });
    }
  };

  // Helper to get like state with optimistic updates applied
  const getLikeState = (item: any) => {
    const id = item.id || item._id;
    if (optimisticLikes[id]) return optimisticLikes[id];
    return { likedByMe: !!item.likedByMe, likesCount: item.likesCount || 0 };
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
            {cohortFeed.map((item: any, index: number) => {
              const userName = item.student?.name || "Anonymous";
              const userAvatar = item.student?.avatar || "/placeholder.svg";
              const userInitials = userName.split(" ").map((n: string) => n[0]).join("");
              const timeAgo = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "";

              return (
                <div key={item.id || item._id || index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={userAvatar}
                        alt={userName}
                      />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{userName}</p>
                        <span className="text-sm text-muted-foreground">
                          • {timeAgo}
                        </span>
                      </div>
                      <p className="mt-1 text-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-12">
                    {(() => {
                      const likeState = getLikeState(item);
                      return (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2"
                          onClick={() => handleLike(item.id || item._id, likeState.likedByMe, likeState.likesCount)}
                          disabled={isLiking || isUnliking}
                        >
                          <Heart
                            className={`h-4 w-4 ${likeState.likedByMe ? "fill-red-500 text-red-500" : ""}`}
                          />
                          <span className="text-sm">{likeState.likesCount}</span>
                        </Button>
                      );
                    })()}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2"
                      onClick={() => handleComment(item.id || item._id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{item.commentsCount || 0}</span>
                    </Button>
                  </div>

                  {index < cohortFeed.length - 1 && (
                    <div className="border-t border-border" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <ActivityCommentDialog
        activityId={selectedPost || ""}
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onCommentAdded={() => refetch()}
      />
    </Card>
  );
}
