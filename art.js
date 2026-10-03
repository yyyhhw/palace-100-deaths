/* art.js —— 角色美术（全部由 Canvas 2D 代码绘制，无外部图片）
   Q 版 2.5 头身，分层绘制：后发 / 披帛 / 身体 / 衣服 / 头 / 五官 / 刘海 / 发髻 / 发饰 / 情绪特效。
   坐标：角色以脚底中心为原点，向上为负，总高约 300 单位。 */
(function (P) {
'use strict';
const TAU = Math.PI * 2, OL = '#4a2a2a';
const A = P.ART = P.ART || {};

function E(c, x, y, rx, ry, r) { c.beginPath(); c.ellipse(x, y, Math.abs(rx), Math.abs(ry), r || 0, 0, TAU); }
function F(c, fill, stroke, lw) { if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 3; c.stroke(); } }
function L(c, pts, close) { c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); if (close) c.closePath(); }
function rr(c, x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function lg(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; }
function rg(c, x, y, r0, r1, stops) { const g = c.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; }
function shade(hex, k) {
  if (!hex || hex[0] !== '#') return hex;
  let n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return '#' + ((1 << 24) | (f(r) << 16) | (f(g) << 8) | f(b)).toString(16).slice(1);
}
function flower(c, x, y, r, col, center, petals) {
  petals = petals || 5; c.save(); c.translate(x, y);
  for (let i = 0; i < petals; i++) { c.save(); c.rotate(i * TAU / petals); E(c, 0, -r * 0.62, r * 0.48, r * 0.62); F(c, col, shade(col, -0.35), Math.max(0.8, r * 0.12)); c.restore(); }
  E(c, 0, 0, r * 0.3, r * 0.3); F(c, center || '#ffe08a');
  c.restore();
}
function star(c, x, y, r, col) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } c.closePath(); F(c, col); }
function sparkle(c, x, y, r, col) { c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); F(c, col || '#fff'); }
function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(0, 3); c.bezierCurveTo(-8, -3, -4, -10, 0, -5); c.bezierCurveTo(4, -10, 8, -3, 0, 3); F(c, col || '#ff6b8a'); c.restore(); }
A.util = { E, F, L, rr, lg, rg, shade, flower, star, sparkle, heart, OL, TAU };

/* ---------- 角色设定 ---------- */
const CH = A.CH = {
  me: { name: '我', skin: '#ffe6d8', hair: '#2d1f33', eye: '#7a4a9a', back: 'long', bangs: 'airy', buns: 'double', ribbon: '#ef6f93',
    outer: '#f9b9cb', inner: '#fffaf4', skirt: '#fcd6e1', skirt2: '#f39bb6', trim: '#e2577e', sash: '#b83b3b', pattern: 'sakura', shawl: '#ffd9e6',
    orn: ['buyao', 'flowerL', 'pearls'] },
  modern: { name: '我', skin: '#ffe6d8', hair: '#2d1f33', eye: '#7a4a9a', back: 'short', bangs: 'airy', buns: 'messy', body: 'modern',
    outer: '#a8d3ef', inner: '#ffffff', trim: '#6aa6cf', orn: [] },
  xiaotao: { name: '小桃', skin: '#ffe9dc', hair: '#5a3424', eye: '#8a4b2a', back: 'short', bangs: 'full', buns: 'side2', ribbon: '#57b08f',
    outer: '#97d6bf', inner: '#ffffff', skirt: '#cdeee0', skirt2: '#8fd0b8', trim: '#3f9a7c', sash: '#f4a6b8', pattern: 'dots', freckle: true, orn: ['peach'] },
  mengpo: { name: '孟婆', skin: '#f6e2d6', hair: '#e0dbe8', eye: '#5a4a7a', back: 'none', bangs: 'old', buns: 'old', hood: '#6f58a3', old: true, eyesDefault: 'squint',
    outer: '#715c9e', inner: '#efe6ff', skirt: '#9a86c6', skirt2: '#6d5a99', trim: '#cbb9f2', sash: '#3e3060', pattern: 'clouds', pose: 'hold', prop: 'soup', orn: ['beads'] },
  guimama: { name: '桂嬷嬷', skin: '#f6dfcf', hair: '#3b3030', eye: '#4a3a30', back: 'none', bangs: 'slick', buns: 'tight', old: true, eyesDefault: 'stern', mole: true,
    outer: '#86604b', inner: '#f7ecdb', skirt: '#9b7660', skirt2: '#5f4434', trim: '#d1ad6c', sash: '#4a3226', pattern: 'lines', pose: 'ruler', prop: 'ruler', orn: ['headband', 'pinWood'] },
  zhao: { name: '赵如意', skin: '#ffe6da', hair: '#271827', eye: '#a0326a', back: 'long', bangs: 'side', buns: 'high', ribbon: '#8a4fb0', eyesDefault: 'sly',
    outer: '#cfa8e6', inner: '#fffaff', skirt: '#ead4f6', skirt2: '#bf93dc', trim: '#8a4fb0', sash: '#5b2f7a', pattern: 'dots', pose: 'fan', prop: 'fan', orn: ['camellia', 'pinGold'] },
  guifei: { name: '华贵妃', skin: '#fff0e6', hair: '#1c1220', eye: '#c0392b', back: 'long', bangs: 'part', buns: 'grand', eyesDefault: 'proud', lips: '#e0344a',
    outer: '#d9343f', inner: '#fff1c4', skirt: '#f7b84a', skirt2: '#e2702e', trim: '#f2c24d', sash: '#8a1f2b', pattern: 'peony', shawl: '#ffd77a', pose: 'fan', prop: 'fanGold',
    orn: ['peony', 'phoenix', 'tassels'] },
  emperor: { name: '皇上', skin: '#ffe8da', hair: '#1a1420', eye: '#4a3020', back: 'male', bangs: 'male', buns: 'topknot', male: true, browDefault: 'furrow',
    outer: '#f4c430', inner: '#fff6dc', skirt: '#f4c430', skirt2: '#e0a020', trim: '#3a6db5', sash: '#b83b3b', pattern: 'dragon', orn: ['crown'] },
  gao: { name: '高公公', skin: '#fde4d2', hair: '#3a2c2c', eye: '#3a2a2a', back: 'none', bangs: 'none', buns: 'none', hat: 'eunuch', male: true, plump: true, eyesDefault: 'squint',
    outer: '#a73a4e', inner: '#fff3e8', skirt: '#a73a4e', skirt2: '#7d2638', trim: '#e8b84a', sash: '#3a2a3a', pattern: 'badge', pose: 'whisk', prop: 'whisk', orn: [] },
  xiaoan: { name: '小安子', skin: '#ffe6d6', hair: '#3a2a22', eye: '#5a3a22', back: 'none', bangs: 'none', buns: 'none', hat: 'cap', male: true, freckle: true,
    outer: '#5f8fcf', inner: '#ffffff', skirt: '#5f8fcf', skirt2: '#3f6aa6', trim: '#f2c24d', sash: '#2c3e66', pattern: 'none', pose: 'hold', prop: 'plate', orn: [] },
  taijian: { name: '小太监', skin: '#ffe6d6', hair: '#3a2a22', eye: '#4a3a2a', back: 'none', bangs: 'none', buns: 'none', hat: 'cap', male: true,
    outer: '#6f7fa8', inner: '#ffffff', skirt: '#6f7fa8', skirt2: '#4c5a80', trim: '#c9d3ee', sash: '#2c3350', pattern: 'none', pose: 'scroll', prop: 'scroll', orn: [] },
  guard: { name: '侍卫', skin: '#f9dcc8', hair: '#221a1a', eye: '#2a2020', back: 'none', bangs: 'none', buns: 'none', hat: 'helmet', male: true, browDefault: 'angry',
    outer: '#5d6f86', inner: '#e8eef5', skirt: '#4a5a70', skirt2: '#36445a', trim: '#c9a24d', sash: '#8a2b2b', pattern: 'armor', pose: 'spear', prop: 'spear', orn: [] },
  taihou: { name: '太后', skin: '#f7e3d6', hair: '#d3cccc', eye: '#5a4030', back: 'none', bangs: 'old', buns: 'grand2', old: true, glasses: true, eyesDefault: 'kind',
    outer: '#b07d3a', inner: '#fff4dc', skirt: '#c9995a', skirt2: '#8e6128', trim: '#6b3f1c', sash: '#6b3f1c', pattern: 'clouds', pose: 'beads', prop: 'beads', orn: ['phoenixOld'] },
  yuanzhu: { name: '原主', skin: '#fff0ea', hair: '#2d1f33', eye: '#4f6aa0', back: 'long', bangs: 'airy', buns: 'double', ribbon: '#9fb4e6',
    outer: '#dbe6fa', inner: '#ffffff', skirt: '#eef3ff', skirt2: '#bccbee', trim: '#7d93c9', sash: '#5a6fa8', pattern: 'clouds', orn: ['flowerL'] },
};
const GHOST = { skin: '#f4f8ff', hair: '#c9d4ee', eye: '#7a8fbf', outer: '#f2f6ff', inner: '#ffffff', skirt: '#eef3ff', skirt2: '#dfe7fb', trim: '#c4d1f0', sash: '#d6def5', ribbon: '#d6e0f7' };
const STONE = { skin: '#c9c6c2', hair: '#8f8a86', eye: '#6d6a66', outer: '#b5b1ac', inner: '#d8d5d1', skirt: '#bdb9b4', skirt2: '#99958f', trim: '#8a8681', sash: '#8e8a85', ribbon: '#a5a19c', shawl: '#c8c4bf', lips: '#9a9692' };

