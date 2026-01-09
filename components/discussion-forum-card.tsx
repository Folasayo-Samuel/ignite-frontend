"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, ThumbsUp, Clock, Plus, Lock, Loader2, CreditCard, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useDiscussions, useCanCreateDiscussion } from "@/api/discussions"
import { useAuthStore } from "@/store/authStore"
import { useStudents } from "@/api/student"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { useQueryClient } from "@tanstack/react-query"

// Comprehensive categories for ALL tech & digital roles
const FORUM_CATEGORIES = [
  // Engineering
  { value: "frontend", label: "Frontend Development", group: "Engineering" },
  { value: "backend", label: "Backend Development", group: "Engineering" },
  { value: "fullstack", label: "Full Stack", group: "Engineering" },
  { value: "mobile", label: "Mobile Development", group: "Engineering" },
  { value: "devops", label: "DevOps & Cloud", group: "Engineering" },
  // Design
  { value: "ui-design", label: "UI Design", group: "Design" },
  { value: "ux-design", label: "UX Design", group: "Design" },
  { value: "product-design", label: "Product Design", group: "Design" },
  { value: "graphic-design", label: "Graphic Design", group: "Design" },
  // Content & Writing
  { value: "content-writing", label: "Content Writing", group: "Content" },
  { value: "copywriting", label: "Copywriting", group: "Content" },
  { value: "tech-writing", label: "Technical Writing", group: "Content" },
  { value: "blogging", label: "Blogging & Articles", group: "Content" },
  { value: "video-content", label: "Video Content Creation", group: "Content" },
  // Digital Marketing
  { value: "digital-marketing", label: "Digital Marketing", group: "Marketing" },
  { value: "social-media", label: "Social Media Marketing", group: "Marketing" },
  { value: "seo", label: "SEO & SEM", group: "Marketing" },
  { value: "email-marketing", label: "Email Marketing", group: "Marketing" },
  { value: "paid-ads", label: "Paid Advertising (PPC)", group: "Marketing" },
  { value: "growth-hacking", label: "Growth Hacking", group: "Marketing" },
  // Product
  { value: "product-management", label: "Product Management", group: "Product" },
  { value: "agile", label: "Agile & Scrum", group: "Product" },
  // Data
  { value: "data-science", label: "Data Science", group: "Data" },
  { value: "data-analytics", label: "Data Analytics", group: "Data" },
  { value: "machine-learning", label: "Machine Learning & AI", group: "Data" },
  // Career
  { value: "career", label: "Career Advice", group: "Career" },
  { value: "interviews", label: "Interview Prep", group: "Career" },
  { value: "freelancing", label: "Freelancing", group: "Career" },
  // General
  { value: "general", label: "General Discussion", group: "General" },
];

const categoryGroups = [...new Set(FORUM_CATEGORIES.map(c => c.group))];

