export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // Emoji or generic icon name
  category: 'productivity' | 'communication' | 'entertainment' | 'system' | 'dev';
}

export interface FocusSession {
  id: string;
  name: string;
  allowedAppIds: string[];
  totalTimeUsed: number; // in seconds
  useCount: number;
  lastUsedAt?: string;
  icon: string;
}

export interface SessionStats {
  date: string;
  focusTime: number; // seconds
  switches: number;
}

export interface UserSettings {
  isOnboarded: boolean;
  isPro: boolean;
  name: string;
  dailyGoal: number; // minutes
}

export type ViewState = 'dashboard' | 'analytics' | 'settings' | 'active_session';

export enum FocusState {
  IDLE = 'idle',
  FOCUSING = 'focusing',
  DISTRACTED = 'distracted', // Simulates the overlay trigger
}
