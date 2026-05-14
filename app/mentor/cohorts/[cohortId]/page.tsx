"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Settings, 
  MessageCircle, 
  Wallet,
  PlayCircle,
  ExternalLink,
  Flame,
  Clock
} from "lucide-react"
import { useMentorCohorts } from "@/apis/mentor-cohorts"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function MentorCohortManagePage() {
  const params = useParams()
  const router = useRouter()
  const cohortId = params.cohortId as string

  const { getCohort, closeEnrollment } = useMentorCohorts()
  const { data: cohortResponse, isLoading } = getCohort(cohortId)
  const { mutate: doCloseEnrollment, isPending: isClosing } = closeEnrollment(cohortId)
  
  // Unwrap response
  const cohort = (cohortResponse as any)?.data || cohortResponse

  const handleCloseEnrollment = () => {
    doCloseEnrollment(undefined, {
      onSuccess: () => {
        toast.success("Enrollment closed! Cohort is now active.")
        // Optionally refresh or invalidate query
      },
      onError: () => {
        toast.error("Failed to close enrollment")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-40 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    )
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Cohort Not Found</h2>
          <p className="text-muted-foreground mb-6">This cohort doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link href="/mentor/cohorts">Back to My Cohorts</Link>
          </Button>
        </main>
      </div>
    )
  }

  const isEditable = cohort.status === 'draft' || cohort.status === 'published'
  const isPublishable = cohort.status === 'draft'
  const canCloseEnrollment = cohort.status === 'published'
  
  const memberships = cohort.memberships || []
  const revenueKobo = (cohort.mentorFeeKobo || 0) * (cohort.currentLearnerCount || 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-8">
        <Button variant="ghost" size="sm" asChild className="-ml-4 text-muted-foreground">
          <Link href="/mentor/cohorts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Cohorts
          </Link>
        </Button>
        
        {/* Info Bar */}
        <Card className="border-orange-200 dark:border-orange-900/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">{cohort.name}</h1>
                  <Badge variant={cohort.status === 'active' ? 'default' : 'secondary'} className={cohort.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {cohort.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    CODE: {cohort.code}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground max-w-2xl">{cohort.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm font-medium pt-2">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(cohort.startDate), 'MMM d')} - {format(new Date(cohort.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {cohort.currentLearnerCount} / {cohort.maxLearners || 'Unlimited'} Enrolled
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    ₦{((cohort.mentorFeeKobo || 0) / 100).toLocaleString()} per learner
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
                {canCloseEnrollment && (
                  <Button 
                    onClick={handleCloseEnrollment} 
                    disabled={isClosing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Start Cohort Now
                  </Button>
                )}
                {isEditable && (
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/cohorts/${cohort.code}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Public Page
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Roster */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Learner Roster</CardTitle>
                  <CardDescription>Track daily progress and nudge learners</CardDescription>
                </div>
                <Badge variant="secondary">{memberships.length} Students</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {memberships.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No learners have enrolled yet.</p>
                    {cohort.status === 'published' && (
                      <p className="text-sm mt-2">Share your cohort link to get signups!</p>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Learner</TableHead>
                        <TableHead className="text-center">Streak</TableHead>
                        <TableHead className="text-center">Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberships.map((m: any) => {
                        const student = m.student || {}
                        const initials = student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'
                        const progress = Math.round(((m.totalDaysCompleted || 0) / 30) * 100)
                        
                        // Status logic
                        const lastLog = m.lastActivityAt ? new Date(m.lastActivityAt) : null
                        const today = new Date()
                        const diffDays = lastLog ? Math.floor((today.getTime() - lastLog.getTime()) / (1000 * 3600 * 24)) : 999
                        
                        let statusColor = "bg-gray-300"
                        let statusText = "Not Started"
                        if (m.totalDaysCompleted > 0) {
                          if (diffDays === 0) {
                            statusColor = "bg-green-500"
                            statusText = "Logged Today"
                          } else if (diffDays === 1) {
                            statusColor = "bg-amber-500"
                            statusText = "Missed Yesterday"
                          } else {
                            statusColor = "bg-red-500"
                            statusText = `${diffDays} Days Missed`
                          }
                        }

                        // WhatsApp link prep
                        const waMsg = encodeURIComponent(`Hey ${student.name?.split(' ')[0]}! 👋 It's Day of your FolaIgnite challenge. Have you logged your 30 minutes today? Keep your streak going 🔥 folaignite.com/dashboard`)

                        return (
                          <TableRow key={m._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={student.avatar} />
                                  <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm leading-none">{student.name || 'Unknown'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 text-orange-500 font-medium">
                                <Flame className="h-4 w-4" /> {m.currentStreak || 0}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground mt-1 inline-block">{progress}%</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
                                <span className="text-xs">{statusText}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild title="Nudge on WhatsApp">
                                <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Financials */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Earnings</CardTitle>
                <CardDescription>Revenue generated from this cohort</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mentor Fee:</span>
                    <span>₦{((cohort.mentorFeeKobo || 0) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrolled:</span>
                    <span>{cohort.currentLearnerCount || 0} learners</span>
                  </div>
                  <div className="pt-2 border-t mt-2 flex justify-between font-bold text-lg text-green-600 dark:text-green-400">
                    <span>Total Est.:</span>
                    <span>₦{(revenueKobo / 100).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-100 dark:border-orange-800">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Payout Status
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Earnings are held in escrow and will clear to your main wallet 3 days after the cohort successfully completes.
                  </p>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/mentor/dashboard/wallet">View Main Wallet</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
