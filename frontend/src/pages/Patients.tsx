import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Users } from 'lucide-react';
import { patientsAPI } from '../api/services';
import type { Patient } from '../api/services';

type SortField = 'name' | 'treatmentDays' | 'status';
type SortDir = 'asc' | 'desc';

function treatmentDays(patient: Patient): number {
  const start = patient.created_at ? new Date(patient.created_at) : new Date();
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Patients() {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    patientsAPI.getAll()
      .then(setPatientList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const activeFilterCount = filterStatus.length;

  const filtered = patientList
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => filterStatus.length === 0 || filterStatus.includes(p.status));

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        if (sortField === 'name') {
          return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortField === 'treatmentDays') {
          const diff = treatmentDays(a) - treatmentDays(b);
          return sortDir === 'asc' ? diff : -diff;
        }
        if (sortField === 'status') {
          return sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        }
        return 0;
      })
    : filtered;

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className={`text-xs ${sortField === field ? 'text-green-primary' : 'text-text-muted opacity-40'}`}>
      {sortField === field && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4" style={{ paddingTop: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-11 bg-bg-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 w-64 transition-all px-4"
          />

          <div className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${
                activeFilterCount > 0
                  ? 'bg-green-primary/10 border-green-primary/40 text-green-primary'
                  : 'bg-bg-secondary border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-green-primary text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilter && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowFilter(false)} />
                <div className="absolute left-0 top-full mt-2 z-40 w-48 bg-bg-secondary border border-border rounded-2xl shadow-2xl p-5">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Status</p>
                  <div className="flex flex-col gap-2">
                    {['active', 'paused'].map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterStatus.includes(s)}
                          onChange={() => setFilterStatus(prev =>
                            prev.includes(s) ? prev.filter(v => v !== s) : [...prev, s]
                          )}
                          className="w-4 h-4 rounded accent-green-primary"
                        />
                        <span className="text-sm text-text-secondary capitalize">{s}</span>
                      </label>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilterStatus([])}
                      className="w-full text-sm text-text-muted hover:text-red-400 transition-colors text-center py-2 border-t border-border mt-4 pt-4"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-text-muted">
          {patientList.length} patient{patientList.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-text-muted">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="text-left py-5 px-8 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">Name <SortIcon field="name" /></div>
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Email
                </th>
                <th
                  className="text-left py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center gap-1.5">Status <SortIcon field="status" /></div>
                </th>
                <th
                  className="text-right py-5 px-8 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                  onClick={() => toggleSort('treatmentDays')}
                >
                  <div className="flex items-center justify-end gap-1.5">Days <SortIcon field="treatmentDays" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-muted">
                      <Users size={36} className="opacity-30" />
                      <p className="font-medium text-text-secondary">No patients found</p>
                      <p className="text-sm">Patients join by signing up in the app with your practice code</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map(patient => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`/app/patients/${patient.id}`)}
                    className="border-b border-border hover:bg-bg-tertiary/30 transition-colors cursor-pointer"
                  >
                    {/* Name */}
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-green-primary/20 border border-green-primary/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-primary font-semibold text-sm">{initials(patient.name)}</span>
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">{patient.name}</p>
                          {patient.phone && (
                            <p className="text-xs text-text-muted">{patient.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-5 px-6 text-text-secondary text-sm">{patient.email ?? '—'}</td>

                    {/* Status */}
                    <td className="py-5 px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        patient.status === 'active'
                          ? 'bg-green-primary/15 text-green-primary'
                          : 'bg-yellow-400/15 text-yellow-400'
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Days */}
                    <td className="py-5 px-8 text-right text-text-secondary text-sm">
                      {treatmentDays(patient)}d
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
