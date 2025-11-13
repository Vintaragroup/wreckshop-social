import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Chrome, Facebook } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur rounded-lg border border-slate-800 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-slate-400 mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-900/30 border border-red-800 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="Sign in"
              data-testid="submit-sign-in"
              className="w-full block rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 px-3 py-2 text-white font-medium border border-indigo-500 shadow-sm"
              style={{ minHeight: 40 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900/50 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => redirectToStackAuth('google')}
                className="w-full inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-slate-100"
                disabled={loading}
              >
                <Chrome className="h-4 w-4" /> Google
              </button>
              <button
                type="button"
                onClick={() => redirectToStackAuth('facebook')}
                className="w-full inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-slate-100"
                disabled={loading}
              >
                <Facebook className="h-4 w-4" /> Facebook
              </button>
            </div>

            <p className="text-sm text-slate-400 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-indigo-400 hover:underline"
                onClick={() => navigate('/signup')}
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
