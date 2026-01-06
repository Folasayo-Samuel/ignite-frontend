"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Briefcase, Calendar, Users, Award, MessageSquare, Video } from "lucide-react"

// This would typically come from a database
const mentorData = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    company: "Google",
    location: "San Francisco, USA",
    avatar: "/placeholder.svg?height=120&width=120",
    rating: 4.9,
    totalSessions: 156,
    expertise: ["React", "TypeScript", "Next.js", "UI/UX"],
    bio: "Passionate about helping developers level up their frontend skills. I've been building web applications for over 8 years and love sharing my knowledge with aspiring developers.",
    experience: "8+ years",
    availability: "Weekends",
    languages: ["English", "Spanish"],
    achievements: ["Mentored 50+ developers", "Speaker at React Conf 2023", "Open source contributor"],
    reviews: [
      {
        id: "1",
        author: "John Doe",
        rating: 5,
        comment: "Sarah is an amazing mentor! She helped me understand React hooks in depth.",
        date: "2 weeks ago",
      },
      {
        id: "2",
        author: "Jane Smith",
        rating: 5,
        comment: "Very patient and knowledgeable. Highly recommend!",
        date: "1 month ago",
      },
    ],
  },
  "2": {
    id: "2",
    name: "David Chen",
    title: "Full Stack Engineer",
    company: "Microsoft",
    location: "Seattle, USA",
    avatar: "/placeholder.svg?height=120&width=120",
    rating: 4.8,
    totalSessions: 203,
    expertise: ["Node.js", "Python", "AWS", "Docker"],
    bio: "Backend specialist with a focus on scalable systems. I enjoy teaching developers how to build robust and efficient server-side applications.",
    experience: "10+ years",
    availability: "Evenings",
    languages: ["English", "Mandarin"],
    achievements: [
      "AWS Certified Solutions Architect",
      "Published author on backend development",
      "Led teams of 20+ engineers",
    ],
    reviews: [
      {
        id: "1",
        author: "Mike Wilson",
        rating: 5,
        comment: "David's expertise in backend development is unmatched. Learned so much!",
        date: "1 week ago",
      },
    ],
  },
}

export default function MentorProfilePage({ params }: { params: { id: string } }) {
  const mentor = mentorData[params.id as keyof typeof mentorData]

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Mentor not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-2xl">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{mentor.name}</h1>
                    <p className="text-xl text-muted-foreground">{mentor.title}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {mentor.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mentor.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {mentor.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mentor.totalSessions} sessions
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({mentor.reviews.length} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Request Session
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Video className="h-4 w-4" />
                      Schedule Call
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>

                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Availability</h4>
                      <p className="text-muted-foreground">{mentor.availability}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <p className="text-muted-foreground">{mentor.languages.join(", ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mentor.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {mentor.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{review.author}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
