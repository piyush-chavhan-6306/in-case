import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

interface AuthPageProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onClose }) => {
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        onSuccess?.();
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <img
          src="/reality_desk_bg.png"
          alt="Warm home background"
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        {/* Warm golden vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-stone-900/60 to-orange-900/40" />
        {/* Subtle noise texture feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Floating particles / orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-400/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-300/6 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/4 blur-3xl" />
      </div>

      {/* Auth Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          animation: 'authCardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <style>{`
          @keyframes authCardIn {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0px) scale(1); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        {/* Logo Header */}
        <div className="text-center mb-6 relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-0 top-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-3 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706)',
              boxShadow: '0 20px 40px -8px rgba(245, 158, 11, 0.5)',
            }}
          >
            <img src="/logo.png" alt="IN CASE" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-white font-black text-3xl tracking-tight drop-shadow-lg">IN CASE</h1>
          <p className="text-amber-200/80 text-sm font-medium mt-1">Your family's safety net starts here.</p>
        </div>

        {/* Card */}
        <div
          className="rounded-[28px] overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,252,245,0.97) 0%, rgba(254,248,238,0.95) 100%)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5), 0 20px 40px -10px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Tab switcher */}
          <div className="flex border-b border-stone-200/80">
            {(['signin', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                  mode === m
                    ? 'text-amber-700 border-b-2 border-amber-500 bg-amber-50/60'
                    : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            {/* Error / Success messages */}
            {error && (
              <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">{success}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 bg-white text-stone-800 font-medium text-sm placeholder:text-stone-300 transition-all duration-200 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  minLength={6}
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl border-2 border-stone-200 bg-white text-stone-800 font-medium text-sm placeholder:text-stone-300 transition-all duration-200 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2.5 mt-2"
              style={{
                background: loading
                  ? 'linear-gradient(135deg, #d97706, #ea580c)'
                  : 'linear-gradient(135deg, #f59e0b, #ea580c, #d97706)',
                boxShadow: loading ? 'none' : '0 12px 28px -6px rgba(234, 88, 12, 0.45)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === 'signup' ? 'Creating Account…' : 'Signing In…'}</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{mode === 'signup' ? 'Create My Account' : 'Sign In Securely'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-[#fffdf9] px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider relative">
                or continue with
              </span>
            </div>

            {/* Social OAuth Providers (Google & Microsoft) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google OAuth */}
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  const { error } = await signInWithOAuth('google');
                  if (error) {
                    if (error.message?.includes('not enabled') || error.message?.includes('validation_failed')) {
                      setError('Google OAuth provider is not yet enabled in your Supabase Dashboard. Go to Supabase > Authentication > Providers > Google, paste your Client ID & Secret, and add the redirect URL.');
                    } else {
                      setError(error.message);
                    }
                  }
                }}
                className="py-3 px-3 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-amber-300 text-stone-700 font-bold text-xs flex items-center justify-center space-x-2 shadow-2xs transition active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Microsoft OAuth */}
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  const { error } = await signInWithOAuth('azure');
                  if (error) {
                    if (error.message?.includes('not enabled') || error.message?.includes('validation_failed')) {
                      setError('Microsoft OAuth provider is not yet enabled in your Supabase Dashboard. Go to Supabase > Authentication > Providers > Azure, and paste your Azure Client ID & Secret.');
                    } else {
                      setError(error.message);
                    }
                  }
                }}
                className="py-3 px-3 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-amber-300 text-stone-700 font-bold text-xs flex items-center justify-center space-x-2 shadow-2xs transition active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Toggle mode link */}
            <p className="text-center text-xs text-stone-400 font-medium pt-1">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setMode('signup'); setError(''); }}
                    className="text-amber-600 font-black hover:text-amber-700 transition-colors">
                    Create one →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setMode('signin'); setError(''); }}
                    className="text-amber-600 font-black hover:text-amber-700 transition-colors">
                    Sign in →
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Footer */}
          <div className="px-7 pb-5 text-center">
            <p className="text-[10px] text-stone-300 font-medium">
              🔒 Your data is encrypted end-to-end. IN CASE never sells your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
