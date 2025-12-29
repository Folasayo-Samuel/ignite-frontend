"use client"

import { useState } from "react"
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
  const { getNotifications } = useNotifications(currentUser?.id as string);
  const { data: notificationsData, isLoading } = getNotifications();

  // The backend returns { success: true, data: [...] }
  const notifications = (notificationsData as any)?.data || [];
  const unreadCount = notifications.length; // Simply count all for now as "read" status isn't clear in backend typings yet

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
          {/* Mark all read functionality requires a backend endpoint not present yet */}
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
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  className="p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.type}</p>
                        {/* Delete functionality requires backend endpoint */}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
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
