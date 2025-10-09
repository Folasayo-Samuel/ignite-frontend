import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"

const feedItems = [
  {
    user: "Kwame Mensah",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2 hours ago",
    content: "Just completed my React authentication system! Learned so much about JWT tokens and secure storage.",
    likes: 12,
    comments: 3,
  },
  {
    user: "Zara Hassan",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "5 hours ago",
    content: "Day 25 done! Built a responsive dashboard with Tailwind CSS. The utility-first approach is amazing.",
    likes: 8,
    comments: 2,
  },
  {
    user: "Chidi Nwosu",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "1 day ago",
    content: "Struggled with async/await today but finally got it! The community support here is incredible.",
    likes: 15,
    comments: 5,
  },
]

export function CohortFeedCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Cohort Feed</CardTitle>
        <CardDescription>See what your peers are working on</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feedItems.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.user} />
                  <AvatarFallback>
                    {item.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{item.user}</p>
                    <span className="text-sm text-muted-foreground">• {item.time}</span>
                  </div>
                  <p className="mt-1 text-foreground leading-relaxed">{item.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pl-12">
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{item.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{item.comments}</span>
                </Button>
              </div>

              {index < feedItems.length - 1 && <div className="border-t border-border" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
