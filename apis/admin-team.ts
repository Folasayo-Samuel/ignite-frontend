import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../hooks/axiosInstance";
import { toast } from "sonner";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data } = await api.get("/admin-core/admins");
      return data.data as AdminUser[];
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminData: { name: string; email: string; role: string; password?: string }) => {
      // Auto-generate password if not provided
      if (!adminData.password) {
        adminData.password = Math.random().toString(36).slice(-8) + 'Aa1!';
      }
      const { data } = await api.post("/admin-core/admins", adminData);
      return data;
    },
    onSuccess: () => {
      toast.success("Admin created successfully. An email has been sent to them with their credentials.");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    },
  });
}

export function useToggleAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/admin-core/admins/${id}/status`, { isActive });
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Admin successfully ${variables.isActive ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update admin status");
    },
  });
}
