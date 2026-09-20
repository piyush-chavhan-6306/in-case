import React, { useState } from 'react';
import { X, Save, ShieldAlert, CheckCircle2, MapPin, Tag, Upload, FileText, Download, Eye, Trash2, Loader2, Sparkles } from 'lucide-react';
import { InventoryItem, Category, NomineeStatus, ConfidenceLevel } from '../../types';
import { compressDocument, decompressDocument, formatFileSize, CompressedDocPayload } from '../../utils/compression';
import { CompressionModal } from '../common/CompressionModal';

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

  // Compressed Document state
  const [compressedDoc, setCompressedDoc] = useState<CompressedDocPayload | undefined>(item.compressedDoc);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'compressing' | 'decompressing';
    filename: string;
    progress: number;
    statusText: string;
    originalSize?: number;
    compressedSize?: number;
  }>({
    isOpen: false,
    mode: 'compressing',
    filename: '',
    progress: 0,
    statusText: '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModalState({
      isOpen: true,
      mode: 'compressing',
      filename: file.name,
      progress: 15,
      statusText: 'Initializing compression engine...',
      originalSize: file.size,
    });

    try {
      const payload = await compressDocument(file, (percent, status) => {
        setModalState((prev) => ({
          ...prev,
          progress: percent,
          statusText: status,
          compressedSize: percent > 50 ? Math.round(file.size * 0.45) : undefined,
        }));
      });

      // Brief animation dwell
      await new Promise((r) => setTimeout(r, 600));
      setCompressedDoc(payload);
      if (!documentLocation || documentLocation === 'Not specified') {
        setDocumentLocation(`Attached Document: ${payload.name} (Compressed)`);
      }
    } catch (err) {
      console.error('Document compression failed', err);
      alert('Failed to compress document. Please try a different file.');
    } finally {
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleViewOrDownload = async () => {
    if (!compressedDoc) return;

    setModalState({
      isOpen: true,
      mode: 'decompressing',
      filename: compressedDoc.name,
      progress: 20,
      statusText: 'Reading compressed chunks...',
      originalSize: compressedDoc.originalSize,
      compressedSize: compressedDoc.compressedSize,
    });

    try {
      const { blobUrl } = await decompressDocument(compressedDoc, (percent, status) => {
        setModalState((prev) => ({
          ...prev,
          progress: percent,
          statusText: status,
        }));
      });

      await new Promise((r) => setTimeout(r, 500));
      // Open decompressed blob in new tab or trigger download
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Decompression failed', err);
      alert('Failed to decompress document.');
    } finally {
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleRemoveDoc = () => {
    setCompressedDoc(undefined);
  };

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
      compressedDoc,
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

          {/* Compressed Document Attachment Box */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-200/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Encrypted Document Attachment</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                GZIP Compressed
              </span>
            </div>

            {compressedDoc ? (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-200 shadow-xs">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-stone-800 truncate">{compressedDoc.name}</p>
                    <p className="text-[10px] font-mono text-stone-500">
                      {formatFileSize(compressedDoc.originalSize)} →{' '}
                      <span className="text-amber-700 font-bold">{formatFileSize(compressedDoc.compressedSize)}</span>
                      {' '}(saved {Math.round(((compressedDoc.originalSize - compressedDoc.compressedSize) / (compressedDoc.originalSize || 1)) * 100)}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleViewOrDownload}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-sm transition"
                    title="Decompress & Open Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Decompress & View</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveDoc}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Remove Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center py-4 px-3 border border-amber-200 rounded-xl bg-white hover:bg-amber-50/40 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-amber-600 mb-1.5" />
                  <span className="text-xs font-bold text-stone-700">
                    Upload & Auto-Compress Document
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    PDF, JPG, PNG or Docs (Compressed client-side before encryption)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
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

      {/* Compression & Decompression Animated Modal */}
      <CompressionModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        filename={modalState.filename}
        progress={modalState.progress}
        statusText={modalState.statusText}
        originalSize={modalState.originalSize}
        compressedSize={modalState.compressedSize}
      />
    </div>
  );
};
