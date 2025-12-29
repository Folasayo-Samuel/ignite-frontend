"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import CohortModal from "./CohortModal";
import { useStudents } from "@/api/student";
import { CheckoutModal } from "@/components/payment/checkout-modal";

export function StudentDashboardHeader() {
  const { currentUser } = useAuthStore();
  const { getMyCohort } = useStudents();
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data } = getMyCohort();

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
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary text-primary hover:bg-primary/10"
              onClick={() => setShowCheckout(true)}
            >
              Upgrade Access
            </Button>
            {data?.status === "none" && (
              <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
                Join a Cohort
              </Button>
            )}
            {/* <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button> */}
            {/* <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amara" />
              <AvatarFallback>AO</AvatarFallback>
            </Avatar> */}
          </div>
          <CohortModal open={open} onClose={() => setOpen(false)} />
          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            cohortId="premium-access-plan" // Mock ID for generic upgrade
            amount={5000}
            planName="Premium Membership"
          />
        </div>
      </div>
    </div>
  );
}
