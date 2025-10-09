"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, FolderKanban, TrendingUp } from "lucide-react"

export function AdminStatsOverview() {
  const stats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Partners",
      value: "34",
      change: "+8.2%",
      icon: Briefcase,
      color: "text-orange-600",
    },
    {
      title: "Total Projects",
      value: "1,923",
      change: "+23.1%",
      icon: FolderKanban,
      color: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+5.3%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

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
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
