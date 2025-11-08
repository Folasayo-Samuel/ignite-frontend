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

export const useStudents = () => {
  const getMyDetails = () =>
    useApiQuery<CurrentUser>(["my_details"], {
      url: `/students/me`,
      method: "GET",
    });

  const getStudentAchievement = (id: string) =>
    useApiQuery<AchievementData>(["my_acheivement"], {
      url: `/students/${id}/achievements`,
      method: "GET",
    });

  const createStudentProfile = useApiMutation<AuthResponse, any>({
    url: "/students/me",
    method: "POST",
  });

  const createCohort = useApiMutation<AuthResponse, FormData>({
    url: "/students/me/enroll",
    method: "POST",
  });

  const getMyCohort = () =>
    useApiQuery<CohortData>(["my_cohort"], {
      url: `/students/me/cohort`,
      method: "GET",
    });

  const getCohortFeed = () =>
    useApiQuery<CohortData>(["my_cohort_feed"], {
      url: `/students/me/cohort-feed`,
      method: "GET",
    });

  const getLeaderBoard = () =>
    useApiQuery<LeaderboardData>(["student_leaderboard"], {
      url: `/students/leaderboard`,
      method: "GET",
    });

  const updateClientProfile = useApiMutation<AuthResponse, FormData>({
    url: `/clients`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    getStudentAchievement,
    createStudentProfile,
    getMyDetails,
    createCohort,
    getMyCohort,
    getLeaderBoard,
    getCohortFeed,
  };
};
