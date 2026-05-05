import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">

      {/* ── Nav ── */}
      <nav className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <img src="/BANDZLOGO.jpg" alt="BANDZ" className="h-9 w-auto object-contain mix-blend-screen" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="h-9 px-5 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login?tab=signup')}
              className="h-9 px-5 text-sm font-semibold bg-green-primary text-black transition-colors hover:bg-green-secondary"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="px-6 py-24 sm:py-32"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(74,222,128,0.10), transparent)' }}
      >
        <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-12 lg:items-center">

          {/* Left — headline */}
          <div className="lg:col-span-7">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-primary/30 bg-green-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-green-primary">
              Orthodontic Compliance Platform
            </span>
            <h1 className="text-5xl font-light leading-[1.08] tracking-tight sm:text-6xl">
              Patient compliance.<br />
              <span className="text-green-primary">Finally visible.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
              Stop guessing between appointments. BANDZ gives your team a live view of who's wearing their aligners — and who isn't.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/login?tab=signup')}
                className="h-12 px-8 text-sm font-bold bg-green-primary text-black transition-colors hover:bg-green-secondary"
              >
                Create Practice Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="h-12 border border-border px-8 text-sm font-medium text-text-secondary transition-colors hover:border-green-primary/40 hover:text-text-primary"
              >
                Sign In
              </button>
            </div>
            <p className="mt-4 text-xs text-text-muted">Free to start · No credit card required</p>
          </div>

          {/* Right — How it works card */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-bg-secondary p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">How it works</p>
              <div className="mt-6 space-y-6">
                {[
                  { n: '1', title: 'Patient submits', body: 'A daily photo prompt goes out. Patients respond from their phone in under 30 seconds.' },
                  { n: '2', title: 'Your team reviews', body: 'Submissions land in one focused queue. Approve or flag — no digging through charts.' },
                  { n: '3', title: 'Spot risk early', body: 'The dashboard surfaces adherence trends so you can intervene before the next visit.' },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-primary text-[11px] font-bold text-black">{n}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-y border-border bg-bg-secondary/50 px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Built for clinical speed</p>
          <h2 className="mt-3 text-3xl font-light tracking-tight">Everything your team needs. Nothing it doesn't.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Photo Submissions', body: 'Standardized daily uploads replace vague patient self-reports with actual evidence.' },
              { title: 'Review Queue', body: 'One inbox for all pending photos. Your staff approves or flags in a single pass.' },
              { title: 'Compliance Dashboard', body: 'Per-patient and practice-wide adherence trends updated daily, not monthly.' },
              { title: 'Smart Scheduling', body: 'See which patients need outreach before their appointment, not after.' },
              { title: 'Patient Profiles', body: 'Full submission history, notes, and trend data in one place per patient.' },
              { title: 'Instant Notifications', body: 'Alerts when patients go quiet so nothing falls through the cracks.' },
            ].map(({ title, body }) => (
              <article key={title} className="border border-border bg-bg-secondary p-6">
                <div className="mb-4 h-[2px] w-8 bg-green-primary" />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 py-28 text-center">
        <h2 className="text-4xl font-light tracking-tight">
          Ready to see who's actually<br />
          <span className="text-green-primary">wearing their aligners?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-base text-text-secondary">
          Set up your practice in minutes. Your team will wonder how you managed without it.
        </p>
        <button
          onClick={() => navigate('/login?tab=signup')}
          className="mt-10 h-12 px-10 text-sm font-bold bg-green-primary text-black transition-colors hover:bg-green-secondary"
        >
          Create Practice Account
        </button>
        <p className="mt-4 text-xs text-text-muted">Free to start · No credit card required</p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-sm text-text-muted">
          <span>© {new Date().getFullYear()} BANDZ Dental</span>
          <span>bandzdental.com</span>
        </div>
      </footer>

    </div>
  );
}
