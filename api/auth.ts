import { AuthResponse, ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api } from "@/hooks/apiFunction";

export interface Country {
  id: ID;
  name: string;
  code: string;
  dial_code: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'student' | 'mentor' | 'partner' | 'admin';
  country: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface Countries {
  data: Country[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'partner' | 'admin';
  country?: string;
  isSuspended?: boolean;
  createdAt?: string;
}

export const useAuth = () => {
  const registerUser = useApiMutation<AuthResponse, RegisterData>({
    url: "/auth/register",
    method: "POST",
  });

  const loginUser = useApiMutation<AuthResponse, LoginData>({
    url: "/auth/login",
    method: "POST",
    skipAuthRefresh: true,
  });

    const logoutUser = useApiMutation<AuthResponse, any>({
    url: "/auth/logout",
    method: "POST",
  });

  const verifyOTP = useApiMutation<AuthResponse, VerifyOTPData>({
    url: "/auth/verify-otp",
    method: "POST",
  });

  const verifyResetPasswordOTP = useApiMutation<AuthResponse, ResetPasswordData>({
    url: "/auth/reset-password",
    method: "POST",
  });

  const resendOTP = useApiMutation<AuthResponse, ForgotPasswordData>({
    url: "/auth/request-otp",
    method: "POST",
  });

  const forgotPassword = useApiMutation<AuthResponse, ForgotPasswordData>({
    url: "/auth/forgot-password",
    method: "POST",
  });

  const changePassword = useApiMutation<AuthResponse, ChangePasswordData>({
    url: "/auth/change-password",
    method: "POST",
  });

    // updateProfile removed: use useStudents().updateStudentProfile or similar role-based hooks instead.

  const resetPassword = useApiMutation<AuthResponse, ResetPasswordData>({
    url: "/auth/reset-password",
    method: "POST",
  });

  const getAllCountries = () =>
    useApiQuery<Country[]>(["all_country"], {
      url: `/auth/countries?locale=en`,
      method: "GET",
    });

  const getCountries = async () => {
    const response = await api({
      url: `/auth/countries?locale=en`,
      method: "GET",
    });
    return response;
  };

  // Get current authenticated user
  const getCurrentUser = (enabled: boolean = true) =>
    useApiQuery<{ success: boolean; data: User }>(["current_user"], {
      url: `/auth/me`,
      method: "GET",
      skipAuthRedirect: true,
    }, { enabled, retry: false });

  // Admin endpoints
  const getUsers = () =>
    useApiQuery<{ success: boolean; data: User[] }>(["all_users"], {
      url: `/auth/users`,
      method: "GET",
    });

  const listUserNames = (query?: string, limit = 100) =>
    useApiQuery<{ success: boolean; data: { id: string; name: string; email: string }[] }>(
      ["user_names", query, limit],
      {
        url: `/auth/admin/user-names?q=${query || ''}&limit=${limit}`,
        method: "GET",
      }
    );

  return {
    loginUser,
    logoutUser,
    registerUser,
    verifyOTP,
    resendOTP,
    verifyResetPasswordOTP,
    resetPassword,
    forgotPassword,
    changePassword,
    getAllCountries,
    getCountries,
    getCurrentUser,
    getUsers,
    listUserNames,
  };
};
