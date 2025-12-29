"use client"

import { PaymentHistory } from "@/components/payment/payment-history"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentHistory />
      </main>

      <Footer />
    </div>
  )
}
