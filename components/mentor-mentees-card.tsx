"use client"
import { useEffect } from "react"
import { useSocket } from "@/components/providers/socket-provider"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp } from "lucide-react"
import { useMentorDashboard, Mentee } from "@/api/mentor-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

export function MentorMenteesCard() {
  const { getActiveMentees } = useMentorDashboard();
  const { data: menteesResult, isLoading } = getActiveMentees();
  const mentees = menteesResult || [];

  // Real-time updates
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => {
      // Invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['mentor-active-mentees'] });
    };
    socket.on('messages.new', handleNewMessage);
    return () => {
      socket.off('messages.new', handleNewMessage);
    };
  }, [socket, queryClient]);

  const handleMessage = (menteeName: string, studentId: string) => {
    // Navigate to messages
    window.location.href = `/mentor/messages/${studentId}`;
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
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
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
      <CardHeader>
        <CardTitle>Active Learners</CardTitle>
        <CardDescription>Track your mentees' progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentees.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No active mentees found.</p>
            </div>
          ) : (
            mentees.map((mentee) => (
              <div key={mentee.studentId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar>
                    <AvatarImage src={mentee.avatar || "/placeholder.svg"} alt={mentee.name} />
                    <AvatarFallback>
                      {mentee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{mentee.name}</p>
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {mentee.progressPercent}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{mentee.topic}</p>
                    <p className="text-xs text-muted-foreground">{mentee.sessionsCompleted} sessions completed</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${mentee.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-4 gap-2 bg-transparent"
                  onClick={() => handleMessage(mentee.name, mentee.studentId)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
