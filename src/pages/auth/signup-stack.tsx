import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Chrome, Facebook, Music2 } from 'lucide-react';

function CredentialSignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-red-900/30 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </div>

      {/* Account Type Selection */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium">Account Type</label>
        <RadioGroup value={accountType} onValueChange={(val) => setAccountType(val as any)}>
          <div className="flex items-center space-x-2 p-3 rounded border border-slate-700 hover:border-slate-600 cursor-pointer">
            <RadioGroupItem value="ARTIST" id="artist" />
            <Label htmlFor="artist" className="flex-1 cursor-pointer">
              <div className="font-medium">Artist</div>
              <div className="text-xs text-muted-foreground">Solo artist, just want to track your growth</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded border border-slate-700 hover:border-slate-600 cursor-pointer">
            <RadioGroupItem value="ARTIST_AND_MANAGER" id="artist-manager" />
            <Label htmlFor="artist-manager" className="flex-1 cursor-pointer">
              <div className="font-medium">Artist & Manager</div>
              <div className="text-xs text-muted-foreground">Manage your own career + other artists</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-label="Create account"
        data-testid="submit-sign-up"
        className="w-full block rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 px-3 py-2 text-white font-medium border border-indigo-500 shadow-sm"
        style={{ minHeight: 40 }}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-slate-900/50 px-2 text-slate-400">Or sign up with</span>
        </div>
      </div>

      {/* Social buttons */}
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
        {String(import.meta.env.VITE_ENABLE_SPOTIFY_SSO || '').toLowerCase() === 'true' && (
          <button
            type="button"
            onClick={() => redirectToStackAuth('spotify')}
            className="col-span-2 w-full inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-slate-100"
            disabled={loading}
          >
            <Music2 className="h-4 w-4" /> Spotify
          </button>
        )}
      </div>
      <p className="text-sm text-slate-400 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-indigo-400 hover:underline">
          Sign in
        </a>
      </p>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur rounded-lg border border-slate-800 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Get started</h1>
          <p className="text-slate-400 mb-8">Create your account</p>
          <CredentialSignUp />
        </div>
      </div>
    </div>
  );
}
