const TREND_STYLE = {
  up:      { color: '#16a34a' },
  down:    { color: '#dc2626' },
  neutral: { color: '#d97706' },
};

/**
 * MetricCard — a single KPI summary tile.
 *
 * Props:
 *   label      {string}   — short uppercase label
 *   value      {string}   — formatted primary value
 *   trend      {string}   — 'up' | 'down' | 'neutral'
 *   trendLabel {string}   — human-readable trend description
 */
export default function MetricCard({ label, value, trend = 'neutral', trendLabel }) {
  const ts = TREND_STYLE[trend] ?? TREND_STYLE.neutral;
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '⚠';

  return (
    <div style={styles.card}>
      <p style={styles.label}>{label}</p>
      <p style={styles.value}>{value}</p>
      {trendLabel && (
        <p style={{ ...styles.trend, ...ts }}>
          {arrow}&nbsp;{trendLabel}
        </p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--color-background-secondary, #f4f4f5)',
    borderRadius: 8,
    padding: '0.85rem 1rem',
  },
  label: {
    fontSize: 10,
    color: 'var(--color-text-secondary, #6b7280)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 6,
    margin: '0 0 6px',
  },
  value: {
    fontSize: 22,
    fontWeight: 500,
    fontFamily: 'monospace',
    color: 'var(--color-text-primary, #111)',
    margin: 0,
  },
  trend: {
    fontSize: 11,
    marginTop: 3,
    margin: '3px 0 0',
  },
};
