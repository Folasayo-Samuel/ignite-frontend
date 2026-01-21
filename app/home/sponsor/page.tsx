"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, Award, Loader2, TrendingUp, CheckCircle, Share2, Copy, Video } from "lucide-react";
import Image from "next/image";
import { useSponsors } from "@/api/sponsors";
import { createPledge, verifySponsorship, getShowcaseSponsors, SponsorShowcase } from "@/api/sponsorships";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation";

export default function SponsorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Impact Simulator State
  const [contribution, setContribution] = React.useState([50000]); // Default N50k
  const [showPledgeModal, setShowPledgeModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [verifiedReference, setVerifiedReference] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [website, setWebsite] = React.useState("");

  // Showcase State
  const [partners, setPartners] = React.useState<SponsorShowcase[]>([]);

  React.useEffect(() => {
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

  // Handle Pledge Submission
  const handlePledgeSubmit = async () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createPledge({
        fullName: name,
        email,
        organization: org,
        websiteUrl: website,
        amount: contribution[0]
      });

      if (response.authorization_url) {
        toast.info("Redirecting to secure payment gateway...");
        window.location.href = response.authorization_url;
      } else {
        toast.success("Pledge recorded! Check your email for next steps.");
        setShowPledgeModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process pledge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify Payment on Return
  React.useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      if (searchParams.get('verify') === 'true' && reference) {
        try {
          const result = await verifySponsorship(reference);
          if (result.success) {
            // Store reference BEFORE clearing URL so success modal can access it
            setVerifiedReference(reference);
            setShowSuccessModal(true);
            // Clear query params to prevent re-verification
            router.replace('/home/sponsor');
          }
        } catch (error) {
          toast.error("Could not verify payment status.");
        }
      }
    };
    verifyPayment();
  }, [searchParams, router]);


  // Constants
  const COST_PER_LEARNER = 10000; // N10,000 to sponsor a learner fully for the challenge (subsidized)

  // Impact Calculations
  const learnersFunded = Math.floor(contribution[0] / COST_PER_LEARNER);
  const disciplinedGrads = Math.floor(learnersFunded * 0.8); // ~80% completion rate for disciplined talent
  const learningHours = learnersFunded * 40; // 40 hours of intensive upskilling per learner

  // Tier Calculation
  const getTier = (amount: number) => {
    if (amount >= 500000) return { name: "Visionary Sponsor", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Award };
    if (amount >= 100000) return { name: "Champion Sponsor", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: TrendingUp };
    if (amount >= 20000) return { name: "Career Catalyst", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Building2 };
    return { name: "Community Backer", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: Users };
  };

  const currentTier = getTier(contribution[0]);
  const TierIcon = currentTier.icon;

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-gradient-to-b from-primary/5 via-background to-background border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Direct Impact Initiative
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Make an Investment <br /> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Africa's Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Don't just donate. Invest in verifiable human potential.
            Use our simulator to see exactly how your sponsorship translates into skills, resilience, and careers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* The "Impact" Section - Interactive Simulator */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simulate Your Impact</h2>
            <p className="text-muted-foreground">Adjust the slider to commit an investment amount and see what you build.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Input Side */}
            <Card className="border-2 shadow-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4">
                    <label className="font-semibold text-base sm:text-lg">Sponsorship Amount</label>
                    <span className="text-2xl sm:text-3xl font-bold text-primary">₦{contribution[0].toLocaleString()}</span>
                  </div>
                  <Slider
                    defaultValue={[50000]}
                    max={1000000}
                    min={10000}
                    step={5000}
                    value={contribution}
                    onValueChange={setContribution}
                    className="py-4 cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-2 flex justify-between">
                    <span>100% goes to learner resources.</span>
                    <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">Min: ₦10,000</span>
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Unit Cost per Impact</span>
                    <span className="font-semibold">₦10,000 / learner</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transparency Report</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output Side - The "ROI" */}
            <Card className={`border-2 transition-all duration-500 ${currentTier.border} ${currentTier.bg} relative overflow-hidden`}>
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl ${currentTier.bg.replace('/10', '/40')}`} />

              <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col justify-center h-full min-h-[300px] sm:min-h-[350px]">
                <div className="mb-2 uppercase tracking-wider text-xs font-bold opacity-70">
                  Projected ROI
                </div>

                <div className="grid gap-6">
                  <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-1">
                      {learnersFunded} <span className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground">Learners</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Full scholarships provided
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 p-3 bg-background/40 rounded-lg border border-border/50 backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl font-bold">{disciplinedGrads}+</div>
                      <div className="text-xs text-muted-foreground">Disciplined Grads</div>
                    </div>
                    <div className="flex-1 p-3 bg-background/40 rounded-lg border border-border/50 backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl font-bold">{learningHours.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Hours of Learning</div>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm w-fit border ${currentTier.border}`}>
                  <TierIcon className={`h-5 w-5 ${currentTier.color}`} />
                  <span className={`font-bold ${currentTier.color}`}>
                    {currentTier.name} Status
                  </span>
                </div>

                <Button
                  onClick={() => setShowPledgeModal(true)}
                  className={`mt-6 w-full py-6 text-lg rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${contribution[0] >= 500000 ? "bg-purple-600 hover:bg-purple-700" :
                    contribution[0] >= 100000 ? "bg-amber-600 hover:bg-amber-700" :
                      "bg-primary hover:bg-primary/90"
                    }`}
                >
                  Sponsor This Impact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Strategic Value Props - The "Big Hitters" */}
        <div className="py-20 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-3">Why Industry Leaders Invest Here</h3>
              <p className="text-muted-foreground">We've engineered a philanthropy model that delivers ROI, not just warm feelings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background border-none shadow-md hover:shadow-xl transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Radical Transparency</h4>
                  <p className="text-sm text-muted-foreground">
                    Track every Naira. receive a detailed report of exactly which student received your scholarship and their progress.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-md hover:shadow-xl transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-amber-100 text-amber-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Priority Hiring Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Career Catalysts get "First Look" access to hire top graduates before they hit the open market.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-md hover:shadow-xl transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-green-100 text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Zero Admin Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    We cover operations separately. 100% of your sponsorship goes directly to learner hardware and data costs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Corporate Sponsors Showcase */}
        {partners.length > 0 && (
          <div className="py-20 border-t">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Sponsors Showcase</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center max-w-4xl mx-auto">
                {partners.map((partner, idx) => (
                  <a
                    key={idx}
                    href={partner.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                  >
                    {partner.logoUrl ? (
                      <div className="relative h-16 w-full">
                        <Image src={partner.logoUrl} alt={partner.organization} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center border-2 border-dashed rounded-lg group-hover:border-primary/50 group-hover:bg-primary/5">
                        <span className="font-bold text-lg">{partner.organization}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Impact Context - Commented out as requested
        <div className="text-center max-w-2xl mx-auto py-12 border-t">
          <h3 className="font-semibold text-lg mb-2">Why Sponsor?</h3>
          <p className="text-muted-foreground">
            Every ₦10,000 sponsors a dedicated learner for a full cohort, unlocking mentorship, resources, and project reviews.
            We don't take admin fees from sponsorships.
          </p>
        </div>
        */}
      </div>

      <Dialog open={showPledgeModal} onOpenChange={setShowPledgeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Sponsorship</DialogTitle>
            <DialogDescription>
              You are pledging to support the next generation of African tech talent.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <span className="font-semibold">Pledge Amount</span>
              <span className="text-2xl font-bold text-primary">₦{contribution[0].toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-lg bg-blue-50 border-blue-100 text-blue-900 mb-4">
              <div>
                <p className="font-bold text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sponsor as a Business?
                </p>
                <p className="text-xs mt-1">
                  Enter your organization name below. We will list your <b>Business Profile</b> on our Sponsors Showcase.
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org">Organization (Optional)</Label>
              <Input
                id="org"
                placeholder="Company Ltd"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>
            {org && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="website">Website URL (for Sponsors Showcase)</Label>
                <Input
                  id="website"
                  placeholder="https://company.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPledgeModal(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handlePledgeSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Confirm Pledge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center">Sponsorship Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for becoming a <span className="font-semibold text-primary">Career Catalyst</span>.
              Your investment has been recorded and a receipt sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold mb-2">
                <Video className="h-5 w-5" />
                <span>The "Personal Impact" Promise</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We verify every outcome. Within 30 days, you will receive a <b>personalized video message</b> from the specific scholar you funded, thanking you by name.
              </p>
            </div>

            {/* Salesy Social-Share Section */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Inspire Your Network</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" className="gap-2 w-full" onClick={() => {
                  if (verifiedReference) {
                    // Use current domain for the verify link (works locally and in production)
                    const verifyUrl = `${window.location.origin}/verify/${verifiedReference}`;
                    navigator.clipboard.writeText(verifyUrl);
                    toast.success("Verification link copied!");
                  } else {
                    toast.error("No verification reference available");
                  }
                }}>
                  <Copy className="h-4 w-4" /> Copy Verify Link
                </Button>
                <Button className="gap-2 w-full bg-[#0077b5] hover:bg-[#006097] text-white" onClick={() => {
                  if (verifiedReference) {
                    // Use LinkedIn's shareArticle intent with text
                    const verifyUrl = `${window.location.origin}/verify/${verifiedReference}`;
                    const shareText = `I just sponsored African tech talent through FolaIgnite! 🚀 Join me in empowering the next generation of builders. #TechForAfrica #FolaIgnite`;
                    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText + '\n\n' + verifyUrl)}`;
                    window.open(linkedInUrl, '_blank', 'width=600,height=600');
                  } else {
                    toast.error("No verification reference available");
                  }
                }}>
                  <Share2 className="h-4 w-4" /> Share on LinkedIn
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
