"use client";

import React from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/api/user";
import { getUserInitials } from "@/utils/getUserInitials";
import { useRouter } from "next/navigation";
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
  const { logout, currentUser } = useAuthStore();
  const { getCurrentUser } = useUser();
  const { data: user, isLoading } = getCurrentUser();

  const profilePhoto = user?.profilePhoto?.url;
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
            <p className="text-sm font-medium">{currentUser?.name}</p>
            {user?.role && (
              <span className="text-xs text-gray-500">{user?.role}</span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${currentUser?.role}/dashboard`)}
        >
          Go to Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDesc;
