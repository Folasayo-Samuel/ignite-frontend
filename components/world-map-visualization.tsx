"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorldMapVisualizationProps {
  activeView?: "students" | "partners"
}

const studentCountryData = [
  { name: "Nigeria", learners: 1847, projects: 4231, partners: 18, flag: "🇳🇬" },
  { name: "Ghana", learners: 892, projects: 2104, partners: 12, flag: "🇬🇭" },
  { name: "Kenya", learners: 1234, projects: 2876, partners: 15, flag: "🇰🇪" },
  { name: "South Africa", learners: 756, projects: 1689, partners: 9, flag: "🇿🇦" },
  { name: "Egypt", learners: 543, projects: 1234, partners: 7, flag: "🇪🇬" },
  { name: "Rwanda", learners: 321, projects: 745, partners: 5, flag: "🇷🇼" },
  { name: "Tanzania", learners: 289, projects: 678, partners: 4, flag: "🇹🇿" },
  { name: "Uganda", learners: 267, projects: 612, partners: 3, flag: "🇺🇬" },
]

const partnerCountryData = [
  { name: "Nigeria", partners: 18, cohorts: 42, hires: 234, flag: "🇳🇬" },
  { name: "Kenya", partners: 15, cohorts: 35, hires: 189, flag: "🇰🇪" },
  { name: "Ghana", partners: 12, cohorts: 28, hires: 156, flag: "🇬🇭" },
  { name: "South Africa", partners: 9, cohorts: 21, hires: 98, flag: "🇿🇦" },
  { name: "Egypt", partners: 7, cohorts: 16, hires: 87, flag: "🇪🇬" },
  { name: "Rwanda", partners: 5, cohorts: 12, hires: 54, flag: "🇷🇼" },
  { name: "Tanzania", partners: 4, cohorts: 9, hires: 43, flag: "🇹🇿" },
  { name: "Uganda", partners: 3, cohorts: 7, hires: 32, flag: "🇺🇬" },
]

export function WorldMapVisualization({ activeView = "students" }: WorldMapVisualizationProps) {
  const isStudentView = activeView === "students"

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Interactive Impact Map</CardTitle>
        <CardDescription>
          {isStudentView ? "Learners and projects by country" : "Partner organizations and reach"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Simplified map representation */}
        <div className="relative aspect-video rounded-lg bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-8 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-lg font-semibold text-foreground">Africa & Beyond</p>
              <p className="text-sm text-muted-foreground">
                {isStudentView ? "15 countries, 5,247 learners" : "12 countries, 52 partners"}
              </p>
            </div>
          </div>

          {/* Decorative pins */}
          <div className="absolute top-1/4 left-1/3 h-3 w-3 rounded-full bg-primary animate-pulse" />
          <div className="absolute top-1/3 left-1/2 h-3 w-3 rounded-full bg-accent animate-pulse delay-100" />
          <div className="absolute top-2/3 left-2/5 h-3 w-3 rounded-full bg-primary animate-pulse delay-200" />
          <div className="absolute top-1/2 right-1/3 h-3 w-3 rounded-full bg-accent animate-pulse delay-300" />
        </div>

        {/* Country breakdown */}
        <div className="space-y-3">
          {isStudentView
            ? studentCountryData.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-semibold text-foreground">{country.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {country.learners.toLocaleString()} learners • {country.projects.toLocaleString()} projects
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{country.partners} partners</Badge>
                </div>
              ))
            : partnerCountryData.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-semibold text-foreground">{country.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {country.cohorts} cohorts • {country.hires} hires made
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{country.partners} partners</Badge>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
