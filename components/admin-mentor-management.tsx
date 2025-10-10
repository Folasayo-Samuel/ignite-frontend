"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, CheckCircle, XCircle, Mail } from "lucide-react"

export function AdminMentorManagement() {
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Active",
      mentees: 8,
      sessions: 24,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      status: "Active",
      mentees: 6,
      sessions: 18,
      rating: 4.8,
    },
    { id: 3, name: "Amara Okafor", email: "amara@example.com", status: "Pending", mentees: 0, sessions: 0, rating: 0 },
    { id: 4, name: "David Kim", email: "david@example.com", status: "Active", mentees: 10, sessions: 32, rating: 5.0 },
  ]

  const handleAction = (action: string, mentorId: number) => {
    console.log(`[v0] Admin action: ${action} for mentor ${mentorId}`)
    alert(`${action} mentor ${mentorId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Management</CardTitle>
        <CardDescription>Manage mentor applications and active mentors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                  <Badge variant={mentor.status === "Active" ? "default" : "secondary"}>{mentor.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mentor.email}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{mentor.mentees} mentees</span>
                  <span>{mentor.sessions} sessions</span>
                  {mentor.rating > 0 && <span>⭐ {mentor.rating}</span>}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {mentor.status === "Pending" ? (
                    <>
                      <DropdownMenuItem onClick={() => handleAction("Approve", mentor.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Reject", mentor.id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => handleAction("View Profile", mentor.id)}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Suspend", mentor.id)}>Suspend</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleAction("Send Email", mentor.id)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
