import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FocusSession, FocusState } from '../types';
import { formatDuration, AVAILABLE_APPS } from '../utils';
import { StopCircle, AlertTriangle, ArrowRight, CheckCircle2, X, ShieldAlert, AlertCircle, Monitor, Timer, Infinity, History, Edit3 } from 'lucide-react';

interface ActiveFocusProps {
  session: FocusSession;
  onEndSession: (duration: number) => void;
}

const ActiveFocus: React.FC<ActiveFocusProps> = ({ session, onEndSession }) => {
  const [duration, setDuration] = useState(0);
  const [targetDuration, setTargetDuration] = useState<number | null>(null);
  const [focusState, setFocusState] = useState<FocusState>(FocusState.FOCUSING);
  const [distractionApp, setDistractionApp] = useState<{name: string, icon: string} | null>(null);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const durationRef = useRef(0);
  
  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => {
        const newVal = prev + 1;
        durationRef.current = newVal;
        return newVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEndClick = () => {
    if (duration < 300) {
      setShowEndConfirm(true);
    } else {
      onEndSession(durationRef.current);
    }
  };

  const confirmEnd = () => {
    onEndSession(durationRef.current);
  };

  const triggerDistraction = useCallback(() => {
    const unauthorizedApps = AVAILABLE_APPS.filter(app => !session.allowedAppIds.includes(app.id));
    if (unauthorizedApps.length > 0) {
        const randomApp = unauthorizedApps[Math.floor(Math.random() * unauthorizedApps.length)];
        setDistractionApp({ name: randomApp.name, icon: randomApp.icon });
        setFocusState(FocusState.DISTRACTED);
    }
  }, [session.allowedAppIds]);

  const handleStayFocused = () => {
    setFocusState(FocusState.FOCUSING);
    setDistractionApp(null);
    setDontAskAgain(false);
  };

  const handleAllowDistraction = () => {
    setFocusState(FocusState.FOCUSING);
    setDistractionApp(null);
    setDontAskAgain(false);
  };

  const handleCustomDuration = () => {
    const input = window.prompt("Enter duration in minutes:", "30");
    if (input) {
      const minutes = parseInt(input, 10);
      if (!isNaN(minutes) && minutes > 0) {
        setTargetDuration(minutes * 60);
      }
    }
  };

  const allowedAppsList = AVAILABLE_APPS.filter(app => session.allowedAppIds.includes(app.id));

  // Timer Calculation Logic
  let displaySeconds = duration;
  let isOvertime = false;
  let endsAtTime = null;

  if (targetDuration !== null) {
      const remaining = targetDuration - duration;
      if (remaining < 0) {
          displaySeconds = Math.abs(remaining);
          isOvertime = true;
      } else {
          displaySeconds = remaining;
          // Calculate End Time
          const endTime = new Date(Date.now() + remaining * 1000);
          endsAtTime = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }
  }

  const formatTimerLarge = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    
    if (h > 0) return { main: `${hh}:${mm}`, sub: ss };
    return { main: `${mm}:${ss}`, sub: '' };
  };

  const timerDisplay = formatTimerLarge(displaySeconds);

  // Calculate progress percentage for ring (if countdown)
  const progressPercent = targetDuration ? Math.min((duration / targetDuration) * 100, 100) : 0;
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-sans animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden z-10">
        <div className="text-center p-8 max-w-3xl w-full flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-white/80 rounded-[2rem] shadow-float text-6xl border border-white backdrop-blur-md animate-bounce-soft">
                {session.icon}
            </div>
            
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">{session.name}</h1>
            
            <div className="flex items-center justify-center gap-2 text-primary-700 font-semibold mb-8 bg-primary-100/50 px-4 py-1.5 rounded-full w-fit mx-auto border border-primary-200 shadow-sm backdrop-blur-sm text-sm">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
                <span>Focus Mode Active</span>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center justify-center gap-2 mb-10 bg-white/60 p-1.5 rounded-xl backdrop-blur-sm border border-white/60 shadow-sm transition-all hover:bg-white/80">
                <button 
                    onClick={() => setTargetDuration(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${!targetDuration ? 'bg-white text-primary-600 shadow-sm ring-1 ring-neutral-100' : 'text-neutral-500 hover:bg-white/50'}`}
                >
                    <Infinity size={16} />
                    Flow
                </button>
                {[15, 25, 45, 60].map(mins => (
                    <button
                        key={mins}
                        onClick={() => setTargetDuration(mins * 60)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${targetDuration === mins * 60 ? 'bg-white text-primary-600 shadow-sm ring-1 ring-neutral-100' : 'text-neutral-500 hover:bg-white/50'}`}
                    >
                        {mins}m
                    </button>
                ))}
                <button 
                    onClick={handleCustomDuration}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:bg-white/50 transition-colors"
                    title="Custom Duration"
                >
                  <Edit3 size={16} />
                </button>
            </div>

            <div className="relative mb-16 group cursor-default">
              {/* Progress Ring for Countdown */}
              {targetDuration && (
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] -rotate-90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <circle cx="190" cy="190" r="180" className="stroke-neutral-100 fill-none" strokeWidth="2" />
                    <circle 
                        cx="190" cy="190" r="180" 
                        className={`fill-none transition-all duration-1000 ease-linear ${isOvertime ? 'stroke-orange-400' : 'stroke-primary-200'}`}
                        strokeWidth="4" 
                        strokeDasharray={2 * Math.PI * 180}
                        strokeDashoffset={isOvertime ? 0 : (2 * Math.PI * 180) - ((progressPercent / 100) * 2 * Math.PI * 180)}
                        strokeLinecap="round"
                    />
                </svg>
              )}

              {/* Ends At Label */}
              {targetDuration && !isOvertime && endsAtTime && (
                <div className="absolute -top-6 left-0 w-full text-center text-primary-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                   Ends at {endsAtTime}
                </div>
              )}

              <div className={`text-[120px] sm:text-[140px] font-mono font-bold tracking-tighter leading-none tabular-nums select-none drop-shadow-sm transition-all group-hover:scale-105 duration-500 ${isOvertime ? 'text-orange-500' : 'text-neutral-900'}`}>
                  {isOvertime && <span className="text-4xl align-top font-bold mr-1 inline-block mt-8">+</span>}
                  {timerDisplay.main}
                  {timerDisplay.sub && <span className={`text-4xl sm:text-5xl ml-2 align-top opacity-60 font-medium inline-block mt-4 ${isOvertime ? 'text-orange-300' : 'text-neutral-400'}`}>{timerDisplay.sub}</span>}
              </div>
              
              {targetDuration && (
                  <div className={`absolute -bottom-8 left-0 w-full text-center text-sm font-bold uppercase tracking-widest transition-colors ${isOvertime ? 'text-orange-500 animate-pulse' : 'text-neutral-300'}`}>
                      {isOvertime ? 'Overtime' : 'Remaining'}
                  </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                <button 
                    onClick={handleEndClick}
                    className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-neutral-200 hover:border-danger-200 hover:bg-danger-50 text-neutral-600 hover:text-danger-600 rounded-2xl transition-all shadow-card hover:shadow-lg transform hover:-translate-y-1"
                >
                    <StopCircle size={22} className="group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-lg">End Session</span>
                </button>
                
                <button 
                    onClick={triggerDistraction}
                    className="text-xs text-neutral-400 hover:text-neutral-600 font-medium transition-colors flex items-center gap-2 opacity-60 hover:opacity-100 px-4 py-2 rounded-lg hover:bg-neutral-100"
                >
                    <Monitor size={14} />
                    Simulate Distraction
                </button>
            </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
            <div className="glass shadow-float rounded-2xl p-3 px-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 animate-fade-in-up">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">Allowed Workspace</span>
                <div className="hidden sm:block h-5 w-px bg-neutral-200"></div>
                <div className="flex gap-4 overflow-x-auto py-2 px-1 w-full sm:w-auto justify-center sm:justify-start">
                    {allowedAppsList.map(app => (
                        <div key={app.id} className="group relative" title={app.name}>
                            <div className="text-2xl transition-all opacity-70 group-hover:opacity-100 transform group-hover:scale-125 duration-200 cursor-default filter grayscale group-hover:grayscale-0">
                                {app.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-all" onClick={() => setShowEndConfirm(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-zoom-in border border-neutral-100">
                <div className="w-16 h-16 bg-warning-50 rounded-2xl flex items-center justify-center text-warning mb-6 mx-auto shadow-inner">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">End session already?</h3>
                <p className="text-neutral-500 text-center mb-8 leading-relaxed">
                    You've only been focused for <span className="font-semibold text-neutral-900">{Math.floor(duration / 60)} minutes</span>. True deep work usually takes 15+ minutes to achieve.
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => setShowEndConfirm(false)}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-200 transform hover:scale-[1.02]"
                    >
                        Keep Going
                    </button>
                    <button 
                        onClick={confirmEnd}
                        className="w-full py-3 bg-transparent hover:bg-neutral-50 text-neutral-500 hover:text-danger-600 rounded-xl font-medium transition-colors"
                    >
                        End Session
                    </button>
                </div>
            </div>
        </div>
      )}

      {focusState === FocusState.DISTRACTED && distractionApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xl transition-all duration-500"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 border border-white/60 animate-zoom-in duration-300 ring-1 ring-black/5">
                <div className="text-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-[2rem] flex items-center justify-center text-6xl mx-auto mb-8 shadow-inner border border-neutral-200">
                        {distractionApp.icon}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
                        You're in {session.name} mode
                    </h2>
                    <p className="text-neutral-500 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
                        Opening <span className="font-semibold text-neutral-900">{distractionApp.name}</span> might break your flow state.
                    </p>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleStayFocused}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
                        >
                            <ShieldAlert size={22} />
                            Stay Focused
                        </button>
                        
                        <button 
                            onClick={handleAllowDistraction}
                            className="w-full py-4 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-2xl font-medium transition-all"
                        >
                            I need to access this
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-3">
                        <input 
                            type="checkbox" 
                            id="dontAsk"
                            checked={dontAskAgain}
                            onChange={(e) => setDontAskAgain(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500 cursor-pointer"
                        />
                        <label htmlFor="dontAsk" className="text-sm text-neutral-400 cursor-pointer select-none hover:text-neutral-600 transition-colors">
                            Don't ask about {distractionApp.name} again this session
                        </label>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActiveFocus;