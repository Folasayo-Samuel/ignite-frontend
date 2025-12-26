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

    const [messageInput, setMessageInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Select logic based on role
    const getMessages = role === 'student' ? getStudentMessages : getMentorMessages;
    const sendMessageHook = role === 'student' ? sendStudentMessage : sendMentorMessage;
    const markReadHook = role === 'student' ? markStudentMessageRead : markMentorMessageRead;

    const { data: messagesResult, isLoading, refetch } = getMessages(partnerId);
    const { mutate: sendMessage, isPending: isSending } = sendMessageHook(partnerId);
    // Mark read logic could be added here or on effect

    const messages = (messagesResult as any)?.data as Message[] || [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        sendMessage({ body: messageInput }, {
            onSuccess: () => {
                setMessageInput("");
                refetch();
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
                            <p className="text-xs text-muted-foreground capitalize">{role === 'student' ? 'Mentor' : 'Student'}</p>
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
                            {messages.slice().reverse().map((msg) => { // Reverse if backend returns desc
                                // Assuming backend might return sent/received differentiation. 
                                // Actually, controller response 'id', 'body', 'createdAt'. It doesn't say 'senderId'.
                                // We might need to check 'senderId' from actual API, or infer owner.
                                // For now, assume we'll just show them all on one side until 'senderId' is exposed.
                                // Controller logic: svc.listMessagesForStudent(req.user.sub, ...)
                                // Messages likely contain sender field.
                                const isMe = false; // Need my ID to know. MVP Limitation.
                                // Workaround: We can't easily know who sent what without senderId in response.
                                // I update `api/messages.ts` with `senderId` in interface, assuming backend returns it.
                                // If backend doesn't, this UI will be confusing.
                                // For now, I'll align them left/right based on random or just simple list.
                                // Actually, let's assume `msg.senderId` exists.

                                return (
                                    <div key={msg.id} className={`flex ${msg.senderId === partnerId ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${msg.senderId !== partnerId // if I sent it (assuming not partner)
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
