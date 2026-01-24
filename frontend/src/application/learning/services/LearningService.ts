import type { ILearningRepository } from "../../../domain/learning/repositories/ILearningRepository";
import type { Topic, ScenarioDetail } from "../../../domain/learning/entities/LearningMaterial";
import type { Unit } from "../../../domain/learning/entities/Syllabus";
import type { QuizQuestion } from "../../../domain/learning/entities/PracticeMaterial";
import { apiClient } from "../../../services/api";

export class LearningService implements ILearningRepository {
    async getTopics(): Promise<Topic[]> {
        try {
            return await apiClient.get<Topic[]>('/learning/topics');
        } catch (e) {
            console.error("Failed to fetch topics", e);
            return [];
        }
    }

    async getScenariosByTopic(topicName: string): Promise<string[]> {
        try {
            return await apiClient.get<string[]>(`/learning/topics/${topicName}/scenarios`);
        } catch (e) {
            console.error(`Failed to fetch scenarios for topic ${topicName}`, e);
            return [];
        }
    }

    async getScenarioDetail(scenarioIdOrTitle: string, level: string = "A1"): Promise<ScenarioDetail> {
        try {
            // level is currently ignored by backend as it's handled by SyallbusUnit relationship, 
            // but we keep it for API compatibility
            const detail = await apiClient.get<ScenarioDetail>(`/learning/scenarios/${scenarioIdOrTitle}/detail`);

            // Add practice questions logic on the fly if not provided by backend
            if (detail.vocabulary && detail.vocabulary.length > 0 && !detail.practice) {
                detail.practice = {
                    scenarioId: scenarioIdOrTitle,
                    questions: detail.vocabulary.slice(0, 5).map((v, idx) => {
                        const wrongOptions = ["Incorrect 1", "Incorrect 2", "Incorrect 3"];
                        const options = [v.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
                        return {
                            id: `q_${idx}`,
                            type: 'multiple-choice',
                            question: `Choose the correct meaning for "${v.word}"`,
                            explanation: `"${v.word}" means "${v.meaning}".`,
                            options: options,
                            correctAnswer: v.meaning
                        } as QuizQuestion;
                    })
                };
            }
            return detail;
        } catch (e) {
            console.error(`Failed to fetch scenario detail for ${scenarioIdOrTitle}`, e);
            throw e;
        }
    }

    // Pathway mode method
    async getUnitContent(unit: Unit): Promise<ScenarioDetail> {
        // Reuse getScenarioDetail logic using unit ID
        return this.getScenarioDetail(unit.id);
    }
}

export const learningService = new LearningService();

