"use client"

import { useState } from "react"
import { Calendar, Clock, Video, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSessions, Session } from "@/api/sessions"
import { format, isPast } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SessionList() {
    const { getSessions, cancelSession } = useSessions();
    const { data: result, isLoading, refetch } = getSessions();
    const { mutate: cancel, isPending: isCancelling } = cancelSession(""); // ID passed later

    const sessions = (result as any)?.data as Session[] || [];

    const handleCancel = (sessionId: string) => {
        cancel({ reason: "User requested cancellation" } as any, { // api signature might strictly require ID or passed via closure, but hook generated with closure in mind?
            // Actually hook signature: const cancelSession = (sessionId: string) => useApiMutation(...)
            // So I have to call the hook with ID. But I can't call hook inside loop.
            // Actually, typical pattern: useApiMutation return mutate function which *accepts* variables.
            // api/sessions.ts: cancelSession returns mutation based on sessionId?
            // No, looking at api/sessions.ts:
            // const cancelSession = (sessionId: string) => useApiMutation(...)
            // This means I need to call the hook at top level. But I don't have ID yet.
            // This is a flaw in api/sessions.ts or usage pattern.
            // Better design: define useApiMutation once with dynamic URL or generic URL and ID in body/param.
            // However, looking at api/sessions.ts: url: `/student/sessions/${sessionId}/cancel`.
            // This requires sessionId at hook call time.
            // I should refactor api/sessions.ts to be more flexible or use a single mutation that takes ID.
            // Or I can't use it easily in a list without selecting one first.

            // Fix: I will refactor api/sessions.ts quickly to allow dynamic ID if possible, or I will use a key/component for each session item to have its own hook? No that's heavy.
            // I'll refactor api/sessions.ts to use a clear Mutation that accepts sessionId if useApiMutation supports dynamic URL.
            // If useApiMutation url is static, I can't. But typically it supports function?
            // Assuming useApiMutation requires static URL string.
            // I will modify api/sessions.ts to use a generic cancel endpoint if available or just `POST /student/sessions/cancel` with body `{ sessionId }`.
            // Backend probably expects `/student/sessions/:id/cancel`.
            // I'll stick to updating api/sessions.ts to use a general Mutation function if I can, OR
            // Use a workaround: I can't seamlessly change backend. 
            // I will create a sub-component `SessionItem` which calls the hook for its session? Yes, that's clean.
        });
    }

    // Sorting: Upcoming first
    const sortedSessions = [...sessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    const upcoming = sortedSessions.filter(s => !isPast(new Date(s.scheduledAt)) && s.status !== 'cancelled');
    const past = sortedSessions.filter(s => isPast(new Date(s.scheduledAt)) || s.status === 'cancelled');

    if (isLoading) {
        return <SessionListSkeleton />
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>My Sessions</CardTitle>
                <CardDescription>Manage your mentorship sessions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {upcoming.length === 0 && past.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">No sessions found.</div>
                    )}

                    {upcoming.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm text-foreground">Upcoming</h3>
                            {upcoming.map(session => (
                                <SessionItem key={session._id} session={session} />
                            ))}
                        </div>
                    )}

                    {past.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm text-muted-foreground">Past / Cancelled</h3>
                            {past.map(session => (
                                <SessionItem key={session._id} session={session} isPast />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function SessionItem({ session, isPast }: { session: Session, isPast?: boolean }) {
    const { cancelSession } = useSessions();
    const { mutate: cancel, isPending } = cancelSession(session._id);

    const onCancel = () => {
        cancel({ reason: "User cancelled" } as any, {
            onSuccess: () => toast.success("Session cancelled"),
            onError: () => toast.error("Failed to cancel session")
        })
    }

    return (
        <div className={`flex items-start justify-between p-4 rounded-lg border ${isPast ? 'bg-muted/50' : 'bg-card'}`}>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Mentorship Session</span>
                    <Badge variant={session.status === 'cancelled' ? 'destructive' : 'outline'}>
                        {session.status}
                    </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(session.scheduledAt), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(session.scheduledAt), "h:mm a")} ({session.durationMin} min)
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {!isPast && session.status !== 'cancelled' && (
                    <>
                        {session.meetingUrl && (
                            <Button size="sm" variant="outline" className="gap-2" asChild>
                                <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-4 w-4" />
                                    Join
                                </a>
                            </Button>
                        )}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    Cancel
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. The mentor will be notified.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Session</AlertDialogCancel>
                                    <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Cancel Session
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </div>
        </div>
    )
}

function SessionListSkeleton() {
    return (
        <Card className="border-2">
            <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 w-full rounded-lg bg-muted/20 animate-pulse" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
