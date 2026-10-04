/* 第五章 新角色、新场景、新道具、新死法场景、结局纪念画 */
(function (P) {
const A = P.ART, { E, F, L, rr, lg, rg, shade, flower, star, sparkle, heart, OL, TAU } = A.util;
const BG = A.BG;
const { roofTiles, lantern, cloud, tree, palaceWall, floorTiles, txt, plaque, xiangyun } = A;
Object.assign(A.CH, {
  wenshang: { name: '温尚书', skin: '#f6dcc8', hair: '#3a3030', eye: '#3a2a2a', back: 'none', bangs: 'male', buns: 'none', male: true, plump: true, eyesDefault: 'sly', browDefault: 'furrow',
    outer: '#b8322e', inner: '#fff3e8', skirt: '#b8322e', skirt2: '#8a2222', trim: '#e8b84a', sash: '#3a2a2a', pattern: 'badge', pose: 'hold', prop: 'hu', orn: ['wushamao', 'mustache'] },
  cike: { name: '刺客', skin: '#f3d6c2', hair: '#141018', eye: '#2a1a1a', back: 'none', bangs: 'none', buns: 'none', hat: 'cap', male: true, browDefault: 'angry',
    outer: '#2a2632', inner: '#3a3644', skirt: '#2a2632', skirt2: '#1a1820', trim: '#5a5468', sash: '#8a2b2b', pattern: 'none', pose: 'hold', prop: 'none', orn: ['mask'] },
  doctor: { name: '主治医生', skin: '#ffe8da', hair: '#2a2024', eye: '#3a3a4a', back: 'male', bangs: 'male', buns: 'none', male: true, glasses: true,
    outer: '#f6f8fb', inner: '#bcd6ee', skirt: '#f6f8fb', skirt2: '#d6dee8', trim: '#9ab0c8', sash: '#9ab0c8', pattern: 'none', pose: 'hold', prop: 'clipboard', orn: [] },
  nurse: { name: '护士', skin: '#ffe9dc', hair: '#5a3424', eye: '#8a4b2a', back: 'short', bangs: 'full', buns: 'side2', ribbon: '#f6f8fb',
    outer: '#ffd6e2', inner: '#ffffff', skirt: '#ffd6e2', skirt2: '#f2b6c8', trim: '#e2577e', sash: '#e2577e', pattern: 'none', pose: 'hold', prop: 'none', orn: ['nurseCap'] },
});
/* ---------- 小道具 ---------- */
function wineCup(c, x, y, r, col, t, bad) {
  c.beginPath(); c.moveTo(x - r, y - r * 0.5); c.quadraticCurveTo(x - r * 0.9, y + r * 0.5, x, y + r * 0.55); c.quadraticCurveTo(x + r * 0.9, y + r * 0.5, x + r, y - r * 0.5); c.closePath(); F(c, '#fbf6ee', OL, 2.2);
  E(c, x, y - r * 0.5, r, r * 0.28); F(c, '#fff', OL, 2); E(c, x, y - r * 0.48, r * 0.82, r * 0.2); F(c, col || '#e8b84a');
  rr(c, x - r * 0.35, y + r * 0.5, r * 0.7, r * 0.22, 3); F(c, '#e8d8c0', OL, 1.6);
  c.strokeStyle = '#4a8fd0'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - r * 0.6, y); c.quadraticCurveTo(x, y + r * 0.2, x + r * 0.6, y); c.stroke();
}
function winePot(c, x, y, r, t) { // 鸳鸯壶
  c.beginPath(); c.moveTo(x - r * 0.5, y - r); c.quadraticCurveTo(x - r * 1.2, y + r * 0.2, x - r * 0.6, y + r); c.lineTo(x + r * 0.6, y + r); c.quadraticCurveTo(x + r * 1.2, y + r * 0.2, x + r * 0.5, y - r); c.closePath(); F(c, lg(c, x, y - r, x, y + r, [[0, '#9fd0c0'], [1, '#3f8f7a']]), OL, 2.5);
  c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - r * 0.9); c.lineTo(x, y + r * 0.9); c.stroke();
  rr(c, x - r * 0.5, y - r * 1.25, r, r * 0.3, 4); F(c, '#3f8f7a', OL, 2); E(c, x, y - r * 1.35, r * 0.16, r * 0.12); F(c, '#f2c24d', OL, 1.5);
  c.beginPath(); c.moveTo(x + r * 0.9, y - r * 0.2); c.quadraticCurveTo(x + r * 1.5, y - r * 0.5, x + r * 1.6, y - r * 0.9); c.lineWidth = r * 0.18; c.strokeStyle = OL; c.stroke(); c.lineWidth = r * 0.1; c.strokeStyle = '#6ab8a0'; c.stroke();
  flower(c, x - r * 0.4, y + r * 0.2, r * 0.18, '#fff', '#ffd36b'); flower(c, x + r * 0.4, y + r * 0.2, r * 0.18, '#ffc2d4', '#ffd36b');
}
function token(c, x, y, r, col) { rr(c, x - r * 0.6, y - r, r * 1.2, r * 2, r * 0.25); F(c, col || '#c99a5a', OL, 2.5); E(c, x, y - r * 0.75, r * 0.14, r * 0.14); F(c, '#5a3a10'); txt(c, '腰', x, y - r * 0.15, r * 0.6, '#5a2a10'); txt(c, '牌', x, y + r * 0.5, r * 0.6, '#5a2a10'); c.strokeStyle = '#e0344a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y - r * 0.9); c.quadraticCurveTo(x - r * 0.4, y - r * 1.4, x - r * 0.2, y - r * 1.7); c.stroke(); }
function duck(c, x, y, r, t) {
  E(c, x, y + r * 0.35, r * 1.4, r * 0.38); F(c, '#fff', '#4a8fd0', 2);
  E(c, x, y, r, r * 0.6); F(c, lg(c, x, y - r * 0.6, x, y + r * 0.6, [[0, '#e8a03a'], [1, '#a8501a']]), OL, 2.5);
  c.beginPath(); c.moveTo(x - r * 0.8, y - r * 0.2); c.quadraticCurveTo(x - r * 1.3, y - r * 0.9, x - r * 1.05, y - r * 1.05); F(c, null, OL, 2.5);
  E(c, x - r * 1.05, y - r * 1.05, r * 0.22, r * 0.18); F(c, '#c8702a', OL, 2); c.beginPath(); c.moveTo(x - r * 1.25, y - r * 1.05); c.lineTo(x - r * 1.5, y - r * 1.0); c.lineTo(x - r * 1.25, y - r * 0.95); F(c, '#f2c24d', OL, 1.5);
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.12, -0.4, 0, TAU); c.fill();
  for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; c.globalAlpha = 0.6 * (1 - k); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + (i - 1) * r * 0.4, y - r * 0.6); c.quadraticCurveTo(x + (i - 1) * r * 0.4 + Math.sin(t * 3 + i) * 6, y - r * (0.7 + k * 0.5), x + (i - 1) * r * 0.4, y - r * (0.8 + k * 0.9)); c.stroke(); } c.globalAlpha = 1;
}
function pork(c, x, y, r) { E(c, x, y + r * 0.3, r * 1.3, r * 0.4); F(c, '#fff', '#4a8fd0', 2); for (let i = 0; i < 6; i++) { rr(c, x - r * 0.9 + (i % 3) * r * 0.6, y - r * 0.4 + Math.floor(i / 3) * r * 0.42, r * 0.52, r * 0.42, r * 0.1); F(c, '#a8401a', '#5a1a0a', 1.6); c.fillStyle = '#f6d2a8'; c.fillRect(x - r * 0.9 + (i % 3) * r * 0.6 + 2, y - r * 0.32 + Math.floor(i / 3) * r * 0.42, r * 0.48, r * 0.08); } }
function flame(c, x, y, r, t, k) {
  const f = 1 + Math.sin(t * 11 + (k || 0)) * 0.12;
  c.save(); c.translate(x, y); c.scale(f, 1 / f);
  c.beginPath(); c.moveTo(0, -r * 1.6); c.quadraticCurveTo(r * 0.9, -r * 0.6, r * 0.6, 0); c.quadraticCurveTo(0, r * 0.4, -r * 0.6, 0); c.quadraticCurveTo(-r * 0.9, -r * 0.6, 0, -r * 1.6); F(c, '#ff6a2a', '#a82a10', 2);
  c.beginPath(); c.moveTo(0, -r * 0.9); c.quadraticCurveTo(r * 0.45, -r * 0.3, r * 0.3, 0); c.quadraticCurveTo(0, r * 0.2, -r * 0.3, 0); c.quadraticCurveTo(-r * 0.45, -r * 0.3, 0, -r * 0.9); F(c, '#ffd84a');
  c.restore();
}
function bucket(c, x, y, r) { c.beginPath(); c.moveTo(x - r * 0.8, y - r * 0.6); c.lineTo(x - r * 0.6, y + r * 0.6); c.lineTo(x + r * 0.6, y + r * 0.6); c.lineTo(x + r * 0.8, y - r * 0.6); c.closePath(); F(c, '#a8743a', OL, 2.5); E(c, x, y - r * 0.6, r * 0.8, r * 0.22); F(c, '#7ac0e8', OL, 2); c.strokeStyle = '#5a3a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - r * 0.7, y - r * 0.1); c.lineTo(x + r * 0.7, y - r * 0.1); c.stroke(); c.beginPath(); c.arc(x, y - r * 0.6, r * 0.8, Math.PI, 0); c.stroke(); }
function beam(c, x, y, w, h, rot) { c.save(); c.translate(x, y); c.rotate(rot || 0); rr(c, -w / 2, -h / 2, w, h, 3); F(c, '#6a3a1a', OL, 2.5); c.fillStyle = '#3a1a0a'; for (let i = 0; i < 4; i++) c.fillRect(-w / 2 + w * (0.15 + i * 0.22), -h / 2, 2, h); c.restore(); }
function flowerPot(c, x, y, r, t) { c.beginPath(); c.moveTo(x - r * 0.7, y - r * 0.3); c.lineTo(x - r * 0.5, y + r * 0.6); c.lineTo(x + r * 0.5, y + r * 0.6); c.lineTo(x + r * 0.7, y - r * 0.3); c.closePath(); F(c, '#c8642a', OL, 2.5); rr(c, x - r * 0.8, y - r * 0.45, r * 1.6, r * 0.25, 4); F(c, '#d8743a', OL, 2);
  c.strokeStyle = '#3f8a3a'; c.lineWidth = 3; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(x + i * r * 0.2, y - r * 0.45); c.quadraticCurveTo(x + i * r * 0.5, y - r * 1.1, x + i * r * 0.55, y - r * 1.3); c.stroke(); flower(c, x + i * r * 0.55, y - r * 1.35 + Math.sin(t * 2 + i) * 2, r * 0.28, ['#ff8ab0', '#fff', '#ffd36b'][i + 1], '#ffd36b'); } }
