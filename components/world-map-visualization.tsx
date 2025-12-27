"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnalytics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

interface WorldMapVisualizationProps {
  activeView?: "students" | "partners"
}

// Country display info with flags
const countryInfo: Record<string, { name: string; flag: string }> = {
  NG: { name: "Nigeria", flag: "🇳🇬" },
  GH: { name: "Ghana", flag: "🇬🇭" },
  KE: { name: "Kenya", flag: "🇰🇪" },
  ZA: { name: "South Africa", flag: "🇿🇦" },
  EG: { name: "Egypt", flag: "🇪🇬" },
  RW: { name: "Rwanda", flag: "🇷🇼" },
  TZ: { name: "Tanzania", flag: "🇹🇿" },
  UG: { name: "Uganda", flag: "🇺🇬" },
  ET: { name: "Ethiopia", flag: "🇪🇹" },
  CI: { name: "Côte d'Ivoire", flag: "🇨🇮" },
  SN: { name: "Senegal", flag: "🇸🇳" },
  CM: { name: "Cameroon", flag: "🇨🇲" },
  MA: { name: "Morocco", flag: "🇲🇦" },
  DZ: { name: "Algeria", flag: "🇩🇿" },
  ZW: { name: "Zimbabwe", flag: "🇿🇼" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  CA: { name: "Canada", flag: "🇨🇦" },
  DE: { name: "Germany", flag: "🇩🇪" },
  IN: { name: "India", flag: "🇮🇳" },
}

const getCountryDisplay = (code: string) => {
  const info = countryInfo[code?.toUpperCase()]
  return info || { name: code, flag: "🌍" }
}

export function WorldMapVisualization({ activeView = "students" }: WorldMapVisualizationProps) {
  const { getGeographicDistribution } = useAnalytics()
  const { data: geoData, isLoading } = getGeographicDistribution()

  const isStudentView = activeView === "students"

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full rounded-lg mb-6" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = geoData?.items || []
  const total = geoData?.total || 0
  const countriesCount = items.length

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Interactive Impact Map</CardTitle>
        <CardDescription>
          {isStudentView ? "Learners by country" : "Partner organizations and reach"}
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
                {countriesCount}+ countries, {total.toLocaleString()} learners
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
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No geographic data available</p>
          ) : (
            items.map((item, index) => {
              const countryDisplay = getCountryDisplay(item.country)
              // Estimate partner count as ~1 partner per 100 users
              const estimatedPartners = Math.max(1, Math.floor(item.count / 100))

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{countryDisplay.flag}</span>
                    <div>
                      <p className="font-semibold text-foreground">{countryDisplay.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isStudentView ? (
                          <>{item.count.toLocaleString()} learners ({item.percentage}%)</>
                        ) : (
                          <>{estimatedPartners} partners • ~{item.count} learners supported</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
