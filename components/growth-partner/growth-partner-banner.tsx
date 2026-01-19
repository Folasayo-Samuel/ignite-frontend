"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Wallet, X, Users } from "lucide-react"
import { checkEligibility } from "@/lib/services/growth-partner"

/**
 * GrowthPartnerBanner
 * 
 * Shows different banners based on user status:
 * - For Growth Partners: Link to their GP dashboard
 * - For eligible non-partners: CTA to become a Growth Partner
 * 
 * Can be dismissed for 24 hours.
 */
export function GrowthPartnerBanner() {
    const [isGrowthPartner, setIsGrowthPartner] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if user dismissed banner recently (within 24 hours)
        const dismissedAt = localStorage.getItem("gp_banner_dismissed")
        if (dismissedAt) {
            const dismissTime = parseInt(dismissedAt, 10)
            const hoursSinceDismiss = (Date.now() - dismissTime) / (1000 * 60 * 60)
            if (hoursSinceDismiss < 24) {
                setDismissed(true)
                setLoading(false)
                return
            } else {
                // Clear old dismissal
                localStorage.removeItem("gp_banner_dismissed")
            }
        }

        // Check if user is a Growth Partner
        checkEligibility()
            .then((response: any) => {
                const result = response?.data || response
                console.log('[GP Banner] Eligibility check result:', result)
                setIsGrowthPartner(result?.isAlreadyPartner === true)
            })
            .catch((err) => {
                console.warn('[GP Banner] Eligibility check failed:', err.message)
                // If eligibility check fails (likely auth issue), don't show banner
                setIsGrowthPartner(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleDismiss = () => {
        setDismissed(true)
        // Store timestamp instead of boolean - banner will reappear after 24 hours
        localStorage.setItem("gp_banner_dismissed", Date.now().toString())
    }

    if (loading || dismissed || isGrowthPartner === null) {
        return null
    }

    // User is already a Growth Partner - show dashboard link
    if (isGrowthPartner) {
        return (
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                You're a Growth Partner! 🎉
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Track your referrals and earnings
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1 sm:flex-none gap-2"
                            asChild
                        >
                            <Link href="/growth-partner/dashboard">
                                <Wallet className="h-4 w-4" />
                                View Earnings
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={handleDismiss}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Dismiss</span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // User is NOT a Growth Partner - show CTA to join
    return (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border border-orange-200 dark:border-orange-800 rounded-lg px-4 py-3 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                        <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-orange-900 dark:text-orange-100">
                            Earn by sharing FolaIgnite! 💰
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                            Get 20% commission when friends subscribe
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="default"
                        size="sm"
                        className="flex-1 sm:flex-none gap-2 bg-orange-600 hover:bg-orange-700"
                        asChild
                    >
                        <Link href="/growth-partner/onboard">
                            <TrendingUp className="h-4 w-4" />
                            Become a Partner
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

