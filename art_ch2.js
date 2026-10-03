/* 第二章 / 第三章 新角色、新场景、新死亡道具 */
(function (P) {
const A = P.ART, { E, F, L, rr, lg, rg, shade, flower, star, sparkle, heart, OL, TAU } = A.util;
Object.assign(A.CH, {
  huanghou: { name: '皇后', skin: '#fff0e6', hair: '#1c1420', eye: '#3a4a7a', back: 'long', bangs: 'part', buns: 'grand', lips: '#c0475a',
    outer: '#2f5e9a', inner: '#fff6dc', skirt: '#e9cf7a', skirt2: '#c79a3a', trim: '#f2c24d', sash: '#1f3d6a', pattern: 'clouds', shawl: '#ffe7a8',
    orn: ['queenCrown', 'tassels'] },
  ningpin: { name: '宁嫔', skin: '#fff3ec', hair: '#2a1e2a', eye: '#5a7a6a', back: 'long', bangs: 'airy', buns: 'high', ribbon: '#8fc8b0', eyesDefault: 'kind',
    outer: '#bfe3cf', inner: '#ffffff', skirt: '#e4f4ea', skirt2: '#a8d6bf', trim: '#5f9e82', sash: '#3f7a62', pattern: 'sakura', shawl: '#e9f7ef',
    orn: ['jadePin', 'flowerL'] },
  luzheng: { name: '陆峥', skin: '#f9dcc8', hair: '#1a1418', eye: '#2a2a3a', back: 'none', bangs: 'none', buns: 'none', hat: 'helmet', male: true, browDefault: 'furrow',
    outer: '#3f5a7a', inner: '#e8eef5', skirt: '#2f4560', skirt2: '#24364c', trim: '#e0b84a', sash: '#a83232', pattern: 'armor', pose: 'spear', prop: 'spear', orn: [] },
  wen: { name: '温太医', skin: '#ffe8da', hair: '#2a2024', eye: '#3a3a4a', back: 'male', bangs: 'male', buns: 'topknot', male: true, glasses: true,
    outer: '#e3eeea', inner: '#ffffff', skirt: '#d4e4de', skirt2: '#a9c4ba', trim: '#4f8a7a', sash: '#2f5a50', pattern: 'none', pose: 'hold', prop: 'soup', orn: ['scholarHat'] },
  cuilv: { name: '翠缕', skin: '#ffe9dc', hair: '#3a2420', eye: '#5a3a2a', back: 'short', bangs: 'full', buns: 'side2', ribbon: '#e8a03a',
    outer: '#f2b36b', inner: '#ffffff', skirt: '#fde2bf', skirt2: '#f0be7c', trim: '#c97a2a', sash: '#d9534f', pattern: 'dots', orn: ['peach'] },
  lizhaoyi: { name: '丽昭仪', skin: '#fff0ea', hair: '#2a1424', eye: '#b04a7a', back: 'long', bangs: 'side', buns: 'high', ribbon: '#ff8ab0', eyesDefault: 'sly', lips: '#e0446a',
    outer: '#ff9fc0', inner: '#fff8fb', skirt: '#ffd0e0', skirt2: '#ff8ab0', trim: '#c2306a', sash: '#8a1f4a', pattern: 'peony', pose: 'fan', prop: 'fan', orn: ['camellia', 'buyao'] },
});
/* 额外头饰 */
A.ORN_EXT = function (c, orn, t, sp) {
  if (orn.includes('queenCrown')) {
    c.save(); c.translate(0, -300);
    c.beginPath(); c.moveTo(-44, 18); c.quadraticCurveTo(-48, -10, -30, -22); c.lineTo(-18, -4); c.lineTo(0, -30); c.lineTo(18, -4); c.lineTo(30, -22); c.quadraticCurveTo(48, -10, 44, 18); c.quadraticCurveTo(0, 6, -44, 18); c.closePath();
    F(c, lg(c, 0, -30, 0, 18, [[0, '#fff1a8'], [1, '#d99a1f']]), '#7a5210', 2.5);
    [-30, 0, 30].forEach((x, i) => { E(c, x, i === 1 ? -26 : -18, 5, 5); F(c, '#3a7ad0', OL, 1.2); });
    for (let i = 0; i < 7; i++) { E(c, -30 + i * 10, 12 - Math.abs(i - 3) * 1.5, 3, 3); F(c, '#fffaf2', '#b9a99a', 1); }
    c.beginPath(); c.moveTo(-12, -10); c.quadraticCurveTo(0, -24, 12, -10); c.quadraticCurveTo(0, -4, -12, -10); F(c, '#4aa0e0', '#1f4f8a', 1.5);
    sparkle(c, 20, -30, 5 + Math.sin(t * 3) * 1.5, '#fff');
    c.restore();
  }
  if (orn.includes('jadePin')) {
    c.save(); c.translate(36, -282); c.rotate(-0.5); c.lineCap = 'round'; c.strokeStyle = '#4f9e7e'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(-34, 0); c.stroke();
    E(c, 4, 0, 9, 7); F(c, '#9fe0c0', '#3f7a62', 2); E(c, 2, -2, 3, 2); F(c, 'rgba(255,255,255,0.8)');
    const sw = Math.sin(t * 2.4) * 3; c.strokeStyle = '#8fc8b0'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(6, 6); c.lineTo(8 + sw, 28); c.stroke(); E(c, 8 + sw, 31, 4, 4); F(c, '#fffaf2', '#8fc8b0', 1);
    c.restore();
    flower(c, 52, -258, 8, '#fff', '#c8ecd8');
  }
  if (orn.includes('scholarHat')) {
    c.save(); c.translate(0, -284);
    rr(c, -30, -22, 60, 34, 10); F(c, '#2f3a44', OL, 2.5); rr(c, -34, 4, 68, 9, 4); F(c, '#3a4a56', OL, 2);
    [-1, 1].forEach(s => { c.beginPath(); c.ellipse(s * 44, 2, 14, 4, s * 0.2, 0, TAU); F(c, '#2f3a44', OL, 2); });
    c.restore();
  }
};

/* ---------- 第二章场景 ---------- */
const BG = A.BG;
const { roofTiles, lantern, cloud, tree, palaceWall, floorTiles, txt, plaque, xiangyun } = A;
function bamboo(c, x, y, h, s) { c.save(); c.strokeStyle = '#5f9e6a'; c.lineCap = 'round'; c.lineWidth = 6 * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 6 * s, y - h); c.stroke();
  c.strokeStyle = '#3f7a4a'; c.lineWidth = 2 * s; for (let k = 1; k < 5; k++) { const yy = y - h * k / 5; c.beginPath(); c.moveTo(x - 4 * s + 6 * s * k / 5, yy); c.lineTo(x + 4 * s + 6 * s * k / 5, yy); c.stroke(); }
  for (let k = 0; k < 6; k++) { const yy = y - h * (0.3 + k * 0.12), d = k % 2 ? 1 : -1; c.save(); c.translate(x + 6 * s * (0.3 + k * 0.12), yy); c.rotate(d * 0.5); E(c, d * 16 * s, 0, 16 * s, 4 * s); F(c, '#7cc48a', '#3f7a4a', 1); c.restore(); }
  c.restore(); }
function screenFan(c, x, y, w, h, col, deco) { for (let i = 0; i < 4; i++) { rr(c, x + i * w / 4, y, w / 4 - 3, h, 3); F(c, lg(c, 0, y, 0, y + h, [[0, col], [1, shade(col, -0.15)]]), '#7a5a2a', 2); if (deco) deco(x + i * w / 4 + w / 8, y + h * 0.45, i); } }
BG.yonghe = function (c, W, H) { // 永和宫偏殿·白天
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#e9f3e6'], [1, '#d8e8d6']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(80,120,90,0.08)'; for (let x = 0; x < W; x += 46) c.fillRect(x, 0, 5, H * 0.62);
  c.fillStyle = '#7a5a3a'; c.fillRect(0, 0, W, H * 0.05); for (let i = 0; i < 14; i++) { E(c, i * W / 13, H * 0.025, W * 0.02, H * 0.014); F(c, '#9fd0b0'); }
  // 圆窗 + 竹子
  const r = Math.min(W * 0.15, H * 0.16), mx = W * 0.22, my = H * 0.3;
  c.save(); c.beginPath(); c.arc(mx, my, r, 0, TAU); c.clip(); c.fillStyle = lg(c, 0, my - r, 0, my + r, [[0, '#c8ecff'], [1, '#f2fbe8']]); c.fillRect(mx - r, my - r, 2 * r, 2 * r);
  for (let i = -2; i <= 2; i++) bamboo(c, mx + i * r * 0.35, my + r, r * 1.8, r / 110); c.restore();
  c.beginPath(); c.arc(mx, my, r, 0, TAU); F(c, null, '#7a5a3a', 7);
  // 挂画：兰花
  rr(c, W * 0.44, H * 0.1, W * 0.14, H * 0.38, 3); F(c, '#fffaf0', '#7a5a3a', 3); c.strokeStyle = '#3f6a4a'; c.lineWidth = 2; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(W * 0.51, H * 0.42); c.quadraticCurveTo(W * (0.46 + k * 0.025), H * 0.3, W * (0.45 + k * 0.03), H * (0.22 + (k % 2) * 0.04)); c.stroke(); }
  flower(c, W * 0.49, H * 0.27, H * 0.012, '#c8a8e8', '#ffe08a'); flower(c, W * 0.535, H * 0.24, H * 0.01, '#c8a8e8', '#ffe08a');
  txt(c, '静', W * 0.51, H * 0.15, H * 0.035, '#3f6a4a');
  // 屏风
  screenFan(c, W * 0.66, H * 0.14, W * 0.3, H * 0.44, '#f3ead6', (x, y, i) => { bamboo(c, x - 4, y + H * 0.16, H * 0.3, H / 1400); });
  c.fillStyle = '#8a6a4a'; c.fillRect(0, H * 0.62, W, H * 0.38);
  c.strokeStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 11; i++) { c.beginPath(); c.moveTo(i * W / 9, H * 0.62); c.lineTo(i * W / 9 - W * 0.1, H); c.stroke(); }
  // 茶桌
  rr(c, W * 0.36, H * 0.6, W * 0.28, H * 0.05, 6); F(c, '#a8744a', OL, 2.5); c.fillStyle = '#7a4a2a'; c.fillRect(W * 0.38, H * 0.65, W * 0.02, H * 0.08); c.fillRect(W * 0.6, H * 0.65, W * 0.02, H * 0.08);
  E(c, W * 0.45, H * 0.59, W * 0.025, H * 0.014); F(c, '#fff', OL, 1.5); E(c, W * 0.55, H * 0.585, W * 0.03, H * 0.02); F(c, '#dff2ea', OL, 1.5);
};
BG.yonghe_night = function (c, W, H) { BG.yonghe(c, W, H); c.fillStyle = 'rgba(30,30,80,0.55)'; c.fillRect(0, 0, W, H); };
BG.yonghe_yard = function (c, W, H) { BG.courtyard(c, W, H); const y0 = H * 0.24; plaque(c, '永和宫', W * 0.5, y0 - H * 0.005, Math.min(W * 0.24, H * 0.2), H * 0.05);
  rr(c, W * 0.12, H * 0.6, W * 0.12, H * 0.08, 4); F(c, '#8fd0b0', OL, 2); txt(c, '竹', W * 0.18, H * 0.64, H * 0.04, '#2f5a40'); };
