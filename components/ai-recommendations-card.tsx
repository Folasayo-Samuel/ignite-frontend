import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Code, Video, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useAI, AIRecommendationResponse } from "@/api/ai"
import { useStudents } from "@/api/student"

interface Recommendation {
  id: string
  title: string
  type: "article" | "video" | "code" | "documentation" | "tutorial" | "project"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  reason?: string
  description?: string
  url: string
}

export function AIRecommendationsCard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const { getRecommendations } = useAI();
  const { getMyCohort, getMyProgress, getMyDetails, getMyActivities } = useStudents();
  const { data: cohortData } = getMyCohort();
  const { data: progressData } = getMyProgress();
  const { data: userData } = getMyDetails();
  const { data: activitiesData } = getMyActivities(undefined, 5);
  const { mutate, isPending: loading } = getRecommendations;
  const isEnrolled = cohortData?.cohortId && cohortData?.status !== "none";

  useEffect(() => {
    if (isEnrolled && progressData && userData) {
      // Handle nested API response structure
      const responseData = (progressData as any)?.data || progressData;
      const progress = responseData?.progress || responseData || {};

      // Extract real user data
      const currentDay = progress.totalDaysCompleted ?? progress.day ?? 1;

      // Derive tech track from user skills or default intelligently
      const userSkills = (userData as any)?.skills || [];
      const techTrack = userSkills.length > 0
        ? userSkills[0].toLowerCase()
        : "fullstack";

      // Use real recent activities as context
      const realActivities = (activitiesData as any)?.items || activitiesData || [];
      const activityTopics = realActivities
        .map((a: any) => a.description || a.content)
        .filter((t: string) => t && t.length > 3) // filter out empty/short logs
        .slice(0, 5);

      const completedTopics = activityTopics.length > 0
        ? activityTopics
        : (userSkills.length > 0 ? userSkills.slice(0, 3) : ["Getting Started"]);

      mutate({
        techTrack,
        currentDay,
        completedTopics,
        strugglingAreas: [] // Will be populated when backend tracking is available
      }, {
        onSuccess: (response: AIRecommendationResponse) => {
          if (response.success && response.data) {
            const apiResources = response.data.resources || [];
            const mapped = apiResources.map((res: any, index: number) => ({
              id: `rec-${index}`,
              title: res.title || "Recommended Resource",
              type: (res.type?.toLowerCase() as any) || "article",
              category: "Recommended",
              difficulty: index === 0 ? "beginner" : "intermediate",
              estimatedTime: "15 min",
              reason: response.data.tip || "Tailored to your current track",
              url: res.url || "/resources"
            })) as Recommendation[];

            // Fallback to topics if no resources
            if (mapped.length === 0) {
              const topics = response.data.recommendedTopics || [];
              const fallbackMapped = topics.map((topic, index) => ({
                id: `rec-topic-${index}`,
                title: topic,
                type: "article",
                category: "Recommended",
                difficulty: "intermediate",
                estimatedTime: "15 min",
                reason: response.data.tip,
                url: "/resources"
              })) as Recommendation[];
              setRecommendations(fallbackMapped);
            } else {
              setRecommendations(mapped);
            }
          }
        }
      });
    }
  }, [isEnrolled, progressData, userData, activitiesData]);

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "code":
      case "tutorial":
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
        {!isEnrolled ? (
          <div className="text-center py-6 text-muted-foreground space-y-4">
            <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Unlock AI Recommendations</p>
              <p className="text-sm mt-1">Join a cohort to get personalized learning paths tailored to your progress.</p>
            </div>
            <Button variant="outline" asChild>
              {/* This links to dashboard effectively refreshing or just scrolling to top */}
              <Link href="/learner/dashboard">Find a Cohort</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
