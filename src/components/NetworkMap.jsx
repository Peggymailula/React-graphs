import { useRef, useEffect, useMemo } from 'react';
import { ROAD_PATHS, FLOW_PATHS, JUNCTIONS, congestionColor } from '../data/transport';
import { useAnimationFrame } from '../hooks/useLiveMetrics';

const W = 660;
const H = 340;

/**
 * Linearly interpolate along a polyline of [x,y] points.
 * t ∈ [0, 1] maps to the full length of the path.
 */
function lerpPath(pts, t) {
  const segs = pts.length - 1;
  const seg  = Math.min(Math.floor(t * segs), segs - 1);
  const lt   = t * segs - seg;
  const [x0, y0] = pts[seg];
  const [x1, y1] = pts[seg + 1];
  return [x0 + (x1 - x0) * lt, y0 + (y1 - y0) * lt];
}

/** Build particle state once on mount — each particle knows which road it follows. */
function createParticles() {
  const roadMap = Object.fromEntries(ROAD_PATHS.map(r => [r.id, r]));
  const particles = [];
  FLOW_PATHS.forEach(({ road, count, speed }) => {
    const r = roadMap[road];
    for (let i = 0; i < count; i++) {
      particles.push({
        pts:   r.pts,
        color: congestionColor(r.congestion),
        t:     Math.random(),
        speed: speed * (0.8 + Math.random() * 0.4),
      });
    }
  });
  return particles;
}

export default function NetworkMap({ darkMode }) {
  const canvasRef = useRef(null);
  const particles = useMemo(createParticles, []);

  const bg      = darkMode ? '#18181b' : '#f4f4f5';
  const roadBg  = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textCol = darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dim road skeleton
    ROAD_PATHS.forEach(({ pts, congestion }) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = roadBg;
      ctx.lineWidth   = 6;
      ctx.stroke();
    });

    // Coloured congestion overlay
    ROAD_PATHS.forEach(({ pts, congestion }) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = congestionColor(congestion);
      ctx.lineWidth   = 2.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Animated particles
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const [px, py] = lerpPath(p.pts, p.t);
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle  = p.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Junction nodes
    JUNCTIONS.forEach(({ x, y, saturation, name }) => {
      const isAlert = saturation > 80;
      const radius  = isAlert ? 7 : 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle   = congestionColor(saturation / 100);
      ctx.fill();
      ctx.strokeStyle = bg;
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.fillStyle = textCol;
      ctx.font      = '9px monospace';
      ctx.fillText(name, x + radius + 3, y + 3);
    });

    // Legend
    [['#1D9E75','Free flow'],['#EF9F27','Moderate'],['#E24B4A','Congested']].forEach(([c, l], i) => {
      const lx = W - 100, ly = H - 52 + i * 17;
      ctx.fillStyle = c;
      ctx.fillRect(lx, ly, 10, 8);
      ctx.fillStyle = textCol;
      ctx.font = '9px monospace';
      ctx.fillText(l, lx + 14, ly + 7);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-label="Live road network map showing traffic flow density across Greater Manchester"
    />
  );
}
