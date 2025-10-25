"use client";

import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import React, { useState } from "react";
import { getUserInitials } from "@/utils/getUserInitials";
import { DropdownModal } from "../shared/DropdownModal";
import { useUser } from "@/api/user";
import { UserDropdownContent } from "../shared/UserDropdownContent";
import { PolygonGrey } from "@/public/svgs/SharedIcons";

type Props = {};

const UserDesc = (props: Props) => {
  const { currentUser } = useAuthStore();
  const { getCurrentUser } = useUser();
  const { data: user } = getCurrentUser();

  const profilePhoto = user?.profilePhoto?.url;

  const initials = getUserInitials(currentUser?.name);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      onClick={() => setIsModalOpen(!isModalOpen)}
      className="flex items-center gap-3 cursor-pointer relative"
    >
      {profilePhoto ? (
        <div className="w-12 h-12 cursor-pointer">
          <Image
            src={profilePhoto}
            alt={`${currentUser?.name}`}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        <div className="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-full text-base font-semibold cursor-pointer">
          {initials}
        </div>
      )}
      <div className="flex flex-col">
        {/* <p className="text-primary font-[300] text-xs md:text-xl">
          {currentUser?.name} 
        </p> */}
        {user?.role && (
          <span className="text-xs text-grayish">
           {user?.role}
          </span>
        )}
      </div>

      <DropdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={PolygonGrey}
        className="!-left-36 !top-20 !w-[230px] !bg-[#DEE8FF]"
      >
        <UserDropdownContent onClose={() => setIsModalOpen(false)} />
      </DropdownModal>
    </div>
  );
};

export default UserDesc;
