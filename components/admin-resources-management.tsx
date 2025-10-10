"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export function AdminResourcesManagement() {
  const resources = [
    { id: 1, title: "React Fundamentals", category: "React", type: "Article", views: 1250, status: "Published" },
    { id: 2, title: "CSS Grid Mastery", category: "CSS", type: "Video", views: 890, status: "Published" },
    {
      id: 3,
      title: "TypeScript Best Practices",
      category: "TypeScript",
      type: "Documentation",
      views: 2100,
      status: "Published",
    },
    { id: 4, title: "Node.js API Development", category: "Backend", type: "Code Sample", views: 450, status: "Draft" },
  ]

  const handleAction = (action: string, resourceId: number) => {
    console.log(`[v0] Admin action: ${action} for resource ${resourceId}`)
    alert(`${action} resource ${resourceId}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>Manage educational content and materials</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleAction("Add New", 0)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{resource.title}</h4>
                  <Badge variant={resource.status === "Published" ? "default" : "secondary"} className="text-xs">
                    {resource.status}
                  </Badge>
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span>{resource.category}</span>
                  <span>•</span>
                  <span>{resource.type}</span>
                  <span>•</span>
                  <span>{resource.views} views</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleAction("Edit", resource.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleAction("Delete", resource.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
