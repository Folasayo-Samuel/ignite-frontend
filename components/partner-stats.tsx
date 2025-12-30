"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAnalytics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

export function PartnerStats() {
  const { getImpactStats } = useAnalytics()
  const { data: statsResponse, isLoading } = getImpactStats()

  // Build stats from real metrics
  const stats = [
    {
      value: statsResponse?.totalLearners ? `${statsResponse.totalLearners.toLocaleString()}` : "0",
      label: "Active Learners",
      description: "Across African countries",
    },
    {
      value: statsResponse?.projectsCompleted ? `${statsResponse.projectsCompleted.toLocaleString()}` : "0",
      label: "Projects Completed",
      description: "Real-world applications built",
    },
    {
      value: statsResponse?.completionRate ? `${statsResponse.completionRate}%` : "0%",
      label: "Completion Rate",
      description: "Learners finish the challenge",
    },
  ]

  // Only show partner count if it's greater than 0
  if (statsResponse?.partnerOrganizations && statsResponse.partnerOrganizations > 0) {
    stats.push({
      value: `${statsResponse.partnerOrganizations}`,
      label: "Partner Organizations",
      description: "Tech schools and companies",
    })
  }

  if (isLoading) {
    return (
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Our Impact in Numbers</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join a thriving ecosystem of learners and partners making a difference
          </p>
        </div>

        <div className={`grid gap-8 sm:grid-cols-2 ${stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}>
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