export function DiscussionForumCard() {
  const [open, setOpen] = useState(false)
  const [subscribePromptOpen, setSubscribePromptOpen] = useState(false)
  const [mentorPromptOpen, setMentorPromptOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")

  const queryClient = useQueryClient();
  const { getDiscussions, createDiscussion } = useDiscussions();
  const { getMyCohort } = useStudents();
  const { data: response, isLoading } = getDiscussions();
  const { data: cohort, isLoading: loadingCohort } = getMyCohort();
  const { mutate: createTopic, isPending: isCreating } = createDiscussion;
  const { currentUser } = useAuthStore();

  // Check if user can create discussions (subscription check)
  const { data: canCreateData } = useCanCreateDiscussion(
    String(currentUser?.id || ''),
    String(currentUser?.role || 'student')
  );

  // Explicitly define enrollment status before any usage
  const isUserEnrolled = Boolean(cohort?.cohortId && cohort?.status !== "none");
  
  // Check subscription and role status
  const isMentor = currentUser?.role === 'mentor';
  const canCreate = canCreateData?.canCreate ?? false;
  const subscriptionReason = canCreateData?.reason;

  // API function auto-unwraps { success, data } - so response IS the data directly
  // Handle both array format and paginated object format
  let discussions: any[] = [];
  if (Array.isArray(response)) {
    discussions = response;
  } else if (response && typeof response === 'object' && Array.isArray((response as any).items)) {
    discussions = (response as any).items;
  }

  // Handle "New Topic" button click - check permissions first
  const handleNewTopicClick = () => {
    if (!currentUser) {
      toast.error("Please log in to create discussions");
      return;
    }

    // Mentors cannot create topics - show mentor prompt
    if (isMentor || subscriptionReason === 'MENTOR_CANNOT_CREATE') {
      setMentorPromptOpen(true);
      return;
    }

    // Unsubscribed users - show subscription prompt
    if (!canCreate && subscriptionReason === 'NO_ACTIVE_SUBSCRIPTION') {
      setSubscribePromptOpen(true);
      return;
    }

    // User can create - open the create dialog
    setOpen(true);
  };

  const handleCreateTopic = () => {
    if (!currentUser) {
      toast.error("Please log in to create discussions");
      return;
    }
    createTopic({
      title,
      studentId: String(currentUser.id),
      userId: String(currentUser.id),
      role: String(currentUser.role || 'student'),
      categories: [category],
      content,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || currentUser.profilePicture || ''
    }, {
      onSuccess: () => {
        toast.success("Discussion created successfully!");
        setOpen(false);
        setTitle("");
        setCategory("");
        setContent("");
        // Invalidate cache to refresh the discussions list
        queryClient.invalidateQueries({ queryKey: ["discussions"] });
      },
      onError: (error: any) => {
        // Handle specific error reasons
        const errorData = error?.response?.data;
        if (errorData?.reason === 'NO_ACTIVE_SUBSCRIPTION') {
          setOpen(false);
          setSubscribePromptOpen(true);
        } else if (errorData?.reason === 'MENTOR_CANNOT_CREATE') {
          setOpen(false);
          setMentorPromptOpen(true);
        } else {
          toast.error(errorData?.message || error.message || "Failed to create discussion");
        }
      }
    });
  };

  const getCategoryLabel = (value: string) => {
    return FORUM_CATEGORIES.find(c => c.value === value)?.label || value;
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

  if (!isUserEnrolled) {
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
            <Button size="sm" className="gap-2" onClick={handleNewTopicClick}>
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
                  href={`/home/forum/${discussion.id || discussion._id}`}
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
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{discussion.author?.name}</span>
                      {discussion.categories?.slice(0, 2).map((cat: string) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {getCategoryLabel(cat)}
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
                        {discussion.createdAt 
                          ? formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                </Link>
              )))}
          </div>
          <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
            <Link href="/home/forum">View All Discussions</Link>
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
                <SelectContent className="max-h-[300px]">
                  {categoryGroups.map(group => (
                    <div key={group}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                        {group}
                      </div>
                      {FORUM_CATEGORIES.filter(c => c.group === group).map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
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
              disabled={!title.trim() || !category || !content.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Required Prompt */}
      <Dialog open={subscribePromptOpen} onOpenChange={setSubscribePromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-center">Subscription Required</DialogTitle>
            <DialogDescription className="text-center">
              You need an active subscription to create discussion topics and engage with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">With a subscription, you can:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create unlimited discussion topics</li>
                <li>• Get help from mentors and peers</li>
                <li>• Access all cohort learning materials</li>
                <li>• Track your progress and earn certificates</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSubscribePromptOpen(false)} className="w-full sm:w-auto">
              Maybe Later
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/learner/subscription">Subscribe Now</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mentor Cannot Create Topics Prompt */}
      <Dialog open={mentorPromptOpen} onOpenChange={setMentorPromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-center">Mentors Can Reply Only</DialogTitle>
            <DialogDescription className="text-center">
              As a mentor, you can help learners by replying to existing discussions, but you cannot create new topics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">How you can help:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browse existing discussions</li>
                <li>• Reply with helpful answers</li>
                <li>• Share your expertise and experience</li>
                <li>• Guide learners in the right direction</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setMentorPromptOpen(false)} className="w-full">
              Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
