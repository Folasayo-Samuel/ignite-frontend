import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Calendar } from "lucide-react"

export function MentorDashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Mentor" />
          <AvatarFallback>SJ</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.9</span>
            </div>
            <span className="text-sm text-muted-foreground">156 sessions completed</span>
          </div>
        </div>
      </div>

      <Button className="gap-2">
        <Calendar className="h-4 w-4" />
        Manage Schedule
      </Button>
    </div>
  )
}
