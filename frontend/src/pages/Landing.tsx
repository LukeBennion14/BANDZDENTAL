import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-12 h-[72px] border-b border-border">
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="h-9 w-auto object-contain mix-blend-screen"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="h-10 px-6 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="h-10 px-7 text-sm font-bold bg-green-primary text-black hover:bg-green-secondary transition-colors"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-36">
        <span className="text-[11px] font-bold tracking-[0.25em] text-green-primary uppercase mb-8 block">
          Orthodontic Compliance Platform
        </span>
        <h1 className="text-7xl font-light tracking-tight leading-[1.05] mb-7 max-w-3xl">
          Keep patients<br />
          <span className="text-green-primary">on track.</span>
        </h1>
        <p className="text-text-secondary text-xl leading-relaxed mb-12 max-w-lg">
          Daily photo submissions, wear-time tracking, and at-a-glance progress reviews — all in one place.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="h-14 px-10 text-base font-bold bg-green-primary text-black hover:bg-green-secondary transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="h-14 px-10 text-base border border-border text-text-secondary hover:border-green-primary/40 hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border px-12 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-secondary border border-border p-10">
            <div className="w-8 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Photo Submissions</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Patients submit daily photos through the BANDZ mobile app so your team can verify compliance without extra appointments.
            </p>
          </div>
          <div className="bg-bg-secondary border border-border p-10">
            <div className="w-8 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Review Queue</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Pending submissions surface in a focused queue so your staff can approve or flag photos quickly and confidently.
            </p>
          </div>
          <div className="bg-bg-secondary border border-border p-10">
            <div className="w-8 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Compliance Insights</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Track wear-time trends across your entire patient base and identify who needs a follow-up before their next visit.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-12 py-8 flex items-center justify-between text-text-muted text-sm">
        <span>© {new Date().getFullYear()} BANDZ Dental</span>
        <span>bandzdental.com</span>
      </footer>

    </div>
  );
}
