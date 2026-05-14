"use client"

import Link from "next/link"
import { useStudents } from "@/apis/student"
import { StudentDashboardHeader } from "@/components/students/student-dashboard-header"
import { RoleGuard } from "@/components/shared/RoleGuard"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderKanban, Eye, ThumbsUp, MessageSquare, Edit } from "lucide-react"

export default function LearnerProjectsPage() {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <LearnerProjectsContent />
    </RoleGuard>
  )
}

function LearnerProjectsContent() {
  const { getMyProjects } = useStudents()
  const { data: projectsResponse, isLoading } = getMyProjects()

  if (isLoading) return <LoadingScreen />

  // Handle data format safely
  const projects = Array.isArray(projectsResponse) ? projectsResponse : ((projectsResponse as any)?.data || [])

  return (
    <div>
      <StudentDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            <p className="text-muted-foreground">
              Manage your portfolio, submit new projects, and track engagement.
            </p>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/learner/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Project
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <FolderKanban className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                You haven't added any projects to your portfolio. Projects are a great way to showcase your skills to potential sponsors and employers.
              </p>
              <Button asChild>
                <Link href="/learner/dashboard/projects/new">
                  Create Your First Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Card key={project._id} className="overflow-hidden flex flex-col group">
                <div className="relative h-48 bg-muted border-b overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-background">
                      <span className="text-4xl font-bold text-orange-500/30 uppercase tracking-widest">
                        {project.title.substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={project.isPublished ? "default" : "secondary"} className={project.isPublished ? "bg-green-500 hover:bg-green-600" : ""}>
                      {project.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3 flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs font-normal">
                        {project.techTrack}
                      </Badge>
                      <CardTitle className="line-clamp-2 text-lg">{project.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 border-t mt-auto">
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1" title="Views">
                        <Eye className="h-4 w-4" /> <span>{project.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Likes">
                        <ThumbsUp className="h-4 w-4" /> <span>{project.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Comments">
                        <MessageSquare className="h-4 w-4" /> <span>{project.comments || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.isPublished && project.status === "approved" && (
                        <Button variant="ghost" size="icon" asChild title="View on Showcase">
                          <Link href={`/showcase/${project._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild title="Edit Project">
                        <Link href={`/learner/dashboard/projects/${project._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
