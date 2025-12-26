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

// Check if there's evidence of a prior authenticated session
function hasAuthEvidence(): boolean {
    if (typeof window === 'undefined') return false

    // Check for auth-storage in sessionStorage (set by zustand persist)
    const authStorage = sessionStorage.getItem('auth-storage')
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage)
            if (parsed?.state?.currentUser) return true
        } catch {
            // Invalid JSON, ignore
        }
    }

    // Check for auth cookies as fallback
    const cookies = document.cookie
    if (cookies.includes('accessToken') || cookies.includes('refreshToken')) {
        return true
    }

    return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [shouldFetchUser, setShouldFetchUser] = useState(false)

    // Check for auth evidence on mount (client-side only)
    useEffect(() => {
        setShouldFetchUser(hasAuthEvidence())
    }, [])

    const { getCurrentUser, logoutUser } = useAuth()
    const { data: userResult, isLoading, isError, refetch } = getCurrentUser(shouldFetchUser)
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
