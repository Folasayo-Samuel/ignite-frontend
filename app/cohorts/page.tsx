"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useApiQuery } from "@/hooks/useApiQuery"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, MapPin, Tag } from "lucide-react"
import { format } from "date-fns"

export default function CohortsExplorePage() {
  const { data: cohortsResponse, isLoading } = useApiQuery(["public-cohorts"], {
    url: "/cohorts/public?status=published,active",
    method: "GET"
  })

  const cohortsData = (cohortsResponse as any)?.data || cohortsResponse
  const cohorts = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items || [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-orange-50 dark:bg-orange-950/20 py-16 border-b border-orange-100 dark:border-orange-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Discover Mentor-Led Cohorts
            </h1>
            <p className="text-lg text-muted-foreground">
              Join intensive 30-day challenges led by industry experts. Learn collaboratively, build real projects, and accelerate your career.
            </p>
          </div>
        </section>

        {/* Cohorts Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-20 bg-muted/50" />
                  <CardHeader className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : cohorts.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-xl border border-dashed">
              <h3 className="text-xl font-medium mb-2">No active cohorts right now</h3>
              <p className="text-muted-foreground">Check back soon for new learning opportunities.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts.map((cohort: any) => {
                const isMentorLed = cohort.type === 'mentor_led'
                const platformFee = 500000 // 5000 NGN
                const mentorFee = cohort.mentorFeeKobo || 0
                const totalPriceKobo = platformFee + mentorFee
                const startDateStr = cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBA'
                
                // Fallback mentor info if populated
                const mentor = cohort.creatorMentorId || null

                return (
                  <Card key={cohort._id} className="flex flex-col overflow-hidden group hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-orange-800">
                    <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-500" />
                    
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <Badge variant="outline" className="capitalize text-xs font-semibold bg-background">
                          {cohort.techTrack.replace('-', ' ')}
                        </Badge>
                        <Badge variant={cohort.status === 'active' ? 'secondary' : 'default'} 
                               className={cohort.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}>
                          {cohort.status === 'published' ? 'Enrolling' : 'In Progress'}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl leading-tight group-hover:text-orange-600 transition-colors">
                        {cohort.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {cohort.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-auto pt-4 border-t">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="truncate">{startDateStr}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {cohort.currentLearnerCount || 0} / {cohort.maxLearners || '∞'} joined
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-muted/30 pt-4 flex flex-col items-stretch gap-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            ₦{(totalPriceKobo / 100).toLocaleString()}
                          </span>
                          {mentorFee > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              Includes ₦{(mentorFee / 100).toLocaleString()} mentor fee
                            </span>
                          )}
                        </div>
                        <Button asChild variant={cohort.status === 'published' ? 'default' : 'secondary'} className={cohort.status === 'published' ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}>
                          <Link href={`/cohorts/${cohort.code}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
