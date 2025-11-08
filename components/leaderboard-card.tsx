"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import { useStudents } from "@/api/student";
import { Skeleton } from "@/components/ui/skeleton";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="text-sm font-semibold text-muted-foreground">
          #{rank}
        </span>
      );
  }
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
  const { getLeaderBoard } = useStudents();
  const { data, isPending } = getLeaderBoard();
  const leaderboardData = data?.items;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top performers in your cohort</CardDescription>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="space-y-4">
            {leaderboardData?.map((user) => (
              <div
                key={user?.rank}
                className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  {getRankIcon(user?.rank)}
                </div>

                <Avatar className="h-10 w-10">
                  <img
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>

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
