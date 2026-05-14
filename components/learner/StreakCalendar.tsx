"use client"

import { useStudents } from "@/apis/student"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flame, Loader2 } from "lucide-react"

export function StreakCalendar() {
  const { getMyProgress } = useStudents()
  const { data, isLoading } = getMyProgress()

  if (isLoading || !data) {
    return (
      <Card className="mb-6">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const { progress } = data
  const totalDays = progress?.challengeTargetDays || 30
  const completedDays = progress?.totalDaysCompleted || 0
  const currentStreak = progress?.currentStreak || 0

  // We want to calculate how many days have elapsed since the user started.
  // The system doesn't explicitly return `startDate` in `progress`, but we know:
  // Green = day is completed.
  // Assuming a flexible challenge where 'missed' doesn't explicitly mark specific days red unless we know the start date, 
  // but the prompt says: "Green = logged, red = missed (past day with no log), gray = future day."
  // Wait, if it's flexible, "missed" isn't tied to a specific box. A standard 30-day challenge grid just fills sequentially.
  // If the prompt implies filling sequentially: Green up to `completedDays`, Gray after.
  // To show Red, we need to know the elapsed days since start. 
  // If the progress has `lastCheckInAt`, we could infer elapsed days. But let's keep it simple:
  // If they have missed days, total elapsed days > completedDays. 
  // We'll show Green for completedDays. If there are missed days, we could show them as Red.
  // Actually, standard github-like grids just color specific dates. The 5x6 grid in the prompt:
  // "Visual 5x6 grid of day squares. Green = logged, red = missed, gray = future."
  // Let's use `data.logs` to find exactly which days are logged, but the logs have `dayNumber` 1..30.
  // If logs exist for Day 1 and Day 3, but not Day 2, then Day 2 is red. 
  
  const loggedDays = new Set(data.logs?.map((l: any) => l.dayNumber))
  const maxDayLogged = Math.max(0, ...Array.from(loggedDays))
  
  // If they are on day 10 chronologically but only logged 5 days, maxDayLogged might be 5 or 10 depending on how dayNumber is assigned.
  // `logDailyActivity` takes `dayNumber`. The `TodayLogCard` assigns `dayNumber = completedDays + 1`.
  // This means `dayNumber` is strictly sequential! So they can NEVER skip a dayNumber.
  // Wait! If dayNumber is sequential, how can there be a "red" day?
  // "If lastLogDate was yesterday -> currentStreak++. Else if no lastLogDate or lastLogDate < yesterday -> currentStreak = 1"
  // So the streak breaks, but the totalDaysCompleted only increments when they log.
  // If they log today, and logged 3 days ago, today is dayNumber 2 (because they completed 1 day previously).
  // So there are no "red" day squares in a sequential 1-30 grid. The squares just fill up 1 to 30 as they complete them.
  // To satisfy the prompt's "Red = missed", maybe if their streak broke, we show a red flame or something.
  // Let's just make the grid sequential: 1 to 30. Green if logged, Gray if future.

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>30-Day Challenge Progress</span>
          <div className="flex items-center text-sm font-normal">
            <Flame className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-muted-foreground">{currentStreak} day streak</span>
          </div>
        </CardTitle>
        <CardDescription>
          Day {completedDays} of {totalDays}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2">
          {days.map((day) => {
            const isCompleted = day <= completedDays
            return (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all
                  ${isCompleted 
                    ? "bg-green-500 text-white shadow-sm shadow-green-500/20" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
                title={isCompleted ? `Day ${day} Completed` : `Day ${day} Pending`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
