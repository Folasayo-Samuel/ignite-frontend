"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { useState } from "react"
import { CommentDialog } from "@/components/comment-dialog"
import { useStudents } from "@/api/student"

const feedItemsData = [
  {
    id: "1",
    user: "Kwame Mensah",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2 hours ago",
    content: "Just completed my React authentication system! Learned so much about JWT tokens and secure storage.",
    likes: 12,
    comments: 3,
    isLiked: false,
  },
  {
    id: "2",
    user: "Zara Hassan",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "5 hours ago",
    content: "Day 25 done! Built a responsive dashboard with Tailwind CSS. The utility-first approach is amazing.",
    likes: 8,
    comments: 2,
    isLiked: false,
  },
  {
    id: "3",
    user: "Chidi Nwosu",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "1 day ago",
    content: "Struggled with async/await today but finally got it! The community support here is incredible.",
    likes: 15,
    comments: 5,
    isLiked: false,
  },
]

export function CohortFeedCard() {
  const [feedItems, setFeedItems] = useState(feedItemsData)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  const {getCohortFeed} = useStudents()
  const {data, isPending} = getCohortFeed()
  console.log(data, "cohort_feed")

  const handleLike = (id: string) => {
    setFeedItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked,
            }
          : item,
      ),
    )
  }

  const handleComment = (id: string) => {
    setSelectedPost(id)
    setCommentDialogOpen(true)
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Cohort Feed</CardTitle>
        <CardDescription>See what your peers are working on</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feedItems.map((item, index) => (
            <div key={item.id} className="space-y-3">
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
                <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => handleLike(item.id)}>
                  <Heart className={`h-4 w-4 ${item.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="text-sm">{item.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => handleComment(item.id)}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{item.comments}</span>
                </Button>
              </div>

              {index < feedItems.length - 1 && <div className="border-t border-border" />}
            </div>
          ))}
        </div>
      </CardContent>

      {/* <CommentDialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen} postId={selectedPost || ""} /> */}
    </Card>
  )
}
