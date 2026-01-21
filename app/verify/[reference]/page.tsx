"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle, Heart, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { verifySponsorship } from "@/api/sponsorships";
import { toast } from "sonner";

interface VerificationResult {
    success: boolean;
    sponsorship?: {
        fullName: string;
        organization?: string;
        amount: number;
        tier: string;
        createdAt: string;
    };
    message?: string;
}

export default function VerifyPage() {
    const params = useParams();
    const reference = params.reference as string;

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verify = async () => {
            if (!reference) {
                setError("No reference provided");
                setLoading(false);
                return;
            }

            try {
                const data = await verifySponsorship(reference);
                setResult(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Could not verify this sponsorship");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [reference]);

    const getTierColor = (tier: string) => {
        switch (tier?.toLowerCase()) {
            case "visionary sponsor":
                return "bg-purple-500/10 text-purple-600 border-purple-200";
            case "champion sponsor":
                return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "career catalyst":
                return "bg-blue-500/10 text-blue-600 border-blue-200";
            default:
                return "bg-green-500/10 text-green-600 border-green-200";
        }
    };

    const handleShare = () => {
        const shareText = `I just sponsored African tech talent through @FolaIgnite! Join me in making a difference. 🚀`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: "FolaIgnite Sponsorship Verified",
                text: shareText,
                url: shareUrl,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            toast.success("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Verifying sponsorship...</p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (error || !result?.success) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="py-12 text-center">
                        <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                            <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                        <p className="text-muted-foreground mb-6">
                            {error || "This sponsorship could not be verified."}
                        </p>
                        <Button asChild>
                            <Link href="/home">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const { sponsorship } = result;
    const formattedDate = sponsorship?.createdAt
        ? new Date(sponsorship.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "";

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
            <Card className="w-full max-w-lg border-2 border-green-200">
                <CardContent className="py-8 sm:py-12">
                    <div className="text-center">
                        <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>

                        <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                            ✓ Verified Sponsorship
                        </Badge>

                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                            {sponsorship?.fullName || "Anonymous Sponsor"}
                        </h1>

                        {sponsorship?.organization && (
                            <p className="text-muted-foreground mb-4">{sponsorship.organization}</p>
                        )}

                        <div className="bg-muted/50 rounded-lg p-4 sm:p-6 my-6 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Contribution</span>
                                <span className="text-xl sm:text-2xl font-bold text-primary">
                                    ₦{sponsorship?.amount?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Sponsor Tier</span>
                                <Badge className={getTierColor(sponsorship?.tier || "")}>
                                    {sponsorship?.tier || "Community Backer"}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">
                            This sponsorship directly funds learning resources for African tech talent through FolaIgnite.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button className="flex-1 gap-2" asChild>
                                <Link href="/home/sponsor">
                                    <Heart className="h-4 w-4" /> Become a Sponsor
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
