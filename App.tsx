<<<<<<< HEAD
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import ActiveFocus from './components/ActiveFocus';
import SessionEditor from './components/SessionEditor';
import Onboarding from './components/Onboarding';
import SessionSummary from './components/SessionSummary';
import PricingModal from './components/PricingModal';
import ExportModal from './components/ExportModal';
<<<<<<< HEAD
import { useAppState } from './hooks/useAppState';
import { ViewState } from './types';

const App: React.FC = () => {
  const { state, actions } = useAppState();

  if (!state.settings) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Flow 1: Onboarding
  if (!state.settings.isOnboarded) {
    return (
      <Onboarding 
        onComplete={actions.completeOnboarding}
        onSkip={actions.skipOnboarding}
=======
import { ViewState, FocusSession } from './types';
import { useStore } from './store';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Zustand Store
  const sessions = useStore((state) => state.sessions);
  const settings = useStore((state) => state.settings);
  const stats = useStore((state) => state.stats);
  const updateSettings = useStore((state) => state.updateSettings);
  const addSession = useStore((state) => state.addSession);
  const updateSession = useStore((state) => state.updateSession);
  const deleteSession = useStore((state) => state.deleteSession);
  const addStat = useStore((state) => state.addStat);
  const recordSessionUsage = useStore((state) => state.recordSessionUsage);

  // UI State
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<FocusSession | null>(null);
  
  const [completedSessionData, setCompletedSessionData] = useState<{name: string, duration: number} | null>(null);
  
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleOnboardingComplete = (initialSession: FocusSession) => {
    addSession(initialSession);
    updateSettings({ isOnboarded: true });
  };

  const handleOnboardingSkip = () => {
    updateSettings({ isOnboarded: true });
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    setIsEditorOpen(true);
  };

  const handleEditSession = (session: FocusSession) => {
    setEditingSession(session);
    setIsEditorOpen(true);
  };

  const handleSaveSession = (session: FocusSession) => {
    if (editingSession) {
      updateSession(session);
    } else {
      addSession(session);
    }
  };

  const handleStartSession = (session: FocusSession) => {
    setActiveSession(session);
  };

  const handleEndSession = (duration: number) => {
    if (activeSession) {
      // Update global stats
      recordSessionUsage(activeSession.id, duration);
      addStat(duration);

      // Show summary
      setCompletedSessionData({
        name: activeSession.name,
        duration: duration
      });
    }
    setActiveSession(null);
  };

  const handleExportData = (format: 'json' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
        const exportData = {
            user: settings,
            sessions,
            stats,
            exportDate: new Date().toISOString()
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `context-switch-export-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        setIsExporting(false);
        setIsExportOpen(false);
    }, 1500);
  };

  if (!settings) return null;

  if (!settings.isOnboarded) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
      />
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans text-gray-900">
      <Sidebar 
<<<<<<< HEAD
        currentView={state.currentView}
        setView={actions.setView}
        isPro={state.settings.isPro}
        onUpgradeClick={actions.openPricing}
      />

      <main className="flex-1 ml-64 overflow-y-auto">
        {state.currentView === 'dashboard' && (
          <Dashboard 
            sessions={state.sessions}
            onStartSession={actions.startSession}
            onEditSession={actions.editSession}
            onDeleteSession={actions.deleteSession}
            onCreateSession={actions.createSession}
          />
        )}
        {state.currentView === 'analytics' && (
          <Analytics stats={state.stats} />
        )}
        {state.currentView === 'settings' && (
          <Settings 
            settings={state.settings}
            onExportClick={actions.openExport}
=======
        currentView={currentView} 
        setView={setCurrentView} 
        isPro={settings.isPro}
        onUpgradeClick={() => setIsPricingOpen(true)} 
      />
      
      <main className="flex-1 ml-64 overflow-y-auto">
        {currentView === 'dashboard' && (
          <Dashboard 
            sessions={sessions}
            onStartSession={handleStartSession}
            onEditSession={handleEditSession}
            onDeleteSession={deleteSession}
            onCreateSession={handleCreateSession}
          />
        )}
        {currentView === 'analytics' && (
          <Analytics stats={stats} />
        )}
        {currentView === 'settings' && (
          <Settings 
            settings={settings}
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
          />
        )}
      </main>

<<<<<<< HEAD
      {/* Modals & Overlays */}
      <SessionEditor 
        isOpen={state.isEditorOpen}
        onClose={actions.closeEditor}
        onSave={actions.saveSession}
        initialSession={state.editingSession}
      />

      <PricingModal 
        isOpen={state.isPricingOpen}
        onClose={actions.closePricing}
        onUpgrade={actions.upgradeToPro}
      />

      <ExportModal 
        isOpen={state.isExportOpen}
        onClose={actions.closeExport}
        onExport={actions.exportData}
        isExporting={state.isExporting}
      />

      {state.activeSession && (
        <ActiveFocus 
          session={state.activeSession}
          duration={state.activeSessionDuration}
          onEndSession={actions.endSession}
        />
      )}

      {/* Flow 4: Session Summary */}
      {state.completedSessionData && (
        <SessionSummary 
          sessionName={state.completedSessionData.name}
          duration={state.completedSessionData.duration}
          onClose={actions.closeSessionSummary}
          onViewAnalytics={actions.viewAnalytics}
=======
      <SessionEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveSession}
        initialSession={editingSession}
      />

      <PricingModal 
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onUpgrade={() => {
            updateSettings({ isPro: true });
            setIsPricingOpen(false);
        }}
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExportData}
        isExporting={isExporting}
      />

      {activeSession && (
        <ActiveFocus 
          session={activeSession}
          onEndSession={handleEndSession}
        />
      )}

      {completedSessionData && (
        <SessionSummary 
          sessionName={completedSessionData.name}
          duration={completedSessionData.duration}
          onClose={() => setCompletedSessionData(null)}
          onViewAnalytics={() => {
            setCompletedSessionData(null);
            setCurrentView('analytics');
          }}
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 0b9186e9033b7601e5a254260bd8f1913179e0ad
