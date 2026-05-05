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

  // If they arrived via ?tab=signup, show the signup note
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
      {/* Left panel — branding */}
      <div className="hidden md:flex flex-col justify-center px-16 flex-1 border-r border-border">
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="h-14 w-auto object-contain mix-blend-screen mb-10 self-start"
        />
        <h2 className="text-4xl font-light tracking-tight mb-4 leading-snug">
          Keep your patients<br />
          <span className="text-green-primary">on track.</span>
        </h2>
        <p className="text-text-secondary text-base leading-relaxed max-w-sm">
          The orthodontic compliance platform that turns daily photo submissions into clear, actionable insights for your practice.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center items-center flex-1 px-8 py-16">
        {/* Mobile logo */}
        <div className="md:hidden mb-10">
          <img
            src="/BANDZLOGO.jpg"
            alt="BANDZ"
            className="h-12 w-auto object-contain mix-blend-screen"
          />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-text-primary mb-8">
            {wantsSignup ? 'Create your account' : 'Sign in to BANDZ'}
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-bg-tertiary border border-border px-4 py-3.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/60 text-sm transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-bg-tertiary border border-border px-4 py-3.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/60 text-sm transition-colors"
              required
            />

            {error && <p className="text-red-accent text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-primary text-black font-semibold py-3.5 text-sm hover:bg-green-secondary transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <button className="w-full mt-3 text-sm text-text-muted hover:text-text-secondary text-center py-1 transition-colors">
            Forgot password?
          </button>

          <div className="mt-8 border-t border-border pt-6">
            <button
              onClick={() => navigate('/')}
              className="w-full border border-border text-text-secondary text-sm py-3.5 hover:border-green-primary/50 hover:text-text-primary transition-colors"
            >
              Back to BANDZ.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
