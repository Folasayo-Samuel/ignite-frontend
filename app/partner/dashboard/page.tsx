import { Navigation } from "@/components/navigation"
import { PartnerDashboardHeader } from "@/components/partner-dashboard-header"
import { PartnerStatsOverview } from "@/components/partner-stats-overview"
import { CohortManagementCard } from "@/components/cohort-management-card"
import { AnalyticsChartCard } from "@/components/analytics-chart-card"
import { SkillsTechStackCard } from "@/components/skills-tech-stack-card"
import { TopPerformersCard } from "@/components/top-performers-card"
import { Footer } from "@/components/footer"

export default function PartnerDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PartnerDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <PartnerStatsOverview />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <CohortManagementCard />
              <AnalyticsChartCard />
            </div>

            <div className="space-y-8">
              <TopPerformersCard />
              <SkillsTechStackCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