A.wineCup = wineCup; A.winePot = winePot; A.token = token; A.duck = duck; A.flame = flame; A.bucket = bucket; A.beam = beam; A.flowerPot = flowerPot;
const prevProp = A.PROP_EXT;
A.PROP_EXT = function (c, prop, t) {
  if (prevProp) prevProp(c, prop, t);
  switch (prop) {
    case 'hu': rr(c, -6, -46, 12, 52, 5); F(c, '#f2e6c8', OL, 2); break; // 笏板
    case 'wine': wineCup(c, 0, -4, 16, '#e8b84a', t); break;
    case 'winepot': winePot(c, 0, -10, 15, t); break;
    case 'token': token(c, 0, -8, 14); break;
    case 'duck': duck(c, 0, -6, 18, t); break;
    case 'flowerpot': flowerPot(c, 0, -2, 18, t); break;
    case 'clipboard': rr(c, -16, -28, 32, 40, 4); F(c, '#c99a5a', OL, 2); rr(c, -12, -22, 24, 30, 2); F(c, '#fff', OL, 1); c.strokeStyle = '#8a9ab0'; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-9, -16 + i * 7); c.lineTo(9, -16 + i * 7); c.stroke(); } break;
  }
};
const prevOrn = A.ORN_EXT;
A.ORN_EXT = function (c, orn, t, sp) {
  if (prevOrn) prevOrn(c, orn, t, sp);
  if (orn.includes('wushamao')) { c.save(); c.translate(0, -282); // 乌纱帽：两只会晃的帽翅
    c.beginPath(); c.moveTo(-50, 18); c.quadraticCurveTo(-54, -30, 0, -34); c.quadraticCurveTo(54, -30, 50, 18); c.closePath(); F(c, '#1e1a22', OL, 3);
    rr(c, -56, 8, 112, 16, 6); F(c, '#2a2430', OL, 2.5); E(c, 0, -30, 26, 12); F(c, '#2a2430', OL, 2.5);
    const sw = Math.sin(t * 3) * 0.08; [-1, 1].forEach(s => { c.save(); c.translate(s * 50, 4); c.rotate(s * sw); rr(c, s > 0 ? 0 : -46, -6, 46, 12, 6); F(c, '#1e1a22', OL, 2.5); c.restore(); });
    c.restore(); }
  if (orn.includes('mustache')) { [-1, 1].forEach(s => { c.beginPath(); c.moveTo(0, -176); c.quadraticCurveTo(s * 14, -184, s * 26, -172 + Math.sin(t * 2) * 1.5); c.quadraticCurveTo(s * 14, -178, 0, -172); F(c, '#2a2020', OL, 1.2); }); c.beginPath(); c.moveTo(-4, -160); c.quadraticCurveTo(0, -146, 4, -160); F(c, '#2a2020'); }
  if (orn.includes('mask')) { c.beginPath(); c.moveTo(-58, -196); c.quadraticCurveTo(0, -188, 58, -196); c.lineTo(52, -158); c.quadraticCurveTo(0, -132, -52, -158); c.closePath(); F(c, '#1a1820', OL, 2.5); c.strokeStyle = '#3a3644'; c.lineWidth = 1.5; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 18 - 8, -180); c.lineTo(i * 18 + 8, -170); c.stroke(); } }
  if (orn.includes('nurseCap')) { c.save(); c.translate(0, -292); rr(c, -26, -10, 52, 18, 5); F(c, '#fff', '#c8a0b0', 2); c.fillStyle = '#e2577e'; c.fillRect(-3, -8, 6, 14); c.fillRect(-7, -4, 14, 6); c.restore(); }
};

