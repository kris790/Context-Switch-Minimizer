import React, { useState } from 'react';
import { SessionStats } from '../types';
import { formatDuration } from '../utils';
import { TrendingUp, Calendar, Zap, AlertTriangle, Lock } from 'lucide-react';

interface AnalyticsProps {
  stats: SessionStats[];
}

type TimeRange = 'today' | 'week' | 'month' | 'all';

const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  const [range, setRange] = useState<TimeRange>('week');

  const filterStats = (r: TimeRange) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    switch (r) {
        case 'today':
            return stats.filter(s => s.date === todayStr);
        case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return stats.filter(s => new Date(s.date) >= weekAgo);
        case 'month':
            const monthAgo = new Date(now);
            monthAgo.setDate(monthAgo.getDate() - 30);
            return stats.filter(s => new Date(s.date) >= monthAgo);
        case 'all':
            return stats;
        default:
            return stats;
    }
  };

  const filteredStats = filterStats(range);
  const totalFocusTime = filteredStats.reduce((acc, curr) => acc + curr.focusTime, 0);
  const totalSwitches = filteredStats.reduce((acc, curr) => acc + curr.switches, 0);
  const avgDuration = filteredStats.length ? Math.floor(totalFocusTime / filteredStats.length) : 0;
  
  // Calculate max values for chart scaling
  const maxFocus = Math.max(...(filteredStats.length ? filteredStats.map(s => s.focusTime) : [0]));
  const displayStats = range === 'today' ? filteredStats : filteredStats.slice(0, 14); // Limit bars for UI

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Productivity Insights</h2>
            <p className="text-gray-500 mt-1">Track your progress and focus trends</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {(['today', 'week', 'month', 'all'] as TimeRange[]).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    range === t 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                  {t === 'all' ? 'All Time' : t}
              </button>
          ))}
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Zap size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500">Focus Time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatDuration(totalFocusTime)}</p>
            {range === 'week' && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
                    <TrendingUp size={12} />
                    +12% from last week
                </p>
            )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Calendar size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500">Avg. Session</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{Math.floor(avgDuration / 60)}m</p>
            <p className="text-xs text-gray-400 mt-2">Per session</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <AlertTriangle size={20} />
                </div>
                <span className="text-sm font-medium text-gray-500">Distractions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalSwitches}</p>
            <p className="text-xs text-green-600 mt-2 font-medium">-5% improvement</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg text-white">
                    <Zap size={20} />
                </div>
                <span className="text-sm font-medium text-blue-100">Current Streak</span>
            </div>
            <p className="text-3xl font-bold text-white">4 Days</p>
            <p className="text-xs text-blue-200 mt-2">Keep it up! 🔥</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h3 className="font-bold text-gray-900 mb-6 capitalize">{range} History</h3>
        
        {displayStats.length > 0 ? (
            <div className="h-64 flex items-end gap-2 sm:gap-4">
                {displayStats.map((stat, idx) => {
                    const heightPercentage = maxFocus > 0 ? (stat.focusTime / maxFocus) * 100 : 0;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 pointer-events-none">
                                {formatDuration(stat.focusTime)} on {stat.date}
                            </div>
                            {/* Bar */}
                            <div 
                                className="w-full bg-blue-100 hover:bg-blue-500 transition-colors rounded-t-sm relative group-hover:shadow-md"
                                style={{ height: `${Math.max(heightPercentage, 2)}%` }} // Min height for visibility
                            ></div>
                            {/* Label */}
                            <span className="text-[10px] text-gray-400 mt-2 rotate-0 truncate w-full text-center hidden sm:block">
                                {stat.date.split('-')[2]}
                            </span>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
                No data available for this period.
            </div>
        )}
      </div>

      {/* AI Insights (Mock) */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
            <Zap size={24} />
        </div>
        <div>
            <h3 className="font-bold text-indigo-900 text-lg mb-1">Weekly Insight</h3>
            <p className="text-indigo-700 leading-relaxed">
                You're most productive on <span className="font-bold">Thursday mornings</span>. 
                Your "Deep Coding" sessions have a 94% completion rate, which is 15% higher than your average. 
                Consider scheduling your most complex tasks for Thursday.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;