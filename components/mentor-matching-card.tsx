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
import { MessageSquare, Star, Users } from "lucide-react"
import { useMentors, Mentor } from "@/api/mentors"
import { Skeleton } from "@/components/ui/skeleton"

export function MentorMatchingCard() {
  const [open, setOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [message, setMessage] = useState("")

  const { getMentors, requestMentorship } = useMentors();
  const { data: mentorsData, isLoading, error, isError } = getMentors();
  const { mutate: sendRequest, isPending: isSending } = requestMentorship;

  const mentors = mentorsData?.data || [];

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
        setOpen(false)
        setMessage("")
        setSelectedMentor(null)
      }
    });
  }

  // ... (handleSubmitRequest remains same)

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
              mentors.map((mentor) => (
                // ... existing mapping logic
                <div key={mentor._id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="flex gap-4">
                    <Link href={`/mentors/${mentor._id}`}>
                      <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                        <AvatarFallback>
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
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
                        {mentor.expertise.map((skill) => (
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
              )))}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} className="flex-1" disabled={!message.trim()}>
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
