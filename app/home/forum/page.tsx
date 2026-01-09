"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ThumbsUp, Clock, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDiscussions } from "@/api/discussions";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Comprehensive categories for ALL tech & digital roles
const FORUM_CATEGORIES = [
  // Software Engineering
  { value: "frontend", label: "Frontend Development", group: "Engineering" },
  { value: "backend", label: "Backend Development", group: "Engineering" },
  { value: "fullstack", label: "Full Stack", group: "Engineering" },
  { value: "mobile", label: "Mobile Development", group: "Engineering" },
  { value: "devops", label: "DevOps & Cloud", group: "Engineering" },
  { value: "database", label: "Database & SQL", group: "Engineering" },
  { value: "api", label: "APIs & Integration", group: "Engineering" },
  // Design
  { value: "ui-design", label: "UI Design", group: "Design" },
  { value: "ux-design", label: "UX Design", group: "Design" },
  { value: "product-design", label: "Product Design", group: "Design" },
  { value: "graphic-design", label: "Graphic Design", group: "Design" },
  { value: "motion-design", label: "Motion & Animation", group: "Design" },
  // Content & Writing
  { value: "content-writing", label: "Content Writing", group: "Content" },
  { value: "copywriting", label: "Copywriting", group: "Content" },
  { value: "tech-writing", label: "Technical Writing", group: "Content" },
  { value: "blogging", label: "Blogging & Articles", group: "Content" },
  { value: "content-strategy", label: "Content Strategy", group: "Content" },
  { value: "video-content", label: "Video Content Creation", group: "Content" },
  // Digital Marketing
  { value: "digital-marketing", label: "Digital Marketing", group: "Marketing" },
  { value: "social-media", label: "Social Media Marketing", group: "Marketing" },
  { value: "seo", label: "SEO & SEM", group: "Marketing" },
  { value: "email-marketing", label: "Email Marketing", group: "Marketing" },
  { value: "paid-ads", label: "Paid Advertising (PPC)", group: "Marketing" },
  { value: "affiliate-marketing", label: "Affiliate Marketing", group: "Marketing" },
  { value: "influencer-marketing", label: "Influencer Marketing", group: "Marketing" },
  { value: "growth-hacking", label: "Growth Hacking", group: "Marketing" },
  { value: "analytics-marketing", label: "Marketing Analytics", group: "Marketing" },
  { value: "brand-strategy", label: "Brand Strategy", group: "Marketing" },
  // Product & Strategy
  { value: "product-management", label: "Product Management", group: "Product" },
  { value: "product-strategy", label: "Product Strategy", group: "Product" },
  { value: "agile", label: "Agile & Scrum", group: "Product" },
  { value: "roadmapping", label: "Roadmapping", group: "Product" },
  // Data
  { value: "data-science", label: "Data Science", group: "Data" },
  { value: "data-analytics", label: "Data Analytics", group: "Data" },
  { value: "machine-learning", label: "Machine Learning & AI", group: "Data" },
  { value: "data-engineering", label: "Data Engineering", group: "Data" },
  // Quality & Security
  { value: "qa-testing", label: "QA & Testing", group: "Quality" },
  { value: "cybersecurity", label: "Cybersecurity", group: "Quality" },
  { value: "performance", label: "Performance Optimization", group: "Quality" },
  // Business & Sales
  { value: "developer-relations", label: "Developer Relations", group: "Business" },
  { value: "tech-sales", label: "Tech Sales & Solutions", group: "Business" },
  { value: "customer-success", label: "Customer Success", group: "Business" },
  { value: "business-development", label: "Business Development", group: "Business" },
  // Career
  { value: "career", label: "Career Advice", group: "Career" },
  { value: "interviews", label: "Interview Prep", group: "Career" },
  { value: "portfolio", label: "Portfolio & Projects", group: "Career" },
  { value: "freelancing", label: "Freelancing", group: "Career" },
  { value: "remote-work", label: "Remote Work", group: "Career" },
  // General
  { value: "general", label: "General Discussion", group: "General" },
  { value: "tools", label: "Tools & Resources", group: "General" },
  { value: "learning", label: "Learning & Courses", group: "General" },
  { value: "community", label: "Community & Events", group: "General" },
];

const categoryGroups = [...new Set(FORUM_CATEGORIES.map(c => c.group))];

export default function ForumPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreating, setIsCreating] = useState(false);

  const { currentUser } = useAuthStore();
  const { getDiscussions, createDiscussion } = useDiscussions();
  const { data: result, isLoading, refetch } = getDiscussions();
  
  // API function auto-unwraps { success, data } - so result IS the data object directly
  const discussions = (result as any)?.items || [];

  const handleCreateTopic = async () => {
    if (!currentUser?.id) {
      toast.error("Please log in to create discussions");
      return;
    }
    
    setIsCreating(true);
    try {
      await createDiscussion.mutateAsync({
        title,
        content,
        categories: [category],
        studentId: String(currentUser.id),
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar || currentUser.profilePicture || '',
      });
      toast.success("Discussion created successfully!");
      setOpen(false);
      setTitle("");
      setCategory("");
      setContent("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create discussion");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredDiscussions = discussions.filter((discussion: any) => {
    const matchesSearch = discussion.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      discussion.categories?.some((c: string) => c.toLowerCase() === filterCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (value: string) => {
    return FORUM_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Community Forum</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connect with peers, ask questions, and share knowledge
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Categories</SelectItem>
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
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              New Topic
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-6 rounded-lg border-2 bg-card">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex gap-6">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion: any) => (
                <Link
                  key={discussion.id}
                  href={`/home/forum/${discussion.id}`}
                  className="block p-6 rounded-lg border-2 hover:border-primary/50 transition-colors bg-card"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
                      {discussion.solved && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0"
                        >
                          Solved
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={discussion.author?.avatar || "/placeholder.svg"}
                          alt={discussion.author?.name}
                        />
                        <AvatarFallback className="text-xs">
                          {discussion.author?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {discussion.author?.name || "Anonymous"}
                      </span>
                      {discussion.categories?.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {getCategoryLabel(cat)}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.replies || 0} replies
                      </span>
                      <span className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes?.length || 0} likes
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {discussion.createdAt 
                          ? formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground space-y-4">
                <p>No discussions found. Be the first to start a conversation!</p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discussion
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discussion Topic</DialogTitle>
            <DialogDescription>
              Start a conversation with the community
            </DialogDescription>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
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
    </div>
  );
}
