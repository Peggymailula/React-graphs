import { useState, useEffect, useRef } from 'react';

/**
 * useLiveMetrics — simulates a streaming data feed from the transport platform.
 *
 * In production, this hook would subscribe to a WebSocket or poll a REST
 * endpoint (e.g. GET /api/v1/network/metrics) on an interval, then dispatch
 * updates into local state. The shape of `metrics` mirrors what the Quantica
 * API contract would return.
 *
 * @param {number} intervalMs - how often to refresh (default 3 s)
 */
export function useLiveMetrics(intervalMs = 3000) {
  const [metrics, setMetrics] = useState({
    activeVehicles: 4821,
    avgSpeedMph: 24.7,
    activeIncidents: 3,
    networkScore: 78,
    lastUpdated: new Date(),
  });

  const baseRef = useRef(metrics);

  useEffect(() => {
    const id = setInterval(() => {
      const base = baseRef.current;
      setMetrics({
        activeVehicles: base.activeVehicles + Math.round((Math.random() - 0.5) * 40),
        avgSpeedMph:    parseFloat((base.avgSpeedMph + (Math.random() - 0.5) * 0.6).toFixed(1)),
        activeIncidents: Math.max(0, base.activeIncidents + (Math.random() < 0.1 ? (Math.random() < 0.5 ? 1 : -1) : 0)),
        networkScore:   Math.min(100, Math.max(0, base.networkScore + Math.round((Math.random() - 0.5) * 3))),
        lastUpdated:    new Date(),
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return metrics;
}

/**
 * useAnimationFrame — thin wrapper around rAF for canvas animations.
 * Automatically cancels on unmount.
 */
export function useAnimationFrame(callback) {
  const rafRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = () => {
      callbackRef.current();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}
