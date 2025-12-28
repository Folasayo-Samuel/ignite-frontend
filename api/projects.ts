import { useApiQuery } from "@/hooks/useApiQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hooks/apiFunction";
import { BASE_URL } from "@/constants";

export interface Project {
  id: string;
  _id: string; // Handle both id formats
  title: string;
  description: string;
  thumbnail?: string;
  author: string; // name
  authorAvatar?: string;
  country: string;
  track: string; // techTrack
  cohort: string; // cohortId
  likes: number; 
  comments: number; 
  githubUrl?: string;
  liveUrl?: string;
  createdAt?: string;
}

export interface Comment {
  _id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  userId: string;
}

export interface PaginatedProjects {
  items: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useProjects = () => {
  const queryClient = useQueryClient();

  const getProjects = (filters?: {
    track?: string;
    country?: string;
    cohort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    useApiQuery<PaginatedProjects>(["projects", filters], {
      url: "/projects",
      method: "GET",
      params: filters,
    });

  const getProject = (id: string) =>
    useApiQuery<Project>(["project", id], {
      url: `/projects/${id}`,
      method: "GET",
    });

  // Get comments for a project
  const getComments = (projectId: string) =>
    useApiQuery<Comment[]>(["comments", projectId], {
      url: `/projects/${projectId}/comments`,
      method: "GET",
    });

  // Toggle like
  const likeProject = useMutation<{ liked: boolean }, Error, { projectId: string }>({
    mutationFn: async ({ projectId }) => {
      return api<{ liked: boolean }>({
        url: `/projects/${projectId}/like`,
        method: "POST",
        data: {},
      });
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate projects list and specific project
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  // Add comment
  const addComment = useMutation<Comment, Error, { projectId: string; content: string }>({
    mutationFn: async ({ projectId, content }) => {
      return api<Comment>({
        url: `/projects/${projectId}/comments`,
        method: "POST",
        data: { content },
      });
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate comments
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
      // Invalidate project to update comment count
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    getProjects,
    getProject,
    getComments,
    likeProject,
    addComment,
  };
};
