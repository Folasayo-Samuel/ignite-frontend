import { ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Notification {
  _id: ID;
  toUserId?: string;
  toEmail?: string;
  type: string;
  message: string;
  meta?: Record<string, any>;
  readAt?: string;
  createdAt: string;
}

export const useNotifications = (userId?: string) => {
  const getNotifications = () =>
    useApiQuery<Notification[]>(["notifications", userId], {
      url: `/notifications${userId ? `?userId=${userId}` : ''}`,
      method: "GET",
    });

  const createNotification = useApiMutation<
    { success: boolean; data: Notification },
    {
      to?: string;
      toUserId?: string;
      type?: string;
      message: string;
    }
  >({
    url: "/notifications",
    method: "POST",
  });

  const markAsRead = useApiMutation<{ success: boolean }, { id: string }>({
    url: "/notifications/:id/read", // useApiMutation handles dynamic params usually or we might need to manually construct URL in execution override if it doesn't
    method: "POST",
  });

  // Since useApiMutation might not support dynamic route params easily without a wrapper, 
  // we'll define a specific helper or rely on the caller to format correct URL if needed 
  // but typically we pass the dynamic part in the mutation call if the hook supports it. 
  // Let's assume standard pattern or return a specific function for it.

  const markAllRead = useApiMutation<{ success: boolean }, { userId: string }>({
    url: "/notifications/mark-all-read",
    method: "POST",
  });

  return {
    getNotifications,
    createNotification,
    markAsRead,
    markAllRead
  };
};
