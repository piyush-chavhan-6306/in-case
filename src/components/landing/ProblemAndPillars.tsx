import React from 'react';
import {
  ShieldAlert,
  KeyRound,
  Timer,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  Heart,
} from 'lucide-react';

interface ProblemAndPillarsProps {
  onStartKit: () => void;
  onOpenUnlock: () => void;
}

export const ProblemAndPillars: React.FC<ProblemAndPillarsProps> = ({ onStartKit, onOpenUnlock }) => {
  return (
    <div className="relative w-full text-stone-800 overflow-hidden select-none">
      {/* =========================================================================
          SECTION 1: THE REALITY FAMILIES FACE (Desk, Window, Boy & Dog Scene)
          ========================================================================= */}
      <section className="relative w-full min-h-[950px] lg:min-h-[1050px] flex flex-col justify-between pt-24 pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background Image: The boy and puppy by the window at sunset */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/reality_desk_bg.jpg"
            alt="Warm sunset room with boy and dog looking over desk"
            className="w-full h-full object-cover object-center transform scale-[1.01]"
          />
          {/* Subtle Top & Bottom Gradient Blends */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950 via-navy-950/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1b1511]/90 via-[#261e17]/50 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#fdf8ee]/90 backdrop-blur-md text-amber-900 border border-amber-200/60 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
            <span>💛</span>
            <span>The Reality Families Face</span>
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto mb-4">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-[#1e293b]">
              A vault stores your files. <br />
              <span className="text-[#b45309] drop-shadow-sm">
                In Case proves your family can use them.
              </span>
            </h2>
          </div>

          {/* Subheading Paragraph */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
              When an emergency happens, the deepest obstacle isn't just locked passwords or unorganized PDFs. The deeper problem is:{' '}
              <strong className="text-amber-900 font-bold block mt-1">
                Families may not even know what they are supposed to look for.
              </strong>
            </p>
          </div>

          {/* 3 Real Life Failure Points: Resting on the sunlit wooden desk */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 w-full max-w-5xl mb-16 sm:mb-20">
            {/* Card 1: The Invisible Policies */}
            <div className="p-7 sm:p-8 rounded-[32px] bg-[#fdfbf7]/90 sm:bg-white/88 backdrop-blur-xl border border-white/90 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_55px_-10px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center mb-5 text-white shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-[22px] text-stone-900 mb-2.5 tracking-tight">
                  The Invisible Policies
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-medium">
                  Unclaimed life insurance, forgotten health policies, and orphaned pension funds amount to billions in lost family security simply because survivors didn't know they existed.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onStartKit}
                  className="w-8 h-8 rounded-full bg-[#faebd7] hover:bg-[#f5deb3] text-amber-900 flex items-center justify-center transition shadow-xs border border-[#ebd8c0]"
                  aria-label="Explore Discover"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Card 2: The Nominee Trap */}
            <div className="p-7 sm:p-8 rounded-[32px] bg-[#fdfbf7]/90 sm:bg-white/88 backdrop-blur-xl border border-white/90 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_55px_-10px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center mb-5 text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-[22px] text-stone-900 mb-2.5 tracking-tight">
                  The Nominee Trap
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-medium">
                  An account without a registered nominee forces grieving relatives into months of court probate, succession certificate filings, and frozen bank accounts.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onStartKit}
                  className="w-8 h-8 rounded-full bg-[#ffedd5] hover:bg-[#fed7aa] text-orange-900 flex items-center justify-center transition shadow-xs border border-[#fdba74]/60"
                  aria-label="Explore Protect"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Card 3: The 24-Hour Panic */}
            <div className="p-7 sm:p-8 rounded-[32px] bg-[#fdfbf7]/90 sm:bg-white/88 backdrop-blur-xl border border-white/90 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_55px_-10px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center mb-5 text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
                  <Timer className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-[22px] text-stone-900 mb-2.5 tracking-tight">
                  The 24-Hour Panic
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-medium">
                  In a hospital ICU, cash desk approvals need policy numbers within 24 hours. Families don't have time to sift through thousands of emails or paper binders.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onStartKit}
                  className="w-8 h-8 rounded-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-sky-900 flex items-center justify-center transition shadow-xs border border-[#bae6fd]"
                  aria-label="Explore Rehearse"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Section Transition: The In Case System Header */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 px-4 py-1.5 rounded-full bg-[#fdf8ee]/90 border border-amber-300/60 shadow-sm mb-3 inline-block">
              The In Case System
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1e293b] mb-2 tracking-tight">
              Four Pillars of Family Readiness
            </h3>
            <p className="text-sm text-stone-700 font-medium tracking-normal mb-3">
              Discover. Protect. Rehearse. Be Ready.
            </p>
            <span className="text-amber-600 text-lg animate-pulse">🧡</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE 4 PILLARS & INTERACTIVE LOOP BANNER
          ========================================================================= */}
      <section className="relative w-full bg-[#1b1511] text-stone-200 py-16 px-4 sm:px-8 lg:px-12 border-t border-amber-900/30">
        <div className="max-w-6xl mx-auto">
          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Pillar 1: Discover */}
            <div className="p-6 rounded-[28px] bg-white/[0.07] backdrop-blur-md border border-white/12 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider">PILLAR 01</span>
                <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">DISCOVER</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  Upload a 6-month bank statement CSV. In Case automatically normalizes merchants and identifies recurring insurance, loans, SIPs, and utilities.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
                <span>Zero manual typing</span>
              </div>
            </div>

            {/* Pillar 2: Protect */}
            <div className="p-6 rounded-[28px] bg-white/[0.07] backdrop-blur-md border border-white/12 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center mb-4">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider">PILLAR 02</span>
                <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">PROTECT</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  Client-side AES-256 encryption. The key is split into 3 Shamir shares (2-of-3 threshold). Any 2 trusted people can unlock the emergency blueprint.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
                <span>No single point of failure</span>
              </div>
            </div>

            {/* Pillar 3: Rehearse */}
            <div className="p-6 rounded-[28px] bg-white/[0.07] backdrop-blur-md border border-white/12 hover:border-rose-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-300 flex items-center justify-center mb-4">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-rose-400 tracking-wider">PILLAR 03</span>
                <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">REHEARSE</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  The Family Fire Drill tests your trusted person with timed real questions derived from the inventory. Computes a 0–100 Readiness Score based on real drill speed.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-rose-300 font-semibold">
                <span>Proof over confidence</span>
              </div>
            </div>

            {/* Pillar 4: Act */}
            <div className="p-6 rounded-[28px] bg-white/[0.07] backdrop-blur-md border border-white/12 hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-300 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-sky-400 tracking-wider">PILLAR 04</span>
                <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">ACT</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  Emergency Mode breaks down immediate chaos into prioritized buckets: NOW (First 24h), Next 7 Days, and Next 30 Days, accompanied by a grounded Copilot.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-sky-300 font-semibold">
                <span>Clear, calm execution</span>
              </div>
            </div>
          </div>

          {/* Interactive Readiness Loop Banner */}
          <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-white/[0.1] to-white/[0.03] border border-white/15 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 mb-3 inline-block">
                  Interactive Family Readiness Loop
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
                  Experience the complete 2-minute readiness loop.
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-medium">
                  Try Auto-Discovery with our pre-loaded synthetic 6-month bank statement, encrypt with 2-of-3 keys, run a simulated Fire Drill, and generate your printable Emergency Card.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <button
                  onClick={onOpenUnlock}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/12 hover:bg-white/20 text-stone-200 font-semibold text-sm border border-white/20 transition flex items-center justify-center space-x-2 shadow-sm"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>Simulate 2-of-3 Unlock</span>
                </button>

                <button
                  onClick={onStartKit}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 hover:scale-[1.02]"
                >
                  <span>Create Your Emergency Kit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Security Honesty Disclosure */}
          <div className="mt-10 text-center text-xs text-stone-400 max-w-2xl mx-auto flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Security Honesty:</strong> Client-side WebCrypto AES-256-GCM + 2-of-3 Shamir Secret Sharing. Demo financial data is synthetic. Zero external transmission.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
