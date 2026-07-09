import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import { insightLineData, activityStats } from '../data/mockData';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const ACCENT = '#4ade80';
const ACCENT_LIGHT = '#a7f3d0';
const ACCENT_DARK = '#22c55e';
const TEAL = '#5eead4';
const RED = '#ff6b6b';
const TEXT_PRIMARY = '#f5f5f7';
const TEXT_MUTED = '#86868b';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = '#0b0b0d';
const SUBTLE_BG = 'rgba(255,255,255,0.04)';

const tabs = ['Time of Day', 'Tags', 'Demographics', 'Timeliness'];
const timeFilters = [
  { label: 'Morning', dot: ACCENT_LIGHT },
  { label: 'Noon', dot: ACCENT },
  { label: 'Night', dot: ACCENT_DARK },
];

export default function Insights() {
  const [activeTab, setActiveTab] = useState('Time of Day');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Morning', 'Noon', 'Night']);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 3fr) minmax(280px, 1fr)',
        gap: '28px',
        fontFamily: APPLE_FONT,
      }}
    >
      {/* ── Left column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            borderBottom: `1px solid ${BORDER}`,
            paddingBottom: '4px',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: APPLE_FONT,
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '-0.012em',
                  color: isActive ? TEXT_PRIMARY : TEXT_MUTED,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 0 14px',
                  position: 'relative',
                  transition: 'color 120ms ease',
                }}
              >
                {tab}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: '-5px',
                      height: '2px',
                      background: ACCENT,
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Report card */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: '22px',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                fontFamily: APPLE_FONT,
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '-0.005em',
                color: TEXT_PRIMARY,
                margin: 0,
              }}
            >
              Report and Analysis
            </h2>
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
          </div>

          <div style={{ height: '280px' }}>
            <LineChart data={insightLineData} />
          </div>

          {/* Time filter chips */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
            {timeFilters.map((f) => {
              const isOn = activeFilters.includes(f.label);
              return (
                <button
                  key={f.label}
                  onClick={() => toggleFilter(f.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    borderRadius: '980px',
                    fontFamily: APPLE_FONT,
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '-0.012em',
                    color: isOn ? TEXT_PRIMARY : TEXT_MUTED,
                    background: isOn ? SUBTLE_BG : 'transparent',
                    border: `1px solid ${isOn ? BORDER : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '999px',
                      background: isOn ? f.dot : 'rgba(255,255,255,0.15)',
                    }}
                  />
                  {f.label}
                </button>
              );
            })}
            <button
              style={{
                padding: '10px 18px',
                borderRadius: '980px',
                fontFamily: APPLE_FONT,
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '-0.012em',
                color: ACCENT,
                background: 'transparent',
                border: `1px solid ${ACCENT}`,
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              Details
            </button>
          </div>
        </div>

        {/* Insight cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <InsightCard
            title="Top Performer Insights"
            accent={ACCENT}
            accentBg="rgba(74,222,128,0.06)"
            accentBorder="rgba(74,222,128,0.18)"
            items={[
              'Ages 12–14 showed a 23% increase in week-over-week capture rate',
              'Patients tagged "Early Riser" averaged 94% morning compliance',
              'Evening window sees highest on-time submissions at 88%',
            ]}
          />
          <InsightCard
            title="Low Performer Insights"
            accent={TEAL}
            accentBg="rgba(94,234,212,0.06)"
            accentBorder="rgba(94,234,212,0.18)"
            items={[
              'Patients tagged "Athlete" struggled with afternoon captures (61%)',
              'Ages 15–17 show a 12% drop in compliance over the last 30 days',
              'Midday window has the lowest submission rate across all demographics',
            ]}
          />
        </div>
      </div>

      {/* ── Right column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Donut */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: '22px',
            padding: '28px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DonutChart
            activePercent={activityStats.activePercent}
            inactivePercent={activityStats.inactivePercent}
            size="md"
          />
        </div>

        {/* Stats */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: '22px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <StatRow
            label="Active"
            value={activityStats.activePatients}
            color={ACCENT}
            note={activityStats.activePatientsChange}
            divider={false}
          />
          <StatRow
            label="Inactive"
            value={activityStats.inactivePatients}
            color={RED}
            note={activityStats.inactivePatientsChange}
          />
          <StatRow
            label="Revision"
            value={activityStats.revision}
            color={TEAL}
            note={activityStats.revisionNote}
          />
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  items,
  accent,
  accentBg,
  accentBorder,
}: {
  title: string;
  items: string[];
  accent: string;
  accentBg: string;
  accentBorder: string;
}) {
  return (
    <div
      style={{
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: '22px',
        padding: '28px',
      }}
    >
      <h3
        style={{
          fontFamily: APPLE_FONT,
          fontSize: '17px',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          color: TEXT_PRIMARY,
          margin: 0,
          marginBottom: '20px',
        }}
      >
        {title}
      </h3>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {items.map((text, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '14px',
              lineHeight: 1.55,
              letterSpacing: '-0.005em',
              color: 'rgba(245,245,247,0.82)',
            }}
          >
            <span
              style={{
                minWidth: '6px',
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: accent,
                marginTop: '9px',
                flexShrink: 0,
              }}
            />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
  note,
  divider = true,
}: {
  label: string;
  value: number | string;
  color: string;
  note: string;
  divider?: boolean;
}) {
  const pct = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div
      style={{
        borderTop: divider ? `1px solid ${BORDER}` : 'none',
        paddingTop: divider ? '24px' : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '15px',
            fontWeight: 600,
            color: TEXT_PRIMARY,
            letterSpacing: '-0.005em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: APPLE_FONT,
            fontSize: '22px',
            fontWeight: 600,
            color,
            letterSpacing: '-0.012em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
          }}
        />
      </div>
      <p
        style={{
          fontSize: '12px',
          color: TEXT_MUTED,
          marginTop: '10px',
          lineHeight: 1.55,
          letterSpacing: '-0.005em',
        }}
      >
        {note}
      </p>
    </div>
  );
}
