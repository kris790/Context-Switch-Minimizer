import { create } from 'zustand';
import { FocusSession, SessionStats, UserSettings } from './types';
import { DEFAULT_SESSIONS, generateMockStats } from './utils';

const KEY_SESSIONS = 'csm_sessions';
const KEY_SETTINGS = 'csm_settings';
const KEY_STATS = 'csm_stats';

// Persistence helpers
const getStoredSessions = (): FocusSession[] => {
  const data = localStorage.getItem(KEY_SESSIONS);
  return data ? JSON.parse(data) : DEFAULT_SESSIONS;
};

const getStoredSettings = (): UserSettings => {
  const data = localStorage.getItem(KEY_SETTINGS);
  return data ? JSON.parse(data) : { isOnboarded: false, isPro: false, name: '', dailyGoal: 240 };
};

const getStoredStats = (): SessionStats[] => {
  const data = localStorage.getItem(KEY_STATS);
  return data ? JSON.parse(data) : generateMockStats();
};

interface AppState {
  sessions: FocusSession[];
  settings: UserSettings;
  stats: SessionStats[];
  
  // Actions
  addSession: (session: FocusSession) => void;
  updateSession: (session: FocusSession) => void;
  deleteSession: (id: string) => void;
  
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  addStat: (duration: number) => void;
  recordSessionUsage: (sessionId: string, duration: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  sessions: getStoredSessions(),
  settings: getStoredSettings(),
  stats: getStoredStats(),

  addSession: (session) => {
    set((state) => {
      const newSessions = [...state.sessions, session];
      localStorage.setItem(KEY_SESSIONS, JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  },

  updateSession: (session) => {
    set((state) => {
      const newSessions = state.sessions.map((s) => (s.id === session.id ? session : s));
      localStorage.setItem(KEY_SESSIONS, JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  },

  deleteSession: (id) => {
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.id !== id);
      localStorage.setItem(KEY_SESSIONS, JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem(KEY_SETTINGS, JSON.stringify(updated));
      return { settings: updated };
    });
  },

  addStat: (duration) => {
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const todayStatsIndex = state.stats.findIndex(s => s.date === today);
      let newStats = [...state.stats];
      
      if (todayStatsIndex >= 0) {
        newStats[todayStatsIndex] = {
          ...newStats[todayStatsIndex],
          focusTime: newStats[todayStatsIndex].focusTime + duration
        };
      } else {
        newStats.push({ date: today, focusTime: duration, switches: 0 });
      }
      
      localStorage.setItem(KEY_STATS, JSON.stringify(newStats));
      return { stats: newStats };
    });
  },

  recordSessionUsage: (sessionId, duration) => {
    set((state) => {
      const newSessions = state.sessions.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            useCount: s.useCount + 1,
            totalTimeUsed: s.totalTimeUsed + duration,
            lastUsedAt: new Date().toISOString()
          };
        }
        return s;
      });
      localStorage.setItem(KEY_SESSIONS, JSON.stringify(newSessions));
      return { sessions: newSessions };
    });
  }
}));
