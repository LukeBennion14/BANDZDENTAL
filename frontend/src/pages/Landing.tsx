import { useNavigate } from 'react-router-dom';

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Product', to: '/' },
  { label: 'Features', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'For Clinics', to: '/' },
  { label: 'Support', to: '/' },
];

const SECTIONS = [
  {
    eyebrow: 'Daily Photo Submissions',
    title: 'Proof, every single day.',
    subtitle:
      'Patients submit a quick photo of aligner or elastic wear right from their phone. No more guessing between visits.',
    bg: '#000000',
  },
  {
    eyebrow: 'Focused Review Queue',
    title: 'One inbox. Cleared in one pass.',
    subtitle:
      'Every pending submission lands in a single, uncluttered queue your staff can move through in minutes.',
    bg: '#0b0b0d',
  },
  {
    eyebrow: 'Compliance Dashboard',
    title: 'Adherence, in real time.',
    subtitle:
      'Per-patient and practice-wide trends refresh daily so you can spot risk before chair time.',
    bg: '#000000',
  },
  {
    eyebrow: 'Smart Scheduling',
    title: 'Reach out before the wasted visit.',
    subtitle:
      'Surface patients who need attention ahead of their next appointment — not after.',
    bg: '#0b0b0d',
  },
];

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const ACCENT_HOVER = '#22c55e';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: TEXT_PRIMARY,
        fontFamily: APPLE_FONT,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── Nav ── */}
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
              onClick={() => navigate('/login')}
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
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection onPrimary={() => navigate('/login?tab=signup')} onSecondary={() => navigate('/login')} />

      {/* ── Feature sections ── */}
      {SECTIONS.map((s) => (
        <FeatureSection key={s.eyebrow} {...s} onPrimary={() => navigate('/login?tab=signup')} />
      ))}

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

function HeroSection({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  return (
    <section
      style={{
        background: '#000000',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: '1024px',
          padding: '80px 22px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            lineHeight: 0,
          }}
        >
          <img
            src="/BANDZLOGO.jpg"
            alt="BANDZ"
            style={{
              height: 'clamp(120px, 16vw, 220px)',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'screen',
            }}
          />
        </h1>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontWeight: 500,
            fontSize: 'clamp(21px, 2.2vw, 28px)',
            lineHeight: 1.15,
            letterSpacing: '0.004em',
            color: TEXT_PRIMARY,
            marginTop: '20px',
          }}
        >
          Compliance, finally visible.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '28px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <PillButton primary onClick={onPrimary}>
            Book a demo
          </PillButton>
          <PillButton onClick={onSecondary}>Learn more &gt;</PillButton>
        </div>
      </div>

      {/* Product visual — dashboard preview */}
      <div
        style={{
          margin: '0 auto',
          maxWidth: '1024px',
          padding: '60px 22px 140px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <DashboardPreview />
      </div>
    </section>
  );
}

function FeatureSection({
  eyebrow,
  title,
  subtitle,
  bg,
  onPrimary,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  bg: string;
  onPrimary: () => void;
}) {
  return (
    <section
      style={{
        background: bg,
        width: '100%',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: '1024px',
          padding: '140px 22px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '19px',
            fontWeight: 600,
            letterSpacing: '-0.003em',
            color: ACCENT,
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: APPLE_FONT,
            fontWeight: 600,
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.07,
            letterSpacing: '-0.005em',
            color: TEXT_PRIMARY,
            marginTop: '10px',
            maxWidth: '820px',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '21px',
            lineHeight: 1.38,
            letterSpacing: '0.011em',
            color: TEXT_PRIMARY,
            opacity: 0.86,
            marginTop: '24px',
            maxWidth: '640px',
          }}
        >
          {subtitle}
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <PillButton primary onClick={onPrimary}>
            Get started
          </PillButton>
          <PillButton onClick={onPrimary}>Learn more &gt;</PillButton>
        </div>
      </div>
    </section>
  );
}

function PillButton({
  children,
  primary,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  const base: React.CSSProperties = {
    fontFamily: APPLE_FONT,
    fontSize: '17px',
    fontWeight: 500,
    lineHeight: 1,
    padding: '12px 22px',
    minWidth: '120px',
    borderRadius: '980px',
    cursor: 'pointer',
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    letterSpacing: '-0.022em',
  };
  if (primary) {
    return (
      <button
        onClick={onClick}
        style={{
          ...base,
          background: ACCENT,
          color: '#000000',
          border: `1px solid ${ACCENT}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = ACCENT_HOVER;
          e.currentTarget.style.borderColor = ACCENT_HOVER;
        }}
        onMouseLeave={(e) => {
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
      onClick={onClick}
      style={{
        ...base,
        background: 'transparent',
        color: ACCENT,
        border: `1px solid ${ACCENT}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = ACCENT;
        e.currentTarget.style.color = '#000000';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = ACCENT;
      }}
    >
      {children}
    </button>
  );
}

function DashboardPreview() {
  const rows = [
    { label: 'Photos Submitted', value: '86%', period: 'Today' },
    { label: 'On-Time Responses', value: '74%', period: 'This Week' },
    { label: 'Needs Follow-Up', value: '12', period: 'Patients' },
  ];
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
        background: '#161617',
        borderRadius: '28px',
        padding: '36px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      <p
        style={{
          fontFamily: APPLE_FONT,
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: ACCENT,
          margin: 0,
        }}
      >
        Compliance Visibility
      </p>
      <h3
        style={{
          fontFamily: APPLE_FONT,
          fontWeight: 600,
          fontSize: '28px',
          lineHeight: 1.15,
          letterSpacing: '-0.003em',
          color: TEXT_PRIMARY,
          marginTop: '12px',
          marginBottom: '32px',
        }}
      >
        A daily view of who's on track.
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '22px 24px',
              borderRadius: '18px',
              background: '#1d1d1f',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: APPLE_FONT,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: TEXT_MUTED,
                  margin: 0,
                }}
              >
                {r.label}
              </p>
              <p
                style={{
                  fontFamily: APPLE_FONT,
                  fontWeight: 600,
                  fontSize: '34px',
                  lineHeight: 1,
                  letterSpacing: '-0.005em',
                  color: TEXT_PRIMARY,
                  marginTop: '10px',
                }}
              >
                {r.value}
              </p>
            </div>
            <span
              style={{
                fontFamily: APPLE_FONT,
                fontSize: '12px',
                fontWeight: 500,
                padding: '7px 14px',
                borderRadius: '999px',
                background: 'rgba(74,222,128,0.12)',
                color: ACCENT,
                border: '1px solid rgba(74,222,128,0.24)',
              }}
            >
              {r.period}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
