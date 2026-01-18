"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Building2, Globe } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"

const learnerFeatures = [
  "Access to 30-day learning challenges",
  "Daily progress tracking and streaks",
  "Project showcase gallery",
  "Community support and feedback",
  "Achievement badges and certificates",
  "AI-powered learning recommendations",
]

const partnerFeatures = [
  "Access to top learner talent pool",
  "Performance Analytics Dashboard",
  "Brand visibility on showcases",
  "Create & Manage Cohorts",
  "Verified Partner Badge",
  "Track Learner Progress",
]

export function SubscriptionSection() {
  const { currentUser } = useAuthStore()
  const [isNigeria, setIsNigeria] = useState(true)

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setIsNigeria(tz === 'Africa/Lagos')
    } catch (e) {
      setIsNigeria(false)
    }
  }, [])

  return (
    <section id="subscriptions" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Choose Your Path</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're learning or looking for talent, we have the right plan for you
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground">Prices shown in:</span>
            <span className="font-medium text-foreground bg-muted px-3 py-1 rounded-full text-sm">
              {isNigeria ? '🇳🇬 Nigerian Naira (₦)' : '🌍 US Dollars ($)'}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Student Subscription */}
          <Card
            id="learner-signup"
            className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Learner</CardTitle>
              </div>
              <CardDescription className="text-base">Start your learning journey today</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">{isNigeria ? "₦5,000" : "$5"}</span>
                <span className="text-muted-foreground ml-2">per cohort (30 days)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                One-time payment for full access to 30-day challenge
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {learnerFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full" size="lg" asChild>
                <Link
                  href={
                    currentUser?.role === 'student'
                      ? "/learner/dashboard"
                      : (currentUser
                        ? (currentUser.role === 'mentor' ? "/mentor/dashboard" : "/partner/dashboard")
                        : "/auth/signup?role=student")
                  }
                >
                  {currentUser?.role === 'student' ? "Go to Dashboard" : (currentUser ? "Go to Dashboard" : "Join as Learner")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Growth Partner Signup */}
          <Card
            id="partner-signup"
            className="border-2 border-accent hover:border-accent/70 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Growth Partner</CardTitle>
              </div>
              <CardDescription className="text-base">Earn commission by referring learners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">Up to 20%</span>
                <span className="text-muted-foreground ml-2">commission</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">Earn 20% on first month subscriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">10% commission on months 2 &amp; 3</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">Personalized referral link</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">Real-time earnings dashboard</span>
                </li>
              </ul>
              <Button
                className="w-full bg-transparent border-2 border-accent text-accent hover:bg-primary hover:text-white hover:border-primary rounded-full transition-all duration-300"
                size="lg"
                asChild
              >
                <Link href="/home/growth-partner">
                  {currentUser ? "Start Earning Today" : "Become a Growth Partner"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
