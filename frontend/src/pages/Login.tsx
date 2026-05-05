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
          className="h-10 w-auto object-contain mix-blend-screen mb-16 self-start"
        />
        <h2 className="text-5xl font-light tracking-tight leading-[1.1] mb-6">
          Keep your patients<br />
          <span className="text-green-primary">on track.</span>
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-xs">
          The orthodontic compliance platform built for modern practices.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-12 py-16">

        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="md:hidden h-10 w-auto object-contain mix-blend-screen mb-12"
        />

        <div className="w-full max-w-[380px]">

          {/* Form card */}
          <div className="bg-bg-secondary border border-border px-10 py-12 mb-3">
            <h1 className="text-[17px] font-semibold text-center mb-10 tracking-wide">
              {wantsSignup ? 'Create your account' : 'Sign in to BANDZ'}
            </h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-14 bg-bg-tertiary border border-border px-5 text-[15px] text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-green-primary/50 transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-14 bg-bg-tertiary border border-border px-5 text-[15px] text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-green-primary/50 transition-colors"
                required
              />

              {error && <p className="text-red-accent text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-green-primary text-black font-bold text-[15px] hover:bg-green-secondary transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <button className="w-full mt-6 text-sm text-text-muted hover:text-text-secondary text-center py-2 transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Back link card */}
          <div className="bg-bg-secondary border border-border px-10 py-6 text-center">
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
