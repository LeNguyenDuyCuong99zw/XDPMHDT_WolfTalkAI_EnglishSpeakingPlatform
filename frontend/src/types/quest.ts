/**
 * Quest Types - Match backend entities
 * Duolingo-style Quest/Mission system types
 */

// Quest types that match backend QuestType enum
export type QuestType =
  | "EARN_XP"
  | "COMPLETE_LESSONS"
  | "COMBO_XP"
  | "STREAK_DAYS"
  | "PERFECT_LESSONS"
  | "CHALLENGE_TYPE"
  | "TIME_SPENT";

// Quest status
export type QuestStatus = "IN_PROGRESS" | "COMPLETED" | "EXPIRED" | "CLAIMED";

// Challenge types from backend
export type ChallengeType =
  | "LISTENING"
  | "SPEAKING"
  | "READING"
  | "WRITING"
  | "VOCABULARY"
  | "GRAMMAR";

// Daily Quest interface - matches DailyQuestDTO
export interface DailyQuest {
  id: number;
  title: string;
  description: string;
  type: QuestType;
  targetValue: number;
  xpReward: number;
  gemsReward: number;
  iconUrl?: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  challengeType?: ChallengeType;
  isActive: boolean;
}

// Monthly Challenge interface - matches MonthlyChallengeDTO
export interface MonthlyChallenge {
  id: number;
  title: string;
  description: string;
  type: QuestType;
  targetValue: number;
  xpReward: number;
  gemsReward: number;
  badgeTitle: string;
  badgeIconUrl?: string;
  month: number;
  year: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

// User quest progress - matches DailyQuestProgressDTO
export interface UserQuestProgress {
  id: number;
  quest?: DailyQuest;
  questId?: number;
  questTitle?: string;
  questDescription?: string;
  questType?: QuestType;
  tier?: string;
  targetValue?: number;
  xpReward?: number;
  gemsReward?: number;
  monthlyChallenge?: MonthlyChallenge;
  currentValue: number;
  status: QuestStatus;
  completedAt?: string;
  claimedAt?: string;
  progress: number; // percentage 0-100
  isDaily?: boolean;
}

// Monthly Challenge Progress - matches MonthlyChallengeProgressDTO
export interface MonthlyChallengeProgress {
  id: number;
  challengeId: number;
  progressId?: number;
  // Challenge info - mapped from backend
  title: string;
  description: string;
  challengeTitle?: string; // alias
  challengeDescription?: string; // alias
  challengeType?: QuestType;
  monthNameVi?: string;
  monthNameEn?: string;
  year?: number;
  month?: number;
  // Progress info
  completedQuests: number;
  totalQuestsRequired: number;
  targetValue?: number; // alias
  currentValue?: number; // alias
  progressPercentage: number;
  progress?: number; // alias
  status: QuestStatus;
  // Badge info
  badgeName: string;
  badgeIcon?: string;
  badgeImageUrl?: string;
  badgeTitle?: string; // alias
  badgeIconUrl?: string; // alias
  // Reward info
  xpReward: number;
  gemsReward: number;
  rewardClaimed?: boolean;
  // Time info
  startDate: string;
  endDate: string;
  remainingDays: number;
  daysRemaining?: number; // alias
}

// Full quest dashboard data - matches QuestDashboardDTO from backend
export interface QuestDashboardData {
  dailyQuests: UserQuestProgress[];
  dailyQuestsCompleted: number;
  dailyQuestsTotal: number;
  remainingTimeHours: number;
  monthlyChallenge?: MonthlyChallengeProgress;
  currentStreak: number;
  longestStreak: number;
  totalXpToday: number;
  totalXpThisWeek: number;
  totalQuestsCompletedAllTime: number;
  unclaimedRewardsCount: number;
  pendingXpReward: number;
  pendingGemsReward: number;
}

// Claim reward response - matches ClaimRewardResponse from backend
export interface ClaimRewardResponse {
  success: boolean;
  message: string;
  xpEarned: number;
  gemsEarned: number;
  newTotalXp: number;
  newStreak: number;
}

// Leaderboard types - updated to match new backend
export interface LeaderboardEntry {
  rank: number;
  userId: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  tierEmoji: string;
  league?: string;
  weekStart: string;
  weekEnd: string;
}

// User stats for leaderboard
export interface UserLeaderboardStats {
  userId: number;
  firstName: string;
  lastName: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  tier: string;
  league?: string;
  rank: number;
}

// Helper function to get quest icon based on type
export function getQuestIcon(type: QuestType): string {
  const icons: Record<QuestType, string> = {
    EARN_XP: "⭐",
    COMPLETE_LESSONS: "📚",
    COMBO_XP: "🔥",
    STREAK_DAYS: "🔥",
    PERFECT_LESSONS: "💯",
    CHALLENGE_TYPE: "🎯",
    TIME_SPENT: "⏰",
  };
  return icons[type] || "📋";
}

// Helper function to get challenge type icon
export function getChallengeIcon(type: ChallengeType): string {
  const icons: Record<ChallengeType, string> = {
    LISTENING: "🎧",
    SPEAKING: "🎤",
    READING: "📖",
    WRITING: "✍️",
    VOCABULARY: "📚",
    GRAMMAR: "📝",
  };
  return icons[type] || "📋";
}

// Helper function to get tier color
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    BRONZE: "#CD7F32",
    SILVER: "#C0C0C0",
    GOLD: "#FFD700",
    DIAMOND: "#B9F2FF",
  };
  return colors[tier] || "#999";
}

// Helper function to get tier emoji
export function getTierEmoji(tier: string): string {
  const emojis: Record<string, string> = {
    BRONZE: "🥉",
    SILVER: "🥈",
    GOLD: "🥇",
    DIAMOND: "💎",
  };
  return emojis[tier] || "🏅";
}

// Helper to format status for display
export function getStatusDisplay(status: QuestStatus): {
  text: string;
  color: string;
} {
  const displays: Record<QuestStatus, { text: string; color: string }> = {
    IN_PROGRESS: { text: "Đang làm", color: "#2196F3" },
    COMPLETED: { text: "Hoàn thành", color: "#4CAF50" },
    EXPIRED: { text: "Hết hạn", color: "#9E9E9E" },
    CLAIMED: { text: "Đã nhận", color: "#9C27B0" },
  };
  return displays[status] || { text: status, color: "#999" };
}
