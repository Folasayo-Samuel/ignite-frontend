"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Briefcase,
  Calendar,
  Users,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  Linkedin,
} from "lucide-react"
import { useMentors, Mentor } from "@/apis/mentors"

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-32 w-32 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function MentorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = params.id as string

  const { getMentor, getMentorRatings } = useMentors()
  const { data: mentorResponse, isLoading, isError } = getMentor(mentorId)

  // getMentor returns the mentor directly (useApiQuery unwraps)
  const mentor = mentorResponse as Mentor | null

  const { data: ratingsResponse } = getMentorRatings(mentorId)
  const ratings = (ratingsResponse as { data?: Array<{ _id: string; rating: number; review?: string; createdAt: string; studentId?: { name?: string } }> })?.data || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProfileSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (isError || !mentor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Mentor not found</h1>
            <p className="text-muted-foreground">This mentor profile doesn&apos;t exist or has been removed.</p>
            <Button variant="outline" onClick={() => router.push("/mentors")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentors
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const initials = mentor.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "M"

  const rating = mentor.ratingsAvg || mentor.rating || 0
  const ratingsCount = (mentor as Mentor & { ratingsCount?: number }).ratingsCount || ratings.length || 0
  const linkedin = mentor.linkedin || ""

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Back link */}
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link href="/mentors">
              <ArrowLeft className="mr-2 h-4 w-4" /> All Mentors
            </Link>
          </Button>

          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg flex-shrink-0 mx-auto md:mx-0">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-2xl bg-orange-50 text-orange-600 font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <h1 className="text-3xl font-bold">{mentor.name}</h1>
                    <p className="text-xl text-muted-foreground">
                      {mentor.title || "Mentor"}
                      {mentor.company ? ` at ${mentor.company}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                    {mentor.company && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {mentor.company}
                      </span>
                    )}
                    {mentor.experienceYears && mentor.experienceYears > 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {mentor.experienceYears}+ years experience
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mentor.studentsCount || 0} mentees
                    </span>
                  </div>

                  {rating > 0 && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({ratingsCount} {ratingsCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {mentor.expertise?.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2 justify-center md:justify-start">
                    {linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({ratingsCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {mentor.bio || "This mentor hasn't added a bio yet."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {ratings.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No reviews yet. Be the first to leave a review!
                  </CardContent>
                </Card>
              ) : (
                ratings.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            {review.studentId?.name || "Anonymous"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - review.rating }).map((_, i) => (
                            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-200" />
                          ))}
                        </div>
                        {review.review && (
                          <p className="text-muted-foreground">{review.review}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
