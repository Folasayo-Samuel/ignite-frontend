"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { ChevronDownIcon } from "lucide-react"
import { Control, useController } from "react-hook-form"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

type CustomSelectProps = {
  options: Option[]
  placeholder?: string
  className?: string
  name: string
  label?: string
  control?: Control<any>
  rules?: { required: boolean }
  variant?: "primary" | "secondary" | "tertiary" | "normal"
  multi?: boolean
  searchable?: boolean
  labelClassName?: string
}

export const ControlledSelect = ({
  options,
  placeholder,
  control,
  rules,
  className,
  label,
  name,
  variant = "primary",
  multi = false,
  searchable = false,
  labelClassName,
}: CustomSelectProps) => {
  const {
    field: { onChange, value },
    fieldState: { error, invalid },
  } = useController({ name, control, rules })

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const baseStyles =
    "w-full text-sm !h-14 py-3 px-4 border rounded-[10px] bg-white placeholder:text-gray-400 focus:outline-none"
  const styles = {
    normal: "!border-white text-black",
    primary: "border-[#E4E5EA] text-black",
    secondary: "border-bordergray text-black",
    tertiary: "border border-black text-gray-600",
    invalid: "border-red-500 text-red-500",
  }

  const inputClassName = cn(baseStyles, styles[variant], {
    [styles.invalid]: invalid,
  })

  const selectedValues = multi
    ? Array.isArray(value)
      ? value
      : typeof value === "string"
      ? value.split(",").filter(Boolean)
      : []
    : value
    ? [value]
    : []

  const toggleOption = (val: string) => {
    if (multi) {
      const exists = selectedValues.includes(val)
      const newValues = exists
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val]
      onChange(newValues)
    } else {
      onChange(val)
      setOpen(false)
    }
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </Label>
      )}

      <div className={cn("relative", className)} ref={dropdownRef}>
        <div
          className={cn(
            inputClassName,
            "flex justify-between items-center cursor-pointer"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedValues.length > 0
            ? multi
              ? `${selectedValues.length} selected`
              : options.find((o) => o.value === selectedValues[0])?.label || placeholder
            : placeholder || "Select..."}
          <ChevronDownIcon className="size-5 text-muted-foreground" />
        </div>

        {open && (
          <div className="absolute mt-2 w-full z-50 bg-white shadow-md rounded-lg p-4 max-h-60 overflow-y-auto cursor-pointer">
            {searchable && (
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="h-8 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const checked = selectedValues.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      "flex items-center space-x-2 mb-2",
                      !multi && "hover:bg-gray-100 px-2 py-1 rounded"
                    )}
                    onClick={() => {
                      if (!multi) toggleOption(opt.value)
                    }}
                  >
                    {multi ? (
                      <>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleOption(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </>
                    ) : (
                      <span>{opt.label}</span>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">No options found</p>
            )}
          </div>
        )}
      </div>

      {multi && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val)
            return (
              <div
                key={val}
                className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1"
              >
                <span>{opt?.label || val}</span>
                <button
                  type="button"
                  onClick={() => toggleOption(val)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error?.message}</p>}
    </div>
  )
}
