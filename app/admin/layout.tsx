// [admin-layout] 2026-05-13 — Isolated admin layout with dark sidebar and auth guard
"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAdminSession, canAccessRoute, isSuperAdmin as checkSuperAdmin } from "@/lib/admin-auth"
import { useAdminAuth } from "@/apis/admin-auth"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  DollarSign,
  Handshake,
  Heart,
  FileWarning,
  Settings,
  ScrollText,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Sidebar navigation items                                           */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  superAdminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Mentors", href: "/admin/mentors", icon: Users },
  { label: "Learners", href: "/admin/learners", icon: GraduationCap },
  { label: "Cohorts", href: "/admin/cohorts", icon: Layers },
  { label: "Financials", href: "/admin/financials", icon: DollarSign },
  { label: "Growth Partners", href: "/admin/growth-partners", icon: Handshake },
  { label: "Sponsors", href: "/admin/sponsors", icon: Heart },
  { label: "Content", href: "/admin/content", icon: FileWarning },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign },
  { label: "Team", href: "/admin/team", icon: Shield, superAdminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
  { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText, superAdminOnly: true },
]

/* ------------------------------------------------------------------ */
/*  Loading screen (matches existing LoadingScreen pattern)            */
/* ------------------------------------------------------------------ */

function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <Shield className="h-8 w-8 text-orange-400 animate-pulse" />
          <span className="text-xl font-semibold text-white">FolaIgnite Admin</span>
        </div>
        <p className="text-sm text-gray-400">Verifying access…</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Admin Auth Guard                                                   */
/* ------------------------------------------------------------------ */

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, role, isLoading, isFetched, isAuthenticated, isAdmin } = useAdminSession()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isLoading || !isFetched) return

    if (!isAuthenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (!isAdmin) {
      router.replace("/home")
      return
    }

    setChecked(true)
  }, [isLoading, isFetched, isAuthenticated, isAdmin, router, pathname])

  if (!checked) {
    return <AdminLoadingScreen />
  }

  return <>{children}</>
}

/* ------------------------------------------------------------------ */
/*  Sidebar Component                                                  */
/* ------------------------------------------------------------------ */

function AdminSidebar({
  collapsed,
  onClose,
  role,
}: {
  collapsed: boolean
  onClose: () => void
  role?: string
}) {
  const pathname = usePathname()
  const userIsSuperAdmin = checkSuperAdmin(role)

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly && !userIsSuperAdmin) return false
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[240px] bg-[#1A1A2E] text-gray-300 flex flex-col transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:z-30",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
            <span className="text-lg font-bold text-white tracking-tight">
              FolaIgnite <span className="text-orange-400 font-normal text-sm">Admin</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-orange-500/15 text-orange-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        <Separator className="bg-white/10" />

        {/* Bottom: Back to site */}
        <div className="px-3 py-4">
          <Link
            href="/home"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-150"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Back to site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Top Bar Component                                                  */
/* ------------------------------------------------------------------ */

function AdminTopBar({
  onMenuToggle,
  userName,
  userRole,
}: {
  onMenuToggle: () => void
  userName?: string
  userRole?: string
}) {
  const router = useRouter()
  const { logoutAdmin } = useAdminAuth()

  const handleLogout = async () => {
    try {
      await logoutAdmin.mutateAsync()
    } finally {
      router.push("/admin/login")
    }
  }

  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left: hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Desktop spacer */}
      <div className="hidden lg:block" />

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            {userName || "Admin"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {userRole === "super_admin" ? "Super Admin" : "Admin"}
          </p>
        </div>

        <div className="h-8 w-8 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">
          {(userName || "A").charAt(0).toUpperCase()}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-1.5">Logout</span>
        </Button>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Root Admin Layout                                                  */
/* ------------------------------------------------------------------ */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, role } = useAdminSession()

  const userName = user?.name || user?.email || "Admin"

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          role={role}
        />

        {/* Main content area — offset by sidebar width on desktop */}
        <div className="lg:ml-[240px] flex flex-col min-h-screen">
          <AdminTopBar
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            userName={userName}
            userRole={role}
          />

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
