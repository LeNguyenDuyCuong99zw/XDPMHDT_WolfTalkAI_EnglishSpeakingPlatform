import { apiClient } from '../../../services/api';
import type { Level, Unit } from '../../../domain/learning/entities/Syllabus';

class SyllabusService {

    async getLevels(): Promise<Level[]> {
        try {
            const response = await apiClient.get<Level[]>('/learning/levels');
            return response; // response data comes directly if apiClient handles .data extraction
        } catch (error) {
            console.error('Failed to fetch levels:', error);
            return [];
        }
    }

    async getUnitsByLevel(levelId: string): Promise<Unit[]> {
        try {
            const response = await apiClient.get<Unit[]>(`/learning/levels/${levelId}/units`);
            return response;
        } catch (error) {
            console.error(`Failed to fetch units for level ${levelId}:`, error);
            return [];
        }
    }

    async unlockUnit(unitId: string): Promise<void> {
        try {
            await apiClient.post(`/learning/units/${unitId}/unlock`, {});
        } catch (error) {
            console.error(`Failed to unlock unit ${unitId}:`, error);
        }
    }

    async unlockLevel(levelId: string): Promise<void> {
        // Logic might be handled by backend automatically now, 
        // but if explicit unlock needed:
        // await apiClient.post(`/learning/levels/${levelId}/unlock`);
        // For now, backend calculates level status dynamically.
    }

    async completeUnit(unitId: string, score: number = 0): Promise<void> {
        try {
            await apiClient.post(`/learning/units/${unitId}/complete?score=${score}`, {});
        } catch (error) {
            console.error(`Failed to complete unit ${unitId}:`, error);
        }
    }
}

export const syllabusService = new SyllabusService();
