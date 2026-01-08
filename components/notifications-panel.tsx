"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, X, Award, MessageSquare, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Skeleton } from "@/components/ui/skeleton"
import { useNotifications, Notification } from "@/api/notifications"
import { useAuthStore } from "@/store/authStore"
import { useSocket } from "@/components/providers/socket-provider"
import { useQueryClient } from "@tanstack/react-query"

export function NotificationsPanel() {
  const { currentUser } = useAuthStore();
  const currentUserId = currentUser?.id as string;
  const { getNotifications, markAllRead, markAsRead } = useNotifications(currentUserId);

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = getNotifications();

  const { mutateAsync: markAll } = markAllRead;
  const { mutate: markSingle } = markAsRead;
  const router = useRouter();

  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  // Real-time listener
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (payload: any) => {
      console.log("🔔 Real-time notification:", payload);
      // Verify it is for this user if payload contains target info, though socket room usually handles this.
      // Invalidate to fetch the new notification at the top.
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] });
    };

    socket.on("notifications.created", handleNewNotification);

    return () => {
      socket.off("notifications.created", handleNewNotification);
    };
  }, [socket, isConnected, queryClient, currentUser?.id]);


  // Flatten pages
  const notifications = infiniteData?.pages.flatMap((page: any) => {
    // Page can be { items: [...], nextCursor: ... } or just [...]
    if (page && page.items) return page.items;
    if (Array.isArray(page)) return page;
    return [];
  }) || [];

  // Grouping Logic
  type GroupedNotification = Notification & { count?: number; others?: string[]; ids?: string[] };

  const groupNotifications = (notifs: Notification[]): GroupedNotification[] => {
    const grouped: GroupedNotification[] = [];
    const lookup: Record<string, GroupedNotification> = {};

    notifs.forEach((n) => {
      const dateKey = new Date(n.createdAt).toDateString();
      const key = `${n.type}-${n.meta?.targetId || n.message}-${dateKey}`;

      if (lookup[key]) {
        lookup[key].count = (lookup[key].count || 1) + 1;
        if (n.meta?.actorName) {
          lookup[key].others = [...(lookup[key].others || []), n.meta.actorName];
        }
        if (lookup[key].ids && !n.readAt) {
          lookup[key].ids.push(String(n._id));
        }
      } else {
        // Initialize with current ID if unread
        const ids = !n.readAt ? [String(n._id)] : [];
        const newItem = { ...n, count: 1, others: n.meta?.actorName ? [n.meta.actorName] : [], ids };
        lookup[key] = newItem;
        grouped.push(newItem);
      }
    });

    return grouped;
  };

  const groupedNotifications = groupNotifications(notifications);
  const unreadCount = notifications.filter((n: Notification) => !n.readAt).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    try {
      await markAll({ userId: currentUser.id });
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] });
    } catch { }
  };

  const handleNotificationClick = async (notification: GroupedNotification) => {
    // Mark all unread IDs in this group as read
    if (notification.ids && notification.ids.length > 0) {
      // Parallel requests - acceptable for small groups (usually < 5)
      // Ideally backend should support markMany but this fixes the UI bug now.
      notification.ids.forEach(id => markSingle({ id }));

      // Optimistic update could be complex, so we rely on invalidation
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] });
    } else if (!notification.readAt) {
      // Fallback for single
      markSingle({ id: String(notification._id) });
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] });
    }

    // Deep linking priority
    // Deep linking priority
    if (notification.meta?.targetUrl) {
      // If relative URL (starts with /), push to router
      // If absolute internal (starts with app domain), clean and push
      // If external, window.open
      const url = notification.meta.targetUrl;
      if (url.startsWith('http') && !url.includes(window.location.host)) {
        window.open(url, '_blank');
      } else {
        // Strip domain if present to use Next.js router
        const path = url.replace(/^https?:\/\/[^\/]+/, '');
        router.push(path);
      }
      return;
    }

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
            <div className="divide-y">
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
              {/* Load More Button */}
              {hasNextPage && (
                <div className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchNextPage();
                    }}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
