import { useState } from 'react';
import { useLiveMetrics } from '../hooks/useLiveMetrics';
import { JUNCTIONS, ROUTE_STATUS, statusBadge } from '../data/transport';
import MetricCard from './MetricCard';
import NetworkMap from './NetworkMap';
import VolumeChart from './VolumeChart';
import SpeedChart from './SpeedChart';

/**
 * QuanticaDashboard — root component for the transport intelligence platform.
 *
 * Architecture notes for reviewers:
 * - Data lives in /data/transport.js (replace with API hooks in production)
 * - Live polling abstracted into useLiveMetrics (swap for WebSocket trivially)
 * - Canvas animation in NetworkMap uses a shared useAnimationFrame hook
 * - Charts use Chart.js; in a monorepo you'd likely share a <Chart> wrapper
 * - Dark mode driven by a single `darkMode` boolean prop or context
 */
export default function QuanticaDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const metrics = useLiveMetrics(3000);

  const s = darkMode ? dark : light;

  const metricCards = [
    {
      label:      'Active vehicles',
      value:      metrics.activeVehicles.toLocaleString(),
      trend:      'up',
      trendLabel: '3.2% vs yesterday',
    },
    {
      label:      'Avg speed (mph)',
      value:      metrics.avgSpeedMph.toFixed(1),
      trend:      'down',
      trendLabel: '11% below target',
    },
    {
      label:      'Active incidents',
      value:      String(metrics.activeIncidents),
      trend:      'neutral',
      trendLabel: '1 major, 2 minor',
    },
    {
      label:      'Network score',
      value:      String(metrics.networkScore),
      trend:      'up',
      trendLabel: 'Good — 6 h avg',
    },
  ];

  return (
    <div style={{ ...s.root, fontFamily: 'monospace' }}>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <div>
          {/* <span style={s.brand}>QUANTICA</span> */}
          {/* <span style={s.pipe}> | </span> */}
          <span style={s.subbrand}>Transport Intelligence</span>
        </div>
        <div style={s.rightBar}>
          <span style={s.liveTag}>
            <span style={s.liveDot} />
            Live — Greater Manchester
          </span>
          <button
            onClick={() => setDarkMode(d => !d)}
            style={s.toggleBtn}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀ Light' : '☾ Dark'}
          </button>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div style={s.metricsGrid}>
        {metricCards.map(card => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Map + sidebar ── */}
      <div style={s.mainRow}>
        <div style={s.mapPanel}>
          <span style={s.panelLabel}>Road network — live flow density</span>
          <NetworkMap darkMode={darkMode} />
        </div>

        <div style={s.sidebar}>
          {/* Junction throughput */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Junction throughput</p>
            {JUNCTIONS.map(j => (
              <div key={j.id} style={s.jRow}>
                <span style={s.jName}>{j.name}</span>
                <div style={s.barBg}>
                  <div
                    style={{
                      ...s.barFill,
                      width:      `${j.saturation}%`,
                      background: j.saturation > 80 ? '#E24B4A'
                                : j.saturation > 55 ? '#EF9F27'
                                :                    '#1D9E75',
                    }}
                  />
                </div>
                <span style={s.jVal}>{j.saturation}%</span>
              </div>
            ))}
          </div>

          {/* Route status */}
          <div style={s.sideCard}>
            <p style={s.sideTitle}>Route status</p>
            {ROUTE_STATUS.map(r => {
              const badge = statusBadge(r.status);
              return (
                <div key={r.route} style={s.routeRow}>
                  <span style={s.routeName}>{r.route}</span>
                  <span style={s.routeFlow}>{r.flow}</span>
                  <span style={{ ...s.badge, background: badge.bg, color: badge.text }}>
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div style={s.chartsRow}>
        <div style={s.chartCard}>
          <p style={s.sideTitle}>Hourly volume — today vs 7-day avg</p>
          <div style={s.legendRow}>
            {[['#378ADD','Today'],['#888780','7-day avg']].map(([c, l]) => (
              <span key={l} style={s.legItem}>
                <span style={{ ...s.legSwatch, background: c }} />
                {l}
              </span>
            ))}
          </div>
          <VolumeChart darkMode={darkMode} />
        </div>

        <div style={s.chartCard}>
          <p style={s.sideTitle}>Speed distribution by corridor</p>
          <div style={s.legendRow}>
            {[['#1D9E75','Free flow'],['#EF9F27','Moderate'],['#E24B4A','Congested']].map(([c, l]) => (
              <span key={l} style={s.legItem}>
                <span style={{ ...s.legSwatch, background: c }} />
                {l}
              </span>
            ))}
          </div>
          <SpeedChart darkMode={darkMode} />
        </div>
      </div>

    </div>
  );
}

/* ── Shared token helpers ── */
const shared = {
  topBar:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
  rightBar:  { display: 'flex', alignItems: 'center', gap: 16 },
  brand:     { fontSize: 13, fontWeight: 500, letterSpacing: '0.1em' },
  pipe:      { opacity: 0.3 },
  subbrand:  { fontSize: 13 },
  liveDot:   { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#22c55e', marginRight: 6, verticalAlign: 'middle' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginBottom: '1.25rem' },
  mainRow:   { display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12, marginBottom: 12 },
  mapPanel:  { borderRadius: 12, border: '0.5px solid', overflow: 'hidden', position: 'relative', padding: '2rem 0 0' },
  panelLabel:{ position: 'absolute', top: 10, left: 12, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' },
  sidebar:   { display: 'flex', flexDirection: 'column', gap: 10 },
  sideCard:  { borderRadius: 12, border: '0.5px solid', padding: '0.85rem 1rem' },
  sideTitle: { fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, margin: '0 0 10px' },
  jRow:      { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  jName:     { fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barBg:     { flex: 2, height: 4, borderRadius: 2, overflow: 'hidden', background: 'rgba(128,128,128,0.2)' },
  barFill:   { height: '100%', borderRadius: 2, transition: 'width 0.3s ease' },
  jVal:      { fontSize: 11, minWidth: 32, textAlign: 'right', fontFamily: 'monospace' },
  routeRow:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(128,128,128,0.15)' },
  routeName: { fontSize: 11, flex: 1 },
  routeFlow: { fontSize: 11, fontFamily: 'monospace', marginRight: 8 },
  badge:     { fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  chartCard: { borderRadius: 12, border: '0.5px solid', padding: '0.85rem 1rem' },
  legendRow: { display: 'flex', gap: 14, marginBottom: 8, flexWrap: 'wrap' },
  legItem:   { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 },
  legSwatch: { width: 8, height: 8, borderRadius: 2 },
  toggleBtn: { fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', border: '0.5px solid', background: 'transparent', fontFamily: 'monospace' },
  liveTag:   { fontSize: 11 },
};

const light = Object.assign({}, shared, {
  root:      { padding: '1.5rem', background: '#fafafa', minHeight: '100vh', color: '#111' },
  mapPanel:  { ...shared.mapPanel, borderColor: 'rgba(0,0,0,0.1)', background: '#f4f4f5' },
  sideCard:  { ...shared.sideCard, borderColor: 'rgba(0,0,0,0.1)', background: '#f4f4f5' },
  chartCard: { ...shared.chartCard, borderColor: 'rgba(0,0,0,0.1)', background: '#f4f4f5' },
  brand:     { ...shared.brand, color: '#111' },
  subbrand:  { ...shared.subbrand, color: '#6b7280' },
  liveTag:   { ...shared.liveTag, color: '#6b7280' },
  panelLabel:{ ...shared.panelLabel, color: '#9ca3af' },
  sideTitle: { ...shared.sideTitle, color: '#9ca3af' },
  jName:     { ...shared.jName, color: '#374151' },
  jVal:      { ...shared.jVal, color: '#6b7280' },
  routeName: { ...shared.routeName, color: '#374151' },
  routeFlow: { ...shared.routeFlow, color: '#9ca3af' },
  legItem:   { ...shared.legItem, color: '#6b7280' },
  toggleBtn: { ...shared.toggleBtn, color: '#374151', borderColor: 'rgba(0,0,0,0.2)' },
});

const dark = Object.assign({}, shared, {
  root:      { padding: '1.5rem', background: '#111', minHeight: '100vh', color: '#f5f5f5' },
  mapPanel:  { ...shared.mapPanel, borderColor: 'rgba(255,255,255,0.1)', background: '#18181b' },
  sideCard:  { ...shared.sideCard, borderColor: 'rgba(255,255,255,0.1)', background: '#18181b' },
  chartCard: { ...shared.chartCard, borderColor: 'rgba(255,255,255,0.1)', background: '#18181b' },
  brand:     { ...shared.brand, color: '#f5f5f5' },
  subbrand:  { ...shared.subbrand, color: '#9ca3af' },
  liveTag:   { ...shared.liveTag, color: '#9ca3af' },
  panelLabel:{ ...shared.panelLabel, color: '#6b7280' },
  sideTitle: { ...shared.sideTitle, color: '#6b7280' },
  jName:     { ...shared.jName, color: '#d1d5db' },
  jVal:      { ...shared.jVal, color: '#9ca3af' },
  routeName: { ...shared.routeName, color: '#d1d5db' },
  routeFlow: { ...shared.routeFlow, color: '#6b7280' },
  legItem:   { ...shared.legItem, color: '#9ca3af' },
  toggleBtn: { ...shared.toggleBtn, color: '#d1d5db', borderColor: 'rgba(255,255,255,0.15)' },
});
