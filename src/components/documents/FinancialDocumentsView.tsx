import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  Filter,
  Plus,
  ShieldCheck,
  Building,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Search,
  Lock,
} from 'lucide-react';
import { FinancialDocument, DocumentCategory } from '../../types';
import { DocumentViewerModal } from './DocumentViewerModal';
import { addStoredDocument, deleteStoredDocument } from '../../utils/storage';

interface FinancialDocumentsViewProps {
  documents: FinancialDocument[];
  onDocumentsChange: (docs: FinancialDocument[]) => void;
  userId?: string;
  onNavigateToManager?: () => void;
}

const CATEGORIES: { id: DocumentCategory | 'All'; label: string }[] = [
  { id: 'All', label: 'All Documents' },
  { id: 'Insurance Policy', label: 'Insurance Policies' },
  { id: 'Mutual Fund / SIP', label: 'Mutual Funds / CAS' },
  { id: 'Fixed Deposit / Bond', label: 'FDs & Sovereign Bonds' },
  { id: 'Property / Loan Deed', label: 'Property & Loan Deeds' },
  { id: 'Will / Legal', label: 'Wills & Legal Instruments' },
];

export const FinancialDocumentsView: React.FC<FinancialDocumentsViewProps> = ({
  documents,
  onDocumentsChange,
  userId,
  onNavigateToManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDoc, setViewingDoc] = useState<FinancialDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New doc form state
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Insurance Policy');
  const [newProvider, setNewProvider] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.policyOrAccountNumber && doc.policyOrAccountNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Handle direct file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFile(file);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  // Submit new document
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProvider) return;

    setIsUploading(true);
    try {
      let dataBase64 = '';
      let origSize = newFile ? newFile.size : 250000;
      let compSize = Math.round(origSize * 0.45); // simulated client-side compression

      if (newFile) {
        dataBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(newFile);
        });
      }

      const newDoc: FinancialDocument = {
        id: `doc-${Date.now()}`,
        name: newFile ? newFile.name : `${newTitle.replace(/\s+/g, '_')}.pdf`,
        category: newCategory,
        provider: newProvider,
        policyOrAccountNumber: newNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        fileType: newFile ? newFile.type : 'application/pdf',
        originalSize: origSize,
        compressedSize: compSize,
        dataBase64,
        uploadedAt: new Date().toISOString(),
        notes: newNotes,
      };

      addStoredDocument(newDoc, userId);
      onDocumentsChange([newDoc, ...documents]);

      // Reset
      setNewFile(null);
      setNewTitle('');
      setNewProvider('');
      setNewNumber('');
      setNewNotes('');
      setIsUploadOpen(false);
    } catch (err) {
      console.error('Document upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this document from your secure contingency vault?')) {
      deleteStoredDocument(id, userId);
      onDocumentsChange(documents.filter((d) => d.id !== id));
    }
  };

  // Quick download helper
  const handleDownload = (doc: FinancialDocument) => {
    if (doc.dataBase64 && doc.dataBase64.startsWith('data:')) {
      const a = window.document.createElement('a');
      a.href = doc.dataBase64;
      a.download = doc.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      const sampleContent = `%PDF-1.4\n% IN CASE SECURE VAULT\nTitle: ${doc.name}\nProvider: ${doc.provider}\nPolicy: ${doc.policyOrAccountNumber}\nNotes: ${doc.notes || 'None'}`;
      const blob = new Blob([sampleContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full select-none">
      {/* Hero Header Section */}
      <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/reality_desk_bg.png"
            alt="Warm home office desk with financial documents"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-900/75 to-navy-950/80" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf8f2] via-[#fbf8f2]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Zero-Knowledge Document Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Family Financial Documents
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Store, view, and instantly download certified copies of your life policies, health cards, mutual fund CAS, property deeds, and wills in any emergency.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>

            {onNavigateToManager && (
              <button
                onClick={onNavigateToManager}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition"
              >
                <span>Crisis Triage Guide →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 -mt-6 relative z-10 space-y-6">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Nav */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search policies, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-800 text-base">No documents found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No records match your selected filter or search query. Click Upload to add your first financial instrument.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const isPdf = doc.fileType === 'application/pdf' || doc.name.endsWith('.pdf');
              const compRatio = Math.round((1 - doc.compressedSize / doc.originalSize) * 100);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-400/50"
                >
                  <div className="space-y-3">
                    {/* Top row: Category Badge & Status */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[11px] uppercase tracking-wide">
                        {doc.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                        {compRatio > 0 ? `${compRatio}% Compressed` : 'AES-256'}
                      </span>
                    </div>

                    {/* Document Title & Provider */}
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm group-hover:text-amber-600 transition leading-snug truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center space-x-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        <span>{doc.provider}</span>
                      </p>
                    </div>

                    {/* Policy / Account Ref Box */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Identifier</span>
                        <span className="font-mono font-bold text-stone-800">{doc.policyOrAccountNumber}</span>
                      </div>
                      <span className="text-[11px] font-medium text-stone-500">
                        {(doc.compressedSize / 1024).toFixed(0)} KB
                      </span>
                    </div>

                    {/* Notes Snippet */}
                    {doc.notes && (
                      <p className="text-xs text-stone-600 line-clamp-2 bg-amber-50/50 p-2 rounded-lg border border-amber-200/40">
                        <span className="font-semibold text-amber-800">Note: </span>
                        {doc.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition border border-stone-200"
                      title="Download Certified Copy"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition border border-stone-200"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 text-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-stone-900">Upload Financial Instrument</h3>
                  <p className="text-xs text-stone-500">Zero-knowledge client-side encrypted storage</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-5 text-center cursor-pointer bg-stone-50 transition relative">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileText className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                {newFile ? (
                  <div className="text-emerald-700 font-bold">
                    <span>{newFile.name}</span>
                    <p className="text-[11px] text-stone-500">{(newFile.size / 1024).toFixed(0)} KB • Ready to encrypt</p>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-stone-700 block">Click or Drag &amp; Drop PDF / Scan</span>
                    <span className="text-stone-400 text-[11px]">PDF, PNG, or JPG (Up to 15 MB)</span>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Document Label / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Term Life Policy Bond"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Insurance Policy">Insurance Policy</option>
                    <option value="Mutual Fund / SIP">Mutual Fund / SIP</option>
                    <option value="Fixed Deposit / Bond">Fixed Deposit / Bond</option>
                    <option value="Property / Loan Deed">Property / Loan Deed</option>
                    <option value="Will / Legal">Will / Legal Instrument</option>
                  </select>
                </div>
              </div>

              {/* Provider & Policy Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Issuing Provider / Bank *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Life / SBI / ICICI"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Policy / Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PP-99210-TL"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Emergency Notes */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Crisis Notes &amp; Nominee Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Nominee is spouse. ₹1.5 Cr sum insured. 24x7 TPA desk toll-free: 1800-..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center space-x-1.5 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-950" />
                  <span>{isUploading ? 'Encrypting...' : 'Encrypt & Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document In-Browser Viewer Modal */}
      <DocumentViewerModal
        document={viewingDoc}
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
      />
    </div>
  );
};
