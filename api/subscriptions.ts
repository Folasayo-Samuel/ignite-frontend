import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/api/type";

// Individual Subscription Types (matches backend IndividualSubscription schema)
export interface IndividualSubscription {
  _id: ID;
  userId: ID;
  studentId: ID;
  cohortId: ID;
  status: 'pending' | 'active' | 'expired' | 'cancelled' | 'success';
  amount: number; // in kobo (₦5,000 = 500000)
  startDate?: string;
  endDate?: string;
  autoRenew: boolean;
  paymentReference?: string;
  paystackReference?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionType: 'individual';
}

// Organization Subscription Types (matches backend OrganizationSubscription schema)
export interface OrganizationSubscription {
  _id: ID;
  organizationId: ID;
  tier: 'basic' | 'pro' | 'enterprise';
  status: 'pending' | 'active' | 'expired' | 'cancelled' | 'success';
  amount: number;
  maxCohorts: number;
  maxLearnersPerCohort: number;
  currentCohorts: number;
  currentLearners: number;
  startDate?: string;
  endDate?: string;
  autoRenew: boolean;
  paymentReference?: string;
  paystackReference?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionType: 'organization';
}

// Unified subscription type for frontend
export type Subscription = IndividualSubscription | OrganizationSubscription;

// Response Types (matches backend DTOs)
export interface SubscribeToCohortResponse {
  success: boolean;
  subscriptionId: string;
  paymentUrl: string;
  reference: string;
  amount: number;
  status: string;
}

export interface SubscribeOrganizationResponse {
  success: boolean;
  subscriptionId: string;
  paymentUrl: string;
  reference: string;
  amount: number;
  tier: string;
  maxCohorts: number;
  maxLearnersPerCohort: number;
  status: string;
}

export interface ToggleAutoRenewResponse {
  success: boolean;
  message: string;
  autoRenew: boolean;
}

export interface RenewalStatusResponse {
  success: boolean;
  data: {
    autoRenew: boolean;
    nextRenewalDate?: string;
    lastRenewalDate?: string;
    renewalCount: number;
  };
}

// Request DTOs (matches backend)
export interface SubscribeToCohortDto {
  cohortId: string;
  currency?: 'NGN' | 'USD';
  callbackUrl?: string;
}

export interface SubscribeOrganizationDto {
  organizationId: string;
  tier: 'basic' | 'pro' | 'enterprise';
}

export interface ToggleAutoRenewDto {
  autoRenew: boolean;
}

import api from "@/hooks/axiosInstance";

export const getPaymentConfig = async (): Promise<{ currency: 'NGN' | 'USD'; countryCode: string; ip: string }> => {
  const response = await api.get('/payment/config');
  return response.data;
};

