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
  const { data: availability, isLoading, refetch } = getAvailability();

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

  const [isAvailable, setIsAvailable] = useState(true);

  // Sync state with API data when loaded
  useEffect(() => {
    if (availability) {
      setIsAvailable(availability.isAcceptingRequests);
    }
  }, [availability]);

  const [calendarForm, setCalendarForm] = useState({ link: "", buffer: 15 });
  const [slotForm, setSlotForm] = useState({ start: "09:00", end: "17:00", duration: 60 });

  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [timeSlotsDialogOpen, setTimeSlotsDialogOpen] = useState(false)

  // Sync state with API data when loaded
  useEffect(() => {
    if (availability) {
      setIsAvailable(availability.isAcceptingRequests);

      // Sync Calendar Settings
      setCalendarForm({
        link: availability.calendarSettings?.calendarIntegrationLink || "",
        buffer: availability.calendarSettings?.bufferMinutes || 15
      });

      // Sync Slot Template
      if (availability.slotTemplate) {
        setSlotForm({
          start: availability.slotTemplate.start,
          end: availability.slotTemplate.end,
          duration: availability.slotTemplate.sessionDurationMin
        });
      }

      // Sync Weekly Schedule
      if (availability.weeklySchedule) {
        setWeekDays(prev => prev.map(d => {
          const dayIndexMap: Record<string, number> = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
          const idx = dayIndexMap[d.day];
          const found = availability.weeklySchedule.find((w: any) => w.dow === idx);
          return found ? { ...d, enabled: found.enabled } : d;
        }));
      }
    }
  }, [availability]);

  const handleToggle = (checked: boolean) => {
    setIsAvailable(checked); // Optimistic update
    toggle({ isAcceptingRequests: checked }, {
      onSuccess: () => {
        toast.success("Availability updated");
        refetch();
      },
      onError: () => {
        setIsAvailable(!checked); // Revert on error
        toast.error("Failed to update availability");
      }
    });
  }

  const toggleDay = (index: number) => {
    const updated = weekDays.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item));
    setWeekDays(updated); // Optimistic UI

    // Map to backend DTO structure
    const daysMap: Record<string, number> = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };

    // Construct full schedule payload (backend likely replaces the whole array)
    const payload = updated.map(d => ({
      dow: daysMap[d.day],
      enabled: d.enabled,
      blocks: [] // Default empty blocks if simple toggle
    }));

    updateLocalWeekly({ weeklySchedule: payload }, {
      onSuccess: () => {
        toast.success("Weekly schedule updated");
        refetch();
      },
      onError: () => {
        setWeekDays(weekDays); // Revert
        toast.error("Failed to update schedule");
      }
    });
  }

  const handleCalendarUpdate = () => {
    updateCalendar({
      calendarIntegrationLink: calendarForm.link,
      bufferMinutes: Number(calendarForm.buffer)
    }, {
      onSuccess: () => {
        toast.success("Calendar settings saved!")
        setCalendarDialogOpen(false)
        refetch();
      },
      onError: (err) => toast.error("Failed to save calendar settings")
    });
  }

  const handleTimeSlotsUpdate = () => {
    updateSlots({
      start: slotForm.start,
      end: slotForm.end,
      sessionDurationMin: Number(slotForm.duration)
    }, {
      onSuccess: () => {
        toast.success("Time slots updated successfully!")
        setTimeSlotsDialogOpen(false)
        refetch();
      },
      onError: (err) => toast.error("Failed to save time slots")
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
    <Card id="availability" className="scroll-mt-24">
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
            checked={isAvailable}
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
                  <Input
                    id="calendar-link"
                    placeholder="https://calendar.google.com/..."
                    type="url"
                    value={calendarForm.link}
                    onChange={(e) => setCalendarForm({ ...calendarForm, link: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buffer-time">Buffer Time Between Sessions (minutes)</Label>
                  <Input
                    id="buffer-time"
                    type="number"
                    min="0"
                    max="60"
                    value={calendarForm.buffer}
                    onChange={(e) => setCalendarForm({ ...calendarForm, buffer: parseInt(e.target.value) || 0 })}
                  />
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
                    <Input
                      id="start-time"
                      type="time"
                      value={slotForm.start}
                      onChange={(e) => setSlotForm({ ...slotForm, start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={slotForm.end}
                      onChange={(e) => setSlotForm({ ...slotForm, end: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input
                    id="session-duration"
                    type="number"
                    min="15"
                    max="180"
                    value={slotForm.duration}
                    onChange={(e) => setSlotForm({ ...slotForm, duration: parseInt(e.target.value) || 15 })}
                  />
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
