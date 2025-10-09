import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Users, Calendar } from "lucide-react"

const cohorts = [
  {
    name: "Web Development Bootcamp Q1 2025",
    learners: 85,
    startDate: "Jan 15, 2025",
    endDate: "Feb 14, 2025",
    progress: 60,
    status: "active",
  },
  {
    name: "Mobile App Development Track",
    learners: 62,
    startDate: "Jan 20, 2025",
    endDate: "Feb 19, 2025",
    progress: 50,
    status: "active",
  },
  {
    name: "Data Science Fundamentals",
    learners: 48,
    startDate: "Jan 10, 2025",
    endDate: "Feb 9, 2025",
    progress: 75,
    status: "active",
  },
  {
    name: "UI/UX Design Sprint",
    learners: 73,
    startDate: "Dec 15, 2024",
    endDate: "Jan 14, 2025",
    progress: 95,
    status: "ending",
  },
]

export function CohortManagementCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cohort Management</CardTitle>
            <CardDescription>Manage your sponsored learning cohorts</CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Cohort
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cohorts.map((cohort, index) => (
            <div key={index} className="space-y-3 pb-6 last:pb-0 border-b last:border-0 border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{cohort.name}</h4>
                    <Badge variant={cohort.status === "active" ? "default" : "secondary"}>
                      {cohort.status === "active" ? "Active" : "Ending Soon"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cohort.learners} learners
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {cohort.startDate} - {cohort.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{cohort.progress}%</span>
                </div>
                <Progress value={cohort.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