/* ---------- 表情（每个角色通用 12 种差分） ---------- */
const FACES = A.FACES = {
  normal: { eyes: 'open', brow: 'soft', mouth: 'smile' },
  smile: { eyes: 'happy', brow: 'soft', mouth: 'grin' },
  angry: { eyes: 'angry', brow: 'angry', mouth: 'grit', fx: ['vein'] },
  shock: { eyes: 'shock', brow: 'up', mouth: 'O', fx: ['gloom', 'sweat'] },
  cry: { eyes: 'cry', brow: 'worry', mouth: 'wail', fx: ['tears'] },
  smirk: { eyes: 'half', brow: 'raise', mouth: 'smirk', fx: ['glint'] },
  panic: { eyes: 'spiral', brow: 'worry', mouth: 'wavy', fx: ['sweat', 'sweat2'] },
  blush: { eyes: 'open', look: 1, brow: 'worry', mouth: 'small', fx: ['blushX', 'hearts'] },
  sleepy: { eyes: 'sleepy', brow: 'soft', mouth: 'small', fx: ['zzz'] },
  dead: { eyes: 'x', brow: 'none', mouth: 'wavy' },
  think: { eyes: 'open', look: -1, lookY: -1, brow: 'worry', mouth: 'flat', fx: ['dots'] },
  star: { eyes: 'star', brow: 'up', mouth: 'grin', fx: ['sparkles'] },
  sweat: { eyes: 'happy', brow: 'worry', mouth: 'grinSweat', fx: ['sweat'] },
};

const OPENISH = ['open', 'half', 'shock', 'star', 'sly', 'proud', 'stern', 'kind', 'angry'];
function drawEye(c, x, y, side, mode, sp, look, lookY, blink) {
  const dark = '#2a1622';
  if (blink && OPENISH.includes(mode)) mode = 'closed';
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  if (OPENISH.includes(mode)) {
    let rx = 12.5, ry = 15.5;
    if (mode === 'stern') { rx = 11; ry = 9.5; }
    if (mode === 'kind') { rx = 10; ry = 11; }
    if (mode === 'sly' || mode === 'proud') { rx = 13; ry = 13.5; }
    E(c, x, y, rx, ry); F(c, '#fff');
    c.save(); E(c, x, y, rx, ry); c.clip();
    const ix = x + (look || 0) * 4, iy = y + 2 + (lookY || 0) * 4;
    if (mode === 'shock') { E(c, ix, iy, 5, 6); F(c, dark); E(c, ix - 1.5, iy - 2, 1.6, 1.6); F(c, '#fff'); }
    else {
      E(c, ix, iy, rx - 2, ry - 1.5); F(c, lg(c, ix, iy - ry, ix, iy + ry, [[0, shade(sp.eye, -0.6)], [0.5, sp.eye], [1, shade(sp.eye, 0.5)]]));
      E(c, ix, iy + 1, (rx - 2) * 0.48, (ry - 1.5) * 0.5); F(c, shade(sp.eye, -0.72));
      E(c, ix + 1, iy + ry * 0.55, rx * 0.55, ry * 0.25); F(c, 'rgba(255,255,255,0.3)');
      if (mode === 'star') { star(c, ix, iy, 7.5, '#fff8b0'); sparkle(c, ix - 5, iy - 7, 3.5); }
      else { E(c, ix - rx * 0.32, iy - ry * 0.4, rx * 0.34, ry * 0.3); F(c, '#fff'); E(c, ix + rx * 0.36, iy + ry * 0.28, rx * 0.15, rx * 0.15); F(c, '#fff'); }
    }
    const lid = mode === 'half' || mode === 'angry' || mode === 'sly' || mode === 'proud';
    let ly0 = 0, ly1 = 0;
    if (lid) {
      const tilt = mode === 'angry' ? 7 : mode === 'half' ? 0 : -3;
      ly0 = y - ry * (mode === 'half' ? 0.05 : 0.3) - side * tilt; ly1 = y - ry * (mode === 'half' ? 0.05 : 0.3) + side * tilt;
      c.fillStyle = sp.skin; c.beginPath(); c.moveTo(x - rx - 3, y - ry - 3); c.lineTo(x + rx + 3, y - ry - 3); c.lineTo(x + rx + 3, side > 0 ? ly1 : ly0); c.lineTo(x - rx - 3, side > 0 ? ly0 : ly1); c.closePath(); c.fill();
    }
    c.restore();
    c.strokeStyle = dark;
    if (lid) {
      c.lineWidth = 4.5; c.beginPath(); c.moveTo(x - rx - 1, side > 0 ? ly0 : ly1); c.lineTo(x + rx + 1, side > 0 ? ly1 : ly0); c.stroke();
      if (!sp.male) { c.lineWidth = 3; c.beginPath(); const ox = x + side * (rx + 1), oy = side > 0 ? ly1 : ly1; c.moveTo(ox, oy); c.lineTo(ox + side * 6, oy - 5); c.stroke(); }
      c.lineWidth = 1.6; c.beginPath(); c.ellipse(x, y + 1, rx - 1, ry - 1, 0, Math.PI * 0.3, Math.PI * 0.7); c.stroke();
    } else if (mode === 'stern') {
      c.lineWidth = 4; c.beginPath(); c.moveTo(x - rx - 1, y - ry + 2 + side * 2); c.lineTo(x + rx + 1, y - ry + 2 - side * 2); c.stroke();
    } else {
      c.lineWidth = mode === 'kind' ? 3 : 4.5; c.beginPath(); c.ellipse(x, y, rx + 0.5, ry + 0.5, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
      if (!sp.male && mode !== 'shock') { c.lineWidth = 3; c.beginPath(); const ox = x + side * (rx * 0.92), oy = y - ry * 0.45; c.moveTo(ox, oy); c.quadraticCurveTo(ox + side * 5, oy - 3, ox + side * 7, oy - 7); c.stroke(); c.beginPath(); c.moveTo(ox - side * 1, oy + 4); c.lineTo(ox + side * 6, oy + 1); c.stroke(); }
      c.lineWidth = 1.6; c.beginPath(); c.ellipse(x, y + 1, rx - 1, ry - 1, 0, Math.PI * 0.3, Math.PI * 0.7); c.stroke();
    }
  } else if (mode === 'happy' || mode === 'squint') {
    c.strokeStyle = dark; c.lineWidth = mode === 'squint' ? 3.5 : 4.5;
    c.beginPath(); c.moveTo(x - 11, y + 4); c.quadraticCurveTo(x, y - 12, x + 11, y + 4); c.stroke();
    if (!sp.male) { c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + side * 11, y + 2); c.lineTo(x + side * 15, y - 2); c.stroke(); }
  } else if (mode === 'closed' || mode === 'sleepy') {
    c.strokeStyle = dark; c.lineWidth = 4;
    c.beginPath(); c.moveTo(x - 12, y - 1); c.quadraticCurveTo(x, y + 7, x + 12, y - 1); c.stroke();
    if (!sp.male) { c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + side * 11, y); c.lineTo(x + side * 15, y + 3); c.stroke(); }
  } else if (mode === 'cry') {
    c.strokeStyle = dark; c.lineWidth = 4.5;
    c.beginPath(); c.moveTo(x - side * 11, y - 7); c.lineTo(x + side * 7, y); c.lineTo(x - side * 11, y + 7); c.stroke();
  } else if (mode === 'x') {
    c.strokeStyle = dark; c.lineWidth = 4.5;
    c.beginPath(); c.moveTo(x - 9, y - 9); c.lineTo(x + 9, y + 9); c.moveTo(x + 9, y - 9); c.lineTo(x - 9, y + 9); c.stroke();
  } else if (mode === 'spiral') {
    E(c, x, y, 13, 14); F(c, '#fff', dark, 2.5);
    c.strokeStyle = dark; c.lineWidth = 2.2; c.beginPath();
    for (let a = 0; a < TAU * 2.4; a += 0.2) { const r = 1 + a * 1.5; c.lineTo(x + Math.cos(a * side) * r, y + Math.sin(a * side) * r); } c.stroke();
  }
  c.restore();
}
function drawBrow(c, sp, mode) {
  if (mode === 'none') return;
  c.save(); c.strokeStyle = shade(sp.hair, -0.25); c.lineWidth = 4; c.lineCap = 'round';
  const y = -226;
  const P2 = {
    soft: [[-32, y + 2, -22, y - 3, -12, y], [12, y, 22, y - 3, 32, y + 2]],
    angry: [[-34, y - 6, -22, y - 2, -10, y + 6], [10, y + 6, 22, y - 2, 34, y - 6]],
    worry: [[-34, y + 3, -22, y - 2, -10, y - 7], [10, y - 7, 22, y - 2, 34, y + 3]],
    up: [[-33, y - 6, -22, y - 12, -11, y - 7], [11, y - 7, 22, y - 12, 33, y - 6]],
    raise: [[-33, y + 1, -22, y - 1, -11, y + 2], [11, y - 8, 22, y - 14, 33, y - 8]],
    furrow: [[-34, y - 4, -22, y - 3, -10, y + 3], [10, y + 3, 22, y - 3, 34, y - 4]],
  };
  (P2[mode] || P2.soft).forEach(p => { c.beginPath(); c.moveTo(p[0], p[1]); c.quadraticCurveTo(p[2], p[3], p[4], p[5]); c.stroke(); });
  c.restore();
}
function drawMouth(c, sp, mode, talk) {
  const y = -170, dark = '#5a2230', lip = sp.lips || '#e86b7e';
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = dark; c.lineWidth = 3;
  if (talk && ['smile', 'small', 'flat', 'smirk'].includes(mode)) mode = 'talk';
  switch (mode) {
    case 'smile': c.beginPath(); c.moveTo(-7, y - 1); c.quadraticCurveTo(0, y + 6, 7, y - 1); c.stroke(); break;
    case 'small': E(c, 0, y, 3, 2.2); F(c, lip, dark, 2); break;
    case 'flat': c.beginPath(); c.moveTo(-6, y); c.lineTo(6, y); c.stroke(); break;
    case 'talk': c.beginPath(); c.moveTo(-7, y - 2); c.quadraticCurveTo(0, y + 10, 7, y - 2); c.closePath(); F(c, '#b8424f', dark, 2.5); E(c, 0, y + 3, 3.5, 2); F(c, '#ff8b98'); break;
    case 'grin': case 'grinSweat':
      c.beginPath(); c.moveTo(-11, y - 4); c.quadraticCurveTo(0, y - 2, 11, y - 4); c.quadraticCurveTo(0, y + 16, -11, y - 4); F(c, '#b8424f', dark, 2.5);
      c.save(); c.clip(); E(c, 0, y + 9, 7, 5); F(c, '#ff8b98'); c.fillStyle = '#fff'; c.fillRect(-10, y - 5, 20, 4); c.restore(); break;
    case 'grit': rr(c, -10, y - 4, 20, 10, 4); F(c, '#fff', dark, 2.5); c.beginPath(); c.moveTo(-10, y + 1); c.lineTo(10, y + 1); for (let i = -5; i <= 5; i += 5) { c.moveTo(i, y - 4); c.lineTo(i, y + 6); } c.lineWidth = 1.5; c.stroke(); break;
    case 'O': E(c, 0, y + 2, 7, 9); F(c, '#8a2c3a', dark, 2.5); E(c, 0, y + 6, 4, 3); F(c, '#ff8b98'); break;
    case 'wail': c.beginPath(); c.moveTo(-12, y + 6); c.quadraticCurveTo(-6, y - 6, 0, y - 3); c.quadraticCurveTo(6, y - 6, 12, y + 6); c.quadraticCurveTo(0, y + 12, -12, y + 6); F(c, '#8a2c3a', dark, 2.5); break;
    case 'smirk': c.beginPath(); c.moveTo(-8, y + 1); c.quadraticCurveTo(2, y + 3, 10, y - 5); c.stroke(); c.lineWidth = 2; c.beginPath(); c.moveTo(9, y - 7); c.lineTo(12, y - 3); c.stroke(); break;
    case 'wavy': c.beginPath(); c.moveTo(-11, y); for (let i = 0; i <= 8; i++) c.lineTo(-11 + i * 2.75, y + (i % 2 ? -3 : 3)); c.stroke(); break;
  }
  c.restore();
}
function drawFaceFX(c, sp, fx, t) {
  (fx || []).forEach(f => {
    c.save();
    if (f === 'vein') { c.translate(38, -254); c.strokeStyle = '#e03a3a'; c.lineWidth = 3.5; c.lineCap = 'round';
      for (let i = 0; i < 4; i++) { c.save(); c.rotate(i * Math.PI / 2 + 0.78); c.beginPath(); c.moveTo(3, 3); c.quadraticCurveTo(9, 3, 9, 10); c.stroke(); c.restore(); } }
    if (f === 'gloom') { c.globalAlpha = 0.55; c.strokeStyle = '#5a6fd0'; c.lineWidth = 2.5; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 9, -246); c.lineTo(i * 9, -230 + Math.abs(i) * 3); c.stroke(); } }
    if (f === 'sweat' || f === 'sweat2') { const x = f === 'sweat' ? 54 : -56, y = (f === 'sweat' ? -224 : -212) + Math.sin(t * 6) * 2;
      c.beginPath(); c.moveTo(x, y - 12); c.quadraticCurveTo(x + 8, y + 2, x, y + 5); c.quadraticCurveTo(x - 8, y + 2, x, y - 12); F(c, '#bfe6ff', '#4a8fd0', 2); E(c, x - 2, y, 1.6, 3); F(c, '#fff'); }
    if (f === 'tears') { c.fillStyle = 'rgba(150,210,255,0.85)'; [-1, 1].forEach(s => { const ph = (t * 2.2) % 1; rr(c, s * 26 - 4, -188, 8, 26 + ph * 6, 4); c.fill(); E(c, s * 26, -160 + ph * 22, 4, 5); c.fill(); }); }
    if (f === 'glint') sparkle(c, 48, -238, 7 + Math.sin(t * 5) * 2, '#fff6b0');
    if (f === 'blushX') { E(c, -32, -181, 14, 7); F(c, 'rgba(255,110,140,0.5)'); E(c, 32, -181, 14, 7); F(c, 'rgba(255,110,140,0.5)'); }
    if (f === 'hearts') { heart(c, 56, -248 + Math.sin(t * 3) * 3, 1.4); heart(c, 70, -228 + Math.cos(t * 3) * 3, 1, '#ff9ab0'); }
    if (f === 'zzz') { c.fillStyle = '#7a8fd0'; const k = (t * 0.8) % 1; c.globalAlpha = 1 - k; c.font = 'bold 20px sans-serif'; c.fillText('z', 48 + k * 14, -244 - k * 26); c.font = 'bold 14px sans-serif'; c.fillText('z', 64 + k * 10, -266 - k * 18); }
    if (f === 'dots') { c.fillStyle = OL; const n = ((t * 2) | 0) % 4; for (let i = 0; i < n; i++) { E(c, 46 + i * 9, -252 - i * 6, 2.8, 2.8); c.fill(); } }
    if (f === 'sparkles') { for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; sparkle(c, Math.cos(a) * 72, -232 + Math.sin(a) * 30, 5 + (i % 2) * 3, '#fff3a0'); } }
    c.restore();
  });
}

