"use client"

import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MessagesPanel } from "@/components/messages-panel"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

export default function MentorMessagingPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const { getActiveMentees } = useMentorDashboard()
    const { data: result, isLoading } = getActiveMentees()

    const mentees = (result as any)?.data || (Array.isArray(result) ? result : [])
    const mentee = mentees.find((m: any) => m.studentId === id)

    if (isLoading) return <LoadingScreen />

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <div className="max-w-4xl mx-auto">
                    <MessagesPanel
                        partnerId={id}
                        partnerName={mentee?.name || "Student"}
                        partnerAvatar={mentee?.avatar}
                        role="mentor"
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
