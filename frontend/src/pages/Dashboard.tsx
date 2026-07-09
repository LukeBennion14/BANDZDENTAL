import { useState, useEffect } from 'react';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import { useToast } from '../components/Toast';
import { dashboardAPI } from '../api';
import type { DashboardStats, WeeklyStats, ActivityStats, LowParticipationPatient } from '../api';
import { getSession } from '../auth';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const ACCENT_HOVER = '#22c55e';
const RED = '#ff6b6b';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = '#0b0b0d';
const SUBTLE_BG = 'rgba(255,255,255,0.04)';

function initials(name?: string | null) {
  if (!name) return 'D';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Dashboard() {
  const { toast } = useToast();
  const session = getSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [lowParticipation, setLowParticipation] = useState<LowParticipationPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsData, weeklyData, activityData, lowPartData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getWeeklyStats(),
          dashboardAPI.getActivityStats(),
          dashboardAPI.getLowParticipation(),
        ]);
        setStats(statsData);
        setWeeklyStats(weeklyData);
        setActivityStats(activityData);
        setLowParticipation(lowPartData);
        setIsLive(true);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const barChartData = weeklyStats.map((week, index) => ({
    week: `Week ${index + 1}`,
    dateRange: week.date_range,
    morning: Number(week.morning),
    noon: Number(week.noon),
    night: Number(week.night),
    value: Number(week.morning) + Number(week.noon) + Number(week.night),
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: APPLE_FONT,
      }}
    >
      {/* Live indicator */}
      {isLive && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 500,
            color: ACCENT,
            letterSpacing: '-0.005em',
          }}
        >
          <LivePulse />
          Connected to live database
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '24px',
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* Statistic card */}
          <Card>
            <CardHeader
              title="Statistic"
              action={
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: TEXT_PRIMARY,
                    background: SUBTLE_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: '12px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontFamily: APPLE_FONT,
                    letterSpacing: '-0.012em',
                  }}
                >
                  This month
                  <ChevronDown size={14} style={{ color: TEXT_MUTED }} />
                </button>
              }
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '32px',
                alignItems: 'center',
                marginTop: '4px',
              }}
            >
              <div>
                {barChartData.length > 0 ? (
                  <BarChart data={barChartData} />
                ) : (
                  <EmptyBlock label={loading ? 'Loading…' : 'No data available'} />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DonutChart
                  activePercent={activityStats?.activePercent || 0}
                  inactivePercent={activityStats?.inactivePercent || 0}
                  size="md"
                />
              </div>
            </div>
          </Card>

          {/* Stats cards row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '20px',
            }}
          >
            <StatCard
              label="Weekly Participation"
              value={loading ? '—' : String(stats?.patientsMonitored ?? 0)}
              delta="+2.65%"
              positive
            />
            <StatCard
              label="On-Time Captures"
              value={loading ? '—' : `${stats?.onTimePct ?? 0}%`}
              delta="−0.91%"
              positive={false}
            />
            <StatCard
              label="Unreviewed Photos"
              value={loading ? '—' : String(stats?.unreviewedPhotos ?? 0)}
              delta="−0.91%"
              positive
              warn
            />
          </div>

          {/* Low participation */}
          <Card>
            <CardHeader
              title="Low Participation Patients"
              action={
                <button
                  style={iconButton}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_PRIMARY)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
                >
                  <MoreHorizontal size={18} />
                </button>
              }
            />

            <div
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginTop: '4px',
              }}
            >
              {lowParticipation.length > 0 ? (
                lowParticipation.map((patient) => (
                  <div
                    key={patient.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '76px',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          border: `1px solid ${BORDER}`,
                        }}
                      >
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          padding: '2px 6px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 700,
                          lineHeight: 1,
                          background: '#000',
                          border: `1px solid ${BORDER}`,
                          color:
                            patient.consistency < 30
                              ? RED
                              : patient.consistency < 60
                              ? '#facc15'
                              : ACCENT,
                        }}
                      >
                        {patient.consistency}%
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(245,245,247,0.7)',
                        marginTop: '12px',
                        textAlign: 'center',
                        lineHeight: 1.3,
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {patient.name}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: TEXT_MUTED, padding: '12px 0' }}>
                  {loading ? 'Loading…' : 'No low participation patients'}
                </p>
              )}
            </div>

            <button
              onClick={() =>
                toast(`Text reminders sent to ${lowParticipation.length} patients`, 'success')
              }
              style={{
                marginTop: '28px',
                width: '100%',
                padding: '14px 24px',
                borderRadius: '980px',
                fontFamily: APPLE_FONT,
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '-0.022em',
                color: '#000',
                background: ACCENT,
                border: `1px solid ${ACCENT}`,
                cursor: 'pointer',
                transition: 'background 120ms ease',
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
              Send text reminder
            </button>
          </Card>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Practice banner */}
          <div
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`,
              borderRadius: '22px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '999px',
                background: 'rgba(0,0,0,0.15)',
                border: '2px solid rgba(255,255,255,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: APPLE_FONT,
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.7)',
                  letterSpacing: '-0.012em',
                }}
              >
                {initials(session?.name)}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.55)',
                  margin: 0,
                }}
              >
                Practice
              </p>
              <h3
                style={{
                  fontFamily: APPLE_FONT,
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                  color: '#000',
                  margin: 0,
                  marginTop: '6px',
                  lineHeight: 1.15,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {session?.practiceName ?? 'Practice'}
              </h3>
            </div>
          </div>

          {/* Doctor Info */}
          <Card>
            <CardHeader
              title="Doctor Info"
              action={
                <button
                  style={iconButton}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_PRIMARY)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
                >
                  <MoreHorizontal size={18} />
                </button>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <InfoRow label="Practice Code" value={session?.practiceCode ?? '—'} />
              <InfoRow label="Name" value={session?.name ?? '—'} />
              <InfoRow label="Status" value="Active" accent />
              <InfoRow
                label="Patients Activated"
                value={String(stats?.patientsMonitored ?? '—')}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────── shared primitives ─────────── */

const iconButton: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  background: 'transparent',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: TEXT_MUTED,
  cursor: 'pointer',
  transition: 'color 120ms ease',
  padding: 0,
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: '22px',
        padding: '28px',
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}
    >
      <h2
        style={{
          fontFamily: APPLE_FONT,
          fontSize: '20px',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          color: TEXT_PRIMARY,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div
      style={{
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: TEXT_MUTED,
        fontSize: '14px',
        border: `1px dashed ${BORDER}`,
        borderRadius: '16px',
      }}
    >
      {label}
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  positive,
  warn,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  warn?: boolean;
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: '22px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <p
        style={{
          fontFamily: APPLE_FONT,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: APPLE_FONT,
          fontWeight: 600,
          fontSize: '38px',
          lineHeight: 1,
          letterSpacing: '-0.012em',
          color: warn ? RED : TEXT_PRIMARY,
          fontVariantNumeric: 'tabular-nums',
          margin: 0,
        }}
      >
        {value}
      </p>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: positive ? ACCENT : RED,
          letterSpacing: '-0.005em',
        }}
      >
        {delta}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <span
        style={{
          fontSize: '14px',
          color: TEXT_MUTED,
          letterSpacing: '-0.005em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: accent ? ACCENT : TEXT_PRIMARY,
          letterSpacing: '-0.012em',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function LivePulse() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '999px',
        background: ACCENT,
        boxShadow: `0 0 0 4px rgba(74,222,128,0.18)`,
      }}
    />
  );
}
