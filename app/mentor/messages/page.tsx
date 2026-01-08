"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MentorInboxPage() {
    const router = useRouter()
    const { getActiveMentees } = useMentorDashboard()
    const { data: menteesResult, isLoading } = getActiveMentees()
    const mentees = menteesResult || []

    useEffect(() => {
        if (!isLoading && mentees.length > 0) {
            router.replace(`/mentor/messages/${mentees[0].studentId}`)
        }
    }, [isLoading, mentees, router])

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (mentees.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <Card className="max-w-md mx-auto text-center">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-center">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">No messages yet</h2>
                            <p className="text-muted-foreground">
                                You don't have any active conversations with students.
                            </p>
                        </div>
                        <Button onClick={() => router.push('/mentor/dashboard')} variant="outline" className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}