/* ---------- 场景 ---------- */
BG.bairiyan = function (c, W, H) { // 百日宴大殿
  c.fillStyle = lg(c, 0, 0, 0, H * 0.6, [[0, '#6a1a1e'], [1, '#a8322e']]); c.fillRect(0, 0, W, H * 0.6);
  for (let i = 0; i < 6; i++) { const x = W * (0.06 + i * 0.176); rr(c, x - W * 0.018, H * 0.04, W * 0.036, H * 0.56, 4); F(c, lg(c, x - W * 0.02, 0, x + W * 0.02, 0, [[0, '#c0392b'], [0.5, '#e8574a'], [1, '#a02a22']]), OL, 2.5);
    c.strokeStyle = '#f2c24d'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x - W * 0.018, H * (0.16 + k * 0.14)); c.quadraticCurveTo(x, H * (0.14 + k * 0.14), x + W * 0.018, H * (0.16 + k * 0.14)); c.stroke(); } }
  roofTiles(c, -10, -H * 0.02, W + 20, H * 0.07, '#f7cf5a', '#d99a1e');
  plaque(c, '百日宴', W * 0.5, H * 0.12, Math.min(W * 0.2, H * 0.26), H * 0.06);
  // 帷幔
  c.fillStyle = 'rgba(242,194,77,0.85)'; for (let i = 0; i < 12; i++) { const x = i * W / 11; c.beginPath(); c.moveTo(x - W / 22, H * 0.05); c.quadraticCurveTo(x, H * 0.11, x + W / 22, H * 0.05); c.closePath(); c.fill(); }
  // 屏风
  rr(c, W * 0.34, H * 0.2, W * 0.32, H * 0.3, 6); F(c, '#f6e2b0', OL, 3); for (let i = 1; i < 4; i++) { c.fillStyle = '#c99a5a'; c.fillRect(W * 0.34 + i * W * 0.08 - 1, H * 0.2, 2, H * 0.3); }
  for (let i = 0; i < 4; i++) { A.peony ? A.peony(c, W * (0.38 + i * 0.08), H * 0.36, H / 1300, '#e8304a', 0) : flower(c, W * (0.38 + i * 0.08), H * 0.36, H * 0.03, '#e8304a', '#ffd36b'); }
  // 地面
  c.fillStyle = lg(c, 0, H * 0.6, 0, H, [[0, '#d8a85a'], [1, '#b8803a']]); c.fillRect(0, H * 0.6, W, H * 0.4);
  c.strokeStyle = 'rgba(90,50,10,0.25)'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(W * 0.5, H * 0.6); c.lineTo(W * (i / 8) * 1.6 - W * 0.3, H); c.stroke(); }
  // 红毯
  c.fillStyle = '#c0392b'; c.beginPath(); c.moveTo(W * 0.44, H * 0.6); c.lineTo(W * 0.56, H * 0.6); c.lineTo(W * 0.7, H); c.lineTo(W * 0.3, H); c.closePath(); c.fill();
  // 两侧宴桌
  [[0.04, 0.66], [0.04, 0.8], [0.72, 0.66], [0.72, 0.8]].forEach(([x, y]) => { rr(c, W * x, H * y, W * 0.24, H * 0.06, 6); F(c, '#8a3a1a', OL, 2.5); for (let i = 0; i < 4; i++) { E(c, W * (x + 0.03 + i * 0.06), H * (y + 0.012), W * 0.018, H * 0.01); F(c, '#fff', '#4a8fd0', 1.2); } });
};
BG.huochang = function (c, W, H) { // 火场：偏殿着火
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#2a0e0a'], [0.5, '#6a1e10'], [1, '#3a1a10']]); c.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { const x = W * (0.1 + i * 0.2); rr(c, x - W * 0.015, 0, W * 0.03, H * 0.66, 3); F(c, '#4a1a10', OL, 2); }
  c.strokeStyle = '#2a0a06'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, H * 0.12); c.lineTo(W, H * 0.16); c.stroke();
  // 窗格
  rr(c, W * 0.36, H * 0.18, W * 0.28, H * 0.28, 4); F(c, '#ffb84a', OL, 3); c.strokeStyle = '#4a1a10'; c.lineWidth = 4; for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(W * 0.36 + i * W * 0.07, H * 0.18); c.lineTo(W * 0.36 + i * W * 0.07, H * 0.46); c.stroke(); c.beginPath(); c.moveTo(W * 0.36, H * 0.18 + i * H * 0.07); c.lineTo(W * 0.64, H * 0.18 + i * H * 0.07); c.stroke(); }
  c.fillStyle = '#3a2016'; c.fillRect(0, H * 0.66, W, H * 0.34);
  c.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = 0; x < W; x += 80) c.fillRect(x, H * 0.66, 2, H * 0.34);
  beam(c, W * 0.2, H * 0.84, W * 0.22, H * 0.035, 0.12); beam(c, W * 0.8, H * 0.9, W * 0.18, H * 0.03, -0.2);
};
BG.hospital = function (c, W, H) { // 现代医院病房
  c.fillStyle = lg(c, 0, 0, 0, H * 0.62, [[0, '#eef4f8'], [1, '#dce8ee']]); c.fillRect(0, 0, W, H * 0.62);
  rr(c, W * 0.58, H * 0.1, W * 0.3, H * 0.32, 6); F(c, '#bfe3ff', '#8aa0b0', 4); c.strokeStyle = '#8aa0b0'; c.lineWidth = 3; c.beginPath(); c.moveTo(W * 0.73, H * 0.1); c.lineTo(W * 0.73, H * 0.42); c.stroke();
  cloud(c, W * 0.68, H * 0.2, H / 1400, '#fff'); tree(c, W * 0.82, H * 0.42, H / 1300, true);
  c.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 6; i++) c.fillRect(W * 0.04, H * (0.12 + i * 0.05), W * 0.08, H * 0.03);
  rr(c, W * 0.18, H * 0.16, W * 0.12, H * 0.2, 4); F(c, '#2a3a4a', OL, 2.5); c.strokeStyle = '#4ae08a'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 20; i++) { const x = W * (0.19 + i * 0.005), y = H * 0.26 + (i === 8 ? -H * 0.05 : i === 9 ? H * 0.04 : 0); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  c.fillStyle = '#c8d8e0'; c.fillRect(0, H * 0.62, W, H * 0.38); c.fillStyle = 'rgba(255,255,255,0.4)'; for (let x = 0; x < W; x += 60) c.fillRect(x, H * 0.62, 2, H * 0.38);
  rr(c, W * 0.3, H * 0.56, W * 0.42, H * 0.14, 8); F(c, '#fff', '#8aa0b0', 3); rr(c, W * 0.3, H * 0.52, W * 0.1, H * 0.08, 8); F(c, '#f6f8fb', '#8aa0b0', 2);
  rr(c, W * 0.76, H * 0.5, W * 0.1, H * 0.16, 4); F(c, '#e8eef2', '#8aa0b0', 2); A.drawProp && A.drawProp(c, 'milktea', 0, W * 0.81, H * 0.5);
};
BG.naichapu = function (c, W, H) { // 玉京街头·奶茶铺
  c.fillStyle = lg(c, 0, 0, 0, H * 0.55, [[0, '#9fd8f6'], [1, '#e8f6ff']]); c.fillRect(0, 0, W, H * 0.55);
  cloud(c, W * 0.2, H * 0.1, H / 900, '#fff'); cloud(c, W * 0.75, H * 0.14, H / 1100, '#fff');
  for (let k = 0; k < 3; k++) { const x = W * (k * 0.36 - 0.04), w = W * 0.32; c.fillStyle = ['#e8d8b8', '#f2e2c2', '#e0ccaa'][k]; c.fillRect(x, H * 0.22, w, H * 0.4); roofTiles(c, x - 10, H * 0.16, w + 20, H * 0.08, '#6a7a8a', '#4a5a6a'); }
  rr(c, W * 0.34, H * 0.3, W * 0.32, H * 0.32, 4); F(c, '#fff4e0', OL, 3); plaque(c, '珍珠奶茶', W * 0.5, H * 0.27, Math.min(W * 0.18, H * 0.24), H * 0.05);
  rr(c, W * 0.36, H * 0.46, W * 0.28, H * 0.06, 4); F(c, '#c99a5a', OL, 2.5); for (let i = 0; i < 4; i++) A.drawProp && A.drawProp(c, 'milktea', 0, W * (0.4 + i * 0.065), H * 0.45);
  c.fillStyle = '#e2577e'; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(W * (0.34 + i * 0.036), H * 0.3); c.lineTo(W * (0.352 + i * 0.036), H * 0.35); c.lineTo(W * (0.364 + i * 0.036), H * 0.3); c.fill(); }
  c.fillStyle = '#c8b898'; c.fillRect(0, H * 0.62, W, H * 0.38); c.fillStyle = 'rgba(120,100,70,0.2)'; for (let i = 0; i < 40; i++) rr(c, (i * 97) % W, H * (0.66 + (i % 5) * 0.06), W * 0.06, H * 0.03, 3), c.fill();
  // 鸭子
  for (let i = 0; i < 3; i++) { const x = W * (0.12 + i * 0.05), y = H * 0.82; E(c, x, y, W * 0.018, H * 0.022); F(c, '#fff', OL, 2); E(c, x - W * 0.014, y - H * 0.025, W * 0.01, H * 0.012); F(c, '#fff', OL, 1.6); c.fillStyle = '#f2a03a'; c.fillRect(x - W * 0.03, y - H * 0.027, W * 0.008, H * 0.006); }
};
BG.dawn = function (c, W, H) { // 第一百零一天的清晨
  c.fillStyle = lg(c, 0, 0, 0, H * 0.6, [[0, '#ffd9b0'], [0.6, '#ffeed8'], [1, '#fff6ea']]); c.fillRect(0, 0, W, H * 0.6);
  const r = Math.min(W, H) * 0.1; E(c, W * 0.5, H * 0.42, r, r); F(c, rg(c, W * 0.5, H * 0.42, 0, r, [[0, '#fff6c0'], [1, '#ffb84a']]));
  roofTiles(c, W * 0.05, H * 0.38, W * 0.9, H * 0.06, '#f7cf5a', '#d99a1e'); c.fillStyle = '#c7443f'; c.fillRect(W * 0.08, H * 0.44, W * 0.84, H * 0.18);
  for (let i = 0; i < 7; i++) { rr(c, W * (0.12 + i * 0.115), H * 0.47, W * 0.06, H * 0.15, 3); F(c, '#8a2a22', OL, 2); }
  c.fillStyle = '#e8d8b8'; c.fillRect(0, H * 0.62, W, H * 0.38); floorTiles && floorTiles(c, H * 0.62, H, W);
};
const prevAnim = A.ANIM_EXT;
A.ANIM_EXT = function (c, name, W, H, t) {
  if (prevAnim) prevAnim(c, name, W, H, t);
  if (name === 'bairiyan') { for (let i = 0; i < 5; i++) lantern(c, W * (0.1 + i * 0.2), H * 0.13 + Math.sin(t * 1.5 + i) * 3, H / 800, t, true); }
  if (name === 'huochang') { const r = Math.min(W, H) * 0.05; for (let i = 0; i < 9; i++) flame(c, W * ((i * 0.123 + 0.04) % 1), H * (0.66 + (i % 3) * 0.1), r * (0.8 + (i % 4) * 0.25), t, i);
    for (let i = 0; i < 5; i++) flame(c, W * (0.38 + i * 0.06), H * 0.2, r * 0.5, t, i + 3);
    c.globalAlpha = 0.3; for (let i = 0; i < 4; i++) { const k = (t * 0.1 + i / 4) % 1; cloud(c, W * (0.2 + i * 0.22), H * (0.5 - k * 0.5), H / 700 * (1 + k), '#3a3030'); } c.globalAlpha = 1;
    for (let i = 0; i < 16; i++) { const k = (t * 0.4 + i / 16) % 1; c.fillStyle = 'rgba(255,200,80,' + (1 - k) + ')'; c.fillRect(W * ((i * 0.37) % 1) + Math.sin(t * 3 + i) * 10, H * (0.9 - k * 0.8), 3, 3); } }
  if (name === 'dawn') { c.globalAlpha = 0.25; c.strokeStyle = '#fff6c0'; c.lineWidth = 6; for (let i = 0; i < 10; i++) { const a = -Math.PI + i * Math.PI / 9 + Math.sin(t * 0.3) * 0.02; c.beginPath(); c.moveTo(W * 0.5, H * 0.42); c.lineTo(W * 0.5 + Math.cos(a) * W, H * 0.42 + Math.sin(a) * W); c.stroke(); } c.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { const x = ((t * 30 + i * W / 3) % (W + 60)) - 30; c.strokeStyle = '#5a4a3a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 8, H * (0.2 + i * 0.05)); c.quadraticCurveTo(x - 4, H * (0.19 + i * 0.05) - Math.abs(Math.sin(t * 6 + i)) * 4, x, H * (0.2 + i * 0.05)); c.quadraticCurveTo(x + 4, H * (0.19 + i * 0.05) - Math.abs(Math.sin(t * 6 + i)) * 4, x + 8, H * (0.2 + i * 0.05)); c.stroke(); } }
  if (name === 'naichapu') { for (let i = 0; i < 4; i++) { const k = (t * 0.5 + i / 4) % 1; c.globalAlpha = 0.5 * (1 - k); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(W * (0.4 + i * 0.065), H * 0.4); c.quadraticCurveTo(W * (0.4 + i * 0.065) + Math.sin(t * 3 + i) * 6, H * (0.38 - k * 0.05), W * (0.4 + i * 0.065), H * (0.36 - k * 0.08)); c.stroke(); } c.globalAlpha = 1; }
};

/* ---------- 第五章死法场景 ---------- */
const T = (c, s, str, x, y, cx, by, size, col) => txt(c, str, cx + x * s, by + y * s, size * s, col);
const D = A.DPROPS = A.DPROPS || {};
const dim = (c, cx, by, s, a, col) => { c.fillStyle = col || 'rgba(16,20,50,' + (a || 0.5) + ')'; c.fillRect(cx - 230 * s, by - 430 * s, 460 * s, 430 * s); };
const who = (c, id, x, cx, by, s, t, face, k, extra) => A.drawChar(c, id, cx + x * s, by, s * (k || 0.5), Object.assign({ t, face, still: true }, extra || {}));
const card = (c, x, y, s, label, col, rot) => { c.save(); c.translate(x, y); c.rotate(rot || 0); rr(c, -34 * s, -46 * s, 68 * s, 92 * s, 6 * s); F(c, col || '#fff6e0', OL, 2); txt(c, label, 0, 0, 14 * s, '#8a2a2a'); c.restore(); };
D.chain = { front: (c, cx, by, s, t) => { for (let i = 0; i < 5; i++) { const x = cx + (-180 + i * 70) * s, y = by - 340 * s; c.lineWidth = 6 * s; c.strokeStyle = i === 3 ? 'rgba(160,160,160,0.3)' : '#c99a3a'; c.beginPath(); c.ellipse(x, y, 28 * s, 16 * s, 0, 0, TAU); c.stroke(); } T(c, s, '缺一环', 30, -300, cx, by, 18, '#c0392b'); who(c, 'ningpin', 150, cx, by, s, t, 'smirk'); T(c, s, '诬告！', 150, -260, cx, by, 20, '#3f7a62'); } };
D.crystal = { front: (c, cx, by, s, t) => { E(c, cx + 140 * s, by - 150 * s, 40 * s, 40 * s); F(c, rg(c, cx + 130 * s, by - 160 * s, 4 * s, 40 * s, [[0, '#fff'], [1, '#b9a7d6']]), '#5a3a9a', 3); for (let i = 0; i < 3; i++) sparkle(c, cx + (110 + i * 30) * s, by - (200 + Math.sin(t * 3 + i) * 10) * s, 8 * s, '#fff'); T(c, s, '上辈子看到的', 140, -90, cx, by, 15, '#5a3a9a'); T(c, s, '妖女！', -140, -330, cx, by, 26, '#c0392b'); for (let i = 0; i < 3; i++) A.drawEmote(c, cx + (-170 + i * 50) * s, by - 260 * s, s * 0.8, '!', 0.5); } };
D.wine = { front: (c, cx, by, s, t) => { winePot(c, cx + 140 * s, by - 110 * s, 40 * s, t); wineCup(c, cx - 140 * s, by - 60 * s, 28 * s, '#b8d04a', t); for (let k = 0; k < 3; k++) { const ph = (t * 0.8 + k / 3) % 1; c.globalAlpha = 1 - ph; E(c, cx + (-150 + k * 10) * s, by - (70 + ph * 40) * s, 4 * s, 4 * s); F(c, 'rgba(255,255,255,0.6)', '#7a8a6a', 1); c.globalAlpha = 1; } T(c, s, '二十年女儿红', -140, -330, cx, by, 18, '#8e6128'); T(c, s, '三十年老配方', 140, -190, cx, by, 15, '#8a2a2a'); } };
D.fire = { back: (c, cx, by, s, t) => { dim(c, cx, by, s, 0, 'rgba(90,20,10,0.55)'); for (let i = 0; i < 7; i++) flame(c, cx + (-200 + i * 66) * s, by - 30 * s, 34 * s, t, i); },
  front: (c, cx, by, s, t) => { c.globalAlpha = 0.45; for (let i = 0; i < 3; i++) cloud(c, cx + (-120 + i * 120) * s, by - (300 + Math.sin(t + i) * 10) * s, s * 0.5, '#2a2020'); c.globalAlpha = 1; T(c, s, '走水了！', -140, -330, cx, by, 26, '#ffd84a'); T(c, s, '咳咳咳', 140, -250, cx, by, 18, '#fff'); } };
D.token = { front: (c, cx, by, s, t) => { who(c, 'cike', 150, cx, by, s, t, 'normal'); token(c, cx + 150 * s, by - 120 * s + Math.sin(t * 3) * 4 * s, 24 * s); T(c, s, '你的腰牌', 150, -60, cx, by, 15, '#8a2a2a'); T(c, s, '我只是丢了个东西！', -120, -330, cx, by, 16, '#5a3a2a'); } };
D.pork = { front: (c, cx, by, s, t) => { c.save(); c.translate(cx, by - 330 * s + Math.sin(t * 4) * 6 * s); c.rotate(0.3); pork(c, 0, 0, 40 * s); c.restore(); T(c, s, '肥而不腻', 150, -200, cx, by, 16, '#a8401a'); T(c, s, '咣！', -150, -280, cx, by, 30, '#c0392b'); who(c, 'emperor', 160, cx, by, s, t, 'shock', 0.42); } };
D.seat = { front: (c, cx, by, s, t) => { rr(c, cx - 200 * s, by - 80 * s, 120 * s, 60 * s, 6); F(c, '#c0392b', OL, 2.5); T(c, s, '空位', -140, -110, cx, by, 16, '#fff'); who(c, 'guifei', 150, cx, by, s, t, 'angry'); T(c, s, '本宫的位置？', 150, -280, cx, by, 16, '#c0392b'); } };
D.speech = { front: (c, cx, by, s, t) => { rr(c, cx + 60 * s, by - 380 * s, 170 * s, 260 * s, 6); F(c, '#fffaf0', OL, 2); ['首先感谢太后', '其次感谢皇上', '再次感谢御膳房', '感谢糯米', '感谢白菜', '……'].forEach((l, i) => T(c, s, l, 145, -350 + i * 36, cx, by, 13, '#5a3a2a')); T(c, s, '第 20 分钟', -140, -330, cx, by, 18, '#c0392b'); } };
D.silence = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.35), front: (c, cx, by, s, t) => { for (let i = 0; i < 5; i++) who(c, ['taijian', 'gao', 'guard', 'momo', 'taijian'][i], -200 + i * 100, cx, by - 200 * s, s, t, 'sweat', 0.28); T(c, s, '……', 0, -330, cx, by, 40, '#5a5a6a'); T(c, s, '（研究鞋子）', 140, -100, cx, by, 14, '#5a5a6a'); } };
D.shards = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.6), front: (c, cx, by, s, t) => { for (let i = 0; i < 9; i++) { c.save(); c.translate(cx + ((i * 61) % 360 - 180) * s, by - (40 + (i * 37) % 120) * s); c.rotate(i); c.beginPath(); c.moveTo(0, -14 * s); c.lineTo(12 * s, 8 * s); c.lineTo(-10 * s, 10 * s); c.closePath(); F(c, '#cfd8ff', '#5a6aa8', 1.5); c.restore(); } T(c, s, '太早了', -140, -330, cx, by, 24, '#dfe8ff'); T(c, s, '孟婆：不收', 140, -260, cx, by, 15, '#b9a7d6'); } };
D.lastcup = { front: (c, cx, by, s, t) => { who(c, 'ningpin', 150, cx, by, s, t, 'cry'); wineCup(c, cx + 60 * s, by - 150 * s, 22 * s, '#b8d04a', t); T(c, s, '姐妹一场', 150, -290, cx, by, 16, '#3f7a62'); T(c, s, '最后一杯', -140, -330, cx, by, 22, '#8a2a2a'); } };
D.duck = { front: (c, cx, by, s, t) => { duck(c, cx + 140 * s, by - 90 * s, 50 * s, t); for (let i = 0; i < 11; i++) { E(c, cx + (-200 + (i % 6) * 34) * s, by - (18 + Math.floor(i / 6) * 22) * s, 15 * s, 6 * s); F(c, '#fff', '#4a8fd0', 1.5); } T(c, s, '第十二道', 140, -190, cx, by, 16, '#a8501a'); T(c, s, '嗝——', -140, -330, cx, by, 26, '#c0392b'); } };
D.owl = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.55), front: (c, cx, by, s, t) => { for (let i = 0; i < 6; i++) card(c, cx + (-200 + i * 30) * s, by - (30 + (i % 2) * 10) * s, s * 0.8, '证据', '#fff6e0', (i - 3) * 0.2); lantern(c, cx + 150 * s, by - 250 * s, s, t, true); T(c, s, '再看最后一遍', -140, -330, cx, by, 18, '#ffd36b'); T(c, s, '健康 0', 150, -150, cx, by, 18, '#ff8a8a'); } };
D.dance = { front: (c, cx, by, s, t) => { for (let i = 0; i < 4; i++) T(c, s, ['♪', '♫'][i % 2], -180 + i * 40, -300 - Math.abs(Math.sin(t * 4 + i)) * 30, cx, by, 26, '#e2577e'); T(c, s, '科目三', 140, -330, cx, by, 26, '#c0392b'); T(c, s, '名声 0', 140, -280, cx, by, 16, '#8a2a2a'); for (let i = 0; i < 4; i++) who(c, ['taijian', 'momo', 'guard', 'lizhaoyi'][i], -200 + i * 40, cx, by, s, t, 'shock', 0.26); } };
D.eye = { front: (c, cx, by, s, t) => { E(c, cx + 140 * s, by - 200 * s, 60 * s, 30 * s); F(c, '#fff', OL, 3); E(c, cx + 140 * s + Math.sin(t) * 10 * s, by - 200 * s, 18 * s, 18 * s); F(c, '#5a3a9a'); T(c, s, '疑心 100', 140, -130, cx, by, 18, '#5a3a9a'); T(c, s, '我只是死得比较多', -110, -330, cx, by, 15, '#5a3a2a'); } };
D.debt = { front: (c, cx, by, s, t) => { c.save(); c.translate(cx + 140 * s, by - 200 * s); c.rotate(0.1); rr(c, -60 * s, -130 * s, 120 * s, 260 * s, 4); F(c, '#fffaf0', OL, 2); ['欠条', '点心 3 两', '人情 1 份', '王公公 100 两', '利息 ×2', '利息 ×4', '……'].forEach((l, i) => txt(c, l, 0, (-100 + i * 34) * s, 13 * s, i ? '#5a3a2a' : '#c0392b')); c.restore(); T(c, s, '集体遗忘', -140, -330, cx, by, 22, '#5a5070'); } };
D.three = { front: (c, cx, by, s, t) => { who(c, 'huanghou', -60, cx, by - 180 * s, s, t, 'smirk', 0.3); who(c, 'guifei', 60, cx, by - 180 * s, s, t, 'angry', 0.3); who(c, 'ningpin', 170, cx, by - 180 * s, s, t, 'smile', 0.3); T(c, s, '茶', -60, -50, cx, by, 16, '#3a4a7a'); T(c, s, '簪', 60, -50, cx, by, 16, '#c0392b'); T(c, s, '糕', 170, -50, cx, by, 16, '#3f7a62'); T(c, s, '谁赢了？', -160, -330, cx, by, 18, '#5a3a2a'); } };
D.pearl = { front: (c, cx, by, s, t) => { A.drawProp(c, 'milktea', t, cx + 120 * s, by - 60 * s); for (let i = 0; i < 4; i++) { E(c, cx + (110 + i * 12) * s, by - (200 + Math.sin(t * 5 + i) * 20) * s, 6 * s, 6 * s); F(c, '#3a2018'); } T(c, s, '哈哈哈——咳！', -120, -330, cx, by, 18, '#e2577e'); T(c, s, 'No.000 · 再会', 130, -280, cx, by, 14, '#8e6128'); } };
D.crack = { back: (c, cx, by, s, t) => { dim(c, cx, by, s, 0.5); A.mirrorDisc(c, cx, by - 250 * s, 140 * s, t, false); c.strokeStyle = '#fff'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(cx - 100 * s, by - 340 * s); c.lineTo(cx - 20 * s, by - 260 * s); c.lineTo(cx - 60 * s, by - 200 * s); c.lineTo(cx + 40 * s, by - 150 * s); c.stroke(); },
  front: (c, cx, by, s, t) => { T(c, s, '咔', -170, -330, cx, by, 30, '#fff'); T(c, s, '第一百天', 150, -80, cx, by, 16, '#dfe8ff'); } };

