import React, { useState, useEffect } from 'react';
import { FocusSession } from '../types';
import { AVAILABLE_APPS } from '../utils';
import { X, Search, Check, Plus } from 'lucide-react';

interface SessionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: FocusSession) => void;
  initialSession?: FocusSession | null;
}

const SessionEditor: React.FC<SessionEditorProps> = ({ isOpen, onClose, onSave, initialSession }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialSession) {
      setName(initialSession.name);
      setIcon(initialSession.icon);
      setSelectedApps(initialSession.allowedAppIds);
    } else {
      setName('');
      setIcon('🎯');
      setSelectedApps([]);
    }
  }, [initialSession, isOpen]);

  if (!isOpen) return null;

  const toggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(prev => prev.filter(id => id !== appId));
    } else {
      setSelectedApps(prev => [...prev, appId]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (selectedApps.length === 0) return;

    const session: FocusSession = {
      id: initialSession?.id || crypto.randomUUID(),
      name,
      icon,
      allowedAppIds: selectedApps,
      totalTimeUsed: initialSession?.totalTimeUsed || 0,
      useCount: initialSession?.useCount || 0,
      lastUsedAt: initialSession?.lastUsedAt
    };
    onSave(session);
    onClose();
  };

  const filteredApps = AVAILABLE_APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialSession ? 'Edit Session' : 'Create New Session'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Define your focused workspace</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Name & Icon */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Deep Coding"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    autoFocus
                />
            </div>
          </div>

          {/* App Selection */}
          <div>
            <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Allowed Apps</label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {selectedApps.length} selected
                </span>
            </div>
            
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search apps..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {filteredApps.map(app => {
                    const isSelected = selectedApps.includes(app.id);
                    return (
                        <div 
                            key={app.id}
                            onClick={() => toggleApp(app.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                                isSelected 
                                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-xl">{app.icon}</span>
                            <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                {app.name}
                            </span>
                            {isSelected && <Check size={16} className="ml-auto text-blue-500" />}
                        </div>
                    );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                disabled={!name.trim() || selectedApps.length === 0}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {initialSession ? 'Save Changes' : 'Create Session'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
