"use client"

import { AdminMentorManagement } from "@/components/admin-mentor-management"

export default function AdminMentorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Management</h1>
        <p className="text-muted-foreground">Manage and monitor platform mentors</p>
      </div>
      <AdminMentorManagement />
    </div>
  )
}
