"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useApiQuery } from "@/hooks/useApiQuery"
import { useAuthStore } from "@/store/authStore"
import { useEnrollments } from "@/apis/enrollments"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Briefcase, ChevronRight, CheckCircle2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { SafeHTML } from "@/components/ui/safe-html"

export default function CohortDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const user = useAuthStore((s) => s.currentUser)
  const { initiateEnrollment } = useEnrollments()

  // Fetch all public cohorts to find the one matching the slug
  const { data: cohortsResponse, isLoading: isLoadingCohorts } = useApiQuery(["public-cohorts"], {
    url: "/cohorts/public?status=published,active",
    method: "GET"
  })

  // We could also try to fetch by ID directly if we knew it was an ID, but it's a code
  const cohortsData = (cohortsResponse as any)?.data || cohortsResponse
  const cohorts = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items || [])
  const cohort = cohorts.find((c: any) => c.code === slug || c._id === slug)

  // Check enrollment state if user is logged in
  const { data: myEnrollmentsResp } = useApiQuery(["my-enrollments"], {
    url: "/students/me",
    method: "GET"
  }, { enabled: !!user })

  const isEnrolled = !!(myEnrollmentsResp as any)?.cohorts?.some((c: any) => c.cohortId === cohort?._id)

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/auth/signup?redirect=/cohorts/${slug}`)
      return
    }

    try {
      const res = await initiateEnrollment.mutateAsync({ cohortId: cohort._id })
      if (res.authorizationUrl) {
        window.location.href = res.authorizationUrl
      } else {
        // Fallback for free cohorts
        router.push(`/dashboard?enrolled=true`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate enrollment")
    }
  }

  if (isLoadingCohorts) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-12" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Cohort Not Found</h1>
          <p className="text-muted-foreground mb-8">The cohort you are looking for does not exist or is no longer available.</p>
          <Button asChild>
            <Link href="/cohorts">Browse All Cohorts</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const isMentorLed = cohort.type === 'mentor_led'
  const platformFee = 500000 // 5000 NGN
  const mentorFee = cohort.mentorFeeKobo || 0
  const totalPriceKobo = platformFee + mentorFee
  const startDateStr = cohort.startDate ? format(new Date(cohort.startDate), 'MMMM d, yyyy') : 'To be announced'
  const spotsLeft = cohort.maxLearners - (cohort.currentLearnerCount || 0)
  const isFull = spotsLeft <= 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground">
          <Link href="/cohorts" className="hover:text-foreground transition-colors">Cohorts</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium truncate">{cohort.name}</span>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Area */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="capitalize text-xs font-semibold">
                  {cohort.techTrack.replace('-', ' ')}
                </Badge>
                {isMentorLed && (
                  <Badge variant="outline" className="border-orange-200 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20">
                    Mentor-Led
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {cohort.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {cohort.description}
              </p>
            </div>

            {/* Curriculum / Outline */}
            {cohort.curriculumOutline && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Curriculum Outline</h2>
                <div className="prose prose-orange dark:prose-invert max-w-none bg-muted/20 p-6 rounded-xl border border-dashed">
                  <SafeHTML html={cohort.curriculumOutline.replace(/\\n/g, '<br/>')} />
                </div>
              </div>
            )}

            {/* What you'll get */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">What's Included</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "30 days of structured learning",
                  "Real-world project building",
                  "Daily progress tracking",
                  "Community forum access",
                  "Certificate of completion",
                  isMentorLed ? "Direct mentorship & feedback" : "Peer-to-peer code reviews"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Sticky Enrollment Card */}
          <div className="relative">
            <div className="sticky top-24">
              <Card className="border-orange-200/50 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-500" />
                <CardHeader className="pb-4 bg-muted/10">
                  <div className="flex flex-col mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ₦{(totalPriceKobo / 100).toLocaleString()}
                    </span>
                    {mentorFee > 0 && (
                      <span className="text-sm text-muted-foreground mt-1">
                        Base fee: ₦5,000 + Mentor fee: ₦{(mentorFee / 100).toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Start Date</p>
                        <p className="text-sm text-muted-foreground">{startDateStr}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <p className="text-sm text-muted-foreground">
                          {isFull ? "Cohort Full" : `${spotsLeft} spots remaining`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-3 bg-muted/10 pt-4">
                  {isEnrolled ? (
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : cohort.status === 'active' ? (
                    <Button disabled className="w-full" size="lg">
                      Enrollment Closed
                    </Button>
                  ) : isFull ? (
                    <Button variant="secondary" className="w-full" size="lg">
                      Join Waitlist
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleEnroll} 
                      disabled={initiateEnrollment.isPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20" 
                      size="lg"
                    >
                      {initiateEnrollment.isPending ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : null}
                      {user ? `Enroll Now — ₦${(totalPriceKobo / 100).toLocaleString()}` : "Sign In to Enroll"}
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment processed by Paystack.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  )
}
