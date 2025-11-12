import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

function CredentialSignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'ARTIST' | 'ARTIST_AND_MANAGER'>('ARTIST');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        className="w-full rounded bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 px-3 py-2 text-white font-medium"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
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
  useEffect(() => {
    console.log('[SignupPage] mounted');
  }, []);

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
