import { ID } from "@/components/apis/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axiosInstance";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
}

export interface AdminStats {
  individualExpired: number;
  organizationExpired: number;
  total: number;
}

export const useAdmin = () => {
  // User Management
  const getUserNames = (query?: string, limit = 100) =>
    useApiQuery<{ success: boolean; data: AdminUser[] }>(
      ["admin_usernames", query],
      {
        url: `/auth/admin/user-names?q=${query || ""}&limit=${limit}`,
        method: "GET",
      },
    );

  const getUsers = (options?: { search?: string; page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_users", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(
          `/admin-core/users`, { params: { search: options?.search || "", page: options?.page || 1, limit: options?.limit || 20 } }
        );
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const deleteUser = (userId: string) =>
    useApiMutation<{ success: boolean; message: string }, void>({
      url: `/auth/users/${userId}`,
      method: "DELETE",
    });

  const switchUserRole = (userId: string) =>
    useApiMutation<
      { success: boolean; data: any },
      { newRole: "student" | "mentor" | "partner" | "admin" }
    >({
      url: `/auth/admin/users/${userId}/role-switch`,
      method: "POST",
    });

  const suspendUser = (userId: string) =>
    useApiMutation<
      { success: boolean; message: string },
      { suspended: boolean }
    >({
      url: `/auth/users/${userId}/suspend`,
      method: "PATCH",
    });

  // Payment & Subscription Management
  const triggerSubscriptionExpiryCheck = useApiMutation<
    { success: boolean; message: string } & AdminStats,
    void
  >({
    url: "/payment/admin/expire-subscriptions",
    method: "POST",
  });

  const triggerRenewalCheck = useApiMutation<
    {
      success: boolean;
      message: string;
      individualProcessed: number;
      organizationProcessed: number;
    },
    void
  >({
    url: "/payment/admin/trigger-renewals",
    method: "POST",
  });

  const retryFailedPayments = useApiMutation<
    { success: boolean; message: string },
    void
  >({
    url: "/payment/admin/retry-failed-payments",
    method: "POST",
  });

  // Subscription Override Management
  const adminActivateSubscription = (subscriptionId: string) =>
    useApiMutation<
      { success: boolean; message: string; data: any; audit: any },
      { reason: string; durationDays?: number }
    >({
      url: `/individual-subscriptions/admin/${subscriptionId}/activate`,
      method: "POST",
    });

  const adminCancelSubscription = (subscriptionId: string) =>
    useApiMutation<
      { success: boolean; message: string; data: any; audit: any },
      { reason: string; refundRequested?: boolean }
    >({
      url: `/individual-subscriptions/admin/${subscriptionId}/cancel`,
      method: "POST",
    });

  const exportSubscriptionsCsv = (options?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    useApiQuery<{
      success: boolean;
      csv: string;
      count: number;
      exportedAt: string;
    }>(
      [
        "admin_export_csv",
        options?.status,
        options?.startDate,
        options?.endDate,
      ],
      {
        url: `/individual-subscriptions/admin/export/csv?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(options || {}).filter(([_, v]) => v !== undefined),
          ),
        ).toString()}`,
        method: "GET",
      },
      { enabled: false }, // Manually triggered
    );

  // Mentor Management
  const getMentors = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_mentors", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(`/admin-core/mentors`, {
          params: { page: options?.page || 1, limit: options?.limit || 20 }
        });
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getMentor = (id: string) =>
    useApiQuery<{ success: boolean; data: any }>(["admin_mentor", id], {
      url: `/admin/mentors/${id}`,
      method: "GET",
    });

  const updateMentor = useApiMutation<
      { success: boolean; data: any },
      {
        id: string;
        isActive?: boolean;
        name?: string;
        bio?: string;
        expertise?: string[];
        experienceYears?: number;
      }
    >({
      url: "/admin/mentors/:id",
      method: "PATCH",
    });

  const activateMentor = useApiMutation<{ success: boolean; message: string; data: any }, { id: string }>({
    url: "/admin/mentors/:id/activate",
    method: "POST",
  });

  const deactivateMentor = useApiMutation<{ success: boolean; message: string; data: any }, { id: string }>({
    url: "/admin/mentors/:id/deactivate",
    method: "POST",
  });

  const activateAllMentors = useApiMutation<
    { success: boolean; message: string; modifiedCount: number },
    void
  >({
    url: `/admin/mentors/activate-all`,
    method: "POST",
  });

  // Admin Dashboard Hooks
  const getStats = () =>
    useQuery({
      queryKey: ["admin_stats"],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any }>(`/admin-core/stats`);
        return data.data;
      },
    });

  const getProjects = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_projects", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(`/admin-core/projects`, {
          params: { page: options?.page || 1, limit: options?.limit || 20 }
        });
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getResources = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_resources", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(
          `/admin-core/resources`, { params: { page: options?.page || 1, limit: options?.limit || 20 } }
        );
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getEvents = () =>
    useQuery({
      queryKey: ["admin_events"],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[] }>(`/admin-core/events`);
        return data.data;
      },
    });

  const getTestimonials = () =>
    useQuery({
      queryKey: ["admin_testimonials"],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[] }>(`/admin-core/testimonials`);
        return data.data;
      },
    });

  const getIndividualSubscriptions = (options?: { page?: number; limit?: number; status?: string }) =>
    useQuery({
      queryKey: ["admin_individual_subs", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(
          `/admin-core/subscriptions/individual`,
          { params: { page: options?.page || 1, limit: options?.limit || 20, ...(options?.status ? { status: options.status } : {}) } }
        );
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getOrganizationSubscriptions = (options?: { page?: number; limit?: number; status?: string }) =>
    useQuery({
      queryKey: ["admin_organization_subs", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(
          `/admin-core/subscriptions/organization`,
          { params: { page: options?.page || 1, limit: options?.limit || 20, ...(options?.status ? { status: options.status } : {}) } }
        );
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getGrowthPartners = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_growth_partners", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(
          `/admin-core/growth-partners`, { params: { page: options?.page || 1, limit: options?.limit || 20 } }
        );
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const getSponsors = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: ["admin_sponsors", options],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: any[]; total: number; totalPages: number }>(`/admin-core/sponsors`, {
          params: { page: options?.page || 1, limit: options?.limit || 20 }
        });
        return { data: data.data, total: data.total, totalPages: data.totalPages };
      },
      placeholderData: keepPreviousData,
    });

  const approveSponsor = useApiMutation<{ success: boolean; message: string }, { id: string }>({
    url: "/admin-core/sponsors/:id/approve",
    method: "PATCH",
  });

  const rejectSponsor = useApiMutation<{ success: boolean; message: string }, { id: string }>({
    url: "/admin-core/sponsors/:id/reject",
    method: "PATCH",
  });

  return {
    getUserNames,
    getUsers,
    deleteUser,
    switchUserRole,
    suspendUser,
    triggerSubscriptionExpiryCheck,
    triggerRenewalCheck,
    retryFailedPayments,
    // Subscription override functions
    adminActivateSubscription,
    adminCancelSubscription,
    exportSubscriptionsCsv,
    // Mentor management
    getMentors,
    getMentor,
    updateMentor,
    activateMentor,
    deactivateMentor,
    activateAllMentors,
    // Admin Dashboard queries
    getStats,
    getProjects,
    getResources,
    getEvents,
    getTestimonials,
    getGrowthPartners,
    getIndividualSubscriptions,
    getOrganizationSubscriptions,
    getSponsors,
    approveSponsor,
    rejectSponsor,
  };
};
