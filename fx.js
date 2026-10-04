/* fx.js —— 画面质感层（v2）：
   1) 场景光影：每个背景按“时段/室内外”烘焙一次（色调 multiply、光源 screen、丁达尔光束、地面压暗、纸纹颗粒）→ 跟背景一起缓存，零逐帧开销；
   2) 环境粒子：花瓣 / 落叶 / 雪 / 孔明灯 / 萤火 / 浮尘 / 余烬 / 鬼火 / 星光 / 金粉 / 泡泡 / 水光 / 香烟，分前后两层（前景层更大更虚，有景深）；
   3) 后期：角色画完后再压一层同场景的色调 + 暗角（缓存成位图，一次 drawImage）；
   4) DOM 打击感：小游戏里的得分/失误音效 → 在点按处冒星星 / 屏幕轻抖 / 红闪；按钮按下涟漪。
   系统“减少动态效果”时：粒子减到 1/3、变慢，不抖屏。 */
(function (P) {
'use strict';
const A = P.ART, U = A.util, TAU = Math.PI * 2;
const FX = A.FX = {};
const RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
FX.reduced = () => !!(RM && RM.matches);

const MOOD = FX.MOOD = {
  title: ['dusk', 'petals'], room: ['night', 'dust'], bridge: ['spirit', 'wisps'], carriage: ['day', null], gate: ['day', 'leaves'], courtyard: ['day', 'petals'],
  room_night: ['night', 'dust'], room_day: ['indoor', 'dust'], garden: ['day', 'petals'], kitchen: ['indoor', 'steam'], hall: ['indoor', 'gold'], rain: ['rain', null],
  roof: ['night', 'fireflies'], cining: ['indoor', 'incense'], yonghe: ['indoor', 'dust'], yonghe_night: ['night', 'fireflies'], lane_night: ['night', 'lanterns'],
  yonghe_yard: ['day', 'petals'], kunning: ['indoor', 'gold'], changchun: ['day', 'petals'], jingshi: ['indoor', 'dust'], yangxin: ['indoor', 'dust'],
  swing: ['day', 'petals'], banquet: ['dusk', 'lanterns'], taiye: ['day', 'glints'], shouyan: ['indoor', 'gold'], fotang: ['indoor', 'incense'],
  taiyiyuan: ['indoor', 'dust'], laundry: ['day', 'bubbles'], shenxing: ['dark', 'dust'], storm: ['storm', null], garden_night: ['night', 'fireflies'],
  coldroom: ['dark', 'dust'], lenggong: ['cold', 'leaves'], lenggong_night: ['night', 'snow'], juanku: ['indoor', 'dust'], guanxing: ['night', 'stars'],
  chahui: ['day', 'petals'], mirror: ['spirit', 'wisps'], bairiyan: ['indoor', 'gold'], huochang: ['fire', 'embers'], hospital: ['clinic', null], naichapu: ['day', null], dawn: ['dawn', 'petals'],
};
// mul: 整体色调；glow: [x, y, 颜色, 半径倍数]；rays: 光束颜色；floor: 地面压暗；post: 角色也一起染的色调；vig: 暗角强度
const TOD = {
  day: { mul: [255, 236, 214, 0.18], glow: [0.12, -0.05, 'rgba(255,246,220,0.6)', 0.8], rays: 'rgba(255,250,230,0.13)', floor: 0.14, vig: 0.2 },
  dusk: { mul: [255, 196, 170, 0.32], glow: [0.8, 0.1, 'rgba(255,214,160,0.62)', 0.75], rays: 'rgba(255,220,180,0.1)', floor: 0.18, vig: 0.28, post: 'rgba(255,170,130,0.07)' },
  night: { mul: [150, 160, 230, 0.26], glow: [0.82, 0.06, 'rgba(200,215,255,0.35)', 0.6], floor: 0.24, vig: 0.42, post: 'rgba(60,70,150,0.12)' },
  indoor: { mul: [255, 222, 180, 0.24], glow: [0.18, 0.08, 'rgba(255,236,200,0.5)', 0.7], rays: 'rgba(255,240,210,0.1)', floor: 0.2, vig: 0.32, post: 'rgba(255,190,120,0.05)' },
  spirit: { mul: [190, 175, 255, 0.2], glow: [0.5, 0.38, 'rgba(170,220,255,0.35)', 0.7], floor: 0.2, vig: 0.42, post: 'rgba(110,90,200,0.08)' },
  rain: { mul: [175, 190, 220, 0.34], floor: 0.2, vig: 0.38, post: 'rgba(60,80,130,0.1)' },
  storm: { mul: [160, 168, 205, 0.4], floor: 0.22, vig: 0.48, post: 'rgba(40,50,100,0.12)' },
  fire: { mul: [255, 180, 140, 0.26], glow: [0.5, 1.05, 'rgba(255,130,50,0.5)', 0.8], floor: 0.1, vig: 0.48, post: 'rgba(255,90,30,0.09)' },
  dark: { mul: [195, 185, 205, 0.3], glow: [0.5, 0.45, 'rgba(255,220,170,0.25)', 0.45], floor: 0.22, vig: 0.55, post: 'rgba(40,20,50,0.08)' },
  cold: { mul: [205, 214, 235, 0.36], floor: 0.18, vig: 0.34, post: 'rgba(120,140,190,0.06)' },
  dawn: { mul: [255, 210, 205, 0.26], glow: [0.5, 0.6, 'rgba(255,224,170,0.6)', 0.8], rays: 'rgba(255,230,190,0.12)', floor: 0.12, vig: 0.24 },
  clinic: { mul: [228, 240, 255, 0.2], glow: [0.75, 0.05, 'rgba(255,255,255,0.4)', 0.6], floor: 0.1, vig: 0.18 },
};
FX.tod = name => TOD[(MOOD[name] || ['day'])[0]] || TOD.day;

let grainPat = null;
function grain(c) {
  if (!grainPat) { const g = document.createElement('canvas'); g.width = g.height = 96; const x = g.getContext('2d'), d = x.createImageData(96, 96);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 70; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); grainPat = g; }
  return c.createPattern(grainPat, 'repeat');
}
FX.bake = function (c, name, W, H) {
  try {
    const T = FX.tod(name); c.save();
    if (T.mul) { const [r, g, b, a] = T.mul; c.globalCompositeOperation = 'multiply';
      c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, `rgba(${r},${g},${b},${a})`], [1, `rgba(${r},${g},${b},${a * 0.55})`]]); c.fillRect(0, 0, W, H); }
    if (T.floor) { c.globalCompositeOperation = 'multiply'; c.fillStyle = U.lg(c, 0, H * 0.62, 0, H, [[0, 'rgba(90,50,60,0)'], [1, `rgba(90,50,60,${T.floor})`]]); c.fillRect(0, H * 0.62, W, H * 0.38); }
    if (T.glow) { const [gx, gy, col, k] = T.glow, R = Math.max(W, H) * k, x = gx * W, y = gy * H; c.globalCompositeOperation = 'screen';
      c.fillStyle = U.rg(c, x, y, 0, R, [[0, col], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, W, H);
      if (T.rays) { c.globalCompositeOperation = 'lighter'; const n = 5;
        for (let i = 0; i < n; i++) { const a0 = 0.55 + i * 0.16 + (gx > 0.5 ? Math.PI * 0.35 : 0), w = 0.035 + (i % 2) * 0.025, L = Math.hypot(W, H) * 1.1;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a0 - w) * L, y + Math.sin(a0 - w) * L); c.lineTo(x + Math.cos(a0 + w) * L, y + Math.sin(a0 + w) * L); c.closePath();
          c.fillStyle = U.rg(c, x, y, 0, L * 0.75, [[0, T.rays], [1, 'rgba(0,0,0,0)']]); c.fill(); } } }
    if (T.vig) { c.globalCompositeOperation = 'multiply'; const R = Math.hypot(W, H) * 0.62;
      c.fillStyle = U.rg(c, W / 2, H * 0.45, R * 0.45, R, [[0, 'rgba(60,30,40,0)'], [1, `rgba(60,30,40,${T.vig * 0.6})`]]); c.fillRect(0, 0, W, H); }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.07; c.fillStyle = grain(c); c.fillRect(0, 0, W, H);
    c.restore();
  } catch (e) { try { c.restore(); } catch (e2) {} }
};

