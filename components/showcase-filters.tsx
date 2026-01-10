"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useProjectFilters } from "@/api/project-filters"

// Debounce hook for search optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface ShowcaseFiltersProps {
  onFilterChange?: (filters: { track: string; country: string; search: string }) => void
}

export function ShowcaseFilters({ onFilterChange }: ShowcaseFiltersProps) {
  const [track, setTrack] = useState("all")
  const [country, setCountry] = useState("all")
  const [search, setSearch] = useState("")

  // Debounce search to prevent excessive API calls (300ms)
  const debouncedSearch = useDebounce(search, 300)

  // Fetch dynamic filter options from API
  const { data: filtersData, isLoading: filtersLoading } = useProjectFilters()

  // Trigger filter change when debounced search changes
  useEffect(() => {
    onFilterChange?.({ track, country, search: debouncedSearch })
  }, [debouncedSearch, track, country, onFilterChange])

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case "track":
        setTrack(value)
        break
      case "country":
        setCountry(value)
        break
      case "search":
        setSearch(value)
        return // Don't trigger immediate callback for search - let debounce handle it
    }
  }

  const handleReset = () => {
    setTrack("all")
    setCountry("all")
    setSearch("")
    onFilterChange?.({ track: "all", country: "all", search: "" })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          value={search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={track} onValueChange={(value) => handleFilterChange("track", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tech Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              filtersData?.tracks?.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label} ({t.count})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={(value) => handleFilterChange("country", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              filtersData?.countries?.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label} ({c.count})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto bg-transparent">
        Reset Filters
      </Button>
    </div>
  )
}

