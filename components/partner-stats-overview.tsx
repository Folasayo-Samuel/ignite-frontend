import { Card, CardContent } from "@/components/ui/card"
import { Users, FolderKanban, TrendingUp, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    label: "Total Learners",
    value: "342",
    change: "+18 this month",
    trend: "up",
  },
  {
    icon: FolderKanban,
    label: "Projects Submitted",
    value: "789",
    change: "+45 this month",
    trend: "up",
  },
  {
    icon: TrendingUp,
    label: "Completion Rate",
    value: "87%",
    change: "+3% from last month",
    trend: "up",
  },
  {
    icon: Award,
    label: "Active Cohorts",
    value: "5",
    change: "2 ending soon",
    trend: "neutral",
  },
]

export function PartnerStatsOverview() {
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
