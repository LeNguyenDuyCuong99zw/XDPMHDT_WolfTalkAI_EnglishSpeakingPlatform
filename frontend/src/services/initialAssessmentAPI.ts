import { apiClient } from "./api";

export type InitialAssessmentQuestion = {
  id: number;
  questionType: "LISTENING" | "SPEAKING" | "WRITING" | "READING";
  answerFormat: "MULTIPLE_CHOICE" | "SPEAKING_RECORD";
  questionText: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: string[];
  difficulty: number;
  skillType: string;
  explanation?: string;
};

export type InitialAssessmentDTO = {
  id: number;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  assessmentLevel: string;
  listeningScore: number;
  speakingScore: number;
  writingScore: number;
  readingScore: number;
  recommendation: string;
  strengths: string;
  weaknesses: string;
  createdAt: string;
  completedAt?: string;
  status: "ACTIVE" | "COMPLETED";
};

export type InitialAssessmentAnswerRequest = {
  assessmentId: number;
  questionId: number;
  answer: string;
  audioUrl?: string;
};

export type LevelRecommendationDTO = {
  level: string;
  score: number;
  recommendation: string;
  strengths: string;
  weaknesses: string;
  nextSteps: string;
};

export const initialAssessmentAPI = {
  // Start a new test
  async startTest(): Promise<InitialAssessmentDTO> {
    return apiClient.post<InitialAssessmentDTO>(
      "/initial-assessment/start",
      {},
    );
  },

  // Get 20 random questions
  async getQuestions(
    assessmentId: number,
  ): Promise<InitialAssessmentQuestion[]> {
    return apiClient.get<InitialAssessmentQuestion[]>(
      `/initial-assessment/${assessmentId}/questions`,
    );
  },

  // Submit an answer
  async submitAnswer(request: InitialAssessmentAnswerRequest): Promise<void> {
    return apiClient.post<void>("/initial-assessment/answer", request);
  },

  // Complete the test and get results
  async completeTest(assessmentId: number): Promise<InitialAssessmentDTO> {
    return apiClient.post<InitialAssessmentDTO>(
      `/initial-assessment/${assessmentId}/complete`,
      {},
    );
  },

  // Get current test
  async getCurrentTest(): Promise<InitialAssessmentDTO> {
    return apiClient.get<InitialAssessmentDTO>("/initial-assessment/current");
  },

  // Check if user has completed test
  async hasCompletedTest(): Promise<{ hasCompleted: boolean }> {
    return apiClient.get<{ hasCompleted: boolean }>(
      "/initial-assessment/has-completed",
    );
  },
};
