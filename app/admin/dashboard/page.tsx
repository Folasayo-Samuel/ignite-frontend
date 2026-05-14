// [admin-dashboard] 2026-05-13 — Edited: removed Navigation, Footer, RoleGuard (now handled by admin layout)
"use client"

import { AdminStatsOverview } from "@/components/admin-stats-overview"
import { AdminUserManagement } from "@/components/admin-user-management"
import { AdminProjectModeration } from "@/components/admin-project-moderation"
import { AdminCohortOverview } from "@/components/admin-cohort-overview"
import { AdminAnalyticsExport } from "@/components/admin-analytics-export"
import { AdminMentorManagement } from "@/components/admin-mentor-management"
import { AdminResourcesManagement } from "@/components/admin-resources-management"
import { AdminEventsManagement } from "@/components/admin-events-management"
import { AuditLogsTable } from "@/components/audit-logs-table"
import { AdminTestimonialsManagement } from "@/components/admin-testimonials-management"
import { SubscriptionAnalytics } from "@/components/admin/subscription-analytics"
import { SystemHealthDashboard } from "@/components/admin/system-health"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage FolaIgnite platform and users</p>
      </div>

      <AdminStatsOverview />

      {/* System Health and Subscription Overview */}
      <div className="grid gap-8 lg:grid-cols-2">
        <SystemHealthDashboard />
        <SubscriptionAnalytics />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AdminCohortOverview />
        <AdminProjectModeration />
      </div>

      <AdminMentorManagement />
      <div className="grid gap-8 lg:grid-cols-2">
        <AdminResourcesManagement />
        <AdminEventsManagement />
      </div>

      <AdminTestimonialsManagement />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminUserManagement />
        </div>
        <AdminAnalyticsExport />
      </div>

      {/* Audit Logs Section */}
      <AuditLogsTable
        title="Recent Activity"
        description="Monitor all platform changes and user actions"
      />
    </div>
  )
}
