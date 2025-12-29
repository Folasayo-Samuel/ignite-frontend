import { useApiMutation } from "@/hooks/useApiMutation";

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

export const useAI = () => {
  const getRecommendations = useApiMutation<AIRecommendationResponse, AIRecommendationRequest>({
    url: "/ai/recommendations",
    method: "POST",
  });

  return {
    getRecommendations,
  };
};
