"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useMentors, Mentor } from "@/apis/mentors"
import {
  Search,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const EXPERTISE_FILTERS = [
  "All",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "Data Analysis/Science",
  "Machine Learning/AI",
  "DevOps/Cloud Strategy",
  "Product Management",
  "UI/UX Design",
]

function MentorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

interface MentorCardProps {
  mentor: Mentor
}

function MentorCard({ mentor }: MentorCardProps) {
  const initials = mentor.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "M"

  const rating = mentor.ratingsAvg || mentor.rating || 0

  return (
    <Link href={`/mentors/${mentor._id}`}>
      <Card className="overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
        <CardContent className="p-0">
          {/* Gradient accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

          <div className="p-6 space-y-4">
            {/* Header: Avatar + Name */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-background shadow-md flex-shrink-0">
                <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                <AvatarFallback className="bg-orange-50 text-orange-600 font-semibold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {mentor.title ? `${mentor.title}${mentor.company ? ` at ${mentor.company}` : ""}` : "Mentor"}
                </p>
                {rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expertise tags */}
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {mentor.expertise.slice(0, 4).map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs font-normal bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-0"
                  >
                    {skill}
                  </Badge>
                ))}
                {mentor.expertise.length > 4 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{mentor.expertise.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Bio preview */}
            {mentor.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {mentor.bio}
              </p>
            )}

            {/* Footer stats */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{mentor.studentsCount || 0} mentees</span>
              </div>
              <span className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View Profile <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expertiseFilter, setExpertiseFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 12

  const { getMentors } = useMentors()
  const { data: mentorsResponse, isLoading, isError } = getMentors({
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    expertise: expertiseFilter !== "All" ? expertiseFilter : undefined,
  })

  // Extract data — handle nested response structure
  const mentorsData = (mentorsResponse as Record<string, unknown>)?.data as
    | { data?: Mentor[]; pagination?: { totalPages?: number; total?: number } }
    | Mentor[]
    | undefined
  const mentors: Mentor[] = Array.isArray(mentorsData)
    ? mentorsData
    : (mentorsData as { data?: Mentor[] })?.data || []
  const pagination = !Array.isArray(mentorsData)
    ? (mentorsData as { pagination?: { totalPages?: number; total?: number } })?.pagination
    : undefined
  const totalPages = pagination?.totalPages || 1

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // reset to page 1 on search
  }

  const handleFilter = (filter: string) => {
    setExpertiseFilter(filter)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/10" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Learn from the best in tech
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Mentor</span>
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Connect with experienced industry professionals who&apos;ll guide your career, 
                review your code, and help you land your dream role.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25">
                  <Link href="/home/become-mentor">
                    Become a Mentor <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Expertise filter chips */}
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_FILTERS.map((filter) => (
                <Button
                  key={filter}
                  variant={expertiseFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter(filter)}
                  className={
                    expertiseFilter === filter
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "hover:border-orange-300 hover:text-orange-600"
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Mentor Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Unable to load mentors. Please try again later.</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold">No mentors found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || expertiseFilter !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to join our mentor network!"}
              </p>
              <Button asChild variant="outline">
                <Link href="/home/become-mentor">Apply as a Mentor</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mentors.map((mentor: Mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
