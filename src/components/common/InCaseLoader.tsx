import React from 'react';
import { Lock, Shield } from 'lucide-react';

interface InCaseLoaderProps {
  message?: string;
  submessage?: string;
}

export const InCaseLoader: React.FC<InCaseLoaderProps> = ({
  message = 'Securing Emergency Blueprint...',
  submessage = 'Client-Side WebCrypto AES-GCM • Shamir 2-of-3 Secret Sharing',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center select-none">
      {/* Central Glowing Lock / Keyhole */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        {/* Outer Pulsing Glow Rings */}
        <div className="absolute inset-0 rounded-3xl bg-accent-sky/20 animate-ping opacity-30" />
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-accent-sky via-accent-cyan to-accent-amber opacity-40 blur-lg animate-pulse" />

        {/* Shield Frame */}
        <div className="relative w-20 h-20 rounded-2xl bg-navy-900 border border-accent-sky/50 flex items-center justify-center shadow-2xl shadow-accent-sky/25">
          <Lock className="w-9 h-9 text-accent-sky animate-bounce" />

          {/* Light Sweep Shimmer Effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 animate-sweep" />
          </div>
        </div>
      </div>

      {/* Official IN CASE Logo */}
      <div className="flex items-center justify-center mb-3">
        <img src="/logo.png" alt="IN CASE" className="h-7 w-auto object-contain" />
      </div>

      <p className="text-sm font-semibold text-slate-200 mb-1">{message}</p>
      <p className="text-xs text-slate-400 font-mono max-w-sm">{submessage}</p>
    </div>
  );
};
