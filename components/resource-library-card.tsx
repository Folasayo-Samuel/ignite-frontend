"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Code, Search, ExternalLink, Lock, X } from "lucide-react"
import { useState, useRef } from "react"
import { useAuthStore } from "@/store/authStore"
import { useApiQuery } from "@/hooks/useApiQuery"
import { teaserResources } from "@/data/teaser-resources"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Resource {
  id: string;
  title: string;
  type: string;
  category: string;
  url: string;
  description: string;
}

export function ResourceLibraryCard() {
  const { currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Guard ref to prevent race condition when X button is clicked
  const isRemovingRef = useRef(false);

  // -- Backend Fetching (for Logged In Users) --
  const { data: apiData, isLoading } = useApiQuery<{ items: any[]; isFallback?: boolean }>(
    ["resources", searchQuery, selectedCategory || ""],
    {
      url: "/students/resources/search",
      method: "GET",
      params: {
        q: searchQuery,
        skills: selectedCategory,
        limit: 20,
      },
    },
    { enabled: !!currentUser }
  );

  // Track if showing fallback/trending resources
  const isFallback = currentUser && apiData?.isFallback === true;

  // -- Data Normalization & Selection --
  let resources: Resource[] = [];

  if (currentUser) {
    // Transform Backend Data
    const rawItems = apiData?.items || [];
    resources = rawItems.map((item: any) => ({
      id: item._id || item.id || Math.random().toString(), // fallback ID
      title: item.title,
      type: item.format || 'article',
      category: String(item.skills?.[0] || 'General').trim(),
      url: item.url,
      description: item.summary || item.description || '',
    }));
  } else {
    // Use Teaser Data
    resources = teaserResources;
  }

  // derive categories from the definition set (teaser) or dynamic set (backend)
  // For teaser, we use the static set. For logged-in users, derive from actual API data
  const categories = currentUser
    ? Array.from(new Set(resources.map((r) => r.category).filter(Boolean)))
      .slice(0, 10) // Limit to 10 categories for UI cleanliness
    : Array.from(new Set(teaserResources.map((r) => r.category)));

  // -- Local Filtering --
  // For logged-in users: backend handles search via API params, we only apply category fallback
  // For teaser mode: apply full local search + category filtering
  const filteredResources = currentUser
    ? resources.filter((resource) => {
      // Only apply category filter as safety fallback (in case backend returns mismatched data)
      const matchesCategory = !selectedCategory ||
        resource.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      return matchesCategory
    })
    : resources.filter((resource) => {
      // Full local filtering for teaser mode
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || resource.category === selectedCategory
      return matchesSearch && matchesCategory
    })

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "documentation":
      case "doc":
        return <BookOpen className="h-4 w-4" />
      case "code":
      case "tool":
        return <Code className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleViewResource = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const toggleCategory = (cat: string) => {
    // Guard: if X button was just clicked, skip this toggle
    if (isRemovingRef.current) {
      isRemovingRef.current = false;
      return;
    }
    const target = cat.trim();
    if (selectedCategory?.trim() === target) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(target);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>
              {currentUser ? "Resource Library" : "Curriculum Preview"}
            </CardTitle>
            <CardDescription>
              {currentUser
                ? "Personalized learning materials to accelerate your growth"
                : "A sneak peek at the resources available to our students"}
            </CardDescription>
          </div>
          {!currentUser && (
            <Link href="/auth/signup">
              <Button size="sm" className="w-full md:w-auto">
                <Lock className="mr-2 h-4 w-4" />
                Unlock 10,000+ Resources
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={currentUser ? "Search everything (YouTube, MDN, Dev.to)..." : "Search preview resources..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="transition-all hover:scale-105 active:scale-95"
            >
              All
            </Button>
            {categories.map((category) => {
              const isSelected = selectedCategory?.trim() === category.trim();
              return (
                <div key={category} className="relative inline-flex">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (!isSelected) {
                        setSelectedCategory(category.trim());
                      }
                    }}
                    className={`transition-all hover:scale-105 active:scale-95 ${isSelected ? 'pr-9' : ''}`}
                  >
                    {category}
                  </Button>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.button
                        type="button"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-0.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center bg-white/30 hover:bg-white/60 rounded-full p-1 cursor-pointer transition-colors z-10"
                        onClick={() => setSelectedCategory(null)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        aria-label={`Remove ${category} filter`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && currentUser ? (
            <div className="text-center py-8 text-muted-foreground">Loading resources...</div>
          ) : filteredResources.length > 0 ? (
            <>
              {isFallback && searchQuery && (
                <div className="text-center py-3 px-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    No exact matches found for "{searchQuery}". Here are some trending resources:
                  </p>
                </div>
              )}
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{getIcon(resource.type)}</div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm truncate sm:whitespace-normal">{resource.title}</h4>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs w-fit shrink-0">
                          {resource.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => handleViewResource(resource.url)}
                      >
                        View Resource
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No resources found.</p>
            </div>
          )}
        </div>

        {!currentUser && (
          <div className="mt-8 p-6 bg-muted/50 rounded-xl text-center space-y-4">
            <h3 className="font-semibold text-lg">Want to see more?</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Ignite students get access to a powerful AI-driven search engine that aggregates content from YouTube, Coursera, MDN, and more.
            </p>
            <Link href="/auth/signup">
              <Button>Get Full Access</Button>
            </Link>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
