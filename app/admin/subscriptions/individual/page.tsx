"use client"

import { AdminSubscriptionList } from "@/components/admin/admin-subscription-list"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AdminSubscriptionsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Individual Subscriptions</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage all individual learner subscriptions across the platform.
                    </p>
                </div>

                <AdminSubscriptionList />
            </main>

            <Footer />
        </div>
    )
}
