import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Code, Video, FileText, TrendingUp, Lock } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useAI, SmartRecommendation } from "@/api/ai"
import { useAuthStore } from "@/store/authStore"

interface Recommendation {
  id: string
  title: string
  type: "article" | "video" | "code" | "documentation" | "tutorial" | "project" | "course"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  reason?: string
  description?: string
  url: string
}

export function AIRecommendationsCard() {
  const { getSmartRecommendations } = useAI();
  const { currentUser } = useAuthStore();
  const userId = currentUser?.id || "";
  
  // Use the new smart recommendations endpoint
  const { data: response, isLoading } = getSmartRecommendations(userId);
  
  // API function unwraps { success, data } so response IS the data directly
  // But if requiresSubscription is true, we get { requiresSubscription: true, message: '...' }
  const isSubscriptionRequired = (response as any)?.requiresSubscription === true;
  const recData = response as any;
  
  const recommendations: Recommendation[] = (recData?.recommendations || []).map(
    (rec: SmartRecommendation, index: number) => ({
      id: `rec-${index}`,
      title: rec.title,
      type: rec.type || "article",
      category: recData?.detectedSkill || "Tech Skills",
      difficulty: rec.difficulty || "beginner",
      estimatedTime: rec.estimatedTime || "15 min",
      reason: rec.description || recData?.tip || "Based on your learning activity",
      url: rec.url || "/resources"
    })
  );
  const tip = recData?.tip || "";
  const detectedSkill = recData?.detectedSkill || "general";
  const isDefault = recData?.isDefault === true;

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

  // Format skill name for display
  const formatSkillName = (skill: string) => {
    const names: Record<string, string> = {
      frontend: 'Frontend Development',
      backend: 'Backend Development',
      fullstack: 'Full-Stack Development',
      mobile: 'Mobile Development',
      uiux: 'UI/UX Design',
      datascience: 'Data Science & AI',
      dataanalysis: 'Data Analysis',
      devops: 'DevOps & Cloud',
      cybersecurity: 'Cybersecurity',
      blockchain: 'Blockchain & Web3',
      productmanagement: 'Product Management',
      digitalmarketing: 'Digital Marketing',
      contentwriting: 'Content Writing',
      qa: 'Quality Assurance',
      gamedev: 'Game Development',
      general: 'Tech Skills',
    };
    return names[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
  };

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
        <CardDescription>
          {detectedSkill !== "general" 
            ? `Personalized ${formatSkillName(detectedSkill)} resources based on your activity`
            : "Personalized learning suggestions based on your progress"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscriptionRequired ? (
          <div className="text-center py-6 text-muted-foreground space-y-4">
            <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Subscription Required</p>
              <p className="text-sm mt-1">Upgrade to get AI-powered learning recommendations tailored to your activities.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/subscription">View Plans</Link>
            </Button>
          </div>
        ) : isLoading ? (
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
        ) : recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground space-y-4">
            <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Log Your First Activity</p>
              <p className="text-sm mt-1">{tip || "Start logging your learning activities to get personalized AI recommendations."}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isDefault && tip && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
                💡 {tip}
              </p>
            )}
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
                      <Badge variant="outline">{formatSkillName(rec.category)}</Badge>
                      <span className="text-xs text-muted-foreground">{rec.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                  <a href={rec.url} target="_blank" rel="noopener noreferrer">Start Learning</a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
