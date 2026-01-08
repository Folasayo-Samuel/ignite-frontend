"use client"

import { useParams, useRouter } from "next/navigation"
import { MessagesPanel } from "@/components/messages-panel"
import { ChatLayout } from "@/components/chat-layout"
import { useMentorDashboard } from "@/api/mentor-dashboard"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

export default function MentorMessagingPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const { getActiveMentees } = useMentorDashboard()
    const { data: result, isLoading } = getActiveMentees()

    // API function auto-unwraps { success, data } - so result IS the array directly
    const mentees = Array.isArray(result) ? result : (result as any)?.data || []
    const mentee = mentees.find((m: any) => m.studentId === id)

    if (isLoading) return <LoadingScreen />

    return (
        <div className="h-dvh md:h-[calc(100vh-80px)] bg-background flex flex-col fixed inset-0 md:relative md:inset-auto z-50 md:z-auto">
            <ChatLayout
                activeId={id}
                role="mentor"
                conversations={mentees}
                isLoading={isLoading}
            >
                <MessagesPanel
                    partnerId={id}
                    partnerUserId={String(mentee?.userId)}
                    partnerName={mentee?.name || "Student"}
                    partnerAvatar={mentee?.avatar}
                    role="mentor"
                    onBack={() => router.push('/mentor/messages')}
                />
            </ChatLayout>
        </div>
    )
}