/* ---------- 头发 ---------- */
function bangsPath(c, style) {
  c.beginPath();
  const top = () => { c.moveTo(-63, -196); c.bezierCurveTo(-72, -262, -30, -272, 0, -272); c.bezierCurveTo(30, -272, 72, -262, 63, -196); };
  if (style === 'airy' || style === 'full') {
    const tips = style === 'airy'
      ? [[47, -228], [40, -201], [27, -231], [15, -203], [3, -232], [-9, -205], [-21, -232], [-31, -202], [-45, -229], [-52, -199], [-63, -196]]
      : [[46, -214], [32, -207], [16, -213], [0, -207], [-16, -213], [-32, -207], [-46, -214], [-63, -198]];
    top();
    let q = [63, -196];
    for (const p of tips) { c.quadraticCurveTo((p[0] + q[0]) / 2 + 2, Math.min(p[1], q[1]) - 5, p[0], p[1]); q = p; }
    c.closePath();
  } else if (style === 'side') {
    top(); c.quadraticCurveTo(54, -232, 30, -240); c.quadraticCurveTo(0, -216, -36, -205); c.quadraticCurveTo(-52, -198, -63, -192); c.closePath();
  } else if (style === 'male') {
    top(); const tips = [[50, -222], [42, -214], [30, -230], [18, -212], [8, -236], [-4, -214], [-16, -238], [-28, -216], [-40, -232], [-52, -210], [-63, -196]];
    let q = [63, -196]; for (const p of tips) { c.quadraticCurveTo((p[0] + q[0]) / 2 - 3, Math.min(p[1], q[1]) - 4, p[0], p[1]); q = p; } c.closePath();
  } else if (style === 'part') {
    top(); c.quadraticCurveTo(56, -228, 30, -236); c.quadraticCurveTo(10, -242, 3, -258); c.quadraticCurveTo(-6, -240, -28, -234); c.quadraticCurveTo(-56, -226, -63, -196); c.closePath();
  } else { // old / slick
    c.moveTo(-62, -200); c.bezierCurveTo(-70, -262, -30, -268, 0, -268); c.bezierCurveTo(30, -268, 70, -262, 62, -200);
    c.quadraticCurveTo(58, -236, 22, -244); c.quadraticCurveTo(0, -248, -22, -244); c.quadraticCurveTo(-58, -236, -62, -200); c.closePath();
  }
}
function drawHairBack(c, sp, t) {
  const h = sp.hair;
  if (sp.back === 'long') {
    c.beginPath(); c.moveTo(-64, -222);
    c.bezierCurveTo(-80, -170, -70, -126, -62 + Math.sin(t * 1.3) * 2, -100);
    c.quadraticCurveTo(-50, -90, -40, -104); c.quadraticCurveTo(0, -96, 40, -104); c.quadraticCurveTo(50, -90, 62 + Math.sin(t * 1.3 + 1) * 2, -100);
    c.bezierCurveTo(70, -126, 80, -170, 64, -222); c.closePath();
    F(c, lg(c, 0, -220, 0, -90, [[0, h], [1, shade(h, 0.14)]]), OL, 3);
    c.strokeStyle = shade(h, 0.28); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-52, -170); c.quadraticCurveTo(-58, -130, -54, -104); c.moveTo(52, -170); c.quadraticCurveTo(58, -130, 54, -104); c.stroke();
  } else if (sp.back === 'short') {
    c.beginPath(); c.moveTo(-64, -220); c.bezierCurveTo(-80, -180, -72, -150, -56, -144); c.lineTo(56, -144); c.bezierCurveTo(72, -150, 80, -180, 64, -220); c.closePath(); F(c, h, OL, 3);
  } else if (sp.back === 'male') {
    c.beginPath(); c.moveTo(-62, -214); c.bezierCurveTo(-70, -180, -64, -160, -50, -150); c.lineTo(50, -150); c.bezierCurveTo(64, -160, 70, -180, 62, -214); c.closePath(); F(c, h, OL, 3);
  }
  E(c, 0, -214, 69, 62); F(c, h, OL, 3);
}
function drawHairFront(c, sp, t) {
  const h = sp.hair;
  if (sp.hat) { bangsPath(c, 'slick'); F(c, h, OL, 3); return; }
  if (sp.bangs === 'none') return;
  bangsPath(c, sp.bangs);
  F(c, lg(c, 0, -272, 0, -196, [[0, shade(h, 0.12)], [1, h]]), OL, 3);
  c.save(); bangsPath(c, sp.bangs); c.clip();
  c.strokeStyle = 'rgba(255,255,255,0.32)'; c.lineWidth = 3.5; c.lineCap = 'round';
  c.lineWidth = 5; for (let i = -2; i <= 2; i++) { const a = Math.PI * 1.5 + i * 0.3; c.beginPath(); c.ellipse(0, -212, 50, 40, 0, a - 0.12, a + 0.12); c.stroke(); }
  c.strokeStyle = shade(h, 0.32); c.lineWidth = 1.6;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 18, -264); c.quadraticCurveTo(i * 20, -238, i * 22 + 2, -214); c.stroke(); }
  c.restore();
  if (!sp.male && sp.bangs !== 'old' && sp.bangs !== 'slick') {
    [-1, 1].forEach(s => {
      const sw = Math.sin(t * 1.6 + s) * 2;
      c.beginPath(); c.moveTo(s * 60, -224); c.quadraticCurveTo(s * 72, -180, s * 62 + sw, -146);
      c.quadraticCurveTo(s * 56, -160, s * 50, -176); c.quadraticCurveTo(s * 50, -200, s * 52, -222); c.closePath(); F(c, h, OL, 2.5);
    });
  }
}

