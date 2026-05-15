"use client"

import { AdminSponsorManagement } from "@/components/admin-sponsor-management"

export default function AdminSponsorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
        <p className="text-muted-foreground">Manage platform sponsors and contribution requests</p>
      </div>

      <AdminSponsorManagement />
    </div>
  )
}
