"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Settings,
  Download,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdmin } from "@/api/admin"
import { useSubscriptions } from "@/api/subscriptions"
import { useAnalytics } from "@/api/analytics"

export function AdminPaymentDashboard() {
  const {
    triggerSubscriptionExpiryCheck,
    triggerRenewalCheck,
    retryFailedPayments
  } = useAdmin()

  const { getMySubscriptions } = useSubscriptions()
  const { getMetrics } = useAnalytics()

  // Get analytics metrics for high-level stats
  const { data: metricsData, isLoading: metricsLoading } = getMetrics()

  // Use admin mutation hooks
  const { mutate: runExpiryCheck, isPending: expiring } = triggerSubscriptionExpiryCheck
  const { mutate: runRenewalCheck, isPending: renewing } = triggerRenewalCheck
  const { mutate: runRetryPayments, isPending: retrying } = retryFailedPayments

  const [searchTerm, setSearchTerm] = useState("")

  const handleExpireSubscriptions = () => {
    runExpiryCheck(undefined, {
      onSuccess: (data) => {
        toast.success(`Expiry check completed. Expired: ${data?.individualExpired || 0} individual, ${data?.organizationExpired || 0} organization subscriptions.`)
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to run expiry check")
      }
    })
  }

  const handleTriggerRenewals = () => {
    runRenewalCheck(undefined, {
      onSuccess: (data) => {
        toast.success(`Renewal check completed. Processed: ${data?.individualProcessed || 0} individual, ${data?.organizationProcessed || 0} organization subscriptions.`)
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to run renewal check")
      }
    })
  }

  const handleRetryFailedPayments = () => {
    runRetryPayments(undefined, {
      onSuccess: () => {
        toast.success("Failed payments retry initiated")
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to retry payments")
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'failed':
      case 'expired':
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'active': return CheckCircle
      case 'pending': return Clock
      case 'failed':
      case 'expired':
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  // Derive stats from metrics
  const stats = {
    totalUsers: metricsData?.totalUsers || 0,
    activeUsers: metricsData?.activeUsers || 0,
    newSignups: metricsData?.newSignups || 0,
    retentionRate: metricsData?.retentionRate || 0,
  }

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage payments, subscriptions, and revenue analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Signups</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newSignups.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Recent registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.retentionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              User retention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Administrative Actions
          </CardTitle>
          <CardDescription>
            Manual triggers for subscription management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={handleExpireSubscriptions}
              disabled={expiring}
            >
              {expiring ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Trigger Expiry Check
            </Button>
            <Button
              variant="outline"
              onClick={handleTriggerRenewals}
              disabled={renewing}
            >
              {renewing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Trigger Renewal Check
            </Button>
            <Button
              variant="outline"
              onClick={handleRetryFailedPayments}
              disabled={retrying}
            >
              {retrying ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Retry Failed Payments
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Management
          </CardTitle>
          <CardDescription>
            View and manage individual and organization subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Use the administrative actions above to manage subscription lifecycles.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <a href="/admin/subscriptions/individual">Individual Subscriptions</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/subscriptions/organization">Organization Subscriptions</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
