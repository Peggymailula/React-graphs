// transport.js — mock data layer


export const CORRIDORS = [
  { id: 'N1', label: 'N1 Freeway', color: '#E24B4A' },
  { id: 'N2',  label: 'N2 Airport Rd', color: '#EF9F27' },
  { id: 'M3', label: 'M3 Atlantic Seaboard', color: '#1D9E75' },
  { id: 'SLR', label: 'Sir Lowry Rd', color: '#1D9E75' },
  { id: 'WTF', label: 'V&A Waterfront', color: '#E24B4A' },
];

export const JUNCTIONS = [
  { id: 'j1', name: 'Camps Bay', x: 370, y: 145, saturation: 91 },
  { id: 'j2', name: 'Sea Point',          x: 240, y: 155, saturation: 74 },
  { id: 'j3', name: 'Clifton Beaches',        x: 490, y: 160, saturation: 68 },
  { id: 'j4', name: 'Mouille Point',     x: 220, y: 95,  saturation: 52 },
  { id: 'j5', name: 'Table Mountain Node',            x: 580, y: 140, saturation: 38 },
];

// Polyline paths for each road on the canvas [x, y] in a 660×340 space
export const ROAD_PATHS = [
  { id: 'r1', pts: [[0,160],[120,158],[240,155],[370,145],[490,140],[610,136],[660,134]], congestion: 0.88 },
  { id: 'r2', pts: [[0,210],[130,200],[260,185],[370,165],[490,155],[620,148],[660,145]], congestion: 0.62 },
  { id: 'r3', pts: [[200,0],[212,95],[220,155],[228,210],[235,280],[238,340]],            congestion: 0.45 },
  { id: 'r4', pts: [[370,0],[370,80],[370,145],[368,210],[366,280],[365,340]],            congestion: 0.71 },
  { id: 'r5', pts: [[490,0],[490,80],[490,140],[488,210],[486,280],[485,340]],            congestion: 0.38 },
  { id: 'r6', pts: [[0,85],[120,87],[220,89],[370,88],[490,85],[610,82],[660,80]],        congestion: 0.30 },
];

// Particle flows for animation — each references a road path
export const FLOW_PATHS = [
  { road: 'r1', count: 14, speed: 0.0009 },
  { road: 'r2', count: 10, speed: 0.0012 },
  { road: 'r3', count:  8, speed: 0.0011 },
  { road: 'r4', count: 10, speed: 0.0009 },
  { road: 'r6', count:  7, speed: 0.0014 },
];

export const ROUTE_STATUS = [
  { route: 'N1 Freeway',    flow: '1,204/h', status: 'Congested' },
  { route: 'N2 Airport Rd',  flow: '887/h',   status: 'Moderate'  },
  { route: 'M3 Seaboard',   flow: '641/h',   status: 'Free flow' },
  { route: 'Sir Lowry Rd',     flow: '412/h',   status: 'Free flow' },
];

export const HOURS = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
export const TODAY_VOL  = [820,1450,2310,2190,1680,1540,1490,1610,1720,1880,2240,2490,1950,1310,870];
export const AVG_VOL    = [790,1380,2180,2050,1720,1590,1440,1580,1670,1820,2160,2380,1890,1280,810];

export const SPEED_CORRIDORS  = ['N1','N2','M3','SLR','Waterfront'];
export const SPEED_FREE       = [28, 45, 60, 72, 18];
export const SPEED_MODERATE   = [45, 35, 28, 20, 42];
export const SPEED_CONGESTED  = [27, 20, 12,  8, 40];

export function congestionColor(ratio) {
  if (ratio < 0.45) return '#1D9E75';
  if (ratio < 0.70) return '#EF9F27';
  return '#E24B4A';
}

export function statusBadge(status) {
  switch (status) {
    case 'Congested': return { bg: '#fee2e2', text: '#991b1b' };
    case 'Moderate':  return { bg: '#fef3c7', text: '#92400e' };
    default:          return { bg: '#dcfce7', text: '#166534' };
  }
}
