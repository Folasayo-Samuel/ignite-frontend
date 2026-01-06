"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, XCircle, Video, MessageSquare, Headphones } from "lucide-react"
import { useSessions, SessionRequest, ApproveRequestDto } from "@/api/sessions"
import { toast } from "sonner"
import { format } from "date-fns"

export function MentorSessionRequestsCard() {
    const { getMentorRequests, approveRequest, declineRequest } = useSessions()
    const { data: result, isLoading, refetch } = getMentorRequests()
    const requests = (result as any)?.data || (Array.isArray(result) ? result : [])

    const [selectedRequest, setSelectedRequest] = useState<SessionRequest | null>(null)
    const [approveDialogOpen, setApproveDialogOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<string>("")
    const [selectedMode, setSelectedMode] = useState<"video" | "audio" | "chat">("video")

    const handleApproveClick = (request: SessionRequest) => {
        setSelectedRequest(request)
        setSelectedSlot("")
        setSelectedMode("video")
        setApproveDialogOpen(true)
    }

    const handleApprove = () => {
        if (!selectedRequest || !selectedSlot) {
            toast.error("Please select a time slot")
            return
        }

        const slot = selectedRequest.preferredSlots?.find(
            (s) => s.startAt === selectedSlot
        )
        if (!slot) return

        const { mutate } = approveRequest(selectedRequest._id)
        mutate(
            { slot, mode: selectedMode },
            {
                onSuccess: () => {
                    toast.success("Session request approved!")
                    setApproveDialogOpen(false)
                    setSelectedRequest(null)
                    refetch()
                },
                onError: () => toast.error("Failed to approve request"),
            }
        )
    }

    const handleDecline = (requestId: string) => {
        if (!confirm("Are you sure you want to decline this session request?")) return

        const { mutate } = declineRequest(requestId)
        mutate(undefined, {
            onSuccess: () => {
                toast.success("Session request declined")
                refetch()
            },
            onError: () => toast.error("Failed to decline request"),
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "declined":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "expired":
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            default:
                return ""
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-3 w-2/3" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-24" />
                                    <Skeleton className="h-9 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Session Requests
                    </CardTitle>
                    <CardDescription>
                        Pending mentoring session requests from students
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No pending session requests</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    New requests from students will appear here
                                </p>
                            </div>
                        ) : (
                            requests.map((request: SessionRequest) => (
                                <div
                                    key={request._id}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 hover:bg-muted/50 transition-colors"
                                >
                                    {/* Student Info */}
                                    <div className="flex items-start md:items-center gap-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>
                                                {(request.studentId || "S").slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold truncate">Learner Request</p>
                                                <Badge className={getStatusColor(request.status)}>
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {request.topic || "Mentoring session"}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Requested {request.createdAt ? format(new Date(request.createdAt), "MMM d, h:mm a") : "recently"}
                                                </span>
                                                {request.preferredSlots && request.preferredSlots.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {request.preferredSlots.length} time slot{request.preferredSlots.length > 1 ? "s" : ""} proposed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {request.status === "pending" && (
                                        <div className="flex gap-2 self-end md:self-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDecline(request._id)}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleApproveClick(request)}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Approve Session Request</DialogTitle>
                        <DialogDescription>
                            Select a time slot and session mode to confirm this session.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Time Slot Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time Slot</label>
                            {selectedRequest?.preferredSlots && selectedRequest.preferredSlots.length > 0 ? (
                                <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedRequest.preferredSlots.map((slot, index) => (
                                            <SelectItem key={index} value={slot.startAt}>
                                                {format(new Date(slot.startAt), "MMM d, yyyy 'at' h:mm a")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No preferred time slots specified. You will need to coordinate with the student.
                                </p>
                            )}
                        </div>

                        {/* Session Mode Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Session Mode</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={selectedMode === "video" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedMode("video")}
                                    className="flex-1"
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    Video
                                </Button>
                                <Button
                                    type="button"
                                    variant={selectedMode === "audio" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedMode("audio")}
                                    className="flex-1"
                                >
                                    <Headphones className="h-4 w-4 mr-2" />
                                    Audio
                                </Button>
                                <Button
                                    type="button"
                                    variant={selectedMode === "chat" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedMode("chat")}
                                    className="flex-1"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Chat
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove}>
                            Confirm & Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
