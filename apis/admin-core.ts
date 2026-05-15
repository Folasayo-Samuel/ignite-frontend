// [apis/admin-core] 2026-05-13 — Isolated API calls for Admin Core Module
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import axiosInstance from "@/hooks/axiosInstance"

export interface AdminUserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  enrolledCohortsCount: number;
}

export interface AdminCohortRecord {
  _id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  startDate: string;
  maxLearners: number;
  enrolledCount: number;
  revenue: number;
}

export interface AdminEnrollmentRecord {
  _id: string;
  paymentStatus: string;
  subscriptionAmount: number;
  subscriptionCurrency: string;
  status: string;
  createdAt: string;
  studentId?: { name: string; email: string };
}

export interface AdminAuditLogRecord {
  _id: string;
  createdAt: string;
  action: string;
  actionType: string;
  resourceType: string;
  description: string;
  userEmail?: string;
  userId?: { name: string; email: string };
}

export interface PlatformSettingsRecord {
  platformFeeKobo: number;
  minWithdrawalKobo: number;
  referralWindowDays: number;
  commissionClearDays: number;
}

export interface AuditLogFilters {
  actionType?: string;
  adminId?: string;
}

export const adminCoreKeys = {
  all: ["admin-core"] as const,
  users: (params?: { search?: string; page?: number; limit?: number }) => [...adminCoreKeys.all, "users", params] as const,
  cohorts: (status?: string) => [...adminCoreKeys.all, "cohorts", { status }] as const,
  cohortEnrollments: (cohortId: string) => [...adminCoreKeys.all, "cohort-enrollments", cohortId] as const,
  auditLogs: (page: number, filters?: Record<string, unknown>) => [...adminCoreKeys.all, "audit-logs", { page, ...filters }] as const,
  settings: () => [...adminCoreKeys.all, "settings"] as const,
}

export function useAdminCore() {
  const queryClient = useQueryClient()

  // --- USERS ---
  const getUsers = (params: { search?: string; page?: number; limit?: number }) =>
    useQuery({
      queryKey: adminCoreKeys.users(params),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ 
          success: boolean; 
          data: AdminUserRecord[];
          total: number;
          totalPages: number;
          page: number;
          limit: number;
        }>(`/admin-core/users`, {
          params,
        })
        return {
          data: data.data,
          total: data.total,
          totalPages: data.totalPages
        }
      },
      placeholderData: keepPreviousData,
    })

  const toggleUserSuspend = useMutation({
    mutationFn: async ({ id, suspended }: { id: string; suspended: boolean }) => {
      const { data } = await axiosInstance.patch(`/admin-core/users/${id}/suspend`, { suspended })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-core", "users"] })
    },
  })

  // --- COHORTS ---
  const getCohorts = (statusFilter?: string) =>
    useQuery({
      queryKey: adminCoreKeys.cohorts(statusFilter),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AdminCohortRecord[] }>(`/admin-core/cohorts`, {
          params: { status: statusFilter },
        })
        return data.data
      },
    })

  const forceCancelCohort = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.post(`/admin-core/cohorts/${id}/cancel`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-core", "cohorts"] })
    },
  })

  const getCohortEnrollments = (cohortId: string) =>
    useQuery({
      queryKey: adminCoreKeys.cohortEnrollments(cohortId),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AdminEnrollmentRecord[] }>(`/admin-core/cohorts/${cohortId}/enrollments`)
        return data.data
      },
      enabled: !!cohortId,
    })

  // --- AUDIT LOGS ---
  const getAuditLogs = (page: number = 1, filters?: AuditLogFilters) =>
    useQuery({
      queryKey: adminCoreKeys.auditLogs(page, filters as Record<string, unknown>),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AdminAuditLogRecord[]; meta: { totalPages: number } }>(`/admin-core/audit-logs`, {
          params: { page, ...filters },
        })
        return { data: data.data, meta: data.meta }
      },
      placeholderData: keepPreviousData,
    })

  // --- SETTINGS ---
  const getSettings = () =>
    useQuery({
      queryKey: adminCoreKeys.settings(),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: PlatformSettingsRecord }>(`/admin-core/settings`)
        return data.data
      },
    })

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<PlatformSettingsRecord>) => {
      const { data } = await axiosInstance.patch(`/admin-core/settings`, updates)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCoreKeys.settings() })
    },
  })

  return {
    getUsers,
    toggleUserSuspend,
    getCohorts,
    forceCancelCohort,
    getCohortEnrollments,
    getAuditLogs,
    getSettings,
    updateSettings,
  }
}