/* ---------- 发髻与发饰 ---------- */
function bun(c, x, y, r, h, ry) { E(c, x, y, r, ry || r); F(c, lg(c, x, y - r, x, y + r, [[0, shade(h, 0.2)], [1, h]]), OL, 3);
  c.strokeStyle = shade(h, 0.34); c.lineWidth = 1.8; c.beginPath(); c.arc(x - r * 0.1, y + r * 0.05, r * 0.55, Math.PI * 0.9, Math.PI * 2.1); c.stroke(); c.beginPath(); c.arc(x + r * 0.15, y - r * 0.1, r * 0.3, Math.PI * 1.2, Math.PI * 2.3); c.stroke(); }
function bow(c, x, y, s, col, t, tails) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (tails) { const w = Math.sin(t * 2.2) * 4;
    c.beginPath(); c.moveTo(-2, 2); c.quadraticCurveTo(-8 + w, 22, -4 + w, 40); c.lineTo(2 + w, 36); c.quadraticCurveTo(-2 + w * 0.5, 20, 3, 2); F(c, shade(col, -0.08), OL, 2);
    c.beginPath(); c.moveTo(2, 2); c.quadraticCurveTo(10 + w, 18, 12 + w, 34); c.lineTo(17 + w, 30); c.quadraticCurveTo(12, 16, 5, 2); F(c, shade(col, -0.08), OL, 2); }
  c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-16, -14, -22, 8, 0, 2); F(c, col, OL, 2.2); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(16, -14, 22, 8, 0, 2); F(c, col, OL, 2.2);
  E(c, 0, 1, 4, 4); F(c, shade(col, -0.15), OL, 2); c.restore();
}
function buyao(c, x, y, ang, t, gold) { // 步摇：金簪 + 花头 + 三串会晃的垂珠
  gold = gold || '#e8b84a';
  c.save(); c.translate(x, y); c.rotate(ang);
  c.lineCap = 'round'; c.strokeStyle = shade(gold, -0.4); c.lineWidth = 4; c.beginPath(); c.moveTo(-26, 0); c.lineTo(22, 0); c.stroke();
  c.strokeStyle = gold; c.lineWidth = 2; c.beginPath(); c.moveTo(-26, 0); c.lineTo(22, 0); c.stroke();
  flower(c, 24, 0, 9, '#ffd36b', '#e2577e', 6); sparkle(c, 24, -2, 3);
  c.restore();
  const px = x + Math.cos(ang) * 22, py = y + Math.sin(ang) * 22;
  for (let k = 0; k < 3; k++) {
    const sw = Math.sin(t * 2.4 + k * 0.6) * 0.2, len = 20 + k * 7, ox = px - 6 + k * 6;
    c.strokeStyle = shade(gold, -0.3); c.lineWidth = 1.2; c.beginPath(); c.moveTo(ox, py + 4); c.lineTo(ox + Math.sin(sw) * len, py + 4 + Math.cos(sw) * len); c.stroke();
    for (let j = 1; j <= 3; j++) { const bx = ox + Math.sin(sw) * len * j / 3, by = py + 4 + Math.cos(sw) * len * j / 3; E(c, bx, by, j === 3 ? 3.4 : 2.3, j === 3 ? 4 : 2.3); F(c, j === 3 ? '#ff8fae' : '#fff8f0', OL, 0.8); }
  }
}
function pin(c, x, y, ang, col, head) { c.save(); c.translate(x, y); c.rotate(ang); c.lineCap = 'round'; c.strokeStyle = shade(col, -0.4); c.lineWidth = 4; c.beginPath(); c.moveTo(-24, 0); c.lineTo(20, 0); c.stroke(); c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-24, 0); c.lineTo(20, 0); c.stroke(); if (head) { E(c, 22, 0, 5, 5); F(c, head, OL, 1.5); } c.restore(); }
function peony(c, x, y, s, col, t) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * 1.2) * 0.03);
  [-1, 1].forEach(sx => { c.beginPath(); c.moveTo(0, 6); c.quadraticCurveTo(sx * 30, 4, sx * 42, 16); c.quadraticCurveTo(sx * 24, 24, 0, 10); F(c, '#5fae6a', '#2f6b3a', 2); });
  for (let ring = 3; ring >= 0; ring--) {
    const n = 7 + ring, R = 10 + ring * 7, cc = ring % 2 ? col : shade(col, 0.25);
    for (let i = 0; i < n; i++) { c.save(); c.rotate(i * TAU / n + ring * 0.4); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-R * 0.7, -R * 0.3, -R * 0.5, -R * 1.15, 0, -R); c.bezierCurveTo(R * 0.5, -R * 1.15, R * 0.7, -R * 0.3, 0, 0); F(c, cc, shade(col, -0.4), 1.4); c.restore(); }
  }
  E(c, 0, 0, 6, 6); F(c, '#ffd36b', '#c08a20', 1.5);
  c.restore();
}
A.peony = peony;
function drawBunsBack(c, sp, t) {
  const h = sp.hair;
  switch (sp.buns) {
    case 'double': bun(c, -44, -264, 22, h); bun(c, 44, -264, 22, h); break;
    case 'side2': bun(c, -62, -238, 19, h); bun(c, 62, -238, 19, h); break;
    case 'high': bun(c, 0, -286, 25, h, 30); break;
    case 'old': bun(c, 0, -270, 22, h, 16); break;
    case 'tight': bun(c, 0, -268, 30, h, 13); break;
    case 'topknot': bun(c, 0, -278, 17, h, 15); break;
    case 'grand': bun(c, -54, -278, 26, h, 20); bun(c, 54, -278, 26, h, 20); bun(c, 0, -294, 28, h, 26); break;
    case 'grand2': bun(c, -40, -272, 22, h, 16); bun(c, 40, -272, 22, h, 16); bun(c, 0, -284, 24, h, 20); break;
    case 'messy': bun(c, 6, -280, 26, h, 22); c.strokeStyle = h; c.lineWidth = 3; c.beginPath(); c.moveTo(-14, -296); c.quadraticCurveTo(-28, -308, -22, -318); c.moveTo(24, -294); c.quadraticCurveTo(38, -302, 36, -314); c.stroke();
      c.save(); c.translate(6, -282); c.rotate(-0.6); rr(c, -36, -3.5, 66, 7, 3); F(c, '#ffd23f', OL, 2); c.fillStyle = '#f7a8b8'; c.fillRect(24, -3.5, 6, 7); c.fillStyle = '#e8c9a0'; L(c, [-36, -3.5, -44, 0, -36, 3.5], true); c.fill(); c.restore(); break;
  }
  if (sp.hood) {
    c.beginPath(); c.moveTo(-78, -168); c.bezierCurveTo(-92, -272, -40, -304, 0, -304); c.bezierCurveTo(40, -304, 92, -272, 78, -168); c.quadraticCurveTo(72, -232, 0, -240); c.quadraticCurveTo(-72, -232, -78, -168);
    F(c, lg(c, 0, -304, 0, -168, [[0, shade(sp.hood, 0.18)], [1, sp.hood]]), OL, 3);
    c.strokeStyle = '#e8d6ff'; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(-72, -184); c.quadraticCurveTo(-68, -230, 0, -234); c.quadraticCurveTo(68, -230, 72, -184); c.stroke(); c.setLineDash([]);
  }
}
function drawOrnFront(c, sp, t) {
  const rib = sp.ribbon || '#e2577e', orn = sp.orn || [];
  if (sp.hood) { flower(c, 52, -250, 10, '#d9364a', '#ffd36b', 6); E(c, 40, -244, 4, 2.5, 0.5); F(c, '#3a7a4a'); }
  if (sp.buns === 'double') { bow(c, -40, -246, 0.9, rib, t, true); bow(c, 40, -246, 0.9, rib, t, true); }
  if (sp.buns === 'side2') { bow(c, -60, -222, 0.75, rib, t, true); bow(c, 60, -222, 0.75, rib, t, true); }
  if (orn.includes('buyao')) buyao(c, 30, -272, -0.5, t);
  if (orn.includes('flowerL')) { flower(c, -56, -252, 9, '#ffc2d4', '#ffe08a'); flower(c, -42, -264, 6, '#fff', '#ffb0c8'); }
  if (orn.includes('pearls')) { for (let i = 0; i < 7; i++) { E(c, -24 + i * 8, -271 - Math.abs(i - 3) * 1.2, 3, 3); F(c, '#fffaf2', '#b9a99a', 1); } }
  if (orn.includes('peach')) { flower(c, -48, -254, 8, '#ffb3c4', '#ffe08a'); E(c, -36, -260, 5, 3, 0.6); F(c, '#7cc48a', '#3f7a4a', 1.2); }
  if (orn.includes('camellia')) { pin(c, 18, -294, -0.2, '#e8b84a', '#e0344a'); flower(c, -22, -294, 13, '#e0344a', '#ffd36b', 6); flower(c, -22, -294, 6, '#ff6b7e', '#ffd36b', 6); }
  if (orn.includes('pinGold')) buyao(c, 28, -302, -0.15, t, '#d8a7f0');
  if (orn.includes('headband')) { c.beginPath(); c.moveTo(-64, -232); c.quadraticCurveTo(0, -254, 64, -232); c.lineTo(62, -222); c.quadraticCurveTo(0, -244, -62, -222); c.closePath(); F(c, '#3f3150', OL, 2); E(c, 0, -242, 6, 5); F(c, '#7fd0a8', OL, 1.5); }
  if (orn.includes('pinWood')) pin(c, -6, -270, -0.15, '#a0703a', '#d9a35a');
  if (orn.includes('peony')) {
    [-1, 1].forEach(s => buyao(c, s * 62, -286, s > 0 ? -0.7 : Math.PI + 0.7, t, '#f2c24d'));
    peony(c, 0, -278, 1.25, '#e8304a', t);
    flower(c, -42, -260, 7, '#ffd36b', '#e8304a'); flower(c, 42, -260, 7, '#ffd36b', '#e8304a');
  }
  if (orn.includes('phoenix')) { c.save(); c.translate(0, -322); c.beginPath(); c.moveTo(-20, 8); c.quadraticCurveTo(-8, -16, 0, -6); c.quadraticCurveTo(8, -16, 20, 8); c.quadraticCurveTo(0, 0, -20, 8); F(c, '#f2c24d', '#9a6a10', 2); sparkle(c, 0, -8, 5, '#fff'); c.restore(); }
  if (orn.includes('tassels')) { [-1, 1].forEach(s => { const sw = Math.sin(t * 2 + s) * 3; c.strokeStyle = '#e8304a'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(s * 76, -262); c.quadraticCurveTo(s * 80 + sw, -232, s * (76 + i * 2) + sw, -200); c.stroke(); } E(c, s * 76, -262, 5, 5); F(c, '#f2c24d', OL, 1.5); }); }
  if (orn.includes('crown')) {
    c.save(); c.translate(0, -288); c.beginPath(); c.moveTo(-20, 12); c.lineTo(-22, -6); c.lineTo(-12, 2); c.lineTo(-6, -14); c.lineTo(0, 0); c.lineTo(6, -14); c.lineTo(12, 2); c.lineTo(22, -6); c.lineTo(20, 12); c.closePath();
    F(c, lg(c, 0, -14, 0, 12, [[0, '#fff1a8'], [1, '#e2a91f']]), '#8a5f10', 2.5); E(c, 0, 4, 4, 4); F(c, '#e0344a', OL, 1); E(c, -12, 7, 2.5, 2.5); F(c, '#3a8fd0'); E(c, 12, 7, 2.5, 2.5); F(c, '#3a8fd0');
    c.lineCap = 'round'; c.strokeStyle = '#8a5f10'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(-34, 8); c.lineTo(34, 8); c.stroke(); c.strokeStyle = '#ffd86b'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-34, 8); c.lineTo(34, 8); c.stroke(); c.restore(); }
  if (orn.includes('phoenixOld')) { c.save(); c.translate(0, -302); c.beginPath(); c.moveTo(-28, 10); c.quadraticCurveTo(-14, -18, 0, -8); c.quadraticCurveTo(14, -18, 28, 10); c.quadraticCurveTo(0, 2, -28, 10); F(c, '#f2c24d', '#8a5f10', 2); E(c, 0, -4, 4, 4); F(c, '#3aa070', OL, 1); c.restore(); pin(c, -30, -270, 0.25, '#e8b84a', '#e0344a'); pin(c, 30, -270, Math.PI - 0.25, '#e8b84a', '#3aa070'); }
}
function drawHat(c, sp, t) {
  if (sp.hat === 'eunuch') {
    c.beginPath(); c.moveTo(-64, -220); c.quadraticCurveTo(-68, -284, 0, -288); c.quadraticCurveTo(68, -284, 64, -220); c.quadraticCurveTo(0, -236, -64, -220); F(c, lg(c, 0, -290, 0, -220, [[0, '#55556a'], [1, '#1f1f2a']]), OL, 3);
    [-1, 1].forEach(s => { c.save(); c.translate(s * 26, -282); c.rotate(s * 0.25 + Math.sin(t * 2) * 0.05 * s); E(c, s * 26, 0, 26, 9); F(c, 'rgba(40,40,56,0.88)', OL, 2); c.restore(); });
    E(c, 0, -292, 20, 14); F(c, '#2a2a36', OL, 2.5); rr(c, -66, -232, 132, 13, 6); F(c, '#2a2a36', OL, 2.5);
  } else if (sp.hat === 'cap') {
    c.beginPath(); c.moveTo(-63, -218); c.quadraticCurveTo(-64, -284, 0, -286); c.quadraticCurveTo(64, -284, 63, -218); c.quadraticCurveTo(0, -230, -63, -218); F(c, lg(c, 0, -286, 0, -218, [[0, shade(sp.outer, -0.1)], [1, shade(sp.outer, -0.45)]]), OL, 3);
    rr(c, -64, -230, 128, 12, 5); F(c, shade(sp.outer, -0.55), OL, 2); E(c, 0, -286, 8, 6); F(c, '#e0344a', OL, 2);
  } else if (sp.hat === 'helmet') {
    c.beginPath(); c.moveTo(-66, -206); c.quadraticCurveTo(-70, -290, 0, -292); c.quadraticCurveTo(70, -290, 66, -206); c.lineTo(52, -214); c.quadraticCurveTo(0, -238, -52, -214); c.closePath(); F(c, lg(c, 0, -292, 0, -206, [[0, '#dfe3ec'], [1, '#7f8a9c']]), OL, 3);
    rr(c, -8, -302, 16, 16, 3); F(c, '#c9a24d', OL, 2); const sw = Math.sin(t * 2) * 4; c.beginPath(); c.moveTo(0, -302); c.quadraticCurveTo(-14 + sw, -324, -6 + sw, -338); c.quadraticCurveTo(6 + sw, -328, 0, -302); F(c, '#d9364a', OL, 2);
  }
}

