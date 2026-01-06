"use client"

import { useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MentorDashboardHeader } from "@/components/mentor-dashboard-header"
import { MentorSessionsCard } from "@/components/mentor-sessions-card"
import { MentorMenteesCard } from "@/components/mentor-mentees-card"
import { MentorStatsCard } from "@/components/mentor-stats-card"
import { MentorAvailabilityCard } from "@/components/mentor-availability-card"
import { MentorSessionRequestsCard } from "@/components/mentor-session-requests-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award } from "lucide-react"

import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { useMentors } from "@/api/mentors"

export default function MentorDashboardPage() {
  const { currentUser } = useAuthStore()
  const router = useRouter()
  const { getMyProfile } = useMentors()

  const { data: profileResult, isLoading, isError } = getMyProfile()

  // The API client automatically unwraps { success: true, data: ... } responses.
  // So profileResult is usually the Mentor object directly.
  // We handle both cases just to be safe.
  const profile = (profileResult as any)?.data || profileResult

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login")
    } else if (currentUser.role !== "mentor") {
      toast.error("Unauthorized access")
      router.push("/")
    }
  }, [currentUser, router])

  if (!currentUser) return null // Prevent flash of content

  if (isLoading) {
    return <LoadingScreen />
  }

  // If profile fetch failed or returned no data, show "Setup Profile" state
  const isProfileMissing = isError || !profile;

  if (isProfileMissing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl text-center p-8 border-dashed border-2">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Welcome to FolaIgnite!</h1>
              <p className="text-xl text-muted-foreground">
                We need a few more details to set up your mentor profile before you can access the dashboard.
              </p>
              <Link href="/home/become-mentor">
                <Button size="lg" className="w-full sm:w-auto">
                  Complete Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MentorDashboardHeader />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <MentorStatsCard />
            <MentorSessionRequestsCard />
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
