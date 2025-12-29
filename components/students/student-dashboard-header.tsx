"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/api/student";
import CohortModal from "./CohortModal";
import { CheckoutModal } from "@/components/payment/checkout-modal";
import { CreatePeerCohortModal } from "./CreatePeerCohortModal";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function StudentDashboardHeader() {
  const { getMyCohort } = useStudents();
  const { data, refetch: refetchMyCohort } = getMyCohort();
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const hasValidCohort = data?.cohortId && data?.status !== "none";

  const handleUpgradeClick = () => {
    // Logic to open checkout or selecting cohort
    setShowCheckout(true);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and manage your learning journey
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CohortModal open={open} onClose={() => setOpen(false)} />

            {hasValidCohort && (
              <CreatePeerCohortModal />
            )}

            {!hasValidCohort && (
              <Button variant="outline" className="gap-2" onClick={() => setShowCheckout(true)}>
                <Sparkles className="h-4 w-4" />
                Upgrade Access
              </Button>
            )}

            {/* Only show 'Join' if strictly none? Or CohortModal covers it?
                  CohortModal is usually triggered by "Join a Cohort" button.
                  I need to trigger it if user wants to join.
                  But I removed the standalone "Join" button in previous edit. 
                  Let's restore "Join a Cohort" button for non-valid users if upgrade button is separate.
              */}
            {!hasValidCohort && (
              <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
                Join a Cohort
              </Button>
            )}
          </div>
        </div>
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
  );
}
