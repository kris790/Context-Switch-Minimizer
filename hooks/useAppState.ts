import { useReducer, useEffect, useCallback } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { storage } from '../utils';
import { FocusSession, SessionStats, ViewState } from '../types';

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const sessions = storage.getSessions();
    const stats = storage.getStats();
    const settings = storage.getSettings();

    dispatch({ type: 'SET_SESSIONS', payload: sessions });
    dispatch({ type: 'SET_STATS', payload: stats });
    if (settings) {
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    }
  }, []);

  // Session timer effect
  useEffect(() => {
    if (!state.activeSession) return;
    const interval = setInterval(() => {
      dispatch({ type: 'INCREMENT_SESSION_DURATION' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.activeSession]);

  const actions = {
    setView: useCallback((view: ViewState) => {
      dispatch({ type: 'SET_VIEW', payload: view });
    }, []),

    createSession: useCallback(() => {
      dispatch({ type: 'OPEN_EDITOR' });
    }, []),

    editSession: useCallback((session: FocusSession) => {
      dispatch({ type: 'OPEN_EDITOR', payload: session });
    }, []),

    deleteSession: useCallback((sessionId: string) => {
      const newSessions = state.sessions.filter(s => s.id !== sessionId);
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
      storage.saveSessions(newSessions);
    }, [state.sessions]),

    saveSession: useCallback((session: FocusSession) => {
      let newSessions: FocusSession[];
      if (state.editingSession) {
        newSessions = state.sessions.map(s => s.id === session.id ? session : s);
        dispatch({ type: 'UPDATE_SESSION', payload: session });
      } else {
        newSessions = [...state.sessions, session];
        dispatch({ type: 'ADD_SESSION', payload: session });
      }
      storage.saveSessions(newSessions);
    }, [state.sessions, state.editingSession]),

    startSession: useCallback((session: FocusSession) => {
      dispatch({ type: 'SET_ACTIVE_SESSION', payload: session });
    }, []),

    endSession: useCallback(() => {
      if (!state.activeSession) return;
      const duration = state.activeSessionDuration;
      // Update session usage stats
      const updatedSessions = state.sessions.map(s => {
        if (s.id === state.activeSession!.id) {
          return {
            ...s,
            useCount: s.useCount + 1,
            totalTimeUsed: s.totalTimeUsed + duration,
            lastUsedAt: new Date().toISOString()
          };
        }
        return s;
      });
      dispatch({ type: 'SET_SESSIONS', payload: updatedSessions });
      storage.saveSessions(updatedSessions);
      // Update daily stats
      const today = new Date().toISOString().split('T')[0];
      const todayStatsIndex = state.stats.findIndex(s => s.date === today);
      let newStats: SessionStats[] = [...state.stats];
      if (todayStatsIndex >= 0) {
        newStats[todayStatsIndex] = {
          ...newStats[todayStatsIndex],
          focusTime: newStats[todayStatsIndex].focusTime + duration
        };
      } else {
        newStats.push({ date: today, focusTime: duration, switches: 0 });
      }
      dispatch({ type: 'SET_STATS', payload: newStats });
      storage.saveStats(newStats);
      // Show summary
      dispatch({ 
        type: 'SET_COMPLETED_SESSION', 
        payload: {
          name: state.activeSession.name,
          duration
        }
      });
      dispatch({ type: 'SET_ACTIVE_SESSION', payload: null });
    }, [state.activeSession, state.activeSessionDuration, state.sessions, state.stats]),

    completeOnboarding: useCallback((initialSession?: FocusSession) => {
      if (!state.settings) return;
      const newSettings = { ...state.settings, isOnboarded: true };
      dispatch({ 
        type: 'COMPLETE_ONBOARDING', 
        payload: { settings: newSettings, initialSession } 
      });
      storage.saveSettings(newSettings);
    }, [state.settings]),

    skipOnboarding: useCallback(() => {
      if (!state.settings) return;
      const newSettings = { ...state.settings, isOnboarded: true };
      dispatch({ type: 'SET_SETTINGS', payload: newSettings });
      storage.saveSettings(newSettings);
    }, [state.settings]),

    upgradeToPro: useCallback(() => {
      if (!state.settings) return;
      const newSettings = { ...state.settings, isPro: true };
      dispatch({ type: 'SET_SETTINGS', payload: newSettings });
      storage.saveSettings(newSettings);
      dispatch({ type: 'CLOSE_PRICING' });
    }, [state.settings]),

    exportData: useCallback(async (format: 'json' | 'csv') => {
      dispatch({ type: 'SET_EXPORTING', payload: true });
      setTimeout(() => {
        const exportData = {
          user: state.settings,
          sessions: state.sessions,
          stats: state.stats,
          exportDate: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `context-switch-export-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        dispatch({ type: 'SET_EXPORTING', payload: false });
        dispatch({ type: 'CLOSE_EXPORT' });
      }, 1500);
    }, [state.settings, state.sessions, state.stats]),

    openPricing: useCallback(() => dispatch({ type: 'OPEN_PRICING' }), []),
    closePricing: useCallback(() => dispatch({ type: 'CLOSE_PRICING' }), []),
    openExport: useCallback(() => dispatch({ type: 'OPEN_EXPORT' }), []),
    closeExport: useCallback(() => dispatch({ type: 'CLOSE_EXPORT' }), []),
    closeEditor: useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), []),
    closeSessionSummary: useCallback(() => dispatch({ type: 'SET_COMPLETED_SESSION', payload: null }), []),
    viewAnalytics: useCallback(() => {
      dispatch({ type: 'SET_COMPLETED_SESSION', payload: null });
      dispatch({ type: 'SET_VIEW', payload: 'analytics' });
    }, [])
  };

  return { state, actions };
}
