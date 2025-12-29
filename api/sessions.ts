import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Session {
  _id: string;
  mentorId: string;
  studentId: string;
  scheduledAt: string;
  startAt?: string;
  endAt?: string;
  durationMin: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'approved' | 'declined' | 'expired';
  meetingUrl?: string;
  joinUrl?: string;
  topic?: string;
  mode?: 'video' | 'audio' | 'chat';
}

export interface SessionRequest {
  _id: string;
  studentId: string;
  mentorId: string;
  topic: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  preferredSlots?: { startAt: string; endAt: string }[];
  createdAt: string;
}

export interface ApproveRequestDto {
  slot: { startAt: string; endAt: string };
  mode: 'video' | 'audio' | 'chat';
}

export const useSessions = () => {
  // Student-side session hooks
  const getSessions = () =>
    useApiQuery<Session[]>(["sessions"], {
      url: "/student/sessions",
      method: "GET",
    });

  const bookSession = useApiMutation<{ success: boolean; data: Session }, { mentorId: string; scheduledAt: string; durationMin: number }>({
    url: "/student/sessions/book",
    method: "POST",
  });

  const cancelSession = (sessionId: string) =>
    useApiMutation<{ success: boolean }, { reason?: string }>({
      url: `/student/sessions/${sessionId}/cancel`,
      method: "POST",
    });

  // Mentor-side session hooks
  const getMentorSessions = (range: 'future' | 'past' = 'future', limit = 10) =>
    useApiQuery<Session[]>(
      ["mentor_sessions", range, limit],
      {
        url: `/mentor/sessions?range=${range}&limit=${limit}`,
        method: "GET",
      }
    );

  const getMentorRequests = (status: 'pending' | 'approved' | 'declined' | 'expired' = 'pending', limit = 20) =>
    useApiQuery<SessionRequest[]>(
      ["mentor_requests", status, limit],
      {
        url: `/mentor/requests?status=${status}&limit=${limit}`,
        method: "GET",
      }
    );

  const approveRequest = (requestId: string) =>
    useApiMutation<{ success: boolean; data: Session }, ApproveRequestDto>({
      url: `/mentor/requests/${requestId}/approve`,
      method: "POST",
    });

  const declineRequest = (requestId: string) =>
    useApiMutation<{ success: boolean; data: SessionRequest }, void>({
      url: `/mentor/requests/${requestId}/decline`,
      method: "POST",
    });

  const refreshJoinLink = (sessionId: string) =>
    useApiMutation<{ success: boolean; data: { joinUrl: string } }, void>({
      url: `/mentor/sessions/${sessionId}/join-link`,
      method: "PATCH",
    });

  const completeSession = (sessionId: string) =>
    useApiMutation<{ success: boolean; data: Session }, void>({
      url: `/mentor/sessions/${sessionId}/complete`,
      method: "PATCH",
    });

  return {
    // Student
    getSessions,
    bookSession,
    cancelSession,
    // Mentor
    getMentorSessions,
    getMentorRequests,
    approveRequest,
    declineRequest,
    refreshJoinLink,
    completeSession,
  };
};
