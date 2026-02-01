import axios, { AxiosInstance } from 'axios';
import {
  PronunciationAssessmentResponse,
  GrammarCheckResponse,
  VocabularySuggestionRequest,
  ConversationRequest,
  ConversationResponse,
  AIProvider,
} from '../types/aiLearning';

class AILearningService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:9000/api/v1/ai';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        // Try multiple token keys for compatibility
        const token = localStorage.getItem('accessToken') || 
                     localStorage.getItem('token') ||
                     localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error details for debugging
        console.error('AI Learning Service Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        if (error.response?.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          alert('Session expired. Please login again.');
          window.location.href = '/login';
        } else if (error.response?.status >= 500) {
          alert(`Server error: ${error.response?.data?.message || 'Unknown error'}`);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Assess pronunciation from audio file
   */
  async assessPronunciation(
    audioFile: File,
    expectedText: string,
    userId: number,
    provider: AIProvider = 'auto'
  ): Promise<PronunciationAssessmentResponse> {
    const formData = new FormData();
    formData.append('audioFile', audioFile);
    formData.append('expectedText', expectedText);
    formData.append('userId', userId.toString());

    const response = await this.api.post<PronunciationAssessmentResponse>(
      `/pronunciation/assess?provider=${provider}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Check grammar of text
   */
  async checkGrammar(
    text: string,
    userId: number,
    provider: AIProvider = 'auto'
  ): Promise<GrammarCheckResponse> {
    const response = await this.api.post<GrammarCheckResponse>(
      `/grammar/check?provider=${provider}`,
      { text, userId }
    );

    return response.data;
  }

  /**
   * Get vocabulary suggestions based on context
   */
  async suggestVocabulary(
    request: VocabularySuggestionRequest,
    provider: AIProvider = 'auto'
  ): Promise<string[]> {
    const response = await this.api.post<string[]>(
      `/vocabulary/suggest?provider=${provider}`,
      request
    );

    return response.data;
  }

  /**
   * Generate AI conversation response
   */
  async generateConversation(
    request: ConversationRequest,
    provider: AIProvider = 'auto'
  ): Promise<ConversationResponse> {
    const response = await this.api.post<ConversationResponse>(
      `/conversation/generate?provider=${provider}`,
      request
    );

    return response.data;
  }

  /**
   * Analyze writing (essay/email/article)
   */
  async analyzeWriting(
    text: string,
    type: string,
    topic: string,
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const response = await this.api.post(
      `/writing/analyze?provider=${provider}`,
      { text, type, topic }
    );
    return response.data;
  }

  /**
   * Generate writing prompt
   */
  async generateWritingPrompt(
    type: string,
    topic?: string,
    level: string = 'intermediate',
    provider: AIProvider = 'auto'
  ): Promise<string> {
    const params = new URLSearchParams({ type, level, provider });
    if (topic) params.append('topic', topic);
    
    const response = await this.api.post(`/writing/generate-prompt?${params.toString()}`);
    return response.data;
  }

  /**
   * Generate reading comprehension passage
   */
  async generateReadingPassage(
    topic?: string,
    level: string = 'intermediate',
    length: string = 'medium',
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const params = new URLSearchParams({ level, length, provider });
    if (topic) params.append('topic', topic);
    
    const response = await this.api.post(`/reading/generate?${params.toString()}`);
    return response.data;
  }

  /**
   * Generate grammar exercises
   */
  async generateGrammarExercises(
    topic: string,
    level: string = 'intermediate',
    count: number = 10,
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const params = new URLSearchParams({ topic, level, count: count.toString(), provider });
    const response = await this.api.post(`/exercises/generate?${params.toString()}`);
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await axios.get('http://localhost:9000/actuator/health');
    return response.data;
  }
}

export default new AILearningService();
