import { Navigation } from "@/components/navigation"
import { StudentDashboardHeader } from "@/components/student-dashboard-header"
import { ProgressCard } from "@/components/progress-card"
import { LogActivityCard } from "@/components/log-activity-card"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { CohortFeedCard } from "@/components/cohort-feed-card"
import { SubmitProjectCard } from "@/components/submit-project-card"
import { Footer } from "@/components/footer"

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <StudentDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ProgressCard />
            <LogActivityCard />
            <CohortFeedCard />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <SubmitProjectCard />
            <LeaderboardCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
