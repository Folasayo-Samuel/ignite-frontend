"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp } from "lucide-react"

const mentees = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    progress: 75,
    currentGoal: "Master React Hooks",
    sessionsCompleted: 8,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    progress: 60,
    currentGoal: "Build Portfolio Website",
    sessionsCompleted: 5,
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    progress: 90,
    currentGoal: "Prepare for Interviews",
    sessionsCompleted: 12,
  },
]

export function MentorMenteesCard() {
  const handleMessage = (menteeName: string) => {
    alert(`Opening message thread with ${menteeName}. In production, this would open a messaging interface.`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Mentees</CardTitle>
        <CardDescription>Track your mentees' progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentees.map((mentee) => (
            <div key={mentee.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      {mentee.progress}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{mentee.currentGoal}</p>
                  <p className="text-xs text-muted-foreground">{mentee.sessionsCompleted} sessions completed</p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${mentee.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-4 gap-2 bg-transparent"
                onClick={() => handleMessage(mentee.name)}
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
