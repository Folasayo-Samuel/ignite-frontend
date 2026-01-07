"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMentors, ActiveMentor } from "@/api/mentors" // We will update api/mentors next
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function ActiveMentorsCard() {
    const router = useRouter()
    // Assuming we add getActiveMentors to useMentors hook
    const { getActiveMentors } = useMentors()
    const { data: mentorsResult, isLoading } = getActiveMentors()
    const mentors = (mentorsResult as any)?.data || [];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // If no active mentors, don't show the card at all (cleaner UI) or show empty state?
    // Implementation plan said "Ensure it only renders if the user has active mentors"
    if (!mentors || mentors.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Mentorships</CardTitle>
                <CardDescription>Your ongoing conversations and mentors</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mentors.map((item: ActiveMentor) => (
                        <div key={item.mentor._id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={item.mentor.avatar || "/placeholder.svg"} alt={item.mentor.name} />
                                    <AvatarFallback>{item.mentor.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{item.mentor.name}</h4>
                                        {item.unreadCount > 0 && (
                                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                                {item.unreadCount} new
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                                        {item.lastMessage || "No messages yet"}
                                    </p>
                                    {item.lastMessageAt && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatDistanceToNow(new Date(item.lastMessageAt), { addSuffix: true })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant={item.unreadCount > 0 ? "default" : "outline"}
                                onClick={() => router.push(`/learner/messages/${item.mentor._id}`)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
