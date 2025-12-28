"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MentorDashboardHeader } from "@/components/mentor-dashboard-header"
import { MentorSessionsCard } from "@/components/mentor-sessions-card"
import { MentorMenteesCard } from "@/components/mentor-mentees-card"
import { MentorStatsCard } from "@/components/mentor-stats-card"
import { MentorAvailabilityCard } from "@/components/mentor-availability-card"

import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function MentorDashboardPage() {
  const { currentUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login")
    } else if (currentUser.role !== "mentor") {
      toast.error("Unauthorized access")
      router.push("/")
    }
  }, [currentUser, router])

  if (!currentUser) return null // Prevent flash of content

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MentorDashboardHeader />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <MentorStatsCard />
            <MentorSessionsCard />
            <MentorMenteesCard />
          </div>

          <div className="space-y-6">
            <MentorAvailabilityCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
