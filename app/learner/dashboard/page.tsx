"use client";
import { useEffect, useState } from "react";
import { StudentDashboardHeader } from "@/components/students/student-dashboard-header";
import { ActiveMentorsCard } from "@/components/students/active-mentors-card";
import { ProgressCard } from "@/components/progress-card";
import { LogActivityCard } from "@/components/students/log-activity-card";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { CohortFeedCard } from "@/components/cohort-feed-card";
import { SubmitProjectCard } from "@/components/submit-project-card";
import { AchievementsCard } from "@/components/students/achievements-card";
import { ResourceLibraryCard } from "@/components/resource-library-card";

import { DiscussionForumCard } from "@/components/discussion-forum-card";
import { AIRecommendationsCard } from "@/components/ai-recommendations-card";
import { StreakCard, XPLevelCard, DailySpinCard, WeeklyChallengeCard } from "@/components/gamification";
import { SubscriptionDashboard } from "@/components/payment/subscription-dashboard";
import { useUser } from "@/api/user";
import { CreateStudentProfileModal } from "@/components/students/CreateStudentProfileModal";
import { CustomButton } from "@/components/clickable/CustomButton";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { useStudents } from "@/api/student";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function StudentDashboardPage() {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <StudentDashboardContent />
    </RoleGuard>
  );
}

function StudentDashboardContent() {
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
    <div>
      <StudentDashboardHeader />

      {data?.hasStudentProfile ? (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          {/* Gamification Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StreakCard />
            <XPLevelCard />
            <DailySpinCard />
            <WeeklyChallengeCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - Main Content (Spans 8 of 12 columns) */}
            <div className="lg:col-span-8 space-y-6">
              <ActiveMentorsCard />
              <ProgressCard />
              <LogActivityCard />
              <AIRecommendationsCard />
              <CohortFeedCard />
              <DiscussionForumCard />
            </div>

            {/* Right Column - Sidebar (Spans 4 of 12 columns) */}
            <aside className="lg:col-span-4 space-y-6">
              <SubmitProjectCard />
              <LeaderboardCard />
              <AchievementsCard />
            </aside>
          </div>

          {/* Bottom Section - Full width */}
          <div className="mt-8 space-y-8">
            <SubscriptionDashboard userType="individual" />
            <ResourceLibraryCard />
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
  );
}
