import React, { useEffect, useState } from 'react';
import { FocusSession } from '../types';
import { formatDuration } from '../utils';
import { Trophy, Share2, ArrowRight, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionSummaryProps {
  sessionName: string;
  duration: number; // seconds
  onClose: () => void;
  onViewAnalytics: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ sessionName, duration, onClose, onViewAnalytics }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Fade in content slightly delayed
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="inline-flex p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-inner ring-1 ring-white/30">
            <Trophy size={40} className="text-yellow-300 drop-shadow-md" />
          </div>
          
          <h2 className="text-2xl font-bold mb-1">Session Complete!</h2>
          <p className="text-blue-100">You stayed focused on <span className="font-semibold text-white">{sessionName}</span></p>
        </div>

        {/* Stats Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Focus Time</span>
            <div className="text-5xl font-mono font-bold text-gray-900 mt-2 tracking-tight">
              {formatDuration(duration)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-center">
              <div className="text-green-600 mb-1 flex justify-center"><Target size={20} /></div>
              <div className="font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-500">Focus Accuracy</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center">
              <div className="text-orange-500 mb-1 flex justify-center"><Zap size={20} /></div>
              <div className="font-bold text-gray-900">12 Day</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onViewAnalytics}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              View Detailed Stats <ArrowRight size={18} />
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl border border-gray-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;