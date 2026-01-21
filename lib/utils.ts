import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into a compact string representation.
 * e.g., 1200 -> "1.2k", 1000000 -> "1m", 82 -> "82"
 * This ensures consistency across the UI for large metrics.
 */
export function formatCompactNumber(number: number): string {
  if (number < 0) return "0";
  
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(number);
}
