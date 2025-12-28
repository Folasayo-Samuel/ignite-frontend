import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MentorMatchingCard } from "@/components/mentor-matching-card"

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Find Your Mentor</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Get personalized guidance from experienced industry experts
            </p>
          </div>

          <MentorMatchingCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
