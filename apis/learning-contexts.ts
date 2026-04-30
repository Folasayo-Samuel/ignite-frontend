import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";

export interface LearningContext {
  _id: ID;
  name: string;
  description: string;
  type: "track" | "course" | "module" | "lesson";
  parentId?: ID;
  content?: any;
  order: number;
  isPublished: boolean;
  metadata?: {
    difficulty?: string;
    duration?: number;
    prerequisites?: ID[];
    learningObjectives?: string[];
    tags?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  _id: ID;
  userId: ID;
  contextId: ID;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  timeSpent: number;
  completedAt?: string;
  lastAccessedAt: string;
  metadata?: {
    score?: number;
    attempts?: number;
    feedback?: string;
  };
}

export interface CreateLearningContextDto {
  name: string;
  description: string;
  type: "track" | "course" | "module" | "lesson";
  parentId?: ID;
  content?: any;
  order: number;
  isPublished?: boolean;
  metadata?: {
    difficulty?: string;
    duration?: number;
    prerequisites?: ID[];
    learningObjectives?: string[];
    tags?: string[];
  };
}

export interface UpdateLearningContextDto {
  name?: string;
  description?: string;
  content?: any;
  order?: number;
  isPublished?: boolean;
  metadata?: {
    difficulty?: string;
    duration?: number;
    prerequisites?: ID[];
    learningObjectives?: string[];
    tags?: string[];
  };
}

export interface LogActivityDto {
  contextId: ID;
  activityType: "start" | "progress" | "complete" | "pause";
  progress?: number;
  timeSpent?: number;
  metadata?: any;
}

export const useLearningContexts = () => {
  // Learning context management
  const getContexts = (type?: string, parentId?: string) =>
    useApiQuery<{ success: boolean; data: LearningContext[] }>(
      ["learning-contexts", type, parentId],
      {
        url: `/learning-context${type ? `?type=${type}` : ""}${parentId ? `&parentId=${parentId}` : ""}`,
        method: "GET",
      },
    );

  const getContext = (id: string) =>
    useApiQuery<{ success: boolean; data: LearningContext }>(
      ["learning-context", id],
      {
        url: `/learning-context/${id}`,
        method: "GET",
      },
    );

  const createContext = useApiMutation<
    { success: boolean; data: LearningContext },
    CreateLearningContextDto
  >({
    url: "/learning-context",
    method: "POST",
  });

  const updateContext = (id: string) =>
    useApiMutation<
      { success: boolean; data: LearningContext },
      UpdateLearningContextDto
    >({
      url: `/learning-context/${id}`,
      method: "PATCH",
    });

  const deleteContext = (id: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/learning-context/${id}`,
      method: "DELETE",
    });

  // Learning progress management
  const getProgress = (contextId?: string) =>
    useApiQuery<{ success: boolean; data: LearningProgress[] }>(
      ["learning-progress", contextId],
      {
        url: `/learning-progress${contextId ? `?contextId=${contextId}` : ""}`,
        method: "GET",
      },
    );

  const getContextProgress = (contextId: string) =>
    useApiQuery<{ success: boolean; data: LearningProgress }>(
      ["learning-progress", contextId],
      {
        url: `/learning-progress/${contextId}`,
        method: "GET",
      },
    );

  const logActivity = useApiMutation<{ success: boolean }, LogActivityDto>({
    url: "/learning-progress/log",
    method: "POST",
  });

  // Switch learning context
  const switchContext = useApiMutation<
    { success: boolean },
    { contextId: string }
  >({
    url: "/learning-context/switch",
    method: "POST",
  });

  return {
    getContexts,
    getContext,
    createContext,
    updateContext,
    deleteContext,
    getProgress,
    getContextProgress,
    logActivity,
    switchContext,
  };
};
