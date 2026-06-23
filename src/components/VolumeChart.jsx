import { useEffect, useRef } from 'react';
import { HOURS, TODAY_VOL, AVG_VOL } from '../data/transport';

/**
 * VolumeChart — line chart comparing today's hourly vehicle volume
 * against the rolling 7-day average.
 *
 * Uses Chart.js (loaded as a UMD script tag in index.html) to avoid
 * bundling the full library; in a Vite/webpack project you'd import it:
 *   import Chart from 'chart.js/auto'
 */
export default function VolumeChart({ darkMode }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  const gridColor   = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tickColor   = darkMode ? '#9ca3af' : '#6b7280';

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: HOURS,
        datasets: [
          {
            label:       'Today',
            data:         TODAY_VOL,
            borderColor:  '#378ADD',
            borderWidth:  2,
            pointRadius:  0,
            tension:      0.4,
            fill:         false,
          },
          {
            label:          '7-day avg',
            data:            AVG_VOL,
            borderColor:    '#888780',
            borderWidth:     1.5,
            borderDash:      [4, 3],
            pointRadius:     0,
            tension:         0.4,
            fill:            false,
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: tickColor, font: { size: 10, family: 'monospace' } },
            grid:  { color: gridColor },
          },
          y: {
            ticks: {
              color:    tickColor,
              font:     { size: 10 },
              callback: v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v,
            },
            grid: { color: gridColor },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [darkMode]);

  return (
    <div style={{ position: 'relative', height: 150 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Line chart comparing today's hourly vehicle volume to the 7-day average"
      >
        Today's hourly volumes range from 820 to 2,490 vehicles/h. The 7-day average follows a similar shape.
      </canvas>
    </div>
  );
}
