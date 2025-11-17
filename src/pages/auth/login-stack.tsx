import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Chrome, Facebook, Music2, Zap } from 'lucide-react';
import { WreckshopLogo } from '../../components/wreckshop-logo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const stackProjectId = import.meta.env.VITE_STACK_PROJECT_ID;
  const stackAppBaseUrl = useMemo(
    () => (import.meta.env.VITE_STACK_APP_BASE_URL || 'https://app.stack-auth.com').replace(/\/$/, ''),
    []
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
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
    const hostedPath = `${stackAppBaseUrl}/${stackProjectId}/sign-in`;
    const url = `${hostedPath}?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

  <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <WreckshopLogo size="md" showText={true} animated={true} />
        </div>

        {/* Glass Card */}
        <div
          className="glass-elevated rounded-3xl border border-white/40 bg-white/85 shadow-[0_30px_120px_-45px_rgba(15,23,42,0.9)] animate-fade-in p-8 text-slate-900"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="space-y-2 pb-6">
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base text-slate-600">
              Sign in to your Wreckshop account and keep growing
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-in fade-in">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="email" className="text-sm font-semibold text-slate-600">
                Email Address
              </label>
              <input
                id="email"
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
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <label htmlFor="password" className="text-sm font-semibold text-slate-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/30 outline-none disabled:opacity-60"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full rounded-2xl h-12 font-semibold text-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-[0_25px_60px_-30px_rgba(124,58,237,1)] hover:shadow-[0_30px_70px_-30px_rgba(124,58,237,0.95)] transition-all duration-300 animate-fade-in flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
              style={{ animationDelay: '0.5s' }}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/60" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/85 px-3 text-slate-500 font-medium rounded-full border border-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.7s' }}>
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
            <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.75s' }}>
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

            {/* Sign Up Link */}
            <div className="text-center text-sm pt-2 animate-fade-in text-slate-600" style={{ animationDelay: '0.8s' }}>
              <span>Don't have an account? </span>
              <button
                type="button"
                className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                onClick={() => navigate('/signup')}
                disabled={loading}
              >
                Create one
              </button>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <p>Secure authentication powered by Stack Auth</p>
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
