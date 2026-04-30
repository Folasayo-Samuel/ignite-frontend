import { ID } from "@/components/apis/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

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

  const getUsers = () =>
    useApiQuery<{ success: boolean; data: any[] }>(["admin_users"], {
      url: `/auth/users`,
      method: "GET",
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
  const getMentors = () =>
    useApiQuery<{ success: boolean; data: any[] }>(["admin_mentors"], {
      url: `/admin/mentors`,
      method: "GET",
    });

  const getMentor = (id: string) =>
    useApiQuery<{ success: boolean; data: any }>(["admin_mentor", id], {
      url: `/admin/mentors/${id}`,
      method: "GET",
    });

  const updateMentor = (id: string) =>
    useApiMutation<
      { success: boolean; data: any },
      {
        isActive?: boolean;
        name?: string;
        bio?: string;
        expertise?: string[];
        experienceYears?: number;
      }
    >({
      url: `/admin/mentors/${id}`,
      method: "PATCH",
    });

  const activateMentor = (id: string) =>
    useApiMutation<{ success: boolean; message: string; data: any }, void>({
      url: `/admin/mentors/${id}/activate`,
      method: "POST",
    });

  const deactivateMentor = (id: string) =>
    useApiMutation<{ success: boolean; message: string; data: any }, void>({
      url: `/admin/mentors/${id}/deactivate`,
      method: "POST",
    });

  const activateAllMentors = useApiMutation<
    { success: boolean; message: string; modifiedCount: number },
    void
  >({
    url: `/admin/mentors/activate-all`,
    method: "POST",
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
  };
};
