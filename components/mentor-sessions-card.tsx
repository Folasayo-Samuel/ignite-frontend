"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MessageSquare } from "lucide-react"

const upcomingSessions = [
  {
    id: "1",
    mentee: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    topic: "React Hooks Deep Dive",
    date: "Today, 3:00 PM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: "2",
    mentee: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    topic: "Career Guidance",
    date: "Tomorrow, 10:00 AM",
    duration: "45 mins",
    type: "chat",
  },
  {
    id: "3",
    mentee: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    topic: "Code Review Session",
    date: "Dec 28, 2:00 PM",
    duration: "1.5 hours",
    type: "video",
  },
]

export function MentorSessionsCard() {
  const handleJoinSession = (sessionId: string, type: string) => {
    if (type === "video") {
      alert(`Joining video session ${sessionId}. In production, this would open the video conference link.`)
    } else {
      alert(`Opening chat for session ${sessionId}. In production, this would open the messaging interface.`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled mentoring sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={session.avatar || "/placeholder.svg"} alt={session.mentee} />
                  <AvatarFallback>
                    {session.mentee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-semibold">{session.mentee}</p>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {session.type === "video" ? (
                    <Video className="h-3 w-3 mr-1" />
                  ) : (
                    <MessageSquare className="h-3 w-3 mr-1" />
                  )}
                  {session.type}
                </Badge>
                <Button size="sm" onClick={() => handleJoinSession(session.id, session.type)}>
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
