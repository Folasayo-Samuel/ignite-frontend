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

    return useApiQuery<{ success: boolean; data: ResourceResponse }>(
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

    return useApiQuery<{ success: boolean; data: ResourceResponse }>(
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

    return useApiQuery<{ success: boolean; data: ResourceResponse }>(
      ["resources_popular", params],
      {
        url: `/students/resources/popular?${queryParams.toString()}`,
        method: "GET",
      }
    );
  };

  const trackResourceClick = useApiMutation<{ success: boolean; data: any }, void>({
    url: "/students/resources/:id/click", // Note: The actual call needs to replace :id dynamically
    method: "POST",
  });

  // Helper to call track click with dynamic ID
  const trackClick = (resourceId: string) => {
      // Since useApiMutation defines a static URL structure in simple usage, 
      // we might typically use a specific hook for this or handle it differently.
      // But adhering to the pattern, we can create a dynamic mutation or just standard api call.
      // For consistency with other files, let's look at how dynamic paths are handled (usually passed URL in mutation call if supported, or closure).
      // Here we will rely on a pattern where we might not be able to change URL easily with the current useApiMutation signature if it's strict.
      // OPTION: We return a closure that calls a specific mutation, or we use a fresh mutation per call? 
      // The current pattern in api/student.ts (updateProject) creates a hook that returns a mutation execution function is tricky. 
      // Actually, updateProject in student.ts returns the result of useApiMutation called inside the function scope? No, hooks rules.
      
      // Pattern correction:
      // In student.ts:
      // const updateProject = (projectId: string) => useApiMutation(...)
      // This violates hook rules if called inside a component conditionally or strictly.
      // Correct pattern: Call useApiMutation once with a generalized URL or use a specialized component.
      // However, seeing previous student.ts, `updateProject` IS a hook factory function. 
      // So `const { mutate } = useResources().trackResourceClick(id)` is how it's likely used.
      
      // We will follow the factory pattern used in student.ts for specific IDs.
  };
  
  const useTrackResourceClick = (resourceId: string) => 
     useApiMutation<{ success: boolean; data: any }, void>({
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
