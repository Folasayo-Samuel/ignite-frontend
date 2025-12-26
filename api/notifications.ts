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

  return {
    getNotifications,
    createNotification,
  };
};
