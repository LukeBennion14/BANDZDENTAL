import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { patientsAPI } from '../api/services';
import type { Patient } from '../api/services';

type SortField = 'name' | 'treatmentDays' | 'status';
type SortDir = 'asc' | 'desc';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = '#0b0b0d';
const ROW_HOVER = 'rgba(255,255,255,0.03)';

function treatmentDays(patient: Patient): number {
  const start = patient.created_at ? new Date(patient.created_at) : new Date();
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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
    patientsAPI
      .getAll()
      .then(setPatientList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const activeFilterCount = filterStatus.length;

  const filtered = patientList
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => filterStatus.length === 0 || filterStatus.includes(p.status));

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
          return sortDir === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      })
    : filtered;

  const HEADER_CELL: React.CSSProperties = {
    textAlign: 'left',
    padding: '20px 32px',
    fontFamily: APPLE_FONT,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: TEXT_MUTED,
    userSelect: 'none',
    borderBottom: `1px solid ${BORDER}`,
  };

  const SortIndicator = ({ field }: { field: SortField }) => (
    <span
      style={{
        marginLeft: '8px',
        fontSize: '11px',
        color: sortField === field ? ACCENT : 'rgba(245,245,247,0.25)',
      }}
    >
      {sortField === field && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: APPLE_FONT }}>
      {/* ── Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '44px',
              padding: '0 16px',
              width: '320px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BORDER}`,
            }}
          >
            <Search size={16} style={{ color: 'rgba(245,245,247,0.5)' }} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: TEXT_PRIMARY,
                fontSize: '14px',
                width: '100%',
                fontFamily: APPLE_FONT,
                letterSpacing: '-0.012em',
              }}
            />
          </div>

          {/* Filter */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilter((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '44px',
                padding: '0 18px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: APPLE_FONT,
                letterSpacing: '-0.012em',
                cursor: 'pointer',
                transition: 'background-color 120ms ease, color 120ms ease',
                background:
                  activeFilterCount > 0 ? 'rgba(74,222,128,0.10)' : 'rgba(255,255,255,0.04)',
                color: activeFilterCount > 0 ? ACCENT : 'rgba(245,245,247,0.72)',
                border: `1px solid ${activeFilterCount > 0 ? 'rgba(74,222,128,0.32)' : BORDER}`,
              }}
            >
              <SlidersHorizontal size={15} />
              Filter
              {activeFilterCount > 0 && (
                <span
                  style={{
                    background: ACCENT,
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 6px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilter && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 30 }}
                  onClick={() => setShowFilter(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 'calc(100% + 8px)',
                    zIndex: 40,
                    width: '220px',
                    background: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '18px',
                    padding: '20px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: TEXT_MUTED,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      marginBottom: '14px',
                    }}
                  >
                    Status
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['active', 'paused'].map((s) => (
                      <label
                        key={s}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: TEXT_PRIMARY,
                          textTransform: 'capitalize',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filterStatus.includes(s)}
                          onChange={() =>
                            setFilterStatus((prev) =>
                              prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]
                            )
                          }
                          style={{ width: '16px', height: '16px', accentColor: ACCENT }}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilterStatus([])}
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        paddingTop: '14px',
                        borderTop: `1px solid ${BORDER}`,
                        fontSize: '13px',
                        color: TEXT_MUTED,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: APPLE_FONT,
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ fontSize: '14px', color: TEXT_MUTED, letterSpacing: '-0.012em' }}>
          {patientList.length} patient{patientList.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Table card ── */}
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: '22px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              color: TEXT_MUTED,
              fontSize: '14px',
            }}
          >
            Loading…
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{ ...HEADER_CELL, cursor: 'pointer' }}
                  onClick={() => toggleSort('name')}
                >
                  Name
                  <SortIndicator field="name" />
                </th>
                <th style={HEADER_CELL}>Email</th>
                <th
                  style={{ ...HEADER_CELL, cursor: 'pointer' }}
                  onClick={() => toggleSort('status')}
                >
                  Status
                  <SortIndicator field="status" />
                </th>
                <th
                  style={{ ...HEADER_CELL, textAlign: 'right', cursor: 'pointer' }}
                  onClick={() => toggleSort('treatmentDays')}
                >
                  Days
                  <SortIndicator field="treatmentDays" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '96px 0' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '14px',
                        color: TEXT_MUTED,
                      }}
                    >
                      <Users size={40} style={{ opacity: 0.3 }} />
                      <p
                        style={{
                          fontSize: '17px',
                          fontWeight: 600,
                          color: TEXT_PRIMARY,
                          letterSpacing: '-0.012em',
                          margin: 0,
                        }}
                      >
                        No patients found
                      </p>
                      <p style={{ fontSize: '14px', margin: 0, maxWidth: '380px', textAlign: 'center' }}>
                        Patients join by signing up in the app with your practice code.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`/app/patients/${patient.id}`)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: idx < sorted.length - 1 ? `1px solid ${BORDER}` : 'none',
                      transition: 'background-color 120ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = ROW_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '22px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '999px',
                            background: 'rgba(74,222,128,0.14)',
                            border: '1px solid rgba(74,222,128,0.28)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              color: ACCENT,
                              fontSize: '13px',
                              fontWeight: 600,
                              letterSpacing: '-0.012em',
                            }}
                          >
                            {initials(patient.name)}
                          </span>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              color: TEXT_PRIMARY,
                              margin: 0,
                              letterSpacing: '-0.012em',
                            }}
                          >
                            {patient.name}
                          </p>
                          {patient.phone && (
                            <p
                              style={{
                                fontSize: '12px',
                                color: TEXT_MUTED,
                                marginTop: '4px',
                              }}
                            >
                              {patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td
                      style={{
                        padding: '22px 32px',
                        fontSize: '14px',
                        color: 'rgba(245,245,247,0.72)',
                        letterSpacing: '-0.012em',
                      }}
                    >
                      {patient.email ?? '—'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '22px 32px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '5px 12px',
                          borderRadius: '999px',
                          textTransform: 'capitalize',
                          letterSpacing: '-0.005em',
                          background:
                            patient.status === 'active'
                              ? 'rgba(74,222,128,0.14)'
                              : 'rgba(250,204,21,0.14)',
                          color: patient.status === 'active' ? ACCENT : '#facc15',
                          border: `1px solid ${
                            patient.status === 'active'
                              ? 'rgba(74,222,128,0.28)'
                              : 'rgba(250,204,21,0.28)'
                          }`,
                        }}
                      >
                        {patient.status}
                      </span>
                    </td>

                    {/* Days */}
                    <td
                      style={{
                        padding: '22px 32px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'rgba(245,245,247,0.72)',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.012em',
                      }}
                    >
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
