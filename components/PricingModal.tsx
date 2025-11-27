import React, { useState } from 'react';
import { X, Check, Zap, Infinity, BarChart2, Smartphone, Shield } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Value Prop */}
        <div className="bg-slate-900 text-white p-8 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 leading-tight">Unlock your<br/>full potential.</h2>
            <p className="text-slate-300 text-sm mb-8">
              Join thousands of knowledge workers who reclaim 4+ weeks of productivity every year.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                  <Infinity size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Unlimited Sessions</h4>
                  <p className="text-xs text-slate-400">Create as many templates as you need for every workflow.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400 mt-0.5">
                  <BarChart2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Historical Analytics</h4>
                  <p className="text-xs text-slate-400">View trends over months and years, not just days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-500/20 rounded-lg text-green-400 mt-0.5">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Strict Mode</h4>
                  <p className="text-xs text-slate-400">Advanced tools to prevent disabling distractions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-8 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs">
                    Use
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Trusted by 10,000+ users</p>
            </div>
          </div>
        </div>

        {/* Right Side: Pricing */}
        <div className="bg-white p-8 md:w-3/5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>

          <div className="text-center mb-8 mt-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose your plan</h3>
            
            <div className="inline-flex bg-gray-100 p-1 rounded-xl relative">
              <div 
                className={`absolute top-1 bottom-1 w-[50%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
                  billingCycle === 'monthly' ? 'left-1' : 'left-[calc(50%-4px)] translate-x-[calc(0%+4px)]'
                }`}
              ></div>
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-6 py-2 text-sm font-medium transition-colors w-32 ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`relative z-10 px-6 py-2 text-sm font-medium transition-colors w-32 flex items-center justify-center gap-2 ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Annual
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full uppercase">Save 37%</span>
              </button>
            </div>
          </div>

          <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {billingCycle === 'annual' ? '$5' : '$8'}
              </span>
              <span className="text-gray-500 mb-1">/ month</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {billingCycle === 'annual' ? 'Billed as one payment of $60' : 'Billed monthly, cancel anytime'}
            </p>

            <button 
              onClick={onUpgrade}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Zap size={18} className="fill-white" />
              Upgrade to Pro
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">14-day money-back guarantee</p>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span>Unlimited sessions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span>Cross-device sync</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <span>Export data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;