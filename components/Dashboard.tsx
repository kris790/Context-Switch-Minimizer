import React, { useState, useRef, useEffect } from 'react';
import { FocusSession } from '../types';
import { AVAILABLE_APPS, formatDuration } from '../utils';
import { Play, MoreVertical, Plus, Clock, LayoutGrid, Trash2, Edit } from 'lucide-react';

interface DashboardProps {
  sessions: FocusSession[];
  onStartSession: (session: FocusSession) => void;
  onEditSession: (session: FocusSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateSession: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, onStartSession, onEditSession, onDeleteSession, onCreateSession }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === sessionId ? null : sessionId);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Focus Sessions</h2>
          <p className="text-neutral-500 mt-2 text-lg">Select a workspace to start your deep work</p>
        </div>
        <button 
          onClick={onCreateSession}
          className="bg-neutral-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Create Session
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {sessions.map((session) => {
          const apps = AVAILABLE_APPS.filter(a => session.allowedAppIds.includes(a.id));
          const isMenuOpen = openMenuId === session.id;

          return (
            <div 
              key={session.id}
              className="group bg-white rounded-[2rem] border border-neutral-100 p-8 shadow-card hover:shadow-float hover:border-primary-200 transition-all duration-300 flex flex-col relative"
            >
              <div className="absolute top-6 right-6 z-10" ref={isMenuOpen ? menuRef : null}>
                <button 
                    onClick={(e) => handleMenuClick(e, session.id)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                        isMenuOpen ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-300 hover:text-neutral-600 hover:bg-neutral-50 opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <MoreVertical size={20} />
                </button>
                
                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 overflow-hidden animate-zoom-in origin-top-right z-20">
                        <button 
                            onClick={() => {
                                onEditSession(session);
                                setOpenMenuId(null);
                            }}
                            className="w-full text-left px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                        >
                            <Edit size={16} /> Edit Session
                        </button>
                        <button 
                            onClick={() => {
                                onDeleteSession(session.id);
                                setOpenMenuId(null);
                            }}
                            className="w-full text-left px-5 py-3 text-sm font-medium text-danger-600 hover:bg-danger-50 flex items-center gap-3 transition-colors"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-18 h-18 min-w-[4.5rem] min-h-[4.5rem] bg-primary-50 rounded-2xl flex items-center justify-center text-4xl border border-primary-100 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out">
                  {session.icon}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-xl text-neutral-900 mb-2 leading-tight">{session.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <span className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                        <Clock size={12} className="text-primary-500" />
                        {formatDuration(session.totalTimeUsed)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                        <LayoutGrid size={12} className="text-purple-500" />
                        {session.useCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 mb-10">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Allowed Apps</p>
                <div className="flex flex-wrap gap-3">
                  {apps.slice(0, 5).map(app => (
                    <div key={app.id} title={app.name} className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-xl border border-neutral-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                      {app.icon}
                    </div>
                  ))}
                  {apps.length > 5 && (
                    <div className="w-11 h-11 bg-neutral-50 rounded-xl flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200">
                      +{apps.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => onStartSession(session)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
              >
                <Play size={20} className="fill-current" />
                Start Focus
              </button>
            </div>
          );
        })}

        {/* Empty State / Add New */}
        <div 
            onClick={onCreateSession}
            className="border-2 border-dashed border-neutral-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 text-neutral-400 cursor-pointer hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30 transition-all min-h-[360px] group"
        >
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <Plus size={32} className="text-neutral-300 group-hover:text-primary-500" />
            </div>
            <div className="text-center">
                <span className="font-bold text-lg block mb-1 text-neutral-600 group-hover:text-primary-700">Create New Session</span>
                <span className="text-sm opacity-70">Design a custom workspace</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;