"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Code, Search, ExternalLink } from "lucide-react"
import { useState } from "react"

const resources = [
  {
    id: "1",
    title: "React Hooks Complete Guide",
    type: "article",
    category: "React",
    url: "https://react.dev/reference/react",
    description: "Master useState, useEffect, and custom hooks",
  },
  {
    id: "2",
    title: "CSS Grid Layout Tutorial",
    type: "video",
    category: "CSS",
    url: "https://www.youtube.com/watch?v=EiNiSFIPIQE",
    description: "Build responsive layouts with CSS Grid",
  },
  {
    id: "3",
    title: "JavaScript ES6+ Features",
    type: "documentation",
    category: "JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Modern JavaScript syntax and features",
  },
  {
    id: "4",
    title: "API Integration Best Practices",
    type: "code",
    category: "Backend",
    url: "https://restfulapi.net/",
    description: "Learn to work with REST APIs effectively",
  },
  {
    id: "5",
    title: "TypeScript Fundamentals",
    type: "video",
    category: "TypeScript",
    url: "https://www.typescriptlang.org/docs/",
    description: "Type-safe JavaScript development",
  },
  {
    id: "6",
    title: "Git & GitHub Workflow",
    type: "article",
    category: "Tools",
    url: "https://docs.github.com/en/get-started",
    description: "Version control for developers",
  },
]

export function ResourceLibraryCard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(resources.map((r) => r.category)))

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "documentation":
        return <BookOpen className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleViewResource = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
        <CardDescription>Curated learning materials to support your journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">{getIcon(resource.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => handleViewResource(resource.url)}
                  >
                    View Resource
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
