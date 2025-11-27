import React, { useState } from 'react';
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
      />
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans text-gray-900">
      <Sidebar 
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
          />
        )}
      </main>

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
        />
      )}
    </div>
  );
};

export default App;
