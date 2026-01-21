"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Building2,
    Globe,
    Award,
    TrendingUp,
    Users,
    ExternalLink,
    Sparkles,
    Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getShowcaseSponsors, SponsorShowcase } from "@/api/sponsorships";

// Tier configuration with colors and icons
const tierConfig: Record<string, { color: string; bg: string; border: string; icon: any; gradient: string }> = {
    "Visionary Sponsor": {
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: Award,
        gradient: "from-purple-500 to-indigo-600"
    },
    "Champion Sponsor": {
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: TrendingUp,
        gradient: "from-amber-500 to-orange-600"
    },
    "Career Catalyst": {
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: Building2,
        gradient: "from-blue-500 to-cyan-600"
    },
    "Community Backer": {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: Users,
        gradient: "from-green-500 to-emerald-600"
    },
};

function SponsorCard({ sponsor }: { sponsor: SponsorShowcase }) {
    const config = tierConfig[sponsor.tier] || tierConfig["Community Backer"];
    const TierIcon = config.icon;
    const displayName = sponsor.organization || sponsor.fullName;
    const formattedDate = new Date(sponsor.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
    });

    return (
        <Card className={`group relative overflow-hidden border-2 ${config.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            {/* Tier indicator gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />

            <CardContent className="p-4 sm:p-6">
                {/* Logo or Initials */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${config.bg} flex items-center justify-center overflow-hidden border ${config.border}`}>
                        {sponsor.logoUrl ? (
                            <Image
                                src={sponsor.logoUrl}
                                alt={displayName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className={`text-xl sm:text-2xl font-bold ${config.color}`}>
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <Badge className={`${config.bg} ${config.color} ${config.border} text-xs`}>
                        <TierIcon className="w-3 h-3 mr-1" />
                        {sponsor.tier}
                    </Badge>
                </div>

                {/* Name and Organization */}
                <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1 line-clamp-1">
                    {displayName}
                </h3>
                {sponsor.organization && sponsor.fullName && sponsor.organization !== sponsor.fullName && (
                    <p className="text-sm text-muted-foreground mb-3">by {sponsor.fullName}</p>
                )}

                {/* Contribution Amount */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} ${config.border} border mb-4`}>
                    <Heart className={`w-4 h-4 ${config.color}`} />
                    <span className={`font-semibold ${config.color}`}>
                        ₦{sponsor.amount.toLocaleString()}
                    </span>
                </div>

                {/* Footer with date and link */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                        Since {formattedDate}
                    </span>
                    {sponsor.websiteUrl && (
                        <a
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 text-sm font-medium ${config.color} hover:underline`}
                        >
                            Visit <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <Skeleton className="w-32 h-8 rounded-lg mb-4" />
                <div className="flex justify-between pt-4 border-t">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-4" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function SponsorsShowcasePage() {
    const [sponsors, setSponsors] = useState<SponsorShowcase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const data = await getShowcaseSponsors();
                setSponsors(data);
            } catch (err) {
                setError("Failed to load sponsors");
                console.error("Failed to fetch sponsors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSponsors();
    }, []);

    // Group sponsors by tier for display
    const sponsorsByTier = sponsors.reduce((acc, sponsor) => {
        const tier = sponsor.tier;
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(sponsor);
        return acc;
    }, {} as Record<string, SponsorShowcase[]>);

    const tierOrder = ["Visionary Sponsor", "Champion Sponsor", "Career Catalyst", "Community Backer"];

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background border-b">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 text-center relative">
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Our Amazing Partners
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
                        Sponsors <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Showcase</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 px-4">
                        Meet the visionary organizations and individuals powering Africa's next generation of tech talent.
                    </p>
                    <Button size="lg" className="rounded-full" asChild>
                        <Link href="/home/sponsor">
                            <Heart className="w-4 h-4 mr-2" />
                            Become a Sponsor
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Sponsors Grid */}
            <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <LoadingSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">{error}</p>
                    </div>
                ) : sponsors.length === 0 ? (
                    <div className="text-center py-16 sm:py-24">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Be the First Sponsor</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8 px-4">
                            Your organization could be featured here. Join our mission to empower African tech talent.
                        </p>
                        <Button size="lg" className="rounded-full" asChild>
                            <Link href="/home/sponsor">
                                Start Sponsoring Today
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12 sm:space-y-16">
                        {tierOrder.map(tier => {
                            const tierSponsors = sponsorsByTier[tier];
                            if (!tierSponsors || tierSponsors.length === 0) return null;

                            const config = tierConfig[tier];
                            const TierIcon = config.icon;

                            return (
                                <div key={tier}>
                                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                        <div className={`p-2 sm:p-3 rounded-xl ${config.bg} ${config.border} border`}>
                                            <TierIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.color}`} />
                                        </div>
                                        <div>
                                            <h2 className={`text-xl sm:text-2xl font-bold ${config.color}`}>{tier}s</h2>
                                            <p className="text-sm text-muted-foreground">{tierSponsors.length} sponsor{tierSponsors.length > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {tierSponsors.map((sponsor) => (
                                            <SponsorCard key={sponsor._id} sponsor={sponsor} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="border-t bg-gradient-to-b from-muted/30 to-background">
                <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8 px-4">
                        Join our growing community of sponsors and help shape the future of African tech talent.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="rounded-full" asChild>
                            <Link href="/home/sponsor">
                                <Heart className="w-4 h-4 mr-2" />
                                Become a Sponsor
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full" asChild>
                            <Link href="/home/impact">
                                <Globe className="w-4 h-4 mr-2" />
                                See Our Impact
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
