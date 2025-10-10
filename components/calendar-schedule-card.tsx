"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon, MapPinIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

const events = [
  {
    id: "1",
    title: "React Fundamentals Workshop",
    date: "Jan 15, 2025",
    time: "2:00 PM - 4:00 PM",
    type: "workshop",
    attendees: 45,
    location: "Online",
    instructor: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Weekly Code Review Session",
    date: "Jan 16, 2025",
    time: "6:00 PM - 7:00 PM",
    type: "session",
    attendees: 28,
    location: "Online",
    instructor: "Michael Chen",
  },
  {
    id: "3",
    title: "Career Development Webinar",
    date: "Jan 18, 2025",
    time: "3:00 PM - 5:00 PM",
    type: "webinar",
    attendees: 120,
    location: "Online",
    instructor: "Amara Okafor",
  },
  {
    id: "4",
    title: "Project Showcase & Feedback",
    date: "Jan 20, 2025",
    time: "5:00 PM - 6:30 PM",
    type: "showcase",
    attendees: 67,
    location: "Online",
    instructor: "Community",
  },
]

export function CalendarScheduleCard() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(["1"])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "workshop",
    location: "Online",
    instructor: "",
  })

  const handleRegister = (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

  const handleJoinEvent = (eventId: string) => {
    alert(`Joining event ${eventId}. In production, this would open the video conference link.`)
  }

  const handleAddEvent = () => {
    console.log("Adding new event:", newEvent)
    setIsAddEventOpen(false)
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "workshop",
      location: "Online",
      instructor: "",
    })
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "session":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "webinar":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "showcase":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Join workshops, webinars, and community sessions</CardDescription>
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new event or workshop for the community</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="e.g., React Workshop"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-instructor">Instructor</Label>
                  <Input
                    id="event-instructor"
                    placeholder="Your name"
                    value={newEvent.instructor}
                    onChange={(e) => setNewEvent({ ...newEvent, instructor: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => {
            const isRegistered = registeredEvents.includes(event.id)
            return (
              <div key={event.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">by {event.instructor}</p>
                    </div>
                    <Badge variant="secondary" className={getEventColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      {event.attendees} attending
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={isRegistered ? "secondary" : "default"}
                      className="flex-1"
                      onClick={() => handleRegister(event.id)}
                    >
                      {isRegistered ? "Registered" : "Register"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      <VideoIcon className="h-4 w-4" />
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
