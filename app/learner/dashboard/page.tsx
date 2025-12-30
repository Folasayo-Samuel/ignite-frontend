"use client";
import { useEffect, useState } from "react";
import { StudentDashboardHeader } from "@/components/students/student-dashboard-header";
import { ProgressCard } from "@/components/progress-card";
import { LogActivityCard } from "@/components/students/log-activity-card";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { CohortFeedCard } from "@/components/cohort-feed-card";
import { SubmitProjectCard } from "@/components/submit-project-card";
import { AchievementsCard } from "@/components/students/achievements-card";
import { ResourceLibraryCard } from "@/components/resource-library-card";
import { MentorMatchingCard } from "@/components/mentor-matching-card";
import { DiscussionForumCard } from "@/components/discussion-forum-card";
import { AIRecommendationsCard } from "@/components/ai-recommendations-card";
import { SubscriptionDashboard } from "@/components/payment/subscription-dashboard";
import { useUser } from "@/api/user";
import { CreateStudentProfileModal } from "@/components/students/CreateStudentProfileModal";
import { CustomButton } from "@/components/clickable/CustomButton";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { useStudents } from "@/api/student";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function StudentDashboardPage() {
  const { getCurrentUser } = useUser();
  const { getMyDetails } = useStudents();
  const { data, isPending } = getCurrentUser();
  const { data: my_details, isPending: fecting_details } = getMyDetails();

  const [showModal, setShowModal] = useState(false);
  const [hasClosedModal, setHasClosedModal] = useState(false);

  useEffect(() => {
    if (data && data.role === "student" && !data?.hasStudentProfile) {
      setShowModal(true);
    }
  }, [data]);

  const handleModalClose = () => {
    setShowModal(false);
    setHasClosedModal(true);
  };

  if (isPending || fecting_details) {
    return <LoadingScreen />;
  }

  return (
    <RoleGuard allowedRoles={["student"]}>
      <div>
        <StudentDashboardHeader />

        {data?.hasStudentProfile ? (
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Left Column - Spans 2 columns on large screens */}
              <div className="space-y-6 lg:col-span-2">
                <ProgressCard />
                <LogActivityCard />
                <AIRecommendationsCard />
                <CohortFeedCard />
                <DiscussionForumCard />
              </div>

              {/* Right Column - Spans 1 column */}
              <div className="space-y-6">
                <SubmitProjectCard />
                <LeaderboardCard />
                <AchievementsCard />
              </div>
            </div>

            {/* Bottom Section - Full width */}
            <div className="mt-8 space-y-6">
              <SubscriptionDashboard userType="individual" />
              <ResourceLibraryCard />
              <MentorMatchingCard />
            </div>
          </main>
        ) : hasClosedModal ? (
          <div className="h-[50vh] flex flex-col items-center justify-center py-16">
            <p className="text-gray-600 mb-4">
              You haven't created your learner profile yet.
            </p>
            <CustomButton
              label="Create Learner Profile"
              onClick={() => setShowModal(true)}
            />
          </div>
        ) : null}

        {showModal && (
          <CreateStudentProfileModal
            isOpen={showModal}
            onClose={handleModalClose}
          />
        )}
      </div>
    </RoleGuard>
  );
}
