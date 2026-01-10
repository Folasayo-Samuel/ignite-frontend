"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/api/gamification";
import { Flame, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakCard() {
  const { getStats } = useGamification();
  const { data, isLoading } = getStats();
  const streak = data?.data?.streak;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    active: {
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: Flame,
      message: "You're on fire! Keep it up!",
    },
    at_risk: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      icon: AlertTriangle,
      message: "Log activity today to keep your streak!",
    },
    broken: {
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      icon: Flame,
      message: "Start a new streak today!",
    },
  };

  const status = streak?.status || "broken";
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn("border-2", config.borderColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className={cn("h-5 w-5", config.color)} />
            Learning Streak
          </CardTitle>
          {(streak?.shieldsAvailable || 0) > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {streak?.shieldsAvailable} shield{streak?.shieldsAvailable !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center h-16 w-16 rounded-full",
              config.bgColor
            )}
          >
            <div className="text-center">
              <span className={cn("text-2xl font-bold", config.color)}>
                {streak?.current || 0}
              </span>
              <StatusIcon
                className={cn(
                  "h-4 w-4 mx-auto -mt-1",
                  config.color,
                  status === "active" && "animate-pulse"
                )}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{config.message}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Best: {streak?.longest || 0} days
              </div>
              {status === "active" && (streak?.current || 0) >= 7 && (
                <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20 whitespace-nowrap">
                  🔥 Week Warrior
                </Badge>
              )}
              {status === "active" && (streak?.current || 0) >= 30 && (
                <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20 whitespace-nowrap">
                  🏆 Month Master
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
