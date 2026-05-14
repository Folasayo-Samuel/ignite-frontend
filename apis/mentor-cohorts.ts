import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Cohort } from "./cohorts";

export interface CreateMentorCohortDto {
  name: string;
  description?: string;
  curriculumOutline?: string;
  startDate: string;
  maxLearners?: number;
  mentorFeeKobo?: number;
  techTrack: string;
  durationWeeks?: number;
}

export interface UpdateMentorCohortDto {
  name?: string;
  description?: string;
  curriculumOutline?: string;
  startDate?: string;
  maxLearners?: number;
  mentorFeeKobo?: number;
  techTrack?: string;
  status?: "draft" | "published" | "active" | "completed" | "canceled";
}

export interface MentorCohortResponse {
  items: Cohort[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useMentorCohorts = () => {
  const getCohorts = (options?: { status?: string; page?: number; limit?: number }) =>
    useApiQuery<MentorCohortResponse>(["mentor-cohorts", options], {
      url: `/mentor/cohorts${options ? `?${new URLSearchParams(options as any).toString()}` : ""}`,
      method: "GET",
    });

  const getCohort = (id: string) =>
    useApiQuery<Cohort & { memberships: any[] }>(["mentor-cohort", id], {
      url: `/mentor/cohorts/${id}`,
      method: "GET",
    });

  const createCohort = useApiMutation<Cohort, CreateMentorCohortDto>({
    url: "/mentor/cohorts",
    method: "POST",
  });

  const updateCohort = (id: string) =>
    useApiMutation<Cohort, UpdateMentorCohortDto>({
      url: `/mentor/cohorts/${id}`,
      method: "PATCH",
    });

  const closeEnrollment = (id: string) =>
    useApiMutation<Cohort, void>({
      url: `/mentor/cohorts/${id}/close-enrollment`,
      method: "PATCH",
    });

  return {
    getCohorts,
    getCohort,
    createCohort,
    updateCohort,
    closeEnrollment,
  };
};
