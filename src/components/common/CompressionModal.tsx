import React from 'react';
import { Sparkles, FileText, Minimize2, Maximize2, CheckCircle2 } from 'lucide-react';

interface CompressionModalProps {
  isOpen: boolean;
  mode: 'compressing' | 'decompressing';
  filename: string;
  progress: number;
  statusText: string;
  originalSize?: number;
  compressedSize?: number;
}

export const CompressionModal: React.FC<CompressionModalProps> = ({
  isOpen,
  mode,
  filename,
  progress,
  statusText,
  originalSize,
  compressedSize,
}) => {
  if (!isOpen) return null;

  const isCompressing = mode === 'compressing';
  const savedPercent =
    originalSize && compressedSize && originalSize > compressedSize
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-[36px] border-2 border-white p-7 sm:p-8 text-center text-[#1e293b] relative overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.95) 100%)',
          boxShadow: '0 30px 70px -15px rgba(245, 158, 11, 0.3), 0 20px 40px -10px rgba(0,0,0,0.4)',
        }}
      >
        {/* Animated Background Pulse Orbs */}
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-amber-400/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-orange-400/15 blur-3xl pointer-events-none animate-pulse" />

        {/* Pixar-Style Dynamic Compression/Decompression Graphic */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500 ${
              isCompressing
                ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 shadow-amber-500/40 animate-bounce'
                : 'bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 shadow-sky-500/40 animate-pulse'
            }`}
          >
            {isCompressing ? (
              <Minimize2 className="w-9 h-9 text-white animate-spin" style={{ animationDuration: '4s' }} />
            ) : (
              <Maximize2 className="w-9 h-9 text-white animate-pulse" />
            )}
          </div>

          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-xl sm:text-2xl text-[#1e293b] mb-1">
          {isCompressing ? 'Compressing Document' : 'Decompressing Document'}
        </h3>
        <p className="text-xs text-[#64748b] font-semibold truncate max-w-[280px] mx-auto mb-5">
          {filename}
        </p>

        {/* Progress Bar with Liquid Glow */}
        <div className="w-full bg-[#f1ece1] rounded-full h-3.5 p-0.5 border border-[#e2d8cb] mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              isCompressing
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                : 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400'
            }`}
            style={{ width: `${Math.max(5, progress)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>

        {/* Status text & progress % */}
        <div className="flex items-center justify-between text-xs font-bold text-[#475569] mb-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{statusText}</span>
          </span>
          <span className="font-mono text-amber-700">{progress}%</span>
        </div>

        {/* Compression Statistics Card */}
        {originalSize && compressedSize && compressedSize < originalSize && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs flex items-center justify-around font-medium">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Original</span>
              <span className="font-mono font-bold text-stone-700">
                {(originalSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="text-lg font-black text-amber-600">→</div>
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Compressed</span>
              <span className="font-mono font-bold text-amber-700">
                {(compressedSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
              -{savedPercent}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
