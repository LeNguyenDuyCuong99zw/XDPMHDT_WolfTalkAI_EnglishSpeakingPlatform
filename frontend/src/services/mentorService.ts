// src/services/mentorService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface MentorLearner {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  subscription: {
    id: number;
    packageName: string;
    packageCode: string;
    startDate: string; // ISO String from backend
    endDate: string;   // ISO String from backend
    mentorHoursTotal: number;
    mentorHoursUsed: number;
    status: string;
  };
  assignedTests: number;
  completedTests: number;
  lastActivity: string | null;
}

export interface MentorStats {
  totalLearners: number;
  professionalCount: number;
  premiumCount: number;
}

/**
 * Lấy danh sách learners được gán cho mentor
 * @param packageFilter - "PROFESSIONAL", "PREMIUM", hoặc "ALL"
 */
// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Lấy danh sách learners được gán cho mentor
 * @param packageFilter - "PROFESSIONAL", "PREMIUM", hoặc "ALL"
 */
export const getMentorLearners = async (packageFilter: string = 'ALL'): Promise<MentorLearner[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mentor/learners`, {
      params: { packageFilter },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor learners:', error);
    throw error;
  }
};

/**
 * Lấy thống kê tổng quan cho mentor
 */
export const getMentorStats = async (): Promise<MentorStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mentor/stats`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết learner cụ thể
 */
export const getLearnerDetails = async (learnerId: number): Promise<MentorLearner> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mentor/learners/${learnerId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching learner details:', error);
    throw error;
  }
};
