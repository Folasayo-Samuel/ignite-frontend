"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Bell, Check, Award, MessageSquare, Users, Calendar,
  DollarSign, TrendingUp, BookOpen, AlertCircle, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"
import { useNotifications, Notification } from "@/api/notifications"
import { useAuthStore } from "@/store/authStore"
import { useSocket } from "@/components/providers/socket-provider"
import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const currentUserId = currentUser?.id as string
  const { getNotifications, markAllRead, markAsRead } = useNotifications(currentUserId)

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = getNotifications(30)

  const { mutateAsync: markAll } = markAllRead
  const { mutateAsync: markSingleAsync } = markAsRead

  const [optimisticallyReadIds, setOptimisticallyReadIds] = useState<Set<string>>(new Set())

  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()

  // Real-time listener
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count", currentUser?.id] })
    }

    socket.on("notifications.created", handleNewNotification)
    return () => { socket.off("notifications.created", handleNewNotification) }
  }, [socket, isConnected, queryClient, currentUser?.id])

  // Flatten pages
  const notifications: Notification[] = infiniteData?.pages.flatMap((page: any) => {
    if (page && page.items) return page.items
    if (Array.isArray(page)) return page
    return []
  }) || []

  const unreadCount = notifications.filter(
    (n) => !n.readAt && !optimisticallyReadIds.has(String(n._id))
  ).length

  const handleMarkAllRead = async () => {
    if (!currentUser?.id) return

    const allUnreadIds = notifications
      .filter((n) => !n.readAt)
      .map((n) => String(n._id))

    setOptimisticallyReadIds((prev) => {
      const newSet = new Set(prev)
      allUnreadIds.forEach((id) => newSet.add(id))
      return newSet
    })

    try {
      await markAll({ userId: String(currentUser.id) })
    } finally {
      queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] })
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count", currentUser?.id] })
    }
  }

  const handleClick = async (notification: Notification) => {
    const nId = String(notification._id)

    // Optimistic read
    if (!notification.readAt && !optimisticallyReadIds.has(nId)) {
      setOptimisticallyReadIds((prev) => new Set(prev).add(nId))
      markSingleAsync({ id: nId }).catch(() => {}).finally(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications", currentUser?.id] })
        queryClient.invalidateQueries({ queryKey: ["notifications-unread-count", currentUser?.id] })
      })
    }

    // Navigate
    if (notification.meta?.targetUrl) {
      const url = notification.meta.targetUrl
      if (url.startsWith("http") && !url.includes(window.location.host)) {
        window.open(url, "_blank")
      } else {
        const path = url.replace(/^https?:\/\/[^/]+/, "")
        router.push(path)
      }
      return
    }

    // Fallback routing by type
    switch (notification.type) {
      case "daily_reminder":
      case "cohort":
      case "achievement":
      case "streak_reminder":
      case "discipline_missed_day":
        router.push("/learner/dashboard")
        break
      case "new_session_request":
        router.push("/mentor/dashboard")
        break
      case "commission":
        router.push("/partner/dashboard")
        break
      default:
        break
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "achievement":
      case "badge_awarded":
      case "streak_reminder":
        return <Award className="h-5 w-5 text-orange-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "cohort":
      case "cohort_completed":
        return <Users className="h-5 w-5 text-green-500" />
      case "daily_reminder":
      case "reminder":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "discipline_missed_day":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "commission":
        return <DollarSign className="h-5 w-5 text-emerald-500" />
      case "weekly_challenge":
        return <TrendingUp className="h-5 w-5 text-amber-500" />
      case "forum_spotlight":
      case "forum_weekly_recap":
        return <Sparkles className="h-5 w-5 text-yellow-500" />
      case "enrollment":
        return <BookOpen className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      achievement: "Achievement",
      badge_awarded: "Badge Earned",
      streak_reminder: "Streak Reminder",
      comment: "Comment",
      cohort: "Cohort",
      cohort_completed: "Cohort Complete",
      daily_reminder: "Daily Reminder",
      reminder: "Reminder",
      discipline_missed_day: "Missed Day",
      commission: "Commission",
      weekly_challenge: "Weekly Challenge",
      forum_spotlight: "Spotlight",
      forum_weekly_recap: "Weekly Recap",
      enrollment: "Enrollment",
      manual: "Notification",
    }
    return map[type] || type.replace(/_/g, " ")
  }

  return (
    <main className="min-h-screen flex flex-col bg-muted/20">
      <Navigation />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-background rounded-lg border">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              When something happens, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const isRead = !!notification.readAt || optimisticallyReadIds.has(String(notification._id))
              return (
                <div
                  key={notification._id}
                  className={`
                    flex gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200
                    hover:shadow-sm hover:border-primary/20
                    ${isRead ? "bg-background opacity-75" : "bg-background border-l-4 border-l-primary"}
                  `}
                  onClick={() => handleClick(notification)}
                >
                  <div className="mt-0.5 shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize shrink-0">
                        {getTypeLabel(notification.type)}
                      </Badge>
                      {!isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground ml-auto shrink-0">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              )
            })}

            {hasNextPage && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
