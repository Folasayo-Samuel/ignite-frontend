"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, ExternalLink, Github } from "lucide-react"
import { CommentDialog } from "./comment-dialog"
import { useProjects, Project } from "@/api/projects"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { likeProject } = useProjects();

  const [likes, setLikes] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false); // We need backend to return if current user liked
  const [commentCount, setCommentCount] = useState(project.comments || 0);

  const handleLike = () => {
    if (!currentUser) {
      router.push("/auth/login?redirect=/home/showcase");
      return;
    }

    const newLikedState = !isLiked;
    const newLikes = newLikedState ? likes + 1 : likes - 1;

    // Optimistic update
    setIsLiked(newLikedState);
    setLikes(newLikes);

    likeProject.mutate(
      { projectId: project.id || project._id },
      {
        onError: (error) => {
          // Revert on error
          setIsLiked(!newLikedState);
          setLikes(likes);
          console.error("Failed to like project:", error);
        }
      }
    );
  };

  const handleCommentAdded = () => {
    setCommentCount(commentCount + 1);
  };

  return (
    <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={project.thumbnail || "/placeholder.svg?height=300&width=400"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">{project.track}</Badge>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.authorAvatar || "/placeholder.svg"} alt={project.author} />
            <AvatarFallback>
              {project.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{project.author}</p>
            <p className="text-xs text-muted-foreground">{project.country}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm">{likes}</span>
          </Button>
          <CommentDialog
            projectTitle={project.title}
            commentCount={commentCount}
            onCommentAdded={handleCommentAdded}
            postId={project.id || project._id}
          />
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
