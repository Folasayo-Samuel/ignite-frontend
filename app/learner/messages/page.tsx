"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMentors } from "@/api/mentors"
import { Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LearnerInboxPage() {
    const router = useRouter()
    const { getActiveMentors } = useMentors()
    const { data: mentorsResult, isLoading } = getActiveMentors()
    // API function auto-unwraps { success, data } - so mentorsResult IS the array directly
    const mentors = Array.isArray(mentorsResult) ? mentorsResult : (mentorsResult as any)?.data || []

    useEffect(() => {
        if (!isLoading && mentors.length > 0) {
            router.replace(`/learner/messages/${mentors[0].mentor._id}`)
        }
    }, [isLoading, mentors, router])

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (mentors.length === 0) {
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
                                You haven't started any conversations with mentors yet.
                                Find a mentor to start chatting!
                            </p>
                        </div>
                        <Button onClick={() => router.push('/mentors')} className="w-full">
                            Find a Mentor
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
