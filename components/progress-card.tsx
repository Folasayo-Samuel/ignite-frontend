"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Flame, Calendar, Trophy, CheckCircle2 } from "lucide-react"
import { CelebrationModal } from "./celebration-modal"

export function ProgressCard() {
  const [currentDay, setCurrentDay] = useState(18)
  const [showCelebration, setShowCelebration] = useState(false)
  const totalDays = 30
  const streak = currentDay
  const progress = (currentDay / totalDays) * 100

  const handleMarkComplete = () => {
    if (currentDay < totalDays) {
      setCurrentDay(currentDay + 1)
      if (currentDay + 1 === totalDays) {
        setShowCelebration(true)
      }
    }
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            30-Day Challenge Progress
          </CardTitle>
          <CardDescription>You're doing amazing! Keep the momentum going</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Day {currentDay} of {totalDays}
              </span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-accent/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Flame className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalDays - currentDay}</div>
                <div className="text-sm text-muted-foreground">Days Left</div>
              </div>
            </div>
          </div>

          {currentDay < totalDays && (
            <Button onClick={handleMarkComplete} className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Mark Day {currentDay} Complete
            </Button>
          )}

          {currentDay === totalDays && (
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-lg font-semibold text-primary">Congratulations! Challenge Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">You've completed all 30 days!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CelebrationModal isOpen={showCelebration} onClose={() => setShowCelebration(false)} studentName="Student Name" />
    </>
  )
}
