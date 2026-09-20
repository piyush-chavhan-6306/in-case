import React, { useState } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  ExternalLink,
  MapPin,
  Lock,
  Sparkles,
} from 'lucide-react';
import { InventoryItem, Category } from '../../types';
import { ItemEditModal } from './ItemEditModal';

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: InventoryItem) => void;
  onProceedToProtect: () => void;
  activeRiskFilter: 'nominee' | 'doc' | 'confidence' | null;
  onClearFilter: () => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onProceedToProtect,
  activeRiskFilter,
  onClearFilter,
}) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Filter items
  let filteredItems = items;

  if (selectedCategory !== 'All') {
    filteredItems = filteredItems.filter((i) => i.category === selectedCategory);
  }

  if (activeRiskFilter === 'nominee') {
    filteredItems = filteredItems.filter(
      (i) => i.nomineeStatus === 'not_set' && (i.category === 'Insurance' || i.category === 'Loan / EMI' || i.category === 'Investment / SIP')
    );
  } else if (activeRiskFilter === 'doc') {
    filteredItems = filteredItems.filter(
      (i) =>
        !i.documentLocation ||
        i.documentLocation.toLowerCase().includes('not specified') ||
        i.documentLocation.toLowerCase().includes('unknown')
    );
  } else if (activeRiskFilter === 'confidence') {
    filteredItems = filteredItems.filter((i) => i.confidence === 'Low' || i.confidence === 'Medium');
  }

  const handleAddNew = () => {
    const newItem: InventoryItem = {
      id: `manual-${Date.now().toString(36)}`,
      provider: '',
      category: 'Insurance',
      amountApprox: 0,
      frequency: 'Monthly',
      nomineeStatus: 'not_set',
      documentLocation: '',
      source: 'manual',
      confidence: 'High',
      notes: '',
    };
    setEditingItem(newItem);
  };

  const getCategoryBadgeColor = (cat: Category) => {
    switch (cat) {
      case 'Insurance':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Loan / EMI':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Investment / SIP':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Subscription':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Rent / Utility':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="w-full select-none">
      {/* List Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#1e293b]">
            Family Commitment Inventory
          </h3>
          <p className="text-xs sm:text-[13px] text-[#64748b] font-medium mt-0.5">
            Review every discovered item, update document locations, and register missing nominees.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {activeRiskFilter && (
            <button
              onClick={onClearFilter}
              className="px-3.5 py-1.5 rounded-full bg-[#ffe4e6] hover:bg-[#fecdd3] text-[#be123c] border border-[#fecdd3] text-xs font-bold transition shadow-2xs"
            >
              Clear Risk Filter ✕
            </button>
          )}

          <button
            onClick={handleAddNew}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#f8f5f0] text-[#1e293b] border border-[#dfd6c8] text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#0ea5e9] stroke-[2.5]" />
            <span>Add Item Manually</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
        {['All', 'Insurance', 'Loan / EMI', 'Investment / SIP', 'Subscription', 'Rent / Utility'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition shadow-2xs ${
              selectedCategory === cat
                ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky-500/25'
                : 'bg-white hover:bg-[#f8f5f0] text-[#64748b] hover:text-[#1e293b] border border-[#dfd6c8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory Cards Grid (PRD Section 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filteredItems.map((item) => {
          const isNomineeMissing = item.nomineeStatus === 'not_set';
          const isDocMissing =
            !item.documentLocation ||
            item.documentLocation.toLowerCase().includes('not specified') ||
            item.documentLocation.toLowerCase().includes('unknown');

          return (
            <div
              key={item.id}
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
                boxShadow: '0 15px 35px -8px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
              }}
              className={`rounded-[28px] p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative hover:scale-[1.01] ${
                isNomineeMissing && (item.category === 'Insurance' || item.category === 'Loan / EMI' || item.category === 'Investment / SIP')
                  ? 'border-rose-300'
                  : 'border-white'
              }`}
            >
              {/* Card Header: Category & Source */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-xl border ${getCategoryBadgeColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono text-[#64748b] uppercase px-2 py-0.5 rounded-lg bg-[#f1ece1] border border-[#e2d8cb]">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-bold text-[#0369a1] px-2 py-0.5 rounded-lg bg-[#e0f2fe] border border-[#bae6fd]">
                      {item.confidence} Conf.
                    </span>
                  </div>
                </div>

                {/* Provider Title */}
                <h4 className="font-display font-black text-lg sm:text-xl text-[#1e293b] mb-1 leading-snug">
                  {item.provider}
                </h4>

                {/* Approximate Amount & Cadence */}
                <div className="flex items-baseline space-x-1.5 mb-4">
                  <span className="font-display font-black text-2xl text-[#1e293b]">
                    ₹{item.amountApprox.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#64748b] font-medium">/{item.frequency.toLowerCase()}</span>
                </div>

                {/* Detail Blocks: Nominee & Document Location */}
                <div className="space-y-2.5 pt-3 border-t border-[#ebdccb]/70 text-xs">
                  {/* Nominee Status */}
                  <div className="flex items-start justify-between">
                    <span className="text-[#64748b] font-medium">Nominee:</span>
                    {item.nomineeStatus === 'set' ? (
                      <span className="text-[#15803d] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>{item.nomineeName || 'Registered'}</span>
                      </span>
                    ) : item.nomineeStatus === 'unknown' ? (
                      <span className="text-[#b45309] font-bold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>Confirm ({item.nomineeName || 'Unknown'})</span>
                      </span>
                    ) : (
                      <span className="text-[#be123c] font-black flex items-center space-x-1 bg-[#ffe4e6] px-2 py-0.5 rounded-lg">
                        <span>Not Set (Action Required)</span>
                      </span>
                    )}
                  </div>

                  {/* Document Location */}
                  <div className="flex items-start justify-between">
                    <span className="text-[#64748b] font-medium">Location:</span>
                    <span
                      className={`font-semibold max-w-[180px] truncate text-right ${
                        isDocMissing ? 'text-[#b45309] italic' : 'text-[#334155]'
                      }`}
                      title={item.documentLocation || 'Not specified'}
                    >
                      {item.documentLocation || 'Not specified'}
                    </span>
                  </div>

                  {/* Policy Number */}
                  {item.accountOrPolicyNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748b] font-medium">Acc / Policy:</span>
                      <span className="font-mono text-[#334155] font-semibold">{item.accountOrPolicyNumber}</span>
                    </div>
                  )}

                  {/* Notes if available */}
                  {item.notes && (
                    <p className="text-[11px] text-[#64748b] bg-[#fbf7f0] p-2 rounded-lg border border-[#ebdccb] line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit / Delete */}
              <div className="pt-4 mt-4 border-t border-[#ebdccb]/70 flex items-center justify-between">
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f8f5f0] text-[#1e293b] border border-[#dfd6c8] text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 rounded-full text-[#94a3b8] hover:text-[#be123c] hover:bg-[#ffe4e6] transition"
                  title="Remove from inventory"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-navy-900/40 rounded-2xl border border-slate-800 mb-10">
          <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 font-medium text-sm">No inventory items match the current filter.</p>
        </div>
      )}

      {/* Big Bottom Action to Proceed to Module 2 (Protect) */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
      >
        <div>
          <div className="flex items-center space-x-2 text-[#0284c7] text-xs font-black uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4 text-[#f59e0b]" />
            <span>Ready for Client-Side Cryptographic Sealing</span>
          </div>
          <h4 className="font-display font-black text-xl text-[#1e293b]">
            {items.length} Commitments Confirmed in Inventory
          </h4>
          <p className="text-xs text-[#64748b] font-medium mt-0.5">
            Next step: Encrypt locally with WebCrypto AES-256 and distribute 2-of-3 Shamir shares to trusted family.
          </p>
        </div>

        <button
          onClick={onProceedToProtect}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-[0_10px_25px_rgba(234,88,12,0.38)] flex-shrink-0"
        >
          <span>Protect Kit & Generate Shares</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <ItemEditModal
          item={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={(updated) => {
            if (updated.id.startsWith('manual-')) {
              onAddItem(updated);
            } else {
              onUpdateItem(updated);
            }
          }}
        />
      )}
    </div>
  );
};
