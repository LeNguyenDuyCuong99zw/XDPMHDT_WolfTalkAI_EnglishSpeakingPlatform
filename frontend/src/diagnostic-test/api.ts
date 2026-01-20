// API endpoints for diagnostic test
const API_BASE = "/api/diagnostic-test";

export const getDiagnosticTest = async (testId: string) => {
  const response = await fetch(`${API_BASE}/${testId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch diagnostic test");
  }
  return response.json();
};

export const submitDiagnosticTestAnswers = async (
  testId: string,
  answers: any,
) => {
  const response = await fetch(`${API_BASE}/${testId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });
  if (!response.ok) {
    throw new Error("Failed to submit diagnostic test answers");
  }
  return response.json();
};

export const getDiagnosticTestResult = async (testId: string) => {
  const response = await fetch(`${API_BASE}/${testId}/result`);
  if (!response.ok) {
    throw new Error("Failed to fetch diagnostic test result");
  }
  return response.json();
};
