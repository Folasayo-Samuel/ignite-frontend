"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, X, Award, MessageSquare, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Skeleton } from "@/components/ui/skeleton"
import { useNotifications, Notification } from "@/api/notifications"
import { useAuthStore } from "@/store/authStore"

export function NotificationsPanel() {
  const { currentUser } = useAuthStore();
  const { getNotifications, markAllRead, markAsRead } = useNotifications(currentUser?.id as string);
  const { data: notificationsData, isLoading } = getNotifications();
  const { mutateAsync: markAll } = markAllRead;
  const { mutate: markSingle } = markAsRead;
  const router = useRouter();

  // Grouping Logic
  type GroupedNotification = Notification & { count?: number; others?: string[] };

  const groupNotifications = (notifs: Notification[]): GroupedNotification[] => {
    const grouped: GroupedNotification[] = [];
    const lookup: Record<string, GroupedNotification> = {};

    notifs.forEach((n) => {
      // Create a unique key for grouping: type + specific target ID (if exists) + roughly similar time (same day)
      // For simplicity and effectiveness, we group by type and message similarity or a specific meta ID if available.
      // Here we'll use a simple heuristic: Group "like" or "follow" events that happen on the same day.
      const dateKey = new Date(n.createdAt).toDateString();
      const key = `${n.type}-${n.meta?.targetId || n.message}-${dateKey}`;

      if (lookup[key]) {
        lookup[key].count = (lookup[key].count || 1) + 1;
        // Collect names if available in meta, otherwise just count
        if (n.meta?.actorName) {
          lookup[key].others = [...(lookup[key].others || []), n.meta.actorName];
        }
      } else {
        const newItem = { ...n, count: 1, others: n.meta?.actorName ? [n.meta.actorName] : [] };
        lookup[key] = newItem;
        grouped.push(newItem);
      }
    });

    return grouped;
  };

  // Handle both wrapped {success, data} and unwrapped responses from api() function
  const notifications = (notificationsData as any)?.data || (Array.isArray(notificationsData) ? notificationsData : []);
  const groupedNotifications = groupNotifications(notifications);
  const unreadCount = notifications.filter((n: Notification) => !n.readAt).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    try {
      await markAll({ userId: currentUser.id });
    } catch { }
  };

  const handleNotificationClick = (notification: GroupedNotification) => {
    // Mark as read
    if (!notification.readAt) {
      markSingle({ id: String(notification._id) });
    }

    // Redirect based on type
    switch (notification.type) {
      case "new_session_request":
        router.push("/mentor/dashboard");
        break;
      case "cohort":
        router.push("/learner/dashboard");
        break;
      case "achievement":
        router.push("/learner/dashboard");
        break;
      default:
        // Default behavior or specific fallback
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Award className="h-4 w-4 text-orange-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "cohort":
        return <Users className="h-4 w-4 text-green-500" />
      case "reminder":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Helper to format time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleDateString();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : groupedNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y max-h-[400px]">
              {groupedNotifications.map((notification: GroupedNotification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-accent transition-colors cursor-pointer ${!notification.readAt ? 'bg-accent/20' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm capitalize">{notification.type}</p>
                        {!notification.readAt && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.count && notification.count > 1
                          ? `${notification.message} (and ${notification.count - 1} others)`
                          : notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
