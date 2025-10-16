import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DiscussionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - in production this would come from a database
  const discussion = {
    id: params.id,
    title: "How to handle async operations in React?",
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "React",
    content:
      "I'm working on a React project and I'm having trouble understanding the best way to handle async operations. Should I use useEffect with async/await, or are there better patterns? I've heard about React Query and SWR, but I'm not sure when to use them. Any advice would be appreciated!",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    solved: true,
  };

  const replies = [
    {
      id: "1",
      author: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Great question! For simple async operations, useEffect with async/await works fine. However, for more complex data fetching, I highly recommend using React Query or SWR. They handle caching, refetching, and error states automatically.",
      likes: 8,
      timeAgo: "1 hour ago",
    },
    {
      id: "2",
      author: "Mike Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I agree with Jane. React Query has been a game-changer for my projects. It eliminates so much boilerplate code and makes data fetching much more predictable.",
      likes: 5,
      timeAgo: "45 minutes ago",
    },
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/forum">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>
        </Button>

        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold text-balance">
                  {discussion.title}
                </h1>
                {discussion.solved && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-700 dark:text-green-400 shrink-0"
                  >
                    Solved
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={discussion.avatar || "/placeholder.svg"}
                    alt={discussion.author}
                  />
                  <AvatarFallback>
                    {discussion.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{discussion.author}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {discussion.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {discussion.timeAgo}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {discussion.content}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {discussion.likes}
                </Button>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {discussion.replies} replies
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies ({replies.length})</h2>

          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={reply.avatar || "/placeholder.svg"}
                      alt={reply.author}
                    />
                    <AvatarFallback className="text-xs">
                      {reply.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{reply.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {reply.timeAgo}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {reply.content}
                </p>

                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {reply.likes}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">Add a Reply</h3>
            <Textarea placeholder="Share your thoughts or answer..." rows={4} />
            <Button>Post Reply</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
