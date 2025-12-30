"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";
import { useController, Control } from "react-hook-form";
import { Label } from "../ui/label";
import { MultiValue } from "react-select";

type Option = { value: string; label: string };

interface CreatableSelectProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
  isDisabled?: boolean;
}

const CreatableSelectComponent: React.FC<CreatableSelectProps> = ({
  name,
  label,
  control,
  placeholder = "Type and press enter...",
  isDisabled = false,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Always force value into an array
  const safeValue: string[] = Array.isArray(value) ? value : [];

  const selectedOptions: Option[] = safeValue.map((val) => ({
    value: val,
    label: val,
  }));

  const handleChange = (newValue: MultiValue<Option>) => {
    const selectedValues = newValue?.map((opt) => opt.value) || [];
    onChange(selectedValues); // only array goes into form
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-base font-semibold capitalize">
        {label}
      </Label>

      <CreatableSelect
        isMulti
        isDisabled={isDisabled}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        className="mt-1"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "10px",
            minHeight: "48px",
          }),
        }}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default CreatableSelectComponent;
