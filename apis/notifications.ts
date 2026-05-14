import { ID } from "@/components/apis/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiInfiniteQuery } from "@/hooks/useApiInfiniteQuery";

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

export interface NotificationResponse {
  items: Notification[];
  nextCursor?: string;
}

export const useNotifications = (userId?: string) => {
  const getNotifications = (limit: number = 20) =>
    useApiInfiniteQuery<NotificationResponse | Notification[]>(
      ["notifications", userId],
      {
        url: `/notifications${userId ? `?userId=${userId}` : ""}`,
        method: "GET",
        params: { limit },
      },
    );

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
    url: (vars) => `/notifications/${vars.id}/read`,
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

  const getUnreadCount = (userId?: string) =>
    useApiQuery<{ count: number }>(
      ["notifications-unread-count", userId],
      {
        url: `/notifications/unread-count${userId ? `?userId=${userId}` : ""}`,
        method: "GET",
      },
    );

  return {
    getNotifications,
    createNotification,
    markAsRead,
    markAllRead,
    getUnreadCount,
  };
};

