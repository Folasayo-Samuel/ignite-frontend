"use client"

import { useMemo } from "react"
import { ProjectCard } from "./project-card"

const projects = [
  {
    id: "1",
    title: "E-Commerce Dashboard",
    description:
      "A full-featured admin dashboard for managing online stores with real-time analytics and inventory tracking.",
    thumbnail: "/ecommerce-dashboard.png",
    author: "Kwame Mensah",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "ghana",
    track: "web-dev",
    cohort: "2024-q4",
    likes: 45,
    comments: 12,
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    title: "Fitness Tracking App",
    description: "Mobile app for tracking workouts, nutrition, and health metrics with personalized recommendations.",
    thumbnail: "/fitness-app-interface.png",
    author: "Zara Hassan",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "kenya",
    track: "mobile",
    cohort: "2025-q1",
    likes: 38,
    comments: 8,
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "Weather Prediction Model",
    description: "Machine learning model for predicting weather patterns using historical data and neural networks.",
    thumbnail: "/weather-data-visualization.jpg",
    author: "Amara Okafor",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "nigeria",
    track: "data-science",
    cohort: "2024-q3",
    likes: 52,
    comments: 15,
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "4",
    title: "Task Management System",
    description: "Collaborative task management platform with team features, deadlines, and progress tracking.",
    thumbnail: "/task-management-interface.png",
    author: "Chidi Nwosu",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "nigeria",
    track: "web-dev",
    cohort: "2024-q4",
    likes: 41,
    comments: 10,
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "5",
    title: "Banking App Redesign",
    description: "Modern UI/UX redesign of a banking app focusing on accessibility and user experience.",
    thumbnail: "/banking-app-design.png",
    author: "Fatima Bello",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "nigeria",
    track: "ui-ux",
    cohort: "2025-q1",
    likes: 67,
    comments: 20,
    liveUrl: "https://example.com",
  },
  {
    id: "6",
    title: "CI/CD Pipeline Automation",
    description: "Automated deployment pipeline for microservices using Docker, Kubernetes, and GitHub Actions.",
    thumbnail: "/devops-pipeline-diagram.png",
    author: "Kofi Asante",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    country: "ghana",
    track: "devops",
    cohort: "2024-q3",
    likes: 33,
    comments: 7,
    githubUrl: "https://github.com",
  },
]

interface ProjectGridProps {
  filters?: {
    track: string
    country: string
    cohort: string
    search: string
  }
}

export function ProjectGrid({ filters }: ProjectGridProps) {
  const filteredProjects = useMemo(() => {
    if (!filters) return projects

    return projects.filter((project) => {
      const matchesTrack = filters.track === "all" || project.track === filters.track
      const matchesCountry = filters.country === "all" || project.country === filters.country
      const matchesCohort = filters.cohort === "all" || project.cohort === filters.cohort
      const matchesSearch =
        !filters.search ||
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.author.toLowerCase().includes(filters.search.toLowerCase())

      return matchesTrack && matchesCountry && matchesCohort && matchesSearch
    })
  }, [filters])

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No projects found matching your filters.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
