"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Flame, Target, Users, Zap, Globe, Award, TrendingUp, 
  Heart, Sparkles, CheckCircle, ArrowRight, Quote
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAnalytics } from "@/api/analytics";

export default function AboutPage() {
  const { getImpactStats, getTestimonials } = useAnalytics();
  const { data: impactData, isLoading: loadingImpact } = getImpactStats();
  const { data: testimonials, isLoading: loadingTestimonials } = getTestimonials();

  // Extract real metrics (with fallbacks for loading state)
  const stats = {
    learners: impactData?.totalLearners || 0,
    activeLearners: impactData?.activeLearners || 0,
    projects: impactData?.projectsCompleted || 0,
    partners: impactData?.partnerOrganizations || 0,
    countries: impactData?.countriesReached || 0,
    completionRate: impactData?.completionRate || 0,
  };

  return (
    <main>
      {/* Hero Section - Emotional Hook */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-primary/5 via-primary/3 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Transforming Lives Since 2024
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6 text-balance">
              We Don't Just Teach Tech.{" "}
              <span className="text-primary">We Build Futures.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Every day, ambitious Africans are told "you can't." We're proving them wrong, one 
              30-minute challenge at a time. Welcome to the movement that's redefining 
              what's possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Join the Movement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/home/showcase">See Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Impact Stats - Only show stats > 0 */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            // Build array of stats to show (only those > 0)
            const visibleStats = [];
            if (stats.learners > 0) {
              visibleStats.push({
                icon: Users,
                value: `${stats.learners.toLocaleString()}+`,
                label: "Learners Enrolled"
              });
            }
            if (stats.countries > 0) {
              visibleStats.push({
                icon: Globe,
                value: stats.countries.toString(),
                label: "Countries Reached"
              });
            }
            if (stats.projects > 0) {
              visibleStats.push({
                icon: Award,
                value: stats.projects.toLocaleString(),
                label: "Projects Built"
              });
            }
            if (stats.partners > 0) {
              visibleStats.push({
                icon: Heart,
                value: stats.partners.toString(),
                label: "Partner Organizations"
              });
            }
            
            // Determine grid columns based on visible stats
            const gridCols = visibleStats.length === 1 ? "grid-cols-1" 
              : visibleStats.length === 2 ? "grid-cols-2" 
              : visibleStats.length === 3 ? "grid-cols-3" 
              : "grid-cols-2 md:grid-cols-4";

            return (
              <div className={`grid ${gridCols} gap-8 max-w-5xl mx-auto`}>
                {loadingImpact ? (
                  // Show loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-10 w-20 mx-auto mb-2" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                  ))
                ) : (
                  visibleStats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                        <span className="text-4xl font-bold text-foreground">
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* The Problem We Solve - Pain Point */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                The Real Problem Nobody Talks About
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                It's not about access to tutorials. YouTube has millions. It's not about 
                resources. They're everywhere. The real problem is deeper.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">😔</div>
                  <h3 className="font-semibold text-foreground mb-2">
                    "I started, then stopped"
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    94% of self-learners abandon their journey within the first month. 
                    Without structure, motivation dies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">🤷</div>
                  <h3 className="font-semibold text-foreground mb-2">
                    "I don't know where I'm going"
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tutorial hell is real. You watch, you code, you forget. 
                    No roadmap. No progress. No portfolio.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">😞</div>
                  <h3 className="font-semibold text-foreground mb-2">
                    "I'm learning alone"
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No mentor. No peers. No accountability. When challenges hit, 
                    you're on your own, and most people quit.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* The Solution */}
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-primary text-primary-foreground">Our Solution</Badge>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  The 30-Day Transformation System
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We cracked the code on what makes learners succeed. It's not willpower, it's 
                  systems. Here's our proven formula:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                    <Target className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold mb-2">Daily 30-Min Challenges</h4>
                  <p className="text-sm text-muted-foreground">
                    Small enough to never skip. Powerful enough to compound into mastery.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                    <Users className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold mb-2">Cohort-Based Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn with a squad. Compete, collaborate, and hold each other accountable.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                    <Award className="h-7 w-7" />
                  </div>
                  <h4 className="font-semibold mb-2">Real Projects, Real Portfolio</h4>
                  <p className="text-sm text-muted-foreground">
                    Ship projects employers actually want to see. Build proof, not just promises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works - Social Proof */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why FolaIgnite Works When Others Don't
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: "Habit Science, Not Hype",
                  desc: "30 minutes is the sweet spot. Research shows it takes 21 days to form a habit. We give you 30, with structure, not just motivation."
                },
                {
                  icon: TrendingUp,
                  title: "Progress You Can See",
                  desc: "Daily streaks. Weekly milestones. Monthly transformations. Watch your portfolio grow and your confidence soar."
                },
                {
                  icon: Heart,
                  title: "Community That Cares",
                  desc: "Mentors who've been where you are. Peers who push you forward. A support system that celebrates your wins."
                },
                {
                  icon: Globe,
                  title: "Built for Africa, By Africa",
                  desc: "We understand the unique challenges: data costs, power outages, limited opportunities. Our platform is designed for your reality."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-background border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {!loadingTestimonials && testimonials && testimonials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Real Stories. Real Transformations.
                </h2>
                <p className="text-muted-foreground">
                  Don't take our word for it. Hear from learners who took the leap.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {(testimonials as any[]).slice(0, 4).map((t: any, i: number) => (
                  <Card key={t._id || i} className="border-2">
                    <CardContent className="pt-6">
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <p className="text-muted-foreground mb-4 italic">"{t.content}"</p>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={t.image || "/placeholder.svg"} alt={t.name} />
                          <AvatarFallback>
                            {t.name?.split(" ").map((n: string) => n[0]).join("") || "L"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role} • {t.country}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Promise */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Flame className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-6">
              Our Promise to You
            </h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              We're not here to sell you another course you'll never finish. We're here to 
              walk beside you, for 30 days, 30 minutes at a time, until you prove to yourself 
              what you're capable of.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "No fluff, just skills",
                "No isolation, just community",
                "No excuses, just results"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Your Future Self Will Thank You
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              30 days from now, you can be the same, or you can be transformed. 
              The choice is yours. The community is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Your 30-Day Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/home/contact">Have Questions? Let's Talk</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Join {loadingImpact ? "..." : stats.learners.toLocaleString()}+ learners already building their future.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
