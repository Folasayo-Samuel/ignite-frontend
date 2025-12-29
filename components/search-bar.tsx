"use client"

import { useState } from "react"
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

const searchResults = [
  {
    type: "page",
    title: "Learner Dashboard",
    description: "Track your progress and log daily activities",
    url: "/student/dashboard",
  },
  {
    type: "page",
    title: "Project Showcase",
    description: "Browse projects from the community",
    url: "/showcase",
  },
  {
    type: "resource",
    title: "React Hooks Guide",
    description: "Learn about useState, useEffect, and custom hooks",
    url: "/resources",
  },
  {
    type: "mentor",
    title: "Sarah Johnson",
    description: "Senior Full-Stack Developer specializing in React",
    url: "/mentors",
  },
  {
    type: "event",
    title: "React Fundamentals Workshop",
    description: "Live workshop on Jan 15, 2025",
    url: "/events",
  },
]

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filteredResults = searchResults.filter(
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
          <DialogDescription>Search for pages, resources, mentors, and more</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type to search..."
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
              <p className="text-center text-sm text-muted-foreground py-8">Start typing to search...</p>
            ) : filteredResults.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No results found</p>
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
