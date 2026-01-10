"use client";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface StreakData {
  current: number;
  longest: number;
  shieldsAvailable: number;
  status: "active" | "at_risk" | "broken";
  lastActivityDate: string | null;
}

export interface XPData {
  total: number;
  weekly: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  levelTitle: string;
}

export interface DailySpinData {
  canSpin: boolean;
  totalSpins: number;
  lastSpinDate: string | null;
}

export interface WeeklyChallengeData {
  _id: string;
  title: string;
  description: string;
  targetCount: number;
  challengeType: string;
  xpReward: number;
  badgeReward?: string;
  startDate: string;
  endDate: string;
  userProgress: number;
  progressPercent: number;
  isCompleted: boolean;
  timeRemaining: string;
}

export interface SpinReward {
  _id: string;
  rewardType: string;
  rewardValue: number;
  rewardName: string;
  rewardDescription: string;
}

export interface GamificationData {
  streak: StreakData;
  xp: XPData;
  dailySpin: DailySpinData;
  weeklyChallenge: WeeklyChallengeData | null;
  badges: string[];
  stats: {
    totalActiveDays: number;
    totalActivitiesLogged: number;
  };
}

export interface LeaderboardEntry {
  studentId: string;
  name: string;
  avatar?: string;
  totalXP: number;
  level: number;
  currentStreak: number;
}

export function useGamification() {
  const getStats = () =>
    useApiQuery<{ success: boolean; data: GamificationData }>(
      ["gamification-stats"],
      {
        url: "/gamification/stats",
        method: "GET",
      }
    );

  const getLeaderboard = () =>
    useApiQuery<{ success: boolean; data: LeaderboardEntry[] }>(
      ["gamification-leaderboard"],
      {
        url: "/gamification/leaderboard",
        method: "GET",
      }
    );

  const performSpin = useApiMutation<
    { success: boolean; data: { success: boolean; reward?: SpinReward; message: string } },
    void
  >({
    url: "/gamification/spin",
    method: "POST",
  });

  const refillShields = useApiMutation<{ success: boolean; message: string }, void>({
    url: "/gamification/refill-shields",
    method: "POST",
  });

  return {
    getStats,
    getLeaderboard,
    performSpin,
    refillShields,
  };
}
