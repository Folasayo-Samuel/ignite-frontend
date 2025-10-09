import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DiscussionForumCard } from "@/components/discussion-forum-card"

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Community Forum</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connect with peers, ask questions, and share knowledge
            </p>
          </div>

          <DiscussionForumCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
