import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Save, Shuffle } from 'lucide-react';
import { fetchAPI } from '../api/config';
import { useToast } from '../components/Toast';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const ACCENT_HOVER = '#22c55e';
const TEAL = '#5eead4';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = '#0b0b0d';
const SUBTLE_BG = 'rgba(255,255,255,0.04)';

interface SlotRow {
  date: string;
  slot: number;
  notification_time: string;
}

interface SlotStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}

const SLOT_STYLES: SlotStyle[] = [
  {
    label: 'Morning',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.24)',
    text: ACCENT,
    dot: '#a7f3d0',
  },
  {
    label: 'Afternoon',
    bg: 'rgba(94,234,212,0.08)',
    border: 'rgba(94,234,212,0.24)',
    text: TEAL,
    dot: TEAL,
  },
  {
    label: 'Evening',
    bg: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.18)',
    text: ACCENT,
    dot: ACCENT_HOVER,
  },
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function to12h(time: string) {
  if (!time) return '—';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function to24h(input: string): string | null {
  const match = input.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const suffix = match[3]?.toUpperCase();
  if (suffix === 'PM' && h !== 12) h += 12;
  if (suffix === 'AM' && h === 12) h = 0;
  if (h > 23 || m > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekDates(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

// API returns date as ISO "2026-07-06T00:00:00.000Z"; strip to "2026-07-06".
function normalizeDate(d: string): string {
  return d.split('T')[0];
}

// Edit-state key. Uses `|` so the YYYY-MM-DD date is safe to split back out.
const editKey = (date: string, slot: number) => `${date}|${slot}`;
const parseEditKey = (key: string) => {
  const idx = key.lastIndexOf('|');
  return { date: key.slice(0, idx), slot: parseInt(key.slice(idx + 1), 10) };
};

export default function Schedule() {
  const { toast } = useToast();
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [rows, setRows] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const dates = weekDates(weekStart);
  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI<SlotRow[]>(`/api/schedule?weekStart=${dates[0]}`);
      setRows(data.map((r) => ({ ...r, date: normalizeDate(r.date) })));
    } catch {
      toast('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [dates[0]]);

  useEffect(() => {
    load();
  }, [load]);

  function getTime(date: string, slot: number): string {
    const key = editKey(date, slot);
    if (edits[key] !== undefined) return edits[key];
    return rows.find((r) => r.date === date && r.slot === slot)?.notification_time ?? '';
  }

  async function handleSave() {
    const updates = Object.entries(edits);
    if (updates.length === 0) {
      setEditMode(false);
      return;
    }

    let errors = 0;
    for (const [key, rawTime] of updates) {
      const { date, slot } = parseEditKey(key);
      const time = to24h(rawTime);
      if (!time) {
        errors++;
        continue;
      }
      try {
        await fetchAPI('/api/schedule/slot', {
          method: 'PUT',
          body: JSON.stringify({ date, slot, time }),
        });
      } catch {
        errors++;
      }
    }

    if (errors) toast(`${errors} slot(s) failed to save — use HH:MM AM/PM format`);
    else toast('Schedule saved — patients will be notified at these times');

    setEdits({});
    setEditMode(false);
    load();
  }

  async function handleRandomize() {
    try {
      const data = await fetchAPI<SlotRow[]>('/api/schedule/randomize', {
        method: 'POST',
        body: JSON.stringify({ weekStart: dates[0] }),
      });
      setRows(data.map((r) => ({ ...r, date: normalizeDate(r.date) })));
      setEdits({});
      toast('Schedule randomized');
    } catch {
      toast('Failed to randomize');
    }
  }

  const formatWeekRange = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(weekStart)} – ${fmt(end)}, ${end.getFullYear()}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontFamily: APPLE_FONT,
      }}
    >
      {/* Week nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavArrow
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() - 7);
              setWeekStart(d);
              setEdits({});
            }}
          >
            <ChevronLeft size={18} />
          </NavArrow>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 600,
              color: TEXT_PRIMARY,
              minWidth: '240px',
              textAlign: 'center',
              letterSpacing: '-0.012em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatWeekRange()}
          </span>
          <NavArrow
            onClick={() => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() + 7);
              setWeekStart(d);
              setEdits({});
            }}
          >
            <ChevronRight size={18} />
          </NavArrow>
        </div>

        {editMode && (
          <p
            style={{
              fontSize: '13px',
              color: ACCENT,
              fontWeight: 500,
              letterSpacing: '-0.005em',
            }}
          >
            Edit times — use format like "8:30 AM"
          </p>
        )}
      </div>

      {/* Schedule card */}
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: '22px',
          padding: '32px',
          minHeight: '60vh',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '320px',
              color: TEXT_MUTED,
              fontSize: '14px',
            }}
          >
            Loading…
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: '12px',
                marginBottom: '36px',
              }}
            >
              {dates.map((date, i) => {
                const isToday = date === today;
                return (
                  <div
                    key={date}
                    style={{
                      textAlign: 'center',
                      padding: '12px 4px',
                      borderRadius: '16px',
                      background: isToday ? 'rgba(74,222,128,0.06)' : 'transparent',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: isToday ? ACCENT : TEXT_MUTED,
                        margin: 0,
                      }}
                    >
                      {DAY_LABELS[i]}
                    </p>
                    <p
                      style={{
                        fontFamily: APPLE_FONT,
                        fontSize: '40px',
                        fontWeight: 500,
                        color: isToday ? ACCENT : TEXT_PRIMARY,
                        marginTop: '10px',
                        letterSpacing: '-0.012em',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {new Date(date + 'T12:00:00').getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Slot rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[1, 2, 3].map((slot, rowIndex) => {
                const style = SLOT_STYLES[rowIndex];
                return (
                  <div key={slot}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '999px',
                          background: style.dot,
                        }}
                      />
                      <p
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: TEXT_MUTED,
                          margin: 0,
                        }}
                      >
                        {style.label}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {dates.map((date) => {
                        const key = editKey(date, slot);
                        const time = getTime(date, slot);
                        return (
                          <SlotTile
                            key={key}
                            style={style}
                            editMode={editMode}
                            value={editMode ? edits[key] ?? to12h(time) : to12h(time)}
                            onChange={(v) => setEdits((prev) => ({ ...prev, [key]: v }))}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {!editMode && (
          <PillButton onClick={handleRandomize}>
            <Shuffle size={15} />
            Randomize
          </PillButton>
        )}
        <PillButton primary onClick={editMode ? handleSave : () => setEditMode(true)}>
          {editMode ? (
            <>
              <Save size={15} />
              Save
            </>
          ) : (
            <>
              <Pencil size={15} />
              Edit
            </>
          )}
        </PillButton>
      </div>
    </div>
  );
}

function NavArrow({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: SUBTLE_BG,
        border: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: TEXT_PRIMARY,
        cursor: 'pointer',
        transition: 'background 120ms ease',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = SUBTLE_BG;
      }}
    >
      {children}
    </button>
  );
}

function SlotTile({
  style,
  editMode,
  value,
  onChange,
}: {
  style: SlotStyle;
  editMode: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        background: editMode ? SUBTLE_BG : style.bg,
        border: `1px solid ${editMode ? 'rgba(74,222,128,0.32)' : style.border}`,
        borderRadius: '16px',
        padding: '18px 12px',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      {editMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="8:30 AM"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: TEXT_PRIMARY,
            fontFamily: APPLE_FONT,
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: '-0.012em',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      ) : (
        <p
          style={{
            fontFamily: APPLE_FONT,
            fontWeight: 600,
            fontSize: '14px',
            textAlign: 'center',
            color: style.text,
            letterSpacing: '-0.012em',
            fontVariantNumeric: 'tabular-nums',
            margin: 0,
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function PillButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: APPLE_FONT,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1,
    padding: '12px 22px',
    borderRadius: '980px',
    cursor: 'pointer',
    transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
    letterSpacing: '-0.022em',
  };
  if (primary) {
    return (
      <button
        onClick={onClick}
        style={{
          ...base,
          background: ACCENT,
          color: '#000',
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
        e.currentTarget.style.color = '#000';
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
