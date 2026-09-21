import React from 'react';
import { Shield, Lock, Unlock, AlertOctagon, Sparkles, KeyRound, RotateCcw } from 'lucide-react';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'discover'
  | 'documents'
  | 'protect'
  | 'rehearse'
  | 'emergency'
  | 'manager'
  | 'print';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isUnlocked: boolean;
  itemCount: number;
  onOpenUnlock: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isUnlocked,
  itemCount,
  onOpenUnlock,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-navy-950/85 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-sky via-accent-cyan to-accent-amber p-0.5 shadow-md shadow-accent-sky/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-sky" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-accent-sky transition">
                IN CASE
              </span>
              <span className="text-[10px] font-bold text-accent-sky/90 uppercase px-1.5 py-0.2 rounded bg-accent-sky/10 border border-accent-sky/20">
                PROTOTYPE
              </span>
            </div>
          </div>
        </button>

        {/* 4 Pillars Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-1 bg-navy-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              currentView === 'landing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cinematic Story
          </button>

          <button
            onClick={() => onNavigate('discover')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              currentView === 'discover'
                ? 'bg-accent-sky text-navy-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Discover</span>
            {itemCount > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-navy-900/30">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('protect')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              currentView === 'protect'
                ? 'bg-accent-amber text-navy-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Protect
          </button>

          <button
            onClick={() => onNavigate('rehearse')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              currentView === 'rehearse'
                ? 'bg-rose-500 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Rehearse
          </button>

          <button
            onClick={() => onNavigate('emergency')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              currentView === 'emergency'
                ? 'bg-emerald-500 text-navy-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>4. Emergency Mode</span>
          </button>
        </nav>

        {/* Right Actions: Lock / Unlock & Reset */}
        <div className="flex items-center space-x-2.5">
          {/* Lock State Pill */}
          <button
            onClick={onOpenUnlock}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${
              isUnlocked
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-navy-900 text-accent-amber border-slate-700 hover:bg-slate-800'
            }`}
          >
            {isUnlocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Kit Unlocked</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-accent-amber" />
                <span>2-of-3 Unlock</span>
              </>
            )}
          </button>

          {/* Quick Demo Reset */}
          <button
            onClick={onResetData}
            title="Reset to initial demo state"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-navy-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
