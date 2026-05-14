import { useApiQuery } from "@/hooks/useApiQuery";
import { ID } from "@/components/apis/type";

export interface Resource {
  id: ID;
  title: string;
  type: "article" | "video" | "documentation" | "code" | "course";
  category: string;
  url: string;
  description: string;
  skills: string[];
}

export const useResources = () => {
  const searchResources = (query: string, category: string | null) =>
    useApiQuery<{ items: any[] }>(["resources", query, category || ""], {
      url: "/students/resources/search",
      method: "GET",
      params: {
        q: query,
        skills: category,
        limit: 20,
      },
    });

  const getPopularResources = (params?: { limit?: number }) =>
    useApiQuery<{ items: any[] }>(["resources", "popular", params?.limit], {
      url: "/students/resources/popular", // Assuming this endpoint exists, or fallback to search if not
      method: "GET",
      params,
    });

  return {
    searchResources,
    getPopularResources,
  };
};
