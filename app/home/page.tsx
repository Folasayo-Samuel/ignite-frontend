"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { SubscriptionSection } from "@/components/subscription-section";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Globe } from "lucide-react";
import { useAnalytics } from "@/api/analytics";
import { formatCompactNumber } from "@/lib/utils";
import { getShowcaseSponsors, SponsorShowcase } from "@/api/sponsorships";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { getImpactStats, getGeographicDistribution } = useAnalytics();
  const { data: stats } = getImpactStats();
  const { data: geoData } = getGeographicDistribution();

  const geographic = geoData;

  const [partners, setPartners] = useState<SponsorShowcase[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getShowcaseSponsors();
        setPartners(data);
      } catch (e) {
        console.error("Failed to fetch partners");
      }
    };
    fetchPartners();
  }, []);

  return (
    <main>
      <HeroSection />
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={Users}
              value={formatCompactNumber(stats?.totalLearners ?? 0)}
              label="Total Learners"
            />
            <StatsCard
              icon={Target}
              value={formatCompactNumber(stats?.projectsCompleted ?? 0)}
              label="Projects Completed"
            />
            <StatsCard
              icon={Award}
              value={`${stats?.completionRate ?? 0}%`}
              label="Completion Rate"
            />
            <StatsCard
              icon={Globe}
              value={formatCompactNumber(stats?.countriesReached ?? 0)}
              label="Countries"
            />
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Sponsors Showcase Section */}
      {partners.length > 0 && (
        <section className="py-20 border-y bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold mb-10 text-muted-foreground uppercase tracking-widest">Our Sponsors Showcase</h3>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {partners.map((partner, idx) => (
                <a
                  key={idx}
                  href={partner.websiteUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  {partner.logoUrl ? (
                    <div className="relative h-12 w-32">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.organization}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl font-bold">{partner.organization}</span>
                  )}
                </a>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/home/sponsors-showcase" className="text-sm font-medium text-primary hover:underline">
                View all sponsors →
              </Link>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <Link href="/home/sponsor" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Become a sponsor
              </Link>
            </div>
          </div>
        </section>
      )}

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
