"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ImpactHero } from "@/components/impact-hero"
import { ImpactToggle } from "@/components/impact-toggle"
import { ImpactStatsGrid } from "@/components/impact-stats-grid"
import { WorldMapVisualization } from "@/components/world-map-visualization"
import { ImpactTimeline } from "@/components/impact-timeline"
import { Footer } from "@/components/footer"

export default function ImpactPage() {
  const [activeView, setActiveView] = useState<"students" | "partners">("students")

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ImpactHero />

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-center">
              <ImpactToggle onToggle={setActiveView} />
            </div>

            <div className="space-y-8">
              <ImpactStatsGrid activeView={activeView} />

              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <WorldMapVisualization activeView={activeView} />
                </div>
                <div>
                  <ImpactTimeline />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
