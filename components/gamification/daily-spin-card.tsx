"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification, SpinReward } from "@/api/gamification";
import { Gift, Sparkles, Crown, Shield, Zap, Trophy, Star, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const rewardIcons: Record<string, any> = {
  xp: Zap,
  streak_shield: Shield,
  badge: Star,
  double_xp: Sparkles,
  mentor_token: MessageCircle,
  premium_resource: Crown,
};

const rewardColors: Record<string, string> = {
  xp: "text-yellow-500",
  streak_shield: "text-blue-500",
  badge: "text-purple-500",
  double_xp: "text-green-500",
  mentor_token: "text-pink-500",
  premium_resource: "text-orange-500",
};

export function DailySpinCard() {
  const { getStats, performSpin } = useGamification();
  const { data, isLoading } = getStats();
  const dailySpin = data?.dailySpin;
  const queryClient = useQueryClient();

  const [isSpinning, setIsSpinning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<SpinReward | null>(null);

  // Check for active rewards
  const hasActiveRewards = dailySpin?.hasDoubleXp || dailySpin?.hasPremiumAccess;
  const doubleXpTimeLeft = dailySpin?.doubleXpUntil
    ? Math.max(0, new Date(dailySpin.doubleXpUntil).getTime() - Date.now())
    : 0;

  const handleSpin = async () => {
    if (!dailySpin?.canSpin || isSpinning) return;

    setIsSpinning(true);
    setShowReward(false);

    try {
      const result = await performSpin.mutateAsync();

      if (result.data.success && result.data.reward) {
        setReward(result.data.reward);
        setTimeout(() => {
          setShowReward(true);
          setIsSpinning(false);
          toast.success(result.data.message);
          queryClient.invalidateQueries({ queryKey: ["gamification-stats"] });
        }, 2000);
      } else {
        setIsSpinning(false);
        toast.error(result.data.message);
      }
    } catch (error) {
      setIsSpinning(false);
      toast.error("Unable to claim reward right now. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const RewardIcon = reward ? rewardIcons[reward.rewardType] || Gift : Gift;
  const rewardColor = reward ? rewardColors[reward.rewardType] || "text-yellow-500" : "text-yellow-500";

  return (
    <Card className="border-2 border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            Daily Reward
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {dailySpin?.totalSpins || 0} spins total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className={cn(
              "relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full",
              "bg-linear-to-br from-purple-500/20 to-pink-500/20",
              "border-4 border-purple-500/30",
              isSpinning && "animate-spin"
            )}
          >
            {showReward && reward ? (
              <div className="flex flex-col items-center animate-bounce">
                <RewardIcon className={cn("h-8 w-8", rewardColor)} />
                {reward.rewardType === "xp" && (
                  <span className={cn("text-lg font-bold", rewardColor)}>
                    +{reward.rewardValue}
                  </span>
                )}
              </div>
            ) : (
              <Sparkles
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10 text-purple-500",
                  isSpinning && "animate-pulse"
                )}
              />
            )}
          </div>

          {showReward && reward ? (
            <div className="text-center animate-fade-in">
              <p className="font-semibold text-lg">{reward.rewardName}!</p>
              <p className="text-sm text-muted-foreground">
                {reward.rewardDescription}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleSpin}
              disabled={!dailySpin?.canSpin || isSpinning}
              className={cn(
                "bg-linear-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                "text-white font-semibold px-8",
                !dailySpin?.canSpin && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Spinning...
                </span>
              ) : dailySpin?.canSpin ? (
                <span className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Spin Now!
                </span>
              ) : (
                "Come back tomorrow!"
              )}
            </Button>
          )}

          {/* Active Rewards Display */}
          {hasActiveRewards && (
            <div className="mt-4 space-y-2">
              {dailySpin?.hasDoubleXp && (
                <div className="flex items-center gap-2 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                  <Zap className="h-3 w-3" />
                  <span>
                    2x XP Active
                    {doubleXpTimeLeft > 0 && (
                      <span className="ml-1">
                        ({Math.floor(doubleXpTimeLeft / (1000 * 60 * 60))}h left)
                      </span>
                    )}
                  </span>
                </div>
              )}
              {dailySpin?.hasPremiumAccess && (
                <div className="flex items-center gap-2 text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">
                  <Crown className="h-3 w-3" />
                  <span>Premium Access ({dailySpin.premiumDays} {dailySpin.premiumDays === 1 ? 'day' : 'days'})</span>
                </div>
              )}
            </div>
          )}

          {/* Token & Premium Days Display */}
          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1" title="Mentor Chat Tokens">
              <MessageCircle className="h-3 w-3" />
              <span>{dailySpin?.mentorTokens || 0} {dailySpin?.mentorTokens === 1 ? 'token' : 'tokens'}</span>
            </div>
            <div className="flex items-center gap-1" title="Premium Access Days">
              <Crown className="h-3 w-3" />
              <span>{dailySpin?.premiumDays || 0} {dailySpin?.premiumDays === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
