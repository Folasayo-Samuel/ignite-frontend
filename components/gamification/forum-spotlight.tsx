"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Award, Zap } from "lucide-react";
import { useGamification } from "@/apis/gamification";
import { getUserInitials } from "@/utils/getUserInitials";

export function ForumSpotlight() {
  const { getForumSpotlight } = useGamification();
  const { data: result, isLoading } = getForumSpotlight();
  
  // API function auto-unwraps { success, data }
  const spotlight = result || null;

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Community Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!spotlight?.topMentor && !spotlight?.topStudent) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Award className="h-24 w-24" />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          Community Spotlight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 relative z-10">
        
        {spotlight.topMentor && (
          <div className="flex items-center gap-3 bg-background/60 p-3 rounded-lg border border-border/50 backdrop-blur-sm">
            <Avatar className="h-12 w-12 border-2 border-blue-500/50">
              <AvatarImage src={spotlight.topMentor.avatar} alt={spotlight.topMentor.name} />
              <AvatarFallback className="bg-blue-500/10 text-blue-700">
                {getUserInitials(spotlight.topMentor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{spotlight.topMentor.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
                  Top Mentor
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  {spotlight.topMentor.score} pts
                </span>
              </div>
            </div>
          </div>
        )}

        {spotlight.topStudent && (
          <div className="flex items-center gap-3 bg-background/60 p-3 rounded-lg border border-border/50 backdrop-blur-sm">
            <Avatar className="h-12 w-12 border-2 border-green-500/50">
              <AvatarImage src={spotlight.topStudent.avatar} alt={spotlight.topStudent.name} />
              <AvatarFallback className="bg-green-500/10 text-green-700">
                {getUserInitials(spotlight.topStudent.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{spotlight.topStudent.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-700 hover:bg-green-500/20">
                  Top Helper
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  {spotlight.topStudent.score} pts
                </span>
              </div>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}
