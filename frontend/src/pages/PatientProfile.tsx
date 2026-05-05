import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { fetchAPI } from '../api/config';
import { getSession } from '../auth';
import { useToast } from '../components/Toast';

interface PatientDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'paused';
  dob: string | null;
  created_at: string;
  tags: string[];
  metrics: {
    last7Days: { compliancePct: number; onTimePct: number };
    last30Days: { compliancePct: number; onTimePct: number; missing: number };
  };
}

function treatmentDays(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000));
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = getSession();

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'active' | 'paused'>('active');
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    fetchAPI<PatientDetail>(`/api/patients/${patientId}`)
      .then(p => {
        setPatient(p);
        setStatus(p.status);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [patientId]);

  async function toggleStatus() {
    if (!patient) return;
    const next = status === 'active' ? 'paused' : 'active';
    setSavingStatus(true);
    try {
      await fetchAPI(`/api/patients/${patientId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      setStatus(next);
      toast(`Patient ${next === 'active' ? 'activated' : 'paused'}`);
    } catch {
      toast('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted">Loading…</div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-secondary text-lg">Patient not found.</p>
        <Link to="/app/patients" className="text-green-primary hover:underline">← Back to Patients</Link>
      </div>
    );
  }

  const m7 = patient.metrics?.last7Days ?? { compliancePct: 0, onTimePct: 0 };
  const m30 = patient.metrics?.last30Days ?? { compliancePct: 0, onTimePct: 0, missing: 0 };
  const overall = m30.compliancePct;

  return (
    <div className="flex flex-col gap-8 h-full">
      <Link to="/app/patients" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit">
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Patients</span>
      </Link>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="card text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-green-primary/20 border-4 border-border mb-6 flex items-center justify-center">
              <span className="text-green-primary text-3xl font-bold">{initials(patient.name)}</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-text-primary">{patient.name}</h2>
            <p className="text-text-secondary mt-1 text-sm">{session?.practiceName ?? '—'}</p>
            <div className="mt-6">
              <button
                onClick={toggleStatus}
                disabled={savingStatus}
                className={`font-semibold transition-all text-lg disabled:opacity-50 ${
                  status === 'active' ? 'text-green-primary' : 'text-yellow-500'
                }`}
              >
                {status === 'active' ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>

          {/* Patient Details */}
          <div className="card">
            <h3 className="font-display text-xl font-semibold mb-5">Patient Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Email</span>
                <span className="text-text-primary font-medium text-sm">{patient.email || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Phone</span>
                <span className="text-text-primary font-medium text-sm">{patient.phone || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Date of Birth</span>
                <span className="text-text-primary font-medium text-sm">{formatDate(patient.dob)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Joined</span>
                <span className="text-text-primary font-medium text-sm">{formatDate(patient.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Treatment Days</span>
                <span className="text-text-primary font-medium text-sm">{treatmentDays(patient.created_at)}d</span>
              </div>
              {patient.tags?.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-text-secondary text-sm">Tags</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {patient.tags.map(tag => (
                      <span key={tag} className="text-sm text-green-primary font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/app/patients/${patientId}/review`)}
            className="btn-primary flex items-center justify-center gap-3"
          >
            <Camera size={20} />
            Review Photos
          </button>
        </div>

        {/* Right Column */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Notes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Orthodontist Notes</h3>
              <button
                onClick={() => { setSavedNotes(notes); toast('Notes saved'); }}
                disabled={notes === savedNotes}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-green-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Save size={15} />
                Save
              </button>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Quick notes about this patient..."
              rows={4}
              className="w-full bg-bg-tertiary border border-border rounded-xl p-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 resize-none text-sm"
            />
          </div>

          {/* Performance Summary */}
          <div className="card">
            <h3 className="font-display text-xl font-semibold mb-6">Performance Summary</h3>
            <div className="grid grid-cols-4 gap-5">
              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Last 7 Days</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className="text-3xl font-bold text-green-primary">{m7.compliancePct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs mb-1">On-time</p>
                    <p className="text-3xl font-bold text-text-primary">{m7.onTimePct}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Last 30 Days</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className="text-3xl font-bold text-green-primary">{m30.compliancePct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs mb-1">On-time</p>
                    <p className="text-3xl font-bold text-text-primary">{m30.onTimePct}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Overall</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className={`text-3xl font-bold ${overall >= 80 ? 'text-green-primary' : overall >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {overall}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Missing (30d)</h4>
                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                  <p className="text-5xl font-bold text-red-400">{m30.missing ?? 0}</p>
                  <p className="text-text-muted text-xs mt-2">submissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Overall Compliance</h3>
              <span className={`text-2xl font-bold ${overall >= 80 ? 'text-green-primary' : overall >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {overall}%
              </span>
            </div>
            <div className="flex-1 bg-bg-tertiary rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-primary to-green-secondary rounded-full transition-all"
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
