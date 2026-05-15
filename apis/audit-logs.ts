import { useApiQuery } from "@/hooks/useApiQuery";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axiosInstance";
import { ID } from "@/components/apis/type";

export interface AuditLog {
  _id: ID;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  details?: Record<string, any>;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogFilters {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const useAuditLogs = () => {
  const getAuditLogs = (filters?: AuditLogFilters) => {
    const params: Record<string, string> = {};
    if (filters?.entityType) params.entityType = filters.entityType;
    if (filters?.entityId) params.entityId = filters.entityId;
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.action) params.action = filters.action;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return useQuery({
      queryKey: ["audit_logs", filters],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{
          success: boolean;
          data: AuditLog[];
          meta?: { total: number; page: number; limit: number; totalPages: number };
        }>(`/admin-core/audit-logs`, { params });
        return { data: data.data || [], pagination: data.meta };
      },
      placeholderData: keepPreviousData,
    });
  };

  const getAuditLogsByEntity = (
    entityType: string,
    entityId: string,
    limit = 50,
  ) =>
    useQuery({
      queryKey: ["audit_logs_entity", entityType, entityId, limit],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AuditLog[] }>(
          `/audit-logs/entity/${entityType}/${entityId}`,
          { params: { limit } },
        );
        return data.data || [];
      },
    });

  const getAuditLogsByUser = (userId: string, limit = 50) =>
    useQuery({
      queryKey: ["audit_logs_user", userId, limit],
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AuditLog[] }>(
          `/audit-logs/user/${userId}`,
          { params: { limit } },
        );
        return data.data || [];
      },
    });

  return {
    getAuditLogs,
    getAuditLogsByEntity,
    getAuditLogsByUser,
  };
};
