"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FolderKanban, TrendingUp, Award } from "lucide-react"
import { useOrganizations } from "@/api/organizations"
import { useAnalytics, type OrgDashboardMetrics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

interface PartnerStatsOverviewProps {
  orgId?: string;
}

export function PartnerStatsOverview({ orgId }: PartnerStatsOverviewProps) {
  const { getCohorts } = useOrganizations()
  const { getOrgDashboard } = useAnalytics()

  // Fetch org-specific analytics if orgId is provided
  const { data: analyticsResult, isLoading: analyticsLoading } = orgId ? getOrgDashboard(orgId) : { data: null, isLoading: false }
  const { data: cohortsResult, isLoading: cohortsLoading } = getCohorts(orgId || "")

  const analytics = analyticsResult?.data as OrgDashboardMetrics | null
  const cohorts = (cohortsResult as any)?.data || []

  const isLoading = analyticsLoading || cohortsLoading

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  // Use analytics data if available, otherwise calculate from cohorts
  const totalLearners = analytics?.totalLearners || cohorts.reduce((acc: number, curr: any) => acc + (curr.learnersCount || curr.enrolledCount || 0), 0)
  const activeLearners = analytics?.activeLearners || Math.floor(totalLearners * 0.7)
  const totalCohorts = analytics?.totalCohorts || cohorts.length
  const completionRate = analytics?.completionRate || (totalCohorts > 0 ? Math.round((cohorts.filter((c: any) => c.status === 'completed').length / totalCohorts) * 100) : 0)
  const averageProgress = analytics?.averageProgress || 0

  const activeCohorts = cohorts.filter((c: any) => c.status === 'active' || new Date(c.endDate) > new Date()).length

  const stats = [
    {
      icon: Users,
      label: "Total Learners",
      value: totalLearners.toLocaleString(),
      change: `${activeLearners.toLocaleString()} active`,
      trend: "up",
    },
    {
      icon: FolderKanban,
      label: "Total Cohorts",
      value: totalCohorts.toString(),
      change: `${activeCohorts} active`,
      trend: "up",
    },
    {
      icon: TrendingUp,
      label: "Completion Rate",
      value: `${completionRate}%`,
      change: averageProgress > 0 ? `${averageProgress.toFixed(0)}% avg progress` : "Overall",
      trend: completionRate >= 70 ? "up" : "neutral",
    },
    {
      icon: Award,
      label: "Active Cohorts",
      value: activeCohorts.toString(),
      change: `of ${totalCohorts} total`,
      trend: "neutral",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              {stat.trend === "up" && (
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
