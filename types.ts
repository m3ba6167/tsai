export enum ToolType {
  MATH = 'MATH SOLVER',
  FACT = 'FACT',
  STORY = 'TALES',
  WORD = 'WORD',
  SCIENCE = 'SCIENCE LAB',
  CODING = 'CODE ASTRO',
  MOTIVATION = 'MOTIVATION',
  STUDY = 'STUDY GEN',
  VOICE_CONCEPT = 'VOICE ARCHITECT'
}

export enum ViewState {
  AUTH = 'AUTH',
  HOME = 'HOME',
  TOOL = 'TOOL',
  TALES = 'TALES',
  BUGS = 'BUGS',
  LEADERBOARD = 'LEADERBOARD',
  PETS = 'PETS'
}

export enum PetType {
  LUCKY_STAR = 'LUCKY_STAR'
}

export interface Pet {
  id: string;
  type: PetType;
  name: string;
  rarity: string;
  chance: number;
  acquiredAt: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  eggs: number;
  petsCount: number;
  rareItems: string[];
  score: number;
  coins: number;
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