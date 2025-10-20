import { AuthResponse, ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useAuth = () => {
  const registerUser = useApiMutation<AuthResponse, FormData>({
    url: "/auth/register ",
    method: "POST",
  });

  const loginUser = useApiMutation<AuthResponse, FormData>({
    url: "/auth/login",
    method: "POST",
  });

  const verifyOTP = useApiMutation<AuthResponse, FormData>({
    url: "/auth/verify-otp",
    method: "POST",
  });

    const verifyResetPasswordOTP = useApiMutation<AuthResponse, FormData>({
    url: "/auth/verify-otp",
    method: "POST",
  });

  const resendOTP = useApiMutation<AuthResponse, FormData>({
    url: "/auth/request-otp",
    method: "POST",
  });

  const changePassword = useApiMutation<AuthResponse, FormData>({
    url: "/auth/change-password",
    method: "POST",
  });

   const forgotPassword = useApiMutation<AuthResponse, FormData>({
    url: "/auth/forget-password",
    method: "POST",
  });

  const resetPassword = useApiMutation<AuthResponse, FormData>({
    url: "/auth/reset-password",
    method: "POST",
  });

  const updateProfile = useApiMutation<AuthResponse, FormData>({
    url: "/profile-update",
    method: "POST",
  });

  return {
    loginUser,
    registerUser,
    verifyOTP,
    resendOTP,
    verifyResetPasswordOTP,
    resetPassword,
    changePassword,
    forgotPassword,
    updateProfile,
  };
};
