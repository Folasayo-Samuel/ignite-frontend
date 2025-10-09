import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, ExternalLink } from "lucide-react"

const topPerformers = [
  {
    name: "Kwame Mensah",
    avatar: "/placeholder.svg?height=40&width=40",
    cohort: "Web Development Bootcamp",
    projects: 5,
    streak: 30,
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    name: "Zara Hassan",
    avatar: "/placeholder.svg?height=40&width=40",
    cohort: "Mobile App Development",
    projects: 4,
    streak: 28,
    skills: ["React Native", "Firebase", "Redux"],
  },
  {
    name: "Amara Okafor",
    avatar: "/placeholder.svg?height=40&width=40",
    cohort: "Data Science Fundamentals",
    projects: 4,
    streak: 25,
    skills: ["Python", "Pandas", "TensorFlow"],
  },
]

export function TopPerformersCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Top Performers
        </CardTitle>
        <CardDescription>Outstanding learners from your cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((performer, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
                <AvatarFallback>
                  {performer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-foreground">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.cohort}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {performer.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  {performer.projects} projects • {performer.streak} day streak
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
