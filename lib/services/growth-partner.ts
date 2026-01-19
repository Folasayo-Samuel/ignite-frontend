/**
 * Growth Partner API Service
 * 
 * API client for all growth partner related operations including:
 * - Registration and profile management
 * - Dashboard and analytics
 * - Referral tracking
 * - Financial operations
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper to get auth token from the auth store (sessionStorage)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from sessionStorage (where Zustand auth store persists)
  try {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      // The token is typically stored on the user object or separately
      // Check common locations
      if (parsed.state?.currentUser?.accessToken) {
        return parsed.state.currentUser.accessToken;
      }
    }
  } catch (e) {
    console.warn('[GP Service] Failed to parse auth storage:', e);
  }
  
  // Fallback: Try localStorage as some apps use that
  const localToken = localStorage.getItem('accessToken');
  if (localToken) return localToken;
  
  // Fallback: Try reading from cookie
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken' && value) {
        return value;
      }
    }
  } catch (e) {
    // Ignore cookie parsing errors
  }
  
  return null;
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include", // Essential for cookie-based auth
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== Registration & Profile ====================

export async function checkEligibility() {
  return apiCall<{ eligible: boolean; reason?: string; isAlreadyPartner?: boolean }>(
    '/v1/growth-partner/verify-eligibility'
  );
}

export async function registerAsGrowthPartner(
  acceptTerms: boolean,
  country: string = 'NG',
  preferredCurrency: 'NGN' | 'USD' = 'NGN'
) {
  return apiCall<{
    success: boolean;
    message: string;
    partner: {
      partnerId: string;
      referralCode: string;
      referralLink: string;
      status: string;
      tier: string;
    };
  }>('/v1/growth-partner/register', {
    method: 'POST',
    body: JSON.stringify({ 
      acceptTerms,
      country,
      preferredCurrency
    }),
  });
}

export async function updateBankDetails(data: {
  accountNumber: string;
  bankCode: string;
  bankName?: string;
}) {
  return apiCall<{
    success: boolean;
    message: string;
    maskedAccountNumber: string;
  }>('/v1/growth-partner/bank-details', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== Dashboard & Analytics ====================

export interface GrowthPartnerDashboard {
  partner: {
    partnerId: string;
    referralCode: string;
    status: string;
    partnershipTier: string;
    metrics: {
      totalReferrals: number;
      activeSubscribers: number;
      lifetimeEarnings: number;
      pendingEarnings: number;
      withdrawnEarnings: number;
    };
    bankDetails: {
      NGN?: {
        accountNumber: string;
        accountName: string;
        bankCode?: string;
        bankName: string;
        isVerified: boolean;
      };
      USD?: {
        method: string;
        email?: string;
        accountHolderName?: string;
        isVerified: boolean;
      };
    } | null;
  };
  referralLink: string;
  recentActivity: Array<{
    type: string;
    referredUser: { name: string; email: string } | null;
    source: string;
    commission: number;
    createdAt: string;
  }>;
  earningsThisMonth: number;
  referralsThisMonth: number;
}

export async function getDashboard() {
  return apiCall<GrowthPartnerDashboard>('/v1/growth-partner/dashboard');
}

export async function getAnalytics() {
  return apiCall<{
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
  }>('/v1/growth-partner/analytics');
}

// ==================== Referral Management ====================

export async function getReferralLink() {
  return apiCall<{
    referralCode: string;
    referralLink: string;
    shareText: {
      whatsapp: string;
      twitter: string;
      linkedin: string;
      email: {
        subject: string;
        body: string;
      };
    };
  }>('/v1/growth-partner/referral-link');
}

export async function regenerateReferralCode(reason?: string) {
  return apiCall<{
    success: boolean;
    message: string;
    referralCode: string;
    referralLink: string;
  }>('/v1/growth-partner/regenerate-code', {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function getReferrals(params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : '';
  
  return apiCall<{
    data: Array<{
      referralId: string;
      referredUserId: { name: string; email: string } | null;
      status: string;
      source: string;
      commission: { amountEarned: number; status: string };
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }>(`/v1/growth-partner/referrals${queryString}`);
}

// ==================== Financial Operations ====================

export async function getTransactions(params?: {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : '';
  
  return apiCall<{
    data: Array<{
      transactionId: string;
      type: string;
      amount: number;
      status: string;
      description: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }>(`/v1/growth-partner/transactions${queryString}`);
}

export async function getEarningsBreakdown() {
  return apiCall<{
    lifetime: number;
    pending: number;
    withdrawn: number;
    thisMonth: number;
    lastMonth: number;
    byMonth: Array<{ month: string; amount: number }>;
  }>('/v1/growth-partner/earnings/breakdown');
}

export async function requestWithdrawal(amount: number) {
  return apiCall<{
    success: boolean;
    message: string;
    withdrawal: {
      withdrawalId: string;
      amount: number;
      currency: string;
      status: string;
      requestedAt: string;
    };
  }>('/v1/growth-partner/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function getWithdrawals(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : '';
  
  return apiCall<{
    data: Array<{
      withdrawalId: string;
      amount: number;
      status: string;
      bankDetails: { bankName: string; accountNumber: string };
      requestedAt: string;
      processedAt: string | null;
    }>;
    total: number;
    page: number;
    limit: number;
  }>(`/v1/growth-partner/withdrawals${queryString}`);
}

// ==================== Public Referral Tracking ====================

export async function validateReferralCode(code: string, source?: string) {
  const queryString = source ? `?source=${source}` : '';
  
  // This is a public endpoint, no auth required
  const response = await fetch(`${API_BASE}/v1/public/referral/${code}${queryString}`);
  return response.json() as Promise<{
    valid: boolean;
    referralId?: string;
    code?: string;
    message?: string;
  }>;
}

// ==================== Referral Cookie Management ====================

const REFERRAL_COOKIE_NAME = 'folaignite_ref';
const REFERRAL_COOKIE_EXPIRY_DAYS = 30;

export function saveReferralCode(code: string): void {
  if (typeof document === 'undefined') return;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + REFERRAL_COOKIE_EXPIRY_DAYS);
  
  document.cookie = `${REFERRAL_COOKIE_NAME}=${code}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

export function getReferralCodeFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === REFERRAL_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

export function clearReferralCode(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${REFERRAL_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Growth Partner API exports
export const growthPartnerApi = {
  // Registration
  checkEligibility,
  registerAsGrowthPartner,
  updateBankDetails,
  
  // Dashboard
  getDashboard,
  getAnalytics,
  
  // Referrals
  getReferralLink,
  regenerateReferralCode,
  getReferrals,
  
  // Financial
  getTransactions,
  getEarningsBreakdown,
  requestWithdrawal,
  getWithdrawals,
  
  // Public
  validateReferralCode,
  
  // Cookie management
  saveReferralCode,
  getReferralCodeFromCookie,
  clearReferralCode,
};
