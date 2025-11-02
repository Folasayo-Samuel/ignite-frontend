"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AchievementsCardSkeleton() {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Title */}
            <Skeleton className="h-3 w-48" /> {/* Description */}
          </div>
          <Skeleton className="h-6 w-12 rounded-md" /> {/* Badge */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-lg border-2 bg-muted/50"
          >
            <Skeleton className="h-8 w-8 rounded-lg" /> {/* Icon */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" /> {/* Title */}
              <Skeleton className="h-3 w-56" /> {/* Description */}
              <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
