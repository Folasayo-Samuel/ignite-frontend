"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutModal } from "@/components/payment/checkout-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStudents } from "@/api/student";
import { useCohorts } from "@/api/cohorts";
import { Loader2, Calendar, Users, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CohortModal = ({ open, onClose }: Props) => {
  const { getMyCohort, enrollInCohort } = useStudents();
  const { getPublicCohorts } = useCohorts();
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const { refetch: refetchMyCohort } = getMyCohort();
  const { data: cohortsData, isPending: loadingCohorts } = getPublicCohorts({});

  const { mutate: enroll, isPending: enrolling } = enrollInCohort;

  // Handle both possible response structures: { data: [] } or { items: [] }
  const cohorts = (cohortsData as any)?.data || (cohortsData as any)?.items || [];

  const handleJoinClick = (cohortId: string) => {
    setSelectedCohortId(cohortId);
    setShowCheckout(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join a Cohort</DialogTitle>
          <DialogDescription>
            Browse available cohorts and join one to start your learning journey
          </DialogDescription>
        </DialogHeader>

        {loadingCohorts ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cohorts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active cohorts available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for new cohorts!</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {cohorts.map((cohort: any) => (
              <div
                key={cohort._id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{cohort.name}</h3>
                      <Badge variant={cohort.status === 'active' ? 'default' : 'secondary'}>
                        {cohort.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {cohort.description || `${cohort.techTrack || 'General'} learning cohort`}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {cohort.techTrack && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{cohort.techTrack}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Starts {formatDate(cohort.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{cohort.enrolledCount || 0}/{cohort.maxStudents || 'Unlimited'}</span>
                      </div>

                      {/* Enrollment Countdown for Peer Cohorts */}
                      {cohort.type === 'peer' && (
                        <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Clock className="h-3 w-3" />
                          <span>
                            Closes {(() => {
                              const closeDate = new Date(cohort.startDate);
                              closeDate.setDate(closeDate.getDate() + 30);
                              const daysLeft = Math.ceil((closeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return daysLeft > 0 ? `in ${daysLeft} days` : 'soon';
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleJoinClick(cohort._id)}
                    disabled={enrolling && selectedCohortId === cohort._id}
                  >
                    {enrolling && selectedCohortId === cohort._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Joining...
                      </>
                    ) : (
                      'Subscribe & Join'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedCohortId && (
          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => {
              setShowCheckout(false);
              // If successful payment closes modal, we might want to refresh?
              // But usually Checkout handles redirect or toast.
              // We can refresh myCohort just in case background enrollment worked/is fast.
              refetchMyCohort();
            }}
            cohortId={selectedCohortId}
            amount={5000}
            planName="Cohort Access"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CohortModal;

