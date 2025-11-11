import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export const ProgressCardLoader = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-muted/30 p-4"
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};
