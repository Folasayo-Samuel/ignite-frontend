import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BecomeMentorForm } from "@/components/become-mentor-form"

export default function BecomeMentorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Become a Mentor</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Share your expertise and help shape the next generation of developers
            </p>
          </div>
          <BecomeMentorForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
