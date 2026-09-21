import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Search,
  KeyRound,
  Timer,
  FileText,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { setTourCompleted } from '../../utils/storage';
import { AppView } from '../common/Navbar';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onNavigate: (view: AppView) => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  userId,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleFinish = (targetView: AppView = 'dashboard') => {
    setTourCompleted(userId);
    onClose();
    onNavigate(targetView);
  };

  const steps = [
    {
      id: 'welcome',
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      tag: 'Step 1 of 5 • Welcome',
      title: 'Welcome to Your Fresh Family Vault',
      subtitle: 'A clean slate — strictly isolated and zero-knowledge protected',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            You are starting with a <strong>100% clean profile</strong>. There is no fake data, no simulated accounts, and no public exposure.
          </p>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1.5">
            <span className="font-bold block flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 inline" />
              <span>Zero-Knowledge Architecture</span>
            </span>
            <p className="text-xs text-amber-800">
              Your sensitive asset numbers and family details are encrypted directly in your browser using WebCrypto AES-256 before any storage.
            </p>
          </div>
        </div>
      ),
      highlightColor: 'from-amber-500 to-orange-500',
    },
    {
      id: 'discover',
      icon: <Search className="w-8 h-8 text-blue-500" />,
      tag: 'Step 2 of 5 • Pillar 1',
      title: 'Discover & Map Your Family Assets',
      subtitle: 'Build your comprehensive financial inventory in minutes',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Start by navigating to <strong>Discover</strong>. You can upload bank statements or manually add:
          </p>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Term Life &amp; Health Insurance Policies</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Mutual Fund SIP Folios &amp; Demat Accounts</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Fixed Deposits, Sovereign Gold Bonds &amp; Home Loans</span>
            </li>
          </ul>
          <p className="text-xs text-stone-500 italic">
            Tip: Always verify that a registered nominee name is assigned to prevent probate delays!
          </p>
        </div>
      ),
      highlightColor: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'protect',
      icon: <KeyRound className="w-8 h-8 text-amber-600" />,
      tag: 'Step 3 of 5 • Pillar 2',
      title: 'Shamir 2-of-3 Secret Key Protection',
      subtitle: 'Mathematically split your vault key among trusted guardians',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            In the <strong>Protect</strong> module, your master key is split into 3 independent mathematical shares (e.g. Spouse, Sibling, Trusted Friend).
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="font-bold text-stone-800 block">Share 1</span>
              <span className="text-[11px] text-stone-500">Spouse</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="font-bold text-stone-800 block">Share 2</span>
              <span className="text-[11px] text-stone-500">Sibling</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="font-bold text-stone-800 block">Share 3</span>
              <span className="text-[11px] text-stone-500">Attorney</span>
            </div>
          </div>
          <p className="text-xs text-stone-600">
            No single guardian can peek into your vault. In any emergency, <strong>any 2 guardians</strong> recombining their shares instant decrypt your full family kit.
          </p>
        </div>
      ),
      highlightColor: 'from-amber-600 to-amber-700',
    },
    {
      id: 'rehearse',
      icon: <Timer className="w-8 h-8 text-rose-500" />,
      tag: 'Step 4 of 5 • Pillar 3',
      title: 'Family Fire Drill Simulations',
      subtitle: 'Practice emergency readiness with 45-second timed simulations',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Financial safety is useless if family members don't know where documents are kept or who to call.
          </p>
          <p>
            The <strong>Family Fire Drill</strong> generates timed scenario questions based on your actual assets:
          </p>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-medium">
            "Which hospital network accepts your cashless card? Where is the physical loan deed kept? Who is the term life nominee?"
          </div>
          <p className="text-xs text-stone-500">
            Each drill updates your personal <strong>Family Readiness Score (0–100)</strong>.
          </p>
        </div>
      ),
      highlightColor: 'from-rose-500 to-red-600',
    },
    {
      id: 'documents_manager',
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      tag: 'Step 5 of 5 • Crisis Suite',
      title: 'Document Hub & Crisis Manager',
      subtitle: 'Certified PDF viewer, instant download, and step-by-step triage',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            <strong>Documents Hub:</strong> Store policy bonds, CAS statements, and wills. View them in-browser with our certified document viewer or download copies anytime.
          </p>
          <p>
            <strong>Crisis Manager:</strong> When a crisis strikes (Hospitalization, Bereavement, Accident), access your 3-phase action roadmap for the First 24 Hours, Next 7 Days, and Next 30 Days.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold">
            Ready to secure your family? Click "Start with Discover" below!
          </div>
        </div>
      ),
      highlightColor: 'from-emerald-500 to-teal-600',
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Top Accent Gradient Bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${current.highlightColor}`} />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            {current.tag}
          </span>
          <button
            onClick={() => handleFinish('dashboard')}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200/80 shrink-0">
              {current.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900 leading-tight">
                {current.title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="pt-2">{current.content}</div>
        </div>

        {/* Step Dots & Navigation Footer */}
        <div className="px-6 sm:px-8 py-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-amber-600' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition flex items-center space-x-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleFinish('discover')}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-md transition flex items-center space-x-1.5 transform active:scale-95"
              >
                <span>Start with Discover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
