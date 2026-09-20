import React from 'react';
import {
  Trophy,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Timer,
  Play,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ReadinessScore, DrillRecord, InventoryItem } from '../../types';
import { calculateReadinessScore } from '../../utils/sampleData';

interface ReadinessScoreViewProps {
  items: InventoryItem[];
  drillHistory: DrillRecord[];
  onStartDrill: () => void;
  onProceedToPlaybook: () => void;
}

export const ReadinessScoreView: React.FC<ReadinessScoreViewProps> = ({
  items,
  drillHistory,
  onStartDrill,
  onProceedToPlaybook,
}) => {
  const latestDrill = drillHistory[0] || null;
  const readiness = calculateReadinessScore(items, latestDrill ? latestDrill.score : null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-accent-amber border-accent-amber/30 bg-accent-amber/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="w-full select-none">
      {/* 1. Full-Width Hero Section with sunset desk background: /rehearse_hero_bg.png */}
      <div className="relative w-full min-h-[660px] sm:min-h-[740px] flex items-center justify-center pt-24 sm:pt-28 pb-14 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/rehearse_hero_bg.png"
            alt="Warm sunset desk with family photo and golden retriever puppy"
            className="w-full h-full object-cover object-center transform scale-[1.01]"
          />
          {/* Subtle bottom gradient to blend cleanly into the warm page */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 via-black/20 to-transparent" />
        </div>

        {/* Readiness Card resting physically on the sunny wooden desk */}
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#ffe4e6] text-[#be123c] border border-[#fecdd3] text-xs font-black uppercase tracking-wider mb-2 shadow-2xs">
              <Timer className="w-3.5 h-3.5" />
              <span>Module 03 — Family Rehearsal & Readiness</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1e293b] tracking-tight mb-1 drop-shadow-xs">
              Readiness Score: Proof Over Confidence
            </h2>
            <p className="text-xs sm:text-[13px] text-[#475569] font-semibold leading-relaxed drop-shadow-2xs">
              Unlike ordinary vaults that measure how much you stored, In Case measures whether your trusted family can actually locate and understand the information under pressure.
            </p>
          </div>

          {/* Main Composite Score Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
              boxShadow: '0 25px 60px -12px rgba(245, 158, 11, 0.25), 0 20px 45px -10px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
            className="rounded-[38px] sm:rounded-[44px] p-7 sm:p-9 border-2 border-white relative overflow-hidden"
          >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Circular / Large Score Badge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-44 h-44 rounded-full border-4 border-[#ebdccb] flex flex-col items-center justify-center p-4 bg-[#fbf7f0] shadow-inner">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#786b5f]">
                Composite Score
              </span>
              <span className="font-display font-black text-6xl sm:text-7xl text-[#1e293b] tracking-tight my-0.5">
                {readiness.total}
              </span>
              <span className="text-xs text-[#0284c7] font-bold">out of 100</span>

              {/* Glowing perimeter indicator */}
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0ea5e9] border-r-[#38bdf8] pointer-events-none"
                style={{ transform: `rotate(${readiness.total * 3.6}deg)` }}
              />
            </div>

            <div className="mt-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${getScoreColor(readiness.total)}`}>
                {readiness.total >= 80 ? 'High Preparedness' : readiness.total >= 60 ? 'Moderate Preparedness' : 'Action Required'}
              </span>
            </div>
          </div>

          {/* 3 Component Pillars Breakdown */}
          <div className="flex-1 w-full space-y-4">
            <h4 className="font-display font-black text-lg text-[#1e293b] mb-2">
              Score Composition Breakdown:
            </h4>

            {/* Coverage Score */}
            <div className="p-4 rounded-2xl bg-[#f6f1e8] border border-[#dfd4c4] shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#1e293b] mb-2">
                <span className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#0ea5e9]" />
                  <span>Category Coverage</span>
                </span>
                <span className="font-mono text-[#0284c7] font-black">{readiness.coverageScore} / 35 pts</span>
              </div>
              <div className="w-full h-2.5 bg-white border border-[#dfd4c4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
                  style={{ width: `${(readiness.coverageScore / 35) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1.5 font-medium">
                Representation across core pillars (Insurance, Loans, Investments, Utilities).
              </p>
            </div>

            {/* Risk Score */}
            <div className="p-4 rounded-2xl bg-[#f6f1e8] border border-[#dfd4c4] shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#1e293b] mb-2">
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                  <span>Nominee & Document Resolution</span>
                </span>
                <span className="font-mono text-[#b45309] font-black">{readiness.riskScore} / 35 pts</span>
              </div>
              <div className="w-full h-2.5 bg-white border border-[#dfd4c4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
                  style={{ width: `${(readiness.riskScore / 35) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1.5 font-medium">
                Penalties deducted for missing nominees and unspecified document locations.
              </p>
            </div>

            {/* Drill Score */}
            <div className="p-4 rounded-2xl bg-[#f6f1e8] border border-[#dfd4c4] shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#1e293b] mb-2">
                <span className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-[#e11d48]" />
                  <span>Family Fire Drill Performance</span>
                </span>
                <span className="font-mono text-[#be123c] font-black">{readiness.drillScore} / 30 pts</span>
              </div>
              <div className="w-full h-2.5 bg-white border border-[#dfd4c4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f43f5e] rounded-full transition-all duration-500"
                  style={{ width: `${(readiness.drillScore / 30) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1.5 font-medium">
                Timed accuracy in answering actual questions about policies and access points.
              </p>
            </div>
          </div>
        </div>

        {/* Prototype Honesty Disclaimer */}
        <div className="mt-8 pt-5 border-t border-[#ebdccb]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786b5f]">
          <div className="flex items-center space-x-2 font-medium">
            <HelpCircle className="w-4 h-4 text-[#a6998b] flex-shrink-0" />
            <span>Prototype readiness metric for educational simulation, not a financial or legal audit.</span>
          </div>

          <button
            onClick={onStartDrill}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold shadow-sm transition flex items-center space-x-2 flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Take 60s Fire Drill</span>
          </button>
        </div>
      </div>

      {/* Drill History (PRD Section 22) */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 border-2 border-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] flex items-center justify-center text-[#15803d] border border-[#bbf7d0] shadow-2xs">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-[#1e293b]">Rehearsal History</h4>
              <p className="text-xs text-[#64748b] font-medium">Progressive improvement through regular family drills</p>
            </div>
          </div>

          <span className="text-xs text-[#786b5f] font-mono font-bold px-3 py-1 rounded-full bg-[#f6f1e8] border border-[#dfd4c4]">
            {drillHistory.length} Rehearsals Recorded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {drillHistory.slice(0, 3).map((d, idx) => (
            <div
              key={d.id}
              className={`p-4 rounded-2xl border transition shadow-2xs ${
                idx === 0
                  ? 'bg-[#f0f9ff] border-[#bae6fd] ring-1 ring-[#0ea5e9]/30'
                  : 'bg-[#f6f1e8] border-[#dfd4c4]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0369a1]">
                  {idx === 0 ? 'Today (Latest Drill)' : idx === 1 ? 'Previous Rehearsal' : 'Baseline Drill'}
                </span>
                <span className="text-xs text-[#786b5f] font-mono font-semibold">{d.timestamp}</span>
              </div>
              <div className="flex items-baseline space-x-2 my-1">
                <span className="font-display font-black text-2xl text-[#1e293b]">{d.score}%</span>
                <span className="text-xs text-[#64748b] font-medium">({d.correctAnswers}/{d.totalQuestions} correct)</span>
              </div>
              <span className="text-[11px] text-[#64748b] font-medium flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#94a3b8]" />
                <span>Completed in {d.durationSec}s</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA: Move to Module 4 (Act) */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
      >
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#15803d] block mb-1">
            Module 04 — Emergency Action Playbook
          </span>
          <h4 className="font-display font-black text-xl text-[#1e293b]">
            Access Emergency Mode & In Case Copilot
          </h4>
          <p className="text-xs text-[#64748b] font-medium mt-0.5">
            View the prioritized 24-Hour, 7-Day, and 30-Day playbooks with grounded AI assistance.
          </p>
        </div>

        <button
          onClick={onProceedToPlaybook}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-[0_10px_25px_rgba(234,88,12,0.38)] flex-shrink-0"
        >
          <span>Open Emergency Mode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
