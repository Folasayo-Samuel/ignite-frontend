"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  RefreshCw,
  Crown,
  Building,
  Star
} from "lucide-react"
import { useOrganizations } from "@/api/organizations"
import { useSubscriptions } from "@/api/subscriptions"
import { useAuthContext } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface OrganizationSubscriptionProps {
  orgId: string;
}

const ORGANIZATION_PLANS = [
  {
    tier: "launch",
    name: "Launch",
    price: { nigeria: 30000, international: 30 },
    currency: { nigeria: "₦", international: "$" },
    duration: "3 months",
    maxCohorts: 3,
    maxLearnersPerCohort: 150,
    features: [
      "3 Month Access",
      "Up to 3 Active Cohorts",
      "Up to 150 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile"
    ],
    icon: Building,
    color: "text-blue-600"
  },
  {
    tier: "growth",
    name: "Growth",
    price: { nigeria: 60000, international: 60 },
    currency: { nigeria: "₦", international: "$" },
    duration: "6 months",
    maxCohorts: 6,
    maxLearnersPerCohort: 400,
    features: [
      "6 Month Access",
      "Up to 6 Active Cohorts",
      "Up to 400 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile",
      "Verified Partner Badge"
    ],
    icon: Star,
    color: "text-purple-600",
    popular: true
  },
  {
    tier: "scale",
    name: "Scale",
    price: { nigeria: 90000, international: 90 },
    currency: { nigeria: "₦", international: "$" },
    duration: "1 year",
    maxCohorts: 12,
    maxLearnersPerCohort: 1000,
    features: [
      "12 Month Access",
      "Up to 12 Active Cohorts",
      "Up to 1000 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile",
      "Verified Partner Badge",
      "Certificate Issuance"
    ],
    icon: Crown,
    color: "text-yellow-600"
  }
]

export function OrganizationSubscriptionManagement({ orgId }: OrganizationSubscriptionProps) {
  const { getOrganization } = useOrganizations()
  const { data: orgResult, isLoading } = getOrganization(orgId)
  const org = (orgResult as any)?.data

  // Auto-detect currency based on user's country
  const { user } = useAuthContext()
  const isNigeria = user?.country?.toUpperCase() === 'NG' || user?.country?.toLowerCase() === 'nigeria'

  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [isUpgrading, setIsUpgrading] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const currentPlan = org?.subscription?.tier || "free"
  const currentSubscription = org?.subscription

  const {
    subscribeOrganization,
    upgradeOrganization,
    downgradeOrganization
  } = useSubscriptions()

  const { mutate: subscribe } = subscribeOrganization
  const { mutate: upgrade } = upgradeOrganization(orgId)
  const { mutate: downgrade } = downgradeOrganization(orgId)

  const handleSubscribe = async (tier: string) => {
    setIsUpgrading(true)
    toast.loading(`Initiating ${tier} plan subscription...`, { id: 'manage-sub' })

    // @ts-ignore
    subscribe({ organizationId: orgId, tier }, {
      onSuccess: (data) => {
        toast.dismiss('manage-sub')
        if (data.success && data.paymentUrl) {
          toast.success("Redirecting to payment...", { duration: 2000 })
          window.location.href = data.paymentUrl
        }
      },
      onError: (error: any) => {
        toast.dismiss('manage-sub')
        toast.error(error?.response?.data?.message || "Subscription failed")
        setIsUpgrading(false)
      }
    })
  }

  const handleUpgrade = async (tier: string) => {
    setIsUpgrading(true)
    toast.loading(`Upgrading to ${tier}...`, { id: 'manage-sub' })

    // @ts-ignore
    upgrade({ organizationId: orgId, tier }, {
      onSuccess: (data) => {
        toast.dismiss('manage-sub')
        if (data.success && data.data?.paymentReference) {
          // Handle immediate upgrade or payment flow if prorated amount needed
          // Currently backend returns paymentUrl if payment needed
          // If backend returns paymentUrl for upgrade (proration):
          if ((data as any).paymentUrl) {
            window.location.href = (data as any).paymentUrl
          } else {
            toast.success("Upgrade successful!")
            setIsUpgrading(false)
          }
        }
      },
      onError: (error: any) => {
        toast.dismiss('manage-sub')
        toast.error(error?.response?.data?.message || "Upgrade failed")
        setIsUpgrading(false)
      }
    })
  }

  const handleDowngrade = async (tier: string) => {
    setIsUpgrading(true)
    toast.loading(`Scheduling downgrade to ${tier}...`, { id: 'manage-sub' })

    // @ts-ignore
    downgrade({ organizationId: orgId, tier }, {
      onSuccess: (data) => {
        toast.dismiss('manage-sub')
        toast.success("Downgrade scheduled for next billing cycle")
        setIsUpgrading(false)
      },
      onError: (error: any) => {
        toast.dismiss('manage-sub')
        toast.error(error?.response?.data?.message || "Downgrade failed")
        setIsUpgrading(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <CardDescription>
              Manage your organization's active subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <Badge variant="secondary" className="text-sm">
                  {currentSubscription.tier?.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge
                  variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}
                >
                  {currentSubscription.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                <p className="text-sm">
                  {currentSubscription.endDate
                    ? new Date(currentSubscription.endDate).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Auto-Renewal</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Toggle auto-renewal */ }}
                >
                  {currentSubscription.renewalEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-4">Usage Overview</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cohorts Created</span>
                  </div>
                  <span className="font-medium">
                    {currentSubscription.cohortsCreated || 0} / {currentSubscription.maxCohorts}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Days Remaining</span>
                  </div>
                  <span className="font-medium">
                    {currentSubscription.endDate
                      ? Math.ceil((new Date(currentSubscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : 0
                    } days
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">
            {currentSubscription ? 'Change Plan' : 'Choose a Plan'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Prices shown in</span>
            <span className="font-medium text-foreground">
              {isNigeria ? '🇳🇬 Nigerian Naira (₦)' : '🌍 US Dollars ($)'}
            </span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {ORGANIZATION_PLANS.map((plan) => {
            const IconComponent = plan.icon
            const isCurrentPlan = currentSubscription?.tier === plan.tier
            const isUpgrade = currentSubscription && ORGANIZATION_PLANS.findIndex(p => p.tier === currentSubscription.tier) < ORGANIZATION_PLANS.findIndex(p => p.tier === plan.tier)
            const displayPrice = isNigeria ? plan.price.nigeria : plan.price.international;
            const displayCurrency = isNigeria ? plan.currency.nigeria : plan.currency.international;

            return (
              <Card
                key={plan.tier}
                className={`relative ${isCurrentPlan ? 'border-primary' : ''} ${plan.popular ? 'border-accent' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${plan.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.duration}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {displayCurrency}{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : !currentSubscription ? (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.tier)}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? 'Processing...' : `Subscribe to ${plan.name}`}
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.tier)}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? 'Processing...' : `Upgrade to ${plan.name}`}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDowngrade(plan.tier)}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? 'Processing...' : `Downgrade to ${plan.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
