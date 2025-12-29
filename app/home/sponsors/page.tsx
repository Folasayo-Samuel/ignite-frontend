"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, Award, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSponsors } from "@/api/sponsors";
import { Skeleton } from "@/components/ui/skeleton";

export default function SponsorsPage() {
  const { data: sponsors, isLoading } = useSponsors();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-slate-100 text-slate-900 border-slate-300";
      case "Gold":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Silver":
        return "bg-gray-100 text-gray-900 border-gray-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Map country codes to display names
  const getCountryName = (code: string) => {
    const countries: Record<string, string> = {
      NG: "Nigeria",
      GH: "Ghana",
      KE: "Kenya",
      ZA: "South Africa",
      EG: "Egypt",
      RW: "Rwanda",
      TZ: "Tanzania",
      UG: "Uganda",
    };
    return countries[code] || code;
  };

  return (
    <div className=" bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Partners & Sponsors
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the organizations making FolaIgnite possible and empowering the
            next generation of African developers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="h-16 w-40" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sponsors && sponsors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <Card
                key={sponsor.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-16 flex items-center mb-3">
                        {sponsor.logo ? (
                          <Image
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            width={160}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <div className="h-16 w-40 bg-muted rounded flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {sponsor.name}
                      </h3>
                    </div>
                    <Badge
                      className={getTierColor(sponsor.tier)}
                      variant="outline"
                    >
                      {sponsor.tier}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {sponsor.description || "Partner organization"}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {sponsor.students} Students
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {sponsor.cohorts} Cohorts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {getCountryName(sponsor.country)}
                    </div>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Visit
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Partners Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're growing our network of partners. Be one of our first
              sponsors and help shape the future of tech education in Africa.
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Become a Partner
              </h2>
              <p className="text-muted-foreground mb-6">
                Join our growing network of partners and help shape the future
                of tech education in Africa
              </p>
              <a
                href="/home/partners"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Learn More About Partnership
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