BG.kunning = function (c, W, H) { // 坤宁宫
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#24365a'], [1, '#5a6e9a']]); c.fillRect(0, 0, W, H);
  c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, W, H * 0.08); for (let i = 0; i < 12; i++) { E(c, i * W / 11, H * 0.04, W * 0.03, H * 0.025); F(c, '#e8b84a'); }
  plaque(c, '母仪天下', W * 0.5, H * 0.13, Math.min(W * 0.36, H * 0.3), H * 0.06);
  const cx = W * 0.5, cy = H * 0.52;
  for (let i = -3; i <= 3; i++) { rr(c, cx + i * W * 0.07 - W * 0.034, cy - H * 0.36, W * 0.068, H * 0.3, 3); F(c, lg(c, 0, cy - H * 0.36, 0, cy, [[0, '#f7e7b0'], [1, '#d9b45e']]), '#8a5f10', 2); xiangyun(c, cx + i * W * 0.07 - W * 0.012, cy - H * 0.22, H / 900, '#2f5e9a'); }
  // 凤
  c.save(); c.translate(cx, cy - H * 0.25); const k = H / 700; c.scale(k, k); c.beginPath(); c.moveTo(-60, 20); c.quadraticCurveTo(-20, -40, 0, -20); c.quadraticCurveTo(20, -40, 60, 20); c.quadraticCurveTo(0, 0, -60, 20); F(c, '#e0344a', '#8a1f2b', 3);
  c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(10, -50, 30, -56); F(c, null, '#8a1f2b', 4); c.restore();
  rr(c, cx - W * 0.1, cy - H * 0.17, W * 0.2, H * 0.14, 14); F(c, lg(c, 0, cy - H * 0.17, 0, cy, [[0, '#9fc0ff'], [1, '#2f5e9a']]), '#1a2a4a', 4);
  [W * 0.08, W * 0.92].forEach(x => { c.fillStyle = lg(c, x - W * 0.05, 0, x + W * 0.05, 0, [[0, '#a8302c'], [0.5, '#e05a4a'], [1, '#a8302c']]); c.fillRect(x - W * 0.05, H * 0.08, W * 0.1, H * 0.6); });
  for (let i = 0; i < 3; i++) { c.fillStyle = shade('#e0cfa8', -i * 0.05); c.fillRect(W * 0.2 - i * W * 0.04, cy + i * H * 0.03, W * 0.6 + i * W * 0.08, H * 0.03); }
  floorTiles(c, H * 0.62, W, H, '#d8d0c0', '#a8a090');
  c.beginPath(); c.moveTo(W * 0.4, H * 0.62); c.lineTo(W * 0.6, H * 0.62); c.lineTo(W * 0.78, H); c.lineTo(W * 0.22, H); c.closePath(); F(c, '#2f5e9a');
};
BG.changchun = function (c, W, H) { // 长春宫·台阶
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#ffd2a8'], [1, '#ffe9d0']]); c.fillRect(0, 0, W, H);
  cloud(c, W * 0.2, H * 0.08, H / 900, '#fff');
  const y0 = H * 0.18; roofTiles(c, W * 0.12, y0 - H * 0.11, W * 0.76, H * 0.13, '#f7cf5a', '#d99a1e');
  c.fillStyle = '#c0332f'; c.fillRect(W * 0.16, y0, W * 0.68, H * 0.22);
  for (let i = 0; i < 4; i++) { rr(c, W * 0.2 + i * W * 0.155, y0 + H * 0.04, W * 0.13, H * 0.17, 3); F(c, '#e05a4a', OL, 2); }
  plaque(c, '长春宫', W * 0.5, y0 - H * 0.002, Math.min(W * 0.24, H * 0.2), H * 0.05);
  for (let i = 0; i < 9; i++) { const yy = H * 0.4 + i * H * 0.067, ww = W * (0.5 + i * 0.06); rr(c, W / 2 - ww / 2, yy, ww, H * 0.067, 2); F(c, i % 2 ? '#e3d6be' : '#efe3cf', '#a89878', 1.5); }
  [W * 0.12, W * 0.88].forEach(x => { E(c, x, H * 0.48, W * 0.05, H * 0.03); F(c, '#b0a080', OL, 2); A.peony(c, x, H * 0.42, H / 600, '#e8304a', 0); });
};
BG.jingshi = function (c, W, H) { // 敬事房·夜
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#2a2a3e'], [1, '#4a3a3a']]); c.fillRect(0, 0, W, H);
  for (let r = 0; r < 4; r++) { const y = H * (0.1 + r * 0.13); c.fillStyle = '#6a4a2a'; c.fillRect(W * 0.08, y + H * 0.09, W * 0.84, H * 0.015);
    for (let i = 0; i < 18; i++) { rr(c, W * 0.1 + i * W * 0.045, y, W * 0.03, H * 0.09, 2); F(c, (i * 7 + r) % 11 === 3 ? '#e8b84a' : '#5fae6a', OL, 1.2); } }
  plaque(c, '敬事房', W * 0.5, H * 0.05, Math.min(W * 0.24, H * 0.2), H * 0.05);
  c.fillStyle = '#4a3020'; c.fillRect(0, H * 0.64, W, H * 0.36);
  rr(c, W * 0.3, H * 0.6, W * 0.4, H * 0.06, 4); F(c, '#7a4a2a', OL, 2.5);
  for (let i = 0; i < 8; i++) { c.save(); c.translate(W * 0.36 + i * W * 0.04, H * 0.6); c.rotate((i - 4) * 0.05); rr(c, -W * 0.012, -H * 0.06, W * 0.024, H * 0.06, 2); F(c, '#5fae6a', OL, 1); c.restore(); }
};
BG.yangxin = function (c, W, H) { // 养心殿·棋室
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#f6e6c4'], [1, '#e8d0a0']]); c.fillRect(0, 0, W, H);
  c.fillStyle = '#7a4a2a'; c.fillRect(0, 0, W, H * 0.05);
  plaque(c, '养心殿', W * 0.5, H * 0.1, Math.min(W * 0.24, H * 0.2), H * 0.05);
  screenFan(c, W * 0.06, H * 0.16, W * 0.28, H * 0.42, '#f3e7c8', (x, y, i) => { c.save(); c.strokeStyle = '#5a6a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - W * 0.025, y + H * 0.08); c.lineTo(x, y - H * 0.04); c.lineTo(x + W * 0.025, y + H * 0.08); c.stroke(); c.restore(); });
  screenFan(c, W * 0.66, H * 0.16, W * 0.28, H * 0.42, '#f3e7c8', (x, y, i) => { flower(c, x, y, H * 0.015, '#ffb0c8', '#ffe08a'); });
  rr(c, W * 0.42, H * 0.2, W * 0.16, H * 0.3, 4); F(c, '#fffaf0', '#7a5a3a', 3); txt(c, '勤政', W * 0.5, H * 0.3, H * 0.05, '#3a2a2a'); txt(c, '亲贤', W * 0.5, H * 0.4, H * 0.05, '#3a2a2a');
  c.fillStyle = '#9a6a3a'; c.fillRect(0, H * 0.62, W, H * 0.38);
  // 棋桌
  const bx = W * 0.5, by = H * 0.66, bw = Math.min(W * 0.3, H * 0.3);
  c.beginPath(); c.moveTo(bx - bw * 0.6, by); c.lineTo(bx + bw * 0.6, by); c.lineTo(bx + bw * 0.5, by - bw * 0.2); c.lineTo(bx - bw * 0.5, by - bw * 0.2); c.closePath(); F(c, '#e0b86a', OL, 2.5);
  c.strokeStyle = 'rgba(80,50,20,0.6)'; c.lineWidth = 1; for (let i = 1; i < 8; i++) { const k = i / 8; c.beginPath(); c.moveTo(bx - bw * (0.5 + 0.1 * k), by - bw * 0.2 * (1 - k)); c.lineTo(bx + bw * (0.5 + 0.1 * k), by - bw * 0.2 * (1 - k)); c.stroke(); }
  rr(c, bx - bw * 0.6, by, bw * 1.2, H * 0.03, 3); F(c, '#a8743a', OL, 2);
};
BG.swing = function (c, W, H) { // 御花园·秋千
  BG.garden(c, W, H);
  const x = W * 0.72, y = H * 0.66; c.save(); c.strokeStyle = '#6a4030'; c.lineCap = 'round'; c.lineWidth = H * 0.025; c.beginPath(); c.moveTo(x - W * 0.12, y); c.lineTo(x - W * 0.1, H * 0.2); c.moveTo(x + W * 0.12, y); c.lineTo(x + W * 0.1, H * 0.2); c.stroke();
  c.lineWidth = H * 0.02; c.beginPath(); c.moveTo(x - W * 0.13, H * 0.2); c.lineTo(x + W * 0.13, H * 0.2); c.stroke(); c.restore();
  roofTiles(c, x - W * 0.14, H * 0.13, W * 0.28, H * 0.06, '#f7cf5a', '#d99a1e');
};
BG.banquet = function (c, W, H) { // 赏花宴
  BG.garden(c, W, H);
  c.fillStyle = 'rgba(255,230,200,0.25)'; c.fillRect(0, 0, W, H);
  rr(c, W * 0.1, H * 0.66, W * 0.8, H * 0.06, 6); F(c, '#c0392b', OL, 2.5); c.fillStyle = '#f2c24d'; c.fillRect(W * 0.1, H * 0.7, W * 0.8, H * 0.012);
  for (let i = 0; i < 6; i++) { const x = W * (0.16 + i * 0.136); E(c, x, H * 0.655, W * 0.025, H * 0.012); F(c, '#fff', OL, 1.5); E(c, x, H * 0.648, W * 0.012, H * 0.01); F(c, ['#ff9fbc', '#ffd36b', '#9fe0c0'][i % 3]); }
  [0.06, 0.94].forEach(k => A.peony(c, W * k, H * 0.6, H / 450, '#e8304a', 0));
};
A.ANIM_EXT = function (c, name, W, H, t) {
  if (name === 'yonghe_night' || name === 'jingshi') { lantern(c, W * 0.9, H * 0.3, H / 650, t, true); }
  if (name === 'kunning') { lantern(c, W * 0.2, H * 0.2, H / 650, t, true); lantern(c, W * 0.8, H * 0.2, H / 650, t, true); }
  if (name === 'banquet' || name === 'yonghe_yard') { lantern(c, W * 0.2, H * 0.33, H / 700, t, false); lantern(c, W * 0.8, H * 0.33, H / 700, t, false); }
  if (name === 'swing' || name === 'banquet' || name === 'changchun') { for (let i = 0; i < 14; i++) { const x = ((i * 137.5 + t * 30 * (1 + i % 3)) % (W + 40)) - 20, y = ((i * 71.3 + t * H * 0.04) % (H + 40)) - 20; flower(c, x, y, H * 0.008, '#ffc2d4', '#fff'); } }
};

/* ---------- 手持道具 ---------- */
A.PROP_EXT = function (c, prop, t) {
  switch (prop) {
    case 'pouch': c.beginPath(); c.moveTo(-14, -10); c.quadraticCurveTo(-22, 18, 0, 22); c.quadraticCurveTo(22, 18, 14, -10); c.closePath(); F(c, '#e0344a', OL, 2.5); flower(c, 0, 6, 6, '#ffd36b', '#fff'); rr(c, -14, -16, 28, 7, 3); F(c, '#f2c24d', OL, 1.5); break;
    case 'rouge': E(c, 0, 4, 18, 8); F(c, '#f2c24d', OL, 2); E(c, 0, 0, 15, 6); F(c, '#ff5a7a', OL, 1.5); sparkle(c, 10, -10, 4 + Math.sin(t * 4) * 1.5, '#fff'); break;
    case 'pearl': E(c, 0, 0, 12, 12); F(c, rg(c, -4, -4, 1, 12, [[0, '#ffffff'], [1, '#e6dcf2']]), '#9a8ab0', 2); sparkle(c, 8, -10, 5, '#fff'); break;
    case 'needle': c.strokeStyle = '#cfd6e0'; c.lineWidth = 3; c.beginPath(); c.moveTo(-20, 10); c.lineTo(20, -18); c.stroke(); c.strokeStyle = OL; c.lineWidth = 1; c.stroke(); sparkle(c, 20, -18, 4, '#fff'); break;
    case 'teacup': rr(c, -14, -10, 28, 22, 6); F(c, '#fff', '#4a8fd0', 2.5); E(c, 0, -10, 14, 4); F(c, '#c99a5a', OL, 1.5); c.globalAlpha = 0.6; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(-4, -16); c.quadraticCurveTo(-8, -24, -2, -30); c.stroke(); break;
    case 'stones': E(c, 0, 4, 22, 12); F(c, '#a8743a', OL, 2.5); for (let i = 0; i < 5; i++) { E(c, -12 + i * 6, -2 + (i % 2) * 3, 5, 4); F(c, i % 2 ? '#fff' : '#222', OL, 1); } break;
    case 'tag': rr(c, -6, -34, 12, 50, 2); F(c, '#5fae6a', OL, 2); txt(c, '牌', 0, -10, 9, '#fff'); break;
    case 'datecake': E(c, 0, 6, 30, 8); F(c, '#fff', '#4a8fd0', 2); for (let i = 0; i < 3; i++) { rr(c, -22 + i * 15, -6, 15, 12, 3); F(c, '#b8323a', OL, 1.5); E(c, -14 + i * 15, -6, 3, 2); F(c, '#ffd36b'); } break;
  }
};
/* ---------- 第二章死法场景 ---------- */
const T = (c, s, str, x, y, cx, by, size, col) => txt(c, str, cx + x * s, by + y * s, size * s, col);
const me = (c, cx, by, s, t, o) => A.drawChar(c, 'me', cx, by - 8 * s, s, Object.assign({ t, ghost: true, face: 'dead' }, o || {}));
const D = A.DPROPS = A.DPROPS || {};
const simple = (draw, label, col) => ({ front: (c, cx, by, s, t) => { draw && draw(c, cx, by, s, t); if (label) T(c, s, label, -110, -330, cx, by, 22, col || '#c0392b'); } });
function hem(c, cx, by, s) { c.beginPath(); c.moveTo(cx - 210 * s, by - 10 * s); c.quadraticCurveTo(cx, by - 60 * s, cx + 210 * s, by - 10 * s); c.lineTo(cx + 210 * s, by); c.lineTo(cx - 210 * s, by); c.closePath(); F(c, '#2f5e9a', '#1a2a4a', 3); for (let i = 0; i < 8; i++) xiangyun(c, cx + (-180 + i * 50) * s, by - 18 * s, s * 0.6, '#f2c24d'); }
D.skirt = { back: (c, cx, by, s) => hem(c, cx, by, s), front: (c, cx, by, s, t) => { E(c, cx + 60 * s, by - 26 * s, 18 * s, 9 * s); F(c, 'rgba(90,60,40,0.6)'); T(c, s, '一个脚印', 110, -200, cx, by, 20, '#1a2a4a'); } };
D.scrolls = { front: (c, cx, by, s, t) => { for (let i = 0; i < 7; i++) { rr(c, cx + (90 + (i % 3) * 8) * s, by - (20 + i * 22) * s, 90 * s, 20 * s, 8 * s); F(c, '#fff6e0', OL, 2); } T(c, s, '《女诫》×100', 130, -200, cx, by, 20, '#8a2a2a'); T(c, s, '“妹妹抄完了吗？”', -110, -340, cx, by, 20, '#2f5e9a'); } };
D.sun = { back: (c, cx, by, s, t) => { E(c, cx - 130 * s, by - 340 * s, 40 * s, 40 * s); F(c, '#ffd84a', '#e8a020', 3); for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + t; c.strokeStyle = '#ffb020'; c.lineWidth = 4 * s; c.beginPath(); c.moveTo(cx - 130 * s + Math.cos(a) * 50 * s, by - 340 * s + Math.sin(a) * 50 * s); c.lineTo(cx - 130 * s + Math.cos(a) * 66 * s, by - 340 * s + Math.sin(a) * 66 * s); c.stroke(); } },
  front: (c, cx, by, s, t) => { A.drawProp(c, 'datecake', t, cx + 120 * s, by - 50 * s); T(c, s, '跪满三个时辰', 120, -150, cx, by, 20, '#c0392b'); } };
D.twins = { front: (c, cx, by, s, t) => { A.drawChar(c, 'guifei', cx + 130 * s, by, s * 0.55, { t, face: 'angry', still: true }); T(c, s, '撞衫！', 130, -210, cx, by, 30, '#e03a3a'); } };
D.needle = { front: (c, cx, by, s, t) => { A.drawProp(c, 'soup', t, cx + 120 * s, by - 50 * s); A.drawProp(c, 'needle', t, cx + 120 * s, by - 110 * s); T(c, s, '（没变黑）', 120, -160, cx, by, 18, '#5a6a8a'); } };
D.rouge = { front: (c, cx, by, s, t) => { A.drawProp(c, 'rouge', t, cx + 120 * s, by - 50 * s); for (let i = 0; i < 6; i++) { c.globalAlpha = 0.4; E(c, cx + (120 + Math.sin(t * 2 + i) * 40) * s, by - (90 + i * 30) * s, 14 * s, 8 * s); F(c, '#ff8ab0'); } c.globalAlpha = 1; T(c, s, '香得醉人', -110, -330, cx, by, 22, '#c2306a'); } };
D.splash = { front: (c, cx, by, s, t) => { A.drawProp(c, 'teacup', t, cx + 120 * s, by - 40 * s); for (let i = 0; i < 8; i++) { E(c, cx + (80 + i * 12) * s, by - (90 + Math.sin(i) * 20) * s, 5 * s, 7 * s); F(c, '#c99a5a'); } T(c, s, '烫！', 120, -170, cx, by, 34, '#e03a3a'); } };
D.hoop = { front: (c, cx, by, s, t) => { E(c, cx + 120 * s, by - 80 * s, 46 * s, 46 * s); F(c, '#fffaf0', '#a8743a', 6 * s); c.strokeStyle = '#e0344a'; c.lineWidth = 3 * s; c.beginPath(); for (let i = 0; i < 30; i++) c.lineTo(cx + (100 + Math.sin(i * 1.7) * 26) * s, by - (70 + Math.cos(i * 2.3) * 26) * s); c.stroke(); T(c, s, '鸳……鸭？', 120, -150, cx, by, 20, '#8a2a2a'); T(c, s, 'Z z z', -110, -320, cx, by, 34, '#7a8fd0'); } };
D.chesszzz = { front: (c, cx, by, s, t) => { rr(c, cx + 70 * s, by - 60 * s, 110 * s, 50 * s, 4); F(c, '#e0b86a', OL, 2); for (let i = 0; i < 6; i++) { E(c, cx + (85 + i * 16) * s, by - (40 + (i % 2) * 14) * s, 6 * s, 6 * s); F(c, i % 2 ? '#fff' : '#222', OL, 1); } T(c, s, 'Z z z', -110, -320 + Math.sin(t * 2) * 6, cx, by, 40, '#7a8fd0'); T(c, s, '御前失仪', 125, -100, cx, by, 18, '#c0392b'); } };
D.hug = { front: (c, cx, by, s, t) => { A.drawChar(c, 'luzheng', cx + 130 * s, by, s * 0.6, { t, face: 'angry', still: true }); T(c, s, '有刺客！', -110, -330, cx, by, 26, '#e03a3a'); } };
D.kpi = { front: (c, cx, by, s, t) => { rr(c, cx + 60 * s, by - 200 * s, 130 * s, 150 * s, 6); F(c, '#fff', OL, 2); [40, 70, 30, 10].forEach((h, i) => { rr(c, cx + (75 + i * 28) * s, by - (60 + h) * s, 18 * s, h * s, 2); F(c, i === 3 ? '#e03a3a' : '#8fd0c0', OL, 1); }); T(c, s, '承宠KPI', 125, -185, cx, by, 16, '#3a2a2a'); T(c, s, '本月：0', 125, -40, cx, by, 16, '#e03a3a'); } };
D.mouse = { front: (c, cx, by, s, t) => { rr(c, cx + 70 * s, by - 60 * s, 110 * s, 50 * s, 4); F(c, '#e0b86a', OL, 2); for (let i = 0; i < 5; i++) { E(c, cx + (90 + i * 18) * s, by - 40 * s, 6 * s, 6 * s); F(c, '#222', OL, 1); } E(c, cx - 140 * s, by - 20 * s, 18 * s, 12 * s); F(c, '#a8a29a', OL, 2); E(c, cx - 126 * s, by - 34 * s, 7 * s, 7 * s); F(c, '#ffc2d4', OL, 1.5); T(c, s, '五连！', 125, -100, cx, by, 24, '#c0392b'); T(c, s, '冷宫欢迎你', -110, -330, cx, by, 20, '#5a6a8a'); } };
D.melon = { front: (c, cx, by, s, t) => { c.save(); c.translate(cx + 120 * s, by - 60 * s); c.beginPath(); c.arc(0, 0, 44 * s, 0, Math.PI); c.closePath(); F(c, '#ff6b7e', '#3f9a5a', 6 * s); for (let i = 0; i < 5; i++) { E(c, (-24 + i * 12) * s, 14 * s, 2.5 * s, 4 * s); F(c, '#222'); } c.restore(); T(c, s, '瓜：你自己', 120, -140, cx, by, 20, '#3f9a5a'); } };
D.bowl = { front: (c, cx, by, s, t) => { E(c, cx + 120 * s, by - 40 * s, 40 * s, 12 * s); F(c, '#fff', '#4a8fd0', 2.5); c.beginPath(); c.arc(cx + 120 * s, by - 40 * s, 40 * s, 0, Math.PI); F(c, '#fff', '#4a8fd0', 2.5); E(c, cx + 120 * s, by - 44 * s, 32 * s, 10 * s); F(c, '#fffaf0'); A.drawChar(c, 'xiaotao', cx - 140 * s, by, s * 0.5, { t, face: 'cry', still: true }); T(c, s, '对不起……', -140, -170, cx, by, 18, '#3f9a7c'); } };
D.poison = { front: (c, cx, by, s, t) => { rr(c, cx + 100 * s, by - 100 * s, 40 * s, 60 * s, 10 * s); F(c, '#9a6ad0', OL, 2.5); rr(c, cx + 110 * s, by - 116 * s, 20 * s, 18 * s, 3); F(c, '#c99a5a', OL, 2); T(c, s, '☠', 120, -70, cx, by, 22, '#fff'); T(c, s, '“娘娘请用”', -110, -330, cx, by, 20, '#3f6aa6'); } };
D.tags = { front: (c, cx, by, s, t) => { for (let i = 0; i < 7; i++) { c.save(); c.translate(cx + (80 + i * 14) * s, by - 40 * s); c.rotate((i - 3) * 0.12); rr(c, -6 * s, -60 * s, 12 * s, 60 * s, 2); F(c, '#5fae6a', OL, 1.5); c.restore(); } T(c, s, '偷看？', 120, -150, cx, by, 24, '#c0392b'); } };
D.swing = { back: (c, cx, by, s, t) => { c.strokeStyle = '#6a4030'; c.lineWidth = 12 * s; c.beginPath(); c.moveTo(cx - 200 * s, by - 380 * s); c.lineTo(cx + 200 * s, by - 380 * s); c.stroke(); const a = Math.sin(t * 2) * 0.4; c.save(); c.translate(cx + 110 * s, by - 380 * s); c.rotate(a); c.strokeStyle = '#8a6a4a'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(-20 * s, 0); c.lineTo(-20 * s, 200 * s); c.moveTo(20 * s, 0); c.lineTo(20 * s, 200 * s); c.stroke(); rr(c, -30 * s, 200 * s, 60 * s, 10 * s, 3); F(c, '#c08a4a', OL, 2); c.restore(); },
  front: (c, cx, by, s, t) => T(c, s, '飞——', -110, -330, cx, by, 30, '#3a8fd0') };
D.catface = { front: (c, cx, by, s, t) => { A.drawCat(c, cx + 4 * s, by - 190 * s, s * 0.8, { t, mood: 'happy' }); T(c, s, '呼噜噜……', 120, -330, cx, by, 20, '#c97a2a'); } };
D.steps = { back: (c, cx, by, s) => { for (let i = 0; i < 6; i++) { rr(c, cx - (200 - i * 20) * s, by - (i + 1) * 30 * s, (400 - i * 40) * s, 30 * s, 2); F(c, i % 2 ? '#e3d6be' : '#efe3cf', '#a89878', 1.5); } },
  front: (c, cx, by, s, t) => { for (let i = 0; i < 4; i++) { E(c, cx + (-60 + i * 40) * s, by - (60 + i * 30) * s, 14 * s, 4 * s); F(c, 'rgba(255,220,120,0.7)'); sparkle(c, cx + (-60 + i * 40) * s, by - (64 + i * 30) * s, 4 * s, '#fff'); } T(c, s, '台阶抹了油', 120, -330, cx, by, 20, '#8a5f10'); } };
D.shop = { front: (c, cx, by, s, t) => { rr(c, cx + 60 * s, by - 230 * s, 130 * s, 40 * s, 6); F(c, '#e0344a', OL, 2); T(c, s, '宫中第一奶茶', 125, -210, cx, by, 16, '#fff'); A.drawProp(c, 'milktea', t, cx + 100 * s, by - 60 * s); A.drawProp(c, 'milktea', t, cx + 150 * s, by - 60 * s); T(c, s, '妖术敛财？', -110, -330, cx, by, 20, '#c0392b'); } };
D.pearl = { front: (c, cx, by, s, t) => { A.drawProp(c, 'pearl', t, cx + 120 * s, by - 80 * s); T(c, s, '东珠', 120, -120, cx, by, 20, '#7a5ab8'); T(c, s, '“人赃并获！”', -110, -330, cx, by, 20, '#c0392b'); } };
})(window.PALACE = window.PALACE || {});
