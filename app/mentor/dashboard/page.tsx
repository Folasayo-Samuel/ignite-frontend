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
import { RoleGuard } from "@/components/shared/RoleGuard"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { useMentors } from "@/api/mentors"
import { useRouter } from "next/navigation"
import { GrowthPartnerBanner } from "@/components/growth-partner/growth-partner-banner"
import { MentorCohortsQuickActions } from "@/components/mentor-cohorts-quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function MentorDashboardPage() {
  return (
    <RoleGuard allowedRoles={["mentor"]}>
      <MentorDashboardContent />
    </RoleGuard>
  )
}

function MentorDashboardContent() {
  const router = useRouter()
  const { getMyProfile } = useMentors()
  const { data: profileResult, isLoading } = getMyProfile()

  // Check if profile is incomplete (lazy created checks)
  const profileData = profileResult;

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

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MentorDashboardHeader />
        
        {(profileData.applicationStatus === "PENDING" || profileData.status === "pending") ? (
          <div className="mt-8 max-w-2xl mx-auto">
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-950/20">
              <CardHeader className="text-center pb-2">
                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-orange-700 dark:text-orange-400">Application Under Review</CardTitle>
                <CardDescription className="text-base">
                  Thank you for applying to be a mentor! Your profile is currently being reviewed by our team.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-4">
                <p className="text-muted-foreground">
                  We review all mentor applications to ensure the highest quality experience for our learners. 
                  This process typically takes 24-48 hours. We will notify you via email once your application has been approved.
                </p>
                <div className="flex flex-col gap-2 mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Profile Completed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 justify-center font-medium">
                    <Clock className="h-4 w-4" /> Awaiting Admin Approval
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : profileData.applicationStatus === "REJECTED" ? (
          <div className="mt-8 max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
              <CardHeader className="text-center pb-2">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-red-700 dark:text-red-400">Application Status Update</CardTitle>
                <CardDescription className="text-base">
                  Unfortunately, we are unable to approve your mentor application at this time.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-4">
                <p className="text-muted-foreground">
                  We appreciate your interest in mentoring on FolaIgnite. If you believe this was an error or would like to re-apply in the future, please contact our support team.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <GrowthPartnerBanner />
            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              <MentorCohortsQuickActions />
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
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
