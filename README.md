# Transport Intelligence Dashboard

A frontend demo built for the Intelligent Data engineering interview.
Showcases data visualisation, animated canvas maps, and live-updating metrics
in a production-quality React codebase.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project structure

```
src/
├── data/
│   └── transport.js          # All mock data + helper fns (replace w/ API layer)
├── hooks/
│   └── useLiveMetrics.js     # Polling hook + rAF wrapper
└── components/
    ├── App.jsx               # Root
    ├── QuanticaDashboard.jsx # Layout + orchestration
    ├── NetworkMap.jsx        # Canvas map with animated traffic particles
    ├── MetricCard.jsx        # KPI tile
    ├── VolumeChart.jsx       # Chart.js hourly volume line chart
    └── SpeedChart.jsx        # Chart.js stacked speed distribution bar chart
```

## Architecture decisions

### Data layer (`src/data/transport.js`)
All static mock data and pure helper functions live here. In production, each
export would be backed by a React Query / SWR fetch from a Quantica REST endpoint
(e.g. `GET /api/v1/network/corridors`). The component tree is unaware of where
data comes from — it only imports named constants.

### Live metrics (`useLiveMetrics`)
Wraps `setInterval` in a React-safe `useEffect` with cleanup. In production:
replace the `setInterval` body with a WebSocket message handler or an SWR
`refreshInterval`. The hook's return shape mirrors what the API contract would
return, so swapping the implementation is a one-file change.

### Canvas map (`NetworkMap`)
Uses the HTML5 Canvas API directly — no mapping library dependency — to keep
the bundle small and give full control over rendering. The `useAnimationFrame`
hook centralises rAF lifecycle management and ensures cancellation on unmount.
Particle positions are computed in JS each frame from polyline path data; the
congestion colour is derived from the road's saturation ratio.

In a production setting the road geometry would come from a GeoJSON/TopoJSON
source (Mapbox GL JS or Leaflet with a custom canvas overlay) rather than
hand-authored pixel coordinates.

### Charts (`VolumeChart`, `SpeedChart`)
Chart.js is loaded as a CDN script tag (UMD global) to avoid bundling it into
the main chunk. In a Vite monorepo you'd use `import Chart from 'chart.js/auto'`
instead. Each chart component destroys and recreates its instance when `darkMode`
changes so tick/grid colours update correctly.

### Dark mode
A single `darkMode` boolean flows from `QuanticaDashboard` down to every
component as a prop. Styles are expressed as two plain-object maps (`light`/`dark`)
keyed from the same `shared` token set, so there's one place to change spacing,
radius, and typography. In a larger app this would be a Context value or a CSS
custom-property toggle on `:root`.

## What I'd add with more time

- Mapbox GL JS overlay for real road geometry from OS OpenData
- React Query for data fetching + optimistic updates
- Incident detail modal (click a junction node on the map)
- Time-of-day scrubber to replay historical congestion patterns
- Vitest + React Testing Library unit tests for hooks and MetricCard
- Storybook stories for each component
