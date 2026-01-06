"use client"

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/constants";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
    const { currentUser } = useAuthStore();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Only connect if we have a user
        if (!currentUser) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Determine the socket URL by stripping "/api" from the end of BASE_URL
        // e.g. http://localhost:4000/api -> http://localhost:4000
        const socketUrl = BASE_URL.replace(/\/api\/?$/, "");

        const socketInstance = io(socketUrl, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            console.log("✅ Socket connected:", socketInstance.id);
            setIsConnected(true);

            // Attempt to rejoin previous rooms if any specific ones (though gateway joins user room automatically on connection)
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
            setIsConnected(false);
        });

        socketInstance.on("connect_error", (err) => {
            console.error("⚠️ Socket connection error:", err.message);
        });

        // LISTEN FOR NOTIFICATIONS
        socketInstance.on("notifications.created", (payload: any) => {
            console.log("🔔 New Notification:", payload);

            // Invalidate queries to refresh the notification list in the panel
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            // Show toast
            toast(payload.message || "New notification", {
                description: "Just now",
                icon: <Bell className="h-4 w-4 text-primary" />,
                action: {
                    label: "View",
                    onClick: () => {
                        // Could trigger opening the panel if we had a way to control it globally
                        // For now just focusing on the alert
                    }
                }
            });
        });

        // Listen for other user events
        socketInstance.on("user", (payload: any) => {
            // Generic user event handler if needed
            if (payload?.topic === "notifications.created") {
                // Usually the gateway emits directly to event name too, but if it comes wrapped:
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [currentUser, queryClient]); // Re-connect if user changes

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
