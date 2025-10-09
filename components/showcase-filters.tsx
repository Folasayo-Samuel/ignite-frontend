"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ShowcaseFiltersProps {
  onFilterChange?: (filters: { track: string; country: string; cohort: string; search: string }) => void
}

export function ShowcaseFilters({ onFilterChange }: ShowcaseFiltersProps) {
  const [track, setTrack] = useState("all")
  const [country, setCountry] = useState("all")
  const [cohort, setCohort] = useState("all")
  const [search, setSearch] = useState("")

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { track, country, cohort, search }

    switch (type) {
      case "track":
        setTrack(value)
        newFilters.track = value
        break
      case "country":
        setCountry(value)
        newFilters.country = value
        break
      case "cohort":
        setCohort(value)
        newFilters.cohort = value
        break
      case "search":
        setSearch(value)
        newFilters.search = value
        break
    }

    onFilterChange?.(newFilters)
  }

  const handleReset = () => {
    setTrack("all")
    setCountry("all")
    setCohort("all")
    setSearch("")
    onFilterChange?.({ track: "all", country: "all", cohort: "all", search: "" })
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Select value={track} onValueChange={(value) => handleFilterChange("track", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tech Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="web-dev">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="data-science">Data Science</SelectItem>
            <SelectItem value="ui-ux">UI/UX Design</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={(value) => handleFilterChange("country", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="nigeria">Nigeria</SelectItem>
            <SelectItem value="ghana">Ghana</SelectItem>
            <SelectItem value="kenya">Kenya</SelectItem>
            <SelectItem value="south-africa">South Africa</SelectItem>
            <SelectItem value="egypt">Egypt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cohort} onValueChange={(value) => handleFilterChange("cohort", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Cohort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cohorts</SelectItem>
            <SelectItem value="2025-q1">2025 Q1</SelectItem>
            <SelectItem value="2024-q4">2024 Q4</SelectItem>
            <SelectItem value="2024-q3">2024 Q3</SelectItem>
            <SelectItem value="2024-q2">2024 Q2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto bg-transparent">
        Reset Filters
      </Button>
    </div>
  )
}
