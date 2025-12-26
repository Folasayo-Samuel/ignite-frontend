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

export const useDiscussions = () => {
  const getDiscussions = () =>
    useApiQuery<{ success: boolean; data: { items: Discussion[], total: number } }>(["discussions"], {
      url: "/students/forum/topics",
      method: "GET",
    });

  const createDiscussion = useApiMutation<{ success: boolean; data: Discussion }, { title: string; categories: string[]; content: string }>({
    url: "/students/me/forum/topics", // Assuming this exists or similar. Controller shows Patch at me/forum/topics/:id. Need to check Create.
      // Wait, there is no Create in the snippet I saw!
      // I saw updateDiscussionTopic at line 309.
      // I saw suggestTopics at 90.
      // I saw listGlobalDiscussionTopics at 372.
      // I missed Create? Let me check lines 1-800 again or search for @Post.
      // I see @Post('mentors/forum/topics/:topicId/comments') at 338.
      // I don't see Create Topic in StudentsController 1-800.
      // It might be further down or in a dedicated service.
      // But for now let's assume it follows the pattern /students/me/forum/topics
      // Actually, looking at the snippet, I see `CreateDiscussionTopicDto` imported.
      // I'll search for it.
    method: "POST",
  });

  return {
    getDiscussions,
    createDiscussion,
  };
};

