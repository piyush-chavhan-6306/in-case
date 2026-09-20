import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  QrCode,
  Copy,
  Check,
  Printer,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { InventoryItem, VaultData, TrustedShare } from '../../types';
import { generateMasterKey, encryptInventory, splitKeyIntoTrustedShares } from '../../utils/crypto';
import { saveVault, saveShares } from '../../utils/storage';

interface EncryptVaultViewProps {
  items: InventoryItem[];
  vault: VaultData | null;
  shares: TrustedShare[];
  onVaultCreated: (vault: VaultData, shares: TrustedShare[]) => void;
  onOpenPrintCards: () => void;
  onProceedToRehearse: () => void;
}

export const EncryptVaultView: React.FC<EncryptVaultViewProps> = ({
  items,
  vault,
  shares,
  onVaultCreated,
  onOpenPrintCards,
  onProceedToRehearse,
}) => {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [personNames, setPersonNames] = useState<[string, string, string]>([
    'Spouse (Priya)',
    'Brother / Sibling (Vikram)',
    'Trusted Friend / Family Attorney',
  ]);
  const [showRawKeys, setShowRawKeys] = useState(false);

  const handleGenerateAndEncrypt = async () => {
    setIsEncrypting(true);
    try {
      // 1. Generate random 256-bit AES Master Key
      const { key, keyHex } = await generateMasterKey();

      // 2. Encrypt inventory client-side with AES-GCM
      const encryptedVault = await encryptInventory(items, key);

      // 3. Split master key into 3 Shamir shares (2-of-3 threshold)
      const generatedShares = await splitKeyIntoTrustedShares(keyHex, personNames);

      // 4. Save encrypted vault and shares to local storage
      saveVault(encryptedVault);
      saveShares(generatedShares);

      onVaultCreated(encryptedVault, generatedShares);
    } catch (err) {
      console.error('Failed to encrypt kit:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopyShare = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isProtected = !!vault && shares.length === 3;

  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a] text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Module 02 — Cryptographic Protection</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1e293b] tracking-tight mb-3">
          Client-Side AES-256 & 2-of-3 Secret Sharing
        </h2>
        <p className="text-sm text-[#64748b] leading-relaxed font-medium">
          Encrypt your {items.length} family commitments right in your browser. The master key is split into 3 shares so that any 2 trusted people can unlock the kit together during an emergency.
        </p>
      </div>

      {!isProtected ? (
        /* Configuration Step before encryption */
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
          }}
          className="rounded-[38px] sm:rounded-[44px] p-8 sm:p-12 border-2 border-white mb-10 text-center"
        >
          <div className="max-w-xl mx-auto text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbb534] to-[#f59e0b] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1e293b] mb-2 tracking-tight">
              Designate Your 3 Trusted Guardians
            </h3>
            <p className="text-xs sm:text-[13px] text-[#64748b] font-medium">
              Each guardian receives a separate share code or QR card. No single person can unlock the vault alone.
            </p>
          </div>

          {/* Trusted Person Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {['Person A (Primary Guardian)', 'Person B (Secondary Guardian)', 'Person C (Tertiary / Friend)'].map(
              (label, i) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl bg-[#f6f1e8] hover:bg-[#f1ebe1] border border-[#dfd4c4] text-left transition shadow-2xs"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0284c7] block mb-1.5">
                    Share {i + 1} Recipient
                  </span>
                  <input
                    type="text"
                    value={personNames[i]}
                    onChange={(e) => {
                      const next = [...personNames] as [string, string, string];
                      next[i] = e.target.value;
                      setPersonNames(next);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dfd4c4] focus:border-[#0ea5e9] text-[#1e293b] text-xs font-semibold focus:outline-none transition shadow-inner"
                    placeholder={`e.g. Guardian ${i + 1}`}
                  />
                </div>
              )
            )}
          </div>

          {/* Encrypt Action Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateAndEncrypt}
              disabled={isEncrypting}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-black text-base transition flex items-center justify-center space-x-3 mx-auto shadow-[0_12px_28px_rgba(234,88,12,0.4)]"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isEncrypting ? 'Sealing with WebCrypto...' : 'Seal Vault & Generate 3 Shares'}</span>
            </button>
            <p className="text-[11px] text-[#94a3b8] mt-3 font-medium">
              AES-GCM 256-bit • Random 96-bit IV • Zero-knowledge client-side encryption
            </p>
          </div>
        </div>
      ) : (
        /* Vault is Encrypted: Display 3 Trusted Shares */
        <div className="space-y-8">
          {/* Status Banner */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.95) 100%)',
              boxShadow: '0 15px 35px -8px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
            className="rounded-[32px] p-6 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center border border-[#bbf7d0] shadow-2xs flex-shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-display font-black text-[#1e293b] text-base">
                  Family Vault Encrypted & Protected
                </h4>
                <p className="text-xs text-[#64748b] font-medium mt-0.5">
                  Ciphertext stored locally in IndexedDB/Storage • {vault.itemCount} items sealed • 2-of-3 threshold active
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={onOpenPrintCards}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#f8f5f0] text-[#1e293b] border border-[#dfd6c8] text-xs font-bold flex items-center space-x-2 transition shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#0ea5e9]" />
                <span>Print Physical Cards</span>
              </button>

              <button
                onClick={() => setShowRawKeys(!showRawKeys)}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-[#f8f5f0] text-[#64748b] hover:text-[#1e293b] text-xs font-bold border border-[#dfd6c8] flex items-center space-x-1.5 transition shadow-2xs"
              >
                {showRawKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showRawKeys ? 'Hide Keys' : 'Reveal Keys'}</span>
              </button>
            </div>
          </div>

          {/* 3 Trusted Shares Grid (PRD Section 16) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shares.map((share, idx) => (
              <div
                key={share.id}
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
                  boxShadow: '0 15px 35px -8px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
                }}
                className="rounded-[32px] p-6 border-2 border-white flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0284c7] px-3 py-1 rounded-full bg-[#e0f2fe] border border-[#bae6fd]">
                      Share 0{idx + 1} of 03
                    </span>
                    <span className="text-[11px] font-black text-[#b45309] font-mono px-2.5 py-0.5 rounded-full bg-[#fef3c7] border border-[#fde68a]">
                      Threshold: 2
                    </span>
                  </div>

                  <h4 className="font-display font-black text-lg text-[#1e293b] mb-1">
                    {share.label}
                  </h4>
                  <p className="text-xs font-semibold text-[#64748b] mb-4">
                    For: <strong className="text-[#1e293b]">{share.recipientName}</strong>
                  </p>

                  {/* QR Code */}
                  <div className="w-full flex flex-col items-center justify-center p-4 bg-white rounded-2xl mb-4 border border-[#ebdccb] shadow-2xs">
                    {share.qrDataUrl ? (
                      <img
                        src={share.qrDataUrl}
                        alt={`QR for ${share.label}`}
                        className="w-32 h-32 object-contain"
                      />
                    ) : (
                      <QrCode className="w-32 h-32 text-stone-400" />
                    )}
                    <span className="text-[10px] text-[#786b5f] font-bold mt-2 uppercase tracking-wider">
                      Scan to Unlock
                    </span>
                  </div>

                  {/* Share Key Snippet */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] text-[#64748b] font-black uppercase tracking-wider">
                      Shamir Share Hex:
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#f6f1e8] border border-[#e2d8cb] text-[11px] font-mono text-[#1e293b] break-all select-all shadow-inner">
                      {showRawKeys
                        ? share.shareData
                        : `${share.shareData.slice(0, 14)}••••••••••••${share.shareData.slice(-8)}`}
                    </div>
                  </div>
                </div>

                {/* Copy Action */}
                <button
                  onClick={() => handleCopyShare(share.shareData, idx)}
                  className={`w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center space-x-2 border transition shadow-2xs ${
                    copiedIndex === idx
                      ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                      : 'bg-white hover:bg-[#f8f5f0] text-[#1e293b] border-[#dfd6c8]'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-4 h-4 text-[#16a34a]" />
                      <span>Share Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#0ea5e9]" />
                      <span>Copy Share Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Security Advisory Box */}
          <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs font-medium flex items-center space-x-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#d97706]" />
            <span>
              <strong>Crucial Safety Rule:</strong> Give these 3 shares to 3 separate people. During an emergency, any two guardians can combine their shares to unlock the inventory. A single share alone reveals zero financial data.
            </span>
          </div>

          {/* Bottom Next Step: Family Fire Drill */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
              boxShadow: '0 20px 45px -10px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
            className="rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
          >
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#be123c] block mb-1">
                Module 03 — Family Fire Drill
              </span>
              <h4 className="font-display font-black text-xl text-[#1e293b]">
                Prove your family can actually unlock & use this.
              </h4>
              <p className="text-xs text-[#64748b] font-medium mt-0.5">
                Test the 2-of-3 unlock and launch a timed drill with real questions from your inventory.
              </p>
            </div>

            <button
              onClick={onProceedToRehearse}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-[0_10px_25px_rgba(234,88,12,0.38)] flex-shrink-0"
            >
              <span>Test Unlock & Start Fire Drill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