/* ---------- 道具 ---------- */
function drawProp(c, prop, t, x, y) {
  c.save(); c.translate(x, y);
  switch (prop) {
    case 'soup': E(c, 0, 4, 30, 9); F(c, '#f3eadf', OL, 2.5); c.beginPath(); c.moveTo(-30, 4); c.quadraticCurveTo(-28, 26, 0, 28); c.quadraticCurveTo(28, 26, 30, 4); F(c, '#fbf6ee', OL, 2.5);
      c.strokeStyle = '#6aa0d8'; c.lineWidth = 2; c.beginPath(); c.moveTo(-18, 16); c.quadraticCurveTo(0, 22, 18, 16); c.stroke(); E(c, 0, 4, 24, 6); F(c, '#c8a2e8');
      c.globalAlpha = 0.6; c.strokeStyle = '#fff'; c.lineWidth = 3; for (let i = -1; i <= 1; i++) { const k = (t * 0.7 + i * 0.3 + 1) % 1; c.beginPath(); c.moveTo(i * 10, -2 - k * 4); c.quadraticCurveTo(i * 10 + 6, -14 - k * 10, i * 10, -26 - k * 14); c.stroke(); } break;
    case 'ruler': c.rotate(-0.9); rr(c, -6, -64, 12, 70, 3); F(c, '#c08a4a', OL, 2.5); c.strokeStyle = '#7a4a1a'; c.lineWidth = 1.5; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-6, -58 + i * 8); c.lineTo(0, -58 + i * 8); c.stroke(); } break;
    case 'fan': case 'fanGold': { c.translate(0, -20); c.strokeStyle = '#7a4a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 18); c.lineTo(0, 40); c.stroke(); E(c, 0, 0, 22, 24); F(c, prop === 'fan' ? '#fff3fb' : '#fff2c8', prop === 'fan' ? '#8a4fb0' : '#c08a20', 3); flower(c, -4, 2, 8, prop === 'fan' ? '#e2a0f0' : '#e8304a', '#ffd36b'); E(c, 8, -10, 3, 3); F(c, '#f4b6c2'); c.strokeStyle = '#e8304a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 40); c.lineTo(-3, 56); c.moveTo(0, 40); c.lineTo(3, 56); c.stroke(); break; }
    case 'whisk': c.rotate(-0.4); rr(c, -3, -44, 6, 46, 3); F(c, '#8a5a2a', OL, 2); c.strokeStyle = '#fbfbff'; c.lineWidth = 2; for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(i * 4 + Math.sin(t * 2) * 3, 26, i * 5 + Math.sin(t * 2 + i) * 4, 52); c.stroke(); } break;
    case 'plate': E(c, 0, 6, 34, 9); F(c, '#fff', '#4a8fd0', 2.5); [[-14, 0], [14, 0], [0, -6], [0, 4]].forEach(([a, b]) => { E(c, a, b, 11, 8); F(c, '#fff8ec', OL, 2); c.strokeStyle = '#e0b880'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(a - 4, b - 2); c.quadraticCurveTo(a, b - 6, a + 4, b - 2); c.stroke(); }); break;
    case 'scroll': rr(c, -30, -8, 60, 16, 7); F(c, '#fff6e0', OL, 2.5); E(c, -32, 0, 5, 10); F(c, '#c0392b', OL, 2); E(c, 32, 0, 5, 10); F(c, '#c0392b', OL, 2); break;
    case 'spear': c.strokeStyle = '#7a4a1a'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 100); c.lineTo(0, -150); c.stroke(); c.beginPath(); c.moveTo(0, -186); c.lineTo(9, -150); c.lineTo(-9, -150); c.closePath(); F(c, '#dfe5ee', OL, 2); c.beginPath(); c.moveTo(-8, -150); c.quadraticCurveTo(-16 + Math.sin(t * 2) * 3, -130, -6, -120); c.lineTo(6, -120); c.quadraticCurveTo(16, -130, 8, -150); F(c, '#d9364a', OL, 1.5); break;
    case 'beads': for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E(c, Math.cos(a) * 16, 14 + Math.sin(a) * 9, 3.6, 3.6); F(c, '#8a4a2a', OL, 1); } c.strokeStyle = '#e0344a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 23); c.lineTo(0, 38); c.stroke(); break;
    case 'milktea': rr(c, -13, -30, 26, 40, 5); F(c, 'rgba(255,240,225,0.95)', OL, 2.5); c.fillStyle = '#d8a878'; c.fillRect(-11, -16, 22, 24); for (let i = 0; i < 6; i++) { E(c, -7 + (i % 3) * 7, 2 + ((i / 3) | 0) * 5, 2.8, 2.8); F(c, '#3a2222'); } rr(c, -15, -34, 30, 6, 3); F(c, '#ff9eb8', OL, 2); c.strokeStyle = '#ff6b8a'; c.lineWidth = 4; c.beginPath(); c.moveTo(4, -34); c.lineTo(10, -54); c.stroke(); break;
    case 'note': c.rotate(0.15); rr(c, -16, -12, 32, 24, 2); F(c, '#fffbe8', OL, 2); c.strokeStyle = '#8a7a6a'; c.lineWidth = 1.2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-10, -5 + i * 6); c.lineTo(10, -5 + i * 6); c.stroke(); } break;
    case 'incense': rr(c, -20, -8, 40, 22, 6); F(c, '#c99a5a', OL, 2.5); flower(c, 0, 3, 6, '#ffd36b', '#e0344a'); c.strokeStyle = 'rgba(190,160,255,0.65)'; c.lineWidth = 3; c.beginPath(); for (let k = 0; k < 14; k++) c.lineTo(Math.sin(k * 0.6 + t * 2) * 6, -8 - k * 4); c.stroke(); break;
    case 'cake': E(c, 0, 6, 30, 8); F(c, '#fff', '#4a8fd0', 2); for (let i = 0; i < 3; i++) { rr(c, -22 + i * 15, -8 - (i === 1 ? 6 : 0), 16, 14, 3); F(c, '#ffe08a', OL, 1.8); flower(c, -14 + i * 15, -1 - (i === 1 ? 6 : 0), 3.5, '#ffb84a', '#fff'); } break;
  }
  c.restore();
}
A.drawProp = (c, prop, t, x, y) => drawProp(c, prop, t, x, y);

