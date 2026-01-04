"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function ScheduleSessionModal() {
    const [open, setOpen] = useState(false)
    const { scheduleSession, getActiveMentees, getUpcoming } = useMentorDashboard()

    // Prefetch mentees for selection
    const { data: menteesResult } = getActiveMentees()
    const mentees = (menteesResult as any)?.data || []

    const { mutate: schedule, isPending } = scheduleSession
    const { refetch: refetchUpcoming } = getUpcoming()

    const [formData, setFormData] = useState({
        studentId: "",
        date: "",
        time: "",
        duration: "60",
        type: "mentoring",
        notes: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.studentId || !formData.date || !formData.time) {
            toast.error("Please fill in all required fields")
            return
        }

        const scheduledDate = new Date(`${formData.date}T${formData.time}:00`).toISOString()

        schedule({
            studentId: formData.studentId,
            scheduledDate,
            duration: parseInt(formData.duration),
            type: formData.type as any,
            notes: formData.notes
        }, {
            onSuccess: () => {
                toast.success("Session scheduled successfully")
                setOpen(false)
                setFormData({
                    studentId: "",
                    date: "",
                    time: "",
                    duration: "60",
                    type: "mentoring",
                    notes: ""
                })
                refetchUpcoming()
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.message || "Failed to schedule session")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Session
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule Session</DialogTitle>
                    <DialogDescription>
                        Book a new session with one of your mentees.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="student">Mentee</Label>
                        <Select
                            value={formData.studentId}
                            onValueChange={(val) => setFormData({ ...formData, studentId: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select mentee" />
                            </SelectTrigger>
                            <SelectContent>
                                {mentees.map((m: any) => (
                                    <SelectItem key={m.studentId} value={m.studentId}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (min)</Label>
                            <Select
                                value={formData.duration}
                                onValueChange={(val) => setFormData({ ...formData, duration: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 mins</SelectItem>
                                    <SelectItem value="60">60 mins</SelectItem>
                                    <SelectItem value="90">90 mins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mentoring">Mentoring</SelectItem>
                                    <SelectItem value="review">Code Review</SelectItem>
                                    <SelectItem value="qna">Q&A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Topic or agenda..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Scheduling..." : "Schedule Session"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
