// [apis/admin-financials] 2026-05-13 — Isolated API calls for Admin Financials Module
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/hooks/axiosInstance"

export interface RevenueStat {
  month: string;
  enrollments: number;
  grossRevenue: number;
  platformRevenue: number;
  mentorPayouts: number;
  netRevenue: number;
}

export interface WithdrawalRecord {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  requestedAt: string;
  withdrawalMethod?: { type: string };
  growthPartnerId?: {
    userId?: { name: string; email: string };
  };
}

export interface CommissionRecord {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  commissionDetails?: { learnerEmail: string };
  growthPartnerId?: {
    userId?: { name: string; email: string };
  };
}

export interface TransactionRecord {
  _id: string;
  amount: number;
  currency: string;
  reference: string;
  status: string;
  createdAt: string;
  userId?: { name: string; email: string };
  metadata?: { subscriptionType?: string; cohortId?: { name: string } };
}

export const adminFinancialsKeys = {
  all: ["admin-financials"] as const,
  revenue: () => [...adminFinancialsKeys.all, "revenue"] as const,
  withdrawals: (params?: { page?: number; limit?: number }) => [...adminFinancialsKeys.all, "withdrawals", params] as const,
  commissions: (params?: { page?: number; limit?: number }) => [...adminFinancialsKeys.all, "commissions", params] as const,
  transactions: (params?: { page?: number; limit?: number }) => [...adminFinancialsKeys.all, "transactions", params] as const,
}

export function useAdminFinancials() {
  const queryClient = useQueryClient()

  // GET /admin-financials/revenue
  const getRevenueStats = () =>
    useQuery({
      queryKey: adminFinancialsKeys.revenue(),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: RevenueStat[] }>("/admin-financials/revenue")
        return data.data
      },
      staleTime: 5 * 60 * 1000,
    })

  // GET /admin-financials/withdrawals
  const getPendingWithdrawals = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: adminFinancialsKeys.withdrawals(options),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: WithdrawalRecord[]; total: number; totalPages: number }>("/admin-financials/withdrawals", {
          params: { page: options?.page || 1, limit: options?.limit || 20 }
        })
        return { data: data.data, total: data.total, totalPages: data.totalPages }
      },
      placeholderData: (prev) => prev,
    })

  // POST /admin-financials/withdrawals/:id/approve
  const approveWithdrawal = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.post(`/admin-financials/withdrawals/${id}/approve`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFinancialsKeys.withdrawals() })
    },
  })

  // POST /admin-financials/withdrawals/:id/reject
  const rejectWithdrawal = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await axiosInstance.post(`/admin-financials/withdrawals/${id}/reject`, { reason })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFinancialsKeys.withdrawals() })
    },
  })

  // GET /admin-financials/commissions
  const getCommissions = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: adminFinancialsKeys.commissions(options),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: CommissionRecord[]; total: number; totalPages: number }>("/admin-financials/commissions", {
          params: { page: options?.page || 1, limit: options?.limit || 20 }
        })
        return { data: data.data, total: data.total, totalPages: data.totalPages }
      },
      placeholderData: (prev) => prev,
    })

  // POST /admin-financials/commissions/clear-eligible
  const clearEligibleCommissions = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post<{ success: boolean; count: number }>("/admin-financials/commissions/clear-eligible")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFinancialsKeys.commissions() })
    },
  })

  // GET /admin-financials/transactions
  const getAllTransactions = (options?: { page?: number; limit?: number }) =>
    useQuery({
      queryKey: adminFinancialsKeys.transactions(options),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: TransactionRecord[]; total: number; totalPages: number }>("/admin-financials/transactions", {
          params: { page: options?.page || 1, limit: options?.limit || 50 }
        })
        return { data: data.data, total: data.total, totalPages: data.totalPages }
      },
      placeholderData: (prev) => prev,
    })

  const exportCsv = async (type: "revenue" | "transactions") => {
    try {
      const response = await axiosInstance.get(`/admin-financials/export?type=${type}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}-export.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (e) {
      console.error("Export failed:", e)
      alert("Failed to export data. Please check permissions or try again.")
    }
  }

  return {
    getRevenueStats,
    getPendingWithdrawals,
    approveWithdrawal,
    rejectWithdrawal,
    getCommissions,
    clearEligibleCommissions,
    getAllTransactions,
    exportCsv,
  }
}
