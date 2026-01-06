import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Session {
  _id: string;
  mentorId: string;
  studentId: string | { _id: string; name: string; avatar?: string };
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
  studentId: string | { _id: string; name: string; avatar?: string };
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

  const cancelSession = useApiMutation<{ success: boolean }, { sessionId: string; reason?: string }>({
    url: (vars) => `/student/sessions/${vars.sessionId}/cancel`,
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

  const approveRequest = useApiMutation<{ success: boolean; data: Session }, ApproveRequestDto & { requestId: string }>({
    url: (vars) => `/mentor/requests/${vars.requestId}/approve`,
    method: "POST",
  });

  const declineRequest = useApiMutation<{ success: boolean; data: SessionRequest }, { requestId: string }>({
    url: (vars) => `/mentor/requests/${vars.requestId}/decline`,
    method: "POST",
  });

  const refreshJoinLink = useApiMutation<{ success: boolean; data: { joinUrl: string } }, { sessionId: string }>({
    url: (vars) => `/mentor/sessions/${vars.sessionId}/join-link`,
    method: "PATCH",
  });

  const completeSession = useApiMutation<{ success: boolean; data: Session }, { sessionId: string }>({
    url: (vars) => `/mentor/sessions/${vars.sessionId}/complete`,
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
