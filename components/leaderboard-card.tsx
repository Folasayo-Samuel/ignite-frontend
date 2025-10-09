import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Kwame Mensah", streak: 30, projects: 5, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 2, name: "Zara Hassan", streak: 28, projects: 4, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 3, name: "Amara Okafor", streak: 25, projects: 4, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 4, name: "Chidi Nwosu", streak: 23, projects: 3, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 5, name: "Fatima Bello", streak: 22, projects: 3, avatar: "/placeholder.svg?height=40&width=40" },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
  }
}

export function LeaderboardCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top performers in your cohort</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((user) => (
            <div key={user.rank} className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
              <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(user.rank)}</div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.streak} day streak • {user.projects} projects
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
