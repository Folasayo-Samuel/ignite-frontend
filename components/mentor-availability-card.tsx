"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"

export function MentorAvailabilityCard() {
  const [isAvailable, setIsAvailable] = useState(true)

  const weekDays = [
    { day: "Monday", enabled: true },
    { day: "Tuesday", enabled: true },
    { day: "Wednesday", enabled: false },
    { day: "Thursday", enabled: true },
    { day: "Friday", enabled: true },
    { day: "Saturday", enabled: false },
    { day: "Sunday", enabled: false },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Manage your mentoring schedule</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="available">Currently Available</Label>
            <p className="text-sm text-muted-foreground">Accept new session requests</p>
          </div>
          <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Weekly Schedule</h4>
          {weekDays.map((item) => (
            <div key={item.day} className="flex items-center justify-between">
              <span className="text-sm">{item.day}</span>
              <Switch checked={item.enabled} />
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t">
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Edit Calendar
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Clock className="h-4 w-4" />
            Set Time Slots
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
