"use client"

import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MessagesPanel } from "@/components/messages-panel"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useMentors } from "@/api/mentors"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

export default function LearnerMessagingPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const { getMentor } = useMentors()
    const { data: mentorResult, isLoading } = getMentor(id)

    const mentor = mentorResult?.data

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
                        partnerName={mentor?.name || "Mentor"}
                        partnerAvatar={mentor?.avatar}
                        role="student"
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
