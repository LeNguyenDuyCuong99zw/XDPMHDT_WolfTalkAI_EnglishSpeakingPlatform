// AI Learning API Types

export interface PronunciationAssessmentRequest {
  audioFile: File;
  expectedText: string;
  userId: number;
}

export interface WordFeedback {
  word: string;
  expectedWord: string;
  isCorrect: boolean;
  suggestion: string;
}

export interface PronunciationAssessmentResponse {
  id: number;
  userId: number;
  transcript: string;
  expectedText: string;
  accuracyScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  overallScore: number;
  suggestions: string[];
  generalFeedback: string;
  wordFeedback: WordFeedback[];
  assessmentDate: string;
}

export interface GrammarError {
  type: string;
  position: number;
  length: number;
  original: string;
  correction: string;
  explanation: string;
}

export interface GrammarCheckRequest {
  text: string;
  userId: number;
}

export interface GrammarCheckResponse {
  id: number;
  userId: number;
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  suggestions: string[];
  overallFeedback: string;
  similarityScore: number;
  checkDate: string;
}

export interface VocabularySuggestionRequest {
  context: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

export interface ConversationRequest {
  message: string;
  context?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ConversationResponse {
  response: string;
  suggestions: string;
  provider: string;
}

export type AIProvider = 'gemini' | 'auto';

export interface AIServiceConfig {
  provider?: AIProvider;
}
