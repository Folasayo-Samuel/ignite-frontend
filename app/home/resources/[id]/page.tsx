import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { SafeHTML } from "@/components/ui/safe-html"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  // Mock resource data - in production, fetch from API
  const resource = {
    id: params.id,
    title: "Advanced React Patterns and Best Practices",
    description:
      "Learn advanced React patterns including compound components, render props, and custom hooks to write more maintainable code.",
    type: "video",
    category: "react",
    difficulty: "intermediate",
    duration: "45 mins",
    videoUrl: "/placeholder-video.mp4",
    thumbnail: "/placeholder.svg?height=400&width=800",
    content: `
      <h2>What You'll Learn</h2>
      <ul>
        <li>Compound Components Pattern</li>
        <li>Render Props Pattern</li>
        <li>Custom Hooks Best Practices</li>
        <li>Performance Optimization Techniques</li>
      </ul>
      
      <h2>Prerequisites</h2>
      <p>Basic understanding of React hooks and component composition.</p>
      
      <h2>Key Takeaways</h2>
      <p>By the end of this tutorial, you'll be able to implement advanced React patterns that make your code more reusable and maintainable.</p>
    `,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/resources">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Video Player */}
          {resource.type === "video" && (
            <VideoPlayer src={resource.videoUrl} title={resource.title} thumbnail={resource.thumbnail} />
          )}

          {/* Resource Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary">{resource.category}</Badge>
              <Badge variant="outline">{resource.difficulty}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{resource.duration}</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold">{resource.title}</h1>
            <p className="text-lg text-muted-foreground">{resource.description}</p>

            {/* Content */}
            <SafeHTML
              className="prose prose-slate dark:prose-invert max-w-none"
              html={resource.content}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
