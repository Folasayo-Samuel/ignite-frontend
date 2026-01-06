import React from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/api/user";
import { useAuth } from "@/api/auth";
import { getUserInitials } from "@/utils/getUserInitials";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const UserDesc = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, currentUser } = useAuthStore();
  const { getCurrentUser } = useUser();
  const { data: user, isLoading } = getCurrentUser();
  const { logoutUser } = useAuth();
  const { mutateAsync } = logoutUser;

  const handleLogout = async () => {
    await mutateAsync(
      {},
      {
        onSuccess: () => {
          toast.success("Logged out successfully");
          logout();
          window.location.href = "/";
        },
        onError: () => {
          toast.error("Something Went Wrong");
        },
      }
    );
  };

  const profilePhoto = user?.avatar || user?.profilePhoto?.url || currentUser?.avatar;
  const initials = getUserInitials(currentUser?.name);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col space-y-1">
          <Skeleton className="w-24 h-3 rounded-md" />
          <Skeleton className="w-16 h-2 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          {profilePhoto ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={profilePhoto}
                alt={currentUser?.name || "User"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-full text-base font-semibold">
              {initials}
            </div>
          )}

          <div className="flex flex-col">
            <p className="text-sm font-medium truncate max-w-[150px]" title={currentUser?.name}>
              {currentUser?.name?.split(' ')[0]} {/* Show only first name */}
            </p>
            {user?.role && (
              <span className="text-xs text-gray-500">{user?.role}</span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Profile Link for Students */}
        {currentUser?.role === 'student' && (
          <DropdownMenuItem onClick={() => router.push('/learner/profile')}>
            Profile
          </DropdownMenuItem>
        )}
        {!pathname?.includes('/dashboard') && (
          <DropdownMenuItem
            onClick={() => {
              const role = currentUser?.role;
              if (role === "student") router.push("/learner/dashboard");
              else if (role === "admin") router.push("/admin/dashboard");
              else if (role === "mentor") router.push("/mentor/dashboard");
              else if (role === "partner") router.push("/partner/dashboard");
              else router.push("/");
            }}
          >
            Go to Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDesc;
