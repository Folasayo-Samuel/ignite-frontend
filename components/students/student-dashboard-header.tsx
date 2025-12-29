"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import CohortModal from "./CohortModal";
import { useStudents } from "@/api/student";
import { CheckoutModal } from "@/components/payment/checkout-modal";
import { toast } from "sonner";

export function StudentDashboardHeader() {
  const { currentUser } = useAuthStore();
  const { getMyCohort } = useStudents();
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data } = getMyCohort();

  // Check if user has a valid cohort for subscription
  const hasValidCohort = data?.cohortId && data?.status !== "none";

  const handleUpgradeClick = () => {
    if (!hasValidCohort) {
      toast.info("Please join a cohort first before upgrading.");
      setOpen(true); // Open cohort modal instead
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Keep up the great work on your learning journey
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasValidCohort && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary text-primary hover:bg-primary/10"
                onClick={handleUpgradeClick}
              >
                Upgrade Access
              </Button>
            )}
            {data?.status === "none" && (
              <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
                Join a Cohort
              </Button>
            )}
          </div>
          <CohortModal open={open} onClose={() => setOpen(false)} />
          {hasValidCohort && data?.cohortId && (
            <CheckoutModal
              isOpen={showCheckout}
              onClose={() => setShowCheckout(false)}
              cohortId={data.cohortId}
              amount={5000}
              planName="Premium Membership"
            />
          )}
        </div>
      </div>
    </div>
  );
}
