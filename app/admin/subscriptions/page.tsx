// [admin-subscriptions] 2026-05-15 — Updated: Added Organization tab and fixed pagination props
"use client"

import { SubscriptionAnalytics } from "@/components/admin/subscription-analytics"
import { AdminSubscriptionList } from "@/components/admin/admin-subscription-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/apis/admin"
import { RefreshCw, Clock, CreditCard, Loader2, Download, User, Building } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import api from "@/hooks/axiosInstance"

export default function AdminSubscriptionsPage() {
    const { triggerSubscriptionExpiryCheck, triggerRenewalCheck, retryFailedPayments } = useAdmin()
    const [isExpiryLoading, setIsExpiryLoading] = useState(false)
    const [isRenewalLoading, setIsRenewalLoading] = useState(false)
    const [isRetryLoading, setIsRetryLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [activeTab, setActiveTab] = useState("individual")

    const handleTriggerExpiry = async () => {
        setIsExpiryLoading(true)
        try {
            await triggerSubscriptionExpiryCheck.mutateAsync(undefined, {
                onSuccess: (data) => {
                    toast.success(`Expiry check complete: ${data.total} subscriptions processed`)
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to trigger expiry check")
                },
            })
        } finally {
            setIsExpiryLoading(false)
        }
    }

    const handleTriggerRenewal = async () => {
        setIsRenewalLoading(true)
        try {
            await triggerRenewalCheck.mutateAsync(undefined, {
                onSuccess: (data) => {
                    toast.success(`Renewal check complete: ${data.individualProcessed + data.organizationProcessed} subscriptions processed`)
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to trigger renewal check")
                },
            })
        } finally {
            setIsRenewalLoading(false)
        }
    }

    const handleRetryPayments = async () => {
        setIsRetryLoading(true)
        try {
            await retryFailedPayments.mutateAsync(undefined, {
                onSuccess: () => {
                    toast.success("Failed payment retry initiated")
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to retry payments")
                },
            })
        } finally {
            setIsRetryLoading(false)
        }
    }

    const handleExportCsv = async () => {
        setIsExporting(true)
        try {
            const response = await api.get('/admin-core/subscriptions/individual/export')
            const { csv, count } = response.data

            if (count === 0) {
                toast.info("No subscriptions to export")
                return
            }

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `subscriptions_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success(`Exported ${count} subscriptions`)
        } catch (error: any) {
            toast.error(error.message || "Failed to export subscriptions")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage all platform subscriptions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCsv}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        Export CSV
                    </Button>
                    <Badge variant="outline" className="text-sm">
                        Admin Only
                    </Badge>
                </div>
            </div>

            <SubscriptionAnalytics />

            <Card>
                <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                    <CardDescription>
                        Manually trigger subscription management operations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col items-center gap-2"
                            onClick={handleTriggerExpiry}
                            disabled={isExpiryLoading}
                        >
                            {isExpiryLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Clock className="h-5 w-5" />
                            )}
                            <span className="font-medium">Check Expiries</span>
                            <span className="text-xs text-muted-foreground">
                                Mark expired subscriptions
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col items-center gap-2"
                            onClick={handleTriggerRenewal}
                            disabled={isRenewalLoading}
                        >
                            {isRenewalLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <RefreshCw className="h-5 w-5" />
                            )}
                            <span className="font-medium">Process Renewals</span>
                            <span className="text-xs text-muted-foreground">
                                Trigger renewal checks
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col items-center gap-2 hover:border-orange-500"
                            onClick={handleRetryPayments}
                            disabled={isRetryLoading}
                        >
                            {isRetryLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <CreditCard className="h-5 w-5" />
                            )}
                            <span className="font-medium">Retry Failed Payments</span>
                            <span className="text-xs text-muted-foreground">
                                Reprocess failed transactions
                            </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="individual" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid grid-cols-2 w-[400px]">
                        <TabsTrigger value="individual" className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Learners
                        </TabsTrigger>
                        <TabsTrigger value="organization" className="flex items-center gap-2">
                            <Building className="h-4 w-4" /> Organizations
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="individual">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learner Subscriptions</CardTitle>
                            <CardDescription>Individual cohort subscriptions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminSubscriptionList type="individual" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="organization">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Subscriptions</CardTitle>
                            <CardDescription>Enterprise and team plans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminSubscriptionList type="organization" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
