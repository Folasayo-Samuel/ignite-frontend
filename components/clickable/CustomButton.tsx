import React, { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../shared/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "transparent" | "white";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  label?: string;
  icon?: any;
}

export const CustomButton: FC<ButtonProps> = ({
  label,
  children,
  className,
  type = "button",
  variant = "primary",
  size = "lg",
  isLoading = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "font-medium w-fit h-12 rounded-xl cursor-pointer text-sm  transition-all  flex items-center justify-center gap-x-1 capitalize duration-300 ease-in font-medium disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-primary text-white border-primary hover:bg-primary/80 active:bg-primary/90 disabled:bg-primary/30",
    secondary:
      "bg-gray-600 text-white hover:bg-secondary/80 active:bg-secondary/90 disabled:bg-secondary/30",
    danger:
      "bg-red-700 border border-error text-error hover:bg-red-500  active:bg-red-700 disabled:bg-red-700/30",
    transparent:
      "bg-transparent text-black/90 border hover:text-primary hover:bg-transparent active:text-primary/90 disabled:bg-primary/30",
    white:
      " bg-white text-secondary border hover:text-primary active:text-primary/90 disabled:bg-primary/30",
  };
  const sizes = {
    sm: "py-1 px-2 text-sm",
    md: "py-1.5 px-4 text-base",
    lg: "py-3 px-4 text-sm",
    xl: "py-3 px-6 text-xl",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    isLoading && "opacity-50 cursor-not-allowed ",
    className
  );

  return (
    <Button
      type={type}
      className={classes}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex items-center gap-2">
          {children}
          {Icon && <Icon className="-mt-1" />}
        </div>
      )}
      {label}
    </Button>
  );
};
