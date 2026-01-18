"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Wallet, X } from "lucide-react"
import { checkEligibility } from "@/lib/services/growth-partner"

/**
 * GrowthPartnerBanner
 * 
 * Shows a banner to users who are Growth Partners, allowing them 
 * to easily navigate to their GP dashboard.
 * 
 * Can be dismissed for the session.
 */
export function GrowthPartnerBanner() {
    const [isGrowthPartner, setIsGrowthPartner] = useState(false)
    const [loading, setLoading] = useState(true)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if user dismissed banner this session
        const wasDismissed = sessionStorage.getItem("gp_banner_dismissed")
        if (wasDismissed) {
            setDismissed(true)
            setLoading(false)
            return
        }

        // Check if user is a Growth Partner
        checkEligibility()
            .then((response: any) => {
                // Handle both direct response and wrapped response
                const result = response?.data || response
                console.log('[GP Banner] Eligibility check result:', result)

                // If isAlreadyPartner is true, user IS a growth partner
                setIsGrowthPartner(result?.isAlreadyPartner === true)
            })
            .catch((err) => {
                console.warn('[GP Banner] Eligibility check failed:', err.message)
                setIsGrowthPartner(false)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleDismiss = () => {
        setDismissed(true)
        sessionStorage.setItem("gp_banner_dismissed", "true")
    }

    if (loading || dismissed || !isGrowthPartner) {
        return null
    }

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