/* ---------- 后期：色调 + 暗角（按尺寸缓存成位图） ---------- */
const postCache = {};
FX.post = function (c, name, W, H) {
  const T = FX.tod(name); if (!T.vig && !T.post) return;
  W = Math.max(1, Math.round(W)); H = Math.max(1, Math.round(H));
  const key = (MOOD[name] || ['day'])[0] + '|' + W + 'x' + H; let cv = postCache[key];
  if (!cv) { cv = document.createElement('canvas'); const s = 0.5; cv.width = Math.max(1, Math.round(W * s)); cv.height = Math.max(1, Math.round(H * s)); const x = cv.getContext('2d'), w = cv.width, h = cv.height;
    if (T.post) { x.fillStyle = T.post; x.fillRect(0, 0, w, h); }
    const R = Math.hypot(w, h) * 0.6; x.fillStyle = U.rg(x, w / 2, h * 0.46, R * 0.55, R, [[0, 'rgba(40,16,28,0)'], [1, `rgba(40,16,28,${(T.vig || 0.2) * 0.75})`]]); x.fillRect(0, 0, w, h);
    const ks = Object.keys(postCache); if (ks.length > 8) delete postCache[ks[0]]; postCache[key] = cv; }
  c.drawImage(cv, 0, 0, W, H);
};

