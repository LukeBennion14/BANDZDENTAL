import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <img src="/BANDZLOGO.jpg" alt="BANDZ" className="h-10 w-auto object-contain mix-blend-screen" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="px-5 py-2 text-sm font-semibold bg-green-primary text-black rounded-none hover:bg-green-secondary transition-colors"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto">
        <p className="text-green-primary text-sm font-semibold tracking-widest uppercase mb-6">
          Orthodontic Compliance Tracking
        </p>
        <h1 className="text-5xl font-light tracking-tight mb-6 leading-tight">
          Keep patients on track.<br />
          <span className="text-green-primary">Every single day.</span>
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl">
          BANDZ gives orthodontic practices a simple way to monitor patient compliance between appointments —
          photo submissions, wear-time tracking, and at-a-glance progress reviews, all in one place.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login?tab=signup')}
            className="px-8 py-3.5 bg-green-primary text-black font-semibold text-sm hover:bg-green-secondary transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 border border-border text-text-secondary text-sm hover:border-green-primary/50 hover:text-text-primary transition-colors"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="px-10 py-12">
            <div className="w-8 h-0.5 bg-green-primary mb-6" />
            <h3 className="text-base font-semibold mb-3">Photo Submissions</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Patients submit daily photos through the BANDZ mobile app so your team can verify compliance without extra appointments.
            </p>
          </div>
          <div className="px-10 py-12">
            <div className="w-8 h-0.5 bg-green-primary mb-6" />
            <h3 className="text-base font-semibold mb-3">Review Queue</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Pending submissions surface in a focused queue so your staff can approve or flag photos quickly and confidently.
            </p>
          </div>
          <div className="px-10 py-12">
            <div className="w-8 h-0.5 bg-green-primary mb-6" />
            <h3 className="text-base font-semibold mb-3">Compliance Insights</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Track wear-time trends across your entire patient base and identify who needs a follow-up before their next visit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex items-center justify-between text-text-muted text-xs">
        <span>© {new Date().getFullYear()} BANDZ Dental</span>
        <span>bandzdental.com</span>
      </footer>
    </div>
  );
}
