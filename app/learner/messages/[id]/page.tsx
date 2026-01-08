"use client"

import { useParams, useRouter } from "next/navigation"
import { MessagesPanel } from "@/components/messages-panel"
import { ChatLayout } from "@/components/chat-layout"
import { useMentors } from "@/api/mentors"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

export default function LearnerMessagingPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const { getMentor, getActiveMentors } = useMentors()
    const { data: mentor, isLoading: isMentorLoading } = getMentor(id)
    const { data: activeMentorsResult, isLoading: isActiveLoading } = getActiveMentors()

    // API function auto-unwraps { success, data } - so activeMentorsResult IS the array directly
    const activeMentors = Array.isArray(activeMentorsResult) ? activeMentorsResult : (activeMentorsResult as any)?.data || []
    
    // Find the mentor in active conversations by mentor profile ID
    const activeMentor = activeMentors.find((m: any) => m.mentor._id === id)
    
    // If mentor not found in active conversations, redirect to main messages page
    if (!isActiveLoading && !isMentorLoading && !activeMentor && !mentor) {
        router.replace('/learner/messages')
        return null
    }

    if (isMentorLoading || isActiveLoading) return <LoadingScreen />

    return (
        <div className="h-dvh md:h-[calc(100vh-80px)] bg-background flex flex-col fixed inset-0 md:relative md:inset-auto z-50 md:z-auto">
            <ChatLayout
                activeId={id}
                role="student"
                conversations={activeMentors}
                isLoading={isActiveLoading}
            >
                <MessagesPanel
                    partnerId={id}
                    partnerUserId={String(activeMentor?.mentor?.userId || mentor?.userId || id)}
                    partnerName={activeMentor?.mentor?.name || mentor?.name || "Mentor"}
                    partnerAvatar={activeMentor?.mentor?.avatar || mentor?.avatar}
                    role="student"
                    onBack={() => router.push('/learner/messages')}
                />
            </ChatLayout>
        </div>
    )
}

