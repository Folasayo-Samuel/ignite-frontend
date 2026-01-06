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
        ? ["student_messages", partnerId, undefined]
        : ["mentor_messages", partnerId, undefined];

    const { data: messagesResult, isLoading, refetch } = getMessages(partnerId);

    // Real-time listener
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewMessage = (payload: any) => {
            console.log("📨 Real-time message event:", payload);
            // Invalidate the query to fetch new messages if it's the current thread
            if (payload.threadId) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        socket.on("messages.new", handleNewMessage);

        return () => {
            socket.off("messages.new", handleNewMessage);
        };
    }, [socket, isConnected, queryClient, queryKey]);

    const messages = (messagesResult as any)?.data as Message[] || [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const payload = role === 'student'
            ? { body: messageInput, mentorId: partnerId }
            : { body: messageInput, studentId: partnerId };

        sendMessage(payload as any, {
            onSuccess: () => {
                setMessageInput("");
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
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
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
                            {messages.slice().reverse().map((msg) => {
                                // The backend stores senderUserId as the User's ID
                                // partnerId passed to this component is the Profile ID (Student/Mentor ID)
                                // To know if a message is from "me", we compare its senderUserId with our current user's ID
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
                            <div ref={scrollRef} />
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
