"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  RefreshCw,
  Settings,
  BarChart3
} from "lucide-react"
import { useSubscriptions, IndividualSubscription } from "@/api/subscriptions"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import CohortModal from "@/components/students/CohortModal"

interface SubscriptionDashboardProps {
  userType?: 'individual' | 'organization'
  orgId?: string
}

export function SubscriptionDashboard({ userType = 'individual', orgId }: SubscriptionDashboardProps) {
  const [showCohortModal, setShowCohortModal] = useState(false)
  const {
    getMySubscriptions,
    getOrganizationSubscription,
    isIndividualSubscription,
    isOrganizationSubscription,
    toggleAutoRenew,
    toggleOrgAutoRenew,
    cancelSubscription
  } = useSubscriptions()

  // Individual subscriptions
  const { data: subsResult, isLoading: individualLoading } = getMySubscriptions()
  const subsData = subsResult as any
  const individualSubscriptions = subsData?.data || (Array.isArray(subsData) ? subsData : [])

  // Organization subscription
  const { data: orgSubResult, isLoading: orgLoading } = orgId ? getOrganizationSubscription(orgId) : { data: null }
  const orgSubscription = (orgSubResult as any)?.data

  const isLoading = individualLoading || orgLoading

  // Filter subscriptions by status
  const activeIndividualSubs = individualSubscriptions.filter((sub: IndividualSubscription) => sub.status === 'active' || sub.status === 'success')
  const pendingIndividualSubs = individualSubscriptions.filter((sub: IndividualSubscription) => sub.status === 'pending')

  const activeSubscription = userType === 'individual' ? activeIndividualSubs[0] : (orgSubscription?.status === 'active' || orgSubscription?.status === 'success' ? orgSubscription : null)
  const pendingSubscription = userType === 'individual' ? pendingIndividualSubs[0] : (orgSubscription?.status === 'pending' ? orgSubscription : null)

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    if (isNaN(end.getTime())) return 0;
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const now = new Date()
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  const handleToggleAutoRenew = async (subscription: any) => {
    try {
      const isIndividual = isIndividualSubscription(subscription)
      const mutation = isIndividual ? toggleAutoRenew : toggleOrgAutoRenew;

      const payload: any = { autoRenew: !subscription.autoRenew };
      if (isIndividual) payload.subscriptionId = String(subscription._id);
      else payload.organizationId = String(subscription.organizationId);

      const result = await (mutation as any).mutateAsync(payload)

      if (result.success) {
        toast.success(`Auto-renewal ${!subscription.autoRenew ? 'enabled' : 'disabled'} successfully`)
      }
    } catch (error) {
      toast.error('Failed to update auto-renewal settings')
    }
  }

  const handleCancelSubscription = async (subscription: any) => {
    try {
      const result = await cancelSubscription.mutateAsync({
        subscriptionId: String(subscription._id),
        reason: 'User requested cancellation'
      })
      if (result.success) {
        toast.success('Subscription cancelled successfully')
      }
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  const formatAmount = (amount: number) => {
    // Backend stores amount in kobo, convert to Naira
    const naira = amount / 100
    return `₦${naira.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {userType === 'individual' ? activeIndividualSubs.length : (orgSubscription?.status === 'active' ? 1 : 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {userType === 'individual' ? pendingIndividualSubs.length : (orgSubscription?.status === 'pending' ? 1 : 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {formatAmount(
                userType === 'individual'
                  ? activeIndividualSubs.reduce((sum: number, sub: any) => sum + (sub.amount || 0), 0)
                  : (orgSubscription?.amount || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Renewal</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {userType === 'individual'
                ? activeIndividualSubs.filter((sub: any) => sub.autoRenew).length
                : (orgSubscription?.autoRenew ? 1 : 0)
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Enabled subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscription Details */}
      {activeSubscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Active Subscription
                </CardTitle>
                <CardDescription>
                  Your current subscription details and status
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subscription Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {userType === 'individual' ? 'Cohort ID' : 'Organization ID'}
                </p>
                <p className="font-mono text-sm">
                  {userType === 'individual' ? activeSubscription.cohortId : activeSubscription.organizationId}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Payment Reference</p>
                <p className="font-mono text-sm">
                  {activeSubscription.paystackReference || activeSubscription.paymentReference || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                <p className="font-semibold">{formatAmount(activeSubscription.amount)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Auto-Renewal</p>
                <Badge variant={activeSubscription.autoRenew ? 'default' : 'secondary'}>
                  {activeSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {userType === 'organization' && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Plan Tier</p>
                    <p className="font-semibold capitalize">{(activeSubscription as any).tier}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Usage</p>
                    <p className="font-sm">
                      {(activeSubscription as any).currentCohorts}/{(activeSubscription as any).maxCohorts} cohorts,
                      {(activeSubscription as any).currentLearners}/{(activeSubscription as any).maxLearnersPerCohort} learners per cohort
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Time Progress */}
            {activeSubscription.startDate && activeSubscription.endDate && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subscription Progress</span>
                  <span className="font-medium">
                    {calculateDaysRemaining(activeSubscription.endDate)} days remaining
                  </span>
                </div>
                <Progress
                  value={calculateProgress(activeSubscription.startDate, activeSubscription.endDate)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(activeSubscription.startDate).toLocaleDateString()}</span>
                  <span>{new Date(activeSubscription.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleAutoRenew(activeSubscription)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {activeSubscription.autoRenew ? 'Disable Auto-Renew' : 'Enable Auto-Renew'}
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelSubscription(activeSubscription)}
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Payment Alert */}
      {pendingSubscription && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Pending Payment</CardTitle>
            </div>
            <CardDescription className="text-yellow-700">
              Complete your payment to activate your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reference: {pendingSubscription.paystackReference || pendingSubscription.paymentReference}</p>
                <p className="text-sm text-muted-foreground">
                  Amount: {formatAmount(pendingSubscription.amount)}
                </p>
              </div>
              <Button>
                Complete Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Subscription State */}
      {!activeSubscription && !pendingSubscription && (
        <Card>
          <CardHeader className="text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              {userType === 'individual'
                ? 'Subscribe to a cohort to access premium features and content'
                : 'Subscribe to a plan to access organization features'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setShowCohortModal(true)}>
              {userType === 'individual' ? 'Browse Available Cohorts' : 'Choose a Plan'}
            </Button>
          </CardContent>
        </Card>
      )}

      <CohortModal
        open={showCohortModal}
        onClose={() => setShowCohortModal(false)}
      />
    </div>
  )
}
