import { AdminStatsOverview } from "@/components/admin-stats-overview"
import { AdminUserManagement } from "@/components/admin-user-management"
import { AdminProjectModeration } from "@/components/admin-project-moderation"
import { AdminCohortOverview } from "@/components/admin-cohort-overview"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage FolaIgnite platform and users</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <AdminStatsOverview />

          <div className="grid gap-8 lg:grid-cols-2">
            <AdminCohortOverview />
            <AdminProjectModeration />
          </div>

          <AdminUserManagement />
        </div>
      </div>
    </div>
  )
}
