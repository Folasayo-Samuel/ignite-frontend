import { AuthResponse, ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface CurrentStudentData {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  profilePicture: string;
  location: string;
  city: string;
  phoneNumber: string;
}

export interface CurrentUser {
  access_token?: any;
  name: string;
  role: string;
  location: string;
  phoneNumber: string;
  confirmPassword: string;
  password: string;
  confirm_pass: string;
  createdAt: string;
  id: ID;
  _id: ID;
  artisanId: ID;
  isActive: boolean;
  data: CurrentStudentData;
  referer_bonus_paid: string;
  profilePhoto: {
    url: string;
  };
}

export interface AchievementData {
  totalUnlocked: number;
  totalAvailable: number;
  items: {
    unlocked: boolean;
    icon: string;
    title: string;
    description: string;
    key: string;
    progress: number;
  }[];
}

export interface CohortData {
  cohortId: string;
  cohortStartAt: string;
  cohortEndAt: string;
  status: string;
}

export interface LeaderboardData {
  by: string;
  cohortId: string;
  page: number;
  total: number;
  totalPages: number;
  items: {
    rank: number;
    name: string;
    email: string;
    country: string;
    cohortId: string;
    avatar: string;
    currentStreak: number;
    points: number;
    value: number;
    projects: number;
  }[];
}

export interface CohortFeedData {
  by: string;
  cohortId: string;
  page: number;
  total: number;
  totalPages: number;
  items: {
    rank: number;
    name: string;
    email: string;
    country: string;
    cohortId: string;
    avatar: string;
    currentStreak: number;
    points: number;
    value: number;
    projects: number;
  }[];
}

export interface ProgressData {
  currentStreak: number;
  day: number;
  daysLeft: number;
  isTodayDone: boolean;
  percent: number;
  target: number;
}

export interface StudentActivity {
  _id: ID;
  userId: ID;
  type: 'login' | 'lesson_completed' | 'project_submitted' | 'discussion_post' | 'achievement_unlocked';
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface CreateStudentProfileDto {
  name: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
  city?: string;
  phoneNumber?: string;
  bio?: string;
  interests?: string[];
  goals?: string[];
}

export interface UpdateStudentProfileDto {
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
  city?: string;
  phoneNumber?: string;
  bio?: string;
  interests?: string[];
  goals?: string[];
}

export const useStudents = () => {
  const getMyDetails = () =>
    useApiQuery<CurrentUser>(["my_details"], {
      url: `/students/me`,
      method: "GET",
    });

  const getMyProgress = () =>
    useApiQuery<ProgressData>(["my_progress"], {
      url: `/learning-progress`,
      method: "GET",
    });

  const getStudentAchievement = (id: string) =>
    useApiQuery<AchievementData>(["my_acheivement"], {
      url: `/students/${id}/achievements`,
      method: "GET",
    });

  const getMyCohort = () =>
    useApiQuery<CohortData>(["my_cohort"], {
      url: `/students/me/cohort`,
      method: "GET",
    });

  const getCohortFeed = () =>
    useApiQuery<CohortFeedData>(["my_cohort_feed"], {
      url: `/students/me/cohort-feed`,
      method: "GET",
    });

  const getLeaderBoard = (cohortId?: string, by?: string) => {
    const params = new URLSearchParams();
    if (cohortId) params.append('cohortId', cohortId);
    if (by) params.append('by', by);
    const queryString = params.toString();

    return useApiQuery<LeaderboardData>(["student_leaderboard", cohortId, by], {
      url: `/students/leaderboard${queryString ? `?${queryString}` : ''}`,
      method: "GET",
    });
  };

  const createStudentProfile = useApiMutation<AuthResponse, CreateStudentProfileDto>({
    url: "/students/me",
    method: "POST",
  });

  const updateStudentProfile = useApiMutation<AuthResponse, UpdateStudentProfileDto>({
    url: "/students/me",
    method: "PATCH",
  });

  const enrollInCohort = useApiMutation<AuthResponse, { cohortId: string }>({
    url: "/students/me/enroll",
    method: "POST",
  });

  const withdrawFromCohort = useApiMutation<AuthResponse, { reason?: string }>({
    url: "/students/me/withdraw",
    method: "POST",
  });

  // Activity logging
  const logLearningActivity = useApiMutation<AuthResponse, {
    activityType: string;
    contextId?: string;
    metadata?: any;
  }>({
    url: "/learning-progress/log",
    method: "POST",
  });

  const getMyActivities = (type?: string, limit = 20) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (limit) params.append('limit', String(limit));
    const queryString = params.toString();

    return useApiQuery<StudentActivity[]>(
      ["my_activities", type, limit],
      {
        url: `/students/me/activities${queryString ? `?${queryString}` : ''}`,
        method: "GET",
      }
    );
  };

  // Projects
  const getMyProjects = () =>
    useApiQuery<any[]>(["my_projects"], {
      url: `/students/me/projects`,
      method: "GET",
    });

  const submitProject = useApiMutation<AuthResponse, {
    projectId?: string;
    title: string;
    description: string;
    repositoryUrl?: string;
    liveUrl?: string;
    files?: any[];
  }>({
    url: "/students/me/projects",
    method: "POST",
  });

  const updateProject = (projectId: string) =>
    useApiMutation<AuthResponse, {
      title?: string;
      description?: string;
      repositoryUrl?: string;
      liveUrl?: string;
      status?: string;
    }>({
      url: `/students/me/projects/${projectId}`,
      method: "PATCH",
    });

  // Certificates
  const getMyCertificates = () =>
    useApiQuery<any[]>(["my_certificates"], {
      url: `/students/me/certificates`,
      method: "GET",
    });

  const downloadCertificate = (certificateId: string) =>
    useApiMutation<{ url: string }, void>({
      url: `/students/me/certificates/${certificateId}/download`,
      method: "POST",
    });

  // Analytics and stats
  const getMyStats = (period?: 'week' | 'month' | 'year') => {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    const queryString = params.toString();

    return useApiQuery<any>(["my_stats", period], {
      url: `/students/me/stats${queryString ? `?${queryString}` : ''}`,
      method: "GET",
    });
  };

  const markMyProgress = useApiMutation<AuthResponse, { day: number }>({
    url: "/learning-progress/mark",
    method: "POST",
  });

  const logMyActivities = useApiMutation<AuthResponse, {
    content: string;
    type?: 'reading' | 'course' | 'project' | 'research' | 'design' | 'analysis' | 'planning' | 'testing' | 'presentation' | 'community';
    tags?: string[];
    images?: string[];
    videos?: string[];
  }>({
    url: "/students/me/activities",
    method: "POST",
  });

  return {
    getStudentAchievement,
    getMyDetails,
    getMyCohort,
    getLeaderBoard,
    getCohortFeed,
    getMyProgress,
    getMyProjects,
    getMyActivities,
    getMyCertificates,
    getMyStats,
    createStudentProfile,
    updateStudentProfile,
    enrollInCohort,
    withdrawFromCohort,
    logLearningActivity,
    submitProject,
    updateProject,
    downloadCertificate,
    markMyProgress,
    logMyActivities,
  };
};
