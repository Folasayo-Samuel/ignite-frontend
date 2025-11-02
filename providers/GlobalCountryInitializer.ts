"use client";

import { useEffect } from "react";
import { useCountryStore } from "@/store/useCountryStore";

export function GlobalCountryInitializer() {
  const { fetchCountries } = useCountryStore();

  useEffect(() => {
    // Auto-fetch on app load
    fetchCountries();
  }, [fetchCountries]);

  // This component doesn't render anything visible
  return null;
}
