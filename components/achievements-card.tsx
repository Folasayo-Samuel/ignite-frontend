"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Flame, Target, Trophy, Zap, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const achievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first day",
    icon: Star,
    unlocked: true,
    progress: 100,
  },
  {
    id: "2",
    name: "Week Warrior",
    description: "Complete 7 consecutive days",
    icon: Flame,
    unlocked: true,
    progress: 100,
  },
  {
    id: "3",
    name: "Halfway Hero",
    description: "Reach day 15",
    icon: Target,
    unlocked: true,
    progress: 100,
  },
  {
    id: "4",
    name: "Speed Learner",
    description: "Log 60 minutes in a single day",
    icon: Zap,
    unlocked: false,
    progress: 50,
  },
  {
    id: "5",
    name: "Champion",
    description: "Complete all 30 days",
    icon: Trophy,
    unlocked: false,
    progress: 60,
  },
  {
    id: "6",
    name: "Community Star",
    description: "Get 50 likes on your projects",
    icon: Award,
    unlocked: false,
    progress: 30,
  },
]

export function AchievementsCard() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              {unlockedCount} of {achievements.length} unlocked
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Trophy className="h-4 w-4 mr-1" />
            {unlockedCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                    <Icon className={`h-5 w-5 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <Progress value={achievement.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">{achievement.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
