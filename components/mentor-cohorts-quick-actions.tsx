"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { useMentorCohorts } from "@/apis/mentor-cohorts"
import { Skeleton } from "@/components/ui/skeleton"

export function MentorCohortsQuickActions() {
  const { getCohorts } = useMentorCohorts()
  const { data: cohortsResponse, isLoading } = getCohorts({ limit: 3 })
  
  const cohortsData = (cohortsResponse as any)?.data || cohortsResponse
  const cohorts = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items || [])

  return (
    <Card className="col-span-1 lg:col-span-3 mt-6 border-orange-200 dark:border-orange-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Cohorts</CardTitle>
          <CardDescription>Manage your group learning programs</CardDescription>
        </div>
        <Button asChild size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
          <Link href="/mentor/cohorts/new">
            <Plus className="h-4 w-4 mr-2" /> New Cohort
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : cohorts.length === 0 ? (
          <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-medium">No active cohorts</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Scale your impact by mentoring multiple students at once.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/mentor/cohorts/new">Create Your First Cohort</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cohorts.map((cohort: any) => (
              <Link key={cohort.id || cohort._id} href={`/mentor/cohorts/${cohort.id || cohort._id}`}>
                <Card className="h-full hover:border-orange-500/50 transition-colors cursor-pointer bg-muted/20">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium line-clamp-1 group-hover:text-orange-600">{cohort.name}</h4>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {cohort.currentLearnerCount || 0} / {cohort.maxLearners || '∞'}
                      </span>
                      <span className="capitalize px-2 py-0.5 bg-background rounded-full text-xs border">
                        {cohort.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {cohorts.length >= 3 && (
              <Button asChild variant="ghost" className="w-full h-full min-h-[100px] border-dashed border-2">
                <Link href="/mentor/cohorts">View All Cohorts</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
