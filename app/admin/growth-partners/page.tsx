"use client"

import { AdminPartnerManagement } from "@/components/admin-partner-management"

export default function AdminGrowthPartnersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Growth Partners</h1>
        <p className="text-muted-foreground">Manage organizational partnerships and tracking codes</p>
      </div>

      <AdminPartnerManagement />
    </div>
  )
}
