"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"

// Role-based navigation pages
const allNavigationPages = [
  // Learner-specific pages
  {
    type: "page",
    title: "Learner Dashboard",
    description: "Track your progress and log daily activities",
    url: "/learner/dashboard",
    roles: ["student"],
  },
  {
    type: "page",
    title: "My Progress",
    description: "View your learning journey and achievements",
    url: "/learner/progress",
    roles: ["student"],
  },
  {
    type: "page",
    title: "My Subscription",
    description: "Manage your subscription and billing",
    url: "/learner/subscription",
    roles: ["student"],
  },
  // Mentor-specific pages
  {
    type: "page",
    title: "Mentor Dashboard",
    description: "Manage your mentees and sessions",
    url: "/mentor/dashboard",
    roles: ["mentor"],
  },
  {
    type: "page",
    title: "My Mentees",
    description: "View and manage your active mentees",
    url: "/mentor/dashboard",
    roles: ["mentor"],
  },
  {
    type: "page",
    title: "Session Requests",
    description: "Review pending session requests from students",
    url: "/mentor/dashboard",
    roles: ["mentor"],
  },
  {
    type: "page",
    title: "Manage Schedule",
    description: "Set your availability and time slots",
    url: "/mentor/dashboard",
    roles: ["mentor"],
  },
  // Admin pages
  {
    type: "page",
    title: "Admin Dashboard",
    description: "Platform administration and analytics",
    url: "/admin",
    roles: ["admin"],
  },
  // Shared pages (available to all roles)
  {
    type: "page",
    title: "Project Showcase",
    description: "Browse projects from the community",
    url: "/home/showcase",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Discussion Forum",
    description: "Ask questions and help your peers",
    url: "/home/forum",
    roles: ["student", "mentor", "admin"],
  },
  {
    type: "page",
    title: "Resources",
    description: "Access learning resources and materials",
    url: "/home/resources",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Learning Partners",
    description: "Explore learning partner organizations",
    url: "/home/learning-partners",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Sponsors",
    description: "View our sponsors and their contributions",
    url: "/home/sponsor",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Impact",
    description: "See the impact we're making together",
    url: "/home/impact",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Events",
    description: "Upcoming workshops and community events",
    url: "/events",
    roles: ["student", "mentor", "admin", "guest"],
  },
  {
    type: "page",
    title: "Messages",
    description: "View your conversations",
    url: "/messages",
    roles: ["student", "mentor", "admin"],
  },
  // Guest-only pages (not logged in or students looking to become mentors)
  {
    type: "page",
    title: "Become a Mentor",
    description: "Apply to mentor learners in the community",
    url: "/home/become-mentor",
    roles: ["guest", "student"],
  },
  {
    type: "page",
    title: "Partner With Us",
    description: "Learn about partnership opportunities",
    url: "/home/partner",
    roles: ["guest", "student", "mentor", "admin"],
  },
]

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { currentUser } = useAuthStore()

  // Determine user role - default to 'guest' if not logged in
  const userRole = currentUser?.role || 'guest'

  // Filter navigation pages based on user role
  const navigationPages = useMemo(() => {
    return allNavigationPages.filter(page => page.roles.includes(userRole))
  }, [userRole])

  const filteredResults = navigationPages.filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "resource":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "mentor":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "event":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground bg-transparent">
          <Search className="mr-2 h-4 w-4" />
          Search FolaIgnite...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Navigate to pages across FolaIgnite</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type to search pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {query === "" ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase px-1">Quick Links</p>
                {navigationPages.slice(0, 5).map((result, index) => (
                  <Link
                    key={index}
                    href={result.url}
                    onClick={() => setOpen(false)}
                    className="block p-3 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className={`${getTypeColor(result.type)} mt-0.5`}>
                        {result.type}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{result.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No matching pages found</p>
            ) : (
              filteredResults.map((result, index) => (
                <Link
                  key={index}
                  href={result.url}
                  onClick={() => setOpen(false)}
                  className="block p-3 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className={`${getTypeColor(result.type)} mt-0.5`}>
                      {result.type}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{result.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
