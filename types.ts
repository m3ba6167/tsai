export enum ToolType {
  MATH = 'MATH SOLVER',
  FACT = 'FACT',
  STORY = 'TALES',
  WORD = 'WORD',
  SCIENCE = 'SCIENCE LAB',
  CODING = 'CODE ASTRO',
  MOTIVATION = 'MOTIVATION',
  STUDY = 'STUDY GEN',
  VOICE_CONCEPT = 'VOICE ARCHITECT',
  GENERAL = 'GENERAL QUESTIONS'
}

export enum ViewState {
  AUTH = 'AUTH',
  HOME = 'HOME',
  TOOL = 'TOOL',
  TALES = 'TALES',
  BUGS = 'BUGS',
  LEADERBOARD = 'LEADERBOARD',
  GENERAL = 'GENERAL'
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  isPremium?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
}

export enum PersonalityType {
  TEACHER = 'Teacher Mode',
  BUDDY = 'Friendly Buddy',
  STRICT = 'Strict Mode',
  SOCRATIC = 'Socratic Tutor'
}

export interface HistoryItem {
  id: string;
  type: ToolType;
  query: string;
  response: string;
  timestamp: number;
}