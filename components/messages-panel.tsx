"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, User, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMessages, Message } from "@/api/messages"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { toast } from "sonner"

import { useAuthStore } from "@/store/authStore"
import { useSocket } from "@/components/providers/socket-provider"
import { useQueryClient } from "@tanstack/react-query"

interface MessagesPanelProps {
    partnerId: string;
    partnerName: string;
    partnerAvatar?: string;
    role: 'student' | 'mentor';
    className?: string;
}

export function MessagesPanel({ partnerId, partnerName, partnerAvatar, role, className }: MessagesPanelProps) {
    const {
        getStudentMessages, sendStudentMessage, markStudentMessageRead,
        getMentorMessages, sendMentorMessage, markMentorMessageRead
    } = useMessages();
    const { currentUser } = useAuthStore();
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    const [messageInput, setMessageInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Select logic based on role
    const getMessages = role === 'student' ? getStudentMessages : getMentorMessages;
    const { mutate: sendMessage, isPending: isSending } = role === 'student'
        ? sendStudentMessage
        : sendMentorMessage;

    const queryKey = role === 'student'
        ? ["student_messages", partnerId]
        : ["mentor_messages", partnerId];

    const {
        data: infiniteData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = getMessages(partnerId, 20);

    // Flatten pages into a single message list
    const messages = React.useMemo(() => {
        if (!infiniteData) return [];
        return infiniteData.pages.flatMap(page => page || []);
    }, [infiniteData]);

    // Real-time listener
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewMessage = (payload: any) => {
            console.log("📨 Real-time message event:", payload);

            // Optimization: Only invalidate if the message belongs to this conversation
            // The payload usually contains sender/recipient IDs. 
            // We check if the partnerId matches either sender or recipient.
            const isRelevant =
                payload.senderUserId === partnerId ||
                payload.recipientUserId === partnerId ||
                payload.threadId; // If threadId is available and matches (need to fetch threadId context if needed)

            // For simplicity, we invalidate. Ideally we check IDs more strictly.
            // If the message is actively being viewed, strictly we want to append it.
            // But invalidating the query is safe and refreshes the view.
            queryClient.invalidateQueries({ queryKey });
        };

        socket.on("messages.new", handleNewMessage);

        return () => {
            socket.off("messages.new", handleNewMessage);
        };
    }, [socket, isConnected, queryClient, queryKey, partnerId]);

    // Scroll management
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    // Initial scroll to bottom
    useEffect(() => {
        if (!isLoading && messages.length > 0 && shouldAutoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [messages.length, isLoading, shouldAutoScroll]);

    // Infinite scroll trigger (when scrolling up)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    setShouldAutoScroll(false); // Don't snap to bottom when loading older messages
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (topRef.current) observer.observe(topRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const payload = role === 'student'
            ? { body: messageInput, mentorId: partnerId }
            : { body: messageInput, studentId: partnerId };

        sendMessage(payload as any, {
            onSuccess: () => {
                setMessageInput("");
                setShouldAutoScroll(true); // Snap to bottom on new message
                queryClient.invalidateQueries({ queryKey });
            },
            onError: () => {
                toast.error("Failed to send message");
            }
        });
    };

    return (
        <Card className={`flex flex-col h-[600px] border-2 ${className}`}>
            <CardHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={partnerAvatar} />
                            <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-semibold">{partnerName}</CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">{role === 'student' ? 'Mentor' : 'Learner'}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                    <Skeleton className="h-10 w-[60%] rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Top intersection target for loading more */}
                            <div ref={topRef} className="h-4 w-full flex justify-center items-center">
                                {isFetchingNextPage && <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
                            </div>

                            {/* Messages are reversed in time (latest at bottom), but infinite query returns pages of [latest...oldest]. 
                                 Wait, typically infinite scroll for chat loads *older* messages as you scroll *up*.
                                 If the API returns latest 20, then the next page is 20 older.
                                 Array is [Latest Page, Older Page, Oldest Page]. 
                                 We need to display them in chronological order.
                                 So we flatten, then REVERSE the entire list so oldest is at top, new at bottom.
                             */}
                            {[...messages].reverse().map((msg) => {
                                const isMe = currentUser?.id === msg.senderUserId;
                                return (
                                    <div key={msg._id} className={`flex ${!isMe ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${isMe
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-foreground'
                                            }`}>
                                            <p>{msg.body}</p>
                                            <p className="text-[10px] opacity-70 mt-1 text-right">
                                                {format(new Date(msg.createdAt), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            disabled={isSending}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isSending || !messageInput.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
