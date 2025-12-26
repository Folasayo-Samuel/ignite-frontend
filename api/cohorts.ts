import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/api/type";

export interface Cohort {
  _id: ID;
  organizationId: string;
  name: string;
  description: string;
  techTrack: string;
  programType: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  maxStudents: number;
  enrolledCount: number;
  mentorIds: string[];
  curriculum?: string[];
  requirements?: string[];
  outcomes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCohortDto {
  name: string;
  description: string;
  techTrack: string;
  programType: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  curriculum?: string[];
  requirements?: string[];
  outcomes?: string[];
}

export interface UpdateCohortDto {
  name?: string;
  description?: string;
  techTrack?: string;
  programType?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  status?: 'active' | 'upcoming' | 'completed' | 'archived';
  curriculum?: string[];
  requirements?: string[];
  outcomes?: string[];
}

export interface QueryCohortsDto {
  organizationId?: string;
  status?: string;
  techTrack?: string;
  programType?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CohortListResponse {
  success: boolean;
  data: Cohort[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useCohorts = () => {
  // Organization-scoped cohort management
  const createCohort = (orgId?: string) => 
    useApiMutation<{ success: boolean; data: Cohort }, CreateCohortDto>({
      url: orgId ? `/organizations/${orgId}/cohorts` : '/cohorts',
      method: "POST",
    });

  const getCohorts = (orgId?: string, options?: QueryCohortsDto) =>
    useApiQuery<CohortListResponse>(
      ["cohorts", orgId, options],
      {
        url: orgId 
          ? `/organizations/${orgId}/cohorts${options ? `?${new URLSearchParams(options as any).toString()}` : ''}`
          : `/cohorts${options ? `?${new URLSearchParams(options as any).toString()}` : ''}`,
        method: "GET",
      }
    );

  const getCohort = (id: string) =>
    useApiQuery<{ success: boolean; data: Cohort }>(["cohort", id], {
      url: `/cohorts/${id}`,
      method: "GET",
    });

  const updateCohort = (id: string) =>
    useApiMutation<{ success: boolean; data: Cohort }, UpdateCohortDto>({
      url: `/cohorts/${id}`,
      method: "PATCH",
    });

  const deleteCohort = (id: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/cohorts/${id}`,
      method: "DELETE",
    });

  // Public cohort listing
  const getPublicCohorts = (options?: QueryCohortsDto) =>
    useApiQuery<CohortListResponse>(
      ["public-cohorts", options],
      {
        url: `/cohorts/public${options ? `?${new URLSearchParams(options as any).toString()}` : ''}`,
        method: "GET",
      }
    );

  // Cohort Membership endpoints
  const joinCohort = useApiMutation<{ success: boolean; data: any }, { inviteCode: string }>({
    url: "/cohorts/join",
    method: "POST",
  });

  const getMyCohorts = () =>
    useApiQuery<{ success: boolean; data: Cohort[] }>(["my-cohorts"], {
      url: "/my-cohorts",
      method: "GET",
    });

  const removeLearnerFromCohort = (orgId: string, cohortId: string, learnerId: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/organizations/${orgId}/cohorts/${cohortId}/learners/${learnerId}`,
      method: "DELETE",
    });

  return {
    createCohort,
    getCohorts,
    getCohort,
    updateCohort,
    deleteCohort,
    getPublicCohorts,
    // Membership
    joinCohort,
    getMyCohorts,
    removeLearnerFromCohort,
  };
};
