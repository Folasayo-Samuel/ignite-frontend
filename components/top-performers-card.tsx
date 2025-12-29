"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, ExternalLink } from "lucide-react"
import { useStudents } from "@/api/student"
import { useOrganizations, Cohort } from "@/api/organizations"
import { Skeleton } from "@/components/ui/skeleton"

interface TopPerformersCardProps {
  orgId?: string;
}

export function TopPerformersCard({ orgId }: TopPerformersCardProps) {
  const { getLeaderBoard } = useStudents();
  const { getCohorts } = useOrganizations();

  // Fetch data
  const { data: leaderboardData, isLoading: loadingLeaderboard } = getLeaderBoard();
  const { data: cohortsData, isLoading: loadingCohorts } = getCohorts(orgId || "");

  const leaderboardItems = (leaderboardData as any)?.data?.items || []; // Adjust based on actual response structure
  const cohorts = (cohortsData as any)?.data as Cohort[] || [];
  const cohortIds = new Set(cohorts.map(c => c._id));

  // Filter performers derived from my cohorts (if orgId provided)
  // If no org (e.g. loading or not passed), show all (or none, depending on policy)
  const topPerformers = orgId
    ? leaderboardItems.filter((item: any) => cohortIds.has(item.cohortId))
    : leaderboardItems;

  const displayPerformers = topPerformers.slice(0, 5); // Start with top 5

  if (loadingLeaderboard || loadingCohorts) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Top Performers
        </CardTitle>
        <CardDescription>Outstanding learners from your cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPerformers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No data available yet.</p>
          ) : (
            displayPerformers.map((performer: any, index: number) => (
              <div key={performer.email || index} className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
                  <AvatarFallback>
                    {performer.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-foreground">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cohorts.find(c => c._id === performer.cohortId)?.name || "Unknown Cohort"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* Mock skills for now as leaderboard doesn't have it explicitly */}
                    {["React", "TypeScript"].map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {performer.projects || 0} projects • {performer.currentStreak || 0} day streak • {performer.points || 0} pts
                  </p>
                </div>
              </div>
            )))}
        </div>
      </CardContent>
    </Card>
  )
}
