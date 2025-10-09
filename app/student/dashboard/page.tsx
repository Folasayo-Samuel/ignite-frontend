import { Navigation } from "@/components/navigation"
import { StudentDashboardHeader } from "@/components/student-dashboard-header"
import { ProgressCard } from "@/components/progress-card"
import { LogActivityCard } from "@/components/log-activity-card"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { CohortFeedCard } from "@/components/cohort-feed-card"
import { SubmitProjectCard } from "@/components/submit-project-card"
import { AchievementsCard } from "@/components/achievements-card"
import { ResourceLibraryCard } from "@/components/resource-library-card"
import { MentorMatchingCard } from "@/components/mentor-matching-card"
import { DiscussionForumCard } from "@/components/discussion-forum-card"
import { AIRecommendationsCard } from "@/components/ai-recommendations-card"
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
            <AIRecommendationsCard />
            <CohortFeedCard />
            <DiscussionForumCard />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <SubmitProjectCard />
            <LeaderboardCard />
            <AchievementsCard />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <ResourceLibraryCard />
          <MentorMatchingCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
