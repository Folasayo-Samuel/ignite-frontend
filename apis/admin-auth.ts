// [apis/admin-auth] 2026-05-13 — Isolated API calls for the Enterprise Admin Auth module
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/hooks/axiosInstance"

// Define the Admin user type
export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
  isActive: boolean
  lastLoginAt?: string
}

export const adminAuthKeys = {
  all: ["admin-auth"] as const,
  me: () => [...adminAuthKeys.all, "me"] as const,
}

export function useAdminAuth() {
  const queryClient = useQueryClient()

  // GET /admin-auth/me
  // IMPORTANT: skipAuthRedirect prevents the axios interceptor from
  // redirecting to /auth/login when the admin is not logged in yet.
  const getCurrentAdmin = () =>
    useQuery({
      queryKey: adminAuthKeys.me(),
      queryFn: async () => {
        const { data } = await axiosInstance.get<{ success: boolean; data: AdminUser }>("/admin-auth/me", {
          skipAuthRedirect: true,
          skipAuthRefresh: true,
        } as Record<string, unknown>)
        return data.data
      },
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })

  // POST /admin-auth/login
  const loginAdmin = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axiosInstance.post<{
        success: boolean
        data: { user: AdminUser }
        accessToken: string
      }>("/admin-auth/login", credentials, {
        skipAuthRedirect: true,
        skipAuthRefresh: true,
      } as Record<string, unknown>)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(adminAuthKeys.me(), data.data.user)
    },
  })

  // POST /admin-auth/logout
  const logoutAdmin = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/admin-auth/logout", {}, {
        skipAuthRedirect: true,
        skipAuthRefresh: true,
      } as Record<string, unknown>)
      return data
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: adminAuthKeys.all })
    },
  })

  return {
    getCurrentAdmin,
    loginAdmin,
    logoutAdmin,
  }
}
