import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";
import React, { useState, useEffect } from "react";

export interface SSEConnection {
  url: string;
  connected: boolean;
  lastEvent?: any;
  error?: string;
}

export interface RealtimeEvent {
  type:
    | "message"
    | "notification"
    | "session_update"
    | "progress_update"
    | "system";
  data: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface NotificationPreference {
  _id: ID;
  userId: ID;
  type: "email" | "push" | "in_app";
  enabled: boolean;
  settings: {
    mentor_messages?: boolean;
    session_reminders?: boolean;
    progress_updates?: boolean;
    system_updates?: boolean;
    marketing?: boolean;
  };
}

export const useRealtime = () => {
  // SSE connection management
  const connectSSE = (userId: string) => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/realtime/sse/${userId}`,
    );

    return {
      eventSource,
      onMessage: (callback: (event: RealtimeEvent) => void) => {
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            callback(data);
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        };
      },
      onError: (callback: (error: Event) => void) => {
        eventSource.onerror = callback;
      },
      close: () => {
        eventSource.close();
      },
    };
  };

  // Notification preferences
  const getNotificationPreferences = () =>
    useApiQuery<{ success: boolean; data: NotificationPreference[] }>(
      ["notification-preferences"],
      {
        url: "/notifications/preferences",
        method: "GET",
      },
    );

  const updateNotificationPreferences = useApiMutation<
    { success: boolean; data: NotificationPreference },
    Partial<NotificationPreference>
  >({
    url: "/notifications/preferences",
    method: "PATCH",
  });

  // Notification management
  const getNotifications = (unreadOnly?: boolean) =>
    useApiQuery<{ success: boolean; data: any[] }>(
      ["notifications", unreadOnly],
      {
        url: `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`,
        method: "GET",
      },
    );

  const markNotificationAsRead = (notificationId: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/notifications/${notificationId}/read`,
      method: "POST",
    });

  const markAllNotificationsAsRead = () =>
    useApiMutation<{ success: boolean }, void>({
      url: "/notifications/mark-all-read",
      method: "POST",
    });

  const deleteNotification = (notificationId: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/notifications/${notificationId}`,
      method: "DELETE",
    });

  return {
    connectSSE,
    getNotificationPreferences,
    updateNotificationPreferences,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  };
};

// Custom hook for SSE connection management
export const useSSEConnection = (
  userId: string,
  onEvent?: (event: RealtimeEvent) => void,
) => {
  const [connection, setConnection] = useState<SSEConnection | null>(null);
  
  // Store onEvent in a ref to avoid infinite re-render loops from unstable callback references
  const onEventRef = React.useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!userId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const eventSource = new EventSource(`${apiUrl}/realtime/sse/${userId}`);

    setConnection({
      url: `${apiUrl}/realtime/sse/${userId}`,
      connected: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEventRef.current?.(data);
        setConnection((prev) =>
          prev
            ? {
                ...prev,
                lastEvent: data,
                connected: true,
                error: undefined,
              }
            : null,
        );
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = (error: any) => {
      setConnection((prev) =>
        prev
          ? {
              ...prev,
              connected: false,
              error: error.type,
            }
          : null,
      );
    };

    return () => {
      eventSource.close();
      setConnection((prev) =>
        prev
          ? {
              ...prev,
              connected: false,
            }
          : null,
      );
    };
  }, [userId]);

  return connection;
};
