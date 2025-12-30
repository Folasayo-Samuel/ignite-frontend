"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/api/student";
import { useSubscriptions } from "@/api/subscriptions";
import CohortModal from "./CohortModal";
import { CheckoutModal } from "@/components/payment/checkout-modal";
import { CreatePeerCohortModal } from "./CreatePeerCohortModal";
import { Sparkles, CreditCard, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function StudentDashboardHeader() {
  const { getMyCohort } = useStudents();
  const { getMySubscriptions } = useSubscriptions();

  const { data: cohortData, refetch: refetchMyCohort } = getMyCohort();
  const { data: subscriptionsData, isLoading: loadingSubscriptions, refetch: refetchSubscription } = getMySubscriptions();

  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);

  // Check subscription status
  const subscriptions = subscriptionsData?.data || [];
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');
  const hasActiveSubscription = !!activeSubscription;

  // Check cohort status
  const hasValidCohort = cohortData?.cohortId && cohortData?.status !== "none";

  // Determine user state for UI
  const getUserState = () => {
    if (!hasActiveSubscription) return "no_subscription";
    if (hasActiveSubscription && !hasValidCohort) return "subscribed_no_cohort";
    if (hasActiveSubscription && hasValidCohort) return "active_learner";
    return "unknown";
  };

  const userState = getUserState();

  const handleSubscribeClick = () => {
    // Open cohort modal to select cohort, then checkout
    setOpen(true);
  };

  const handleJoinCohortClick = () => {
    // User has subscription, just join a cohort
    setOpen(true);
  };

  // Payment Verification Polling
  const [isVerifying, setIsVerifying] = React.useState(false);

  React.useEffect(() => {
    // Check for Paystack redirect params
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');

    if (reference && !hasActiveSubscription && !isVerifying) {
      setIsVerifying(true);
      toast.loading("Verifying your payment...", { id: "p-verify" });

      // Poll for updates every 2s for 10s
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        const p1 = refetchMyCohort();
        const p2 = refetchSubscription(); // Trigger refetch

        // We can't easily wait for the promise from hook refetch in this structure often, 
        // but calling them triggers a SWR/Query update.
        // Better: Check local state in next render or check data if promise returns it.
        // react-query refetch returns data.

        const [resCohort, resSub] = await Promise.all([p1, p2]);

        const hasSub = resSub.data?.data?.some((s: any) => s.status === 'active');

        if (hasSub) {
          clearInterval(interval);
          setIsVerifying(false);
          toast.dismiss("p-verify");
          toast.success("Payment verified! Welcome to the cohort.");

          // Clear URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else if (attempts >= 5) {
          clearInterval(interval);
          setIsVerifying(false);
          toast.dismiss("p-verify");
          // Don't show error, might just be slow webhook. Let user refresh manually.
          toast.info("Payment received. Your dashboard will update shortly.");
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [refetchMyCohort, refetchSubscription, hasActiveSubscription, isVerifying]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Learner Dashboard</h1>
            {hasActiveSubscription && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hidden sm:flex">
                <CreditCard className="h-3 w-3 mr-1" />
                Subscribed
              </Badge>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Track your progress and manage your learning journey
          </p>
        </div>

        {/* Action Buttons Section - Improved Responsiveness */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Cohort Modal - always rendered but not visible */}
          <CohortModal open={open} onClose={() => setOpen(false)} />

          {/* Case 1: No active subscription - Show Subscribe button */}
          {userState === "no_subscription" && (
            <Button
              className="gap-2 w-full sm:w-auto"
              onClick={handleSubscribeClick}
            >
              <Sparkles className="h-4 w-4" />
              Subscribe Now
            </Button>
          )}

          {/* Case 2: Has subscription but no cohort - Show Join Cohort */}
          {userState === "subscribed_no_cohort" && (
            <Button
              className="gap-2 w-full sm:w-auto"
              onClick={handleJoinCohortClick}
            >
              <Users className="h-4 w-4" />
              Join a Cohort
            </Button>
          )}

          {/* Case 3: Has subscription and cohort - Show Create Peer Cohort AND Browse Option */}
          {userState === "active_learner" && (
            <>
              <Button
                variant="outline"
                className="gap-2 w-full sm:w-auto border-primary/20 hover:bg-primary/5"
                onClick={() => setOpen(true)}
              >
                <Users className="h-4 w-4" />
                Explore Cohorts
              </Button>
              <CreatePeerCohortModal />
            </>
          )}
        </div>
      </div>

      {/* Mobile subscription badge */}
      {hasActiveSubscription && (
        <div className="sm:hidden mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CreditCard className="h-3 w-3 mr-1" />
            Active Subscription
          </Badge>
        </div>
      )}
    </div>
  );
}
