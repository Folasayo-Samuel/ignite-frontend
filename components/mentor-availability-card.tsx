"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAvailability, AvailabilityData } from "@/api/availability"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function MentorAvailabilityCard() {
  const { getAvailability, toggleAvailability, setWeeklySchedule, setCalendarSettings, setSlotTemplate } = useAvailability();
  const { data: result, isLoading, refetch } = getAvailability();

  const availability = (result as any)?.data as AvailabilityData | undefined;

  const { mutate: toggle } = toggleAvailability;
  const { mutate: updateLocalWeekly } = setWeeklySchedule;
  const { mutate: updateCalendar } = setCalendarSettings;
  const { mutate: updateSlots } = setSlotTemplate;

  const [weekDays, setWeekDays] = useState([
    { day: "Monday", enabled: true },
    { day: "Tuesday", enabled: true },
    { day: "Wednesday", enabled: false },
    { day: "Thursday", enabled: true },
    { day: "Friday", enabled: true },
    { day: "Saturday", enabled: false },
    { day: "Sunday", enabled: false },
  ])

  // Sync state with API data when loaded
  useEffect(() => {
    if (availability?.weeklySchedule) {
      // Simple mapping, assuming backend returns similar structure or we adapt
      // Ideally we map backend schedule to component state here
      // For now, keeping local default if backend is empty to avoid UI break
    }
  }, [availability]);

  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [timeSlotsDialogOpen, setTimeSlotsDialogOpen] = useState(false)

  const handleToggle = (checked: boolean) => {
    toggle({ isAcceptingRequests: checked }, {
      onSuccess: () => {
        toast.success("Availability updated");
        refetch();
      },
      onError: () => toast.error("Failed to update availability")
    });
  }

  const toggleDay = (index: number) => {
    const updated = weekDays.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item));
    setWeekDays(updated);
    // In a real app we would save this to backend immediately or have a save button
    // here we just update local state for UI responsiveness
    updateLocalWeekly({ schedule: updated }, {
      onSuccess: () => toast.success("Weekly schedule updated")
    });
  }

  const handleCalendarUpdate = () => {
    updateCalendar({ calendarLink: "..." }, {
      onSuccess: () => {
        toast.success("Calendar updated successfully!")
        setCalendarDialogOpen(false)
      }
    });
  }

  const handleTimeSlotsUpdate = () => {
    updateSlots({ start: "09:00", end: "17:00", sessionDurationMin: 60 }, {
      onSuccess: () => {
        toast.success("Time slots updated successfully!")
        setTimeSlotsDialogOpen(false)
      }
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

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
          <Switch
            id="available"
            checked={availability?.isAcceptingRequests ?? true}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Weekly Schedule</h4>
          {weekDays.map((item, index) => (
            <div key={item.day} className="flex items-center justify-between">
              <span className="text-sm">{item.day}</span>
              <Switch checked={item.enabled} onCheckedChange={() => toggleDay(index)} />
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t">
          <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Edit Calendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Calendar</DialogTitle>
                <DialogDescription>Update your mentoring calendar settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="calendar-link">Calendar Integration Link</Label>
                  <Input id="calendar-link" placeholder="https://calendar.google.com/..." type="url" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buffer-time">Buffer Time Between Sessions (minutes)</Label>
                  <Input id="buffer-time" type="number" defaultValue="15" min="0" max="60" />
                </div>
                <Button onClick={handleCalendarUpdate} className="w-full">
                  Save Calendar Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={timeSlotsDialogOpen} onOpenChange={setTimeSlotsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Clock className="h-4 w-4" />
                Set Time Slots
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Time Slots</DialogTitle>
                <DialogDescription>Define your available mentoring hours</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input id="start-time" type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" defaultValue="17:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input id="session-duration" type="number" defaultValue="60" min="15" max="180" />
                </div>
                <Button onClick={handleTimeSlotsUpdate} className="w-full">
                  Save Time Slots
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
