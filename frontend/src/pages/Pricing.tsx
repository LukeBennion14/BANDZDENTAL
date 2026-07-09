import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const TARGET_TREATMENT_MONTHS = 19;
const APPOINTMENT_COST = 250;
const APPOINTMENTS_PER_MONTH = 2 / 3;

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function Pricing() {
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
      <Nav navigate={navigate} />

      {/* Hero */}
      <section style={{ background: '#000000', width: '100%' }}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1024px',
            padding: '120px 22px 60px',
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
            Pricing
          </p>
          <h1
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: 'clamp(44px, 6vw, 84px)',
              lineHeight: 1.05,
              letterSpacing: '-0.005em',
              color: TEXT_PRIMARY,
              marginTop: '12px',
              maxWidth: '820px',
            }}
          >
            One plan per practice.
            <br />
            Priced to pay for itself.
          </h1>
          <p
            style={{
              fontFamily: APPLE_FONT,
              fontSize: '21px',
              lineHeight: 1.4,
              letterSpacing: '0.011em',
              color: TEXT_PRIMARY,
              opacity: 0.78,
              marginTop: '24px',
              maxWidth: '620px',
            }}
          >
            BANDZ reduces average treatment times by keeping patients accountable between visits.
            Shorter treatments mean fewer appointments per patient — and real money back on your books.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section style={{ background: '#000000', width: '100%' }}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1024px',
            padding: '40px 22px 120px',
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          <PricingCard
            name="Growing Practice"
            price={500}
            eligibility="For practices under 600 active patients"
            highlights={[
              'Daily patient photo submissions',
              'Focused staff review queue',
              'Compliance dashboard',
              'Smart scheduling alerts',
              'Unlimited clinicians & staff seats',
            ]}
            onClick={() => navigate('/login?tab=signup')}
          />
          <PricingCard
            name="Established Practice"
            price={700}
            featured
            eligibility="For practices with 600+ active patients"
            highlights={[
              'Everything in Growing Practice',
              'Priority onboarding & training',
              'Practice-wide adherence analytics',
              'Dedicated success manager',
              'Custom reporting exports',
            ]}
            onClick={() => navigate('/login?tab=signup')}
          />
        </div>
      </section>

      {/* Calculator */}
      <section
        style={{
          background: '#0b0b0d',
          width: '100%',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1024px',
            padding: '140px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
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
            See Your ROI
          </p>
          <h2
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.07,
              letterSpacing: '-0.005em',
              color: TEXT_PRIMARY,
              marginTop: '12px',
              maxWidth: '820px',
            }}
          >
            Calculate what shorter treatments are worth.
          </h2>
          <p
            style={{
              fontFamily: APPLE_FONT,
              fontSize: '19px',
              lineHeight: 1.42,
              letterSpacing: '0.011em',
              color: TEXT_PRIMARY,
              opacity: 0.78,
              marginTop: '20px',
              maxWidth: '620px',
            }}
          >
            The average orthodontic appointment costs your practice{' '}
            <strong style={{ color: TEXT_PRIMARY, opacity: 1 }}>${APPOINTMENT_COST}</strong> in chair time and
            supplies. BANDZ brings average treatment down to{' '}
            <strong style={{ color: TEXT_PRIMARY, opacity: 1 }}>{TARGET_TREATMENT_MONTHS} months</strong>.
            Every month you cut off the tail saves ~{APPOINTMENTS_PER_MONTH.toFixed(2)} appointments per patient
            (patients visit every 6 weeks). Enter your numbers below.
          </p>

          <ROICalculator />
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#000000', width: '100%' }}>
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
          <h2
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.07,
              letterSpacing: '-0.005em',
              color: TEXT_PRIMARY,
              margin: 0,
              maxWidth: '780px',
            }}
          >
            Ready to shorten your treatment tail?
          </h2>
          <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <PillButton primary onClick={() => navigate('/login?tab=signup')}>
              Book a demo
            </PillButton>
            <PillButton onClick={() => navigate('/')}>Learn more &gt;</PillButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
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
              fontFamily: APPLE_FONT,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

