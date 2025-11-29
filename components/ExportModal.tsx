import React, { useState } from 'react';
import { X, FileText, Table, CheckCircle2, Download, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'json' | 'csv') => void;
  isExporting: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, isExporting }) => {
  const [format, setFormat] = useState<'json' | 'csv'>('csv');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Export Your Data</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
            <div className="text-blue-500 mt-0.5">
              <AlertCircle size={20} />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Your data belongs to you</p>
              <p className="opacity-80">
                You can export a complete copy of your focus sessions, statistics, and configuration at any time.
              </p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Format</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                format === 'csv'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Table size={24} className={format === 'csv' ? 'text-blue-500' : 'text-gray-400'} />
              <div className="text-center">
                <span className="block font-bold text-sm">CSV</span>
                <span className="block text-xs opacity-75">Spreadsheets</span>
              </div>
              {format === 'csv' && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle2 size={16} /></div>}
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                format === 'json'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FileText size={24} className={format === 'json' ? 'text-blue-500' : 'text-gray-400'} />
              <div className="text-center">
                <span className="block font-bold text-sm">JSON</span>
                <span className="block text-xs opacity-75">Raw Data</span>
              </div>
              {format === 'json' && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle2 size={16} /></div>}
            </button>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between text-sm text-gray-500 px-2">
               <span>Focus Sessions</span>
               <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">INCLUDED</span>
             </div>
             <div className="flex items-center justify-between text-sm text-gray-500 px-2">
               <span>Daily Statistics</span>
               <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">INCLUDED</span>
             </div>
             <div className="flex items-center justify-between text-sm text-gray-500 px-2">
               <span>App Preferences</span>
               <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">INCLUDED</span>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onExport(format)}
            disabled={isExporting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
          >
            {isExporting ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Exporting...
                </>
            ) : (
                <>
                    <Download size={18} />
                    Export Data
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;