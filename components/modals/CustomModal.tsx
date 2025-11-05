import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ReusableModalProps {
  isOpen: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disableClose?: boolean; 
}

export const CustomModal = ({
  isOpen,
  onClose,
  icon,
  children,
  disableClose = false,
}: ReusableModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!disableClose && !open && onClose) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="lg:max-w-md text-center bg-white rounded-[20px]"
        onEscapeKeyDown={(e) => disableClose && e.preventDefault()} // block ESC
        onPointerDownOutside={(e) => disableClose && e.preventDefault()} // block backdrop
      >
        <DialogTitle>
          <VisuallyHidden>Modal</VisuallyHidden>
        </DialogTitle>

        {icon && <div className="mx-auto mb-5">{icon}</div>}

        <div className="space-y-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
