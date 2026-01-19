import { useApiQuery, useApiMutation } from "@/hooks/useApiQuery";
import { AuthResponse } from "@/components/api/type";
import { GrowthPartnerDashboard } from "@/lib/services/growth-partner";

export interface AnalyticsData {
  referralStats: {
    total: number;
    clicked: number;
    signedUp: number;
    subscribed: number;
    churned: number;
    conversionRate: number;
  };
  earningsBreakdown: {
    lifetime: number;
    pending: number;
    withdrawn: number;
    thisMonth: number;
    lastMonth: number;
    byMonth: Array<{ month: string; amount: number }>;
  };
}

export const useGrowthPartner = () => {
  const getDashboard = () =>
    useApiQuery<GrowthPartnerDashboard>(
      ["growth-partner-dashboard"],
      {
        url: "/v1/growth-partner/dashboard",
        method: "GET",
      },
      {
        refetchInterval: 15000, // Poll every 15 seconds for "real-time" updates
        refetchOnWindowFocus: true,
      }
    );

  const getAnalytics = () =>
    useApiQuery<AnalyticsData>(
      ["growth-partner-analytics"],
      {
        url: "/v1/growth-partner/analytics",
        method: "GET",
      },
      {
        refetchInterval: 30000, // Analytics can update slightly slower
      }
    );

  const getReferrals = (params: { page?: number; limit?: number; status?: string; search?: string }) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "" && v !== "all")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return useApiQuery<{ data: any[]; total: number; page: number; limit: number }>(
      ["growth-partner-referrals", params],
      {
        url: `/v1/growth-partner/referrals?${queryString}`,
        method: "GET",
      },
      {
        refetchOnWindowFocus: false, // Don't refetch on window focus for lists to avoid jitter
      }
    );
  };

  const getTransactions = (params: { page?: number; limit?: number; type?: string; status?: string }) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "" && v !== "all")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return useApiQuery<{ data: any[]; total: number; page: number; limit: number }>(
      ["growth-partner-transactions", params],
      {
        url: `/v1/growth-partner/transactions?${queryString}`,
        method: "GET",
      },
      {
        refetchOnWindowFocus: false,
      }
    );
  };

  const getWithdrawals = (params: { page?: number; limit?: number; status?: string }) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "" && v !== "all")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return useApiQuery<{ data: any[]; total: number; page: number; limit: number }>(
      ["growth-partner-withdrawals", params],
      {
        url: `/v1/growth-partner/withdrawals?${queryString}`,
        method: "GET",
      },
      {
        refetchOnWindowFocus: false,
      }
    );
  };

  const requestWithdrawal = useApiMutation<
    { success: boolean; message: string; withdrawal: any },
    { amount: number }
  >({
    url: "/v1/growth-partner/withdraw",
    method: "POST",
  });

  return {
    getDashboard,
    getAnalytics,
    getReferrals,
    getTransactions,
    getWithdrawals,
    requestWithdrawal,
  };
};
