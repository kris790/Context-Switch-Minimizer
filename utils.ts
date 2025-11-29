import { AppDefinition, FocusSession, SessionStats, UserSettings } from './types';

export const AVAILABLE_APPS: AppDefinition[] = [
  { id: 'vscode', name: 'VS Code', icon: '💻', category: 'dev' },
  { id: 'terminal', name: 'Terminal', icon: '📟', category: 'dev' },
  { id: 'chrome', name: 'Google Chrome', icon: '🌐', category: 'productivity' },
  { id: 'slack', name: 'Slack', icon: '💬', category: 'communication' },
  { id: 'zoom', name: 'Zoom', icon: '📹', category: 'communication' },
  { id: 'spotify', name: 'Spotify', icon: '🎵', category: 'entertainment' },
  { id: 'notion', name: 'Notion', icon: '📝', category: 'productivity' },
  { id: 'figma', name: 'Figma', icon: '🎨', category: 'productivity' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', category: 'entertainment' },
  { id: 'mail', name: 'Mail', icon: '✉️', category: 'communication' },
  { id: 'discord', name: 'Discord', icon: '🎮', category: 'communication' },
];

export const DEFAULT_SESSIONS: FocusSession[] = [
  {
    id: 'deep-coding',
    name: 'Deep Coding',
    allowedAppIds: ['vscode', 'terminal', 'spotify', 'chrome'],
    totalTimeUsed: 169200, // 47 hours
    useCount: 47,
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
    icon: '🧑‍💻'
  },
  {
    id: 'writing',
    name: 'Writing',
    allowedAppIds: ['notion', 'spotify', 'chrome'],
    totalTimeUsed: 64800, // 18 hours
    useCount: 23,
    lastUsedAt: new Date(Date.now() - 172800000).toISOString(),
    icon: '✍️'
  },
  {
    id: 'client-comm',
    name: 'Client Communication',
    allowedAppIds: ['slack', 'mail', 'zoom', 'chrome'],
    totalTimeUsed: 28800, // 8 hours
    useCount: 12,
    lastUsedAt: new Date(Date.now() - 259200000).toISOString(),
    icon: '💬'
  }
];

// Generate last 14 days of mock stats
export const generateMockStats = (): SessionStats[] => {
  const stats: SessionStats[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    stats.push({
      date: d.toISOString().split('T')[0],
      focusTime: Math.floor(Math.random() * 18000) + 3600, // 1-6 hours
      switches: Math.floor(Math.random() * 15),
    });
  }
  return stats;
};

<<<<<<< HEAD
// Storage keys
const KEY_SESSIONS = 'csm_sessions';
const KEY_SETTINGS = 'csm_settings';
const KEY_STATS = 'csm_stats';

export const storage = {
  getSessions: (): FocusSession[] => {
    const data = localStorage.getItem(KEY_SESSIONS);
    return data ? JSON.parse(data) : DEFAULT_SESSIONS;
  },
  saveSessions: (sessions: FocusSession[]) => {
    localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
  },
  getSettings: (): UserSettings => {
    const data = localStorage.getItem(KEY_SETTINGS);
    return data ? JSON.parse(data) : { isOnboarded: false, isPro: false, name: '', dailyGoal: 240 };
  },
  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  },
  getStats: (): SessionStats[] => {
    const data = localStorage.getItem(KEY_STATS);
    return data ? JSON.parse(data) : generateMockStats();
  },
  saveStats: (stats: SessionStats[]) => {
    localStorage.setItem(KEY_STATS, JSON.stringify(stats));
  }
};
=======
// Storage logic has moved to store.ts to work with Zustand
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};
