"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, RefreshCw, ExternalLink, Video, FileText, BookOpen, Code, Eye } from "lucide-react"
import { useResources, type Resource } from "@/api/resources"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

export function AdminResourcesManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const { searchResources, getPopularResources } = useResources()
  const { data: resourcesData, isLoading, refetch } = getPopularResources({ limit: 20 })

  const resources = resourcesData?.data?.items || []

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />
      case "article": return <FileText className="h-4 w-4" />
      case "course": return <BookOpen className="h-4 w-4" />
      case "tool": return <Code className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: "Video",
      article: "Article",
      course: "Course",
      tool: "Tool",
      doc: "Documentation",
    }
    return labels[type] || type
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "intermediate": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "advanced": return "bg-red-500/10 text-red-700 dark:text-red-400"
      default: return ""
    }
  }

  const handleEdit = (resource: Resource) => {
    toast.info(`Edit resource: ${resource.title}`)
    // In production, this would open an edit modal or navigate to edit page
  }

  const handleDelete = (resource: Resource) => {
    toast.info(`Delete resource: ${resource.title}`)
    // In production, this would call a delete API endpoint
  }

  const handleAddNew = () => {
    toast.info("Add new resource")
    // In production, this would open a create resource modal
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>Manage educational content and materials</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No resources found. Add your first learning resource.</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{resource.title}</h4>
                    {resource.isPremium && (
                      <Badge variant="default" className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 text-sm text-muted-foreground flex-wrap items-center">
                    <span className="flex items-center gap-1">
                      {getTypeIcon(resource.type)}
                      {getTypeLabel(resource.type)}
                    </span>
                    {resource.skills && resource.skills.length > 0 && (
                      <span>{resource.skills.slice(0, 2).join(", ")}</span>
                    )}
                    {resource.difficulty && (
                      <Badge variant="secondary" className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </Badge>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {resource.clicks || 0} views
                    </span>
                    {resource.duration && (
                      <span>{resource.duration} min</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {resource.url && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(resource)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
