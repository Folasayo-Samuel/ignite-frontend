import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/api/type";

export interface Discussion {
  id: string;
  _id?: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  categories: string[];
  replies: number;
  likes: number[];
  views: number;
  solved: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export const normalizeDiscussions = (data: Discussion[] | PaginatedResponse<Discussion> | undefined): Discussion[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items || [];
};

export const useDiscussions = () => {
  const getDiscussions = () =>
    useApiQuery<{ success: boolean; data: Discussion[] | PaginatedResponse<Discussion> }>(["discussions"], {
      url: "/discussions",
      method: "GET",
    });

  const createDiscussion = useApiMutation<{ success: boolean; data: Discussion }, { title: string; studentId: string; categories: string[]; content: string }>({
    url: "/discussions",
    method: "POST",
  });

  return {
    getDiscussions,
    createDiscussion,
  };
};

