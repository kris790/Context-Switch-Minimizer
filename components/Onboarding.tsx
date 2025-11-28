import React, { useState } from 'react';
import { FocusSession } from '../types';
import { AVAILABLE_APPS, DEFAULT_SESSIONS } from '../utils';
import { ArrowRight, Check, Search, CheckCircle2, Target, Shield, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 animate-fade-in font-sans selection:bg-white selection:text-black">
      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-12">
        <div className="flex justify-between text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3">
          <span className={step >= 1 ? 'text-white' : ''}>Welcome</span>
          <span className={step >= 2 ? 'text-white' : ''}>Template</span>
          <span className={step >= 3 ? 'text-white' : ''}>Customize</span>
          <span className={step >= 4 ? 'text-white' : ''}>Ready</span>
        </div>
        <div className="h-0.5 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-xl">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="relative w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                    <Zap size={40} className="fill-white" />
                </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Focus.<br/>Without the struggle.
            </h1>
            <p className="text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
              Stop losing hours to context switching. Set up your first distraction-free workspace in 30 seconds.
            </p>
            <div className="pt-8 flex flex-col gap-5 items-center">
              <button 
                onClick={() => setStep(2)}
                className="group bg-white hover:bg-neutral-200 text-black px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onSkip} className="text-neutral-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white pb-0.5">
                Skip setup, I'll explore on my own
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Template */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Choose your workflow</h2>
                <p className="text-neutral-400">Select a template to get started quickly.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-6 group ${
                    selectedTemplate === t.id 
                    ? 'border-white bg-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                    : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform filter grayscale group-hover:grayscale-0">{t.icon}</span>
                  <div>
                    <h3 className={`font-bold text-lg ${selectedTemplate === t.id ? 'text-white' : 'text-neutral-200'}`}>
                      {t.name}
                    </h3>
                    {t.id !== 'custom' && (
                      <p className="text-sm text-neutral-500 mt-1">
                        Pre-configured with {t.apps.length} essential apps
                      </p>
                    )}
                  </div>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTemplate === t.id ? 'border-white bg-white text-black' : 'border-neutral-700'
                  }`}>
                    {selectedTemplate === t.id && <Check size={14} strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-6">
               <button onClick={() => setStep(1)} className="text-neutral-500 hover:text-white px-4 py-2 transition-colors">Back</button>
               <button 
                disabled={!selectedTemplate}
                onClick={() => setStep(3)}
                className="bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
               >
                 Continue
               </button>
            </div>
          </div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300 h-[600px] flex flex-col">
            <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-white mb-2">Customize workspace</h2>
                <p className="text-neutral-400">Select the apps allowed during this session.</p>
            </div>
            
            {selectedTemplate === 'custom' && (
               <div className="mb-2">
                 <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Session Name</label>
                 <input 
                   type="text" 
                   value={customName}
                   onChange={(e) => setCustomName(e.target.value)}
                   placeholder="e.g. Project X"
                   className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-white focus:ring-1 focus:ring-white outline-none placeholder-neutral-600 transition-all"
                   autoFocus
                 />
               </div>
            )}

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search apps to allow..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-neutral-600 outline-none placeholder-neutral-600 transition-all"
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-3 content-start custom-scrollbar">
               {filteredApps.map(app => {
                    const isSelected = selectedApps.includes(app.id);
                    return (
                        <div 
                            key={app.id}
                            onClick={() => toggleApp(app.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                                isSelected 
                                ? 'border-white bg-neutral-900' 
                                : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-900'
                            }`}
                        >
                            <span className="text-xl filter grayscale-0">{app.icon}</span>
                            <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                                {app.name}
                            </span>
                            {isSelected && <Check size={16} className="ml-auto text-white" />}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
               <button onClick={() => setStep(2)} className="text-neutral-500 hover:text-white px-4 py-2 transition-colors">Back</button>
               <button 
                disabled={selectedApps.length === 0}
                onClick={() => setStep(4)}
                className="bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
               >
                 Create Session
               </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
               <CheckCircle2 size={128} className="text-white mx-auto relative z-10 drop-shadow-2xl" strokeWidth={1} />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">You're all set.</h2>
              <p className="text-neutral-400 text-lg">
                Your <span className="font-bold text-white border-b border-white/30 pb-0.5">
                  {selectedTemplate === 'custom' ? (customName || 'Focus Session') : templates.find(t => t.id === selectedTemplate)?.name}
                </span> session is ready to go.
              </p>
            </div>

            <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 text-left relative overflow-hidden group hover:border-neutral-700 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
               
               <h4 className="font-bold text-white mb-4 flex items-center gap-3 text-lg">
                 <Shield size={20} className="text-white" />
                 How it works
               </h4>
               <ul className="space-y-4 text-neutral-400">
                 <li className="flex gap-4">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">1</span>
                   <span>Click <b className="text-white">Start Focus</b> on your dashboard.</span>
                 </li>
                 <li className="flex gap-4">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">2</span>
                   <span>We'll gently nudge you if you open a distraction.</span>
                 </li>
                 <li className="flex gap-4">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">3</span>
                   <span>Build streaks and analyze your deep work stats.</span>
                 </li>
               </ul>
            </div>

            <button 
              onClick={handleCreate}
              className="w-full bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full font-bold text-xl shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
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