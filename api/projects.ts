import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  author: string; // name
  authorAvatar?: string;
  country: string;
  track: string; // techTrack
  cohort: string; // cohortId or name
  likes: number; // count
  comments: number; // count
  githubUrl?: string;
  liveUrl?: string;
  createdAt?: string;
}

export const useProjects = () => {
  const getProjects = (filters?: {
    track?: string;
    country?: string;
    cohort?: string;
    search?: string;
  }) =>
    useApiQuery<{ success: boolean; data: Project[] }>(["projects", filters], {
      url: "/projects",
      method: "GET",
      params: filters,
    });

  const getProject = (id: string) =>
    useApiQuery<{ success: boolean; data: Project }>(["project", id], {
      url: `/projects/${id}`,
      method: "GET",
    });

  const likeProject = useApiMutation<{ success: boolean; data: { likes: number } }, { projectId: string }>({
    url: "/projects/like", // Placeholder endpoint
    method: "POST",
  });

  return {
    getProjects,
    getProject,
    likeProject,
  };
};
