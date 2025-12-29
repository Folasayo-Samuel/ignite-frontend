"use client"

import { SubscriptionDashboard } from "@/components/payment/subscription-dashboard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function SubscriptionManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubscriptionDashboard />
      </main>

      <Footer />
    </div>
  )
}
