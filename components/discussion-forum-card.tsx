"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")

  const handleCreateTopic = () => {
    console.log("[v0] New topic created:", { title, category, content })
    setOpen(false)
    setTitle("")
    setCategory("")
    setContent("")
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Ask questions and help your peers</CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
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
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0"
                      >
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discussion Topic</DialogTitle>
            <DialogDescription>Start a conversation with the community</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title">Title</Label>
              <Input
                id="topic-title"
                placeholder="What's your question or topic?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="topic-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-content">Description</Label>
              <Textarea
                id="topic-content"
                placeholder="Provide details about your question or topic..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleCreateTopic}
              className="flex-1"
              disabled={!title.trim() || !category || !content.trim()}
            >
              Create Topic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
