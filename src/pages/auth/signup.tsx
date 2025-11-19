/**
 * Signup Page
 * Stack Auth signup interface with glassmorphism design
 */

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Chrome, Facebook, Music2, Zap, Star } from 'lucide-react';
import { WreckshopLogo } from '../../components/wreckshop-logo';
import { appPath } from '../../lib/routes';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'ARTIST' | 'ARTIST_AND_MANAGER'>('ARTIST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const stackProjectId = import.meta.env.VITE_STACK_PROJECT_ID;
  const stackAppBaseUrl = useMemo(
    () => (import.meta.env.VITE_STACK_APP_BASE_URL || 'https://app.stack-auth.com').replace(/\/$/, ''),
    []
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(appPath('/'), { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
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
      await signup(email, password, name);
      navigate(appPath('/'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectToStackAuth = (provider: string) => {
    if (!stackProjectId) {
      setError('Stack Auth project ID is not configured');
      return;
    }

    const redirectUri = `${window.location.origin}${appPath(`/auth/oauth/callback/${provider}`)}`;
    const hostedPath = `${stackAppBaseUrl}/${stackProjectId}/sign-up`;
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
        <Card className="glass-elevated rounded-2xl border-white/10 shadow-2xl animate-fade-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Join Wreckshop
            </CardTitle>
            <CardDescription className="text-base">
              Start your journey as an artist today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 animate-in fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Account Type Selector */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="text-sm font-semibold text-foreground">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Solo Artist Button */}
                  <button
                    type="button"
                    onClick={() => setAccountType('ARTIST')}
                    className={`relative group rounded-xl p-4 transition-all duration-300 ${
                      accountType === 'ARTIST'
                        ? 'neuro ring-2 ring-primary/50 bg-primary/10'
                        : 'neuro-flat hover:ring-2 hover:ring-primary/30'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Music2 className={`h-5 w-5 transition-colors ${
                        accountType === 'ARTIST' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                      <span className={`text-xs font-semibold text-center ${
                        accountType === 'ARTIST' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        Solo Artist
                      </span>
                    </div>
                  </button>

                  {/* Manager Button */}
                  <button
                    type="button"
                    onClick={() => setAccountType('ARTIST_AND_MANAGER')}
                    className={`relative group rounded-xl p-4 transition-all duration-300 ${
                      accountType === 'ARTIST_AND_MANAGER'
                        ? 'neuro ring-2 ring-accent/50 bg-accent/10'
                        : 'neuro-flat hover:ring-2 hover:ring-accent/30'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Star className={`h-5 w-5 transition-colors ${
                        accountType === 'ARTIST_AND_MANAGER' ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'
                      }`} />
                      <span className={`text-xs font-semibold text-center ${
                        accountType === 'ARTIST_AND_MANAGER' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        + Manager
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name Input */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="glass rounded-lg border-white/20 bg-white/5 placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="glass rounded-lg border-white/20 bg-white/5 placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.45s' }}>
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="glass rounded-lg border-white/20 bg-white/5 placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10"
                />
                <p className="text-xs text-muted-foreground font-medium">
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="glass rounded-lg border-white/20 bg-white/5 placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10"
                />
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full neuro-primary rounded-lg h-11 font-semibold text-lg transition-all duration-300 hover:shadow-lg animate-fade-in"
                disabled={loading}
                style={{ animationDelay: '0.55s' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating account...
                  </span>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative py-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Or sign up with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.65s' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg h-11 neuro-flat border-white/20 hover:border-primary/50 transition-all duration-300"
                  onClick={() => redirectToStackAuth('google')}
                  disabled={loading}
                >
                  <Chrome className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg h-11 neuro-flat border-white/20 hover:border-primary/50 transition-all duration-300"
                  onClick={() => redirectToStackAuth('facebook')}
                  disabled={loading}
                >
                  <Facebook className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">Facebook</span>
                </Button>
              </div>

              {/* Secondary OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg h-11 neuro-flat border-white/20 hover:border-accent/50 transition-all duration-300"
                  onClick={() => redirectToStackAuth('spotify')}
                  disabled={loading}
                >
                  <Music2 className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">Spotify</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg h-11 neuro-flat border-white/20 hover:border-accent/50 transition-all duration-300"
                  onClick={() => redirectToStackAuth('tiktok')}
                  disabled={loading}
                >
                  <span className="text-lg">♪</span>
                  <span className="hidden sm:inline ml-2">TikTok</span>
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center text-sm pt-2 animate-fade-in" style={{ animationDelay: '0.75s' }}>
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  type="button"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
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
