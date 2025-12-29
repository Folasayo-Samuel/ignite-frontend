"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, CheckCircle, XCircle, Mail, RefreshCw, Eye } from "lucide-react"
import { useMentors, type Mentor } from "@/api/mentors"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminMentorManagement() {
  const { getMentors, updateMentor } = useMentors()
  const { data: mentorsData, isLoading, refetch } = getMentors()

  const mentors = mentorsData?.data || []

  const handleApprove = async (mentor: Mentor) => {
    // Use updateMentor hook for the specific mentor
    try {
      const { mutate } = updateMentor(String(mentor._id))
      mutate({ isAvailable: true }, {
        onSuccess: () => {
          toast.success(`${mentor.name} has been approved`)
          refetch()
        },
        onError: () => {
          toast.error("Failed to approve mentor")
        }
      })
    } catch {
      toast.error("Failed to approve mentor")
    }
  }

  const handleSuspend = async (mentor: Mentor) => {
    try {
      const { mutate } = updateMentor(String(mentor._id))
      mutate({ isAvailable: false }, {
        onSuccess: () => {
          toast.success(`${mentor.name} has been suspended`)
          refetch()
        },
        onError: () => {
          toast.error("Failed to suspend mentor")
        }
      })
    } catch {
      toast.error("Failed to suspend mentor")
    }
  }

  const handleSendEmail = (mentor: Mentor) => {
    // Open email client with mentor's email
    window.location.href = `mailto:${mentor.email}?subject=FolaIgnite Mentor Communication`
  }

  const getStatusDisplay = (mentor: Mentor): { label: string; variant: "default" | "secondary" | "outline" } => {
    if (mentor.status === "pending") return { label: "Pending", variant: "secondary" }
    if (mentor.status === "inactive" || !mentor.isAvailable) return { label: "Inactive", variant: "outline" }
    return { label: "Active", variant: "default" }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mentor Management</CardTitle>
            <CardDescription>Manage mentor applications and active mentors</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No mentors found.</p>
            </div>
          ) : (
            mentors.map((mentor) => {
              const status = getStatusDisplay(mentor)

              return (
                <div
                  key={mentor._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mentor.avatar || ""} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{mentor.email}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{mentor.studentsCount || 0} mentees</span>
                        <span>{mentor.sessionsCompleted || 0} sessions</span>
                        {(mentor.rating || mentor.ratingsAvg) ? (
                          <span>⭐ {mentor.ratingsAvg?.toFixed(1) || mentor.rating?.toFixed(1)}</span>
                        ) : null}
                        {mentor.expertise && mentor.expertise.length > 0 && (
                          <span>{mentor.expertise.slice(0, 2).join(", ")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {mentor.status === "pending" ? (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(mentor)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspend(mentor)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/mentors/${mentor._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          {mentor.isAvailable ? (
                            <DropdownMenuItem onClick={() => handleSuspend(mentor)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleApprove(mentor)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleSendEmail(mentor)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
