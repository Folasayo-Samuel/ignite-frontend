"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Code, Search, ExternalLink, Lock } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useApiQuery } from "@/hooks/useApiQuery"
import { teaserResources } from "@/data/teaser-resources"
import Link from "next/link"

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

  const { searchResources } = useResources();

  // -- Backend Fetching (for Logged In Users) --
  const { data: apiData, isLoading } = searchResources(searchQuery, selectedCategory);

  // -- Data Normalization & Selection --
  let resources: Resource[] = [];

  if (currentUser) {
    // Transform Backend Data
    const rawItems = apiData?.items || [];
    resources = rawItems.map((item: any) => ({
      id: item._id || item.id || Math.random().toString(), // fallback ID
      title: item.title,
      type: item.format || 'article',
      category: item.skills?.[0] || 'General',
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

  // -- Local Filtering (only needed for TEASER mode, backend filters itself) --
  const filteredResources = currentUser
    ? resources // Backend already filtered it via params
    : resources.filter((resource) => {
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
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && currentUser ? (
            <div className="text-center py-8 text-muted-foreground">Loading resources...</div>
          ) : filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
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
            ))
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
