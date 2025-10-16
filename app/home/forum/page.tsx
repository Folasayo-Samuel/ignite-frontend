"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ThumbsUp, Clock, Plus, Search } from "lucide-react";
import Link from "next/link";

const allDiscussions = [
  {
    id: "1",
    title: "How to handle async operations in React?",
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "React",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    solved: true,
  },
  {
    id: "2",
    title: "Best practices for API error handling",
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Backend",
    replies: 8,
    likes: 15,
    timeAgo: "5 hours ago",
    solved: false,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox - When to use what?",
    author: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "CSS",
    replies: 20,
    likes: 45,
    timeAgo: "1 day ago",
    solved: true,
  },
  {
    id: "4",
    title: "TypeScript generics explained",
    author: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "TypeScript",
    replies: 15,
    likes: 32,
    timeAgo: "2 days ago",
    solved: true,
  },
  {
    id: "5",
    title: "How to optimize database queries?",
    author: "David Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Backend",
    replies: 6,
    likes: 18,
    timeAgo: "3 days ago",
    solved: false,
  },
  {
    id: "6",
    title: "Understanding React hooks lifecycle",
    author: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "React",
    replies: 25,
    likes: 56,
    timeAgo: "4 days ago",
    solved: true,
  },
  {
    id: "7",
    title: "Responsive design tips and tricks",
    author: "Chris Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "CSS",
    replies: 10,
    likes: 28,
    timeAgo: "5 days ago",
    solved: false,
  },
  {
    id: "8",
    title: "Authentication best practices",
    author: "Alex Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Backend",
    replies: 18,
    likes: 42,
    timeAgo: "1 week ago",
    solved: true,
  },
];

export default function ForumPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleCreateTopic = () => {
    console.log("[v0] New topic created:", { title, category, content });
    setOpen(false);
    setTitle("");
    setCategory("");
    setContent("");
  };

  const filteredDiscussions = allDiscussions.filter((discussion) => {
    const matchesSearch = discussion.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      discussion.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Community Forum</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connect with peers, ask questions, and share knowledge
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              New Topic
            </Button>
          </div>

          <div className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/forum/${discussion.id}`}
                  className="block p-6 rounded-lg border-2 hover:border-primary/50 transition-colors bg-card"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
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
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={discussion.avatar || "/placeholder.svg"}
                          alt={discussion.author}
                        />
                        <AvatarFallback className="text-xs">
                          {discussion.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {discussion.author}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {discussion.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.replies} replies
                      </span>
                      <span className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes} likes
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {discussion.timeAgo}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No discussions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discussion Topic</DialogTitle>
            <DialogDescription>
              Start a conversation with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title">Title</Label>
              <Input
                id="topic-title"
                placeholder="What's your question or topic?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="topic-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-content">Description</Label>
              <Textarea
                id="topic-content"
                placeholder="Provide details about your question or topic..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTopic}
              className="flex-1"
              disabled={!title.trim() || !category || !content.trim()}
            >
              Create Topic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
