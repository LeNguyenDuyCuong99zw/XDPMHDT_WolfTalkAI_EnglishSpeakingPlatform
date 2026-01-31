/**
 * Quest API Service
 * API functions for daily quests and monthly challenges
 */

import { apiClient } from "./api";
import {
  QuestDashboardData,
  UserQuestProgress,
  ClaimRewardResponse,
} from "../types/quest";

/**
 * Get full quest dashboard data including daily quests and monthly challenge
 */
export async function getQuestDashboard(): Promise<QuestDashboardData> {
  return apiClient.get<QuestDashboardData>("/quests/dashboard");
}

/**
 * Get daily quests only
 */
export async function getDailyQuests(): Promise<UserQuestProgress[]> {
  return apiClient.get<UserQuestProgress[]>("/quests/daily");
}

/**
 * Get current monthly challenge
 */
export async function getMonthlyChallenge(): Promise<UserQuestProgress | null> {
  return apiClient.get<UserQuestProgress | null>("/quests/monthly");
}

/**
 * Claim reward for a completed quest
 */
export async function claimQuestReward(
  progressId: number,
): Promise<ClaimRewardResponse> {
  return apiClient.post<ClaimRewardResponse>("/quests/claim", { progressId });
}

/**
 * Claim all available rewards
 */
export async function claimAllQuestRewards(): Promise<ClaimRewardResponse> {
  return apiClient.post<ClaimRewardResponse>("/quests/claim-all", {});
}

/**
 * Update quest progress (called automatically by backend, but available for manual updates)
 */
export async function updateQuestProgress(
  questType: string,
  value: number,
  challengeType?: string,
): Promise<void> {
  return apiClient.post("/quests/progress", {
    questType,
    value,
    challengeType,
  });
}
