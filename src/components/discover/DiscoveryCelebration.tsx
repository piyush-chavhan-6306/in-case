import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Home,
  TrendingUp,
  CreditCard,
  FileText,
  Heart,
} from 'lucide-react';
import { InventoryItem, Category } from '../../types';

interface DiscoveryCelebrationProps {
  items: InventoryItem[];
  filename: string;
}

export const DiscoveryCelebration: React.FC<DiscoveryCelebrationProps> = ({ items, filename }) => {
  // Compute counts per category
  const categories: {
    label: Category;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
  }[] = [
    {
      label: 'Insurance',
      color: 'text-[#0369a1]',
      bg: 'bg-[#e0f2fe]',
      border: 'border-[#bae6fd]',
      icon: <ShieldCheck className="w-4 h-4 text-[#0284c7]" />,
    },
    {
      label: 'Loan / EMI',
      color: 'text-[#be123c]',
      bg: 'bg-[#ffe4e6]',
      border: 'border-[#fecdd3]',
      icon: <Home className="w-4 h-4 text-[#e11d48]" />,
    },
    {
      label: 'Investment / SIP',
      color: 'text-[#15803d]',
      bg: 'bg-[#dcfce7]',
      border: 'border-[#bbf7d0]',
      icon: <TrendingUp className="w-4 h-4 text-[#16a34a]" />,
    },
    {
      label: 'Subscription',
      color: 'text-[#b45309]',
      bg: 'bg-[#fef3c7]',
      border: 'border-[#fde68a]',
      icon: <CreditCard className="w-4 h-4 text-[#d97706]" />,
    },
    {
      label: 'Rent / Utility',
      color: 'text-[#7e22ce]',
      bg: 'bg-[#f3e8ff]',
      border: 'border-[#e9d5ff]',
      icon: <FileText className="w-4 h-4 text-[#9333ea]" />,
    },
  ];

  const counts: { [key: string]: number } = {};
  items.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.97) 0%, rgba(254, 250, 244, 0.94) 100%)',
        boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
      }}
      className="rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 border-2 border-white mb-6 relative overflow-hidden select-none"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#0284c7] mb-2">
            <Sparkles className="w-4 h-4 text-[#0ea5e9] stroke-[2.5]" />
            <span>AUTO-DISCOVERY ENGINE COMPLETED</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1e293b] tracking-tight">
            We found{' '}
            <span className="text-[#0ea5e9]">
              {items.length} commitments
            </span>{' '}
            your family should know about.
          </h2>

          <p className="text-xs sm:text-[13px] text-[#64748b] mt-1.5 font-medium">
            Analyzed from:{' '}
            <span className="font-mono text-[#334155] font-semibold">{filename}</span> • All amounts and cadences normalized
          </p>
        </div>

        {/* Right side: Note with Leaf + Category Pills Breakdown */}
        <div className="flex flex-col items-start lg:items-end gap-3">
          {/* Handwritten aesthetic accent */}
          <div className="hidden lg:flex items-center space-x-2 text-right">
            <span className="text-xl">🍃</span>
            <div>
              <p className="text-xs font-bold text-[#b45309] leading-tight">Clarity today.</p>
              <p className="text-xs font-semibold text-[#b45309]/80 flex items-center justify-end gap-1">
                Peace tomorrow. <Heart className="w-2.5 h-2.5 fill-[#b45309] text-[#b45309] inline" />
              </p>
            </div>
          </div>

          {/* 5 Category Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((c) => {
              const count = counts[c.label] || 0;
              if (count === 0) return null;
              return (
                <div
                  key={c.label}
                  className={`px-3.5 py-2 rounded-2xl border text-xs sm:text-[13px] font-bold flex items-center space-x-2 ${c.bg} ${c.border} ${c.color} shadow-2xs hover:scale-105 transition-transform`}
                >
                  {c.icon}
                  <span>
                    {count} {c.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