/* ---------- 环境粒子 ---------- */
function sprite(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); return cv; }
const SPR = {};
function glowDot(col, r) { const k = col + r; return SPR[k] || (SPR[k] = sprite(r * 2, r * 2, (x, w) => { x.fillStyle = U.rg(x, r, r, 0, r, [[0, '#fff'], [0.18, col], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, w, w); })); }
function lanternSpr() { return SPR.lan || (SPR.lan = sprite(64, 84, (x) => {
  x.fillStyle = U.rg(x, 32, 44, 0, 32, [[0, 'rgba(255,200,110,0.55)'], [1, 'rgba(255,150,60,0)']]); x.fillRect(0, 0, 64, 84);
  x.beginPath(); x.moveTo(21, 26); x.quadraticCurveTo(19, 52, 24, 60); x.lineTo(40, 60); x.quadraticCurveTo(45, 52, 43, 26); x.quadraticCurveTo(32, 20, 21, 26); x.closePath();
  x.fillStyle = U.lg(x, 0, 24, 0, 60, [[0, '#ffe3a0'], [0.5, '#ff9a4a'], [1, '#e2552e']]); x.fill(); x.strokeStyle = 'rgba(160,50,20,0.7)'; x.lineWidth = 1.2; x.stroke();
  x.strokeStyle = 'rgba(150,50,20,0.35)'; x.beginPath(); x.moveTo(32, 23); x.lineTo(32, 60); x.moveTo(26, 25); x.quadraticCurveTo(24, 44, 28, 60); x.moveTo(38, 25); x.quadraticCurveTo(40, 44, 36, 60); x.stroke();
  x.fillStyle = 'rgba(255,255,230,0.9)'; U.E(x, 32, 54, 3, 2); x.fill(); })); }
function petalSpr(col) { const k = 'p' + col; return SPR[k] || (SPR[k] = sprite(24, 18, (x) => { x.translate(12, 9); x.beginPath(); x.moveTo(-10, 0); x.bezierCurveTo(-6, -8, 6, -8, 10, -2); x.lineTo(7, 0); x.lineTo(10, 2); x.bezierCurveTo(6, 8, -6, 8, -10, 0); x.closePath();
  x.fillStyle = U.lg(x, -10, 0, 10, 0, [[0, '#fff4f7'], [1, col]]); x.fill(); x.strokeStyle = 'rgba(220,110,150,0.5)'; x.lineWidth = 0.8; x.stroke(); })); }
function leafSpr(col) { const k = 'l' + col; return SPR[k] || (SPR[k] = sprite(26, 16, (x) => { x.translate(13, 8); x.beginPath(); x.moveTo(-11, 0); x.quadraticCurveTo(0, -9, 11, 0); x.quadraticCurveTo(0, 9, -11, 0); x.fillStyle = col; x.fill(); x.strokeStyle = 'rgba(90,50,10,0.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-10, 0); x.lineTo(10, 0); x.stroke(); })); }
const KIND = {
  petals: { n: 22, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H; p.vx = 18 + Math.random() * 26; p.vy = 22 + Math.random() * 26; p.spr = petalSpr(Math.random() < 0.5 ? '#ffb6cc' : '#ffcfe0'); } },
  leaves: { n: 12, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H; p.vx = 22 + Math.random() * 20; p.vy = 30 + Math.random() * 24; p.spr = leafSpr(['#e8a33a', '#d9772e', '#f2c24d'][(Math.random() * 3) | 0]); } },
  snow: { n: 46, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H; p.vx = -6 + Math.random() * 12; p.vy = 26 + Math.random() * 30; p.r = 1.4 + Math.random() * 2.4; } },
  lanterns: { n: 7, make: (p, W, H, init) => { p.x = Math.random() * W; p.y = init ? H * (0.1 + Math.random() * 0.7) : H + 40; p.vx = 4 + Math.random() * 6; p.vy = -(10 + Math.random() * 10); p.z = 0.35 + Math.random() * 0.6; } },
  fireflies: { n: 16, make: (p, W, H) => { p.x = Math.random() * W; p.y = H * (0.35 + Math.random() * 0.6); p.vx = 0; p.vy = 0; } },
  dust: { n: 24, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H * 0.9; p.vx = 3 + Math.random() * 6; p.vy = -2 + Math.random() * 5; } },
  gold: { n: 14, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H * 0.85; p.vx = 0; p.vy = 6 + Math.random() * 8; } },
  embers: { n: 30, make: (p, W, H, init) => { p.x = Math.random() * W; p.y = init ? Math.random() * H : H + 10; p.vx = -10 + Math.random() * 20; p.vy = -(50 + Math.random() * 70); } },
  wisps: { n: 8, make: (p, W, H) => { p.x = Math.random() * W; p.y = H * (0.2 + Math.random() * 0.6); p.vx = 0; p.vy = -6; } },
  stars: { n: 26, make: (p, W, H) => { p.x = Math.random() * W; p.y = Math.random() * H * 0.5; p.vx = 0; p.vy = 0; } },
  glints: { n: 16, make: (p, W, H) => { p.x = Math.random() * W; p.y = H * (0.5 + Math.random() * 0.3); p.vx = 0; p.vy = 0; } },
  bubbles: { n: 12, make: (p, W, H, init) => { p.x = Math.random() * W; p.y = init ? Math.random() * H : H + 20; p.vx = 0; p.vy = -(18 + Math.random() * 20); p.r = 4 + Math.random() * 8; } },
  steam: { n: 8, make: (p, W, H, init) => { p.x = W * (0.05 + Math.random() * 0.3); p.y = init ? H * (0.3 + Math.random() * 0.4) : H * 0.7; p.vx = 4; p.vy = -(14 + Math.random() * 10); } },
  incense: { n: 7, make: (p, W, H, init) => { p.x = W * (0.3 + Math.random() * 0.4); p.y = init ? H * (0.2 + Math.random() * 0.4) : H * 0.62; p.vx = 2; p.vy = -(9 + Math.random() * 6); } },
};
let field = null;
function makeField(name, W, H) {
  const kind = (MOOD[name] || [])[1], K = KIND[kind]; if (!K) return { name, W, H, list: [] };
  const n = Math.round(K.n * (FX.reduced() ? 0.35 : 1) * Math.min(1.3, Math.max(0.6, W * H / (1280 * 720)))), list = [];
  for (let i = 0; i < n; i++) { const p = { ph: Math.random() * TAU, z: 0.45 + Math.random() * 0.95, life: Math.random() }; K.make(p, W, H, true); list.push(p); }
  return { name, kind, W, H, list };
}
function step(f, dt, t) {
  const K = KIND[f.kind], W = f.W, H = f.H, sl = FX.reduced() ? 0.45 : 1;
  for (const p of f.list) {
    const z = p.z;
    if (f.kind === 'fireflies') { p.x += Math.cos(t * 0.6 + p.ph) * 14 * dt * sl; p.y += Math.sin(t * 0.8 + p.ph * 1.3) * 10 * dt * sl; }
    else if (f.kind === 'wisps') { p.x += Math.sin(t * 0.7 + p.ph) * 12 * dt * sl; p.y += p.vy * dt * sl; if (p.y < H * 0.1) { K.make(p, W, H); p.y = H * 0.8; } }
    else { const sway = (f.kind === 'petals' || f.kind === 'leaves' || f.kind === 'snow') ? Math.sin(t * 1.3 + p.ph) * 18 : 0;
      p.x += (p.vx * z + sway * 0.6) * dt * sl; p.y += p.vy * z * dt * sl; }
    if (p.y > H + 30 || p.x > W + 40 || p.x < -40 || p.y < -60) { K.make(p, W, H, false); if (p.vy > 0) { p.y = -20; p.x = Math.random() * W * 1.1 - W * 0.1; } }
  }
}
function drawP(c, f, t, front) {
  const H = f.H, s = Math.max(0.6, H / 800), kd = f.kind;
  for (const p of f.list) {
    const isFront = p.z > 1.15; if (isFront !== front) continue;
    const z = p.z, a = front ? 0.75 : Math.min(1, 0.45 + z * 0.4);
    c.globalAlpha = a;
    if (kd === 'petals' || kd === 'leaves') { c.save(); c.translate(p.x, p.y); c.rotate(t * 1.2 + p.ph); c.scale(z * s * Math.cos(t * 2 + p.ph * 2), z * s); c.drawImage(p.spr, -12, -8); c.restore(); }
    else if (kd === 'snow') { c.fillStyle = '#fff'; U.E(c, p.x, p.y, p.r * z * s, p.r * z * s); c.fill(); }
    else if (kd === 'lanterns') { const fl = 0.85 + Math.sin(t * 9 + p.ph) * 0.08 + Math.sin(t * 5.3 + p.ph) * 0.07; c.globalAlpha = Math.min(1, z + 0.2) * fl; const k = z * s * 0.9; c.drawImage(lanternSpr(), p.x - 32 * k, p.y - 42 * k, 64 * k, 84 * k); }
    else if (kd === 'fireflies') { const b = 0.5 + 0.5 * Math.sin(t * 2.6 + p.ph * 3); c.globalAlpha = b * 0.9; const r = 9 * z * s; c.drawImage(glowDot('rgba(220,255,140,0.7)', 16), p.x - r, p.y - r, r * 2, r * 2); }
    else if (kd === 'dust' || kd === 'gold') { const b = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.9 + p.ph)); c.globalAlpha = b * (kd === 'gold' ? 0.9 : 0.55); const r = (kd === 'gold' ? 3.2 : 2.6) * z * s;
      if (kd === 'gold' && b > 0.85) U.sparkle(c, p.x, p.y, r * 2.2, '#fff6c0'); else c.drawImage(glowDot(kd === 'gold' ? 'rgba(255,214,110,0.9)' : 'rgba(255,240,210,0.8)', 12), p.x - r * 2, p.y - r * 2, r * 4, r * 4); }
    else if (kd === 'embers') { const r = 3 * z * s; c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 12 + p.ph); c.drawImage(glowDot('rgba(255,140,40,0.9)', 12), p.x - r * 2, p.y - r * 2, r * 4, r * 4); }
    else if (kd === 'wisps') { const r = 16 * z * s, fl = 1 + Math.sin(t * 6 + p.ph) * 0.12; c.globalAlpha = 0.55 + Math.sin(t * 2 + p.ph) * 0.2; c.drawImage(glowDot('rgba(150,200,255,0.75)', 24), p.x - r, p.y - r * fl * 1.3, r * 2, r * 2.6 * fl); }
    else if (kd === 'stars' || kd === 'glints') { const b = Math.max(0, Math.sin(t * (kd === 'glints' ? 2.4 : 1.4) + p.ph * 4)); if (b < 0.2) continue; c.globalAlpha = b; U.sparkle(c, p.x, p.y, (kd === 'glints' ? 4 : 3.4) * z * s * (0.6 + b * 0.6), '#fffbe6'); }
    else if (kd === 'bubbles') { const r = p.r * z * s; c.globalAlpha = 0.55; U.E(c, p.x + Math.sin(t * 2 + p.ph) * 6, p.y, r, r); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.2; c.stroke(); c.fillStyle = 'rgba(200,230,255,0.18)'; c.fill(); U.E(c, p.x + Math.sin(t * 2 + p.ph) * 6 - r * 0.35, p.y - r * 0.35, r * 0.25, r * 0.18); c.fillStyle = '#fff'; c.fill(); }
    else if (kd === 'steam' || kd === 'incense') { const k = Math.max(0, Math.min(1, (H * 0.7 - p.y) / (H * 0.5))), r = (14 + k * 34) * s; c.globalAlpha = (1 - k) * (kd === 'incense' ? 0.22 : 0.28); c.drawImage(glowDot(kd === 'incense' ? 'rgba(220,210,255,0.7)' : 'rgba(255,255,255,0.8)', 24), p.x + Math.sin(t + p.ph) * 10 - r, p.y - r, r * 2, r * 2); }
  }
  c.globalAlpha = 1;
}
const fields = {};
FX.ambient = function (c, name, W, H, t, dt, front, slot) {
  try {
    slot = slot || 'stage'; let field = fields[slot];
    if (!field || field.name !== name || Math.abs(field.W - W) > 2 || Math.abs(field.H - H) > 2) field = fields[slot] = makeField(name, W, H);
    if (!field.list.length) return;
    if (!front) { if (dt == null) dt = field.lt != null ? Math.min(0.05, Math.max(0, t - field.lt)) : 0; field.lt = t; step(field, dt || 0, t); }
    c.save(); drawP(c, field, t, !!front); c.restore();
  } catch (e) { /* 特效失败不影响游戏 */ }
};
// 画布小游戏通用质感：背景画完后 back，最后 front + 暗角（slot 独立，不和主舞台的粒子打架）
FX.miniBack = (c, name, W, H, t) => FX.ambient(c, name, W, H, t, null, false, 'mg');
FX.miniFront = (c, name, W, H, t) => { FX.ambient(c, name, W, H, t, 0, true, 'mg'); FX.post(c, name, W, H); };

