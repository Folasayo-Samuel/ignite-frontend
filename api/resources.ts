import { ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Resource {
  _id: ID;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'tool' | 'course' | 'doc';
  skills: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // minutes
  author?: string;
  thumbnail?: string;
  popularityScore: number;
  clicks: number;
  isPremium: boolean;
  createdAt: string;
}

export interface ResourceResponse {
  items: Resource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
  suggestions?: any[];
}

export const useResources = () => {
  const searchResources = (params: { 
    q?: string; 
    skills?: string; 
    format?: string; 
    page?: number; 
    limit?: number 
  }) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append("q", params.q);
    if (params.skills) queryParams.append("skills", params.skills);
    if (params.format) queryParams.append("format", params.format);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    return useApiQuery<ResourceResponse>(
      ["resources_search", params], 
      {
        url: `/students/resources/search?${queryParams.toString()}`,
        method: "GET",
      }
    );
  };

  const getPersonalizedResources = (params: { q?: string; page?: number; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append("q", params.q);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    return useApiQuery<ResourceResponse>(
      ["resources_personalized", params],
      {
        url: `/students/resources/personalized?${queryParams.toString()}`,
        method: "GET",
      }
    );
  };

  const getPopularResources = (params: { skills?: string; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skills) queryParams.append("skills", params.skills);
    if (params.limit) queryParams.append("limit", params.limit.toString());

    return useApiQuery<ResourceResponse>(
      ["resources_popular", params],
      {
        url: `/students/resources/popular?${queryParams.toString()}`,
        method: "GET",
      }
    );
  };

  const useTrackResourceClick = (resourceId: string) => 
     useApiMutation<any, void>({
         url: `/students/resources/${resourceId}/click`,
         method: "POST"
     });

  return {
    searchResources,
    getPersonalizedResources,
    getPopularResources,
    useTrackResourceClick, 
  };
};
