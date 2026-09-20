import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, User, FileText, MessageSquare } from 'lucide-react';
import { InventoryItem } from '../../types';

interface RiskRadarProps {
  items: InventoryItem[];
  onFilterRisk?: (riskType: 'nominee' | 'doc' | 'confidence' | null) => void;
  activeFilter?: 'nominee' | 'doc' | 'confidence' | null;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ items, onFilterRisk, activeFilter }) => {
  // Count critical nominee gaps (Insurance, Loans, Investments)
  const nomineeGaps = items.filter(
    (i) => i.nomineeStatus === 'not_set' && (i.category === 'Insurance' || i.category === 'Loan / EMI' || i.category === 'Investment / SIP')
  );

  // Count missing or placeholder document locations
  const documentGaps = items.filter(
    (i) =>
      !i.documentLocation ||
      i.documentLocation.toLowerCase().includes('not specified') ||
      i.documentLocation.toLowerCase().includes('unknown')
  );

  // Count low confidence discoveries
  const confidenceGaps = items.filter((i) => i.confidence === 'Low' || i.confidence === 'Medium');

  const totalRisks = nomineeGaps.length + documentGaps.length;

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.97) 0%, rgba(254, 250, 244, 0.94) 100%)',
        boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
      }}
      className="rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 border-2 border-white mb-8 text-stone-800 select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#be123c] flex items-center justify-center text-white shadow-md shadow-rose-900/20 flex-shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#1e293b]">Risk Radar</h3>
            <p className="text-xs sm:text-[13px] text-[#64748b] font-medium mt-0.5">
              Information gaps that create legal or administrative delays
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {totalRisks === 0 ? (
            <span className="px-4 py-2 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] text-xs sm:text-[13px] font-black flex items-center space-x-1.5 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-[#16a34a]" />
              <span>All Critical Gaps Resolved</span>
            </span>
          ) : (
            <span className="px-4 py-2 rounded-full bg-[#ffe4e6] text-[#be123c] border border-[#fecdd3] text-xs sm:text-[13px] font-black flex items-center space-x-1.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-[#e11d48]" />
              <span>{totalRisks} Actionable Gaps Detected</span>
            </span>
          )}
        </div>
      </div>

      {/* 3 Interactive Risk Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Risk 1: Nominee Not Set */}
        <button
          onClick={() => onFilterRisk && onFilterRisk(activeFilter === 'nominee' ? null : 'nominee')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition text-left flex items-center justify-between shadow-2xs hover:scale-[1.02] active:scale-[0.99] ${
            activeFilter === 'nominee'
              ? 'bg-[#fee2e2] border-[#f43f5e] ring-2 ring-[#f43f5e]/30'
              : 'bg-[#fff1f2] hover:bg-[#fee2e2] border-[#fecdd3]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#f43f5e] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
              <User className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-[13px] text-[#9f1239] block uppercase tracking-wider leading-tight">
                Nominee Not Set
              </span>
              <p className="text-[11px] text-[#64748b] font-medium leading-tight mt-0.5">
                Accounts without a registered nominee
              </p>
            </div>
          </div>
          <span className="font-display font-black text-xl sm:text-2xl text-[#be123c] ml-2">
            {nomineeGaps.length}
          </span>
        </button>

        {/* Risk 2: Missing Document Location */}
        <button
          onClick={() => onFilterRisk && onFilterRisk(activeFilter === 'doc' ? null : 'doc')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition text-left flex items-center justify-between shadow-2xs hover:scale-[1.02] active:scale-[0.99] ${
            activeFilter === 'doc'
              ? 'bg-[#fef3c7] border-[#f59e0b] ring-2 ring-[#f59e0b]/30'
              : 'bg-[#fffbeb] hover:bg-[#fef3c7] border-[#fde68a]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-[13px] text-[#92400e] block uppercase tracking-wider leading-tight">
                Missing Doc Location
              </span>
              <p className="text-[11px] text-[#64748b] font-medium leading-tight mt-0.5">
                Important documents not found
              </p>
            </div>
          </div>
          <span className="font-display font-black text-xl sm:text-2xl text-[#b45309] ml-2">
            {documentGaps.length}
          </span>
        </button>

        {/* Risk 3: Provider Clarification */}
        <button
          onClick={() => onFilterRisk && onFilterRisk(activeFilter === 'confidence' ? null : 'confidence')}
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition text-left flex items-center justify-between shadow-2xs hover:scale-[1.02] active:scale-[0.99] ${
            activeFilter === 'confidence'
              ? 'bg-[#e0f2fe] border-[#0ea5e9] ring-2 ring-[#0ea5e9]/30'
              : 'bg-[#f0f9ff] hover:bg-[#e0f2fe] border-[#bae6fd]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
              <MessageSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-[13px] text-[#0369a1] block uppercase tracking-wider leading-tight">
                Provider Clarification
              </span>
              <p className="text-[11px] text-[#64748b] font-medium leading-tight mt-0.5">
                Need to verify account details
              </p>
            </div>
          </div>
          <span className="font-display font-black text-xl sm:text-2xl text-[#0284c7] ml-2">
            {confidenceGaps.length}
          </span>
        </button>
      </div>
    </div>
  );
};

