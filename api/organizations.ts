import { ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Organization {
  _id: ID;
  name: string;
  description: string;
  industry: string;
  size: string;
  plan: string;
  billingEmail: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  isSuspended: boolean;
  createdAt: string;
}

export interface CreateOrgDto {
  name: string;
  type: 'training_program' | 'company';
  country: string; // ISO Code
  description?: string;
  website?: string;
  contactEmail?: string;
  logo?: string;
  planTier?: 'launch' | 'growth' | 'scale';
}

export interface Cohort {
  _id: string;
  organizationId: string;
  name: string;
  programType: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  maxStudents: number;
  enrolledCount: number;
  description?: string;
  techTrack?: string;
  price?: number;
  currency?: string;
}

export interface Member {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  joinedAt: string;
}

export const useOrganizations = () => {
  // Organization Hooks
  const createOrganization = useApiMutation<Organization, CreateOrgDto>({
    url: "/organizations",
    method: "POST",
  });

  const updateOrganization = (orgId: string) =>
    useApiMutation<Organization, Partial<Organization>>({
      url: `/organizations/${orgId}`,
      method: "PATCH",
    });

  const getOrganization = (orgId: string) =>
    useApiQuery<Organization>(["organization", orgId], {
      url: `/organizations/${orgId}`,
      method: "GET",
      // options: { enabled: !!orgId }
    });

  const updatePlan = (orgId: string) =>
     useApiMutation<Organization, { plan: string }>({
      url: `/organizations/${orgId}/plan`,
      method: "PATCH",
     });

  const updateStatus = (orgId: string) =>
     useApiMutation<Organization, { isSuspended: boolean }>({
      url: `/organizations/${orgId}/status`,
      method: "PATCH",
     });

  const deleteOrganization = (orgId: string) =>
     useApiMutation<{ success: boolean }, void>({
      url: `/organizations/${orgId}`,
      method: "DELETE",
     });

  // Admin-only: list all organizations
  const getAllOrganizations = (query?: { status?: string; plan?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.plan) params.append('plan', query.plan);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    
    return useApiQuery<Organization[]>(
      ["all_organizations", query],
      {
        url: `/organizations${params.toString() ? `?${params.toString()}` : ''}`,
        method: "GET",
      }
    );
  };

  // Cohort Hooks
  const createCohort = (orgId: string) =>
      useApiMutation<Cohort, Partial<Cohort>>({
          url: `/organizations/${orgId}/cohorts`,
          method: "POST"
      });

  const getCohorts = (orgId: string) =>
      useApiQuery<Cohort[]>(["org_cohorts", orgId], {
          url: `/organizations/${orgId}/cohorts`,
          method: "GET",
          // options: { enabled: !!orgId }
      });

  const getCohort = (orgId: string, cohortId: string) =>
      useApiQuery<Cohort>(["org_cohort", orgId, cohortId], {
          url: `/organizations/${orgId}/cohorts/${cohortId}`,
          method: "GET",
      });

  const updateCohort = (orgId: string, cohortId: string) =>
      useApiMutation<Cohort, Partial<Cohort>>({
          url: `/organizations/${orgId}/cohorts/${cohortId}`,
          method: "PATCH"
      });

  // Member Hooks - Note: Backend uses /users path, not /members
  const getMembers = (orgId: string) =>
      useApiQuery<Member[]>(["org_members", orgId], {
          url: `/organizations/${orgId}/users`,
          method: "GET",
      });

  const addMember = (orgId: string) =>
      useApiMutation<Member, { email: string; role: string }>({
          url: `/organizations/${orgId}/users`,
          method: "POST"
      });

  const removeMember = (orgId: string, userId: string) =>
      useApiMutation<{ success: boolean }, void>({
          url: `/organizations/${orgId}/users/${userId}`,
          method: "DELETE"
      });

  const updateMemberRole = (orgId: string, userId: string) =>
      useApiMutation<Member, { role: string }>({
          url: `/organizations/${orgId}/users/${userId}/role`,
          method: "PATCH"
      });

  return {
    createOrganization,
    updateOrganization,
    getOrganization,
    updatePlan,
    updateStatus,
    deleteOrganization,
    getAllOrganizations,
    createCohort,
    getCohorts,
    getCohort,
    updateCohort,
    getMembers,
    addMember,
    removeMember,
    updateMemberRole
  };
};
