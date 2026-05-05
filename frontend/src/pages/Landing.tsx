import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-border">
        <img src="/BANDZLOGO.jpg" alt="BANDZ" className="h-11 w-auto object-contain mix-blend-screen" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="px-6 py-3 text-[15px] font-bold bg-green-primary text-black hover:bg-green-secondary transition-colors"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-green-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
          Orthodontic Compliance Tracking
        </p>
        <h1 className="text-6xl font-light tracking-tight leading-[1.1] mb-8 max-w-2xl">
          Keep patients on track.<br />
          <span className="text-green-primary">Every single day.</span>
        </h1>
        <p className="text-text-secondary text-xl leading-relaxed mb-12 max-w-lg">
          BANDZ gives orthodontic practices a simple way to monitor patient compliance between appointments —
          photo submissions, wear-time tracking, and at-a-glance progress reviews, all in one place.
        </p>
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="px-10 py-4 text-[15px] font-bold bg-green-primary text-black hover:bg-green-secondary transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 text-[15px] font-medium border border-border text-text-secondary hover:border-green-primary/50 hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="px-14 py-16">
            <div className="w-10 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Photo Submissions</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Patients submit daily photos through the BANDZ mobile app so your team can verify compliance without extra appointments.
            </p>
          </div>
          <div className="px-14 py-16">
            <div className="w-10 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Review Queue</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Pending submissions surface in a focused queue so your staff can approve or flag photos quickly and confidently.
            </p>
          </div>
          <div className="px-14 py-16">
            <div className="w-10 h-[2px] bg-green-primary mb-8" />
            <h3 className="text-lg font-semibold mb-4">Compliance Insights</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              Track wear-time trends across your entire patient base and identify who needs a follow-up before their next visit.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-10 py-7 flex items-center justify-between text-text-muted text-sm">
        <span>© {new Date().getFullYear()} BANDZ Dental</span>
        <span>bandzdental.com</span>
      </footer>
    </div>
  );
}
