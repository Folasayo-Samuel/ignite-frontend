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
      const toastId = toast.loading("Verifying your payment... please wait.", { id: "p-verify" });
      const MAX_ATTEMPTS = 5;

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          // Trigger refetch
          const p1 = refetchMyCohort();
          const p2 = refetchSubscription();

          const [resCohort, resSub] = await Promise.all([p1, p2]);

          const hasSub = resSub.data?.data?.some((s: any) => s.status === 'active');

          if (hasSub) {
            clearInterval(interval);
            setIsVerifying(false);
            toast.dismiss(toastId);
            toast.success("Payment verified! Welcome to the cohort.");

            // Clear URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          } else if (attempts >= MAX_ATTEMPTS) {
            clearInterval(interval);
            setIsVerifying(false);
            toast.dismiss(toastId);
            // Show info message instead of loading indefinitely
            toast.info("Payment confirmed. Your dashboard will update in a moment.", { duration: 5000 });

            // Clear URL so we don't restart verification on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (err) {
          console.error("Verification polling error:", err);
          // Even if error, check attempts limit
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(interval);
            setIsVerifying(false);
            toast.dismiss(toastId);
            toast.error("Could not verify instantly. Please refresh the page in a moment.");
          }
        }
      }, 2000);

      // Robust cleanup
      return () => {
        clearInterval(interval);
        toast.dismiss(toastId);
      };
    }
  }, [refetchMyCohort, refetchSubscription, hasActiveSubscription]); // Removed isVerifying to prevent loop reset

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
