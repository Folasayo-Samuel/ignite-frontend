"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"

interface ChatLayoutProps {
    children: React.ReactNode
    conversations: any[]
    activeId?: string
    role: "student" | "mentor"
    isLoading?: boolean
}

export function ChatLayout({ children, conversations, activeId, role, isLoading }: ChatLayoutProps) {
    const router = useRouter()
    const basePath = role === "student" ? "/learner/messages" : "/mentor/messages"

    // Normalize data structure for display
    const normalizedConversations = conversations.map((item: any) => {
        if (role === "student") {
            return {
                id: item.mentor._id,
                name: item.mentor.name,
                avatar: item.mentor.avatar,
                lastMessage: item.lastMessage,
                lastMessageAt: item.lastMessageAt,
                unreadCount: item.unreadCount,
                type: "Mentor"
            }
        } else {
            return {
                id: item.studentId,
                name: item.name,
                avatar: item.avatar,
                lastMessage: item.lastMessage,
                lastMessageAt: item.lastMessageAt,
                unreadCount: item.unreadCount,
                type: "Student"
            }
        }
    })

    return (
        <div className="flex h-full w-full overflow-hidden bg-background rounded-lg border shadow-sm">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 lg:w-96 border-r flex flex-col bg-muted/10",
                activeId ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-lg tracking-tight">Messages</h2>
                        <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                            {normalizedConversations.length}
                        </Badge>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : normalizedConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2">
                                <p className="text-sm">No conversations yet</p>
                            </div>
                        ) : (
                            normalizedConversations.map((chat: any) => (
                                <Link
                                    key={chat.id}
                                    href={`${basePath}/${chat.id}`}
                                    className={cn(
                                        "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                                        activeId === chat.id
                                            ? "bg-primary/10 hover:bg-primary/15"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="h-10 w-10 border border-border/50">
                                            <AvatarImage src={chat.avatar || "/placeholder.svg"} className="object-cover" />
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {chat.name?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {chat.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground ring-2 ring-background">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 grid gap-0.5">
                                        <div className="flex items-center justify-between">
                                            <p className={cn(
                                                "font-medium text-sm truncate",
                                                activeId === chat.id ? "text-primary" : "text-foreground"
                                            )}>
                                                {chat.name}
                                            </p>
                                            {chat.lastMessageAt && (
                                                <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })
                                                        .replace('about ', '')
                                                        .replace('less than a minute', 'now')
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <p className={cn(
                                            "text-xs truncate",
                                            chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                                        )}>
                                            {chat.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 bg-background",
                !activeId ? "hidden md:flex" : "flex w-full"
            )}>
                {children}
            </div>
        </div>
    )
}