/* ---------- 身体 ---------- */
function drawBody(c, sp, o) {
  const t = o.t, pose = o.pose || sp.pose || 'fold', plump = sp.plump ? 1.12 : 1, ghost = o.ghost;
  if (sp.body === 'modern' && !ghost) { drawModernBody(c, sp, o); return; }
  if (ghost) {
    const w = t * 4;
    c.beginPath(); c.moveTo(-36, -100); c.bezierCurveTo(-52, -60, -42, -30, -30 + Math.sin(w) * 6, -6); c.quadraticCurveTo(-14, -20, -4 + Math.sin(w + 1) * 6, -2); c.quadraticCurveTo(8, -18, 22 + Math.sin(w + 2) * 6, -10); c.bezierCurveTo(40, -36, 50, -64, 36, -100); c.closePath();
    F(c, lg(c, 0, -100, 0, -4, [[0, 'rgba(240,246,255,0.95)'], [1, 'rgba(200,215,250,0.1)']]), 'rgba(140,160,210,0.7)', 2.5);
  } else {
    const hw = (sp.male ? 50 : 62) * plump, path = () => { c.beginPath(); c.moveTo(-34 * plump, -98); c.bezierCurveTo(-46 * plump, -60, -hw, -30, -hw, -8); c.quadraticCurveTo(0, 2, hw, -8); c.bezierCurveTo(hw, -30, 46 * plump, -60, 34 * plump, -98); c.closePath(); };
    [-1, 1].forEach(s => { E(c, s * 16, -3, 13, 7); F(c, sp.male ? '#2a2a33' : sp.trim, OL, 2.5); if (!sp.male) { E(c, s * 16, -6, 4, 2.5); F(c, '#fff3a0'); } });
    path(); F(c, lg(c, 0, -98, 0, -6, [[0, sp.skirt], [1, sp.skirt2]]), OL, 3);
    c.save(); path(); c.clip();
    c.strokeStyle = shade(sp.skirt2, -0.18); c.lineWidth = 1.8;
    [-28, -10, 10, 28].forEach(x => { c.beginPath(); c.moveTo(x * 0.55, -90); c.quadraticCurveTo(x * 0.85, -50, x * 1.15, -12); c.stroke(); });
    c.fillStyle = sp.trim; c.beginPath(); c.moveTo(-90, -24); c.quadraticCurveTo(0, -12, 90, -24); c.lineTo(90, 10); c.lineTo(-90, 10); c.closePath(); c.fill();
    drawHem(c, sp);
    if (sp.male) { c.fillStyle = sp.trim; c.fillRect(-7, -98, 14, 100); }
    c.restore();
    path(); F(c, null, OL, 3);
  }
  const sw = 32 * plump;
  c.beginPath(); c.moveTo(-sw + 4, -150); c.quadraticCurveTo(-sw - 6, -148, -sw - 4, -128); c.lineTo(-sw - 2, -94); c.lineTo(sw + 2, -94); c.lineTo(sw + 4, -128); c.quadraticCurveTo(sw + 6, -148, sw - 4, -150); c.closePath();
  F(c, ghost ? 'rgba(242,246,255,0.96)' : lg(c, 0, -150, 0, -94, [[0, shade(sp.outer, 0.14)], [1, sp.outer]]), OL, 3);
  // 交领（右衽）
  c.beginPath(); c.moveTo(-14, -152); c.lineTo(10, -112); c.lineTo(16, -118); c.lineTo(-4, -152); c.closePath(); F(c, sp.inner, OL, 2);
  c.beginPath(); c.moveTo(14, -152); c.lineTo(-6, -118); c.lineTo(2, -112); c.lineTo(22, -150); c.closePath(); F(c, sp.trim, OL, 2);
  c.beginPath(); c.moveTo(-18, -152); c.lineTo(8, -108); c.lineTo(0, -106); c.lineTo(-26, -150); c.closePath(); F(c, sp.trim, OL, 2);
  if (!ghost) {
    if (sp.pattern === 'dragon') { E(c, 0, -124, 13, 13); F(c, '#ffe58a', '#b8860b', 2); c.strokeStyle = '#c0392b'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-8, -122); c.quadraticCurveTo(-2, -134, 4, -124); c.quadraticCurveTo(8, -116, 9, -128); c.stroke(); E(c, 6, -129, 1.6, 1.6); F(c, '#c0392b'); }
    if (sp.pattern === 'badge') { rr(c, -14, -134, 28, 22, 3); F(c, '#f2d58a', '#8a5f10', 2); flower(c, 0, -123, 6, '#e0344a', '#fff'); }
    if (sp.pattern === 'armor') { c.strokeStyle = '#3a4656'; c.lineWidth = 1.5; for (let r = 0; r < 3; r++) for (let i = -2; i <= 2; i++) { c.beginPath(); c.arc(i * 11 + (r % 2) * 5, -138 + r * 12, 6, 0, Math.PI); c.stroke(); } E(c, 0, -128, 9, 9); F(c, '#c9a24d', OL, 2); }
    if (sp.pattern === 'sakura' || sp.pattern === 'peony') { flower(c, -20, -130, 4.5, '#fff', '#ffd36b'); flower(c, 22, -118, 4, '#fff', '#ffd36b'); }
    if ((sp.orn || []).includes('beads')) { for (let i = 0; i < 11; i++) { const a = Math.PI * (0.15 + i * 0.07); E(c, Math.cos(a) * 26, -150 + Math.sin(a) * 24, 3.4, 3.4); F(c, '#8a4a2a', OL, 1); } }
    rr(c, -sw - 2, -104, sw * 2 + 4, 12, 3); F(c, sp.sash, OL, 2.5);
    c.strokeStyle = shade(sp.sash, 0.35); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-sw, -98); c.lineTo(sw, -98); c.stroke();
    c.save(); c.translate(0, -94); c.rotate(Math.sin(t * 2) * 0.12);
    if (!sp.male) { c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(-10, 18, -6, 34); c.lineTo(0, 32); c.quadraticCurveTo(-3, 16, 2, 0); F(c, sp.sash, OL, 1.8); }
    c.strokeStyle = '#e0344a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(6, 0); c.lineTo(6, 22); c.stroke();
    E(c, 6, 28, 7, 7); F(c, '#8fe0b8', '#2f7a5a', 2); E(c, 6, 28, 2.2, 2.2); F(c, sp.sash);
    c.strokeStyle = '#e0344a'; c.lineWidth = 1.2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(6, 35); c.lineTo(6 + i * 1.6, 50); c.stroke(); }
    c.restore();
  }
  drawArms(c, sp, o, pose, plump);
}
function drawShawl(c, sp, o) {
  const t = o.t, ghost = o.ghost;
  if (sp.shawl && !ghost) {
    c.save(); c.globalAlpha = 0.8; const w = Math.sin(t * 1.6) * 5;
    c.beginPath(); c.moveTo(-58, -110); c.bezierCurveTo(-72, -172, 72, -172, 58, -110); c.lineTo(52, -112); c.bezierCurveTo(62, -160, -62, -160, -52, -112); c.closePath(); F(c, sp.shawl, shade(sp.shawl, -0.3), 2);
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 60, -110); c.bezierCurveTo(s * 82 + w, -80, s * 64 - w, -50, s * 86 + w, -16); c.lineTo(s * 76 + w, -14); c.bezierCurveTo(s * 56 - w, -50, s * 72 + w, -80, s * 52, -108); c.closePath(); F(c, sp.shawl, shade(sp.shawl, -0.3), 2); });
    c.restore();
  }
}
function drawHem(c, sp) {
  const p = sp.pattern;
  if (p === 'sakura') for (let i = -3; i <= 3; i++) flower(c, i * 18, -8 + Math.abs(i) * -1.5, 5, '#fff', '#ffd36b');
  else if (p === 'dots') { c.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = -6; i <= 6; i++) { E(c, i * 9, -9 + Math.abs(i) * -0.6, 2.2, 2.2); c.fill(); } }
  else if (p === 'clouds') { c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * 18, -7, 5, Math.PI, 0); c.arc(i * 18 + 7, -7, 3, Math.PI, 0); c.stroke(); } }
  else if (p === 'peony') for (let i = -3; i <= 3; i++) flower(c, i * 18, -8, 6, '#ffe8a0', '#e0344a', 6);
  else if (p === 'dragon') { c.strokeStyle = '#ffe58a'; c.lineWidth = 2.5; c.beginPath(); for (let x = -60; x <= 60; x += 4) c.lineTo(x, -8 + Math.sin(x * 0.25) * 4); c.stroke(); }
  else if (p === 'lines' || p === 'badge' || p === 'armor') { c.strokeStyle = 'rgba(255,240,200,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-90, -12); c.lineTo(90, -12); c.moveTo(-90, -6); c.lineTo(90, -6); c.stroke(); }
}
function drawArms(c, sp, o, pose, plump) {
  const ghost = o.ghost, col = ghost ? 'rgba(242,246,255,0.96)' : sp.outer, cuff = ghost ? '#d6def5' : sp.trim, t = o.t;
  const sleeve = (s, ex, ey, open) => {
    c.beginPath(); c.moveTo(s * 26 * plump, -150); c.quadraticCurveTo(s * 48 * plump, -150, s * 52 * plump, -128);
    c.quadraticCurveTo(s * (Math.abs(ex) + open), ey - 10, ex + s * open * 0.6, ey + 14);
    c.quadraticCurveTo(ex, ey + 18, ex - s * open * 0.8, ey + 8);
    c.quadraticCurveTo(s * 24, -112, s * 22 * plump, -128); c.closePath(); F(c, col, OL, 3);
    c.beginPath(); c.moveTo(ex + s * open * 0.6, ey + 14); c.quadraticCurveTo(ex, ey + 18, ex - s * open * 0.8, ey + 8); c.lineTo(ex - s * open * 0.6, ey + 1); c.quadraticCurveTo(ex, ey + 9, ex + s * open * 0.5, ey + 6); c.closePath(); F(c, cuff, OL, 2);
  };
  const hand = (x, y) => { E(c, x, y, 8, 7); F(c, sp.skin, OL, 2.5); };
  const prop = o.prop === undefined ? sp.prop : o.prop;
  if (pose === 'fold') { sleeve(-1, -18, -104, 26); sleeve(1, 18, -104, 26); hand(-5, -96); hand(5, -95); }
  else if (pose === 'hold' || pose === 'scroll' || pose === 'beads') {
    sleeve(-1, -24, -112, 22); sleeve(1, 24, -112, 22);
    if (prop && prop !== 'none') drawProp(c, prop, t, 0, pose === 'beads' ? -126 : -118);
    hand(-20, -104); hand(20, -104);
  } else if (pose === 'fan' || pose === 'ruler' || pose === 'whisk' || pose === 'spear') {
    sleeve(-1, -18, -104, 24); hand(-6, -96);
    c.save(); c.translate(30, -138); c.rotate(-0.25 + (pose === 'fan' ? Math.sin(t * 2.4) * 0.06 : 0));
    c.beginPath(); c.moveTo(-6, -10); c.quadraticCurveTo(26, -6, 36, 16); c.quadraticCurveTo(40, 34, 30, 42); c.quadraticCurveTo(18, 38, 14, 30); c.quadraticCurveTo(4, 16, -10, 10); c.closePath(); F(c, col, OL, 3);
    c.beginPath(); c.moveTo(30, 42); c.quadraticCurveTo(18, 38, 14, 30); c.lineTo(20, 26); c.quadraticCurveTo(26, 32, 34, 34); c.closePath(); F(c, cuff, OL, 2);
    c.restore();
    if (prop && prop !== 'none') drawProp(c, prop, t, pose === 'spear' ? 54 : 48, pose === 'fan' ? -108 : -100);
    hand(48, -104);
  } else if (pose === 'point') {
    sleeve(-1, -18, -104, 24); hand(-6, -96);
    c.beginPath(); c.moveTo(24, -148); c.quadraticCurveTo(60, -152, 84, -138); c.lineTo(86, -120); c.quadraticCurveTo(56, -118, 26, -120); c.closePath(); F(c, col, OL, 3);
    c.lineCap = 'round'; c.beginPath(); c.moveTo(96, -130); c.lineTo(110, -133); c.strokeStyle = OL; c.lineWidth = 8; c.stroke(); c.strokeStyle = sp.skin; c.lineWidth = 4.5; c.stroke(); E(c, 92, -128, 8, 7); F(c, sp.skin, OL, 2.5);
  } else if (pose === 'up') {
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 24, -146); c.quadraticCurveTo(s * 58, -160, s * 68, -198); c.lineTo(s * 50, -202); c.quadraticCurveTo(s * 42, -172, s * 22, -126); c.closePath(); F(c, col, OL, 3); E(c, s * 61, -208, 8, 8); F(c, sp.skin, OL, 2.5); });
  } else if (pose === 'tray') {
    sleeve(-1, -34, -92, 20); sleeve(1, 34, -92, 20);
    hand(-34, -86); hand(34, -86);
  }
}
function drawModernBody(c, sp, o) {
  [-1, 1].forEach(s => { rr(c, s * 22 - 11, -66, 22, 60, 9); F(c, '#f6c6d6', OL, 2.5); E(c, s * 22, -4, 15, 7); F(c, '#ffe08a', OL, 2.5); E(c, s * 22 - 4, -8, 4, 3); F(c, '#fff'); });
  c.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 5; i++) { E(c, -24 + (i % 2) * 6, -52 + i * 9, 2, 2); c.fill(); E(c, 20 + (i % 2) * 6, -50 + i * 9, 2, 2); c.fill(); }
  c.beginPath(); c.moveTo(-36, -150); c.quadraticCurveTo(-48, -150, -48, -126); c.lineTo(-46, -66); c.quadraticCurveTo(0, -56, 46, -66); c.lineTo(48, -126); c.quadraticCurveTo(48, -150, 36, -150); c.closePath();
  F(c, lg(c, 0, -150, 0, -60, [[0, shade(sp.outer, 0.18)], [1, sp.outer]]), OL, 3);
  rr(c, -22, -98, 44, 22, 8); F(c, shade(sp.outer, -0.08), OL, 2);
  // 胸前猫猫印花
  E(c, 0, -124, 11, 9); F(c, '#fff'); c.beginPath(); c.moveTo(-10, -128); c.lineTo(-8, -138); c.lineTo(-3, -131); c.moveTo(10, -128); c.lineTo(8, -138); c.lineTo(3, -131); F(c, '#fff'); E(c, -4, -124, 1.5, 1.5); F(c, OL); E(c, 4, -124, 1.5, 1.5); F(c, OL);
  c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-12, -150); c.lineTo(-14, -134); c.moveTo(12, -150); c.lineTo(14, -134); c.stroke();
  c.beginPath(); c.moveTo(-40, -146); c.quadraticCurveTo(-62, -120, -52, -96); c.lineTo(-38, -100); c.quadraticCurveTo(-44, -120, -30, -136); c.closePath(); F(c, sp.outer, OL, 3); E(c, -46, -94, 8, 7); F(c, sp.skin, OL, 2.5);
  c.beginPath(); c.moveTo(40, -146); c.quadraticCurveTo(64, -132, 56, -112); c.lineTo(42, -116); c.quadraticCurveTo(46, -128, 30, -136); c.closePath(); F(c, sp.outer, OL, 3);
  if (o.prop !== 'none') drawProp(c, 'milktea', o.t, 52, -112);
  E(c, 50, -112, 8, 7); F(c, sp.skin, OL, 2.5);
}

