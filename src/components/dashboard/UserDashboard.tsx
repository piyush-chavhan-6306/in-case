import React from 'react';
import {
  ShieldCheck,
  Lock,
  Timer,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle,
  Clock,
  HeartPulse,
  Download,
  FolderOpen,
  KeyRound,
  Play,
  Activity,
  Layers,
  Shield,
  FileCheck,
  User as UserIcon,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { InventoryItem, VaultData, TrustedShare, DrillRecord, FinancialDocument } from '../../types';
import { calculateReadinessScore } from '../../utils/sampleData';
import { AppView } from '../common/Navbar';

interface UserDashboardProps {
  user: User | null;
  items: InventoryItem[];
  vault: VaultData | null;
  shares: TrustedShare[];
  drillHistory: DrillRecord[];
  documents: FinancialDocument[];
  onNavigate: (view: AppView) => void;
  onStartDrill: () => void;
  onOpenUnlock: () => void;
  onOpenTour?: () => void;
  onOpenProfile?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  items,
  vault,
  shares,
  drillHistory,
  documents,
  onNavigate,
  onStartDrill,
  onOpenUnlock,
  onOpenTour,
  onOpenProfile,
}) => {
  const latestDrill = drillHistory[0] || null;
  const readiness = calculateReadinessScore(items, latestDrill ? latestDrill.score : null);
  const overallScore = readiness.total;
  const readinessLevel = overallScore >= 80 ? 'Crisis Ready' : overallScore >= 60 ? 'Prepared' : 'Needs Action';

  // Total valuation
  const totalValuation = items.reduce((acc, curr) => acc + (curr.amountApprox || 0), 0);
  const itemsWithoutNominee = items.filter(
    (item) => item.nomineeStatus === 'not_set' || item.nomineeStatus === 'unknown'
  );

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const userDisplayName = user?.email?.split('@')[0] || 'Family Guardian';

  return (
    <div className="w-full select-none">
      {/* Hero Welcome Banner */}
      <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/rehearse_hero_bg.png"
            alt="Warm living room with family photo"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/80 to-navy-950/85" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Dedicated Family Command Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Welcome back, <span className="capitalize text-amber-300">{userDisplayName}</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Your personal family contingency hub. All secret shares, fire drill simulations, and financial documents are strictly isolated and zero-knowledge protected.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white font-bold text-xs border border-amber-400/30 backdrop-blur-md transition shadow-2xs"
                title="Manage Family Profile, Nominee & Medical details"
              >
                <UserIcon className="w-4 h-4 text-amber-300" />
                <span>Family Profile</span>
              </button>
            )}

            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white font-bold text-xs border border-white/20 backdrop-blur-md transition"
                title="Start interactive product tour"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Quick Tour</span>
              </button>
            )}

            <button
              onClick={onStartDrill}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-[0_4px_25px_rgba(245,158,11,0.35)] transition transform hover:scale-105 active:scale-95"
            >
              <Timer className="w-4 h-4 text-stone-950" />
              <span>Launch Fire Drill (45s)</span>
            </button>

            <button
              onClick={() => onNavigate('emergency')}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-400/30 backdrop-blur-md transition"
            >
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Emergency Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-24 -mt-6 relative z-10 space-y-8">
        
        {/* Core Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Family Readiness Score */}
          <div
            onClick={() => onNavigate('rehearse')}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Readiness Score</span>
              <Timer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-stone-900 font-display">
                {overallScore}
              </span>
              <span className="text-stone-400 text-sm font-bold">/ 100</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                {readinessLevel}
              </span>
              <span className="text-stone-400 group-hover:text-stone-700 transition">
                {drillHistory.length} drills logged →
              </span>
            </div>
          </div>

          {/* Card 2: Shamir 2-of-3 Guardians */}
          <div
            onClick={() => onNavigate('protect')}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Shamir Guardians</span>
              <KeyRound className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-stone-900 font-display">
                {shares.length > 0 ? shares.length : 0}
              </span>
              <span className="text-stone-400 text-sm font-bold">Guardians</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md ${
                shares.length > 0 ? 'text-blue-700 bg-blue-50' : 'text-stone-500 bg-stone-100'
              }`}>
                {shares.length > 0 ? '2-of-3 Threshold Active' : 'Not Configured'}
              </span>
              <span className="text-stone-400 group-hover:text-stone-700 transition">
                {shares.length > 0 ? 'Manage →' : 'Setup →'}
              </span>
            </div>
          </div>

          {/* Card 3: Financial Documents */}
          <div
            onClick={() => onNavigate('documents')}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Document Vault</span>
              <FileText className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-stone-900 font-display">
                {documents.length}
              </span>
              <span className="text-stone-400 text-sm font-bold">Certificates</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md ${
                documents.length > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 bg-stone-100'
              }`}>
                {documents.length > 0 ? 'View & Download Ready' : 'Vault Empty'}
              </span>
              <span className="text-stone-400 group-hover:text-stone-700 transition">
                {documents.length > 0 ? 'Open →' : 'Upload →'}
              </span>
            </div>
          </div>

          {/* Card 4: Discovered Inventory */}
          <div
            onClick={() => onNavigate('discover')}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Discovered Assets</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 font-display truncate">
                {items.length > 0 ? formatCurrency(totalValuation) : '₹0'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md ${
                items.length > 0 ? 'text-purple-700 bg-purple-50' : 'text-stone-500 bg-stone-100'
              }`}>
                {items.length > 0 ? `${items.length} Tracked Accounts` : 'Clean Profile'}
              </span>
              <span className="text-stone-400 group-hover:text-stone-700 transition">
                {items.length > 0 ? 'Inventory →' : 'Add First Asset →'}
              </span>
            </div>
          </div>

        </div>

        {/* Fresh Profile Onboarding Banner */}
        {items.length === 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-3xl p-6 sm:p-8 border border-amber-300/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Clean Slate Active</span>
              </div>
              <h3 className="text-xl font-black text-stone-900">Start Your Family Contingency Hub</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                Your profile is completely fresh with zero dummy records. Upload a statement in Discover or manually log your insurance policies, FDs, and loans to initialize your family inventory.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('discover')}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition transform active:scale-95 flex items-center space-x-1.5"
              >
                <span>Open Discover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenTour && (
                <button
                  onClick={onOpenTour}
                  className="px-4 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-stone-300 transition"
                >
                  Take 1-Min Tour
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feature Command Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 1: Shamir 2-of-3 Secret Sharing Deep Dive */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-stone-900">
                    Shamir 2-of-3 Secret Guardians
                  </h3>
                  <p className="text-xs text-stone-500">
                    Mathematically split master key among family guardians
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                Cryptographic Threshold
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-3">
              <p className="text-stone-700 leading-relaxed">
                Your master AES-256 key is split into 3 independent polynomials. Any single share reveals zero information. During emergencies, <strong>any 2 guardians</strong> recombining their shares instant decrypt your vault.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Share 1</span>
                  <span className="font-bold text-stone-800 text-xs">Spouse</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Share 2</span>
                  <span className="font-bold text-stone-800 text-xs">Sibling</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Share 3</span>
                  <span className="font-bold text-stone-800 text-xs">Trusted Friend</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onOpenUnlock}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Test Guardian Unlock</span>
              </button>

              <button
                onClick={() => onNavigate('protect')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
              >
                <span>Manage Shamir Keys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 2: Family Fire Drill Readiness */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600">
                  <Timer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-stone-900">
                    Family Fire Drill Simulator
                  </h3>
                  <p className="text-xs text-stone-500">
                    Timed 45-second crisis simulations for family readiness
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900">
                45s Timed Drill
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700">Latest Drill Result:</span>
                <span className="font-mono font-bold text-stone-900">
                  {latestDrill ? `${latestDrill.score}% (${latestDrill.correctAnswers}/${latestDrill.totalQuestions} correct in ${latestDrill.durationSec}s)` : 'Not yet simulated'}
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Tests your family's ability to recall where health cards are kept, identify term insurance nominees, and execute cashless hospital admission without panic.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onNavigate('rehearse')}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>View Historical Records</span>
              </button>

              <button
                onClick={onStartDrill}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Fire Drill Now</span>
              </button>
            </div>
          </div>

        </div>

        {/* Section 3: Financial Documents & Crisis Manager Quick Hub */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Crisis Suite
                </span>
                <span className="text-xs text-stone-400">• Real-Time Contingency Hub</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Financial Documents &amp; Crisis Triage
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('documents')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition"
              >
                Open Documents Vault
              </button>
              <button
                onClick={() => onNavigate('manager')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition"
              >
                Crisis Manager
              </button>
            </div>
          </div>

          {/* Quick Documents Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {documents.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onNavigate('documents')}
                className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 hover:border-amber-400/50 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold text-[10px] uppercase">{doc.category}</span>
                  <span className="text-stone-400 text-[10px]">{(doc.compressedSize / 1024).toFixed(0)} KB</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate">
                  {doc.name}
                </h4>
                <p className="text-[11px] text-stone-400 font-mono">Ref: {doc.policyOrAccountNumber}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
