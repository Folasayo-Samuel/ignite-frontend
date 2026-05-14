"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Flame } from "lucide-react";
import { useGamification, ForumLeaderboardEntry } from "@/apis/gamification";
import { getUserInitials } from "@/utils/getUserInitials";
import { cn } from "@/lib/utils";

type LeaderboardType = "mentors" | "helpers";

export function ForumLeaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("mentors");
  const { getForumMentorLeaderboard, getForumHelperLeaderboard } = useGamification();
  
  const { data: mentorsResult, isLoading: mentorsLoading } = getForumMentorLeaderboard();
  const { data: helpersResult, isLoading: helpersLoading } = getForumHelperLeaderboard();

  // API function auto-unwraps { success, data }
  const mentorsData = mentorsResult || { weekly: [], monthly: [], allTime: [] };
  const helpersData = helpersResult || { weekly: [], monthly: [], allTime: [] };

  const isLoading = activeTab === "mentors" ? mentorsLoading : helpersLoading;
  const currentData = activeTab === "mentors" ? mentorsData : helpersData;

  const renderRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400 fill-gray-400/20" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600 fill-amber-600/20" />;
      default:
        return <span className="text-sm font-semibold text-muted-foreground w-5 text-center">{index + 1}</span>;
    }
  };

  const renderList = (items: ForumLeaderboardEntry[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Flame className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm">No activity yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-center w-6">
              {renderRankIcon(index)}
            </div>
            
            <Avatar className={cn(
              "h-8 w-8",
              index === 0 && "ring-2 ring-yellow-500 ring-offset-2 ring-offset-background",
              index === 1 && "ring-2 ring-gray-400 ring-offset-2 ring-offset-background",
              index === 2 && "ring-2 ring-amber-600 ring-offset-2 ring-offset-background"
            )}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
            </div>
            
            <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {user.score}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-2 h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Top Contributors
          </CardTitle>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="mentors" onValueChange={(v) => setActiveTab(v as LeaderboardType)} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="helpers">Learners</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="flex-1 pt-4 pb-4 px-2">
          {isLoading ? (
            <div className="space-y-4 px-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-full flex-1" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="mentors" className="m-0 h-full">
                <Tabs defaultValue="weekly" className="h-full flex flex-col">
                  <div className="px-2 mb-3">
                    <TabsList className="h-8 w-full grid grid-cols-3 bg-transparent p-0 gap-1">
                      <TabsTrigger value="weekly" className="text-xs h-7 data-[state=active]:bg-muted">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs h-7 data-[state=active]:bg-muted">Monthly</TabsTrigger>
                      <TabsTrigger value="allTime" className="text-xs h-7 data-[state=active]:bg-muted">All Time</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="weekly" className="m-0 px-2">{renderList(currentData?.weekly)}</TabsContent>
                  <TabsContent value="monthly" className="m-0 px-2">{renderList(currentData?.monthly)}</TabsContent>
                  <TabsContent value="allTime" className="m-0 px-2">{renderList(currentData?.allTime)}</TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="helpers" className="m-0 h-full">
                <Tabs defaultValue="weekly" className="h-full flex flex-col">
                  <div className="px-2 mb-3">
                    <TabsList className="h-8 w-full grid grid-cols-3 bg-transparent p-0 gap-1">
                      <TabsTrigger value="weekly" className="text-xs h-7 data-[state=active]:bg-muted">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs h-7 data-[state=active]:bg-muted">Monthly</TabsTrigger>
                      <TabsTrigger value="allTime" className="text-xs h-7 data-[state=active]:bg-muted">All Time</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="weekly" className="m-0 px-2">{renderList(currentData?.weekly)}</TabsContent>
                  <TabsContent value="monthly" className="m-0 px-2">{renderList(currentData?.monthly)}</TabsContent>
                  <TabsContent value="allTime" className="m-0 px-2">{renderList(currentData?.allTime)}</TabsContent>
                </Tabs>
              </TabsContent>
            </>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}
