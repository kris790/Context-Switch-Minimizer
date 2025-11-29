import React, { useState } from 'react';
import { UserSettings } from '../types';
import { User, CreditCard, Bell, Shield, Smartphone, LogOut, Download, FileText } from 'lucide-react';
import { storage } from '../utils';

interface SettingsProps {
    settings: UserSettings;
    onExportClick: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock handlers for toggles
  const [strictMode, setStrictMode] = useState(false);
  const [emailReports, setEmailReports] = useState(true);

  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate processing time
    setTimeout(() => {
        const sessions = storage.getSessions();
        const stats = storage.getStats();
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
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Settings</h2>
        <p className="text-neutral-500 mt-2 text-lg">Manage your account and preferences</p>
      </div>

      <div className="space-y-8">
        
        {/* Account Section */}
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-card">
            <div className="p-8 border-b border-neutral-50">
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-3">
                    <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-500"><User size={20} /></div>
                    Account
                </h3>
            </div>
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-neutral-900">John Doe</p>
                        <p className="text-sm text-neutral-500">john.doe@example.com</p>
                    </div>
                    <button className="px-5 py-2 text-sm font-semibold text-neutral-600 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200">Edit</button>
                </div>
                <div className="h-px bg-neutral-50"></div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-neutral-900">Daily Goal</p>
                        <p className="text-sm text-neutral-500">{Math.floor(settings.dailyGoal / 60)} hours per day</p>
                    </div>
                    <button className="px-5 py-2 text-sm font-semibold text-neutral-600 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200">Change</button>
                </div>
            </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-card relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-primary-900 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <CreditCard size={120} />
             </div>
            <div className="p-8 border-b border-neutral-50">
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 rounded-xl text-primary-500"><CreditCard size={20} /></div>
                    Subscription
                </h3>
            </div>
            <div className="p-8">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-xl text-neutral-900">Free Plan</span>
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold tracking-wide rounded-lg uppercase border border-neutral-200">Current</span>
                        </div>
                        <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
                            You're currently on the free plan. Upgrade to Pro to unlock unlimited sessions, historical analytics, and premium support.
                        </p>
                    </div>
                    <button className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary-200 transform hover:-translate-y-0.5">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-card">
            <div className="p-8 border-b border-neutral-50">
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500"><Bell size={20} /></div>
                    Notifications & Privacy
                </h3>
            </div>
            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-neutral-900">Strict Redirect Mode</p>
                            <p className="text-sm text-neutral-500 mt-0.5">Make it harder to skip the distraction warning</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                        <input 
                            type="checkbox" 
                            name="strictMode" 
                            id="strictMode" 
                            checked={strictMode}
                            onChange={(e) => setStrictMode(e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-neutral-200 transition-all duration-300"
                        />
                        <label htmlFor="strictMode" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${strictMode ? 'bg-primary-500' : 'bg-neutral-200'}`}></label>
                    </div>
                </div>
                
                <div className="h-px bg-neutral-50"></div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-neutral-900">Weekly Email Reports</p>
                            <p className="text-sm text-neutral-500 mt-0.5">Receive summary of your productivity every Monday</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none">
                        <input 
                            type="checkbox" 
                            name="emailReports" 
                            id="emailReports" 
                            checked={emailReports}
                            onChange={(e) => setEmailReports(e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-neutral-200 transition-all duration-300"
                        />
                        <label htmlFor="emailReports" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${emailReports ? 'bg-primary-500' : 'bg-neutral-200'}`}></label>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-card">
            <div className="p-8 border-b border-neutral-50">
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-3">
                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600"><Download size={20} /></div>
                    Data Export
                </h3>
            </div>
            <div className="p-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-neutral-900">Export your data</p>
                            <p className="text-sm text-neutral-500 mt-0.5">Download all your session logs and statistics in JSON format.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="px-6 py-3 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                    >
                        {isExporting ? 'Preparing...' : 'Download JSON'}
                    </button>
                </div>
            </div>
        </div>

        <button className="w-full py-5 text-danger-600 font-semibold hover:bg-danger-50 rounded-2xl transition-colors border border-transparent hover:border-danger-100 flex items-center justify-center gap-2 mt-4">
            <LogOut size={20} />
            Sign Out
        </button>

      </div>
    </div>
  );
};

export default Settings;