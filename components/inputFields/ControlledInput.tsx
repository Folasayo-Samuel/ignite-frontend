/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useController, Control, RegisterOptions } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ErrorIcon, EyeIcon, EyeIconClose } from "@/public/svgs/SharedIcons";

type ControlledInputProps = {
  name: string;
  label: string;
  control?: Control<any>;
  rules?: RegisterOptions;
  placeholder?: string;
  type?: string;
  method?: string;
  className?: string;
  labelClassName?: string;
  art?: boolean;
  dontShowTime?: boolean;
  ShowHr?: boolean;
  isTextArea?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  cols?: number;
  variant?: "primary" | "secondary" | "tertiary" | "normal";
} & React.ComponentProps<typeof Input>;

const ControlledInput: React.FC<ControlledInputProps> = ({
  label,
  name,
  control,
  rules,
  placeholder = "",
  type = "text",
  isTextArea = false,
  method,
  variant = "primary",
  dontShowTime = false,
  ShowHr = false,
  art = false,
  className,
  labelClassName,
  maxLength,
  minLength,
  rows = 4,
  cols = 50,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    rules,
  });

  const baseStyles =
    "w-full h-[44px] px-4 border rounded-[10px] outline-none text-body placeholder:text-[#98A2B3] placeholder:font-normal font-semibold";

  const styles = {
    normal: "border-white bg-white h-14",
    primary: "border-[#E4E5EA]",
    secondary: "border-bordergray bg-white h-14 focus:border-primary",
    tertiary:
      "border border-black text-[#9694A4] focus:border-primary focus:ring-0",
    invalid: "border-red-500 focus:border-red-500",
  };

  const inputClassName = cn(
    baseStyles,
    styles[variant],
    {
      "border-red-500 focus:border-red-500": invalid,
      "focus:border-primary": !invalid,
    },
    className
  );

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Format value for display
  const formatValue = () => {
    if (!value) return "";

    if (type === "date") {
      if (typeof value === "string") {
        return value.includes("T") ? value.split("T")[0] : value;
      }
      return "";
    }

    if (type === "datetime-local") {
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    }

    return value ?? "";
  };

  // Handle changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type === "date") {
      const dateString = e.target.value; // already YYYY-MM-DD from input
      onChange(dateString || "");
    } else if (type === "datetime-local") {
      const dateTimeString = e.target.value;
      onChange(dateTimeString ? new Date(dateTimeString).toISOString() : "");
    } else {
      onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      <Label
        htmlFor={name}
        className={`text-sm font-medium text-paragrah capitalize ${labelClassName}`}
      >
        {label}
      </Label>

      <div className="relative">
        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={onBlur}
            value={formatValue()}
            ref={ref}
            className={`${inputClassName} h-auto resize-none py-2`}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows}
            cols={cols}
          />
        ) : (
          <div className="relative">
            <input
              id={name}
              name={name}
              type={type === "password" && showPassword ? "text" : type}
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={onBlur}
              value={formatValue()}
              ref={ref}
              className={inputClassName}
              {...props}
            />
            {ShowHr && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-paragrah font-medium">
                /hr
              </span>
            )}
          </div>
        )}

        {type === "password" && !isTextArea && (
          <div
            className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeIconClose /> : <EyeIcon />}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1">
          <ErrorIcon />
          <p className="text-xs text-red-500 capitalize">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default ControlledInput;
