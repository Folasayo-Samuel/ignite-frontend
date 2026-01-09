import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/api/analytics"
import { useAuthStore } from "@/store/authStore"

export function HeroSection() {
  const { getImpactStats } = useAnalytics();
  const { data: stats } = getImpactStats();
  const learnerCount = stats?.totalLearners || 0;
  const { currentUser } = useAuthStore()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 sm:mb-8 inline-flex cursor-pointer items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-500/20 ring-1 ring-orange-400/50 transition-all hover:scale-105 hover:shadow-orange-500/30">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse text-yellow-200" />
            <span className="tracking-wide">Join the 30-Day Learning Challenge</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Learn, Build, and Ignite Change
          </h1>

          <p className="mb-4 text-xl text-muted-foreground sm:text-2xl text-balance">30 Minutes at a Time</p>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Transform your skills through daily learning. Join {learnerCount > 0 ? `${learnerCount.toLocaleString()}+` : "a growing community of"} learners committing 30 minutes each day
            for 30 days to build real projects and showcase your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto rounded-full" asChild>
              <Link href={currentUser?.role === "student" ? "/learner/dashboard" : "#learner-signup"}>
                {currentUser?.role === "student" ? "Go to Dashboard" : "Join as Learner"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-accent text-accent hover:bg-primary hover:text-white hover:border-primary rounded-full transition-all duration-300"
              asChild
            >
              <Link href={currentUser?.role === "partner" ? "/partner/dashboard" : "/home/become-partner"}>
                {currentUser?.role === "partner" ? "Go to Dashboard" : "Partner with Us"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}
