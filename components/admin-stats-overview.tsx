"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, FolderKanban, TrendingUp, UserCheck } from "lucide-react"
import { useAnalytics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCompactNumber } from "@/lib/utils"

export function AdminStatsOverview() {
  const { getMetrics } = useAnalytics()
  const { data: metricsData, isLoading } = getMetrics()

  const metrics = metricsData

  const stats = [
    {
      title: "Total Users",
      value: formatCompactNumber(metrics?.totalUsers || 0),
      change: metrics?.retentionRate ? `${metrics.retentionRate.toFixed(1)}% retention` : "N/A",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: formatCompactNumber(metrics?.activeUsers || 0),
      change: metrics?.totalUsers ? `${((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% of total` : "N/A",
      icon: UserCheck,
      color: "text-orange-600",
    },
    {
      title: "New Signups",
      value: formatCompactNumber(metrics?.newSignups || 0),
      change: metrics?.range ? `This ${metrics.range}` : "Recent",
      icon: FolderKanban,
      color: "text-green-600",
    },
    {
      title: "Retention Rate",
      value: metrics?.retentionRate ? `${metrics.retentionRate.toFixed(1)}%` : "0%",
      change: "Platform-wide",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stat.change}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