function PricingCard({
  name,
  price,
  eligibility,
  highlights,
  featured,
  onClick,
}: {
  name: string;
  price: number;
  eligibility: string;
  highlights: string[];
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: featured ? '#161617' : '#0b0b0d',
        border: featured
          ? `1px solid rgba(74,222,128,0.35)`
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: featured
          ? '0 30px 80px rgba(74,222,128,0.06), 0 10px 30px rgba(0,0,0,0.35)'
          : '0 10px 30px rgba(0,0,0,0.25)',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: featured ? ACCENT : TEXT_MUTED,
            margin: 0,
          }}
        >
          {name}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '18px' }}>
          <span
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: '64px',
              lineHeight: 1,
              letterSpacing: '-0.005em',
              color: TEXT_PRIMARY,
            }}
          >
            ${price}
          </span>
          <span
            style={{
              fontFamily: APPLE_FONT,
              fontSize: '17px',
              color: TEXT_PRIMARY,
              opacity: 0.7,
            }}
          >
            / month
          </span>
        </div>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '15px',
            color: TEXT_PRIMARY,
            opacity: 0.72,
            marginTop: '12px',
          }}
        >
          {eligibility}
        </p>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {highlights.map((h) => (
          <li
            key={h}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontFamily: APPLE_FONT,
              fontSize: '15px',
              lineHeight: 1.45,
              color: TEXT_PRIMARY,
              opacity: 0.9,
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                marginTop: '2px',
                borderRadius: '999px',
                background: 'rgba(74,222,128,0.16)',
                color: ACCENT,
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              ✓
            </span>
            {h}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', display: 'flex' }}>
        <PillButton primary={featured} onClick={onClick} fullWidth>
          Get started
        </PillButton>
      </div>
    </div>
  );
}

function ROICalculator() {
  const [avgTreatmentMonths, setAvgTreatmentMonths] = useState(24);
  const [numPatients, setNumPatients] = useState(400);

  const results = useMemo(() => {
    const extraMonths = Math.max(0, avgTreatmentMonths - TARGET_TREATMENT_MONTHS);
    const extraAppointmentsPerPatient = extraMonths * APPOINTMENTS_PER_MONTH;
    const lostRevenuePerPatient = extraAppointmentsPerPatient * APPOINTMENT_COST;
    const totalSavings = lostRevenuePerPatient * numPatients;

    const bandzTier = numPatients >= 600 ? 700 : 500;
    const bandzAnnualCost = bandzTier * 12;
    const netAnnualSavings = totalSavings - bandzAnnualCost;
    const roi = bandzAnnualCost > 0 ? totalSavings / bandzAnnualCost : 0;

    return {
      extraMonths,
      extraAppointmentsPerPatient,
      lostRevenuePerPatient,
      totalSavings,
      bandzTier,
      bandzAnnualCost,
      netAnnualSavings,
      roi,
    };
  }, [avgTreatmentMonths, numPatients]);

  return (
    <div
      style={{
        marginTop: '56px',
        width: '100%',
        maxWidth: '860px',
        background: '#000000',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* Inputs */}
      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          textAlign: 'left',
        }}
      >
        <CalcInput
          label="Your average treatment time"
          suffix="months"
          value={avgTreatmentMonths}
          min={12}
          max={48}
          onChange={setAvgTreatmentMonths}
        />
        <CalcInput
          label="Active patients in treatment"
          suffix="patients"
          value={numPatients}
          min={0}
          max={5000}
          onChange={setNumPatients}
        />
      </div>

      {/* Headline result */}
      <div
        style={{
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.24)',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
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
          Estimated savings across your roster
        </p>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontWeight: 600,
            fontSize: 'clamp(48px, 8vw, 88px)',
            lineHeight: 1,
            letterSpacing: '-0.005em',
            color: TEXT_PRIMARY,
            marginTop: '18px',
          }}
        >
          {currency(results.totalSavings)}
        </p>
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '15px',
            color: TEXT_PRIMARY,
            opacity: 0.72,
            marginTop: '14px',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          If BANDZ brings your average treatment down to {TARGET_TREATMENT_MONTHS} months, you eliminate{' '}
          {results.extraAppointmentsPerPatient.toFixed(1)} extra appointments per patient at ${APPOINTMENT_COST} each.
        </p>
      </div>

      {/* Breakdown grid */}
      <div
        style={{
          display: 'grid',
          gap: '14px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <StatCell label="Months trimmed" value={`${results.extraMonths}`} />
        <StatCell
          label="Fewer appts / patient"
          value={results.extraAppointmentsPerPatient.toFixed(1)}
        />
        <StatCell label="Saved per patient" value={currency(results.lostRevenuePerPatient)} />
        <StatCell
          label="BANDZ tier"
          value={`$${results.bandzTier}/mo`}
          subtle={numPatients >= 600 ? '600+ patients' : 'Under 600 patients'}
        />
      </div>

      {/* Net after cost */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
          flexWrap: 'wrap',
          gap: '12px',
          textAlign: 'left',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: APPLE_FONT,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TEXT_MUTED,
              margin: 0,
            }}
          >
            Net savings after BANDZ ({currency(results.bandzAnnualCost)}/yr)
          </p>
          <p
            style={{
              fontFamily: APPLE_FONT,
              fontWeight: 600,
              fontSize: '36px',
              lineHeight: 1.1,
              letterSpacing: '-0.005em',
              color: results.netAnnualSavings >= 0 ? ACCENT : '#ff6b6b',
              marginTop: '8px',
            }}
          >
            {currency(results.netAnnualSavings)}
          </p>
        </div>
        {results.roi > 0 && (
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontFamily: APPLE_FONT,
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: TEXT_MUTED,
                margin: 0,
              }}
            >
              Return on BANDZ
            </p>
            <p
              style={{
                fontFamily: APPLE_FONT,
                fontWeight: 600,
                fontSize: '36px',
                lineHeight: 1.1,
                letterSpacing: '-0.005em',
                color: TEXT_PRIMARY,
                marginTop: '8px',
              }}
            >
              {results.roi.toFixed(1)}×
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CalcInput({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <span
        style={{
          fontFamily: APPLE_FONT,
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
        }}
      >
        {label}
      </span>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isNaN(n)) return;
            onChange(Math.max(min, Math.min(max, n)));
          }}
          style={{
            fontFamily: APPLE_FONT,
            width: '100%',
            height: '64px',
            padding: '0 96px 0 24px',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '-0.012em',
            color: TEXT_PRIMARY,
            background: '#161617',
            border: focused
              ? `1px solid ${ACCENT}`
              : '1px solid rgba(255,255,255,0.10)',
            borderRadius: '18px',
            outline: 'none',
            transition: 'border-color 120ms ease',
            boxSizing: 'border-box',
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: '24px',
            fontFamily: APPLE_FONT,
            fontSize: '13px',
            fontWeight: 500,
            color: TEXT_MUTED,
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      </div>
    </label>
  );
}

function StatCell({ label, value, subtle }: { label: string; value: string; subtle?: string }) {
  return (
    <div
      style={{
        padding: '20px 22px',
        borderRadius: '16px',
        background: '#0b0b0d',
        border: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'left',
      }}
    >
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
        {label}
      </p>
      <p
        style={{
          fontFamily: APPLE_FONT,
          fontWeight: 600,
          fontSize: '26px',
          lineHeight: 1.1,
          letterSpacing: '-0.005em',
          color: TEXT_PRIMARY,
          marginTop: '10px',
        }}
      >
        {value}
      </p>
      {subtle && (
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '12px',
            color: TEXT_MUTED,
            marginTop: '6px',
          }}
        >
          {subtle}
        </p>
      )}
    </div>
  );
}

function PillButton({
  children,
  primary,
  onClick,
  fullWidth,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const base: React.CSSProperties = {
    fontFamily: APPLE_FONT,
    fontSize: '17px',
    fontWeight: 500,
    lineHeight: 1,
    padding: '14px 26px',
    minWidth: fullWidth ? undefined : '120px',
    width: fullWidth ? '100%' : undefined,
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

function Footer() {
  return (
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
  );
}