/* ---------- 结局纪念画 ---------- */
const EA = A.ENDART = {};
const ch = (c, id, x, y, s, t, face, extra) => A.drawChar(c, id, x, y, s, Object.assign({ t, face }, extra || {}));
EA.E_power = (c, W, H, t) => { A.drawBG(c, 'kunning', W, H, t); const s = H / 520; ch(c, 'huanghou', W * 0.3, H * 0.98, s, t, 'smile'); ch(c, 'me', W * 0.62, H * 0.98, s * 1.05, t, 'smirk', { prop: 'scroll', pose: 'scroll' }); rr(c, W * 0.66, H * 0.08, W * 0.3, H * 0.2, 8); F(c, '#fffaf0', OL, 3); txt(c, '后宫双休制', W * 0.81, H * 0.14, H * 0.045, '#c0392b'); txt(c, '食品安全 每顿三遍', W * 0.81, H * 0.22, H * 0.032, '#5a3a2a'); };
EA.E_shang = (c, W, H, t) => { A.drawBG(c, 'room_day', W, H, t); const s = H / 520; ch(c, 'guimama', W * 0.28, H * 0.98, s, t, 'cry'); ch(c, 'me', W * 0.6, H * 0.98, s * 1.05, t, 'smile', { prop: 'scroll', pose: 'scroll' }); rr(c, W * 0.7, H * 0.06, W * 0.27, H * 0.3, 6); F(c, '#c0392b', OL, 3); txt(c, '大晟后宫', W * 0.835, H * 0.14, H * 0.04, '#ffe08a'); txt(c, '生存手册', W * 0.835, H * 0.21, H * 0.04, '#ffe08a'); txt(c, '第一条：别笑太大声', W * 0.835, H * 0.29, H * 0.022, '#fff'); };
EA.E_sea = (c, W, H, t) => { A.drawBG(c, 'naichapu', W, H, t); const s = H / 560; ch(c, 'me', W * 0.5, H * 0.98, s, t, 'smile', { prop: 'milktea', pose: 'hold' }); ch(c, 'luzheng', W * 0.78, H * 0.98, s, t, 'blush'); ch(c, 'xiaoan', W * 0.22, H * 0.98, s * 0.95, t, 'smile'); };
EA.E_doc = (c, W, H, t) => { A.drawBG(c, 'taiyiyuan', W, H, t); const s = H / 520; ch(c, 'wen', W * 0.3, H * 0.98, s, t, 'smile'); ch(c, 'me', W * 0.65, H * 0.98, s * 1.05, t, 'smirk', { prop: 'medpot', pose: 'hold' }); txt(c, '女医官', W * 0.65, H * 0.12, H * 0.06, '#2f5a50'); };
EA.E_sis = (c, W, H, t) => { A.drawBG(c, 'changchun', W, H, t); const s = H / 520; ch(c, 'guifei', W * 0.32, H * 0.98, s, t, 'smile'); ch(c, 'me', W * 0.66, H * 0.98, s, t, 'smile'); for (let i = 0; i < 14; i++) { E(c, W * (0.4 + (i * 0.037) % 0.2), H * (0.84 + (i % 3) * 0.03), H * 0.008, H * 0.004); F(c, '#3a2a2a'); } txt(c, '一天三斤瓜子', W * 0.5, H * 0.1, H * 0.05, '#c0392b'); };
EA.E_farm = (c, W, H, t) => { A.drawBG(c, 'lenggong', W, H, t); const s = H / 560; ch(c, 'jingtaifei', W * 0.2, H * 0.98, s, t, 'smile'); ch(c, 'me', W * 0.42, H * 0.98, s, t, 'smile', { prop: 'cabbage', pose: 'hold' }); ch(c, 'emperor', W * 0.64, H * 0.98, s, t, 'smile'); ch(c, 'taihou', W * 0.84, H * 0.98, s, t, 'smile'); txt(c, '今日菜单：白菜炖白菜', W * 0.5, H * 0.08, H * 0.04, '#3f7a2a'); };
EA.E_dream = (c, W, H, t) => { A.drawBG(c, 'carriage', W, H, t); const s = H / 520; ch(c, 'me', W * 0.5, H * 0.98, s, t, 'sweat'); A.mirrorDisc(c, W * 0.84, H * 0.2, H * 0.1, t, false); c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(W * 0.8, H * 0.12); c.lineTo(W * 0.85, H * 0.2); c.lineTo(W * 0.82, H * 0.28); c.stroke(); };
EA.E_her = (c, W, H, t) => { A.drawBG(c, 'yonghe_night', W, H, t); const s = H / 520; ch(c, 'me', W * 0.5, H * 0.98, s * 1.05, t, 'smirk', { prop: 'winepot', pose: 'hold' }); c.globalAlpha = 0.35; ch(c, 'ningpin', W * 0.78, H * 0.98, s, t, 'smile', { ghost: true }); c.globalAlpha = 1; txt(c, '她也很爱笑', W * 0.5, H * 0.1, H * 0.05, '#b8d0c0'); };
EA.E_home = (c, W, H, t) => { A.drawBG(c, 'hospital', W, H, t); const s = H / 540; ch(c, 'doctor', W * 0.22, H * 0.98, s, t, 'smile'); ch(c, 'modern', W * 0.5, H * 0.98, s, t, 'smile', { prop: 'none' }); ch(c, 'nurse', W * 0.78, H * 0.98, s, t, 'smile'); };
EA.E_true = (c, W, H, t) => { A.drawBG(c, 'dawn', W, H, t); const s = H / 600; ch(c, 'xiaotao', W * 0.14, H * 0.98, s, t, 'smile'); ch(c, 'guifei', W * 0.32, H * 0.98, s, t, 'smile'); ch(c, 'me', W * 0.5, H * 0.98, s * 1.08, t, 'smile'); ch(c, 'jingtaifei', W * 0.68, H * 0.98, s, t, 'smile'); ch(c, 'taihou', W * 0.86, H * 0.98, s, t, 'smile');
  c.globalAlpha = 0.5 + Math.sin(t * 2) * 0.2; A.drawChar(c, 'yuanzhu', W * 0.5, H * 0.5, s * 0.6, { t, face: 'smile', ghost: true }); c.globalAlpha = 1; };
