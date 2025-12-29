"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Building2, Zap, Crown, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useSubscriptions } from "@/api/subscriptions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const organizationPlans = [
  {
    tier: 'launch' as const,
    name: 'Launch',
    price: { nigeria: "₦30,000", international: "$30" },
    period: "per 3 months",
    description: 'Essential tools for new training programs',
    icon: Building2,
    features: [
      "3 Month Access",
      "Up to 3 Active Cohorts",
      "Up to 150 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile"
    ],
    highlighted: false
  },
  {
    tier: 'growth' as const,
    name: 'Growth',
    price: { nigeria: "₦60,000", international: "$60" },
    period: "per 6 months",
    description: 'Increased capacity for expanding programs',
    icon: Zap,
    features: [
      "6 Month Access",
      "Up to 6 Active Cohorts",
      "Up to 400 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile",
      "Verified Partner Badge"
    ],
    highlighted: true
  },
  {
    tier: 'scale' as const,
    name: 'Scale',
    price: { nigeria: "₦90,000", international: "$90" },
    period: "per year",
    description: 'Maximum capacity for established institutions',
    icon: Crown,
    features: [
      "12 Month Access",
      "Up to 12 Active Cohorts",
      "Up to 1000 Learners per Cohort",
      "Standard Performance Analytics",

      "Organization Profile",
      "Verified Partner Badge",
      "Certificate Issuance"
    ],
    highlighted: false
  }
]

interface OrganizationPricingProps {
  organizationId?: string
}

export function OrganizationPricing({ organizationId: propOrgId }: OrganizationPricingProps) {
  const [isNigeria, setIsNigeria] = useState(true)
  const [selectedTier, setSelectedTier] = useState<'launch' | 'growth' | 'scale'>('growth')
  const [currentTier, setCurrentTier] = useState<'launch' | 'growth' | 'scale' | null>(null)

  const { user, isAuthenticated } = useAuthContext()
  const router = useRouter()

  // Auto-detect currency
  useEffect(() => {
    if (user?.country) {
      // If logged in, use profile country
      const isNG = user.country.toUpperCase() === 'NG' || user.country.toLowerCase() === 'nigeria'
      setIsNigeria(isNG)
    } else {
      // If guest, use browser heuristics (Timezone)
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const isNG = tz === 'Africa/Lagos'
        setIsNigeria(isNG)
      } catch (e) {
        setIsNigeria(false) // Default to International
      }
    }
  }, [user])

  // APIs
  const { subscribeOrganization, upgradeOrganization } = useSubscriptions()
  const { mutate: subscribe, isPending: isSubscribing } = subscribeOrganization
  const { mutate: upgrade, isPending: isUpgrading } = upgradeOrganization(propOrgId || '')

  const handleSubscribe = (tier: 'launch' | 'growth' | 'scale') => {
    // 1. Auth Check
    if (!isAuthenticated) {
      toast.info("Please create an account to subscribe")
      router.push(`/auth/signup?role=partner&plan=${tier}`)
      return
    }

    // 2. Org Check (User must have an organization)
    if (!propOrgId && user?.role === 'partner') {
      router.push('/partner/dashboard')
      return
    } else if (!propOrgId) {
      router.push('/auth/signup?role=partner')
      return
    }

    // 3. Initiate Subscription
    const action = currentTier ? upgrade : subscribe
    const loadingMessage = currentTier ? `Upgrading to ${tier}...` : `Subscribing to ${tier}...`

    toast.loading(loadingMessage, { id: 'sub-loading' })

    // @ts-ignore
    action({ organizationId: propOrgId, tier }, {
      onSuccess: (data) => {
        toast.dismiss('sub-loading')
        // @ts-ignore
        if (data.success && data.paymentUrl) {
          toast.success("Redirecting to payment gateway...")
          // @ts-ignore
          window.location.href = data.paymentUrl
        } else {
          toast.error("Failed to initialize payment")
        }
      },
      onError: (error: any) => {
        toast.dismiss('sub-loading')
        toast.error(error?.response?.data?.message || "Subscription failed")
      }
    })
  }

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Choose Your Organization Plan
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Scale your impact with our organization subscription tiers
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground">Prices shown in:</span>
            <span className="font-medium text-foreground bg-muted px-3 py-1 rounded-full text-sm">
              {isNigeria ? '🇳🇬 Nigerian Naira (₦)' : '🌍 US Dollars ($)'}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {organizationPlans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedTier === plan.tier

            return (
              <Card
                key={plan.tier}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${plan.highlighted
                  ? 'border-2 border-primary shadow-xl scale-105'
                  : 'border-2 hover:border-primary/50'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${plan.highlighted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {plan.description}
                  </CardDescription>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">
                      {isNigeria ? plan.price.nigeria : plan.price.international}
                    </span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>

                  {plan.tier === 'launch' && (
                    <Badge variant="secondary" className="mb-2">
                      <Building2 className="h-3 w-3 mr-1" />
                      Start Small
                    </Badge>
                  )}
                  {plan.tier === 'growth' && (
                    <Badge variant="default" className="mb-2">
                      <Zap className="h-3 w-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  {plan.tier === 'scale' && (
                    <Badge variant="outline" className="mb-2">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <Button
                      className={`w-full ${plan.highlighted
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : ''
                        }`}
                      size="lg"
                      onClick={() => handleSubscribe(plan.tier)}
                      disabled={isSubscribing || isUpgrading}
                    >
                      {isSubscribing || isUpgrading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        propOrgId ? 'Upgrade Plan' : 'Get Started'
                      )}
                    </Button>

                    {/* {plan.tier !== 'launch' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedTier(plan.tier)}
                      >
                        View Details
                      </Button>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Launch</th>
                  <th className="text-center p-4 font-semibold">Growth</th>
                  <th className="text-center p-4 font-semibold">Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Duration</td>
                  <td className="text-center p-4">3 Months</td>
                  <td className="text-center p-4">6 Months</td>
                  <td className="text-center p-4">12 Months</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Max Cohorts</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">6</td>
                  <td className="text-center p-4">12</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Max Learners per Cohort</td>
                  <td className="text-center p-4">150</td>
                  <td className="text-center p-4">400</td>
                  <td className="text-center p-4">1000</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Performance Analytics</td>
                  <td className="text-center p-4">Standard</td>
                  <td className="text-center p-4">Standard</td>
                  <td className="text-center p-4">Standard</td>
                </tr>

                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Verified Partner Badge</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-4 font-medium">Certificate Issuance</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Impact?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join leading organizations using FolaIgnite to discover and nurture tech talent across Africa.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/home/partners">Schedule a Demo</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
