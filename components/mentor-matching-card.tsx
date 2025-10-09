"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, Users } from "lucide-react"

const mentors = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["React", "TypeScript", "Node.js"],
    rating: 4.9,
    students: 45,
    bio: "Senior Full-Stack Developer with 8 years of experience",
    available: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Python", "Data Science", "Machine Learning"],
    rating: 4.8,
    students: 38,
    bio: "Data Scientist passionate about teaching AI fundamentals",
    available: true,
  },
  {
    id: "3",
    name: "Amara Okafor",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["UI/UX", "Figma", "Design Systems"],
    rating: 5.0,
    students: 52,
    bio: "Product Designer helping developers build beautiful interfaces",
    available: false,
  },
]

export function MentorMatchingCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Find a Mentor</CardTitle>
        <CardDescription>Connect with experienced developers to guide your learning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                    </div>
                    {mentor.available && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Available
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {mentor.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mentor.students} students
                    </span>
                  </div>
                  <Button size="sm" className="w-full sm:w-auto" disabled={!mentor.available}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {mentor.available ? "Request Mentorship" : "Not Available"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
