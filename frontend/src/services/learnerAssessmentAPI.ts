
const ASSESSMENT_API_URL = "http://localhost:8085/api";

export interface Assessment {
  id: number;
  title: string;
  description: string;
  level: string;
  durationMinutes: number;
  passingScore: number;
  questionCount?: number;
}

export interface AssessmentQuestion {
  id: number;
  section: string;
  questionType: string;
  questionText: string;
  readingPassage?: string;
  options?: AssessmentOption[];
}

export interface AssessmentOption {
  id: number;
  optionText: string;
}

export interface LearnerAssessmentAssignment {
  assignmentId: number;
  assessmentId: number;
  title: string;
  description: string;
  level: string;
  durationMinutes: number;
  totalQuestions: number;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  assignedAt: string;
  dueDate?: string;
  attemptId?: number;
}

export interface SubmissionDTO {
  attemptId: number;
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  assessmentId: number;
  assessmentTitle: string;
  status: string;
  submittedAt: string;
  timeSpentMinutes: number;
  totalAnswered: number;
  totalQuestions: number;
}

export interface SubmissionDetailDTO {
  attemptId: number;
  learner: {
    id: number;
    name: string;
    email: string;
  };
  assessment: {
    id: number;
    title: string;
    level: string;
  };
  submittedAt: string;
  timeSpentMinutes: number;
  answers: AnswerDetail[];
}

export interface AnswerDetail {
  answerId: number;
  questionId: number;
  questionText: string;
  section: string;
  questionType: string;
  answerText?: string;
  videoUrl?: string;
  audioUrl?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
}

export interface GradeSubmissionRequest {
  answers: {
    answerId: number;
    score: number;
    feedback: string;
  }[];
  totalScore: number;
  levelResult: string;
}

export interface AssessmentResultDTO {
  attemptId: number;
  assessmentTitle: string;
  status: string;
  submittedAt: string;
  timeSpentMinutes: number;
  totalScore: number;
  levelResult: string;
  breakdown: Record<string, { score: number; maxScore: number; feedback: string }>;
  overallFeedback: string;
}

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  // For development testing without auth
  const userId = localStorage.getItem("userId");
  if (userId) headers["X-User-Id"] = userId;
  
  return headers;
};

export const learnerAssessmentAPI = {
  // Public/Shared
  getAllAssessments: async (): Promise<Assessment[]> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/assessments`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch assessments");
    return response.json();
  },

  getAssessmentById: async (id: number): Promise<Assessment & { questions: AssessmentQuestion[] }> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/assessments/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch assessment details");
    return response.json();
  },

  // Mentor APIs
  assignAssessment: async (assessmentId: number, learnerIds: number[], dueDate?: string) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/mentor/assessments/assign`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ assessmentId, learnerIds, dueDate }),
    });
    if (!response.ok) throw new Error("Failed to assign assessment");
    return response.json();
  },

  getSubmissions: async (status: string = "ALL"): Promise<SubmissionDTO[]> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/mentor/assessments/submissions?status=${status}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch submissions");
    return response.json();
  },

  getSubmissionDetail: async (attemptId: number): Promise<SubmissionDetailDTO> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/mentor/assessments/submissions/${attemptId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch submission detail");
    return response.json();
  },

  gradeSubmission: async (attemptId: number, data: GradeSubmissionRequest) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/mentor/assessments/submissions/${attemptId}/grade`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to grade submission");
    return response.text(); // Returns string message
  },

  // Learner APIs
  getLearnerAssessments: async (): Promise<LearnerAssessmentAssignment[]> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch assignments");
    return response.json();
  },

  startAssessment: async (assessmentId: number) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/${assessmentId}/start`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to start assessment");
    return response.json();
  },

  getAssessmentQuestions: async (assessmentId: number) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/${assessmentId}/questions`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },

  saveAnswer: async (attemptId: number, questionId: number, answerText: string) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/attempts/${attemptId}/answer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ questionId, answerText }),
    });
    if (!response.ok) throw new Error("Failed to save answer");
    return response.text();
  },

  uploadFile: async (attemptId: number, questionId: number, file: File, fileType: 'video' | 'audio') => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionId", questionId.toString());
    formData.append("fileType", fileType);

    // Don't include Content-Type header manually for FormData, fetch does it automatically with boundary
    const headers = getHeaders();
    delete headers["Content-Type"];

    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/attempts/${attemptId}/upload`, {
      method: "POST",
      headers: headers,
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload file");
    return response.json();
  },

  submitAssessment: async (attemptId: number) => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to submit assessment");
    return response.json();
  },

  getResult: async (attemptId: number): Promise<AssessmentResultDTO> => {
    const response = await fetch(`${ASSESSMENT_API_URL}/learner/assessments/attempts/${attemptId}/result`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch results");
    return response.json();
  },
};
