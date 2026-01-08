"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Send, User, MoreVertical, ChevronLeft, Loader2, Paperclip, Volume2, VolumeX, Search, X, Smile, Circle, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMessages, Message } from "@/api/messages"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuthStore } from "@/store/authStore"
import { useSocket } from "@/components/providers/socket-provider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/hooks/apiFunction"
import { BASE_URL } from "@/constants"
import { useMediaUpload } from "@/hooks/useMediaUpload"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { useOfflineQueue } from "@/hooks/useOfflineQueue"
import { ConversationStarters } from "@/components/conversation-starters"
import { EmojiPicker, QuickReactions } from "@/components/emoji-picker"
import { LinkPreview, extractUrls } from "@/components/link-preview"
import { Textarea } from "@/components/ui/textarea"

interface MessagesPanelProps {
    partnerId: string;
    partnerUserId?: string; // User ID for socket events
    partnerName: string;
    partnerAvatar?: string;
    role: 'student' | 'mentor';
    className?: string;
    onBack?: () => void;
}

export function MessagesPanel({ partnerId, partnerUserId, partnerName, partnerAvatar, role, className, onBack }: MessagesPanelProps) {
    const {
        getStudentMessages, sendStudentMessage, markStudentMessageRead,
        getMentorMessages, sendMentorMessage, markMentorMessageRead
    } = useMessages();


    const { currentUser } = useAuthStore();
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();
    const router = useRouter();
    
    // Navigate back to dashboard based on role
    const goToDashboard = () => {
        router.push(role === 'student' ? '/learner/dashboard' : '/mentor/dashboard');
    };

    const [messageInput, setMessageInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Online status tracking
    const { isOnline: checkOnline } = useOnlineStatus(partnerUserId ? [partnerUserId] : []);
    const isPartnerOnline = partnerUserId ? checkOnline(partnerUserId) : false;

    // Offline queue for failed messages
    const { isOnline: isNetworkOnline, addToQueue, removeFromQueue, getQueuedMessages } = useOfflineQueue();

    // Search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Reaction state (which message has reaction picker open)
    const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);

    // Mute State
    const [isMuted, setIsMuted] = useState(false);

    // Initialize mute state from local storage
    useEffect(() => {
        const stored = localStorage.getItem('ignite_chat_muted');
        if (stored) setIsMuted(stored === 'true');
    }, []);

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        localStorage.setItem('ignite_chat_muted', String(newState));
        toast.info(newState ? "Sounds muted" : "Sounds enabled");
    };

    // Select logic based on role
    const getMessages = role === 'student' ? getStudentMessages : getMentorMessages;
    
    // Define queryKey early so it can be used in callbacks
    const queryKey = role === 'student'
        ? ["student_messages", partnerId]
        : ["mentor_messages", partnerId];

    // Search messages
    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const endpoint = role === 'student' 
                ? `/student/messages/${partnerId}/search?q=${encodeURIComponent(searchQuery)}`
                : `/mentor/messages/${partnerId}/search?q=${encodeURIComponent(searchQuery)}`;
            const results = await api<any[]>({ url: `${BASE_URL}${endpoint}`, method: 'GET' });
            setSearchResults(Array.isArray(results) ? results : []);
        } catch (e) {
            toast.error("Search failed");
            setSearchResults([]);
        }
        setIsSearching(false);
    }, [searchQuery, partnerId, role]);

    // Add reaction to message
    const handleReaction = useCallback(async (messageId: string, emoji: string) => {
        try {
            const endpoint = role === 'student'
                ? `/student/messages/${messageId}/react`
                : `/mentor/messages/${messageId}/react`;
            await api({ url: `${BASE_URL}${endpoint}`, method: 'POST', data: { emoji } });
            queryClient.invalidateQueries({ queryKey });
            setActiveReactionMsgId(null);
        } catch (e) {
            toast.error("Failed to add reaction");
        }
    }, [role, queryClient, queryKey]);
    // We define mutation locally to support onMutate (Optimistic UI) 
    const { mutate: sendMessage, isPending: isSending } = useMutation<Message, Error, { body: string; mentorId?: string; studentId?: string }, { previousData: any }>({
        mutationFn: (variables: { body: string, mentorId?: string, studentId?: string }) => {
            const url = role === 'student'
                ? `/student/messages/${variables.mentorId}`
                : `/mentor/messages/${variables.studentId}`;
            // Create a separate cleaned body
            const { mentorId, studentId, ...cleanBody } = variables;
            return api<Message>({
                url: `${BASE_URL}${url}`,
                method: "POST",
                data: cleanBody
            });
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);
            const optimisticId = `temp-${Date.now()}`;
            const optimisticMsg = {
                _id: optimisticId,
                body: variables.body,
                senderUserId: currentUser?.id,
                createdAt: new Date().toISOString(),
                isOptimistic: true
            };

            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old) return { pages: [[optimisticMsg]], pageParams: [0] };
                const newPages = [...old.pages];
                if (newPages.length > 0) {
                    newPages[0] = [optimisticMsg, ...newPages[0]];
                } else {
                    newPages[0] = [optimisticMsg];
                }
                /**
                 * WORLD CLASS POLISH:
                 * We are modifying the cache directly to show the message instantly.
                 * This provides that "WhatsApp-like" snappy feel.
                 */
                return { ...old, pages: newPages };
            });

            return { previousData };
        },
        onError: (err, newTodo, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
            toast.error("Failed to send message: " + err.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

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

    // Typing State
    const [partnerIsTyping, setPartnerIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    // Real-time listener
    useEffect(() => {
        if (!socket || !isConnected) return;

        console.log("🔧 Setting up message listeners for conversation:", {
            partnerId,
            partnerUserId,
            currentUserId: currentUser?.id,
            role,
            queryKey
        });

        const handleNewMessage = (payload: any) => {
            console.log("📨 New message received:", payload);
            
            // Check if this message belongs to current conversation
            const isCurrentConversation = 
                (payload.senderUserId === partnerUserId && payload.recipientUserId === currentUser?.id) ||
                (payload.senderUserId === currentUser?.id && payload.recipientUserId === partnerUserId);

            console.log("🔍 Message relevance check:", {
                isCurrentConversation,
                senderUserId: payload.senderUserId,
                recipientUserId: payload.recipientUserId,
                partnerUserId,
                currentUserId: currentUser?.id
            });

            if (isCurrentConversation) {
                console.log("✅ Message is for current conversation, invalidating queries...");
                queryClient.invalidateQueries({ queryKey });

                // If we receive a message from partner, they stopped typing
                if (payload.senderUserId === partnerUserId) {
                    setPartnerIsTyping(false);

                    // Play notification sound if window is not focused or tab is not visible
                    try {
                        if (!isMuted && !document.hasFocus()) {
                            // Using a crisp, subtle pop sound
                            const audio = new Audio("https://res.cloudinary.com/dv62ty87r/video/upload/v1709832766/pop_ex75b5.mp3");
                            audio.volume = 0.4;
                            audio.play().catch(e => console.log("Audio play failed (interaction needed)", e));
                        }
                    } catch (e) { }
                }
            } else {
                console.log("❌ Message is not for current conversation, ignoring...");
            }
        };

        const handleTyping = (payload: any) => {
            if (payload.fromUserId === partnerUserId) {
                setPartnerIsTyping(true);
            }
        };

        const handleStopTyping = (payload: any) => {
            if (payload.fromUserId === partnerUserId) {
                setPartnerIsTyping(false);
            }
        };

        const handleRead = (payload: any) => {
            // If we are looking at this thread, refresh to show blue ticks
            queryClient.invalidateQueries({ queryKey });
        };

        socket.on("messages.new", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("stop_typing", handleStopTyping);
        socket.on("messages.read", handleRead);

        return () => {
            socket.off("messages.new", handleNewMessage);
            socket.off("typing", handleTyping);
            socket.off("stop_typing", handleStopTyping);
            socket.off("messages.read", handleRead);
        };
    }, [socket, isConnected, queryClient, queryKey, partnerId, partnerUserId]);

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

    // Optimistic Update Logic
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const content = messageInput;
        setMessageInput(""); // Clear immediately
        setShouldAutoScroll(true);
        
        // Reset textarea height
        const textarea = (e.target as HTMLFormElement)?.querySelector('textarea');
        if (textarea) textarea.style.height = '44px';

        // Stop typing immediately
        if (socket && partnerUserId) socket.emit('stop_typing', { toUserId: partnerUserId });

        const payload = role === 'student'
            ? { body: content, mentorId: partnerId }
            : { body: content, studentId: partnerId };

        // Create optimistic message
        const optimisticId = `temp-${Date.now()}`;
        const optimisticMsg = {
            _id: optimisticId,
            body: content,
            senderUserId: currentUser?.id,
            createdAt: new Date().toISOString(),
            isOptimistic: true // Flag for UI
        };

        sendMessage(payload as any);
    };

    // Upload Hook
    const { uploadFile, isUploading } = useMediaUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial scroll to bottom
    // ... existing scroll logic ...

    // Handle File Selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic UI for file upload (could be improved with progress bar, but spinner is fine for "World Class" MVP)
        const toastId = toast.loading("Uploading attachment...");

        const result = await uploadFile(file);

        if (result) {
            toast.dismiss(toastId);
            // Send message immediately with attachment
            // We use a specific separate payload for attachment-only messages or combined
            // For now, let's just send the attachment as a message

            const attachmentPayload = {
                url: result.url,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                name: file.name,
                size: file.size
            };

            const payload = role === 'student'
                ? { body: "Sent an attachment", mentorId: partnerId, attachments: [attachmentPayload] }
                : { body: "Sent an attachment", studentId: partnerId, attachments: [attachmentPayload] };

            // Re-use optimistic logic? slightly complex for attachments. 
            // Let's just send for now to ensure robustness.
            sendMessage(payload as any);
        } else {
            toast.error("Upload failed", { id: toastId });
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Helper for date grouping
    const renderedMessages = React.useMemo(() => {
        const reversedMessages = [...messages].reverse();
        const result = [];
        let lastDate: string | null = null;

        for (let i = 0; i < reversedMessages.length; i++) {
            const msg = reversedMessages[i];
            const msgDate = new Date(msg.createdAt).toDateString();

            // Add Date Separator
            if (msgDate !== lastDate) {
                result.push(
                    <div key={`date-${msgDate}`} className="flex justify-center my-4">
                        <span className="bg-muted/50 text-muted-foreground text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-medium">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                );
                lastDate = msgDate;
            }

            const isMe = currentUser?.id === msg.senderUserId;
            // Grouping logic: check if next message is same sender and within short time
            const nextMsg = reversedMessages[i + 1];
            const isLastInGroup = !nextMsg || nextMsg.senderUserId !== msg.senderUserId || (new Date(nextMsg.createdAt).getTime() - new Date(msg.createdAt).getTime() > 60000 * 5);

            result.push(
                <div key={msg._id || i} className={`flex flex-col ${!isMe ? 'items-start' : 'items-end'} mb-1`}>
                    <div className={`
                        max-w-[85%] md:max-w-[70%] px-4 py-2.5 text-sm shadow-sm transition-all
                        ${isMe
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                            : 'bg-background border text-foreground rounded-2xl rounded-tl-sm'
                        }
                        ${(msg as any).isOptimistic ? 'opacity-70' : ''}
                    `}>
                        {msg.attachments && msg.attachments.length > 0 ? (
                            <div className="space-y-2">
                                {msg.attachments.map((att: any, idx: number) => (
                                    <div key={idx}>
                                        {att.type === 'image' ? (
                                            <img src={att.url} alt="attachment" className="rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(att.url, '_blank')} />
                                        ) : (
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-background/20 p-2 rounded-lg hover:bg-background/30 transition-colors">
                                                <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center">
                                                    <Paperclip className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate text-xs">{att.name || 'Attachment'}</p>
                                                    <p className="text-[10px] opacity-70">{(att.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                ))}
                                {msg.body !== "Sent an attachment" && <p className="leading-relaxed whitespace-pre-wrap break-words mt-2">{msg.body}</p>}
                            </div>
                        ) : (
                            <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.body}</p>
                        )}
                        
                        {/* Link Preview */}
                        {(msg as any).linkPreview && (
                            <LinkPreview preview={(msg as any).linkPreview} />
                        )}
                    </div>

                    {/* Reactions display */}
                    {(msg as any).reactions && (msg as any).reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(
                                (msg as any).reactions.reduce((acc: any, r: any) => {
                                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                    return acc;
                                }, {})
                            ).map(([emoji, count]) => (
                                <span 
                                    key={emoji} 
                                    className="bg-muted/80 px-1.5 py-0.5 rounded-full text-xs cursor-pointer hover:bg-muted"
                                    onClick={() => handleReaction(msg._id, emoji)}
                                >
                                    {emoji} {count as number > 1 && <span className="text-muted-foreground">{count as number}</span>}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Timestamp and reaction button */}
                    {isLastInGroup && (
                        <div className={`flex items-center gap-1 mt-1 px-1 ${!isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                            <span className="text-[10px] text-muted-foreground">
                                {format(new Date(msg.createdAt), "h:mm a")}
                            </span>
                            {(msg as any).isOptimistic && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            )}
                            {/* Quick reaction button */}
                            {!(msg as any).isOptimistic && (
                                <button 
                                    onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg._id ? null : msg._id)}
                                    className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                                >
                                    <Smile className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Quick reactions picker */}
                    {activeReactionMsgId === msg._id && (
                        <div className={`mt-1 ${isMe ? 'flex justify-end' : ''}`}>
                            <QuickReactions onSelect={(emoji) => handleReaction(msg._id, emoji)} />
                        </div>
                    )}
                </div>
            );
        }
        return result;
    }, [messages, currentUser?.id, activeReactionMsgId, handleReaction]);

    return (
        <div className={`flex flex-col h-full overflow-hidden ${className}`}>
            <div className="border-b p-4 bg-background/95 backdrop-blur z-10">
                <div className="flex items-center gap-3">
                    {/* Mobile Back to Conversations */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden -ml-2 h-8 px-2 text-muted-foreground"
                        onClick={onBack}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-xs">Chats</span>
                    </Button>

                    <div className="relative">
                        <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarImage src={partnerAvatar} className="object-cover" />
                            <AvatarFallback className="bg-primary/5 text-primary">
                                {partnerName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {/* Online status indicator */}
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${isPartnerOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{partnerName}</h3>
                        <p className="text-[10px] text-muted-foreground capitalize">
                            {isPartnerOnline ? (
                                <span className="text-green-600 font-medium">Online</span>
                            ) : (
                                role === 'student' ? 'Mentor' : 'Learner'
                            )}
                        </p>
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <Search className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    {/* Back to Dashboard - visible on desktop */}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden md:flex items-center gap-2 h-8 text-xs"
                        onClick={goToDashboard}
                    >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Dashboard
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Back to Dashboard - in menu for mobile */}
                            <DropdownMenuItem onClick={goToDashboard} className="md:hidden">
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.reload()}>
                                Refresh Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                queryClient.invalidateQueries({ queryKey });
                                toast.success("Chat updated");
                            }}>
                                Force Update
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
                <div className="border-b p-3 bg-muted/30">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={isSearching} size="sm">
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setIsSearchOpen(false); setSearchResults([]); setSearchQuery(''); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                            {searchResults.map((msg: any) => (
                                <div key={msg._id} className="p-2 bg-background rounded text-sm hover:bg-muted cursor-pointer">
                                    <p className="truncate">{msg.body}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 bg-muted/5">
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {isLoading ? (
                        <div className="space-y-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                    <Skeleton className="h-10 w-[60%] rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        role === 'student' ? (
                            <ConversationStarters 
                                partnerName={partnerName} 
                                onSelect={(text) => setMessageInput(text)} 
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground space-y-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Send className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm">No messages yet. Start the conversation!</p>
                            </div>
                        )
                    ) : (
                        <div className="space-y-4">
                            {/* Top intersection target for loading more */}
                            {hasNextPage && (
                                <div ref={topRef} className="h-4 w-full flex justify-center items-center py-4">
                                    {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                </div>
                            )}

                            {renderedMessages}

                            {partnerIsTyping && (
                                <div className="flex justify-start mb-2 px-1">
                                    <div className="bg-background border px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                <div className="shrink-0 p-4 bg-background border-t">
                    <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto items-end">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-xl shrink-0 text-muted-foreground hover:bg-muted/50"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSending || isUploading}
                        >
                            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                        </Button>
                        
                        <EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)} />
                        
                        <Textarea
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => {
                                setMessageInput(e.target.value);
                                // Auto-resize textarea
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                if (socket && isConnected && partnerUserId) {
                                    socket.emit('typing', { toUserId: partnerUserId });
                                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                    typingTimeoutRef.current = setTimeout(() => {
                                        socket.emit('stop_typing', { toUserId: partnerUserId });
                                    }, 2000);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (messageInput.trim()) {
                                        handleSend(e as any);
                                    }
                                }
                            }}
                            disabled={isSending}
                            className="flex-1 min-h-[44px] max-h-[120px] rounded-xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all resize-none overflow-y-auto"
                            rows={1}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="h-10 w-10 rounded-xl shrink-0 transition-all active:scale-95"
                            disabled={isSending || (!messageInput.trim() && !isUploading)}
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                    <p className="text-[10px] text-muted-foreground text-center mt-2 hidden sm:block">
                        Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">Shift + Enter</kbd> for new line
                    </p>
                </div>
            </div>
        </div>
    )
}
