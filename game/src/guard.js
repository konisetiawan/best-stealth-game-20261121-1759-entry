const TAU = Math.PI * 2;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));

export function createGuards(level) {
  return level.guards.map((g, i) => ({
    x: g.x, y: g.y, angle: g.angle || 0, route: g.route, routeIndex: 1,
    suspicion: 0, mode: 'patrol', investigate: null, speed: 42 + (i % 2) * 5,
    alarmed: false, phase: i * 1.7
  }));
}

export function blockedByWall(a, b, walls) {
  const dx = b.x - a.x, dy = b.y - a.y;
  for (const r of walls) {
    let lo = 0, hi = 1;
    for (const [p, q] of [[-dx, a.x - r.x], [dx, r.x + r.w - a.x], [-dy, a.y - r.y], [dy, r.y + r.h - a.y]]) {
      if (Math.abs(p) < 1e-8) { if (q < 0) { lo = 2; break; } }
      else { const t = q / p; if (p < 0) lo = Math.max(lo, t); else hi = Math.min(hi, t); }
    }
    if (lo <= hi && hi >= 0 && lo <= 1 && lo > 0.025) return true;
  }
  return false;
}

export function guardSees(guard, player, level, visibility = 1) {
  const d = distance(guard, player);
  if (d > 245 * visibility) return false;
  const delta = Math.abs(wrapAngle(angleTo(guard, player) - guard.angle));
  return delta < 0.53 && !blockedByWall(guard, player, level.walls);
}

function moveToward(actor, target, speed, dt) {
  const dx = target.x - actor.x, dy = target.y - actor.y, d = Math.hypot(dx, dy);
  if (d < 1) return true;
  const step = Math.min(d, speed * dt);
  actor.x += dx / d * step; actor.y += dy / d * step;
  actor.angle = Math.atan2(dy, dx);
  return d <= step + 1;
}

function litAt(point, lamps) {
  return lamps.some(l => distance(point, l) < l.r * 0.72);
}

export function updateGuards(guards, player, level, dt, options = {}) {
  const visibility = (options.sneaking ? 0.7 : 1) * (options.covered ? 0.45 : 1);
  const lit = litAt(player, level.lamps);
  const gain = (options.sneaking ? 14 : 27) * (options.covered ? 0.24 : 1) * (lit ? 1.55 : 0.72);
  let maxSuspicion = 0, spotted = false, alarm = false;

  if (options.noise && options.noise.id !== options.lastNoiseId) {
    const nearest = guards.reduce((best, g) => distance(g, options.noise) < distance(best, options.noise) ? g : best, guards[0]);
    if (nearest && nearest.mode !== 'chase') { nearest.investigate = { x: options.noise.x, y: options.noise.y }; nearest.mode = 'investigate'; }
  }

  for (const g of guards) {
    const sees = guardSees(g, player, level, visibility * (lit ? 1.25 : 1));
    if (sees) {
      g.suspicion = clamp(g.suspicion + gain * dt, 0, 100);
      g.mode = g.suspicion >= 100 ? 'chase' : 'suspicious';
      if (g.mode === 'chase' && !g.alarmed) { alarm = true; g.alarmed = true; }
    } else {
      g.suspicion = clamp(g.suspicion - 13 * dt, 0, 100);
      if (g.mode === 'chase' && g.suspicion < 30) { g.mode = 'suspicious'; g.alarmed = false; }
      if (g.mode === 'suspicious' && g.suspicion < 8) g.mode = 'patrol';
    }

    if (g.mode === 'chase') {
      moveToward(g, player, 78, dt);
      if (distance(g, player) < 18) spotted = true;
    } else if (g.mode === 'investigate' && g.investigate) {
      if (moveToward(g, g.investigate, g.speed * 1.15, dt)) {
        g.investigate = null; g.mode = 'patrol';
      }
    } else {
      const route = g.route || [];
      if (route.length) {
        const target = route[g.routeIndex % route.length];
        if (moveToward(g, target, g.speed, dt)) g.routeIndex = (g.routeIndex + 1) % route.length;
      }
    }
    maxSuspicion = Math.max(maxSuspicion, g.suspicion);
  }

  const camera = level.camera;
  if (camera) {
    if (camera.baseAngle == null) camera.baseAngle = camera.angle;
    camera.angle = camera.baseAngle + Math.sin((options.time || 0) * 0.001 + 0.7) * camera.sweep;
    const d = distance(camera, player);
    const a = Math.abs(wrapAngle(angleTo(camera, player) - camera.angle));
    if (d < camera.range && a < 0.43 && !blockedByWall(camera, player, level.walls)) {
      maxSuspicion = Math.max(maxSuspicion, 65);
      if (options.cameraSuspicion != null) options.cameraSuspicion = clamp(options.cameraSuspicion + gain * dt, 0, 100);
      if ((options.cameraSuspicion || 0) >= 100) { spotted = true; alarm = !options.cameraAlarmed; options.cameraAlarmed = true; }
    } else if (options.cameraSuspicion != null) {
      options.cameraSuspicion = clamp(options.cameraSuspicion - 12 * dt, 0, 100);
    }
    maxSuspicion = Math.max(maxSuspicion, options.cameraSuspicion || 0);
  }
  return { suspicion: maxSuspicion, spotted, alarm, lit };
}