EA.E_101 = (c, W, H, t) => { A.drawBG(c, 'room_day', W, H, t); const s = H / 520; ch(c, 'xiaotao', W * 0.3, H * 0.98, s, t, 'smile', { prop: 'soup', pose: 'hold' }); ch(c, 'me', W * 0.66, H * 0.98, s, t, 'smile'); txt(c, '第一百零一天', W * 0.5, H * 0.1, H * 0.06, '#c0392b'); };
A.drawEnding = function (c, W, H, id, t) { c.save(); try { (EA[id] || EA.E_101)(c, W, H, t); } finally { c.restore(); } };
/* 片尾彩蛋：孟婆与太后的年轻合照（四十年前，奈何桥头） */
A.drawEgg = function (c, W, H, t) {
  c.save(); A.drawBG(c, 'bridge', W, H, t);
  c.fillStyle = 'rgba(255,246,220,0.25)'; c.fillRect(0, 0, W, H);
  const s = H / 520;
  A.drawChar(c, 'mengpo', W * 0.34, H * 0.98, s, { t, face: 'smile', young: true });
  A.drawChar(c, 'modern', W * 0.66, H * 0.98, s, { t, face: 'smile', prop: 'none' });
  [[W * 0.42, H * 0.42], [W * 0.58, H * 0.42]].forEach(([x, y]) => { c.save(); c.translate(x, y); c.rotate(0.2); rr(c, -8, -24, 16, 26, 6); F(c, '#ffe6d8', OL, 2); rr(c, -9, -40, 7, 20, 3); F(c, '#ffe6d8', OL, 2); rr(c, 2, -40, 7, 20, 3); F(c, '#ffe6d8', OL, 2); c.restore(); });
  c.strokeStyle = '#fff'; c.lineWidth = 10; c.strokeRect(5, 5, W - 10, H - 10);
  txt(c, '四十年前 · 奈何桥头', W * 0.5, H * 0.08, H * 0.045, '#fff'); txt(c, '“下次见！”“别再来了！”', W * 0.5, H * 0.15, H * 0.032, '#ffe08a');
  c.restore();
};
})(window.PALACE = window.PALACE || {});
