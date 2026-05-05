import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchAPI } from '../api/config';

interface QueueItem {
  submissionId: number;
  promptId: number;
  photoUrl: string | null;
  submittedAt: string;
  isOnTime: boolean;
  date: string;
  slot: number;
  slotName: string;
  patientId: number;
  patientName: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchAPI<QueueItem[]>('/api/review/queue')
      .then(setQueue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleReview(submissionId: number, promptId: number, bandPresent: boolean) {
    setReviewing(prev => new Set([...prev, submissionId]));
    try {
      await fetchAPI('/api/review', {
        method: 'POST',
        body: JSON.stringify({ dailyPromptId: promptId, bandPresent }),
      });
      setQueue(prev => prev.filter(s => s.submissionId !== submissionId));
    } catch (err) {
      console.error(err);
    } finally {
      setReviewing(prev => { const next = new Set(prev); next.delete(submissionId); return next; });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">Loading…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Review Queue</h1>
        <p className="text-white/60 mt-1">
          {queue.length} photo{queue.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="bg-bg-secondary rounded-2xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-primary mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">All caught up!</h2>
          <p className="text-white/60">No photos awaiting review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map(item => (
            <div key={item.submissionId} className="bg-bg-secondary rounded-2xl overflow-hidden">
              {/* Photo */}
              <div className="aspect-[4/3] bg-bg-tertiary flex items-center justify-center overflow-hidden">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt="Snap" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/30 text-sm">No photo</span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{item.patientName}</h3>
                    <p className="text-white/60 text-sm">{item.slotName} · {formatDate(item.date)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isOnTime ? 'bg-green-primary/20 text-green-primary' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.isOnTime ? 'On-time' : 'Late'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock size={14} />
                  <span>Received {formatTime(item.submittedAt)}</span>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-3">Rubber band present?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(item.submissionId, item.promptId, true)}
                      disabled={reviewing.has(item.submissionId)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-primary/20 text-green-primary hover:bg-green-primary/30 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      <span className="font-medium">Yes</span>
                    </button>
                    <button
                      onClick={() => handleReview(item.submissionId, item.promptId, false)}
                      disabled={reviewing.has(item.submissionId)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      <span className="font-medium">No</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/app/patients/${item.patientId}/review?date=${item.date}`)}
                  className="w-full text-center text-white/50 hover:text-white text-sm transition-colors py-1"
                >
                  View full review →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
