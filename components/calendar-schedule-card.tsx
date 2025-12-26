"use client"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEvents, Event } from "@/api/events"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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



export function CalendarScheduleCard() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "workshop",
    location: "Online",
    instructor: "",
  })

  // API Hooks
  const { getEvents, registerForEvent, createEvent } = useEvents();
  const { data: eventsData, isLoading, refetch } = getEvents();
  const { mutate: register } = registerForEvent;
  const { mutate: create } = createEvent;

  const events = eventsData?.data || [];
  const [optRegistered, setOptRegistered] = useState<string[]>([]);

  const handleRegister = (eventId: string) => {
    register({ eventId }, {
      onSuccess: () => {
        setOptRegistered(prev => [...prev, eventId]);
        toast.success("Successfully registered for event");
      },
      onError: () => {
        toast.error("Failed to register for event");
      }
    });

    if (!optRegistered.includes(eventId)) {
      setOptRegistered([...optRegistered, eventId]);
    }
  }

  const handleJoinEvent = (eventId: string) => {
    alert(`Joining event ${eventId}. In production, this would open the video conference link.`)
  }

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error("Please fill in all required fields")
      return
    }

    const startDateTime = new Date(`${newEvent.date}T${newEvent.time}`).toISOString();
    const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString();

    create({
      title: newEvent.title,
      description: `Instructor: ${newEvent.instructor} - Location: ${newEvent.location}`,
      startTime: startDateTime,
      endTime: endDateTime,
      type: newEvent.type as any,
      location: newEvent.location,
      attendees: 0
    }, {
      onSuccess: () => {
        toast.success("Event created successfully")
        setIsAddEventOpen(false)
        setNewEvent({
          title: "",
          date: "",
          time: "",
          type: "workshop",
          location: "Online",
          instructor: "",
        })
        refetch()
      },
      onError: () => {
        toast.error("Failed to create event")
      }
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

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
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
          {events.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No upcoming events.</div>
          ) : (
            events.map((event) => {
              const isRegistered = event.isRegistered || optRegistered.includes(event.id);
              // Format dates from ISO if needed, simple fallback for now
              const displayDate = event.startTime ? new Date(event.startTime).toLocaleDateString() : 'TBD';
              const displayTime = event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

              return (
                <div key={event.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                      <Badge variant="secondary" className={getEventColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {displayDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        {displayTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" />
                        {event.location || 'Online'}
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
            }))}
        </div>
      </CardContent>
    </Card>
  )
}
