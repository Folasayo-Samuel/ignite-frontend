"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useProjects } from "@/apis/projects"
import { useStudents } from "@/apis/student"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Eye, Github, ExternalLink, Linkedin, ArrowLeft, Calendar, LayoutDashboard } from "lucide-react"

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const { getProject, likeProject, incrementView } = useProjects()
  const { getPublicProfile } = useStudents()
  
  const { data: projectData, isLoading: projectLoading } = getProject(projectId as string)
  const project = (projectData as any)?.data || projectData

  // Increment view on mount
  useEffect(() => {
    if (projectId) {
      // Very simple debounce via timer (React strict mode fires this twice in dev, but PATCH is simple)
      const timer = setTimeout(() => incrementView.mutate({ projectId: projectId as string }), 1000)
      return () => clearTimeout(timer)
    }
  }, [projectId])

  // Get author timeline (fetch public profile to get logs)
  const { data: authorData } = getPublicProfile(project?.studentId || "", { enabled: !!project?.studentId })
  const authorLogs = authorData?.data?.recentLogs || []

  if (projectLoading) return <LoadingScreen />

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col bg-muted/20">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">This project may have been removed or is pending moderation.</p>
          <Button asChild>
            <Link href="/home/showcase">Back to Showcase</Link>
          </Button>
        </div>
      </main>
    )
  }

  const techStack = project.techStack?.split(',').map((t: string) => t.trim()).filter(Boolean) || []

  const handleLike = () => {
    likeProject.mutate({ projectId: projectId as string })
  }

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out my new project "${project.title}" built during the FolaIgnite cohort! 🚀`)
    window.open(`https://www.linkedin.com/feed/update/urn:li:share/?url=${url}&text=${text}`, '_blank')
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1">
        {/* Banner/Thumbnail Area */}
        <div className="w-full h-[30vh] md:h-[40vh] bg-muted relative border-b">
          {project.thumbnailUrl ? (
            <img 
              src={project.thumbnailUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-900/40 flex items-center justify-center">
              <LayoutDashboard className="h-24 w-24 text-orange-500/30" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Button variant="secondary" size="sm" asChild className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background">
              <Link href="/home/showcase">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-orange-500 hover:bg-orange-600">{project.techTrack}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{project.title}</h1>
                
                <div className="flex flex-wrap gap-4 items-center mb-8">
                  <div className="flex gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm">
                      <Eye className="h-4 w-4" /> <span>{project.views || 0} Views</span>
                    </div>
                  </div>
                  <Button 
                    variant={project.isLikedByCurrentUser ? "default" : "outline"}
                    className={project.isLikedByCurrentUser ? "bg-orange-500 text-white hover:bg-orange-600 rounded-full" : "rounded-full"}
                    onClick={handleLike}
                  >
                    <ThumbsUp className={`mr-2 h-4 w-4 ${project.isLikedByCurrentUser ? 'fill-current' : ''}`} /> 
                    {project.likes || 0} Likes
                  </Button>
                  <Button variant="outline" className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={handleShareLinkedIn}>
                    <Linkedin className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-md">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Live Project
                      </a>
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={project.repoUrl} target="_blank" rel="noreferrer">
                        <Github className="mr-2 h-4 w-4" /> Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold mb-4 border-b pb-2">About this project</h3>
                <div className="prose prose-orange dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Right column) */}
            <div className="space-y-8">
              {/* Author Card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Built by</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-orange-100">
                      <AvatarImage src={project.authorAvatar} />
                      <AvatarFallback className="text-xl bg-orange-100 text-orange-700">{project.author?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/learners/${project.studentId}`} className="font-bold text-lg hover:text-orange-500 transition-colors">
                        {project.author}
                      </Link>
                      <p className="text-sm text-muted-foreground">{project.country || "Global Talent"}</p>
                    </div>
                  </div>
                  
                  {project.authorBio && (
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {project.authorBio}
                    </p>
                  )}

                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/learners/${project.studentId}`}>View Full Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Journey Timeline */}
              {authorLogs.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <h3 className="font-bold">Recent Learning Journey</h3>
                    </div>
                    
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                      {authorLogs.map((log: any, i: number) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background bg-orange-500 shadow" />
                          <div className="text-xs text-muted-foreground mb-1">Day {log.dayNumber}</div>
                          <div className="text-sm line-clamp-2">
                            <span className="font-medium">Learned:</span> {log.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
