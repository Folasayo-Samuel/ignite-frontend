"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useUser } from "@/api/user"
import { AuthGuard } from "./AuthGuard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from "lucide-react"

type UserRole = "student" | "mentor" | "partner" | "admin"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
    redirectOnFail?: string
    showAccessDenied?: boolean
}

/**
 * RoleGuard - Role-based access control for routes
 * 
 * Wraps AuthGuard and adds role checking.
 * Redirects or shows access denied if user's role doesn't match.
 * 
 * Usage:
 * ```tsx
 * <RoleGuard allowedRoles={["admin"]}>
 *   <AdminContent />
 * </RoleGuard>
 * 
 * <RoleGuard allowedRoles={["student", "mentor"]} showAccessDenied>
 *   <SharedContent />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
    children,
    allowedRoles,
    redirectOnFail,
    showAccessDenied = true
}: RoleGuardProps) {
    return (
        <AuthGuard>
            <RoleChecker
                allowedRoles={allowedRoles}
                redirectOnFail={redirectOnFail}
                showAccessDenied={showAccessDenied}
            >
                {children}
            </RoleChecker>
        </AuthGuard>
    )
}

interface RoleCheckerProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
    redirectOnFail?: string
    showAccessDenied: boolean
}

function RoleChecker({ children, allowedRoles, redirectOnFail, showAccessDenied }: RoleCheckerProps) {
    const router = useRouter()
    const { currentUser } = useAuthStore()
    const { getCurrentUser } = useUser()
    const { data: userData } = getCurrentUser()

    const [hasAccess, setHasAccess] = useState<boolean | null>(null)

    // Determine user's role from API response or store
    const userRole = (userData?.role || currentUser?.role) as UserRole | undefined

    useEffect(() => {
        if (!userRole) {
            // Wait for role to be available
            return
        }

        const isAllowed = allowedRoles.includes(userRole)
        setHasAccess(isAllowed)

        if (!isAllowed && redirectOnFail) {
            router.replace(redirectOnFail)
        }
    }, [userRole, allowedRoles, redirectOnFail, router])

    // Still checking
    if (hasAccess === null) {
        return null
    }

    // Access denied
    if (!hasAccess) {
        if (showAccessDenied) {
            return <AccessDeniedCard userRole={userRole} allowedRoles={allowedRoles} />
        }
        return null
    }

    // Access granted
    return <>{children}</>
}

interface AccessDeniedCardProps {
    userRole?: UserRole
    allowedRoles: UserRole[]
}

function AccessDeniedCard({ userRole, allowedRoles }: AccessDeniedCardProps) {
    const router = useRouter()

    const getRoleRedirect = (role?: UserRole) => {
        switch (role) {
            case "admin":
                return "/admin/dashboard"
            case "student":
                return "/student/dashboard"
            case "mentor":
                return "/mentors"
            case "partner":
                return "/partner/dashboard"
            default:
                return "/"
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-destructive/5 via-background to-muted/20">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <ShieldX className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription className="text-base">
                        You don't have permission to access this page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted text-sm">
                        <p className="text-muted-foreground">
                            Your role: <span className="font-medium text-foreground capitalize">{userRole || "Unknown"}</span>
                        </p>
                        <p className="text-muted-foreground mt-1">
                            Required: <span className="font-medium text-foreground capitalize">{allowedRoles.join(", ")}</span>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => router.push(getRoleRedirect(userRole))}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