/* ---------- 平滑抖屏（trauma²，正弦合成，不是每帧随机） ---------- */
FX.shakeOffset = function (amt, t) {
  if (FX.reduced() || amt <= 0) return [0, 0];
  const k = amt * amt * (P.G && P.G.meta && P.G.meta.settings && P.G.meta.settings.shake === false ? 0 : 1);
  return [k * 14 * (0.6 * Math.sin(t * 47) + 0.4 * Math.sin(t * 89 + 1.3)), k * 10 * (0.6 * Math.sin(t * 53 + 0.7) + 0.4 * Math.sin(t * 97 + 2.1))];
};

/* ---------- DOM 打击感 ---------- */
let lastPt = null;
document.addEventListener('pointerdown', e => { lastPt = { x: e.clientX, y: e.clientY, t: performance.now() }; }, true);
FX.burstAt = function (x, y, kind) {
  if (FX.reduced()) return;
  const host = document.getElementById('app') || document.body, r = host.getBoundingClientRect();
  const n = kind === 'big' ? 14 : 8, wrap = document.createElement('div'); wrap.className = 'fxburst ' + (kind || '');
  wrap.style.left = (x - r.left) + 'px'; wrap.style.top = (y - r.top) + 'px';
  for (let i = 0; i < n; i++) { const s = document.createElement('i'), a = (i / n) * TAU + Math.random() * 0.4, d = 34 + Math.random() * (kind === 'big' ? 60 : 34);
    s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px'); s.style.setProperty('--dy', (Math.sin(a) * d - 10).toFixed(1) + 'px'); s.style.animationDelay = (Math.random() * 40) + 'ms'; wrap.appendChild(s); }
  host.appendChild(wrap); setTimeout(() => wrap.remove(), 800);
};
FX.shakeEl = function (el, cls) { if (!el || FX.reduced()) return; el.classList.remove(cls || 'fxshake'); void el.offsetWidth; el.classList.add(cls || 'fxshake'); setTimeout(() => el.classList.remove(cls || 'fxshake'), 420); };
FX.flash = function (col) { const f = document.createElement('div'); f.className = 'fxflash'; if (col) f.style.background = col; (document.getElementById('app') || document.body).appendChild(f); setTimeout(() => f.remove(), 450); };
const GOOD = { ding: 'big', coin: '', pop: '', sparkle: 'big' }, BAD = { buzz: 1, spill: 1, slip: 1 };
FX.onSfx = function (name) {
  try {
    const go = document.getElementById('gameOv'); if (!go || !go.classList.contains('show')) return;
    const pt = lastPt && performance.now() - lastPt.t < 900 ? lastPt : null;
    if (GOOD[name] != null && pt) FX.burstAt(pt.x, pt.y, GOOD[name]);
    else if (BAD[name]) { FX.shakeEl(go, 'fxshake'); FX.flash('rgba(220,40,40,0.22)'); if (navigator.vibrate) try { navigator.vibrate(25); } catch (e) {} }
  } catch (e) {}
};
})(window.PALACE = window.PALACE || {});
