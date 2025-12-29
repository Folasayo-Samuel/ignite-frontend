"use client";

import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { SubscriptionSection } from "@/components/subscription-section";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Globe } from "lucide-react";
import { useAnalytics } from "@/api/analytics";

export default function HomePage() {
  const { getImpactStats, getGeographicDistribution } = useAnalytics();
  const { data: stats } = getImpactStats();
  const { data: geoData } = getGeographicDistribution();

  const geographic = geoData;

  return (
    <main>
      <HeroSection />
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={Users}
              value={stats?.activeLearners || 0}
              label="Total Learners"
            />
            <StatsCard
              icon={Target}
              value={stats?.projectsCompleted || 0}
              label="Projects Completed"
            />
            <StatsCard
              icon={Award}
              value={`${stats?.completionRate || 85}%`}
              label="Completion Rate"
            />
            <StatsCard
              icon={Globe}
              value={`${stats?.countriesReached || 12}+`}
              label="Countries"
            />
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <SubscriptionSection />
    </main>
  );
}

function StatsCard({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