/* ---------- 头部 ---------- */
function drawHead(c, sp, o) {
  const face = FACES[o.face] || FACES.normal, t = o.t;
  let eyes = face.eyes, brow = face.brow;
  if (o.face === 'normal' && sp.eyesDefault) eyes = sp.eyesDefault;
  if (o.face === 'smirk' && sp.eyesDefault === 'squint') eyes = 'squint';
  if (o.face === 'normal' && sp.browDefault) brow = sp.browDefault;
  if (!o.skipBack) drawHairBack(c, sp, t);
  drawBunsBack(c, sp, t);
  [-1, 1].forEach(s => { E(c, s * 56, -192, 8, 11); F(c, sp.skin, OL, 2.5); E(c, s * 56, -192, 3.5, 6); F(c, shade(sp.skin, -0.12)); });
  c.beginPath(); c.moveTo(-58, -210); c.bezierCurveTo(-60, -166, -38, -144, 0, -144); c.bezierCurveTo(38, -144, 60, -166, 58, -210); c.bezierCurveTo(56, -250, -56, -250, -58, -210);
  F(c, lg(c, 0, -250, 0, -144, [[0, sp.skin], [1, shade(sp.skin, -0.05)]]), OL, 3);
  if (sp.old) { c.strokeStyle = shade(sp.skin, -0.25); c.lineWidth = 1.6; [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 34, -168); c.quadraticCurveTo(s * 30, -160, s * 22, -158); c.stroke(); c.beginPath(); c.moveTo(s * 42, -204); c.lineTo(s * 48, -208); c.moveTo(s * 42, -198); c.lineTo(s * 49, -199); c.stroke(); }); }
  E(c, -34, -180, 11, 6); F(c, 'rgba(255,140,160,0.42)'); E(c, 34, -180, 11, 6); F(c, 'rgba(255,140,160,0.42)');
  c.strokeStyle = 'rgba(230,90,120,0.5)'; c.lineWidth = 1.4; [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(s * 30 - 6 + i * 5, -177); c.lineTo(s * 30 - 3 + i * 5, -183); c.stroke(); } });
  if (sp.freckle) { c.fillStyle = 'rgba(190,120,90,0.55)'; [-1, 1].forEach(s => { E(c, s * 26, -189, 1.6, 1.6); c.fill(); E(c, s * 32, -191, 1.4, 1.4); c.fill(); E(c, s * 29, -186, 1.3, 1.3); c.fill(); }); }
  if (sp.mole) { E(c, 24, -164, 2.4, 2.4); F(c, '#4a3030'); }
  drawEye(c, -24, -196, -1, eyes, sp, face.look, face.lookY, o.blink);
  drawEye(c, 24, -196, 1, eyes, sp, face.look, face.lookY, o.blink);
  if (sp.glasses) { c.strokeStyle = '#8a6a2a'; c.lineWidth = 2.5; E(c, -24, -196, 17, 16); c.stroke(); E(c, 24, -196, 17, 16); c.stroke(); c.beginPath(); c.moveTo(-7, -198); c.quadraticCurveTo(0, -203, 7, -198); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-32, -206); c.lineTo(-26, -210); c.moveTo(16, -206); c.lineTo(22, -210); c.stroke(); c.strokeStyle = '#c9a24d'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-41, -194); c.quadraticCurveTo(-48, -170, -40, -150); c.stroke(); }
  c.fillStyle = shade(sp.skin, -0.22); E(c, 0, -182, 1.8, 1.4); c.fill();
  drawMouth(c, sp, face.mouth, o.talk);
  drawHairFront(c, sp, t);
  drawBrow(c, sp, brow);
  drawHat(c, sp, t);
  drawOrnFront(c, sp, t);
  drawFaceFX(c, sp, face.fx, t);
}

