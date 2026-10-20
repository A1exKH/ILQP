// ==========================================
// 1. QUESTION INTERFACE
// ==========================================
export interface Question {
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

// ==========================================
// 2. DECK INTERFACES
// ==========================================
export interface Deck {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  questions: Question[];
  createdAt: string; // ISO Date string from FastAPI
  updatedAt: string;
}

export interface DeckCreatePayload {
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  tags: string[];
  questions: Question[];
}

// ==========================================
// 3. QUIZ ATTEMPT & SUBMISSION INTERFACES
// ==========================================
export interface AttemptCreatePayload {
  deckId: string;
  userId?: string;
  answers: number[];
  completionTimeMs: number;
}

export interface AttemptResponse {
  id: string;
  deckId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completionTimeMs: number;
  createdAt: string;
}

// ==========================================
// 4. ANALYTICS & DASHBOARD INTERFACES
// ==========================================
export interface CategoryMasteryItem {
  category: string;
  quizzesTaken: number;
  averagePercentage: number;
}

export interface DashboardResponse {
  userId: string;
  totalQuizzesTaken: number;
  averageScore: number;
  totalTimeSpentSeconds: number;
  categoryMastery: CategoryMasteryItem[];
}