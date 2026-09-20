import React, { useState } from 'react';
import { X, Save, ShieldAlert, CheckCircle2, MapPin, Tag } from 'lucide-react';
import { InventoryItem, Category, NomineeStatus, ConfidenceLevel } from '../../types';

interface ItemEditModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: InventoryItem) => void;
}

const CATEGORIES: Category[] = [
  'Insurance',
  'Loan / EMI',
  'Investment / SIP',
  'Subscription',
  'Rent / Utility',
  'Other',
];

export const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, isOpen, onClose, onSave }) => {
  if (!isOpen || !item) return null;

  const [provider, setProvider] = useState(item.provider);
  const [category, setCategory] = useState<Category>(item.category);
  const [amountApprox, setAmountApprox] = useState(item.amountApprox);
  const [frequency, setFrequency] = useState(item.frequency);
  const [nomineeStatus, setNomineeStatus] = useState<NomineeStatus>(item.nomineeStatus);
  const [nomineeName, setNomineeName] = useState(item.nomineeName || '');
  const [documentLocation, setDocumentLocation] = useState(item.documentLocation || '');
  const [accountOrPolicyNumber, setAccountOrPolicyNumber] = useState(item.accountOrPolicyNumber || '');
  const [notes, setNotes] = useState(item.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      provider: provider.trim(),
      category,
      amountApprox: Number(amountApprox) || 0,
      frequency,
      nomineeStatus,
      nomineeName: nomineeName.trim(),
      documentLocation: documentLocation.trim() || 'Not specified',
      accountOrPolicyNumber: accountOrPolicyNumber.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 35px 70px -20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="rounded-[36px] w-full max-w-xl border-2 border-white shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] text-[#1e293b]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdccb]/70 mb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#b45309] px-3.5 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] shadow-xs">
              {item.id.startsWith('new-') ? 'Add Commitment' : 'Edit Inventory Item'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1ebe1] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Provider / Policy Name
            </label>
            <input
              type="text"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
              placeholder="e.g. HDFC Life Click 2 Protect"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Approx Amount & Frequency
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={amountApprox}
                  onChange={(e) => setAmountApprox(Number(e.target.value))}
                  className="w-2/3 px-4 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
                  placeholder="₹ Amount"
                />
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-1/3 px-2 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-xs focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nominee Status & Name */}
          <div className="p-4 rounded-2xl bg-[#f8f4ed] border border-[#e2d7c7] space-y-3">
            <label className="block text-xs font-black text-[#1e293b] uppercase tracking-wider">
              Nominee Designation (Critical Risk Factor)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['set', 'not_set', 'unknown'] as NomineeStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNomineeStatus(status)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                    nomineeStatus === status
                      ? status === 'set'
                        ? 'bg-[#dcfce7] text-[#15803d] border-[#86efac] shadow-xs'
                        : status === 'not_set'
                        ? 'bg-[#ffe4e6] text-[#be123c] border-[#fda4af] shadow-xs'
                        : 'bg-[#fef3c7] text-[#b45309] border-[#fde68a] shadow-xs'
                      : 'bg-white/80 text-[#64748b] border-[#e2d7c7] hover:border-[#cbd5e1]'
                  }`}
                >
                  {status === 'set' ? '✓ Registered' : status === 'not_set' ? '🔴 Not Set' : '🟡 Unknown'}
                </button>
              ))}
            </div>

            {nomineeStatus === 'set' && (
              <div>
                <label className="block text-[11px] text-[#64748b] font-semibold mb-1">Nominee Full Name & Relationship</label>
                <input
                  type="text"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#e6dac9] text-[#1e293b] text-xs focus:outline-none focus:border-[#16a34a] transition font-medium"
                  placeholder="e.g. Priya Sharma (Spouse)"
                />
              </div>
            )}
          </div>

          {/* Document Location */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Where can your family find this document?</span>
            </label>
            <input
              type="text"
              value={documentLocation}
              onChange={(e) => setDocumentLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
              placeholder="e.g. Google Drive → Insurance Folder OR Master Bedroom Top Drawer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Policy / Account Reference Number (Optional)
            </label>
            <input
              type="text"
              value={accountOrPolicyNumber}
              onChange={(e) => setAccountOrPolicyNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-sm focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-mono font-semibold"
              placeholder="e.g. POL-99214482 / SBIN0048291"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
              Family Notes / Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-[#fbf7f0] border-2 border-[#e6dac9] text-[#1e293b] text-xs focus:outline-none focus:border-[#f59e0b] focus:bg-white transition font-medium"
              placeholder="e.g. Cashless card is in the car glovebox. Hospital TPA desk requires physical copy."
            />
          </div>

          <div className="pt-4 border-t border-[#ebdccb]/70 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1ebe1] text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-xs flex items-center space-x-2 transition shadow-[0_10px_25px_rgba(234,88,12,0.38)]"
            >
              <Save className="w-4 h-4" />
              <span>Save Commitment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
