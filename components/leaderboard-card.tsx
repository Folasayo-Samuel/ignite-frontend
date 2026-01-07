"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, MinusCircle } from "lucide-react";
import { useStudents } from "@/api/student";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getUserInitials } from "@/utils/getUserInitials";

const getPerformanceIcon = (streak: number, projects: number) => {
  if (streak === 0 && projects === 0)
    return <MinusCircle className="h-5 w-5 text-muted-foreground" />;

  if (streak >= 10 && projects >= 5)
    return <Trophy className="h-5 w-5 text-yellow-500" />;

  if (streak >= 5 && projects >= 3)
    return <Medal className="h-5 w-5 text-gray-400" />;

  if (streak >= 1 && projects >= 1)
    return <Award className="h-5 w-5 text-amber-600" />;

  // same icon for users with same mid-level scores
  return <Star className="h-5 w-5 text-blue-500" />;
};

const LeaderboardSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
      >
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export function LeaderboardCard() {
  const { getLeaderBoard, getMyCohort } = useStudents();
  const { data: cohortData } = getMyCohort();
  const cohortId = cohortData?.cohortId;

  const { data, isPending } = getLeaderBoard(cohortId, undefined, {
    refetchInterval: 30000,
  });

  // Safely extract leaderboard items from potentially nested response
  const rawData = (data as any)?.data || data;
  const leaderboardData = rawData?.items || [];

  const hasValidCohort = cohortId && cohortData?.status !== "none";

  return (
    <Card className="border-2 h-full">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top performers in your cohort</CardDescription>
      </CardHeader>

      <CardContent>
        {!hasValidCohort ? (
          <div className="text-center py-6 text-muted-foreground space-y-2">
            <Trophy className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="font-medium">No active cohort</p>
            <p className="text-sm">Join a cohort to compete on the leaderboard</p>
          </div>
        ) : isPending ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="space-y-4">
            {leaderboardData?.map((user: any) => (
              <div
                key={user?.name}
                className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  {getPerformanceIcon(user?.currentStreak, user?.projects)}
                </div>

                {user?.avatar ? (
                  <Avatar className="h-10 w-10">
                    <Image
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-full h-full object-cover rounded-full"
                      width={40}
                      height={40}
                    />
                  </Avatar>
                ) : (
                  <div className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full text-base font-semibold">
                    {getUserInitials(user?.name)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.currentStreak} day streak • {user?.projects} projects
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
