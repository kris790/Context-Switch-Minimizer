import { FocusSession, SessionStats, UserSettings } from '../types';

// Mock storage implementation - replace with real storage later
export const storage = {
  getSessions(): FocusSession[] {
    try {
      const stored = localStorage.getItem('focus-sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions: FocusSession[]): void {
    localStorage.setItem('focus-sessions', JSON.stringify(sessions));
  },

  getStats(): SessionStats[] {
    try {
      const stored = localStorage.getItem('focus-stats');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveStats(stats: SessionStats[]): void {
    localStorage.setItem('focus-stats', JSON.stringify(stats));
  },

  getSettings(): UserSettings | null {
    try {
      const stored = localStorage.getItem('focus-settings');
      if (stored) {
        return JSON.parse(stored);
      }
      // Return default settings if none exist
      return {
        isOnboarded: false,
        isPro: false,
        userId: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
    } catch {
      return null;
    }
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem('focus-settings', JSON.stringify(settings));
  }
};
