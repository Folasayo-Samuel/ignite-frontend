// [admin-auth] 2026-05-13 — Admin authentication hook and role constants
"use client"

import { useAdminAuth } from "@/apis/admin-auth"
import type { AdminUser } from "@/apis/admin-auth"

/**
 * All roles that grant access to the /admin area.
 * The backend User schema must include these in its role enum.
 */
export const ADMIN_ROLES = ["admin", "super_admin"] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

/**
 * Routes that only SUPER_ADMIN can access.
 * ADMIN users will not see these in the sidebar.
 */
export const SUPER_ADMIN_ONLY_ROUTES = [
  "/admin/settings",
  "/admin/audit-log",
]

/**
 * Check if a given role string qualifies as an admin role.
 */
export function isAdminRole(role?: string): role is AdminRole {
  return !!role && ADMIN_ROLES.includes(role as AdminRole)
}

/**
 * Check if a given role is SUPER_ADMIN.
 */
export function isSuperAdmin(role?: string): boolean {
  return role === "super_admin"
}

/**
 * Check if an admin with the given role can access a specific route.
 * SUPER_ADMIN can access everything. ADMIN cannot access SUPER_ADMIN_ONLY_ROUTES.
 */
export function canAccessRoute(role: string | undefined, pathname: string): boolean {
  if (!isAdminRole(role)) return false
  if (isSuperAdmin(role)) return true

  // Regular admin — block super_admin-only routes
  return !SUPER_ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * useAdminSession — Hook to get the current admin user session.
 *
 * Returns the admin user, their role, and loading state.
 * Used by the admin layout to guard access and render role-aware UI.
 *
 * This uses the isolated /admin-auth endpoints.
 */
export function useAdminSession() {
  const { getCurrentAdmin } = useAdminAuth()
  const { data: adminUser, isLoading, isFetched, error } = getCurrentAdmin()

  const role = adminUser?.role

  return {
    user: adminUser,
    role,
    isLoading,
    isFetched,
    isAuthenticated: !!adminUser && !error,
    isAdmin: isAdminRole(role),
    isSuperAdmin: isSuperAdmin(role),
  }
}
