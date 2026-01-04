"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, MessageSquare, TrendingUp } from "lucide-react"
import { useMentorDashboard, MentorSummary } from "@/api/mentor-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export function MentorStatsCard() {
  const { getSummary } = useMentorDashboard();
  const { data: summaryData, isLoading } = getSummary();
  const summary = (summaryData as any)?.data as MentorSummary | undefined;

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      label: "Active Mentees",
      value: summary?.activeMentees?.toString() || "0",
      icon: Users,
      change: "Current active",
    },
    {
      label: "Hours This Month",
      value: summary?.hoursThisMonth?.toString() || "0",
      icon: Clock,
      change: "Recorded sessions",
    },
    {
      label: "Pending Requests",
      value: summary?.pendingRequests?.toString() || "0",
      icon: MessageSquare,
      change: "Awaiting approval",
    },
    {
      label: "Total Students",
      value: summary?.totalStudents?.toString() || "0",
      icon: Users,
      change: "Lifetime impact",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
