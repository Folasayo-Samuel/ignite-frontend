"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Plus, MapPin, Link as LinkIcon, RefreshCw } from "lucide-react"
import { useAdmin } from "@/apis/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminEventsManagement() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    type: "workshop",
    startDate: "",
    endDate: "",
    location: { type: "virtual", meetingLink: "" },
    maxAttendees: 50,
    tags: [],
    isPublic: true,
  })

  const { getEvents } = useAdmin()
  const { data: eventsData, isLoading, refetch } = getEvents()
  const isCreating = false

  const events = Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Admin event creation not fully integrated yet")
    setOpen(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getEventTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      workshop: "Workshop",
      webinar: "Webinar",
      meetup: "Meetup",
      competition: "Competition",
      conference: "Conference",
    }
    return types[type] || type
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-9 w-20" />
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
            <CardTitle>Events & Workshops</CardTitle>
            <CardDescription>Manage upcoming events and registrations</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Set up a new event or workshop</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="e.g., React Workshop"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="meetup">Meetup</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-max">Max Attendees</Label>
                      <Input
                        id="event-max"
                        type="number"
                        min={1}
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || 50 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-start-date">Start Date/Time</Label>
                      <Input
                        id="event-start-date"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-end-date">End Date/Time</Label>
                      <Input
                        id="event-end-date"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-link">Meeting Link</Label>
                    <Input
                      id="event-link"
                      placeholder="https://meet.google.com/..."
                      value={formData.location?.meetingLink || ""}
                      onChange={(e) => setFormData({ ...formData, location: { type: "virtual", meetingLink: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Describe the event..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No events found. Create your first event to get started.</p>
              </div>
            ) : (
              events.map((event, idx) => (
                <div
                  key={event._id || idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">{event.title}</h4>
                    <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.startDate)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getEventTypeDisplay(event.type)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.currentAttendees || 0}/{event.maxAttendees || "∞"}
                      </div>
                      {event.location?.type === "virtual" && (
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          Virtual
                        </div>
                      )}
                      {event.location?.type === "physical" && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          In-person
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/events/${event._id}`}>Manage</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
