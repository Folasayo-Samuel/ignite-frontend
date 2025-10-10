"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Plus } from "lucide-react"

export function AdminEventsManagement() {
  const events = [
    { id: 1, title: "React Workshop", date: "2025-01-15", type: "Workshop", attendees: 45, capacity: 50 },
    { id: 2, title: "Career Webinar", date: "2025-01-20", type: "Webinar", attendees: 120, capacity: 200 },
    { id: 3, title: "Project Showcase", date: "2025-01-25", type: "Showcase", attendees: 80, capacity: 100 },
  ]

  const handleAction = (action: string, eventId: number) => {
    console.log(`[v0] Admin action: ${action} for event ${eventId}`)
    alert(`${action} event ${eventId}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Events & Workshops</CardTitle>
            <CardDescription>Manage upcoming events and registrations</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleAction("Create Event", 0)}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">{event.title}</h4>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.attendees}/{event.capacity}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => handleAction("Manage", event.id)}>
                Manage
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
