"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Building2, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const studentFeatures = [
  "Access to 30-day learning challenges",
  "Daily progress tracking and streaks",
  "Project showcase gallery",
  "Community support and feedback",
  "Achievement badges and certificates",
  "AI-powered learning recommendations",
]

const partnerFeatures = [
  "Access to top student talent pool",
  "Real-time analytics dashboard",
  "Brand visibility on showcases",
  "Create custom learning cohorts",
  "Sponsor recognition badge",
  "Downloadable impact reports",
]

export function SubscriptionSection() {
  const [isNigeria, setIsNigeria] = useState(true)

  return (
    <section id="subscriptions" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Choose Your Path</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're learning or looking for talent, we have the right plan for you
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground">Your location:</span>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setIsNigeria(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isNigeria ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Nigeria
              </button>
              <button
                onClick={() => setIsNigeria(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isNigeria ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Globe className="h-4 w-4 inline mr-1" />
                International
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Student Subscription */}
          <Card
            id="student-signup"
            className="border-2 hover:border-primary/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Student</CardTitle>
              </div>
              <CardDescription className="text-base">Start your learning journey today</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">{isNigeria ? "₦1,000" : "$1"}</span>
                <span className="text-muted-foreground ml-2">per cohort (30 days)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                One-time payment for full access to the 30-day challenge
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {studentFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/student/signup">Join as Student</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Partner Subscription */}
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
                <CardTitle className="text-2xl">Partner</CardTitle>
              </div>
              <CardDescription className="text-base">Connect with emerging tech talent</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">Custom</span>
                <span className="text-muted-foreground ml-2">pricing</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {partnerFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" asChild>
                <Link href="/partners">Become a Partner</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
