
export enum AppStage {
  INTRO = 'INTRO',
  PROFILE = 'PROFILE',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  LOADING_QUIZ = 'LOADING_QUIZ',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export type Language = 'en' | 'ko' | 'ja' | 'es' | 'fr' | 'zh';

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export enum Tier {
  UNRANKED = "UNRANKED",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  DIAMOND = "DIAMOND",
  MASTER = "MASTER"
}

export interface HistoryItem {
  timestamp: number;
  topicId: string;
  score: number;
  aiScore: number;
  difficulty: Difficulty;
}

export interface UserProfile {
  gender: string;
  ageGroup: string;
  nationality: string;
  scores?: Record<string, number>; // Topic Name -> High Score
  
  // --- New Adaptive Learning Fields ---
  eloRatings?: Record<string, number>; // Topic ID -> Elo Score (Default: 1000)
  seenQuestionIds?: number[]; // List of IDs already answered to prevent duplicates
  history?: HistoryItem[]; // Chronological list of past performance
  traits?: {
    avgResponseTime?: number; // Seconds
    impulsiveness?: number; // 0-100
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  context?: string; 
}

export interface QuizSet {
  topic: string;
  categoryId?: string; // Added to track parent category for iconography
  questions: QuizQuestion[];
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  context?: string; // Added for offline analysis capability
}

export interface EvaluationItem {
  questionId: number;
  isCorrect: boolean;
  aiComment: string;
  correctFact: string;
  // Added fields for UI display
  questionText?: string;
  selectedOption?: string;
  correctAnswer?: string;
}

export interface EvaluationResult {
  id?: string; // Topic ID for iconography
  totalScore: number;
  humanPercentile: number;
  aiComparison: string;
  demographicPercentile: number;
  demographicComment: string;
  details: EvaluationItem[];
  title: string;
}

export const TOPIC_IDS = {
  HISTORY: "History",
  SCIENCE: "Science",
  ARTS: "Arts",
  GENERAL: "General",
  GEOGRAPHY: "Geography",
  MOVIES: "Movies",
  MUSIC: "Music",
  GAMING: "Gaming",
  SPORTS: "Sports",
  TECH: "Tech",
  MYTHOLOGY: "Mythology",
  LITERATURE: "Literature",
  NATURE: "Nature",
  FOOD: "Food",
  SPACE: "Space",
  PHILOSOPHY: "Philosophy"
};