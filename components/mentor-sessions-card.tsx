"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MessageSquare, ExternalLink } from "lucide-react"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ScheduleSessionModal } from "@/components/mentor/schedule-session-modal"
import { toast } from "sonner"
import Link from "next/link"

export function MentorSessionsCard() {
  const { getUpcoming } = useMentorDashboard();
  const { data: sessionsResult, isLoading } = getUpcoming();
  const sessions = sessionsResult || [];

  const handleJoinSession = (session: any) => {
    const sessionType = session.type || session.mode || "video";
    const joinUrl = session.joinUrl || session.meetingLink;

    if (sessionType === "video" || sessionType === "code") {
      if (joinUrl) {
        // Open the actual meeting link
        window.open(joinUrl, "_blank", "noopener,noreferrer");
      } else {
        // Generate a fallback Google Meet link
        const meetLink = `https://meet.google.com/new`;
        toast.info("No meeting link set. Opening Google Meet...");
        window.open(meetLink, "_blank", "noopener,noreferrer");
      }
    } else if (sessionType === "chat") {
      // Navigate to messaging with this student
      const studentId = session.studentId;
      if (studentId) {
        window.location.href = `/mentor/messages/${studentId}`;
      } else {
        toast.error("Unable to open chat - student not found");
      }
    }
  };

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
                    <AvatarImage
                      src={session.studentAvatar || (typeof session.studentId !== 'string' ? session.studentId?.avatar : undefined) || "/placeholder.svg"}
                      alt={session.studentName || (typeof session.studentId !== 'string' ? session.studentId?.name : "Student")}
                    />
                    <AvatarFallback>
                      {(session.studentName || (typeof session.studentId !== 'string' ? session.studentId?.name : "S"))
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold">{session.studentName || (typeof session.studentId !== 'string' ? session.studentId?.name : "Student")}</p>
                    <p className="text-sm text-muted-foreground">{session.topic || "Mentoring Session"}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.startAt || session.scheduledAt ? format(new Date(session.startAt || session.scheduledAt), "MMM d, h:mm a") : "TBD"}
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
                  <Button size="sm" onClick={() => handleJoinSession(session)}>
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
