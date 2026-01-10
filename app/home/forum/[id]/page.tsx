"use client"

import { useState, useMemo, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ThumbsUp, Clock, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDiscussion, useAddComment, useLikeDiscussion, useToggleSolved } from "@/api/discussions";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

// Category labels for ALL tech & digital roles
const FORUM_CATEGORIES: Record<string, string> = {
  // Engineering
  "frontend": "Frontend Development",
  "backend": "Backend Development",
  "fullstack": "Full Stack",
  "mobile": "Mobile Development",
  "devops": "DevOps & Cloud",
  "database": "Database & SQL",
  "api": "APIs & Integration",
  // Design
  "ui-design": "UI Design",
  "ux-design": "UX Design",
  "product-design": "Product Design",
  "graphic-design": "Graphic Design",
  "motion-design": "Motion & Animation",
  // Content & Writing
  "content-writing": "Content Writing",
  "copywriting": "Copywriting",
  "tech-writing": "Technical Writing",
  "blogging": "Blogging & Articles",
  "content-strategy": "Content Strategy",
  "video-content": "Video Content Creation",
  // Digital Marketing
  "digital-marketing": "Digital Marketing",
  "social-media": "Social Media Marketing",
  "seo": "SEO & SEM",
  "email-marketing": "Email Marketing",
  "paid-ads": "Paid Advertising (PPC)",
  "affiliate-marketing": "Affiliate Marketing",
  "influencer-marketing": "Influencer Marketing",
  "growth-hacking": "Growth Hacking",
  "analytics-marketing": "Marketing Analytics",
  "brand-strategy": "Brand Strategy",
  // Product
  "product-management": "Product Management",
  "product-strategy": "Product Strategy",
  "agile": "Agile & Scrum",
  "roadmapping": "Roadmapping",
  // Data
  "data-science": "Data Science",
  "data-analytics": "Data Analytics",
  "machine-learning": "Machine Learning & AI",
  "data-engineering": "Data Engineering",
  // Quality
  "qa-testing": "QA & Testing",
  "cybersecurity": "Cybersecurity",
  "performance": "Performance Optimization",
  // Business
  "developer-relations": "Developer Relations",
  "tech-sales": "Tech Sales & Solutions",
  "customer-success": "Customer Success",
  "business-development": "Business Development",
  // Career
  "career": "Career Advice",
  "interviews": "Interview Prep",
  "portfolio": "Portfolio & Projects",
  "freelancing": "Freelancing",
  "remote-work": "Remote Work",
  // General
  "general": "General Discussion",
  "tools": "Tools & Resources",
  "learning": "Learning & Courses",
  "community": "Community & Events",
};

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15: params is now a Promise, use React's use() to unwrap
  const { id } = use(params);
  
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data: result, isLoading } = useDiscussion(id);
  // API auto-unwraps { success, data } - result IS the data directly
  const discussion = result as any;
  
  const addCommentMutation = useAddComment(id);
  const likeMutation = useLikeDiscussion(id);
  const solvedMutation = useToggleSolved(id);

  // Memoized computed values for performance
  const isAuthor = useMemo(() => 
    currentUser && discussion?.author?.id === String(currentUser.id),
    [currentUser, discussion?.author?.id]
  );

  // Check if user can manage topic status (author or admin)
  const canManageStatus = useMemo(() => 
    currentUser && (
      discussion?.author?.id === String(currentUser.id) || 
      currentUser.role === 'admin'
    ),
    [currentUser, discussion?.author?.id]
  );
  
  const hasLiked = useMemo(() => 
    currentUser && discussion?.likes?.includes(String(currentUser.id)),
    [currentUser, discussion?.likes]
  );

  const handlePostReply = useCallback(async () => {
    if (!currentUser || !replyContent.trim()) {
      toast.error("Please log in and enter a reply");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addCommentMutation.mutateAsync({
        authorId: String(currentUser.id),
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar || "",
        authorRole: (currentUser.role as 'student' | 'mentor' | 'admin') || "student",
        content: replyContent.trim(),
      });
      toast.success("Reply posted!");
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, replyContent, addCommentMutation, queryClient, id]);

  const handleLike = useCallback(async () => {
    if (!currentUser) {
      toast.error("Please log in to like");
      return;
    }
    try {
      await likeMutation.mutateAsync({ userId: String(currentUser.id) });
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to like");
    }
  }, [currentUser, likeMutation, queryClient, id]);

  const handleToggleSolved = useCallback(async () => {
    if (!currentUser) return;
    try {
      const mutationResult = await solvedMutation.mutateAsync({ userId: String(currentUser.id) });
      // API auto-unwraps - result IS the data directly
      toast.success((mutationResult as any).solved ? "Marked as solved!" : "Marked as unsolved");
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  }, [currentUser, solvedMutation, queryClient, id]);

  const getCategoryLabel = useCallback((value: string) => FORUM_CATEGORIES[value] || value, []);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-32" />
          <Card className="border-2">
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!discussion) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Discussion not found</h1>
          <Button asChild>
            <Link href="/home/forum">Back to Forum</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/home/forum">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>
        </Button>

        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold text-balance">
                  {discussion.title}
                </h1>
                <div className="flex items-center gap-2">
                  {discussion.solved && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0"
                    >
                      Solved
                    </Badge>
                  )}
                  {canManageStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleSolved}
                      disabled={solvedMutation.isPending}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {discussion.solved ? "Mark Unresolved" : "Mark Resolved"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={discussion.author?.avatar || "/placeholder.svg"}
                    alt={discussion.author?.name}
                  />
                  <AvatarFallback>
                    {discussion.author?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{discussion.author?.name || "Anonymous"}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                    {discussion.categories?.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {getCategoryLabel(cat)}
                      </Badge>
                    ))}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {discussion.createdAt 
                        ? formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })
                        : "Just now"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {discussion.content}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant={hasLiked ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                >
                  <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                  {discussion.likesCount || discussion.likes?.length || 0}
                </Button>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {discussion.comments?.length || 0} replies
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies ({discussion.comments?.length || 0})</h2>

          {/* Gentle reminder for topic owner or admin to mark as resolved */}
          {canManageStatus && !discussion.solved && discussion.comments?.length > 0 && (
            <Card className="border-dashed border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {isAuthor 
                      ? "Did any of these replies help? Mark your question as resolved to help others find answers."
                      : "Has this issue been resolved? Mark it as resolved to help others find answers."
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSolved}
                  disabled={solvedMutation.isPending}
                  className="shrink-0 border-green-500/50 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  Mark Resolved
                </Button>
              </CardContent>
            </Card>
          )}

          {discussion.comments && discussion.comments.length > 0 ? (
            discussion.comments.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={reply.author?.avatar || "/placeholder.svg"}
                        alt={reply.author?.name}
                      />
                      <AvatarFallback className="text-xs">
                        {reply.author?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{reply.author?.name || "Anonymous"}</p>
                        {reply.author?.role && reply.author.role !== "student" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5">
                            {reply.author.role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {reply.createdAt 
                          ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })
                          : "Just now"}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No replies yet. Be the first to respond!
            </div>
          )}
        </div>

        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">Add a Reply</h3>
            {currentUser ? (
              <>
                <Textarea 
                  placeholder="Share your thoughts or answer..." 
                  rows={4}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button 
                  onClick={handlePostReply}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Reply"
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-2">Please log in to reply</p>
                <Button asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
