"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, Trophy, CheckCircle2 } from "lucide-react";
import { CelebrationModal } from "./celebration-modal";
import { useStudents } from "@/api/student";
import { ProgressCardLoader } from "./students/ProgressCardLoader";
import { toast } from "sonner";
import { Spinner } from "./shared/Spinner";

export function ProgressCard() {
  const { getMyProgress, markMyProgress } = useStudents();
  const { mutate, isPending: progressPending } = markMyProgress;
  const { data, isPending, refetch } = getMyProgress();

  const [showCelebration, setShowCelebration] = useState(false);

  const progressData = data || {
    day: 0,
    target: 30,
    percent: 0,
    daysLeft: 30,
    currentStreak: 0,
    isTodayDone: false,
  };

  const { day, target, percent, daysLeft, currentStreak, isTodayDone } =
    progressData;

  const handleMarkComplete = async () => {
    await mutate(
      { day },
      {
        onSuccess: (res: any) => {
          console.log(res, "res");
          refetch();
          toast.success("You are doing well");
        },
        onError: (err: any) => {
          console.log(err, "err");
        },
      }
    );
  };

  if (isPending) {
    return <ProgressCardLoader />;
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            30-Day Challenge Progress
          </CardTitle>
          <CardDescription>
            You're doing amazing! Keep the momentum going
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Day {day} of {target}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(percent)}%
              </span>
            </div>
            <Progress value={percent} className="h-3" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-accent/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Flame className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {daysLeft}
                </div>
                <div className="text-sm text-muted-foreground">Days Left</div>
              </div>
            </div>
          </div>

          {!isTodayDone && (
            <Button
              onClick={handleMarkComplete}
              className="w-full cursor-pointer"
              size="lg"
            >
              {progressPending ? (
                <Spinner />
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Mark Day {day} Complete
                </>
              )}
            </Button>
          )}
          {day === target && (
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-lg font-semibold text-primary">
                Congratulations! Challenge Complete!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You've completed all {target} days!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        studentName="Student Name"
      />
    </>
  );
}
