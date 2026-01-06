"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, CheckCircle, XCircle, Mail, RefreshCw, Eye, Users } from "lucide-react"
import { useAdmin } from "@/api/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminMentor {
  _id: string;
  mentorId: string;
  userId: string;
  name: string;
  email: string;
  expertise: string[];
  bio: string;
  title?: string;
  company?: string;
  experienceYears?: number;
  rating?: number;
  ratingsAvg?: number;
  ratingsCount?: number;
  isActive: boolean;
  isAvailable: boolean;
  studentsCount: number;
  sessionsCompleted: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export function AdminMentorManagement() {
  const { getMentors, activateMentor, deactivateMentor, activateAllMentors } = useAdmin()
  const { data: mentorsData, isLoading, isError, error, refetch } = getMentors()

  const mentors: AdminMentor[] = mentorsData?.data || []

  const handleActivate = async (mentor: AdminMentor) => {
    try {
      const { mutate } = activateMentor(String(mentor._id))
      mutate(undefined, {
        onSuccess: () => {
          toast.success(`${mentor.name} has been activated`)
          refetch()
        },
        onError: () => {
          toast.error("Failed to activate mentor")
        }
      })
    } catch {
      toast.error("Failed to activate mentor")
    }
  }

  const handleDeactivate = async (mentor: AdminMentor) => {
    try {
      const { mutate } = deactivateMentor(String(mentor._id))
      mutate(undefined, {
        onSuccess: () => {
          toast.success(`${mentor.name} has been deactivated`)
          refetch()
        },
        onError: () => {
          toast.error("Failed to deactivate mentor")
        }
      })
    } catch {
      toast.error("Failed to deactivate mentor")
    }
  }

  const handleActivateAll = async () => {
    activateAllMentors.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data?.message || "All mentors activated")
        refetch()
      },
      onError: () => {
        toast.error("Failed to activate all mentors")
      }
    })
  }

  const handleSendEmail = (mentor: AdminMentor) => {
    // Open email client with mentor's email
    window.location.href = `mailto:${mentor.email}?subject=FolaIgnite Mentor Communication`
  }

  const getStatusDisplay = (mentor: AdminMentor): { label: string; variant: "default" | "secondary" | "outline" | "destructive" } => {
    if (mentor.status === "pending") return { label: "Pending", variant: "secondary" }
    if (mentor.status === "inactive" || !mentor.isActive) return { label: "Inactive", variant: "outline" }
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

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mentor Management</CardTitle>
          <CardDescription>Manage mentor applications and active mentors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="font-semibold">Unable to load mentors</p>
            <p className="text-sm opacity-80 mt-1">
              {(error as any)?.message || "Please try again later."}
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mentor Management
            </CardTitle>
            <CardDescription>Manage mentor applications and active mentors ({mentors.length} total)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleActivateAll}
              disabled={activateAllMentors.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {activateAllMentors.isPending ? "Activating..." : "Activate All"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No mentors found.</p>
              <p className="text-sm mt-2">Mentors will appear here once they register and create their profiles.</p>
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
                      <AvatarImage src="" alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {mentor.isAvailable && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Accepting Requests
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{mentor.email}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{mentor.studentsCount || 0} mentees</span>
                        <span>{mentor.sessionsCompleted || 0} sessions</span>
                        {(mentor.rating || mentor.ratingsAvg) ? (
                          <span>⭐ {mentor.ratingsAvg?.toFixed(1) || mentor.rating?.toFixed(1)}</span>
                        ) : null}
                        {mentor.expertise && mentor.expertise.length > 0 && (
                          <span>{mentor.expertise.slice(0, 3).join(", ")}</span>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/mentors/${mentor._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      {mentor.isActive ? (
                        <DropdownMenuItem onClick={() => handleDeactivate(mentor)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleActivate(mentor)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
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
