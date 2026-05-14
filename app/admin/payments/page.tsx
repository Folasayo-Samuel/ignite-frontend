// [admin-payments] 2026-05-13 — Edited: removed Navigation, Footer (now handled by admin layout)
"use client"

import { AdminPaymentDashboard } from "@/components/payment/admin-payment-dashboard"

export default function AdminPaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage platform payments</p>
      </div>
      <AdminPaymentDashboard />
    </div>
  )
}
