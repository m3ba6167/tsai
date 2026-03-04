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
  TALES = 'TALES'
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