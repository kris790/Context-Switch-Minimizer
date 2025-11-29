import React from 'react';
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
      />
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans text-gray-900">
      <Sidebar 
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
          />
        )}
      </main>

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
        />
      )}
    </div>
  );
};

export default App;