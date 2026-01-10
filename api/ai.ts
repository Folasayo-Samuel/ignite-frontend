import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface AIRecommendationRequest {
  techTrack: string;
  currentDay: number;
  completedTopics: string[];
  strugglingAreas?: string[];
}

export interface AIRecommendationResponse {
  success: boolean;
  data: {
    recommendedTopics: string[];
    resources: { title: string; url: string; type: string }[];
    tip: string;
  };
}

export interface SmartRecommendation {
  title: string;
  description: string;
  type: "article" | "video" | "project" | "tutorial" | "course" | "documentation";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  url: string;
}

export interface SmartRecommendationsResponse {
  success: boolean;
  requiresSubscription?: boolean;
  message?: string;
  error?: string;
  data?: {
    recommendations: SmartRecommendation[];
    detectedSkill: string;
    tip: string;
    lastGeneratedAt?: string;
    cached?: boolean;
    isDefault?: boolean;
  };
}

export const useAI = () => {
  const getRecommendations = useApiMutation<AIRecommendationResponse, AIRecommendationRequest>({
    url: "/ai/recommendations",
    method: "POST",
  });

  // New smart recommendations endpoint with 24h activity-based refresh
  const getSmartRecommendations = (userId: string) =>
    useApiQuery<SmartRecommendationsResponse>(
      ["smart_recommendations", userId],
      {
        url: `/ai/smart-recommendations?userId=${userId}`,
        method: "GET",
      },
      {
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      }
    );

  return {
    getRecommendations,
    getSmartRecommendations,
  };
};
