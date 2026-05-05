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
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-12">

        {/* ── Left panel ── */}
        <aside className="hidden border-r border-border px-12 lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:py-14">
          <img src="/BANDZLOGO.jpg" alt="BANDZ" className="h-9 w-auto object-contain mix-blend-screen" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-primary">Practice Portal</p>
            <h2 className="mt-5 text-4xl font-light leading-[1.1] tracking-tight">
              Guide every patient toward consistent wear.
            </h2>
            <p className="mt-5 text-base leading-7 text-text-secondary">
              Built for busy orthodontic teams who need quick reviews, clear next steps, and better patient outcomes.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="self-start text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            ← Back to bandzdental.com
          </button>
        </aside>

        {/* ── Right panel ── */}
        <main className="flex items-center justify-center px-6 py-12 sm:px-10 lg:col-span-7">
          <div className="w-full max-w-sm">

            <img
              src="/BANDZLOGO.jpg"
              alt="BANDZ"
              className="mb-10 h-9 w-auto object-contain mix-blend-screen lg:hidden"
            />

            {/* Form card */}
            <div className="border border-border bg-bg-secondary px-8 py-10">
              <h1 className="text-xl font-semibold tracking-tight">
                {wantsSignup ? 'Create your account' : 'Sign in to BANDZ'}
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                {wantsSignup
                  ? 'Set up your practice workspace in minutes.'
                  : 'Welcome back. Continue to your dashboard.'}
              </p>

              <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 w-full border border-border bg-bg-tertiary px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-green-primary/60 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 w-full border border-border bg-bg-tertiary px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-green-primary/60 focus:outline-none transition-colors"
                  required
                />

                {error && (
                  <p className="rounded border border-red-accent/30 bg-red-accent/10 px-4 py-3 text-sm text-red-accent">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full bg-green-primary text-sm font-bold text-black transition-colors hover:bg-green-secondary disabled:opacity-50"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <button className="mt-5 text-sm text-text-muted transition-colors hover:text-text-secondary">
                Forgot password?
              </button>
            </div>

            {/* Bottom card */}
            <div className="mt-3 border border-border bg-bg-secondary px-8 py-5 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-text-secondary transition-colors hover:text-green-primary lg:hidden"
              >
                ← Back to BANDZ.com
              </button>
              <p className="hidden text-xs text-text-muted lg:block">
                Secure access for orthodontic staff and clinicians.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
