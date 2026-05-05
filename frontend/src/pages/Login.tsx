import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAPI } from '../api/config';
import { saveSession } from '../auth';
import type { OrthoSession } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const wantsSignup = searchParams.get('tab') === 'signup';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await fetchAPI<OrthoSession>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      saveSession(session);
      navigate('/app/dashboard', { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">

      {/* ── Left panel ── */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-20 border-r border-border">
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="h-16 w-auto object-contain mix-blend-screen mb-14 self-start"
        />
        <h2 className="text-5xl font-light tracking-tight leading-tight mb-6">
          Keep your patients<br />
          <span className="text-green-primary">on track.</span>
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-sm">
          The orthodontic compliance platform that turns daily photo submissions into clear, actionable insights.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">

        {/* Mobile logo */}
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="md:hidden h-12 w-auto object-contain mix-blend-screen mb-10"
        />

        <div className="w-full max-w-[360px] space-y-3">

          {/* Main form card */}
          <div className="border border-border bg-bg-secondary px-10 py-10">
            <h1 className="text-lg font-semibold text-text-primary mb-8 text-center tracking-wide">
              {wantsSignup ? 'Create your account' : 'Sign in to BANDZ'}
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-bg-tertiary border border-border px-5 py-4 text-[15px] text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-green-primary/50 transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-bg-tertiary border border-border px-5 py-4 text-[15px] text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-green-primary/50 transition-colors"
                required
              />

              {error && <p className="text-red-accent text-sm pt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-primary text-black font-bold py-4 text-[15px] hover:bg-green-secondary transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <button className="w-full mt-5 text-sm text-text-muted hover:text-text-secondary text-center py-1.5 transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Create account card */}
          <div className="border border-border bg-bg-secondary px-10 py-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-text-secondary hover:text-green-primary transition-colors"
            >
              ← Back to <span className="font-semibold">BANDZ.com</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
