"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Building2 } from "lucide-react"

interface ImpactToggleProps {
  onToggle?: (view: "students" | "partners") => void
  hasPartners?: boolean
}

export function ImpactToggle({ onToggle, hasPartners }: ImpactToggleProps) {
  const [activeView, setActiveView] = useState<"students" | "partners">("students")

  const handleToggle = (view: "students" | "partners") => {
    setActiveView(view)
    onToggle?.(view)
  }

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-1">
      <Button
        variant={activeView === "students" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleToggle("students")}
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        Learner Impact
      </Button>
      {hasPartners && (
        <Button
          variant={activeView === "partners" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleToggle("partners")}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Partner Reach
        </Button>
      )}
    </div>
  )
}
