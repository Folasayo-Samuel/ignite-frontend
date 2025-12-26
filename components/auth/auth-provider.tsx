"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth, User } from "@/api/auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
    user: (User & { organizationId?: string }) | null
    isLoading: boolean
    isAuthenticated: boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { getCurrentUser, logoutUser } = useAuth()
    const { data: userResult, isLoading, isError, refetch } = getCurrentUser()
    const { mutate: performLogout } = logoutUser
    const router = useRouter()
    const pathname = usePathname()

    // We can use a derived state or just the raw data
    const user = userResult?.data ? { ...userResult.data, organizationId: (userResult.data as any).organizationId } : null
    const isAuthenticated = !!user

    // Effect to handle protected routes if needed, 
    // currently we just provide the state and let specific pages/guards handle redirects
    // But we can ensure we refetch on mount to be sure
    useEffect(() => {
        // Optionally refetch on path change if we suspect stale auth
    }, [pathname])

    const logout = () => {
        performLogout({}, {
            onSuccess: () => {
                // Clear query cache if possible, or just hard reload
                window.location.href = '/auth/login'
            }
        })
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider")
    }
    return context
}
