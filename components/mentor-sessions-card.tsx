"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MessageSquare } from "lucide-react"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ScheduleSessionModal } from "@/components/mentor/schedule-session-modal"

export function MentorSessionsCard() {
  const { getUpcoming } = useMentorDashboard();
  const { data: result, isLoading } = getUpcoming();
  const sessions = (result as any)?.data || [];

  const handleJoinSession = (sessionId: string, type: string) => {
    if (type === "video") {
      alert(`Joining video session ${sessionId}. In production, this would open the video conference link.`)
    } else {
      alert(`Opening chat for session ${sessionId}. In production, this would open the messaging interface.`)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled mentoring sessions</CardDescription>
        </div>
        <ScheduleSessionModal />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming sessions.</p>
          ) : (
            sessions.map((session: any) => (
              <div key={session._id || session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={session.studentAvatar || "/placeholder.svg"} alt={session.studentName} />
                    <AvatarFallback>
                      {(session.studentName || "S")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold">{session.studentName}</p>
                    <p className="text-sm text-muted-foreground">{session.topic || "Mentoring Session"}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.scheduledAt ? format(new Date(session.scheduledAt), "MMM d, h:mm a") : "TBD"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.durationMin || 60} mins
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {(session.type || "video") === "video" ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <MessageSquare className="h-3 w-3 mr-1" />
                    )}
                    {session.type || "video"}
                  </Badge>
                  <Button size="sm" onClick={() => handleJoinSession(session._id || session.id, session.type || "video")}>
                    Join
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
