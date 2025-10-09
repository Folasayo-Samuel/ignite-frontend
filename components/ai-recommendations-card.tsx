"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Code, Video, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Recommendation {
  id: string
  title: string
  type: "article" | "video" | "code" | "documentation"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  reason: string
  url: string
}

export function AIRecommendationsCard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-powered recommendations based on user progress
    setTimeout(() => {
      setRecommendations([
        {
          id: "1",
          title: "Advanced React Hooks Patterns",
          type: "article",
          category: "React",
          difficulty: "intermediate",
          estimatedTime: "15 min",
          reason: "Based on your recent useState and useEffect usage",
          url: "/resources?filter=react",
        },
        {
          id: "2",
          title: "Building REST APIs with Node.js",
          type: "video",
          category: "Backend",
          difficulty: "beginner",
          estimatedTime: "30 min",
          reason: "Recommended for your learning track",
          url: "/resources?filter=backend",
        },
        {
          id: "3",
          title: "CSS Grid Layout Masterclass",
          type: "code",
          category: "CSS",
          difficulty: "intermediate",
          estimatedTime: "20 min",
          reason: "Complements your current projects",
          url: "/resources?filter=css",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      case "documentation":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Personalized learning suggestions based on your progress</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    {getIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                        {rec.difficulty}
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                      <span className="text-xs text-muted-foreground">{rec.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                  <Link href={rec.url}>Start Learning</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
