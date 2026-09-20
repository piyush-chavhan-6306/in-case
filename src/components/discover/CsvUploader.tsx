import React, { useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_BANK_STATEMENT_CSV } from '../../utils/sampleData';
import { parseAndDiscoverCsv } from '../../utils/discoveryEngine';
import { InventoryItem } from '../../types';

interface CsvUploaderProps {
  onDiscovered: (items: InventoryItem[], filename: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onDiscovered, isLoading, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processCsvContent = async (content: string, filename: string) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate brief processing for realistic discovery experience
      await new Promise((r) => setTimeout(r, 600));
      const items = await parseAndDiscoverCsv(content);
      if (items.length === 0) {
        setErrorMessage("We couldn't confidently identify recurring commitments from this CSV. Try our pre-loaded demo statement or add items manually.");
        setIsLoading(false);
        return;
      }
      onDiscovered(items, filename);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to parse CSV file. Please ensure it has date, description, and debit columns.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCsvContent(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadDemo = () => {
    processCsvContent(SAMPLE_BANK_STATEMENT_CSV, 'demo_statement_hdfc_sbi.csv');
  };

  return (
    <div className="w-full select-none">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              processCsvContent(text, file.name);
            };
            reader.readAsText(file);
          }
        }}
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.97) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 30px 70px -15px rgba(0,0,0,0.35), 0 14px 45px rgba(245, 158, 11, 0.28), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className={`relative z-10 w-full max-w-xl mx-auto rounded-[38px] sm:rounded-[44px] border-2 border-white p-7 sm:p-10 text-center transition-all duration-300 ${
          dragActive ? 'scale-[1.02] ring-4 ring-sky-400/40' : ''
        }`}
      >
        <input
          type="file"
          id="csv-upload-input"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          {/* 3D Sunlit Cloud Icon with Warm Sunshine Rays */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <svg
              className="absolute -inset-3 w-28 h-24 pointer-events-none text-amber-400/90"
              viewBox="0 0 100 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            >
              <line x1="16" y1="28" x2="8" y2="24" />
              <line x1="30" y1="12" x2="25" y2="4" />
              <line x1="50" y1="8" x2="50" y2="0" />
              <line x1="70" y1="12" x2="75" y2="4" />
              <line x1="84" y1="28" x2="92" y2="24" />
            </svg>
            <div className="w-20 h-15 sm:w-22 sm:h-16 rounded-[24px] bg-gradient-to-b from-[#7dd3fc] to-[#0ea5e9] shadow-[0_10px_25px_rgba(14,165,233,0.45),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center text-white relative">
              <Upload className="w-8 h-8 stroke-[3]" />
            </div>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-[28px] text-[#1e293b] mb-2.5 tracking-tight leading-snug">
            Upload Your Bank Statement CSV
          </h3>
          <p className="text-xs sm:text-[13px] text-[#64748b] mb-7 leading-relaxed max-w-md mx-auto font-medium">
            Drag and drop your 6-month exported statement. In Case runs client-side algorithms to identify recurring insurance, loans, investments, and subscriptions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <label
              htmlFor="csv-upload-input"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#f8f5f0] active:scale-[0.99] text-[#1e293b] font-bold text-xs sm:text-sm border border-[#dfd6c8] shadow-sm hover:shadow transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#0ea5e9] stroke-[2.5]" />
              <span>Choose CSV File</span>
            </label>

            <span className="text-xs text-[#94a3b8] font-bold">or</span>

            {/* Recommended 1-click Demo Statement */}
            <button
              type="button"
              onClick={handleLoadDemo}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-[0_8px_22px_rgba(14,165,233,0.4)] flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4 text-white fill-white/30" />
              <span>Load 6-Month Demo Statement</span>
            </button>
          </div>

          <p className="mt-5 text-[11px] text-[#94a3b8] font-medium tracking-tight">
            Expected headers: <code className="font-mono text-[#475569] font-semibold">date, description, debit, credit, balance</code>
          </p>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-[#fffdfa]/95 backdrop-blur-md rounded-[38px] sm:rounded-[44px] flex flex-col items-center justify-center z-20 animate-in fade-in">
            <div className="w-12 h-12 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mb-3 shadow-md" />
            <span className="text-sm font-extrabold text-[#1e293b]">Running Auto-Discovery Algorithm...</span>
            <span className="text-xs text-[#64748b] mt-1 font-medium">Normalizing merchant prefixes • Detecting recurrence cadences</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-3 max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

