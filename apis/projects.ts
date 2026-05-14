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
  isPublished?: boolean;
  views?: number;
  techStack?: string;
  thumbnailUrl?: string;
}

// Utility to get normalized project ID
export const getProjectId = (project: Project): string => {
  return project.id || project._id;
};

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

  // Get comments for a project (only fetches when enabled is true or undefined)
  const getComments = (projectId: string, options?: { enabled?: boolean }) =>
    useApiQuery<Comment[]>(
      ["comments", projectId], 
      {
        url: `/projects/${projectId}/comments`,
        method: "GET",
      },
      { enabled: options?.enabled !== false && !!projectId }
    );

  const likeProject = useMutation<{ liked: boolean }, Error, { projectId: string }>({
    mutationFn: async ({ projectId }) => {
      return api<{ liked: boolean }>({
        url: `/projects/${projectId}/like`,
        method: "POST",
        data: {},
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  const incrementView = useMutation<{ success: boolean }, Error, { projectId: string }>({
    mutationFn: async ({ projectId }) => {
      return api<{ success: boolean }>({
        url: `/projects/${projectId}/view`,
        method: "PATCH",
        data: {},
      });
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  const createProject = useMutation<Project, Error, Partial<Project>>({
    mutationFn: async (data) => {
      return api<Project>({
        url: "/projects",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const editProject = useMutation<Project, Error, { projectId: string; data: Partial<Project> }>({
    mutationFn: async ({ projectId, data }) => {
      return api<Project>({
        url: `/projects/${projectId}`,
        method: "PATCH",
        data,
      });
    },
    onSuccess: (_, { projectId }) => {
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
    incrementView,
    createProject,
    editProject,
    addComment,
  };
};
