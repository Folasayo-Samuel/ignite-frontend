import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

export function ImpactTimeline() {
  const { getMilestones } = useAnalytics()
  const { data: milestonesResponse, isLoading } = getMilestones()
  const milestones = Array.isArray(milestonesResponse) ? milestonesResponse : []

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="pl-8">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-10 w-full" />
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
        <CardTitle>Growth Timeline</CardTitle>
        <CardDescription>Key milestones in our journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone._id} className="relative pl-8 pb-6 last:pb-0">
              {/* Timeline line */}
              {index < milestones.length - 1 && <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-border" />}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-primary border-4 border-background" />

              <div>
                <p className="text-sm font-medium text-accent mb-1">{milestone.date}</p>
                <p className="font-semibold text-foreground mb-1">{milestone.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
