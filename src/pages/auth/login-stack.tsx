import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';

function CredentialSignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (e: any) {
      setError(e?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-red-900/30 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}
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
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 px-3 py-2 text-white font-medium"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-sm text-slate-400 text-center">
        Don't have an account?{' '}
        <a href="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}

export function LoginPage() {
  useEffect(() => {
    console.log('[LoginPage] mounted');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur rounded-lg border border-slate-800 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-slate-400 mb-8">Sign in to your account</p>
          <CredentialSignIn />
        </div>
      </div>
    </div>
  );
}
