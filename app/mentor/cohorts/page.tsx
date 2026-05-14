"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Calendar, ArrowRight, BookOpen } from "lucide-react"
import { useMentorCohorts } from "@/apis/mentor-cohorts"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function MentorCohortsPage() {
  const { getCohorts } = useMentorCohorts()
  const { data: cohortsResponse, isLoading } = getCohorts()
  
  const cohortsData = (cohortsResponse as any)?.data || cohortsResponse
  const cohorts = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items || [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Cohorts</h1>
            <p className="text-muted-foreground mt-1">Manage your mentor-led learning programs</p>
          </div>
          <Button asChild className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
            <Link href="/mentor/cohorts/new">
              <Plus className="mr-2 h-4 w-4" /> Create Cohort
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cohorts.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">No cohorts yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Create your first cohort to start mentoring a group of students over a 30-day challenge.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link href="/mentor/cohorts/new">Create Your First Cohort</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort: any) => (
              <Card key={cohort.id || cohort._id} className="group hover:border-orange-500/50 hover:shadow-md transition-all flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <CardTitle className="line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                      {cohort.name}
                    </CardTitle>
                    <Badge variant={
                      cohort.status === 'active' ? 'default' : 
                      cohort.status === 'published' ? 'secondary' : 
                      cohort.status === 'completed' ? 'outline' : 'outline'
                    } className={
                      cohort.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''
                    }>
                      {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(cohort.startDate), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {cohort.description || "No description provided."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Enrolled</p>
                      <p className="font-semibold flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-orange-500" />
                        {cohort.currentLearnerCount || 0}
                        <span className="text-muted-foreground font-normal text-sm">
                          / {cohort.maxLearners || '∞'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Est. Revenue</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        ₦{((cohort.revenue || 0) / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 dark:group-hover:bg-orange-950/30 dark:group-hover:border-orange-800">
                    <Link href={`/mentor/cohorts/${cohort.id || cohort._id}`}>
                      Manage Cohort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
