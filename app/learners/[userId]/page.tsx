"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useStudents } from "@/apis/student"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Trophy, Flame, Target, Star, MapPin, Mail, FolderKanban } from "lucide-react"

export default function PublicLearnerProfilePage() {
  const { userId } = useParams()
  const { getPublicProfile } = useStudents()
  
  const { data: profileResponse, isLoading } = getPublicProfile(userId as string)
  const profile = profileResponse?.data || profileResponse

  if (isLoading) return <LoadingScreen />

  if (!profile) {
    return (
      <main className="min-h-screen flex flex-col bg-muted/20">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Learner Not Found</h2>
          <p className="text-muted-foreground mb-6">This profile doesn't exist or is currently private.</p>
          <Button asChild>
            <Link href="/home/showcase">Browse Showcase</Link>
          </Button>
        </div>
      </main>
    )
  }

  const { stats, projects, achievements, openToOpportunities } = profile

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white relative pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-white shadow-xl">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-4xl text-orange-700 bg-orange-100">{profile.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">{profile.name}</h1>
            {openToOpportunities && (
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 flex items-center gap-1.5 px-3 py-1">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="text-xs uppercase tracking-wider font-semibold">Open to Work</span>
              </Badge>
            )}
          </div>
          
          {profile.country && (
            <p className="flex items-center justify-center gap-1 text-orange-100 mb-6">
              <MapPin className="h-4 w-4" /> {profile.country}
            </p>
          )}

          {profile.bio && (
            <p className="max-w-2xl mx-auto text-lg text-orange-50 leading-relaxed mb-8">
              "{profile.bio}"
            </p>
          )}

          <div className="flex justify-center gap-4">
            {openToOpportunities && (
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg font-semibold rounded-full px-8">
                <Mail className="mr-2 h-4 w-4" /> Contact for Opportunities
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20 max-w-6xl mb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats?.cohortsCompleted || 0}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cohorts Completed</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats?.longestStreak || 0}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Longest Streak</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <FolderKanban className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats?.projectsBuilt || 0}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Projects Built</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{achievements?.length || 0}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Projects) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                Published Projects
              </h2>
              
              {projects?.length === 0 ? (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="py-12 text-center">
                    <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">This learner hasn't published any projects to the showcase yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects?.map((project: any) => (
                    <Card key={project.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <Link href={`/showcase/${project.id}`}>
                        <div className="h-40 bg-muted overflow-hidden">
                          {project.thumbnail ? (
                            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                              <span className="text-4xl font-bold text-orange-500/30 uppercase">{project.title.substring(0, 2)}</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <Badge variant="outline" className="mb-3">{project.track}</Badge>
                          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">{project.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Badges & Info) */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No badges earned yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {achievements?.map((badge: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full" title={badge}>
                        <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">🏅</div>
                        <span className="text-sm font-medium">{badge}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  )
}
