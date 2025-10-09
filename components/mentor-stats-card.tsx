import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, MessageSquare, TrendingUp } from "lucide-react"

export function MentorStatsCard() {
  const stats = [
    {
      label: "Active Mentees",
      value: "12",
      icon: Users,
      change: "+2 this month",
    },
    {
      label: "Hours This Month",
      value: "24",
      icon: Clock,
      change: "+6 from last month",
    },
    {
      label: "Pending Requests",
      value: "5",
      icon: MessageSquare,
      change: "3 new today",
    },
    {
      label: "Success Rate",
      value: "94%",
      icon: TrendingUp,
      change: "+2% improvement",
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
