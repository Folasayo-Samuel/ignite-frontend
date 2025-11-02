import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AchievementsCard } from "@/components/students/achievements-card"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Your Achievements</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Track your progress and unlock badges as you learn
            </p>
          </div>

          <AchievementsCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
