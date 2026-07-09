import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAPI } from '../api/config';
import { saveSession } from '../auth';
import type { OrthoSession } from '../auth';

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Product', to: '/' },
  { label: 'Features', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'For Clinics', to: '/' },
  { label: 'Support', to: '/' },
];

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const ACCENT_HOVER = '#22c55e';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';

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
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: TEXT_PRIMARY,
        fontFamily: APPLE_FONT,
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Nav (mirrors Landing) ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          width: '100%',
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1024px',
            height: '48px',
            padding: '0 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '14px',
            color: TEXT_PRIMARY,
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="BANDZ"
          >
            <img
              src="/BANDZLOGO.jpg"
              alt="BANDZ"
              style={{
                height: '26px',
                width: 'auto',
                objectFit: 'contain',
                mixBlendMode: 'screen',
              }}
            />
          </button>
          <div style={{ display: 'contents' }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.to)}
                style={{
                  fontSize: '12px',
                  color: TEXT_PRIMARY,
                  opacity: 0.88,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: APPLE_FONT,
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/')}
              style={{
                fontSize: '12px',
                color: TEXT_PRIMARY,
                opacity: 0.88,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      {/* ── Centered form section ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 22px 120px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src="/BANDZLOGO.jpg"
            alt="BANDZ"
            style={{
              height: '72px',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              marginBottom: '32px',
            }}
          />

          <h1
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              lineHeight: 1.07,
              letterSpacing: '-0.005em',
              color: TEXT_PRIMARY,
              margin: 0,
            }}
          >
            {wantsSignup ? 'Create your account.' : 'Welcome back.'}
          </h1>
          <p
            style={{
              fontFamily: APPLE_FONT,
              fontSize: '19px',
              lineHeight: 1.4,
              letterSpacing: '0.011em',
              color: TEXT_PRIMARY,
              opacity: 0.72,
              marginTop: '16px',
              marginBottom: '48px',
              maxWidth: '400px',
            }}
          >
            {wantsSignup
              ? 'Set up your practice workspace in minutes.'
              : 'Sign in to continue to your dashboard.'}
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <ApplePillInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(v) => setEmail(v)}
            />
            <ApplePillInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(v) => setPassword(v)}
            />

            {error && (
              <p
                style={{
                  fontFamily: APPLE_FONT,
                  fontSize: '14px',
                  color: '#ff6b6b',
                  background: 'rgba(255,107,107,0.08)',
                  border: '1px solid rgba(255,107,107,0.24)',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  margin: 0,
                  textAlign: 'left',
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px',
              }}
            >
              <PillButton primary type="submit" disabled={loading} fullWidth>
                {loading
                  ? 'Signing in…'
                  : wantsSignup
                  ? 'Create account'
                  : 'Sign in'}
              </PillButton>
            </div>
          </form>

          <button
            type="button"
            style={{
              marginTop: '28px',
              fontFamily: APPLE_FONT,
              fontSize: '14px',
              color: ACCENT,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Forgot password?
          </button>

          <div
            style={{
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              width: '100%',
              fontFamily: APPLE_FONT,
              fontSize: '14px',
              color: TEXT_MUTED,
            }}
          >
            {wantsSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() =>
                navigate(wantsSignup ? '/login' : '/login?tab=signup')
              }
              style={{
                color: ACCENT,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: '14px',
                fontFamily: APPLE_FONT,
              }}
            >
              {wantsSignup ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          background: '#000000',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '12px',
          color: TEXT_MUTED,
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1024px',
            padding: '32px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Copyright © {new Date().getFullYear()} BANDZ Dental. All rights reserved.</span>
          <span>bandzdental.com</span>
        </div>
      </footer>
    </div>
  );
}

function ApplePillInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      required
      style={{
        fontFamily: APPLE_FONT,
        width: '100%',
        height: '60px',
        padding: '0 24px',
        fontSize: '17px',
        letterSpacing: '-0.012em',
        color: TEXT_PRIMARY,
        background: '#161617',
        border: focused
          ? `1px solid ${ACCENT}`
          : '1px solid rgba(255,255,255,0.10)',
        borderRadius: '980px',
        outline: 'none',
        transition: 'border-color 120ms ease, background 120ms ease',
        boxSizing: 'border-box',
      }}
    />
  );
}

function PillButton({
  children,
  primary,
  onClick,
  type,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const base: React.CSSProperties = {
    fontFamily: APPLE_FONT,
    fontSize: '17px',
    fontWeight: 500,
    lineHeight: 1,
    padding: '18px 32px',
    minWidth: fullWidth ? '100%' : '120px',
    width: fullWidth ? '100%' : undefined,
    borderRadius: '980px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    letterSpacing: '-0.022em',
  };
  if (primary) {
    return (
      <button
        type={type ?? 'button'}
        onClick={onClick}
        disabled={disabled}
        style={{
          ...base,
          background: ACCENT,
          color: '#000000',
          border: `1px solid ${ACCENT}`,
        }}
        onMouseEnter={(e) => {
          if (disabled) return;
          e.currentTarget.style.background = ACCENT_HOVER;
          e.currentTarget.style.borderColor = ACCENT_HOVER;
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          e.currentTarget.style.background = ACCENT;
          e.currentTarget.style.borderColor = ACCENT;
        }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        background: 'transparent',
        color: ACCENT,
        border: `1px solid ${ACCENT}`,
      }}
    >
      {children}
    </button>
  );
}