/* ---------- 角色总入口 ----------
   o: { face, t, talk, blink, ghost, stone, pose, prop, flip, alpha, halo, still, tilt, phase } */
A.drawChar = function (c, id, x, y, scale, o) {
  o = o || {};
  let sp = CH[id] || CH.me;
  if (o.ghost) sp = Object.assign({}, sp, GHOST, { shawl: null, eyesDefault: null, browDefault: null });
  if (o.stone) sp = Object.assign({}, sp, STONE, { eyesDefault: null, browDefault: null });
  const t = o.t || 0;
  c.save(); c.translate(x, y); c.scale(scale * (o.flip ? -1 : 1), scale);
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  const ph = o.phase || 0, bob = o.still ? 0 : Math.sin(t * 2.1 + ph) * 1.6;
  if (!o.ghost && !o.noShadow) { E(c, 0, 0, 62, 10); F(c, 'rgba(40,20,30,0.18)'); }
  c.translate(0, bob);
  if (o.ghost) c.translate(0, -18 + Math.sin(t * 2) * 6);
  if (o.squash) c.scale(1 + o.squash, 1 - o.squash);
  const headRot = (o.tilt || 0) + (o.still ? 0 : Math.sin(t * 1.3 + ph) * 0.018);
  drawShawl(c, sp, Object.assign({}, o, { t }));
  c.save(); c.translate(0, -150); c.rotate(headRot); c.translate(0, 150); drawHairBack(c, sp, t); c.restore();
  c.save(); c.translate(0, -100); c.scale(1, 1 + (o.still ? 0 : Math.sin(t * 2.1 + ph) * 0.008)); c.translate(0, 100);
  drawBody(c, sp, Object.assign({}, o, { t }));
  c.restore();
  c.save(); c.translate(0, -150); c.rotate(headRot); c.translate(0, 150);
  drawHead(c, sp, Object.assign({}, o, { t, skipBack: true, face: o.face || (o.ghost ? 'dead' : 'normal') }));
  c.restore();
  if (o.ghost || o.halo) { c.save(); E(c, 0, -330 + Math.sin(t * 3) * 3, 34, 9); c.strokeStyle = '#ffd84a'; c.lineWidth = 6; c.stroke(); c.strokeStyle = '#fff6b0'; c.lineWidth = 2; c.stroke(); c.restore(); }
  c.restore();
};

/* ---------- 御猫糯米 ---------- */
A.drawCat = function (c, x, y, s, o) {
  o = o || {}; const t = o.t || 0, mood = o.mood || 'normal';
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  E(c, 0, 0, 44, 8); F(c, 'rgba(40,20,30,0.18)');
  const sq = o.run ? Math.abs(Math.sin(t * 12)) * 6 : Math.sin(t * 2) * 1.5;
  c.lineCap = 'round'; c.strokeStyle = OL; c.lineWidth = 15; c.beginPath(); c.moveTo(34, -18); c.quadraticCurveTo(62, -30 + Math.sin(t * 3) * 10, 56, -62 + Math.sin(t * 3) * 8); c.stroke();
  c.strokeStyle = '#f7a440'; c.lineWidth = 10; c.stroke();
  E(c, 0, -34 - sq * 0.3, 46 + sq * 0.4, 36 - sq * 0.4); F(c, lg(c, 0, -70, 0, 0, [[0, '#ffbd5a'], [1, '#f39a32']]), OL, 3);
  E(c, 0, -22, 26, 16); F(c, '#fff4e0');
  c.strokeStyle = '#d97a1a'; c.lineWidth = 3; [-24, -12, 12, 24].forEach(i => { c.beginPath(); c.moveTo(i, -66); c.quadraticCurveTo(i * 1.1, -58, i * 0.9, -52); c.stroke(); });
  [-26, -10, 10, 26].forEach((i, k) => { E(c, i, -3 + (o.run && k % 2 ? -sq : 0), 9, 6); F(c, '#fff4e0', OL, 2); });
  c.save(); c.translate(-6, -72 - sq * 0.3);
  [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 30, -14); c.lineTo(sd * 36, -46); c.lineTo(sd * 10, -30); c.closePath(); F(c, '#f7a440', OL, 3); c.beginPath(); c.moveTo(sd * 28, -20); c.lineTo(sd * 32, -38); c.lineTo(sd * 16, -28); c.closePath(); F(c, '#ffc2c8'); });
  E(c, 0, -10, 40, 32); F(c, '#ffb04c', OL, 3);
  c.strokeStyle = '#d97a1a'; c.lineWidth = 3; [-8, 0, 8].forEach(i => { c.beginPath(); c.moveTo(i, -40); c.lineTo(i, -30); c.stroke(); });
  E(c, 0, 2, 16, 10); F(c, '#fff4e0');
  c.strokeStyle = '#2a1622'; c.lineWidth = 3.5;
  if (mood === 'happy') [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 15 - 7, -8); c.quadraticCurveTo(sd * 15, -16, sd * 15 + 7, -8); c.stroke(); });
  else if (mood === 'annoyed') [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(sd * 15 - 7, -10); c.lineTo(sd * 15 + 7, -10); c.stroke(); });
  else [-1, 1].forEach(sd => { E(c, sd * 15, -10, 7, 8); F(c, '#2a1622'); E(c, sd * 15 - 2, -13, 2.6, 2.6); F(c, '#fff'); });
  E(c, 0, -2, 3, 2); F(c, '#ff7a8a');
  c.lineWidth = 2.2; c.beginPath(); c.moveTo(-7, 3); c.quadraticCurveTo(-3.5, 8, 0, 3); c.quadraticCurveTo(3.5, 8, 7, 3); c.stroke();
  c.lineWidth = 1.5; [-1, 1].forEach(sd => { for (let i = 0; i < 2; i++) { c.beginPath(); c.moveTo(sd * 18, -1 + i * 5); c.lineTo(sd * 40, -4 + i * 8); c.stroke(); } });
  E(c, -26, 0, 6, 3.5); F(c, 'rgba(255,120,140,0.45)'); E(c, 26, 0, 6, 3.5); F(c, 'rgba(255,120,140,0.45)');
  c.restore();
  c.beginPath(); c.moveTo(-34, -48); c.quadraticCurveTo(-6, -36, 24, -48); c.strokeStyle = '#e0344a'; c.lineWidth = 5; c.stroke(); E(c, -6, -40, 6, 6); F(c, '#f2c24d', OL, 2);
  c.restore();
};

/* ---------- 漫画式情绪气泡 ---------- */
A.drawEmote = function (c, x, y, s, e, k) {
  c.save(); c.translate(x, y); const pop = k < 0.12 ? k / 0.12 * 1.2 : k < 0.22 ? 1.2 - (k - 0.12) * 2 : 1; c.scale(s * pop, s * pop);
  c.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = i % 2 ? 26 : 34; c.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r); } c.closePath();
  F(c, e === '💢' ? '#ffe0e0' : '#fffbe8', OL, 3);
  c.fillStyle = e === '💢' ? '#e03a3a' : e === '♪' ? '#e2577e' : '#3a2a2a'; c.font = 'bold 32px "Noto Sans CJK SC", "PingFang SC", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(e, 0, 2);
  c.restore();
};
})(window.PALACE = window.PALACE || {});
