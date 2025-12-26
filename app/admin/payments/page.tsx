"use client"

import { AdminPaymentDashboard } from "@/components/payment/admin-payment-dashboard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AdminPaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPaymentDashboard />
      </main>

      <Footer />
    </div>
  )
}
