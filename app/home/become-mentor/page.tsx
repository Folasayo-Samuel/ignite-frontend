"use client"

import { BecomeMentorForm } from "@/components/become-mentor-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Megaphone,
  DollarSign,
  TrendingUp,
  Shield,
  Globe2,
  Sparkles,
  CheckCircle2,
  Star,
  Trophy,
  Video
} from "lucide-react";

export default function BecomeMentorPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Applications Open — Join 50+ mentors shaping Africa&apos;s tech future
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
            Become a <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Mentor</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Share your expertise, earn on your terms, and get promoted to thousands of learners across Africa. We handle the rest.
          </p>
        </div>

        {/* Why Mentor on FolaIgnite — Value Proposition */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Why Mentor on FolaIgnite?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We don&apos;t just give you a platform — we actively invest in your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Social Media Promotion */}
            <Card className="group relative overflow-hidden border-2 border-orange-200/50 dark:border-orange-900/30 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-bl-lg">
                EXCLUSIVE
              </div>
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">We Promote You</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every cohort you launch gets promoted across our Instagram, Twitter/X, LinkedIn, and TikTok to thousands of tech learners. You teach — we fill your seats.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" /> Dedicated social media posts
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" /> Featured in weekly newsletter
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" /> Homepage spotlight for top mentors
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Earn on Your Terms */}
            <Card className="group border hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">Earn on Your Terms</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set your own price per learner. Run free cohorts to build reputation, or charge premium rates for deep expertise. You keep 100% of your fee.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> You set your own pricing
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Instant payouts
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Transparent fee breakdown
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Flexible & Global */}
            <Card className="group border hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">Flexible & Global</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start with our signature 4-week sprint. As you grow, unlock custom durations up to 12 months. Mentor learners from anywhere in Africa and beyond.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> 2 to 52 week durations
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Teach any tech stack
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Async-friendly curriculum
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tiered Promotion Packages */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Our Mentor Promotion Tiers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The more you mentor, the more we invest in promoting you. Every tier is earned automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Tier */}
            <Card className="relative overflow-hidden border-2 hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Standard</h3>
                    <p className="text-xs text-muted-foreground">All mentors</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Listed on the public cohorts page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Included in our weekly learner newsletter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Personal mentor profile page</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Featured Tier */}
            <Card className="relative overflow-hidden border-2 border-orange-200 dark:border-orange-900/50 hover:shadow-md transition-shadow bg-orange-50/30 dark:bg-orange-950/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                    <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Featured</h3>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">1+ completed cohort</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Everything in Standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Dedicated social media post per cohort launch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Unlock custom cohort durations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Homepage spotlight rotation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-900/50 hover:shadow-md transition-shadow bg-purple-50/30 dark:bg-purple-950/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Premium</h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Top-rated mentors</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Everything in Featured</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Twitter/X thread & Instagram Reel feature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Video testimonial spotlight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Priority placement on platform</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats / Social Proof Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Mentors", value: "50+", icon: TrendingUp },
            { label: "Learners Mentored", value: "500+", icon: Globe2 },
            { label: "Social Reach", value: "10K+", icon: Megaphone },
            { label: "Video Features", value: "Coming Soon", icon: Video },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-muted/40 border hover:bg-muted/60 transition-colors">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Application Form */}
        <div className="max-w-3xl mx-auto">
          <BecomeMentorForm />
        </div>

      </div>
    </main>
  );
}
