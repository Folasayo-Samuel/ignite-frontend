"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UserProfileCard } from "@/components/user-profile-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Flame, Target } from "lucide-react"

import { useGamification } from "@/api/gamification"
import { useStudents } from "@/api/student"

export default function ProfilePage() {
  const { getStats } = useGamification()
  const { getMyProjects } = useStudents()

  const { data: statsData } = getStats()
  const { data: projectsData } = getMyProjects()
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Your Profile</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Manage your information and track your achievements
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Flame className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-3xl font-bold">{statsData?.streak?.current || 0}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-3xl font-bold">{statsData?.badges?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">unlocked</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-3xl font-bold">{projectsData?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <UserProfileCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
