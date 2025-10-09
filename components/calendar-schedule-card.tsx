"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video, MapPin, Plus } from "lucide-react"
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

  const handleRegister = (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
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
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
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
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
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
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Video className="h-4 w-4" />
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
