"use client";
import React, { FC } from "react";
import { motion } from "framer-motion";

interface DropdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  icon?: FC<React.ComponentProps<"svg">>;
  className?: string;
  iconStyle?: string;
}

export const DropdownModal: React.FC<DropdownModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  icon: Icon,
  iconStyle
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#b3d2ed]/70 z-20" onClick={onClose} />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`absolute -left-24 top-[72px] bg-white shadow-dropShadow rounded-[20px] p-8 z-50 w-[350px] ${className}`}
      >
        <div className={`absolute -top-3 right-10 ${iconStyle}`}>{Icon && <Icon />}</div>
        {children}
      </motion.div>
    </>
  );
};
