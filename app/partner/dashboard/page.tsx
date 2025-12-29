"use client"

import { Navigation } from "@/components/navigation"
import { PartnerDashboardHeader } from "@/components/partner-dashboard-header"
import { PartnerStatsOverview } from "@/components/partner-stats-overview"
import { CohortManagementCard } from "@/components/cohort-management-card"
import { AnalyticsChartCard } from "@/components/analytics-chart-card"
import { SkillsTechStackCard } from "@/components/skills-tech-stack-card"
import { TopPerformersCard } from "@/components/top-performers-card"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationUserManagement } from "@/components/organization-user-management"
import { OrganizationSettings } from "@/components/organization-settings"
import { OrganizationSubscriptionManagement } from "@/components/payment/organization-subscription-management"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function PartnerDashboardPage() {
  const { user, isLoading } = useAuthContext();

  // Use organizationId from the authenticated user context
  // Fallback to empty string if not found, child components handle empty states
  const orgId = user?.organizationId || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PartnerDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <PartnerStatsOverview orgId={orgId} />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <CohortManagementCard orgId={orgId} />
                <AnalyticsChartCard />
              </div>

              <div className="space-y-8">
                <TopPerformersCard orgId={orgId} />
                <SkillsTechStackCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <OrganizationUserManagement orgId={orgId} />
          </TabsContent>

          <TabsContent value="subscription">
            <OrganizationSubscriptionManagement orgId={orgId} />
          </TabsContent>

          <TabsContent value="settings">
            <OrganizationSettings orgId={orgId} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
