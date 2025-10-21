"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { CustomButton } from "../clickable/CustomButton";

type Props = {
  onClose: (value: boolean) => void;
};

export const UserDropdownContent = ({ onClose }: Props) => {
  const router = useRouter();

  const { currentUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
    onClose(false);
  };

  const handleProceedToDashboard = () => {
    if (currentUser?.isArtisan) {
      router.push("/artisan/dashboard");
    } else if (currentUser?.isAdmin) {
      router.push("/admin/dashboard");
    }
    onClose(false);
  };

  const handleProceedToProfile = () => {
    router.push("/artisan/dashboard/settings");
    onClose(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {currentUser?.isArtisan && (
        <CustomButton
          type="button"
          label="My Profile"
          className=" rounded-[10px] w-[179px] h-[50px] bg-white text-black border border-black "
          onClick={handleProceedToProfile}
        />
      )}
      {currentUser?.isArtisan && (
        <CustomButton
          type="button"
          label="Proceed to Dashboard"
          className=" rounded-[10px] w-[179px] h-[50px] bg-white text-black border border-black "
          onClick={handleProceedToDashboard}
        />
      )}
      {currentUser?.isAdmin && (
        <CustomButton
          type="button"
          label="Proceed to Dashboard"
          className=" rounded-[10px] w-[179px] h-[50px] bg-white text-black border border-black "
          onClick={handleProceedToDashboard}
        />
      )}
      <CustomButton
        type="button"
        label="Logout"
        className=" rounded-[10px] w-[179px] h-[50px] !bg-[#AE2525] "
        onClick={handleLogout}
      />
    </div>
  );
};
