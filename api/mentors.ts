import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/api/type";

export interface Mentor {
  _id: ID;
  userId: ID;
  name: string;
  email: string;
  expertise: string[];
  bio: string;
  title?: string;
  company?: string;
  yearsOfExperience?: number;
  linkedin?: string;
  avatar?: string;
  isAvailable: boolean;
  studentsCount: number;
  sessionsCompleted: number;
  rating: number;
  ratingsAvg?: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentorDto {
  name: string;
  expertise?: string | string[];
  bio?: string;
  title?: string;
  company?: string;
  yearsOfExperience?: number;
  linkedin?: string;
}

export interface UpdateMentorDto {
  name?: string;
  expertise?: string | string[];
  bio?: string;
  title?: string;
  company?: string;
  yearsOfExperience?: number;
  linkedin?: string;
  isAvailable?: boolean;
  avatar?: string;
}

export interface MentorRating {
  _id: ID;
  mentorId: ID;
  studentId: ID;
  rating: number;
  review?: string;
  sessionId?: ID;
  createdAt: string;
}

export const useMentors = () => {
  // Public mentor listing
  const getMentors = (filters?: {
    expertise?: string;
    available?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.expertise) params.append('expertise', filters.expertise);
    if (filters?.available !== undefined) params.append('availableOnly', filters.available.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    return useApiQuery<{ success: boolean; data: Mentor[]; pagination?: any }>(
      ["mentors", filters],
      {
        url: `/student/mentors${params.toString() ? `?${params.toString()}` : ''}`,
        method: "GET",
      }
    );
  };

  // Get specific mentor
  const getMentor = (id: string) =>
    useApiQuery<{ success: boolean; data: Mentor }>(["mentor", id], {
      url: `/mentors/${id}`,
      method: "GET",
    });

  // Create mentor profile (authenticated)
  const createMentor = useApiMutation<{ success: boolean; data: Mentor }, CreateMentorDto>({
    url: "/mentors",
    method: "POST",
  });

  // Self-profile management
  const getMyProfile = (enabled: boolean = true) =>
    useApiQuery<{ success: boolean; data: Mentor }>(["mentor-profile-me"], {
      url: "/mentor/profile/me",
      method: "GET",
      suppressErrorToast: true,
    }, { enabled, retry: false });

  const createProfile = useApiMutation<{ success: boolean; data: Mentor }, CreateMentorDto>({
    url: "/mentor/profile",
    method: "POST",
  });

  const updateProfile = useApiMutation<{ success: boolean; data: Mentor }, UpdateMentorDto>({
    url: "/mentor/profile",
    method: "PUT",
  });

  // Update public mentor profile (admin or specific update)
  const updateMentor = useApiMutation<{ success: boolean; data: Mentor }, UpdateMentorDto & { id: string }>({
    url: (vars) => `/mentors/${vars.id}`,
    method: "PATCH",
  });

  // Get mentor's students (mentor only)
  const getMentorStudents = (mentorId?: string) =>
    useApiQuery<{ success: boolean; data: any[] }>(
      ["mentor-students", mentorId],
      {
        url: `/mentors/${mentorId || 'me'}/students`,
        method: "GET",
      }
    );

  // Mentor availability management
  const getAvailability = (mentorId?: string) =>
    useApiQuery<{ success: boolean; data: any }>(
      ["mentor-availability", mentorId],
      {
        url: `/mentors/${mentorId || 'me'}/availability`,
        method: "GET",
      }
    );

  const updateAvailability = useApiMutation<
    { success: boolean },
    {
      isAvailable: boolean;
      schedule?: any;
      timezone?: string;
    }
  >({
    url: "/mentors/me/availability",
    method: "PATCH",
  });

  // Mentor ratings and reviews
  const getMentorRatings = (mentorId: string) =>
    useApiQuery<{ success: boolean; data: MentorRating[] }>(["mentor-ratings", mentorId], {
      url: `/mentors/${mentorId}/ratings`,
      method: "GET",
    });

  const rateMentor = useApiMutation<{ success: boolean; data: MentorRating }, {
    rating: number;
    review?: string;
    sessionId?: string;
    mentorId: string;
  }>({
    url: (vars) => `/mentors/${vars.mentorId}/rate`,
    method: "POST",
  });

  // Student-mentor interactions
  const requestMentorship = useApiMutation<
    { success: boolean },
    {
      mentorId: string;
      message: string;
      goals?: string[];
      preferredSchedule?: string;
    }
  >({
    url: "/student/mentors/request",
    method: "POST",
  });

  const getMentorshipRequests = () =>
    useApiQuery<{ success: boolean; data: any[] }>(["mentorship-requests"], {
      url: "/student/mentors/requests",
      method: "GET",
    });

  const respondToRequest = useApiMutation<
    { success: boolean },
    {
      action: 'accept' | 'decline';
      message?: string;
      requestId: string;
    }
  >({
    url: (vars) => `/student/mentors/requests/${vars.requestId}/respond`,
    method: "POST",
  });

  const getActiveMentors = () =>
    useApiQuery<{ success: boolean; data: ActiveMentor[] }>(["active-mentors"], {
      url: "/student/mentors/active",
      method: "GET",
    });

  return {
    getMentors,
    getMentor,
    getMyProfile,
    createProfile,
    updateProfile,
    createMentor,
    updateMentor,
    getMentorStudents,
    getAvailability,
    updateAvailability,
    getMentorRatings,
    rateMentor,
    requestMentorship,
    getMentorshipRequests,
    respondToRequest,
    getActiveMentors,
  };
};

export interface ActiveMentor {
  mentor: Mentor;
  threadId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
