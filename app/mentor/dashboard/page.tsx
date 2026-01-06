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



  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login")
    } else if (currentUser.role !== "mentor") {
      toast.error("Unauthorized access")
      router.push("/")
    }
  }, [currentUser, router])

  // Check if profile is incomplete (lazy created checks)
  const profileData = (profileResult as any)?.data || profileResult;

  const hasTitle = profileData?.title && String(profileData.title).trim().length > 0;
  const hasCompany = profileData?.company && String(profileData.company).trim().length > 0;
  const hasExpertise = Array.isArray(profileData?.expertise) && profileData.expertise.length > 0;

  const isProfileIncomplete = !isLoading && profileData && (!hasTitle || !hasCompany || !hasExpertise);

  useEffect(() => {
    if (isProfileIncomplete) {
      router.replace("/home/become-mentor");
    }
  }, [isProfileIncomplete, router]);

  if (isLoading || isProfileIncomplete) {
    return <LoadingScreen />
  }

  if (!currentUser) return null; // Prevent flash of content
  // Legacy fallback
  if (!profileData) return null;

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
