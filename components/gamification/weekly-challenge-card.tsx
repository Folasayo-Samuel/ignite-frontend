"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/api/gamification";
import { Target, Clock, Trophy, CheckCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function WeeklyChallengeCard() {
  const { getStats } = useGamification();
  const { data, isLoading } = getStats();
  const challenge = data?.data?.weeklyChallenge;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="py-8 text-center">
          <Target className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No active challenge this week</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon!</p>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = challenge.isCompleted;
  const progressPercent = Math.min(100, challenge.progressPercent);

  return (
    <Card
      className={cn(
        "border-2 overflow-hidden",
        isCompleted
          ? "border-green-500/30 bg-green-500/5"
          : "border-amber-500/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target
              className={cn(
                "h-5 w-5",
                isCompleted ? "text-green-500" : "text-amber-500"
              )}
            />
            Weekly Challenge
          </CardTitle>
          <Badge
            variant={isCompleted ? "default" : "secondary"}
            className={cn(
              "flex items-center gap-1",
              isCompleted && "bg-green-500"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Completed!
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                {challenge.timeRemaining}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {challenge.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {challenge.userProgress}/{challenge.targetCount}
              </span>
            </div>
            <Progress
              value={progressPercent}
              className={cn(
                "h-3",
                isCompleted && "[&>div]:bg-green-500"
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Trophy
                className={cn(
                  "h-4 w-4",
                  isCompleted ? "text-green-500" : "text-amber-500"
                )}
              />
              <span className="font-medium">+{challenge.xpReward} XP</span>
              {challenge.badgeReward && (
                <Badge variant="outline" className="text-xs">
                  + Badge
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Competing with cohort
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
