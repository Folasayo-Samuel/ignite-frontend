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
import { Loader2, Calendar, Users, BookOpen, Clock, Plus, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CohortModal = ({ open, onClose }: Props) => {
  const { getMyCohort, enrollInCohort } = useStudents();
  const { getPublicCohorts, createPeerCohort } = useCohorts();
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [view, setView] = useState<'browse' | 'create'>('browse');

  const { refetch: refetchMyCohort } = getMyCohort();
  const { data: cohortsData, isPending: loadingCohorts } = getPublicCohorts({});
  const { mutateAsync: createPeer, isPending: creatingPeer } = createPeerCohort;
  const { mutate: enroll, isPending: enrolling } = enrollInCohort;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    techTrack: 'frontend',
    startDate: new Date().toISOString().split('T')[0], // Default today
  });

  // Handle both possible response structures: { data: [] } or { items: [] }
  const cohorts = (cohortsData as any)?.data || (cohortsData as any)?.items || [];

  const handleJoinClick = (cohortId: string) => {
    setSelectedCohortId(cohortId);
    setShowCheckout(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.description || !formData.startDate) {
        toast.error("Please fill all fields");
        return;
      }

      const newCohort = await createPeer({
        ...formData,
        programType: 'peer',
        maxStudents: 15, // Backend limit
        endDate: '', // Backend calculates this
      });

      toast.success("Peer cohort created! Now please complete your subscription.");

      // Immediately trigger subscription flow
      if (newCohort && (newCohort as any)._id) {
        setSelectedCohortId((newCohort as any)._id);
        setShowCheckout(true);
        setView('browse'); // Reset view for next time
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create cohort");
    }
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
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setView('browse'); // Reset on close
      onClose();
    }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{view === 'create' ? 'Start Your Own Cohort' : 'Join a Cohort'}</DialogTitle>
            {view === 'browse' && (
              <Button variant="outline" size="sm" onClick={() => setView('create')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Custom
              </Button>
            )}
            {view === 'create' && (
              <Button variant="ghost" size="sm" onClick={() => setView('browse')} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>
            )}
          </div>
          <DialogDescription>
            {view === 'create'
              ? "Create a peer study group and invite others to learn with you. You'll become the group leader."
              : "Browse available cohorts and join one to start your learning journey"
            }
          </DialogDescription>
        </DialogHeader>

        {view === 'create' ? (
          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Cohort Name</Label>
              <Input
                id="name"
                placeholder="e.g. React Beginners Circle 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track">Tech Track</Label>
              <select
                id="track"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.techTrack}
                onChange={(e) => setFormData({ ...formData, techTrack: e.target.value })}
              >
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Fullstack Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="ux-ui">UI/UX Design</option>
                <option value="product">Product Management</option>
                <option value="data">Data Science/Analytics</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="cloud">Cloud Computing</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="qa">Quality Assurance (QA)</option>
                <option value="no-code">No-Code / Low-Code</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Cohorts run for 30 days from the start date.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Goal / Description</Label>
              <Textarea
                id="description"
                placeholder="What will this group focus on achieving?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="bg-primary/5 p-4 rounded-lg flex gap-3 text-sm text-primary border border-primary/20">
              <Users className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-semibold">Note:</span> Creating a cohort costs the same as joining one (₦5,000). You will be prompted to pay immediately after creation.
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={creatingPeer}>
              {creatingPeer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create & Subscribe (₦5,000)'
              )}
            </Button>
          </form>
        ) : (
          /* Browse View */
          loadingCohorts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cohorts.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground">No active cohorts available at the moment.</p>
                <Button variant="link" onClick={() => setView('create')} className="mt-2 text-primary">
                  But you can start your own!
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {/* Call to action card for creation */}
              <div className="border border-dashed border-primary/30 bg-primary/5 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary">Can't find what you need?</h3>
                  <p className="text-sm text-muted-foreground">Start your own study group and invite peers.</p>
                </div>
                <Button size="sm" onClick={() => setView('create')}>Start Custom</Button>
              </div>

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
                        {cohort.status !== 'active' && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Starts {formatDate(cohort.startDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {cohort.enrolledCount || 0}/
                            {cohort.maxLearners || cohort.maxStudents || (cohort.type === 'peer' ? 15 : 150)}
                          </span>
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
          )
        )}
        {selectedCohortId && (
          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => {
              setShowCheckout(false);
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
