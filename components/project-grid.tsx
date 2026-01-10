"use client"

import { ProjectCard } from "./project-card"
import { useProjects } from "@/api/projects"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectGridProps {
  filters?: {
    track: string
    country: string
    search: string
  }
}

export function ProjectGrid({ filters }: ProjectGridProps) {
  const { getProjects } = useProjects();
  const { data: projectsData, isLoading } = getProjects(filters);
  const projects = projectsData?.items || [];

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No projects found matching your filters.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

