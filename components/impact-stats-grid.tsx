import { Card, CardContent } from "@/components/ui/card"
import { Users, FolderKanban, Globe, Building2, GraduationCap, Briefcase } from "lucide-react"

interface ImpactStatsGridProps {
  activeView?: "students" | "partners"
}

const studentStats = [
  {
    icon: Users,
    value: "5,247",
    label: "Active Learners",
    change: "+12% this month",
    color: "text-primary",
  },
  {
    icon: FolderKanban,
    value: "12,483",
    label: "Projects Completed",
    change: "+8% this month",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    value: "4,892",
    label: "Challenges Completed",
    change: "+15% this month",
    color: "text-primary",
  },
  {
    icon: Globe,
    value: "15",
    label: "Countries Reached",
    change: "+2 new countries",
    color: "text-accent",
  },
]

const partnerStats = [
  {
    icon: Building2,
    value: "52",
    label: "Partner Organizations",
    change: "+5 this quarter",
    color: "text-primary",
  },
  {
    icon: Briefcase,
    value: "1,234",
    label: "Hiring Connections",
    change: "+18% this quarter",
    color: "text-accent",
  },
  {
    icon: Users,
    value: "38",
    label: "Sponsored Cohorts",
    change: "+6 this quarter",
    color: "text-primary",
  },
  {
    icon: Globe,
    value: "12",
    label: "Partner Countries",
    change: "+3 new markets",
    color: "text-accent",
  },
]

export function ImpactStatsGrid({ activeView = "students" }: ImpactStatsGridProps) {
  const stats = activeView === "students" ? studentStats : partnerStats

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
