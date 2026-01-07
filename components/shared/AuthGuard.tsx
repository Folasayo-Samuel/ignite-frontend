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

    // Track redirect state to prevent content flash
    const [isRedirecting, setIsRedirecting] = useState(false)

    // Try to get current user from API (validates token)
    const { data: userData, isLoading, error, isFetched } = getCurrentUser()

    // Determine if user is authenticated
    const isAuthenticated = !!(userData && (userData as any)._id) || !!currentUser

    useEffect(() => {
        // Don't do anything while still loading
        if (isLoading) return

        // Already redirecting, don't trigger again
        if (isRedirecting) return

        // If authenticated, we're good
        if (isAuthenticated) return

        // Not authenticated - redirect to login
        // This covers: API error, empty userData, no currentUser
        if (isFetched && !isAuthenticated) {
            setIsRedirecting(true)
            const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`
            router.replace(loginUrl)
        }
    }, [userData, currentUser, isLoading, isFetched, isAuthenticated, isRedirecting, pathname, router])

    // Show loading state while checking auth or redirecting
    if (isLoading || isRedirecting || !isFetched) {
        return fallback || <LoadingScreen />
    }

    // Not authenticated - show loading while redirect happens
    if (!isAuthenticated) {
        return fallback || <LoadingScreen />
    }

    // Authenticated - render protected content
    return <>{children}</>
}
