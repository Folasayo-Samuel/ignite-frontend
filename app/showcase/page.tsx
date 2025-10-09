"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ShowcaseHero } from "@/components/showcase-hero"
import { ShowcaseFilters } from "@/components/showcase-filters"
import { ProjectGrid } from "@/components/project-grid"
import { Footer } from "@/components/footer"

export default function ShowcasePage() {
  const [filters, setFilters] = useState({
    track: "all",
    country: "all",
    cohort: "all",
    search: "",
  })

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ShowcaseHero />

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <ShowcaseFilters onFilterChange={setFilters} />
            </div>

            <ProjectGrid filters={filters} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
