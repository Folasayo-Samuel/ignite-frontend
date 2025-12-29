import { useApiQuery } from "@/hooks/useApiQuery";
import { ID } from "@/components/api/type";

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
    const params = new URLSearchParams();
    if (filters?.entityType) params.append('entityType', filters.entityType);
    if (filters?.entityId) params.append('entityId', filters.entityId);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return useApiQuery<{ success: boolean; data: AuditLog[]; pagination?: any }>(
      ["audit_logs", filters],
      {
        url: `/audit-logs${params.toString() ? `?${params.toString()}` : ''}`,
        method: "GET",
      }
    );
  };

  const getAuditLogsByEntity = (entityType: string, entityId: string, limit = 50) =>
    useApiQuery<{ success: boolean; data: AuditLog[] }>(
      ["audit_logs_entity", entityType, entityId, limit],
      {
        url: `/audit-logs/entity/${entityType}/${entityId}?limit=${limit}`,
        method: "GET",
      }
    );

  const getAuditLogsByUser = (userId: string, limit = 50) =>
    useApiQuery<{ success: boolean; data: AuditLog[] }>(
      ["audit_logs_user", userId, limit],
      {
        url: `/audit-logs/user/${userId}?limit=${limit}`,
        method: "GET",
      }
    );

  return {
    getAuditLogs,
    getAuditLogsByEntity,
    getAuditLogsByUser,
  };
};
