import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";

export interface DiscussionAuthor {
  id?: string;
  name: string;
  avatar: string;
  role?: "student" | "mentor" | "admin";
}

export interface DiscussionComment {
  id: string;
  content: string;
  author: DiscussionAuthor;
  createdAt: string;
}

export interface Discussion {
  id: string;
  _id?: string;
  title: string;
  content: string;
  author: DiscussionAuthor;
  categories: string[];
  replies: number;
  likes: string[];
  likesCount?: number;
  views?: number;
  solved: boolean;
  createdAt: string;
  comments?: DiscussionComment[];
}

// Check if user can create discussion topics
export interface CanCreateResponse {
  success: boolean;
  canCreate: boolean;
  reason?: "MENTOR_CANNOT_CREATE" | "NO_ACTIVE_SUBSCRIPTION" | "NOT_LOGGED_IN";
  message?: string;
}

export const useCanCreateDiscussion = (userId: string, role: string) => {
  return useApiQuery<CanCreateResponse>(
    ["canCreateDiscussion", userId, role],
    {
      url: `/discussions/check/can-create?userId=${userId}&role=${role}`,
      method: "GET",
    },
    {
      enabled: !!userId,
      staleTime: 60 * 1000, // Cache for 1 minute
    },
  );
};

export const useDiscussions = () => {
  const getDiscussions = () =>
    useApiQuery<{ success: boolean; data: any }>(["discussions"], {
      url: "/discussions",
      method: "GET",
    });

  // Updated to include userId and role for subscription check
  const createDiscussion = useApiMutation<
    { success: boolean; data: Discussion },
    {
      title: string;
      studentId: string;
      userId?: string;
      role?: string;
      categories: string[];
      content: string;
      authorName?: string;
      authorAvatar?: string;
    }
  >({
    url: "/discussions",
    method: "POST",
  });

  return {
    getDiscussions,
    createDiscussion,
  };
};

// Hook for single discussion with comments - OPTIMIZED with caching
export const useDiscussion = (id: string) => {
  return useApiQuery<{ success: boolean; data: Discussion }>(
    ["discussion", id],
    {
      url: `/discussions/${id}`,
      method: "GET",
    },
    {
      enabled: !!id,
      staleTime: 30 * 1000, // Cache for 30 seconds
      gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    },
  );
};

// Hook for adding a comment
export const useAddComment = (discussionId: string) => {
  return useApiMutation<
    { success: boolean; data: DiscussionComment },
    {
      authorId: string;
      authorName: string;
      authorAvatar?: string;
      authorRole: "student" | "mentor" | "admin";
      content: string;
    }
  >({
    url: `/discussions/${discussionId}/comments`,
    method: "POST",
  });
};

// Hook for liking a discussion
export const useLikeDiscussion = (discussionId: string) => {
  return useApiMutation<
    { success: boolean; data: { liked: boolean; likesCount: number } },
    { userId: string }
  >({
    url: `/discussions/${discussionId}/like`,
    method: "POST",
  });
};

// Hook for marking discussion as solved
export const useToggleSolved = (discussionId: string) => {
  return useApiMutation<
    { success: boolean; data: { solved: boolean } },
    { userId: string }
  >({
    url: `/discussions/${discussionId}/solved`,
    method: "PATCH",
  });
};
