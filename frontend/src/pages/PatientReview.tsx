import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, CheckCircle } from 'lucide-react';
import { fetchAPI } from '../api/config';
import { useToast } from '../components/Toast';

interface SlotData {
  promptId: number;
  slot: number;
  slotName: string;
  notificationTime: string | null;
  submitted: boolean;
  photoUrl: string | null;
  submittedAt: string | null;
  isOnTime: boolean;
  bandPresent: boolean | null;
  reviewed: boolean;
}

interface PatientInfo {
  id: number;
  name: string;
}

const SLOT_LABELS: Record<number, string> = { 1: 'Morning', 2: 'Afternoon', 3: 'Evening' };

export default function PatientReview() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const [reviewDate, setReviewDate] = useState(searchParams.get('date') || today);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!patientId) return;
    fetchAPI<{ id: number; name: string }>(`/api/patients/${patientId}`)
      .then(p => setPatient({ id: p.id, name: p.name }))
      .catch(console.error);
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetchAPI<SlotData[]>(`/api/patients/${patientId}/review?date=${reviewDate}`)
      .then(rows => {
        // Map backend fields to our interface
        const mapped = (rows as any[]).map(r => ({
          promptId: r.prompt_id,
          slot: r.slot,
          slotName: SLOT_LABELS[r.slot] || `Slot ${r.slot}`,
          notificationTime: r.notification_time ?? null,
          submitted: !!r.submission_id,
          photoUrl: r.photo_url ?? null,
          submittedAt: r.submitted_at ?? null,
          isOnTime: r.is_on_time ?? false,
          bandPresent: r.band_present ?? null,
          reviewed: !!r.reviewed_by,
        }));
        // Fill in any missing slots so we always show 3 cards
        const filled = [1, 2, 3].map(slot => {
          const existing = mapped.find(s => s.slot === slot);
          return existing ?? {
            promptId: 0,
            slot,
            slotName: SLOT_LABELS[slot],
            notificationTime: null,
            submitted: false,
            photoUrl: null,
            submittedAt: null,
            isOnTime: false,
            bandPresent: null,
            reviewed: false,
          };
        });
        setSlots(filled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [patientId, reviewDate]);

  async function handleBandPresent(promptId: number, slotIndex: number, value: boolean) {
    if (!promptId) return;
    setReviewing(prev => new Set([...prev, promptId]));
    try {
      await fetchAPI('/api/review', {
        method: 'POST',
        body: JSON.stringify({ dailyPromptId: promptId, bandPresent: value }),
      });
      setSlots(prev => prev.map((s, i) =>
        i === slotIndex ? { ...s, bandPresent: value, reviewed: true } : s
      ));
    } catch {
      toast('Failed to save review');
    } finally {
      setReviewing(prev => { const n = new Set(prev); n.delete(promptId); return n; });
    }
  }

  async function handleMarkAllReviewed() {
    if (!patientId) return;
    try {
      await fetchAPI('/api/review/mark-all', {
        method: 'POST',
        body: JSON.stringify({ patientId: parseInt(patientId), date: reviewDate }),
      });
      setSlots(prev => prev.map(s => ({ ...s, reviewed: s.submitted ? true : s.reviewed })));
      toast('All slots marked as reviewed');
    } catch {
      toast('Failed to mark all reviewed');
    }
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const allReviewed = slots.every(s => !s.submitted || s.reviewed);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/app/patients/${patientId}`}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{patient?.name ?? 'Patient'}</span>
        </Link>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={reviewDate}
            onChange={e => setReviewDate(e.target.value)}
            className="bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-green-primary/50"
          />
          <button onClick={handleMarkAllReviewed} className="btn-secondary text-sm">
            Mark all reviewed
          </button>
        </div>
      </div>

      {allReviewed && slots.some(s => s.submitted) && (
        <div className="flex items-center gap-3 bg-green-primary/10 border border-green-primary/30 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-primary flex-shrink-0" />
          <p className="text-green-primary font-semibold text-sm">All slots reviewed</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-3 gap-6 flex-1">
          {slots.map((slot, index) => {
            const isReviewed = slot.reviewed || slot.bandPresent !== null;
            const isProcessing = reviewing.has(slot.promptId);
            return (
              <div key={slot.slot} className={`card flex flex-col transition-all ${isReviewed ? 'border-green-primary/30' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold">{slot.slotName}</h3>
                  {isReviewed && <CheckCircle size={16} className="text-green-primary" />}
                </div>

                {/* Photo */}
                <div className="aspect-square bg-bg-tertiary rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-border">
                  {slot.submitted && slot.photoUrl ? (
                    <img src={slot.photoUrl} alt={slot.slotName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
                        <Clock size={22} className="text-text-muted" />
                      </div>
                      <p className="text-text-secondary font-medium text-sm">No Submission</p>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="mb-4">
                  {slot.submitted ? (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-xs">Received: {formatTime(slot.submittedAt)}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        slot.isOnTime ? 'bg-green-primary/15 text-green-primary' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {slot.isOnTime ? 'On-time' : 'Late'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400/60" />
                      <p className="text-text-muted text-xs">No submission for this window</p>
                    </div>
                  )}
                </div>

                {/* Review buttons */}
                <div className="mt-auto">
                  <p className="text-text-secondary text-xs mb-3 font-medium">Rubber band present?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBandPresent(slot.promptId, index, true)}
                      disabled={!slot.submitted || isProcessing}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        slot.bandPresent === true ? 'bg-green-primary text-black' : 'bg-bg-tertiary text-text-secondary border border-border hover:border-green-primary/50'
                      }`}
                    >
                      <Check size={16} /> Yes
                    </button>
                    <button
                      onClick={() => handleBandPresent(slot.promptId, index, false)}
                      disabled={!slot.submitted || isProcessing}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        slot.bandPresent === false ? 'bg-red-500 text-white' : 'bg-bg-tertiary text-text-secondary border border-border hover:border-red-500/50'
                      }`}
                    >
                      <X size={16} /> No
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
