"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Flame,
  Target,
  Trophy,
  Zap,
  Star,
  Rocket,
  Medal,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useStudents } from "@/api/student";
import { AchievementsCardSkeleton } from "./AchievementsCardSkeleton";

const achievementIcons: Record<string, any> = {
  first_day: Star,
  streak_7: Flame,
  streak_14: Rocket,
  streak_21: Target,
  day_15: Medal,
  day_30: Trophy,
  final_project_submitted: Award,
  speed_learner: Zap,
  community_star: Star,
};

export function AchievementsCard() {
  const { getStudentAchievement, getMyDetails, getMyCohort } = useStudents();
  const { data: userData } = getMyDetails();
  const { data: cohortData } = getMyCohort();
  const isEnrolled = cohortData?.cohortId && cohortData?.status !== "none";

  const { data, isPending } = getStudentAchievement(userData?._id as string);
  const achievements = data?.items;

  if (!isEnrolled) {
    return (
      <Card className="border-2 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Track your milestones</CardDescription>
            </div>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Achievements Locked</p>
            <p className="text-sm text-muted-foreground mt-1">Join a cohort to start earning badges and tracking your progress.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isPending) {
    return <AchievementsCardSkeleton />;
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              {data?.totalUnlocked} of {data?.totalAvailable} unlocked
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Trophy className="h-4 w-4 mr-1" />
            {data?.totalUnlocked}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 ">
          {achievements?.map((achievement) => {
            if (!achievement) return null;
            const Icon = achievementIcons[achievement?.key || ''] || Star;
            return (
              <div
                key={achievement?.key || Math.random().toString()}
                className={`p-4 rounded-lg border-2 transition-all ${achievement?.unlocked
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/50 border-border opacity-60"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${achievement?.unlocked ? "bg-primary/10" : "bg-muted"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${achievement?.unlocked
                        ? "text-primary"
                        : "text-muted-foreground"
                        }`}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {achievement?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement?.description}
                      </p>
                    </div>
                    {achievement && !achievement.unlocked && (
                      <div className="space-y-1">
                        <Progress
                          value={achievement?.progress}
                          className="h-1.5"
                        />
                        <p className="text-xs text-muted-foreground">
                          {achievement?.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
