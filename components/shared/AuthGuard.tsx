"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { useAuthStore } from "@/store/authStore"
import { useUser } from "@/api/user"

interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

/**
 * AuthGuard - Protects routes requiring authentication
 * 
 * Checks if user is authenticated before rendering children.
 * If not authenticated, redirects to login page with return URL.
 * 
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { currentUser } = useAuthStore()
    const { getCurrentUser } = useUser()

    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Try to get current user from API (validates token)
    const { data: userData, isLoading, error } = getCurrentUser()

    useEffect(() => {
        // Wait for API call to complete
        if (isLoading) return

        // If we have user data from API, they're authenticated
        if (userData && (userData as any)._id) {
            setIsAuthenticated(true)
            setIsChecking(false)
            return
        }

        // Check store as fallback (in case API call is stale)
        if (currentUser) {
            setIsAuthenticated(true)
            setIsChecking(false)
            return
        }

        // If API failed and no stored user, redirect to login
        if (error || (!userData && !currentUser)) {
            const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`
            router.replace(loginUrl)
            return
        }

        setIsChecking(false)
    }, [userData, currentUser, isLoading, error, pathname, router])

    // Show loading state while checking auth
    if (isLoading || isChecking) {
        return fallback || <LoadingScreen />
    }

    // Not authenticated - will redirect
    if (!isAuthenticated) {
        return fallback || <LoadingScreen />
    }

    // Authenticated - render protected content
    return <>{children}</>
}
