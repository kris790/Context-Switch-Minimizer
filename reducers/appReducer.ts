import { AppState, AppAction } from '../types';

export const initialState: AppState = {
  currentView: 'dashboard',
  sessions: [],
  stats: [],
  settings: null,
  activeSession: null,
  activeSessionDuration: 0,
  isEditorOpen: false,
  editingSession: null,
  completedSessionData: null,
  isPricingOpen: false,
  isExportOpen: false,
  isExporting: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };

    case 'SET_STATS':
      return { ...state, stats: action.payload };

    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };

    case 'SET_ACTIVE_SESSION':
      return { 
        ...state, 
        activeSession: action.payload,
        activeSessionDuration: action.payload ? state.activeSessionDuration : 0
      };

    case 'INCREMENT_SESSION_DURATION':
      return { ...state, activeSessionDuration: state.activeSessionDuration + 1 };

    case 'RESET_SESSION_DURATION':
      return { ...state, activeSessionDuration: 0 };

    case 'OPEN_EDITOR':
      return { 
        ...state, 
        isEditorOpen: true, 
        editingSession: action.payload || null 
      };

    case 'CLOSE_EDITOR':
      return { ...state, isEditorOpen: false, editingSession: null };

    case 'SET_COMPLETED_SESSION':
      return { ...state, completedSessionData: action.payload };

    case 'OPEN_PRICING':
      return { ...state, isPricingOpen: true };

    case 'CLOSE_PRICING':
      return { ...state, isPricingOpen: false };

    case 'OPEN_EXPORT':
      return { ...state, isExportOpen: true };

    case 'CLOSE_EXPORT':
      return { ...state, isExportOpen: false, isExporting: false };

    case 'SET_EXPORTING':
      return { ...state, isExporting: action.payload };

    case 'ADD_SESSION':
      return { 
        ...state, 
        sessions: [...state.sessions, action.payload],
        isEditorOpen: false,
        editingSession: null
      };

    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === action.payload.id ? action.payload : s
        ),
        isEditorOpen: false,
        editingSession: null,
        activeSession: state.activeSession?.id === action.payload.id ? action.payload : state.activeSession
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeSession: state.activeSession?.id === action.payload ? null : state.activeSession
      };

    case 'COMPLETE_ONBOARDING':
      const newState = {
        ...state,
        settings: action.payload.settings
      };
      
      if (action.payload.initialSession) {
        newState.sessions = [...state.sessions, action.payload.initialSession];
      }
      
      return newState;

    default:
      return state;
  }
}
