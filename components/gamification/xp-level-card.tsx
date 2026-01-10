"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/api/gamification";
import { Zap, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" },
  "Rising Star": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  Expert: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
  Master: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
  Legend: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
  Grandmaster: { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20" },
};

export function XPLevelCard() {
  const { getStats } = useGamification();
  const { data, isLoading } = getStats();
  const xp = data?.xp;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const levelTitle = xp?.levelTitle || "Beginner";
  const colors = levelColors[levelTitle] || levelColors.Beginner;

  return (
    <Card className={cn("border-2", colors.border)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className={cn("h-5 w-5", colors.text)} />
            Level & XP
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {xp?.weekly || 0} XP this week
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center h-14 w-14 rounded-full",
              colors.bg
            )}
          >
            <div className="text-center">
              <span className={cn("text-xl font-bold", colors.text)}>
                {xp?.level || 1}
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className={cn("font-semibold", colors.text)}>
                  {levelTitle}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {xp?.total?.toLocaleString() || 0} total XP
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {xp?.currentLevelXP || 0}/{xp?.nextLevelXP || 100} XP
              </span>
            </div>
            <Progress value={xp?.progressPercent || 0} className="h-2" />
          </div>
        </div>

        {(xp?.level || 1) >= 10 && (
          <div className="mt-3 flex items-center gap-2">
            <Trophy className={cn("h-4 w-4", colors.text)} />
            <span className="text-xs text-muted-foreground">
              Top performer! You're in the elite tier.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function XPLevelBadge() {
  const { getStats } = useGamification();
  const { data, isLoading } = getStats();
  const xp = data?.xp;

  if (isLoading) {
    return <Skeleton className="h-8 w-24 rounded-full" />;
  }

  const levelTitle = xp?.levelTitle || "Beginner";
  const colors = levelColors[levelTitle] || levelColors.Beginner;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1",
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      <Zap className="h-3.5 w-3.5" />
      <span className="font-semibold">Lv.{xp?.level || 1}</span>
      <span className="text-xs opacity-75">{xp?.total?.toLocaleString() || 0} XP</span>
    </Badge>
  );
}
