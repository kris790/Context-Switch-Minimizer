export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // Emoji or generic icon name
  category: 'productivity' | 'communication' | 'entertainment' | 'system' | 'dev';
}

export interface FocusSession {
  id: string;
  name: string;
<<<<<<< HEAD
  allowedApps: Array<{
    appId: string;
    appName: string;
    appIcon?: string;
  }>;
  createdAt: string;
  lastUsedAt: string | null;
  totalTimeUsed: number;
  useCount: number;
=======
  allowedAppIds: string[];
  totalTimeUsed: number; // in seconds
  useCount: number;
  lastUsedAt?: string;
  icon: string;
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
}

export interface SessionStats {
  date: string;
<<<<<<< HEAD
  focusTime: number;
=======
  focusTime: number; // seconds
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
  switches: number;
}

export interface UserSettings {
  isOnboarded: boolean;
  isPro: boolean;
<<<<<<< HEAD
  userId: string;
  createdAt: string;
  email?: string;
  name?: string;
}

export type ViewState = 'dashboard' | 'analytics' | 'settings';
=======
  name: string;
  dailyGoal: number; // minutes
}

export type ViewState = 'dashboard' | 'analytics' | 'settings' | 'active_session';
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad

export enum FocusState {
  IDLE = 'idle',
  FOCUSING = 'focusing',
  DISTRACTED = 'distracted', // Simulates the overlay trigger
}
<<<<<<< HEAD
export interface AppState {
  currentView: ViewState;
  sessions: FocusSession[];
  stats: SessionStats[];
  settings: UserSettings | null;
  activeSession: FocusSession | null;
  activeSessionDuration: number;
  isEditorOpen: boolean;
  editingSession: FocusSession | null;
  completedSessionData: { name: string; duration: number } | null;
  isPricingOpen: boolean;
  isExportOpen: boolean;
  isExporting: boolean;
}

export type AppAction =
  | { type: 'SET_VIEW'; payload: ViewState }
  | { type: 'SET_SESSIONS'; payload: FocusSession[] }
  | { type: 'SET_STATS'; payload: SessionStats[] }
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'SET_ACTIVE_SESSION'; payload: FocusSession | null }
  | { type: 'INCREMENT_SESSION_DURATION' }
  | { type: 'RESET_SESSION_DURATION' }
  | { type: 'OPEN_EDITOR'; payload?: FocusSession }
  | { type: 'CLOSE_EDITOR' }
  | { type: 'SET_COMPLETED_SESSION'; payload: { name: string; duration: number } | null }
  | { type: 'OPEN_PRICING' }
  | { type: 'CLOSE_PRICING' }
  | { type: 'OPEN_EXPORT' }
  | { type: 'CLOSE_EXPORT' }
  | { type: 'SET_EXPORTING'; payload: boolean }
  | { type: 'UPDATE_SESSION'; payload: FocusSession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_SESSION'; payload: FocusSession }
  | { type: 'COMPLETE_ONBOARDING'; payload: { settings: UserSettings; initialSession?: FocusSession } };
=======
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
