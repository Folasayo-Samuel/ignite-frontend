"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useUser } from "@/api/user"
import { Skeleton } from "@/components/ui/skeleton"

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
        return fallback || <AuthLoadingSkeleton />
    }

    // Not authenticated - will redirect
    if (!isAuthenticated) {
        return fallback || <AuthLoadingSkeleton />
    }

    // Authenticated - render protected content
    return <>{children}</>
}

function AuthLoadingSkeleton() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="space-y-3 pt-8">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
}