export const useSubscriptions = () => {
  // Individual Subscription Endpoints
  const getMySubscriptions = (status?: string, limit = 50, skip = 0) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', String(limit));
    if (skip) params.append('skip', String(skip));
    const queryString = params.toString();
    
    return useApiQuery<{ success: boolean; data: IndividualSubscription[]; count: number }>(
      ["my-subscriptions", status, limit, skip], 
      {
        url: `/individual-subscriptions/my-subscriptions${queryString ? `?${queryString}` : ''}`,
        method: "GET",
      }
    );
  };

  const getSubscriptionDetails = (subscriptionId: string) =>
    useApiQuery<{ success: boolean; data: IndividualSubscription }>(["subscription", subscriptionId], {
      url: `/individual-subscriptions/${subscriptionId}`,
      method: "GET",
    });

  const subscribeToCohort = useApiMutation<SubscribeToCohortResponse, SubscribeToCohortDto>({
    url: "/individual-subscriptions/subscribe",
    method: "POST",
  });

  const toggleAutoRenew = useApiMutation<ToggleAutoRenewResponse, { subscriptionId: string; autoRenew: boolean }>({
    url: (vars) => `/individual-subscriptions/${vars.subscriptionId}/auto-renew`,
    method: "PATCH",
  });

  const getRenewalStatus = (subscriptionId: string) =>
    useApiQuery<RenewalStatusResponse>(["renewal-status", subscriptionId], {
      url: `/individual-subscriptions/${subscriptionId}/renewal-status`,
      method: "GET",
    });

  const cancelSubscription = useApiMutation<{ success: boolean }, { subscriptionId: string; reason?: string }>({
    url: (vars) => `/individual-subscriptions/${vars.subscriptionId}/cancel`,
    method: "POST",
  });

  const getAdminAllSubscriptions = (status?: string, limit = 50, skip = 0) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', String(limit));
    if (skip) params.append('skip', String(skip));
    const queryString = params.toString();

    return useApiQuery<{ success: boolean; data: IndividualSubscription[]; count: number }>(["admin-all-subscriptions", status, limit, skip], {
      url: `/individual-subscriptions/admin/all${queryString ? `?${queryString}` : ''}`,
      method: "GET",
    });
  };

  // Organization Subscription Endpoints
  const getOrganizationSubscription = (organizationId: string) =>
    useApiQuery<{ success: boolean; data: OrganizationSubscription }>(["org-subscription", organizationId], {
      url: `/organization-subscriptions/${organizationId}`,
      method: "GET",
    });

  const subscribeOrganization = useApiMutation<SubscribeOrganizationResponse, SubscribeOrganizationDto>({
    url: "/organization-subscriptions/subscribe",
    method: "POST",
  });

  const upgradeOrganization = (organizationId: string) =>
    useApiMutation<{ success: boolean; data: OrganizationSubscription }, { tier: 'pro' | 'enterprise' }>({
      url: `/organization-subscriptions/${organizationId}/upgrade`,
      method: "POST",
    });

  const downgradeOrganization = (organizationId: string) =>
    useApiMutation<{ success: boolean; data: OrganizationSubscription }, { tier: 'basic' | 'pro' }>({
      url: `/organization-subscriptions/${organizationId}/downgrade`,
      method: "POST",
    });

  const toggleOrgAutoRenew = useApiMutation<ToggleAutoRenewResponse, { organizationId: string; autoRenew: boolean }>({
    url: (vars) => `/organization-subscriptions/${vars.organizationId}/auto-renew`,
    method: "PATCH",
  });

  const getOrgSubscriptionHistory = (organizationId: string, status?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', String(limit));
    const queryString = params.toString();

    return useApiQuery<{ success: boolean; data: OrganizationSubscription[] }>(
      ["org-subscription-history", organizationId, status, limit],
      {
        url: `/organization-subscriptions/${organizationId}/history${queryString ? `?${queryString}` : ''}`,
        method: "GET",
      }
    );
  };

  const getOrgUsage = (organizationId: string) =>
    useApiQuery<{ success: boolean; data: { currentCohorts: number; maxCohorts: number; currentLearners: number; maxLearnersPerCohort: number } }>(
      ["org-usage", organizationId],
      {
        url: `/organization-subscriptions/${organizationId}/usage`,
        method: "GET",
      }
    );

  const canCreateCohort = (organizationId: string) =>
    useApiQuery<{ success: boolean; canCreate: boolean; reason?: string }>(
      ["can-create-cohort", organizationId],
      {
        url: `/organization-subscriptions/${organizationId}/can-create-cohort`,
        method: "GET",
      }
    );

  const getPendingDowngrade = (organizationId: string) =>
    useApiQuery<{ success: boolean; data: { pendingTier: string; effectiveDate: string } | null }>(
      ["pending-downgrade", organizationId],
      {
        url: `/organization-subscriptions/${organizationId}/pending-downgrade`,
        method: "GET",
      }
    );

  const cancelPendingDowngrade = (organizationId: string) =>
    useApiMutation<{ success: boolean; message: string }, void>({
      url: `/organization-subscriptions/${organizationId}/cancel-downgrade`,
      method: "POST",
    });

  // Payment verification (from payment controller)
  const verifyPayment = useApiMutation<{ success: boolean; data: any }, { reference: string }>({
    url: "/payment/verify",
    method: "POST",
  });

  const getTransaction = (reference: string) =>
    useApiQuery<{ success: boolean; data: any }>(["transaction", reference], {
      url: `/payment/transaction/${reference}`,
      method: "GET",
    });

  // Utility function to determine subscription type
  const isIndividualSubscription = (sub: Subscription): sub is IndividualSubscription => {
    return (sub as any).subscriptionType === 'individual' || !(sub as any).organizationId;
  };

  const isOrganizationSubscription = (sub: Subscription): sub is OrganizationSubscription => {
    return (sub as any).subscriptionType === 'organization' || !!(sub as any).organizationId;
  };

  return {
    // Individual
    getMySubscriptions,
    getSubscriptionDetails,
    subscribeToCohort,
    toggleAutoRenew,
    getRenewalStatus,
    cancelSubscription,
    getAdminAllSubscriptions,
    
    // Organization
    getOrganizationSubscription,
    subscribeOrganization,
    upgradeOrganization,
    downgradeOrganization,
    toggleOrgAutoRenew,
    getOrgSubscriptionHistory,
    getOrgUsage,
    canCreateCohort,
    getPendingDowngrade,
    cancelPendingDowngrade,
    
    // Payment
    verifyPayment,
    getTransaction,
    
    // Utilities
    isIndividualSubscription,
    isOrganizationSubscription,
  };
};
