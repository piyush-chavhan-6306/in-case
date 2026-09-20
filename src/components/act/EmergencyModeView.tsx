import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Bot,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Phone,
  BookOpen,
} from 'lucide-react';
import { InventoryItem, PlaybookStep, UrgencyLevel } from '../../types';
import { generatePlaybookSteps } from '../../utils/sampleData';
import { InCaseCopilot } from './InCaseCopilot';

interface EmergencyModeViewProps {
  items: InventoryItem[];
  onOpenPrintCards: () => void;
  onExitEmergencyMode: () => void;
}

export const EmergencyModeView: React.FC<EmergencyModeViewProps> = ({
  items,
  onOpenPrintCards,
  onExitEmergencyMode,
}) => {
  const [activeTab, setActiveTab] = useState<'NOW' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS' | 'COPILOT'>('NOW');
  const [steps, setSteps] = useState<PlaybookStep[]>(() => generatePlaybookSteps(items));

  const toggleStepCompleted = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const currentTabSteps = steps.filter((s) => s.timeframe === activeTab);

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'urgent':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ffe4e6] text-[#be123c] border border-[#fda4af] flex items-center space-x-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse" />
            <span>🔴 Urgent Action</span>
          </span>
        );
      case 'next':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fef3c7] text-[#b45309] border border-[#fde68a] shadow-xs">
            🟡 Priority Follow-up
          </span>
        );
      case 'later':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#dcfce7] text-[#15803d] border border-[#86efac] shadow-xs">
            🟢 Longer-term Step
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Emergency Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ebdccb]/70">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#ffedd5] text-[#e11d48] flex items-center justify-center border border-[#fecdd3] shadow-xs flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1e293b]">Emergency Mode</h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border border-[#fda4af] shadow-xs">
                Low Cognitive Load Active
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium mt-0.5">Clear step-by-step guidance designed to reduce panic</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPrintCards}
            className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#475569] hover:text-[#1e293b] border border-[#dfd4c4] text-xs font-bold flex items-center space-x-2 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Print Emergency Card</span>
          </button>

          <button
            onClick={onExitEmergencyMode}
            className="px-5 py-2.5 rounded-full bg-[#f1ebe1] hover:bg-[#e7decb] text-[#475569] text-xs font-bold border border-[#dfd4c4] flex items-center space-x-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Emergency Mode</span>
          </button>
        </div>
      </div>

      {/* Timeframe Tabs: NOW | NEXT 7 DAYS | NEXT 30 DAYS | COPILOT */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
        <button
          onClick={() => setActiveTab('NOW')}
          style={{
            boxShadow: activeTab === 'NOW'
              ? '0 15px 30px -5px rgba(244,63,94,0.2), inset 0 2px 4px rgba(255,255,255,0.95)'
              : '0 8px 20px -5px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.95)',
          }}
          className={`p-4 rounded-[28px] border-2 text-center transition ${
            activeTab === 'NOW'
              ? 'border-[#f43f5e] bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] text-[#be123c] font-black'
              : 'border-white bg-white/80 hover:bg-white text-[#64748b]'
          }`}
        >
          <span className="text-[10px] font-mono uppercase font-black tracking-wider block text-[#e11d48] mb-0.5">
            Stage 01
          </span>
          <span className="text-sm font-black block text-[#1e293b]">🔴 FIRST 24 HOURS</span>
          <span className="text-[10px] text-[#64748b] font-medium mt-1 block">Immediate ICU & Hospital TPA</span>
        </button>

        <button
          onClick={() => setActiveTab('NEXT_7_DAYS')}
          style={{
            boxShadow: activeTab === 'NEXT_7_DAYS'
              ? '0 15px 30px -5px rgba(245,158,11,0.2), inset 0 2px 4px rgba(255,255,255,0.95)'
              : '0 8px 20px -5px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.95)',
          }}
          className={`p-4 rounded-[28px] border-2 text-center transition ${
            activeTab === 'NEXT_7_DAYS'
              ? 'border-[#f59e0b] bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] text-[#b45309] font-black'
              : 'border-white bg-white/80 hover:bg-white text-[#64748b]'
          }`}
        >
          <span className="text-[10px] font-mono uppercase font-black tracking-wider block text-[#d97706] mb-0.5">
            Stage 02
          </span>
          <span className="text-sm font-black block text-[#1e293b]">🟡 NEXT 7 DAYS</span>
          <span className="text-[10px] text-[#64748b] font-medium mt-1 block">Loans, EMIs & Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('NEXT_30_DAYS')}
          style={{
            boxShadow: activeTab === 'NEXT_30_DAYS'
              ? '0 15px 30px -5px rgba(22,163,74,0.2), inset 0 2px 4px rgba(255,255,255,0.95)'
              : '0 8px 20px -5px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.95)',
          }}
          className={`p-4 rounded-[28px] border-2 text-center transition ${
            activeTab === 'NEXT_30_DAYS'
              ? 'border-[#16a34a] bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] text-[#15803d] font-black'
              : 'border-white bg-white/80 hover:bg-white text-[#64748b]'
          }`}
        >
          <span className="text-[10px] font-mono uppercase font-black tracking-wider block text-[#16a34a] mb-0.5">
            Stage 03
          </span>
          <span className="text-sm font-black block text-[#1e293b]">🟢 NEXT 30 DAYS</span>
          <span className="text-[10px] text-[#64748b] font-medium mt-1 block">Demat KYC & Transmission</span>
        </button>

        <button
          onClick={() => setActiveTab('COPILOT')}
          style={{
            boxShadow: activeTab === 'COPILOT'
              ? '0 15px 30px -5px rgba(14,165,233,0.2), inset 0 2px 4px rgba(255,255,255,0.95)'
              : '0 8px 20px -5px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.95)',
          }}
          className={`p-4 rounded-[28px] border-2 text-center transition ${
            activeTab === 'COPILOT'
              ? 'border-[#0284c7] bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] text-[#0369a1] font-black'
              : 'border-white bg-white/80 hover:bg-white text-[#64748b]'
          }`}
        >
          <span className="text-[10px] font-mono uppercase font-black tracking-wider block text-[#0284c7] mb-0.5">
            AI Assistant
          </span>
          <span className="text-sm font-black block text-[#1e293b]">🤖 IN CASE COPILOT</span>
          <span className="text-[10px] text-[#64748b] font-medium mt-1 block">Grounded Q&A from Kit</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'COPILOT' ? (
        <InCaseCopilot items={items} playbookSteps={steps} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748b] px-1 font-semibold">
            <span>
              Showing {currentTabSteps.length} essential actions for{' '}
              <strong className="text-[#1e293b] font-black">
                {activeTab === 'NOW' ? 'First 24 Hours' : activeTab === 'NEXT_7_DAYS' ? 'Next 7 Days' : 'Next 30 Days'}
              </strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#dfd4c4] text-[#475569] shadow-2xs">
              {currentTabSteps.filter((s) => s.completed).length} of {currentTabSteps.length} Completed
            </span>
          </div>

          <div className="space-y-3.5">
            {currentTabSteps.map((step) => (
              <div
                key={step.id}
                onClick={() => toggleStepCompleted(step.id)}
                style={{
                  background: step.completed
                    ? 'linear-gradient(145deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.85) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.92) 100%)',
                  boxShadow: step.completed
                    ? '0 10px 25px -5px rgba(22, 163, 74, 0.12), inset 0 2px 4px rgba(255,255,255,0.9)'
                    : '0 15px 35px -10px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.95)',
                }}
                className={`rounded-[30px] p-6 border-2 transition cursor-pointer select-none ${
                  step.completed ? 'border-[#86efac]' : 'border-white hover:border-[#fed7aa]'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                      step.completed
                        ? 'bg-[#16a34a] border-[#15803d] text-white shadow-xs'
                        : 'border-[#cbd5e1] bg-white text-transparent hover:border-[#f59e0b]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getUrgencyBadge(step.urgency)}
                      <span className="text-[11px] font-mono font-bold text-[#64748b] uppercase px-2.5 py-0.5 rounded-full bg-[#f8f4ed] border border-[#e2d7c7]">
                        {step.category}
                      </span>
                    </div>

                    <h4
                      className={`font-display font-black text-base sm:text-lg text-[#1e293b] ${
                        step.completed ? 'line-through text-[#94a3b8]' : ''
                      }`}
                    >
                      {step.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                      {step.description}
                    </p>

                    {step.contactNotes && (
                      <div className="p-3.5 rounded-2xl bg-[#f8f4ed] border border-[#e2d7c7] text-xs text-[#64748b] font-mono mt-2">
                        {step.contactNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
