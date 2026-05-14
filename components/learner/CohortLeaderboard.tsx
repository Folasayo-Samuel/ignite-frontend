"use client"

import { useStudents } from "@/apis/student"
import { useUser } from "@/apis/user"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flame, Trophy, Loader2 } from "lucide-react"

export function CohortLeaderboard() {
  const { getLeaderBoard, getMyCohort } = useStudents()
  const { getCurrentUser } = useUser()
  
  const { data: userResp } = getCurrentUser()
  const { data: cohortResp } = getMyCohort()
  
  const currentUser = userResp?.data
  const cohortId = cohortResp?.cohortId

  const { data: leaderboardData, isLoading } = getLeaderBoard(cohortId, "streak", {
    enabled: !!cohortId
  })

  if (!cohortId) return null // Hide if not in cohort

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  // Get top 5
  const topLearners = leaderboardData?.items?.slice(0, 5) || []

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Cohort Leaderboard
        </CardTitle>
        <CardDescription>Top learners by streak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLearners.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No learners on the leaderboard yet. Be the first!
            </div>
          ) : (
            topLearners.map((learner, index) => {
              const isMe = learner.email === currentUser?.email
              
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-2 rounded-lg ${isMe ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-bold text-muted-foreground text-sm">
                      #{index + 1}
                    </div>
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={learner.avatar} />
                      <AvatarFallback>{learner.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {isMe ? "You" : learner.name}
                      </span>
                      {isMe && <span className="text-[10px] text-orange-600 mt-1">Current Position</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-orange-100/50 dark:bg-orange-950/30 px-2 py-1 rounded-full">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                      {learner.currentStreak}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
