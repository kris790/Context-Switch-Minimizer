import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, BarChart2, Settings, LogOut, Target } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isPro: boolean;
  onUpgradeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isPro, onUpgradeClick }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg">
           <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h1 className="font-bold text-gray-900 leading-tight">Context<br/>Minimizer</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
              currentView === item.id
                ? 'bg-blue-50 text-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {!isPro && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <h3 className="font-bold text-sm mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-blue-100 mb-3 opacity-90">Get unlimited sessions & historical stats.</p>
            <button 
              onClick={onUpgradeClick}
              className="w-full bg-white text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Save 37% Annual
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                JD
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
            <LogOut size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;