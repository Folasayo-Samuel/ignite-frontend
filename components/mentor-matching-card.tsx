"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Star, Users, Lock } from "lucide-react"
import { useMentors, Mentor } from "@/api/mentors"
import { useStudents } from "@/api/student"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function MentorMatchingCard() {
  const [open, setOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [message, setMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { getMentors, requestMentorship } = useMentors();
  const { getMyCohort } = useStudents();
  const { data: mentorsData, isLoading, error, isError } = getMentors();
  const { data: cohort, isLoading: loadingCohort } = getMyCohort();
  const { mutate: sendRequest, isPending: isSending } = requestMentorship;

  const hasValidCohort = cohort?.cohortId && cohort?.status !== "none"

  // Handle both wrapped {success, data} and unwrapped responses from api() function
  const mentors = (mentorsData as any)?.data || (Array.isArray(mentorsData) ? mentorsData : []);

  // Pagination logic
  const totalPages = Math.ceil(mentors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMentors = mentors.slice(startIndex, startIndex + itemsPerPage)

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setOpen(true)
  }

  const handleSubmitRequest = () => {
    if (!selectedMentor) return;

    sendRequest({
      mentorId: String(selectedMentor._id),
      message
    }, {
      onSuccess: () => {
        toast.success("Mentorship request sent successfully!")
        setOpen(false)
        setMessage("")
        setSelectedMentor(null)
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to send mentor request")
      }
    });
  }

  if (loadingCohort) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasValidCohort) {
    return (
      <Card className="border-2 border-dashed bg-muted/30">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Mentorship is Locked</CardTitle>
          <CardDescription>
            Join a cohort to unlock access to our network of industry mentors
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <Button asChild>
            <Link href="/learner/dashboard">Find and Join a Cohort</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Find a Mentor</CardTitle>
          <CardDescription>Connect with experienced developers to guide your learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="font-semibold">Unable to load mentors</p>
                <p className="text-sm opacity-80 mt-1">
                  {(error as any)?.response?.status === 403
                    ? "This feature is only available for Learners."
                    : "Please try again later."}
                </p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No mentors available at the moment.</div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedMentors.map((mentor: Mentor) => (
                    <div key={mentor._id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex gap-4">
                        <Link href={`/mentors/${mentor._id}`}>
                          <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/mentors/${mentor._id}`}>
                                <h4 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                                  {mentor.name}
                                </h4>
                              </Link>
                              <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                            </div>
                            {mentor.isAvailable && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                Available
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {mentor.expertise.map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              {mentor.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {mentor.studentsCount} students
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            disabled={!mentor.isAvailable}
                            onClick={() => handleRequestMentorship(mentor)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {mentor.isAvailable ? "Request Mentorship" : "Not Available"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t mt-6">
                    <p className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="h-8 px-3"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="h-8 px-3"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>Send a message to {selectedMentor?.name} to request mentorship</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Tell the mentor about your goals and what you'd like help with..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} className="flex-1" disabled={!message.trim() || isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
