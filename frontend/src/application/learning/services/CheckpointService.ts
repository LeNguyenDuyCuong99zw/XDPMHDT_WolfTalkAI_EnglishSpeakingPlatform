
import type { CheckpointTest, CheckpointResult } from '../../../domain/learning/entities/CheckpointTest';
import { apiClient } from '../../../services/api';

class CheckpointService {

    async getTestForLevel(levelId: string): Promise<CheckpointTest | null> {
        try {
            const test = await apiClient.get<CheckpointTest>(`/learning/checkpoints/${levelId}`);
            return test;
        } catch (error) {
            console.error(`Failed to fetch checkpoint test for level ${levelId}:`, error);
            // Return null or throw depending on UI handling, returning null matches old behavior
            return null;
        }
    }

    async submitTest(testId: string, answers: any[]): Promise<CheckpointResult> {
        try {
            const payload = {
                testId,
                answers: answers.map(a => ({
                    questionId: a.questionId,
                    selectedOption: typeof a.selectedOption === 'number' ? a.selectedOption : parseInt(a.selectedOption)
                }))
            };
            const result = await apiClient.post<CheckpointResult>(`/learning/checkpoints/${testId}/submit`, payload);
            return result;
        } catch (error) {
            console.error("Failed to submit test", error);
            throw error;
        }
    }
}

export const checkpointService = new CheckpointService();
