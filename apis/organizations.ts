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

  const updateOrganization = useApiMutation<Organization, Partial<Organization> & { orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}`,
    method: "PATCH",
  });

  const getOrganization = (orgId: string) =>
    useApiQuery<Organization>(["organization", orgId], {
      url: `/organizations/${orgId}`,
      method: "GET",
      // options: { enabled: !!orgId }
    });

  const updatePlan = useApiMutation<Organization, { plan: string; orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/plan`,
    method: "PATCH",
  });

  const updateStatus = useApiMutation<Organization, { isSuspended: boolean; orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/status`,
    method: "PATCH",
  });

  const deleteOrganization = useApiMutation<{ success: boolean }, { orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}`,
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
  const createCohort = useApiMutation<Cohort, Partial<Cohort> & { orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/cohorts`,
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

  const updateCohort = useApiMutation<Cohort, Partial<Cohort> & { orgId: string; cohortId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/cohorts/${vars.cohortId}`,
    method: "PATCH"
  });

  // Member Hooks - Note: Backend uses /users path, not /members
  const getMembers = (orgId: string) =>
    useApiQuery<Member[]>(["org_members", orgId], {
      url: `/organizations/${orgId}/users`,
      method: "GET",
    });

  const addMember = useApiMutation<Member, { email: string; role: string; orgId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/users`,
    method: "POST"
  });

  const removeMember = useApiMutation<{ success: boolean }, { orgId: string; userId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/users/${vars.userId}`,
    method: "DELETE"
  });

  const updateMemberRole = useApiMutation<Member, { role: string; orgId: string; userId: string }>({
    url: (vars) => `/organizations/${vars.orgId}/users/${vars.userId}/role`,
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
