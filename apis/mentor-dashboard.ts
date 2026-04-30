import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";

export interface MentorSummary {
  generatedAt: string;
  activeMentees: number;
  hoursThisMonth: number;
  pendingRequests: number;
  successRate: number;
  totalStudents: number;
  completedSessions: number;
  averageRating: number;
}

export interface Mentee {
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  topic: string;
  sessionsCompleted: number;
  progressPercent: number;
  enrollmentDate: string;
  lastActiveAt: string;
  nextSessionDate?: string;
  status: "active" | "inactive" | "completed";
}

export interface UpcomingSession {
  _id: ID;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  scheduledDate: string;
  duration: number;
  type: "mentoring" | "review" | "qna";
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
}

export interface MentorStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  averageSessionDuration: number;
  studentSatisfaction: number;
  responseTime: number;
  monthlyStats: {
    month: string;
    sessions: number;
    earnings: number;
    students: number;
  }[];
}

export const useMentorDashboard = () => {
  const getSummary = () =>
    useApiQuery<MentorSummary>(["mentor_summary"], {
      url: "/mentor/dashboard/summary",
      method: "GET",
    });

  const getUpcoming = (limit: number = 10) =>
    useApiQuery<UpcomingSession[]>(["mentor_upcoming", limit], {
      url: "/mentor/dashboard/upcoming",
      method: "GET",
    });

  const getActiveMentees = (limit: number = 20) =>
    useApiQuery<Mentee[]>(["mentor_mentees", limit], {
      url: "/mentor/dashboard/mentees",
      method: "GET",
    });

  const getStats = (period?: "week" | "month" | "quarter" | "year") =>
    useApiQuery<MentorStats>(["mentor_dashboard_stats", period], {
      url: `/mentor/dashboard/stats${period ? `?period=${period}` : ""}`,
      method: "GET",
    });

  // Session management mutations
  const scheduleSession = useApiMutation<
    { success: boolean; data: UpcomingSession },
    {
      studentId: ID;
      scheduledDate: string;
      duration: number;
      type: "mentoring" | "review" | "qna";
      notes?: string;
    }
  >({
    url: "/mentor/dashboard/schedule-session",
    method: "POST",
  });

  const updateSession = (sessionId: string) =>
    useApiMutation<
      { success: boolean; data: UpcomingSession },
      Partial<UpcomingSession>
    >({
      url: `/mentor/dashboard/sessions/${sessionId}`,
      method: "PATCH",
    });

  const cancelSession = (sessionId: string) =>
    useApiMutation<{ success: boolean }, { reason?: string }>({
      url: `/mentor/dashboard/sessions/${sessionId}/cancel`,
      method: "POST",
    });

  // Mentee management mutations
  const updateMenteeProgress = (studentId: string) =>
    useApiMutation<
      { success: boolean },
      {
        progress: number;
        notes?: string;
        nextSessionDate?: string;
      }
    >({
      url: `/mentor/dashboard/mentees/${studentId}/progress`,
      method: "PATCH",
    });

  const removeMentee = (studentId: string) =>
    useApiMutation<{ success: boolean }, { reason?: string }>({
      url: `/mentor/dashboard/mentees/${studentId}/remove`,
      method: "POST",
    });

  return {
    getSummary,
    getUpcoming,
    getActiveMentees,
    getStats,
    scheduleSession,
    updateSession,
    cancelSession,
    updateMenteeProgress,
    removeMentee,
  };
};
