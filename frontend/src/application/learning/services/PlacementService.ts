import type { PlacementQuestion, TestResult } from '../../../domain/learning/entities/PlacementTest';

import { apiClient } from '../../../services/api';

class PlacementService {
    private currentTestId: number | null = null;
    private currentQuestions: PlacementQuestion[] = [];

    async getQuestions(): Promise<PlacementQuestion[]> {
        try {
            // 1. Start Test session
            const startRes = await apiClient.post<any>('/placement-test/start', {});
            this.currentTestId = startRes.id;
        } catch (e) {
            console.error("Failed to start placement test", e);
            throw e;
        }

        try {
            // 2. Fetch Questions
            const dtos = await apiClient.get<any[]>(`/placement-test/${this.currentTestId}/questions`);

            // 3. Map to Frontend Entity
            this.currentQuestions = dtos.map(dto => ({
                id: dto.id.toString(),
                text: dto.questionText,
                type: 'multiple-choice',
                options: dto.options.map((o: any) => o.optionText),
                level: 'A1', // Backend doesn't explicitly return level in DTO list
                correctOption: -1 // Hidden from frontend
            }));

            return this.currentQuestions;
        } catch (e) {
            console.error("Failed to fetch questions", e);
            return [];
        }
    }

    calculateResult(answers: { questionId: string; selectedOption: number }[]): TestResult {
        // This is called by view synchronously, but we need async submit.
        // We will modify the View to handle async, or cheat slightly by returning a Promise-like object?
        // No, the View expects TestResult immediately. 
        // But I can't do synchronous API calls.
        // I MUST refactor the View to await the result. 
        // For now, I will throw an error or handle it.
        // Actually, I'll update the View. Ideally I would remove this method.
        throw new Error("Use submitTest async method instead");
    }

    async submitTest(answers: { questionId: string; selectedOption: number }[]): Promise<TestResult> {
        if (!this.currentTestId) throw new Error("No active test session");

        let correctCount = 0;

        // Submit answers individually
        for (const ans of answers) {
            const question = this.currentQuestions.find(q => q.id === ans.questionId);
            if (!question) continue;

            const selectedText = question.options[ans.selectedOption];

            try {
                const res = await apiClient.post<any>('/placement-test/submit-answer', {
                    testId: this.currentTestId,
                    questionId: parseInt(ans.questionId),
                    userAnswer: selectedText,
                    timeSpentSeconds: 5 // Mock time
                });
                if (res.isCorrect) correctCount++;
            } catch (e) {
                console.error(`Failed to submit answer for q=${ans.questionId}`, e);
            }
        }

        // Get Final Level
        let recommendedLevel = 'A1';
        try {
            const finalRes = await apiClient.get<any>(`/placement-test/${this.currentTestId}/final-level`);
            recommendedLevel = this.mapLevel(finalRes.finalLevel);
        } catch (e) {
            console.error("Failed to get final level", e);
        }

        return {
            score: this.currentQuestions.length > 0 ? (correctCount / this.currentQuestions.length) * 100 : 0,
            totalQuestions: this.currentQuestions.length,
            correctCount,
            recommendedLevel,
            details: []
        };
    }

    private mapLevel(l: string): string {
        const map: { [key: string]: string } = {
            'beginner': 'A1',
            'elementary': 'A2',
            'intermediate': 'B1',
            'advanced': 'B2',
            'expert': 'C1'
        };
        return map[l.toLowerCase()] || 'A1';
    }
}

export const placementService = new PlacementService();
