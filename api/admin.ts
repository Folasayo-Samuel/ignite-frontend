import { ID } from "@/components/api/type";
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
    useApiQuery<{ success: boolean; data: AdminUser[] }>(["admin_usernames", query], {
      url: `/auth/admin/user-names?q=${query || ''}&limit=${limit}`,
      method: "GET",
    });
  
  const getUsers = () => 
      useApiQuery<{ success: boolean; data: any[] }>(["admin_users"], {
          url: `/auth/users`,
          method: "GET"
      });

  const deleteUser = (userId: string) =>
    useApiMutation<{ success: boolean; message: string }, void>({
      url: `/auth/users/${userId}`,
      method: "DELETE",
    });

  const switchUserRole = (userId: string) =>
    useApiMutation<{ success: boolean; data: any }, { newRole: 'student' | 'mentor' | 'partner' | 'admin' }>({
      url: `/auth/admin/users/${userId}/role-switch`,
      method: "POST",
    });

  const suspendUser = (userId: string) =>
    useApiMutation<{ success: boolean; message: string }, { suspended: boolean }>({
      url: `/auth/users/${userId}/suspend`,
      method: "PATCH",
    });

  // Payment & Subscription Management
  const triggerSubscriptionExpiryCheck = useApiMutation<{ success: boolean; message: string } & AdminStats, void>({
    url: "/payment/admin/expire-subscriptions",
    method: "POST",
  });

  const triggerRenewalCheck = useApiMutation<{ success: boolean; message: string; individualProcessed: number; organizationProcessed: number }, void>({
    url: "/payment/admin/trigger-renewals",
    method: "POST",
  });

  const retryFailedPayments = useApiMutation<{ success: boolean; message: string }, void>({
    url: "/payment/admin/retry-failed-payments",
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
  };
};
