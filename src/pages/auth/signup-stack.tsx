import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Chrome, Facebook, Music2, Zap, Star } from 'lucide-react';
import { WreckshopLogo } from '../../components/wreckshop-logo';

function CredentialSignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'ARTIST' | 'ARTIST_AND_MANAGER'>('ARTIST');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stackProjectId = import.meta.env.VITE_STACK_PROJECT_ID;
  const stackAppBaseUrl = useMemo(
    () => (import.meta.env.VITE_STACK_APP_BASE_URL || 'https://app.stack-auth.com').replace(/\/$/, ''),
    []
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name, accountType);
      navigate('/');
    } catch (e: any) {
      setError(e?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectToStackAuth = (provider: string) => {
    if (!stackProjectId) {
      setError('Stack Auth project ID is not configured');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/oauth/callback/${provider}`;
    const hostedPath = `${stackAppBaseUrl}/${stackProjectId}/sign-up`;
    const url = `${hostedPath}?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-in fade-in">
          {error}
        </div>
      )}

      {/* Account Type Selector */}
      <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <label className="text-sm font-semibold text-foreground">Account Type</label>
        <div className="grid grid-cols-2 gap-3">
          {/* Solo Artist Button */}
          <button
            type="button"
            onClick={() => setAccountType('ARTIST')}
            className={`relative group rounded-2xl p-4 transition-all duration-300 border ${
              accountType === 'ARTIST'
                ? 'border-primary/30 bg-white text-slate-900 shadow-[0_18px_40px_-30px_rgba(124,58,237,0.9)]'
                : 'border-transparent bg-white/70 text-slate-500 hover:border-primary/20'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Music2 className={`h-5 w-5 transition-colors ${
                accountType === 'ARTIST' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'
              }`} />
              <span className={`text-xs font-semibold text-center ${
                accountType === 'ARTIST' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                Solo Artist
              </span>
            </div>
          </button>

          {/* Manager Button */}
          <button
            type="button"
            onClick={() => setAccountType('ARTIST_AND_MANAGER')}
            className={`relative group rounded-2xl p-4 transition-all duration-300 border ${
              accountType === 'ARTIST_AND_MANAGER'
                ? 'border-accent/40 bg-white text-slate-900 shadow-[0_18px_40px_-30px_rgba(34,197,94,0.9)]'
                : 'border-transparent bg-white/70 text-slate-500 hover:border-accent/20'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Star className={`h-5 w-5 transition-colors ${
                accountType === 'ARTIST_AND_MANAGER' ? 'text-accent' : 'text-slate-400 group-hover:text-accent'
              }`} />
              <span className={`text-xs font-semibold text-center ${
                accountType === 'ARTIST_AND_MANAGER' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                + Manager
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Full Name Input */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <label className="text-sm font-semibold text-slate-600">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-60"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <label className="text-sm font-semibold text-slate-600">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-60"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <label className="text-sm font-semibold text-slate-600">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-60"
        />
        <p className="text-xs text-slate-500 font-medium">Minimum 8 characters</p>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <label className="text-sm font-semibold text-slate-600">Confirm Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-60"
        />
      </div>

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl h-12 font-semibold text-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-[0_25px_60px_-30px_rgba(124,58,237,1)] hover:shadow-[0_30px_70px_-30px_rgba(124,58,237,0.95)] transition-all duration-300 animate-fade-in flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ animationDelay: '0.3s' }}
      >
        {loading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Creating account...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Create Account
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative py-4 animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/60" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/85 px-3 text-slate-500 font-medium rounded-full border border-white/60">
            Or sign up with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <button
          type="button"
          onClick={() => redirectToStackAuth('google')}
          className="rounded-xl h-11 bg-white text-slate-900 border border-white/70 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] hover:shadow-[0_20px_35px_-20px_rgba(124,58,237,0.45)] transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Chrome className="h-5 w-5" />
          <span className="hidden sm:inline">Google</span>
        </button>
        <button
          type="button"
          onClick={() => redirectToStackAuth('facebook')}
          className="rounded-xl h-11 bg-white text-slate-900 border border-white/70 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] hover:shadow-[0_20px_35px_-20px_rgba(124,58,237,0.45)] transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Facebook className="h-5 w-5" />
          <span className="hidden sm:inline">Facebook</span>
        </button>
      </div>

      {/* Secondary OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
        <button
          type="button"
          onClick={() => redirectToStackAuth('spotify')}
          className="rounded-xl h-11 bg-white text-slate-900 border border-white/70 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] hover:shadow-[0_20px_35px_-20px_rgba(34,197,94,0.45)] transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Music2 className="h-5 w-5" />
          <span className="hidden sm:inline">Spotify</span>
        </button>
        <button
          type="button"
          onClick={() => redirectToStackAuth('tiktok')}
          className="rounded-xl h-11 bg-white text-slate-900 border border-white/70 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)] hover:shadow-[0_20px_35px_-20px_rgba(34,197,94,0.45)] transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <span className="text-lg">♪</span>
          <span className="hidden sm:inline">TikTok</span>
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center text-sm pt-2 animate-fade-in text-slate-600" style={{ animationDelay: '0.5s' }}>
        <span>Already have an account? </span>
        <a href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200">
          Sign in
        </a>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </form>
  );
}

export function SignupPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
  <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <WreckshopLogo size="md" animated />
        </div>

        {/* Card Container */}
  <div className="glass-elevated rounded-3xl border border-white/40 bg-white/85 shadow-[0_30px_120px_-45px_rgba(15,23,42,0.9)] p-8 backdrop-blur-2xl text-slate-900">
          {/* Header */}
          <div className="mb-6 text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Join Wreckshop
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Start connecting with your audience today
            </p>
          </div>

          {/* Sign Up Form */}
          <CredentialSignUp />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
