export interface DiagnosticQuestion {
  id: string;
  type: "multiple-choice" | "essay" | "speaking";
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface DiagnosticTestResult {
  testId: string;
  score: number;
  level:
    | "beginner"
    | "elementary"
    | "intermediate"
    | "upper-intermediate"
    | "advanced";
  completedAt: Date;
}
