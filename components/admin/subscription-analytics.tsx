"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubscriptions } from "@/api/subscriptions"
import { TrendingUp, TrendingDown, DollarSign, Users, CalendarCheck, AlertCircle } from "lucide-react"
import { useMemo } from "react"

interface SubscriptionStats {
    totalSubscriptions: number
    activeSubscriptions: number
    pendingSubscriptions: number
    expiredSubscriptions: number
    cancelledSubscriptions: number
    totalRevenue: number
    averageValue: number
    conversionRate: number
}

export function SubscriptionAnalytics() {
    const { getAdminAllSubscriptions } = useSubscriptions()

    // Fetch all subscriptions for analytics
    const { data: allData, isLoading: loadingAll } = getAdminAllSubscriptions(undefined, 1000, 0)
    const { data: activeData, isLoading: loadingActive } = getAdminAllSubscriptions('active', 1000, 0)
    const { data: pendingData, isLoading: loadingPending } = getAdminAllSubscriptions('pending', 1000, 0)
    const { data: expiredData, isLoading: loadingExpired } = getAdminAllSubscriptions('expired', 500, 0)

    const isLoading = loadingAll || loadingActive || loadingPending || loadingExpired

    // Calculate analytics from subscription data
    const stats: SubscriptionStats = useMemo(() => {
        const all = allData?.data || []
        const active = activeData?.data || []
        const pending = pendingData?.data || []
        const expired = expiredData?.data || []

        const totalRevenue = all
            .filter((sub: any) => sub.status === 'active' || sub.status === 'expired')
            .reduce((sum: number, sub: any) => sum + (sub.amount || 0), 0)

        const avgValue = all.length > 0 ? totalRevenue / all.length : 0
        const conversionRate = all.length > 0
            ? (active.length / all.length) * 100
            : 0

        return {
            totalSubscriptions: allData?.count || 0,
            activeSubscriptions: activeData?.count || active.length,
            pendingSubscriptions: pendingData?.count || pending.length,
            expiredSubscriptions: expiredData?.count || expired.length,
            cancelledSubscriptions: all.filter((s: any) => s.status === 'cancelled').length,
            totalRevenue,
            averageValue: avgValue,
            conversionRate,
        }
    }, [allData, activeData, pendingData, expiredData])

    const formatCurrency = (amount: number) => {
        // Assuming amount is in kobo (smallest currency unit)
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount / 100)
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const analyticsCards = [
        {
            title: "Active Subscriptions",
            value: stats.activeSubscriptions.toLocaleString(),
            description: `${stats.conversionRate.toFixed(1)}% of total`,
            icon: Users,
            trend: "up",
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            title: "Pending Payments",
            value: stats.pendingSubscriptions.toLocaleString(),
            description: "Awaiting payment confirmation",
            icon: CalendarCheck,
            trend: stats.pendingSubscriptions > 0 ? "attention" : "neutral",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        },
        {
            title: "Expired",
            value: stats.expiredSubscriptions.toLocaleString(),
            description: "Renewal opportunity",
            icon: AlertCircle,
            trend: "neutral",
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            description: `Avg: ${formatCurrency(stats.averageValue)}/sub`,
            icon: DollarSign,
            trend: "up",
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Subscription Analytics
                </CardTitle>
                <CardDescription>
                    Overview of all individual subscriptions on the platform
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {analyticsCards.map((card) => (
                        <div
                            key={card.title}
                            className={`p-4 rounded-lg ${card.bgColor} transition-all hover:scale-105`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </span>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{card.value}</span>
                                {card.trend === "up" && (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                )}
                                {card.trend === "down" && (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Status breakdown bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Subscription Status Distribution</span>
                        <span className="text-sm text-muted-foreground">
                            {stats.totalSubscriptions} total
                        </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                        {stats.totalSubscriptions > 0 && (
                            <>
                                <div
                                    className="bg-green-500 h-full transition-all"
                                    style={{
                                        width: `${(stats.activeSubscriptions / stats.totalSubscriptions) * 100}%`,
                                    }}
                                    title={`Active: ${stats.activeSubscriptions}`}
                                />
                                <div
                                    className="bg-yellow-500 h-full transition-all"
                                    style={{
                                        width: `${(stats.pendingSubscriptions / stats.totalSubscriptions) * 100}%`,
                                    }}
                                    title={`Pending: ${stats.pendingSubscriptions}`}
                                />
                                <div
                                    className="bg-red-500 h-full transition-all"
                                    style={{
                                        width: `${(stats.expiredSubscriptions / stats.totalSubscriptions) * 100}%`,
                                    }}
                                    title={`Expired: ${stats.expiredSubscriptions}`}
                                />
                                <div
                                    className="bg-gray-400 h-full transition-all"
                                    style={{
                                        width: `${(stats.cancelledSubscriptions / stats.totalSubscriptions) * 100}%`,
                                    }}
                                    title={`Cancelled: ${stats.cancelledSubscriptions}`}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>Expired</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <span>Cancelled</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
