"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    CreditCard,
    TrendingUp,
    TrendingDown,
    Users,
    BookOpen,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowUpRight
} from "lucide-react"
import { useSubscriptions } from "@/api/subscriptions"
import { toast } from "sonner"
import { format } from "date-fns"
import { useState } from "react"

interface OrganizationSubscriptionCardProps {
    organizationId: string
}

const tierColors: Record<string, string> = {
    basic: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    pro: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    enterprise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
}

export function OrganizationSubscriptionCard({ organizationId }: OrganizationSubscriptionCardProps) {
    const {
        getOrganizationSubscription,
        getOrgUsage,
        getPendingDowngrade,
        cancelPendingDowngrade,
        toggleOrgAutoRenew,
        upgradeOrganization,
    } = useSubscriptions()

    const { data: subResult, isLoading: loadingSub, refetch: refetchSub } = getOrganizationSubscription(organizationId)
    const { data: usageResult, isLoading: loadingUsage } = getOrgUsage(organizationId)
    const { data: downgradeResult, isLoading: loadingDowngrade } = getPendingDowngrade(organizationId)

    const subscription = (subResult as any)?.data
    const usage = (usageResult as any)?.data
    const pendingDowngrade = (downgradeResult as any)?.data

    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

    const isLoading = loadingSub || loadingUsage || loadingDowngrade

    const handleToggleAutoRenew = () => {
        const { mutate } = toggleOrgAutoRenew(organizationId)
        mutate(
            { autoRenew: !subscription?.autoRenew },
            {
                onSuccess: () => {
                    toast.success(`Auto-renew ${subscription?.autoRenew ? "disabled" : "enabled"}`)
                    refetchSub()
                },
                onError: () => toast.error("Failed to update auto-renew setting"),
            }
        )
    }

    const handleCancelDowngrade = () => {
        const { mutate } = cancelPendingDowngrade(organizationId)
        mutate(undefined, {
            onSuccess: () => {
                toast.success("Downgrade cancelled")
                refetchSub()
            },
            onError: () => toast.error("Failed to cancel downgrade"),
        })
    }

    const handleUpgrade = (tier: "pro" | "enterprise") => {
        const { mutate } = upgradeOrganization(organizationId)
        mutate(
            { tier },
            {
                onSuccess: () => {
                    toast.success(`Upgraded to ${tier}!`)
                    setUpgradeDialogOpen(false)
                    refetchSub()
                },
                onError: () => toast.error("Failed to upgrade subscription"),
            }
        )
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!subscription) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Subscription
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No active subscription</p>
                        <Button>Subscribe Now</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const cohortsUsed = usage?.currentCohorts || 0
    const maxCohorts = usage?.maxCohorts || subscription?.maxCohorts || 1
    const learnersUsed = usage?.currentLearners || 0
    const maxLearners = usage?.maxLearnersPerCohort || subscription?.maxLearnersPerCohort || 1

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Subscription
                            </CardTitle>
                            <CardDescription>
                                Manage your organization's subscription plan
                            </CardDescription>
                        </div>
                        <Badge className={tierColors[subscription.tier] || tierColors.basic}>
                            {subscription.tier?.toUpperCase()} Plan
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Pending Downgrade Warning */}
                    {pendingDowngrade && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Downgrade Scheduled
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Your plan will be downgraded to <strong>{pendingDowngrade.pendingTier}</strong> on{" "}
                                    {pendingDowngrade.effectiveDate
                                        ? format(new Date(pendingDowngrade.effectiveDate), "MMMM d, yyyy")
                                        : "your renewal date"}.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCancelDowngrade}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                        </div>
                    )}

                    {/* Status Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Badge className={statusColors[subscription.status] || statusColors.pending}>
                                {subscription.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {subscription.status}
                            </Badge>
                            {subscription.endDate && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Renews {format(new Date(subscription.endDate), "MMM d, yyyy")}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Auto-renew</span>
                            <Switch
                                checked={subscription.autoRenew}
                                onCheckedChange={handleToggleAutoRenew}
                            />
                        </div>
                    </div>

                    {/* Usage Meters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Cohorts Usage */}
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Cohorts
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {cohortsUsed} / {maxCohorts}
                                </span>
                            </div>
                            <Progress
                                value={(cohortsUsed / maxCohorts) * 100}
                                className="h-2"
                            />
                            {cohortsUsed >= maxCohorts && (
                                <p className="text-xs text-yellow-600 mt-2">
                                    Limit reached. Upgrade to create more cohorts.
                                </p>
                            )}
                        </div>

                        {/* Learners Usage */}
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Learners per Cohort
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {learnersUsed} / {maxLearners}
                                </span>
                            </div>
                            <Progress
                                value={(learnersUsed / maxLearners) * 100}
                                className="h-2"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {subscription.tier !== "enterprise" && (
                            <Button
                                className="flex-1 gap-2"
                                onClick={() => setUpgradeDialogOpen(true)}
                            >
                                <TrendingUp className="h-4 w-4" />
                                Upgrade Plan
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                            View Billing History
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Dialog */}
            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upgrade Your Plan</DialogTitle>
                        <DialogDescription>
                            Choose a plan that fits your organization's needs.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {subscription.tier === "basic" && (
                            <Button
                                variant="outline"
                                className="h-auto p-4 justify-start"
                                onClick={() => handleUpgrade("pro")}
                            >
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={tierColors.pro}>PRO</Badge>
                                        <span className="text-sm text-muted-foreground">Recommended</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Up to 5 cohorts, 100 learners per cohort
                                    </p>
                                </div>
                            </Button>
                        )}
                        {subscription.tier !== "enterprise" && (
                            <Button
                                variant="outline"
                                className="h-auto p-4 justify-start"
                                onClick={() => handleUpgrade("enterprise")}
                            >
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={tierColors.enterprise}>ENTERPRISE</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Unlimited cohorts, unlimited learners
                                    </p>
                                </div>
                            </Button>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
