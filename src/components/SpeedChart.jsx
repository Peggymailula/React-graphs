import { useEffect, useRef } from 'react';
import {
  SPEED_CORRIDORS,
  SPEED_FREE,
  SPEED_MODERATE,
  SPEED_CONGESTED,
} from '../data/transport';

/**
 * SpeedChart — stacked bar chart showing the proportion of free-flow,
 * moderate, and congested travel across each major corridor.
 */
export default function SpeedChart({ darkMode }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  const gridColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tickColor = darkMode ? '#9ca3af' : '#6b7280';

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: SPEED_CORRIDORS,
        datasets: [
          { label: 'Free flow', data: SPEED_FREE,      backgroundColor: '#1D9E75' },
          { label: 'Moderate',  data: SPEED_MODERATE,  backgroundColor: '#EF9F27' },
          { label: 'Congested', data: SPEED_CONGESTED, backgroundColor: '#E24B4A' },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            stacked: true,
            ticks:   { color: tickColor, font: { size: 10 } },
            grid:    { display: false },
          },
          y: {
            stacked: true,
            max:     100,
            ticks: {
              color:    tickColor,
              font:     { size: 10 },
              callback: v => `${v}%`,
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
        aria-label="Stacked bar chart showing speed distribution across road corridors"
      >
        Speed breakdown by corridor: M60 mostly congested, A56/A57 mostly free flow.
      </canvas>
    </div>
  );
}
