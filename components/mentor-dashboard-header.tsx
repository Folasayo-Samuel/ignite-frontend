"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Calendar, UserPen } from "lucide-react"
import { useMentors } from "@/api/mentors"
import Link from "next/link"

export function MentorDashboardHeader() {
  const { getMyProfile } = useMentors()
  const { data: profileResult } = getMyProfile()
  const profile = profileResult?.data

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar || "/placeholder.svg?height=64&width=64"} alt={profile?.name || "Mentor"} />
          <AvatarFallback>{profile?.name?.slice(0, 2).toUpperCase() || "ME"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile?.name || "Mentor Dashboard"}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{profile?.ratingsAvg?.toFixed(1) || "0.0"}</span>
            </div>
            <span className="text-sm text-muted-foreground">{profile?.sessionsCompleted || 0} sessions completed</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href="/home/become-mentor">
          <Button variant="outline" className="gap-2">
            <UserPen className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
        <Button
          className="gap-2"
          onClick={() => {
            document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Calendar className="h-4 w-4" />
          Manage Schedule
        </Button>
      </div>
    </div>
  )
}
