"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnalytics } from "@/api/analytics"
import { Skeleton } from "@/components/ui/skeleton"

interface SkillsTechStackCardProps {
  orgId?: string;
}

export function SkillsTechStackCard({ orgId }: SkillsTechStackCardProps) {
  const { getTopTracks } = useAnalytics();
  const { data: tracksData, isLoading } = getTopTracks();

  // Transform tracks data to skills format
  const skills = (tracksData || []).map((track: any) => ({
    name: track.trackName || track.name || "Unknown",
    count: track.totalUsers || track.activityVolume || 0,
    category: track.category || "General"
  }));

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no data, show empty state instead of fake data
  if (skills.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Skills & Tech Stack</CardTitle>
          <CardDescription>Technologies learned by your cohorts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No skills data available yet.</p>
            <p className="text-xs mt-1">Skills will appear as learners complete activities.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Skills & Tech Stack</CardTitle>
        <CardDescription>Technologies learned by your cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
              {skill.name}
              {skill.count > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">({skill.count})</span>
              )}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
