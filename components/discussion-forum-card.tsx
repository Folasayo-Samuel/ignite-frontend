"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Clock, Plus } from "lucide-react"
import Link from "next/link"

const discussions = [
  {
    id: "1",
    title: "How to handle async operations in React?",
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "React",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    solved: true,
  },
  {
    id: "2",
    title: "Best practices for API error handling",
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Backend",
    replies: 8,
    likes: 15,
    timeAgo: "5 hours ago",
    solved: false,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox - When to use what?",
    author: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "CSS",
    replies: 20,
    likes: 45,
    timeAgo: "1 day ago",
    solved: true,
  },
]

export function DiscussionForumCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Discussion Forum</CardTitle>
            <CardDescription>Ask questions and help your peers</CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Topic
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link
              key={discussion.id}
              href={`/forum/${discussion.id}`}
              className="block p-4 rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm hover:text-primary transition-colors">{discussion.title}</h4>
                  {discussion.solved && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0">
                      Solved
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} />
                    <AvatarFallback className="text-xs">
                      {discussion.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{discussion.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {discussion.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {discussion.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {discussion.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {discussion.timeAgo}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
          <Link href="/forum">View All Discussions</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
