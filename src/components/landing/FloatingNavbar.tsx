import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Shield, Lock, Sparkles, Flame, AlertTriangle, RotateCcw, User } from 'lucide-react';
import { AppView } from '../common/Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface FloatingNavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activePillar?: number; // 1 = Home, 2 = Discover, 3 = Protect, 4 = Rehearse
  onOpenUnlock?: () => void;
  onResetData?: () => void;
  onOpenAuth?: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentView,
  onNavigate,
  activePillar = 1,
  onOpenUnlock,
  onResetData,
  onOpenAuth,
}) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoSettled, setIsLogoSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoSettled(true);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { id: 1, label: 'Home', view: 'landing' as AppView },
    { id: 2, label: 'Discover', view: 'discover' as AppView },
    { id: 3, label: 'Protect', view: 'protect' as AppView },
    { id: 4, label: 'Rehearse', view: 'rehearse' as AppView },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-none no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Official IN CASE Logo with exact proportions */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <button
            onClick={() => onNavigate('landing')}
            className="flex flex-col items-start text-left group transition-all duration-200 outline-none"
            title="IN CASE — Home"
          >
            <div
              className={`transform transition-all duration-200 ease-out group-hover:scale-[1.025] group-hover:brightness-110 group-hover:drop-shadow-[0_2px_12px_rgba(245,158,11,0.28)] ${
                !isLogoSettled ? 'animate-logo-entrance' : 'animate-logo-idle'
              }`}
            >
              <img
                src="/logo.png"
                alt="IN CASE"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium text-amber-100/85 tracking-normal pl-0.5 mt-0.5 drop-shadow transition-opacity duration-300 ${
                !isLogoSettled ? 'animate-tagline-reveal' : 'opacity-85'
              }`}
            >
              Prepared today. Brighter tomorrows.
            </span>
          </button>
        </div>

        {/* Center: Story Progress Floating Pill Navbar */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-xl pointer-events-auto">
          {navItems.map((item) => {
            const isActive =
              currentView === item.view || (currentView === 'landing' && activePillar === item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-[#fffdfa] text-[#1e293b] shadow-md font-extrabold scale-[1.02]'
                    : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive ? 'bg-[#fef3c7] text-[#b45309]' : 'text-stone-300'
                  }`}
                >
                  {item.id}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Status & Minimal Glass Menu Button */}
        <div className="flex items-center space-x-2.5 pointer-events-auto">
          {/* Supabase Pixar Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="hidden lg:inline-block text-xs font-semibold text-amber-200/90 truncate max-w-[140px] px-2.5 py-1 rounded-full bg-black/30 border border-amber-400/20 backdrop-blur-md">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 text-xs font-bold rounded-full bg-white/10 hover:bg-red-500/20 text-stone-200 hover:text-red-300 border border-white/15 backdrop-blur-md transition"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-900 border border-amber-300/40 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition transform hover:scale-105 active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-stone-900" />
                <span>Sign In</span>
              </button>
            )
          )}

          {/* Emergency / Trusted Unlock quick button */}
          {onOpenUnlock && (
            <button
              onClick={onOpenUnlock}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-full bg-black/35 hover:bg-black/50 text-amber-100 hover:text-white border border-amber-400/30 backdrop-blur-md transition shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock</span>
            </button>
          )}

          {/* Minimal Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Full Screen Menu */}
      {isMobileMenuOpen && (
        <div className="mt-3 p-4 rounded-3xl bg-navy-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl pointer-events-auto md:hidden transition-all animate-in fade-in zoom-in-95">
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/80 px-2 py-1">
              Navigation Pillars
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition ${
                  currentView === item.view
                    ? 'bg-ivory text-warmDark'
                    : 'text-stone-200 hover:bg-white/10'
                }`}
              >
                <span>
                  {item.id}. {item.label}
                </span>
                <span className="text-xs opacity-60">→</span>
              </button>
            ))}

            {user ? (
              <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs">
                <span className="font-semibold text-amber-200 truncate">{user.email}</span>
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="text-red-400 hover:text-red-300 font-bold ml-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              onOpenAuth && (
                <button
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-stone-900 shadow-md"
                >
                  <User className="w-4 h-4 text-stone-900" />
                  <span>Sign In / Create Account</span>
                </button>
              )
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {onOpenUnlock && (
                <button
                  onClick={() => {
                    onOpenUnlock();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-xs font-semibold text-amber-300 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Trusted Unlock</span>
                </button>
              )}

              {onResetData && (
                <button
                  onClick={() => {
                    onResetData();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-200"
                  title="Reset Sample Data"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
