"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MentorMatchingCard } from "@/components/mentor-matching-card"
import { MembershipGuard } from "@/components/shared/MembershipGuard"

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MembershipGuard>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-balance">Find Your Mentor</h1>
              <p className="text-xl text-muted-foreground text-balance">
                Get personalized guidance from experienced industry experts
              </p>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/learner/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            <MentorMatchingCard />
          </div>
        </MembershipGuard>
      </main>

      <Footer />
    </div>
  )
}
