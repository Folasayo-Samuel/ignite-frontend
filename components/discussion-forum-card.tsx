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
import { MessageSquare, ThumbsUp, Clock, Plus, Lock } from "lucide-react"
import Link from "next/link"
import { useDiscussions } from "@/api/discussions"
import { useAuthStore } from "@/store/authStore"
import { useStudents } from "@/api/student"
import { Skeleton } from "@/components/ui/skeleton"

export function DiscussionForumCard() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")

  const { getDiscussions, createDiscussion } = useDiscussions();
  const { getMyCohort } = useStudents();
  const { data: response, isLoading } = getDiscussions();
  const { data: cohort, isLoading: loadingCohort } = getMyCohort();
  const { mutate: createTopic, isPending: isCreating } = createDiscussion;
  const { currentUser } = useAuthStore();

  const isEnrolled = cohort?.cohortId && cohort?.status !== "none";
  const discussions = response?.data || [];

  const handleCreateTopic = () => {
    if (!currentUser) return;
    createTopic({
      title,
      studentId: String(currentUser.id),
      categories: [category],
      content
    }, {
      onSuccess: () => {
        setOpen(false)
        setTitle("")
        setCategory("")
        setContent("")
      }
    });
  }

  if (loadingCohort) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isEnrolled) {
    return (
      <Card className="border-2 border-dashed bg-muted/30">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Discussion Forum Locked</CardTitle>
          <CardDescription>
            Join a cohort to participate in discussions and help your peers.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <Button asChild>
            <Link href="/learner/dashboard">Join a Cohort to Discuss</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No discussions yet. Be the first to ask!</div>
            ) : (
              discussions.map((discussion) => (
                <Link
                  key={discussion.id || discussion._id}
                  href={`/forum/${discussion.id || discussion._id}`}
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
                        <AvatarImage src={discussion.author?.avatar || "/placeholder.svg"} alt={discussion.author?.name} />
                        <AvatarFallback className="text-xs">
                          {discussion.author?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{discussion.author?.name}</span>
                      {discussion.categories?.map(cat => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {/* discussion.createdAt should be formatted */}
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              )))}
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
