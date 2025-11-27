import React, { useState } from 'react';
import { FocusSession } from '../types';
import { AVAILABLE_APPS, DEFAULT_SESSIONS } from '../utils';
import { ArrowRight, Check, Search, CheckCircle2, Target, Shield } from 'lucide-react';

interface OnboardingProps {
  onComplete: (session: FocusSession) => void;
  onSkip: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    { id: 'deep-coding', name: 'Deep Coding', icon: '🧑‍💻', apps: ['vscode', 'terminal', 'spotify', 'chrome'] },
    { id: 'writing', name: 'Writing', icon: '✍️', apps: ['notion', 'spotify', 'chrome'] },
    { id: 'custom', name: 'Custom Session', icon: '✨', apps: [] },
  ];

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    if (id !== 'custom') {
      const template = templates.find(t => t.id === id);
      if (template) {
        setSelectedApps(template.apps);
      }
    } else {
      setSelectedApps([]);
    }
  };

  const toggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(prev => prev.filter(id => id !== appId));
    } else {
      setSelectedApps(prev => [...prev, appId]);
    }
  };

  const handleCreate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const sessionName = selectedTemplate === 'custom' ? (customName || 'My Focus Session') : template?.name || 'Focus Session';
    const sessionIcon = template?.icon || '🎯';

    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      name: sessionName,
      icon: sessionIcon,
      allowedAppIds: selectedApps,
      totalTimeUsed: 0,
      useCount: 0,
    };
    onComplete(newSession);
  };

  const filteredApps = AVAILABLE_APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          <span className={step >= 1 ? 'text-blue-600' : ''}>Welcome</span>
          <span className={step >= 2 ? 'text-blue-600' : ''}>Template</span>
          <span className={step >= 3 ? 'text-blue-600' : ''}>Customize</span>
          <span className={step >= 4 ? 'text-blue-600' : ''}>Ready</span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-xl">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Target size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Context Switch Minimizer</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Reclaim your focus. Let's set up your first session in less than 30 seconds.
            </p>
            <div className="pt-8 flex flex-col gap-4 items-center">
              <button 
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 text-sm">
                Skip setup, I'll explore on my own
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Template */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 text-center">What do you need to focus on?</h2>
            <div className="grid grid-cols-1 gap-4">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${
                    selectedTemplate === t.id 
                    ? 'border-blue-600 bg-blue-50 shadow-md' 
                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{t.icon}</span>
                  <div>
                    <h3 className={`font-bold text-lg ${selectedTemplate === t.id ? 'text-blue-900' : 'text-gray-900'}`}>
                      {t.name}
                    </h3>
                    {t.id !== 'custom' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Pre-configured with {t.apps.length} essential apps
                      </p>
                    )}
                  </div>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedTemplate === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                  }`}>
                    {selectedTemplate === t.id && <Check size={14} />}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
               <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 px-4 py-2">Back</button>
               <button 
                disabled={!selectedTemplate}
                onClick={() => setStep(3)}
                className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
               >
                 Continue
               </button>
            </div>
          </div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300 h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Customize your workspace</h2>
            
            {selectedTemplate === 'custom' && (
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
                 <input 
                   type="text" 
                   value={customName}
                   onChange={(e) => setCustomName(e.target.value)}
                   placeholder="e.g. Project X"
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                   autoFocus
                 />
               </div>
            )}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search apps to allow..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-3 content-start">
               {filteredApps.map(app => {
                    const isSelected = selectedApps.includes(app.id);
                    return (
                        <div 
                            key={app.id}
                            onClick={() => toggleApp(app.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                                isSelected 
                                ? 'border-blue-500 bg-blue-50' 
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

            <div className="flex justify-between pt-4 border-t border-gray-100">
               <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-900 px-4 py-2">Back</button>
               <button 
                disabled={selectedApps.length === 0}
                onClick={() => setStep(4)}
                className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
               >
                 Create Session
               </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="relative">
               <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
               <CheckCircle2 size={80} className="text-green-500 mx-auto relative z-10" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">You're all set! 🎉</h2>
              <p className="text-gray-600">
                Your <span className="font-semibold text-gray-900">
                  {selectedTemplate === 'custom' ? (customName || 'Focus Session') : templates.find(t => t.id === selectedTemplate)?.name}
                </span> session is ready.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left">
               <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                 <Shield size={16} className="text-blue-500" />
                 How it works
               </h4>
               <ul className="space-y-3 text-sm text-gray-600">
                 <li className="flex gap-2">
                   <span className="text-blue-500">1.</span>
                   Click "Start Focus" when you're ready to work.
                 </li>
                 <li className="flex gap-2">
                   <span className="text-blue-500">2.</span>
                   We'll gently remind you if you open a distracting app.
                 </li>
                 <li className="flex gap-2">
                   <span className="text-blue-500">3.</span>
                   End the session to see your progress stats.
                 </li>
               </ul>
            </div>

            <button 
              onClick={handleCreate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Using App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;