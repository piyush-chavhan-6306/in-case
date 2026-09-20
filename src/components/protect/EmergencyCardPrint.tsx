import React from 'react';
import { Shield, Lock, Printer, QrCode, ArrowLeft, HeartHandshake } from 'lucide-react';
import { TrustedShare } from '../../types';

interface EmergencyCardPrintProps {
  shares: TrustedShare[];
  onBack: () => void;
}

export const EmergencyCardPrint: React.FC<EmergencyCardPrintProps> = ({ shares, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf8f2] via-[#f7f2ea] to-[#f4eee4] text-[#1e293b] p-6 sm:p-10">
      {/* Top Controls (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#475569] hover:text-[#1e293b] border border-[#dfd4c4] text-xs font-bold flex items-center space-x-2 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Protection Manager</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white text-xs font-extrabold flex items-center space-x-2 shadow-[0_10px_25px_rgba(234,88,12,0.35)] transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Physical Cards</span>
        </button>
      </div>

      {/* Printable Cards Grid (Optimized for Paper Print CSS) */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center no-print mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-[#b45309] px-3.5 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] inline-block mb-2">
            Offline Survival Protocol
          </span>
          <h2 className="font-display font-black text-3xl text-[#1e293b]">Physical Emergency Cards</h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Cut these cards along the dashed borders and distribute them individually to your 3 trusted people.
          </p>
        </div>

        {shares.map((share, idx) => (
          <div
            key={share.id}
            style={{
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
            className="emergency-card-print bg-white text-[#1e293b] rounded-[32px] p-6 sm:p-8 border-2 border-dashed border-[#dfd4c4] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Left Card Details */}
            <div className="space-y-3.5 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] text-[#ea580c] font-black text-sm flex items-center justify-center border border-[#fde68a] shadow-xs">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#1e293b] tracking-tight">
                    IN CASE — EMERGENCY ACCESS SHARE
                  </h3>
                  <p className="text-xs font-bold text-[#64748b]">
                    {share.label} • Designated for: <strong className="text-[#1e293b]">{share.recipientName}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-[#f8f4ed] p-3.5 rounded-2xl border border-[#e2d7c7] text-xs space-y-1">
                <div className="font-bold text-[#1e293b] flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>2-OF-3 THRESHOLD SECURITY PROTOCOL:</span>
                </div>
                <p className="text-[#475569] text-[11px] font-medium leading-relaxed">
                  This share alone CANNOT access the financial kit. To unlock in an emergency, combine this card with{' '}
                  <strong className="text-[#1e293b]">any ONE other trusted person’s card</strong>.
                </p>
              </div>

              {/* Instructions */}
              <div className="text-[11px] text-[#475569] space-y-1 font-medium">
                <p>
                  <strong className="text-[#1e293b]">How to unlock:</strong> Visit the In Case portal, click <em>Trusted Unlock</em>, and scan or enter 2 of the 3 share codes.
                </p>
                <p className="text-[10px] text-[#94a3b8] font-mono">
                  Contains NO plaintext financial details. Client-side Shamir 2-of-3 threshold cryptography.
                </p>
              </div>

              {/* Share Key Snippet */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider block mb-0.5">
                  Cryptographic Share Key (Hex):
                </span>
                <code className="text-[10px] font-mono bg-[#f8f4ed] px-3 py-1.5 rounded-xl block break-all text-[#1e293b] border border-[#e2d7c7] select-all font-semibold">
                  {share.shareData}
                </code>
              </div>
            </div>

            {/* Right QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#fbf7f0] rounded-3xl border-2 border-[#e6dac9] shadow-xs flex-shrink-0">
              {share.qrDataUrl ? (
                <img
                  src={share.qrDataUrl}
                  alt={`QR code for ${share.label}`}
                  className="w-36 h-36 object-contain rounded-xl"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center bg-[#f1ebe1] rounded-xl">
                  <QrCode className="w-12 h-12 text-[#94a3b8]" />
                </div>
              )}
              <span className="text-[10px] font-black text-[#64748b] mt-2 uppercase tracking-wider">
                Scan with In Case
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
