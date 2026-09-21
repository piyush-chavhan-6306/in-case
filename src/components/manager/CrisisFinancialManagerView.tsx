import React, { useState } from 'react';
import {
  AlertTriangle,
  HeartPulse,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  PhoneCall,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Activity,
  UserCheck,
  Shield,
  Download,
} from 'lucide-react';
import { InventoryItem, FinancialDocument, CrisisScenario, FinancialSuggestion } from '../../types';

interface CrisisFinancialManagerViewProps {
  items: InventoryItem[];
  documents: FinancialDocument[];
  onNavigateToDocs: () => void;
  onNavigateToProtect: () => void;
  onLaunchFireDrill: () => void;
}

export const CrisisFinancialManagerView: React.FC<CrisisFinancialManagerViewProps> = ({
  items,
  documents,
  onNavigateToDocs,
  onNavigateToProtect,
  onLaunchFireDrill,
}) => {
  const [activeScenario, setActiveScenario] = useState<CrisisScenario>('hospitalization');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  // ----------------------------------------------------
  // DYNAMIC SMART GAP SUGGESTIONS ENGINE
  // ----------------------------------------------------
  const calculateSuggestions = (): FinancialSuggestion[] => {
    const suggestions: FinancialSuggestion[] = [];

    // 1. Missing Nominee Check
    const itemsWithoutNominee = items.filter(
      (item) => item.nomineeStatus === 'not_set' || item.nomineeStatus === 'unknown'
    );
    if (itemsWithoutNominee.length > 0) {
      suggestions.push({
        id: 'sug-nominee',
        type: 'warning',
        title: `${itemsWithoutNominee.length} Assets Missing Nominees`,
        description: `Unnominated assets like ${itemsWithoutNominee[0].provider} (${itemsWithoutNominee[0].category}) require court succession certificates during emergencies, delaying access by 6–18 months.`,
        actionLabel: 'Assign Nominees Now',
        impactScore: 95,
      });
    }

    // 2. Health Insurance Adequacy Check
    const healthPolicies = items.filter(
      (i) => i.category === 'Insurance' && (i.provider.toLowerCase().includes('health') || (i.notes && i.notes.toLowerCase().includes('health')))
    );
    const hasHealthDoc = documents.some((d) => d.category === 'Insurance Policy' && d.name.toLowerCase().includes('health'));
    if (healthPolicies.length === 0 && !hasHealthDoc) {
      suggestions.push({
        id: 'sug-health',
        type: 'critical',
        title: 'Zero Active Health Insurance Found',
        description: 'A single 5-day ICU admission in a tier-1 private hospital averages ₹4.5 Lakhs to ₹12 Lakhs. Establish a comprehensive family floater immediately.',
        actionLabel: 'Review Health Safety Net',
        impactScore: 98,
      });
    }

    // 3. Liquid Emergency Buffer Check
    const liquidItems = items.filter((i) =>
      i.category === 'Investment / SIP' || i.category === 'Other'
    );
    const totalLiquid = liquidItems.reduce((acc, curr) => acc + (curr.amountApprox || 0), 0);
    if (totalLiquid < 300000) {
      suggestions.push({
        id: 'sug-liquidity',
        type: 'warning',
        title: 'Emergency Cash Runway Under ₹3 Lakhs',
        description: 'Cashless hospital claims typically incur 15–20% non-payable deductions (consumables, PPE, room rent limits). Maintain ₹3 Lakhs to ₹5 Lakhs in instant-access savings/sweep FDs.',
        actionLabel: 'Boost Liquid Runway',
        impactScore: 82,
      });
    }

    // 4. Will & Succession Instrument Check
    const hasWill = documents.some(
      (d) => d.category === 'Will / Legal' || d.name.toLowerCase().includes('will')
    );
    if (!hasWill) {
      suggestions.push({
        id: 'sug-will',
        type: 'recommendation',
        title: 'Registered Family Will Not Archived',
        description: 'Under Indian Succession Laws, intestate demises lead to joint succession disputes among legal heirs. Archiving an executed will simplifies asset transmission 10x.',
        actionLabel: 'Deposit Will in Vault',
        impactScore: 88,
      });
    }

    // 5. Shamir Multi-Guardian Security Check
    suggestions.push({
      id: 'sug-shamir',
      type: 'recommendation',
      title: '2-of-3 Shamir Guardians Rehearsal',
      description: 'Ensure at least two designated guardians know where their offline QR contingency cards are physically kept before an emergency occurs.',
      actionLabel: 'Rehearse Fire Drill',
      impactScore: 90,
    });

    return suggestions;
  };

  const smartSuggestions = calculateSuggestions();

  // ----------------------------------------------------
  // SCENARIO ACTION ROADMAPS
  // ----------------------------------------------------
  interface ScenarioStep {
    id: string;
    title: string;
    desc: string;
    urgent: boolean;
  }

  interface ScenarioConfig {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    theme: string;
    first24Hours: ScenarioStep[];
    next7Days: ScenarioStep[];
    next30Days: ScenarioStep[];
  }

  const scenarioData: Record<string, ScenarioConfig> = {
    hospitalization: {
      title: 'Hospitalization & Critical Medical Emergency',
      subtitle: 'Immediate Cashless Hospital Admission, TPA Coordination & Bill Claim Protocol',
      icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
      theme: 'rose',
      first24Hours: [
        {
          id: 'hosp-1',
          title: 'Present Cashless Health Card at TPA Hospital Desk',
          desc: 'Show Star Health / HDFC Ergo card (available in Documents Hub) along with patient Photo ID within 3-4 hours of admission.',
          urgent: true,
        },
        {
          id: 'hosp-2',
          title: 'Fill Pre-Authorization Form with Treating Doctor',
          desc: 'Ensure the attending medical officer clearly marks the diagnosis code (ICD-10) and estimated room/procedure charges.',
          urgent: true,
        },
        {
          id: 'hosp-3',
          title: 'Keep ₹50,000–₹1,00,000 Liquid for Initial Hospital Deposit',
          desc: 'Most hospitals require a refundable caution deposit even for cashless claims until initial TPA approval arrives (usually 2-4 hours).',
          urgent: false,
        },
      ],
      next7Days: [
        {
          id: 'hosp-4',
          title: 'Preserve All Original Investigation Reports & Pharmacy Slips',
          desc: 'Every single cotton swab, disposable cannula, and medicine receipt must be sequentially filed. Insurers deduct 100% of unbacked claims.',
          urgent: false,
        },
        {
          id: 'hosp-5',
          title: 'Notify Employer HR (For Corporate Group Mediclaim)',
          desc: 'If covered under corporate health insurance, file employer intimation within 48 hours to activate supplementary corporate cashless coverage.',
          urgent: false,
        },
      ],
      next30Days: [
        {
          id: 'hosp-6',
          title: 'File Post-Hospitalization Expenses (60–90 Days Window)',
          desc: 'Diagnostic scans, pathology tests, and follow-up medications incurred up to 60-90 days after discharge are 100% reimbursable.',
          urgent: false,
        },
        {
          id: 'hosp-7',
          title: 'Review Non-Payable Deductions & File Grievance If Disputed',
          desc: 'Examine the TPA settlement summary letter for arbitrary room rent capping deductions.',
          urgent: false,
        },
      ],
    },
    bereavement: {
      title: 'Bereavement & Demise Contingency Plan',
      subtitle: 'Sovereign Death Certificate, Term Life Payout & Succession Transmission',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      theme: 'amber',
      first24Hours: [
        {
          id: 'ber-1',
          title: 'Obtain Hospital Medical Cause of Death Certificate (Form 4/4A)',
          desc: 'Collect 10 original signed copies from hospital authorities immediately before discharge/mortuary release.',
          urgent: true,
        },
        {
          id: 'ber-2',
          title: 'Notify Shamir Guardians to Unlock Full Contingency Vault',
          desc: 'Have 2 of the 3 designated guardians present their QR keys to decrypt all bank account, policy, and deed credentials.',
          urgent: true,
        },
        {
          id: 'ber-3',
          title: 'Intimate Primary Term Insurance Providers Online or via SMS',
          desc: 'Send claim intimation with policy number (HDFC Life, Max, LIC) to trigger expedited 24h settlement priority.',
          urgent: true,
        },
      ],
      next7Days: [
        {
          id: 'ber-4',
          title: 'Apply for Municipal Death Certificates (Minimum 15 Original Copies)',
          desc: 'Register death with the local municipal corporation (e.g. BMC/MCD) within 21 days to avoid magistrate affidavit penalties.',
          urgent: false,
        },
        {
          id: 'ber-5',
          title: 'Submit Term Life Claim Dossier (Form A, PAN, Cancelled Cheque)',
          desc: 'Submit nominee identity proof, cancelled cheque of nominee bank account, and original policy bond (available in Documents Hub).',
          urgent: false,
        },
      ],
      next30Days: [
        {
          id: 'ber-6',
          title: 'Initiate Mutual Fund & Demat Transmission (Form ISR-1 / CAMS / KFintech)',
          desc: 'Transfer mutual fund folios and demat shares directly to nominee without capital gains tax liability under Indian IT Act Section 56.',
          urgent: false,
        },
        {
          id: 'ber-7',
          title: 'Submit Bank Survivorship Claims & Close Open Liabilities',
          desc: 'Submit Form 15G/H and claim deposit balances with Either-or-Survivor mandates.',
          urgent: false,
        },
      ],
    },
    trauma: {
      title: 'Accident, Trauma & Disability Support',
      subtitle: 'Emergency Trauma Fund, Personal Accident Claims & Income Continuation',
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      theme: 'blue',
      first24Hours: [
        {
          id: 'tra-1',
          title: 'File Police Medico-Legal Case (MLC) / FIR Copy for RTA Accidents',
          desc: 'For road traffic accidents, personal accident policies mandatorily require the hospital MLC record or police FIR registration.',
          urgent: true,
        },
        {
          id: 'tra-2',
          title: 'Intimate Personal Accident & Disability Insurer',
          desc: 'Notify insurer within 72 hours to preserve eligibility for weekly temporary total disability (TTD) income compensation.',
          urgent: true,
        },
      ],
      next7Days: [
        {
          id: 'tra-3',
          title: 'Obtain Disability Percentage Assessment from Chief Medical Officer',
          desc: 'Permanent partial or total disability benefits are calculated strictly based on civil surgeon disability percentage certifications.',
          urgent: false,
        },
        {
          id: 'tra-4',
          title: 'Notify Home Loan & Car Loan Providers (Loan Protection Insurance)',
          desc: 'If loans have credit shield insurance, pause EMI debits and trigger policy payoff.',
          urgent: false,
        },
      ],
      next30Days: [
        {
          id: 'tra-5',
          title: 'Establish 12-Month Living Reserve & Disability Trust',
          desc: 'Reallocate liquid and mutual fund portfolios to provide stable monthly SWP payouts during vocational rehabilitation.',
          urgent: false,
        },
      ],
    },
  };

  const activeData: ScenarioConfig = scenarioData[activeScenario] || scenarioData['hospitalization'];

  return (
    <div className="w-full select-none">
      {/* Hero Banner */}
      <div className="relative w-full min-h-[400px] sm:min-h-[460px] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/unlock_family_bg.jpg"
            alt="Warm emergency contingency preparedness"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/80 to-navy-950/90" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Full Financial Manager During Crises</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Crisis Triage &amp; Smart Advisor
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Step-by-step financial command during hospitalizations, bereavement, and trauma. Instant claim roadmaps, gap analysis, and emergency checklists.
            </p>
          </div>

          {/* Quick Pillar Links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onLaunchFireDrill}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Fire Drill (45s)</span>
            </button>
            <button
              onClick={onNavigateToDocs}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition"
            >
              <FileText className="w-4 h-4" />
              <span>View Documents Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 -mt-6 relative z-10 space-y-8">
        
        {/* Scenario Switcher Tabs */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-stone-200/80 flex flex-wrap sm:flex-nowrap gap-2">
          <button
            onClick={() => setActiveScenario('hospitalization')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeScenario === 'hospitalization'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Hospitalization / ICU</span>
          </button>

          <button
            onClick={() => setActiveScenario('bereavement')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeScenario === 'bereavement'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Bereavement &amp; Loss</span>
          </button>

          <button
            onClick={() => setActiveScenario('trauma')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeScenario === 'trauma'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Accident &amp; Trauma</span>
          </button>
        </div>

        {/* Smart Suggestions & Gap Analysis Radar */}
        <div className="bg-gradient-to-br from-[#fffdfa] to-[#fcf6eb] rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  Smart Crisis Suggestions &amp; Gap Radar
                </h3>
                <p className="text-xs text-stone-500">
                  Automated financial advice evaluated against your family's live assets and documents
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {smartSuggestions.length} Active Observations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {smartSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        sug.type === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : sug.type === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {sug.type}
                    </span>
                    <span className="text-[11px] font-bold text-stone-400">
                      Impact: {sug.impactScore}/100
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm">{sug.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{sug.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">Recommended Action:</span>
                  <button
                    onClick={() => {
                      if (sug.id === 'sug-shamir') onLaunchFireDrill();
                      else if (sug.id === 'sug-will') onNavigateToDocs();
                      else onNavigateToProtect();
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                  >
                    <span>{sug.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Scenario Action Plan - 3 Phases */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-stone-900">
                {activeData.icon}
                <h2 className="text-xl sm:text-2xl font-black">{activeData.title}</h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">{activeData.subtitle}</p>
            </div>
            <span className="text-xs text-stone-500 font-medium bg-stone-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Check off items as completed
            </span>
          </div>

          {/* Phase 1: First 24 Hours */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h3 className="font-black text-sm text-stone-900 uppercase tracking-wider">
                Phase 1 — First 24 Hours (Immediate Triage)
              </h3>
            </div>
            <div className="space-y-2.5 pl-8">
              {activeData.first24Hours.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-900'
                        : step.urgent
                        ? 'bg-rose-50/50 border-rose-200/80 text-stone-900 hover:border-rose-300'
                        : 'bg-stone-50/80 border-stone-200/80 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 hover:border-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isDone ? 'line-through opacity-70' : ''}`}>
                          {step.title}
                        </h4>
                        {step.urgent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-wide">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className={`text-xs text-stone-600 leading-relaxed ${isDone ? 'opacity-60' : ''}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 2: Next 7 Days */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h3 className="font-black text-sm text-stone-900 uppercase tracking-wider">
                Phase 2 — Next 7 Days (Documentation &amp; Filing)
              </h3>
            </div>
            <div className="space-y-2.5 pl-8">
              {activeData.next7Days.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-900'
                        : 'bg-stone-50/80 border-stone-200/80 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 hover:border-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className={`text-sm font-bold ${isDone ? 'line-through opacity-70' : ''}`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs text-stone-600 leading-relaxed ${isDone ? 'opacity-60' : ''}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 3: Next 30 Days */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <h3 className="font-black text-sm text-stone-900 uppercase tracking-wider">
                Phase 3 — Next 30 Days (Settlement &amp; Transmission)
              </h3>
            </div>
            <div className="space-y-2.5 pl-8">
              {activeData.next30Days.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-900'
                        : 'bg-stone-50/80 border-stone-200/80 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 hover:border-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className={`text-sm font-bold ${isDone ? 'line-through opacity-70' : ''}`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs text-stone-600 leading-relaxed ${isDone ? 'opacity-60' : ''}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Emergency Help Line Directory */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4" />
              <span>Verified 24x7 Institutional Emergency Desks</span>
            </div>
            <h3 className="text-xl font-black text-white">Need Live Help Right Now?</h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl leading-relaxed">
              Insurers mandate claim intimation within 24 hours. Call the toll-free numbers below and have your policy numbers from the Documents Hub ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-xs">
            <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase">Star Health TPA</span>
              <span className="font-bold text-white text-sm font-mono">1800-425-2255</span>
            </div>
            <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase">HDFC Life Claims</span>
              <span className="font-bold text-white text-sm font-mono">1860-267-9999</span>
            </div>
            <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase">SBI MF Helpline</span>
              <span className="font-bold text-white text-sm font-mono">1800-209-3333</span>
            </div>
            <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase">National Ambulance</span>
              <span className="font-bold text-rose-400 text-sm font-mono">102 / 108</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
