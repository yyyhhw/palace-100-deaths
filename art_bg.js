/* art_bg.js —— 宫廷场景背景（Canvas 代码绘制，静态层缓存 + 动态层逐帧） */
(function (P) {
'use strict';
const A = P.ART, { E, F, L, rr, lg, rg, shade, flower, star, sparkle, OL, TAU } = A.util;

function roofTiles(c, x, y, w, h, col, col2) { // 琉璃瓦飞檐屋顶
  c.save();
  const path = () => { c.beginPath(); c.moveTo(x - w * 0.08, y + h); c.quadraticCurveTo(x + w * 0.05, y + h * 0.7, x + w * 0.12, y); c.lineTo(x + w * 0.88, y); c.quadraticCurveTo(x + w * 0.95, y + h * 0.7, x + w * 1.08, y + h);
    c.quadraticCurveTo(x + w * 1.1, y + h * 0.82, x + w * 1.13, y + h * 0.66); c.quadraticCurveTo(x + w * 0.5, y + h * 1.25, x - w * 0.13, y + h * 0.66); c.quadraticCurveTo(x - w * 0.1, y + h * 0.82, x - w * 0.08, y + h); c.closePath(); };
  path(); F(c, lg(c, 0, y, 0, y + h, [[0, col], [1, col2]]), shade(col2, -0.45), 2);
  c.save(); path(); c.clip();
  c.strokeStyle = shade(col2, -0.25); c.lineWidth = Math.max(1, w * 0.005);
  for (let i = 0; i <= 44; i++) { const xx = x - w * 0.12 + i * w * 1.24 / 44; c.beginPath(); c.moveTo(x + w * 0.5 + (xx - x - w * 0.5) * 0.76, y); c.lineTo(xx, y + h * 1.2); c.stroke(); }
  c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = Math.max(1, h * 0.04); c.beginPath(); c.moveTo(x + w * 0.12, y + h * 0.12); c.lineTo(x + w * 0.88, y + h * 0.12); c.stroke();
  c.restore();
  rr(c, x + w * 0.1, y - h * 0.12, w * 0.8, h * 0.16, h * 0.06); F(c, col2, shade(col2, -0.45), 2);
  [x + w * 0.1, x + w * 0.9].forEach(px => { c.beginPath(); c.arc(px, y - h * 0.1, h * 0.15, Math.PI, 0); F(c, col2, shade(col2, -0.45), 1.5); });
  // 檐角小兽
  [x - w * 0.11, x + w * 1.11].forEach(px => { E(c, px, y + h * 0.62, h * 0.06, h * 0.06); F(c, col, shade(col2, -0.45), 1); });
  c.restore();
}
function lantern(c, x, y, s, t, lit) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5 + x * 0.01) * 0.06); c.scale(s, s);
  c.strokeStyle = OL; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -34); c.lineTo(0, -16); c.stroke();
  if (lit) { E(c, 0, 4, 46, 46); F(c, rg(c, 0, 4, 0, 46, [[0, 'rgba(255,200,100,0.5)'], [1, 'rgba(255,200,100,0)']])); }
  rr(c, -9, -18, 18, 5, 2); F(c, '#e8b84a', OL, 1.5); E(c, 0, 4, 18, 20); F(c, lg(c, -18, 0, 18, 0, [[0, '#a8202a'], [0.5, '#f05a4a'], [1, '#a8202a']]), OL, 2);
  c.strokeStyle = 'rgba(80,10,10,0.45)'; c.lineWidth = 1.2; [3, 9, 14].forEach(i => { c.beginPath(); c.ellipse(0, 4, i, 20, 0, 0, TAU); c.stroke(); });
  rr(c, -9, 22, 18, 5, 2); F(c, '#e8b84a', OL, 1.5); c.strokeStyle = '#e8b84a'; c.lineWidth = 2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 3, 27); c.lineTo(i * 3 + Math.sin(t * 2 + i) * 1.5, 42); c.stroke(); }
  c.fillStyle = '#ffe08a'; c.font = 'bold 14px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('福', 0, 5);
  c.restore();
}
function cloud(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; [[0, 0, 30], [26, -10, 24], [50, 2, 22], [-24, 4, 20]].forEach(([a, b, r]) => { c.beginPath(); c.arc(a, b, r, 0, TAU); c.fill(); }); c.restore(); }
function xiangyun(c, x, y, s, col) { // 祥云纹
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.arc(0, 0, 10, Math.PI * 0.5, Math.PI * 2.2); c.stroke(); c.beginPath(); c.arc(18, -4, 7, Math.PI, Math.PI * 2.6); c.stroke(); c.beginPath(); c.moveTo(-10, 10); c.quadraticCurveTo(10, 16, 34, 6); c.stroke(); c.restore();
}
function tree(c, x, y, s, blossom) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = '#6a4030'; c.lineCap = 'round'; c.lineWidth = 16; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-10, -80, 10, -150); c.stroke();
  c.lineWidth = 8; c.beginPath(); c.moveTo(4, -100); c.quadraticCurveTo(50, -120, 80, -170); c.moveTo(6, -120); c.quadraticCurveTo(-50, -140, -70, -190); c.stroke();
  const cols = blossom ? ['#ffc2d4', '#ffd9e4', '#ff9fbc'] : ['#7cc48a', '#9ad6a0', '#5fae6a'];
  [[0, -190, 60], [70, -180, 46], [-66, -196, 48], [30, -230, 44], [-30, -240, 40], [90, -210, 30], [-90, -220, 32]].forEach(([a, b, r], i) => { c.beginPath(); c.arc(a, b, r, 0, TAU); c.fillStyle = cols[i % 3]; c.fill(); });
  if (blossom) for (let i = 0; i < 26; i++) flower(c, Math.sin(i * 12.9) * 90, -200 + Math.cos(i * 7.3) * 50, 5, '#fff', '#ff8fae');
  c.restore();
}
function palaceWall(c, y0, y1, W) {
  c.fillStyle = lg(c, 0, y0, 0, y1, [[0, '#c7443f'], [1, '#9e2f2f']]); c.fillRect(0, y0, W, y1 - y0);
  c.fillStyle = 'rgba(0,0,0,0.06)'; for (let x = 0; x < W; x += 60) c.fillRect(x, y0, 2, y1 - y0);
  c.fillStyle = '#d9cbb5'; c.fillRect(0, y1 - (y1 - y0) * 0.08, W, (y1 - y0) * 0.08);
  roofTiles(c, -W * 0.05, y0 - (y1 - y0) * 0.24, W * 1.1, (y1 - y0) * 0.3, '#f7cf5a', '#d99a1e');
}
function floorTiles(c, y, W, H, c1, c2) {
  c.fillStyle = lg(c, 0, y, 0, H, [[0, c1], [1, c2]]); c.fillRect(0, y, W, H - y);
  c.strokeStyle = 'rgba(120,90,60,0.2)'; c.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) { const yy = y + i * i * (H - y) / 64; c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke(); }
  for (let i = -12; i <= 12; i++) { c.beginPath(); c.moveTo(W / 2 + i * W * 0.04, y); c.lineTo(W / 2 + i * W * 0.17, H); c.stroke(); }
}
function txt(c, s, x, y, size, col, font) { c.fillStyle = col; c.font = `bold ${Math.round(size)}px ${font || '"Noto Serif CJK SC","Songti SC",serif'}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); }
function plaque(c, s, x, y, w, h) { rr(c, x - w / 2, y - h / 2, w, h, 4); F(c, '#2a3a6a', '#e8b84a', 3); rr(c, x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 2); F(c, null, 'rgba(232,184,74,0.6)', 1.5); txt(c, s, x, y + 1, h * 0.55, '#ffe08a'); }

const BG = A.BG = {};
BG.title = function (c, W, H) {
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#ffe2c8'], [0.45, '#ffbcc0'], [0.75, '#f7a3b0'], [1, '#d77a88']]); c.fillRect(0, 0, W, H);
  E(c, W * 0.76, H * 0.16, H * 0.08, H * 0.08); F(c, 'rgba(255,250,228,0.9)');
  cloud(c, W * 0.15, H * 0.13, H / 600, 'rgba(255,255,255,0.6)'); cloud(c, W * 0.62, H * 0.07, H / 800, 'rgba(255,255,255,0.5)');
  for (let i = 0; i < 5; i++) { const x = i * W / 4 - W * 0.12, w = W * 0.34, y = H * 0.44 + (i % 2) * H * 0.03; c.globalAlpha = 0.45; roofTiles(c, x, y, w, H * 0.055, '#e08a92', '#c06a78'); c.fillStyle = '#c0606e'; c.fillRect(x + w * 0.12, y + H * 0.05, w * 0.76, H * 0.07); c.globalAlpha = 1; }
  palaceWall(c, H * 0.64, H * 0.8, W);
  floorTiles(c, H * 0.8, W, H, '#ecdcc4', '#cdb08e');
  tree(c, W * 0.06, H * 0.84, H / 700, true); tree(c, W * 0.97, H * 0.88, H / 800, true);
};
BG.room = function (c, W, H) { // 现代出租屋·凌晨两点
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#2c2650'], [1, '#4a3f72']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,255,255,0.04)'; for (let x = 0; x < W; x += 24) c.fillRect(x, 0, 12, H * 0.62);
  const wx = W * 0.58, wy = H * 0.08, ww = W * 0.36, wh = H * 0.3;
  rr(c, wx, wy, ww, wh, 8); F(c, lg(c, 0, wy, 0, wy + wh, [[0, '#15153a'], [1, '#3a3060']]), '#e8e0ff', 5);
  c.save(); rr(c, wx, wy, ww, wh, 8); c.clip();
  for (let i = 0; i < 10; i++) { const bx = wx + i * ww / 9.5, bh = wh * (0.3 + ((i * 37) % 5) / 10); c.fillStyle = '#26214a'; c.fillRect(bx, wy + wh - bh, ww / 10, bh); c.fillStyle = '#ffe08a'; for (let j = 0; j < 5; j++) if ((i + j) % 3) c.fillRect(bx + 3, wy + wh - bh + 6 + j * 9, 4, 4); }
  E(c, wx + ww * 0.82, wy + wh * 0.22, 12, 12); F(c, '#fff6c8'); c.restore();
  c.strokeStyle = '#e8e0ff'; c.lineWidth = 4; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.stroke();
  // 窗帘
  c.fillStyle = '#f7b6c8'; [wx - 14, wx + ww - 4].forEach((x, k) => { c.beginPath(); c.moveTo(x, wy - 10); c.quadraticCurveTo(x + (k ? -10 : 28), wy + wh * 0.5, x + (k ? 6 : 10), wy + wh + 16); c.lineTo(x + (k ? 18 : -2), wy + wh + 16); c.lineTo(x + (k ? 18 : -2), wy - 10); c.closePath(); F(c, '#f7b6c8', OL, 2); });
  // 海报
  rr(c, W * 0.07, H * 0.09, W * 0.21, H * 0.27, 4); F(c, lg(c, 0, H * 0.09, 0, H * 0.36, [[0, '#c0392b'], [1, '#7a1f2b']]), '#fff', 3);
  txt(c, '凤仪', W * 0.175, H * 0.16, H * 0.034, '#ffe08a'); txt(c, '天下', W * 0.175, H * 0.205, H * 0.034, '#ffe08a'); flower(c, W * 0.175, H * 0.29, H * 0.025, '#ffd36b', '#e0344a', 6);
  txt(c, '全 300 集', W * 0.175, H * 0.34, H * 0.016, '#fff');
  // 地板、地毯
  c.fillStyle = '#5a4a7a'; c.fillRect(0, H * 0.62, W, H * 0.38);
  c.strokeStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, H * 0.62 + i * H * 0.05); c.lineTo(W, H * 0.62 + i * H * 0.05); c.stroke(); }
  E(c, W * 0.5, H * 0.86, W * 0.42, H * 0.08); F(c, '#f7d6e0', '#e8a8bc', 3);
  // 床
  rr(c, -20, H * 0.5, W * 0.36, H * 0.16, 14); F(c, '#f7c6d8', OL, 3); rr(c, W * 0.02, H * 0.47, W * 0.12, H * 0.06, 10); F(c, '#fff', OL, 2);
  // 书桌 + 电脑
  rr(c, W * 0.52, H * 0.56, W * 0.46, H * 0.04, 4); F(c, '#c99a6a', OL, 2.5); c.fillStyle = '#a07a50'; c.fillRect(W * 0.55, H * 0.6, W * 0.03, H * 0.2); c.fillRect(W * 0.92, H * 0.6, W * 0.03, H * 0.2);
  rr(c, W * 0.62, H * 0.41, W * 0.25, H * 0.15, 6); F(c, '#2a2a3a', OL, 3); rr(c, W * 0.635, H * 0.42, W * 0.22, H * 0.125, 3); F(c, lg(c, 0, H * 0.42, 0, H * 0.55, [[0, '#ffe2b0'], [1, '#ff9eb0']]));
  c.fillStyle = '#b83b3b'; c.fillRect(W * 0.66, H * 0.5, W * 0.17, H * 0.03); txt(c, '大结局', W * 0.745, H * 0.515, H * 0.018, '#ffd36b', 'sans-serif');
  // 零食
  rr(c, W * 0.9, H * 0.5, W * 0.05, H * 0.06, 4); F(c, '#ffd36b', OL, 2);
};
BG.bridge = function (c, W, H) { // 奈何桥
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#3f3170'], [0.4, '#8a78c0'], [0.7, '#b9a7d6'], [1, '#6a5a9a']]); c.fillRect(0, 0, W, H);
  E(c, W * 0.2, H * 0.13, H * 0.065, H * 0.065); F(c, 'rgba(255,250,235,0.9)'); E(c, W * 0.2 + H * 0.025, H * 0.12, H * 0.055, H * 0.055); F(c, '#5a4a92');
  for (let i = 0; i < 40; i++) { E(c, (i * 97.3) % W, (i * 53.1) % (H * 0.4), 1.2, 1.2); F(c, 'rgba(255,255,255,0.7)'); }
  // 远山
  c.fillStyle = 'rgba(90,70,140,0.6)'; c.beginPath(); c.moveTo(0, H * 0.58); for (let i = 0; i <= 8; i++) c.quadraticCurveTo(i * W / 8 - W / 16, H * (0.4 + (i % 2) * 0.06), i * W / 8, H * 0.54); c.lineTo(W, H * 0.6); c.lineTo(0, H * 0.6); c.fill();
  c.fillStyle = lg(c, 0, H * 0.58, 0, H, [[0, '#7f6fb8'], [1, '#3a2f6a']]); c.fillRect(0, H * 0.58, W, H * 0.42);
  c.strokeStyle = 'rgba(255,255,255,0.15)'; c.lineWidth = 2; for (let i = 0; i < 10; i++) { const y = H * (0.66 + i * 0.03); c.beginPath(); c.moveTo((i * 53) % W, y); c.lineTo((i * 53) % W + W * 0.15, y); c.stroke(); }
  const by = H * 0.62, arc = t => by + H * 0.06 - 4 * t * (1 - t) * H * 0.16;
  c.beginPath(); c.moveTo(-W * 0.05, by + H * 0.06); for (let i = 0; i <= 40; i++) { const t = i / 40; c.lineTo(-W * 0.05 + t * W * 1.1, arc(t)); } c.lineTo(W * 1.05, by + H * 0.12); for (let i = 40; i >= 0; i--) { const t = i / 40; c.lineTo(-W * 0.05 + t * W * 1.1, arc(t) + H * 0.06); } c.closePath();
  F(c, lg(c, 0, by - H * 0.12, 0, by + H * 0.12, [[0, '#ded6ee'], [1, '#9a90b8']]), '#4a3f70', 3);
  c.beginPath(); c.ellipse(W * 0.5, by + H * 0.14, W * 0.2, H * 0.1, 0, Math.PI, 0); F(c, '#3a2f6a');
  c.strokeStyle = '#5a4f80'; c.lineWidth = 3;
  for (let i = 0; i <= 16; i++) { const t = i / 16, x = -W * 0.05 + t * W * 1.1, yy = arc(t); c.beginPath(); c.moveTo(x, yy); c.lineTo(x, yy - H * 0.045); c.stroke(); E(c, x, yy - H * 0.048, 3, 3); F(c, '#ded6ee', '#5a4f80', 1.5); }
  c.beginPath(); for (let i = 0; i <= 40; i++) { const t = i / 40; c.lineTo(-W * 0.05 + t * W * 1.1, arc(t) - H * 0.04); } c.stroke();
  txt(c, '奈 何 桥', W * 0.5, arc(0.5) + H * 0.03, H * 0.024, '#4a3f70');
  for (let i = 0; i < 18; i++) { const x = (i * 71.7) % W, y = H * 0.87 + (i % 4) * H * 0.03; c.strokeStyle = '#3a7a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + 20); c.lineTo(x, y); c.stroke(); for (let k = 0; k < 7; k++) { c.save(); c.translate(x, y); c.rotate(k * TAU / 7); c.strokeStyle = '#e8304a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(6, -6, 4, -14); c.stroke(); c.restore(); } }
  // 孟婆汤摊
  const sx = W * 0.8, sy = H * 0.6;
  c.fillStyle = '#5a3a2a'; c.fillRect(sx - W * 0.1, sy - H * 0.2, 6, H * 0.2); c.fillRect(sx + W * 0.1, sy - H * 0.2, 6, H * 0.2);
  c.beginPath(); c.moveTo(sx - W * 0.14, sy - H * 0.18); c.lineTo(sx + W * 0.16, sy - H * 0.18); c.lineTo(sx + W * 0.13, sy - H * 0.235); c.lineTo(sx - W * 0.11, sy - H * 0.235); c.closePath(); F(c, '#b83b3b', OL, 2.5);
  for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(sx - W * 0.12 + i * W * 0.045, sy - H * 0.18, W * 0.022, 0, Math.PI); F(c, i % 2 ? '#fff6e0' : '#e8b84a', OL, 1.5); }
  rr(c, sx - W * 0.11, sy - H * 0.02, W * 0.23, H * 0.08, 6); F(c, '#8a5a3a', OL, 3);
  rr(c, sx - W * 0.075, sy - H * 0.29, W * 0.17, H * 0.045, 4); F(c, '#fff6e0', '#b83b3b', 2); txt(c, '孟婆汤 · 第二碗半价', sx + W * 0.01, sy - H * 0.267, Math.min(H * 0.018, W * 0.012), '#b83b3b');
  E(c, sx - W * 0.02, sy - H * 0.025, W * 0.05, H * 0.022); F(c, '#4a4a5a', OL, 2);
};
BG.carriage = function (c, W, H) {
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#8a4232'], [1, '#4a2018']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = 0; x < W; x += 28) c.fillRect(x, 0, 3, H);
  for (let i = 0; i < 6; i++) xiangyun(c, (i * 0.19 + 0.04) * W, H * 0.52, H / 700, 'rgba(255,210,150,0.25)');
  const wx = W * 0.18, wy = H * 0.1, ww = W * 0.64, wh = H * 0.3;
  rr(c, wx - 12, wy - 12, ww + 24, wh + 24, 14); F(c, '#c99a4a', OL, 3);
  rr(c, wx, wy, ww, wh, 8); F(c, '#9ad0f0');
  rr(c, -10, H * 0.64, W + 20, H * 0.09, 12); F(c, lg(c, 0, H * 0.64, 0, H * 0.73, [[0, '#d8705a'], [1, '#a8483a']]), OL, 3);
  c.fillStyle = '#5a2418'; c.fillRect(0, H * 0.73, W, H * 0.27);
  for (let i = 0; i < 7; i++) flower(c, i * W / 6, H * 0.685, 8, 'rgba(255,220,160,0.6)', 'rgba(255,240,200,0.8)');
};
BG.gate = function (c, W, H) { // 神武门 + 九九八十一颗门钉
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#8fcaf0'], [1, '#e6f2fa']]); c.fillRect(0, 0, W, H);
  cloud(c, W * 0.2, H * 0.08, H / 800, '#fff'); cloud(c, W * 0.82, H * 0.05, H / 1000, '#fff');
  roofTiles(c, W * 0.02, H * 0.06, W * 0.96, H * 0.13, '#f7cf5a', '#d99a1e');
  c.fillStyle = lg(c, 0, H * 0.18, 0, H * 0.74, [[0, '#c7443f'], [1, '#9e2f2f']]); c.fillRect(W * 0.04, H * 0.18, W * 0.92, H * 0.56);
  plaque(c, '神武门', W * 0.5, H * 0.145, Math.min(W * 0.3, H * 0.24), H * 0.06);
  const dx = W * 0.2, dw = W * 0.6, dy = H * 0.27, dh = H * 0.47;
  c.beginPath(); c.moveTo(dx, dy + dh); c.lineTo(dx, dy + dw * 0.18); c.quadraticCurveTo(dx + dw / 2, dy - dw * 0.14, dx + dw, dy + dw * 0.18); c.lineTo(dx + dw, dy + dh); c.closePath(); F(c, '#4a1414', OL, 3);
  [0, 1].forEach(k => { const x0 = dx + 8 + k * (dw / 2 - 4), w = dw / 2 - 12, y0 = dy + dw * 0.1;
    c.fillStyle = lg(c, x0, 0, x0 + w, 0, [[0, '#d0453c'], [1, '#a8302c']]); c.fillRect(x0, y0, w, dy + dh - y0);
    for (let r = 0; r < 9; r++) for (let q = 0; q < 9; q++) { const x = x0 + w * (q + 0.5) / 9, y = y0 + 10 + r * (dy + dh - y0 - 20) / 8.6; E(c, x, y, w * 0.032, w * 0.032); F(c, rg(c, x - 1.5, y - 1.5, 0, w * 0.04, [[0, '#fff3a8'], [1, '#c98a1e']])); }
    E(c, x0 + (k ? 14 : w - 14), y0 + (dy + dh - y0) * 0.55, 10, 10); F(c, '#e8b84a', OL, 2); c.strokeStyle = '#8a5f10'; c.lineWidth = 2.5; c.beginPath(); c.arc(x0 + (k ? 14 : w - 14), y0 + (dy + dh - y0) * 0.55 + 10, 8, 0, Math.PI); c.stroke(); });
  floorTiles(c, H * 0.74, W, H, '#e6d6ba', '#c5ad88');
  // 石狮子（简化）
  [W * 0.1, W * 0.9].forEach((x, k) => { rr(c, x - W * 0.05, H * 0.66, W * 0.1, H * 0.1, 6); F(c, '#b9b2a8', OL, 2.5); E(c, x, H * 0.64, W * 0.04, H * 0.04); F(c, '#cfc8bd', OL, 2.5); E(c, x + (k ? -6 : 6), H * 0.64, 3, 3); F(c, OL); });
};
BG.courtyard = function (c, W, H) { // 储秀宫
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#a2d8f5'], [1, '#fdf2e0']]); c.fillRect(0, 0, W, H);
  cloud(c, W * 0.15, H * 0.08, H / 800, '#fff'); cloud(c, W * 0.72, H * 0.05, H / 1000, '#fff');
  const y0 = H * 0.24;
  roofTiles(c, W * 0.06, y0 - H * 0.13, W * 0.88, H * 0.15, '#f7cf5a', '#d99a1e');
  c.fillStyle = '#b83b3b'; c.fillRect(W * 0.1, y0, W * 0.8, H * 0.36);
  c.fillStyle = '#2f6e8a'; c.fillRect(W * 0.1, y0, W * 0.8, H * 0.045); for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#e8b84a' : '#5fae8a'; c.fillRect(W * 0.1 + i * W * 0.05 + 3, y0 + H * 0.01, W * 0.04, H * 0.025); }
  for (let i = 0; i < 5; i++) { const x = W * 0.14 + i * W * 0.148; rr(c, x, y0 + H * 0.07, W * 0.125, H * 0.26, 3); F(c, '#d8573f', OL, 2); c.strokeStyle = 'rgba(255,230,180,0.75)'; c.lineWidth = 1.5;
    for (let j = 1; j < 6; j++) { c.beginPath(); c.moveTo(x, y0 + H * 0.07 + j * H * 0.035); c.lineTo(x + W * 0.125, y0 + H * 0.07 + j * H * 0.035); c.stroke(); } for (let j = 1; j < 4; j++) { c.beginPath(); c.moveTo(x + j * W * 0.031, y0 + H * 0.07); c.lineTo(x + j * W * 0.031, y0 + H * 0.24); c.stroke(); }
    rr(c, x + 4, y0 + H * 0.25, W * 0.125 - 8, H * 0.07, 2); F(c, '#c0473a', 'rgba(255,230,180,0.6)', 1.5); }
  for (let i = 0; i < 6; i++) { c.fillStyle = '#9e2f2f'; c.fillRect(W * 0.125 + i * W * 0.148, y0 + H * 0.05, W * 0.014, H * 0.31); }
  plaque(c, '储秀宫', W * 0.5, y0 - H * 0.005, Math.min(W * 0.24, H * 0.2), H * 0.05);
  c.fillStyle = '#d9cbb5'; c.fillRect(W * 0.06, y0 + H * 0.36, W * 0.88, H * 0.025); c.fillStyle = '#cbbba2'; c.fillRect(W * 0.04, y0 + H * 0.385, W * 0.92, H * 0.02);
  floorTiles(c, H * 0.62, W, H, '#efe3cf', '#d4c2a6');
  tree(c, W * 0.03, H * 0.72, H / 900, true); tree(c, W * 0.985, H * 0.74, H / 950, false);
  rr(c, W * 0.8, H * 0.6, W * 0.1, H * 0.07, 10); F(c, lg(c, 0, H * 0.6, 0, H * 0.67, [[0, '#6a8a7a'], [1, '#3a5a4a']]), OL, 2.5); E(c, W * 0.85, H * 0.6, W * 0.05, H * 0.012); F(c, '#7fc8d8', OL, 2);
};
BG.room_night = function (c, W, H) { // 储秀宫寝殿·夜
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#3a2a4e'], [1, '#5a3a4e']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = 0; x < W; x += 40) c.fillRect(x, 0, 4, H * 0.62);
  const r = Math.min(W * 0.15, H * 0.15), mx = W * 0.75, my = H * 0.24;
  c.beginPath(); c.arc(mx, my, r, 0, TAU); F(c, '#2a2a5a', '#8a5a3a', 7);
  E(c, mx + r * 0.25, my - r * 0.2, r * 0.32, r * 0.32); F(c, '#fff4c8');
  c.save(); c.beginPath(); c.arc(mx, my, r, 0, TAU); c.clip(); c.strokeStyle = '#8a5a3a'; c.lineWidth = 3; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(mx + i * r / 3.5, my - r); c.lineTo(mx + i * r / 3.5, my + r); c.stroke(); c.beginPath(); c.moveTo(mx - r, my + i * r / 3.5); c.lineTo(mx + r, my + i * r / 3.5); c.stroke(); } c.restore();
  for (let i = 0; i < 3; i++) { const x = W * 0.03 + i * W * 0.12; rr(c, x, H * 0.17, W * 0.115, H * 0.43, 3); F(c, '#f3e2c8', '#7a4a2a', 4); c.save(); rr(c, x, H * 0.17, W * 0.115, H * 0.43, 3); c.clip(); tree(c, x + W * 0.06, H * 0.56, H / 2400, true); c.restore(); }
  c.fillStyle = '#6a4a3a'; c.fillRect(0, H * 0.62, W, H * 0.38);
  c.strokeStyle = 'rgba(0,0,0,0.15)'; for (let i = 0; i < 11; i++) { c.beginPath(); c.moveTo(i * W / 9, H * 0.62); c.lineTo(i * W / 9 - W * 0.1, H); c.stroke(); }
  rr(c, W * 0.56, H * 0.5, W * 0.46, H * 0.14, 8); F(c, '#9a5a3a', OL, 3); rr(c, W * 0.59, H * 0.47, W * 0.41, H * 0.06, 10); F(c, '#f7c6d8', OL, 2); rr(c, W * 0.87, H * 0.44, W * 0.1, H * 0.05, 8); F(c, '#fff3e0', OL, 2);
  c.fillStyle = 'rgba(255,190,210,0.5)'; c.beginPath(); c.moveTo(W * 0.56, H * 0.12); c.quadraticCurveTo(W * 0.6, H * 0.35, W * 0.57, H * 0.5); c.lineTo(W * 0.54, H * 0.5); c.lineTo(W * 0.54, H * 0.12); c.fill();
  const cx = W * 0.44, cy = H * 0.52; rr(c, cx - 5, cy - H * 0.05, 10, H * 0.05, 2); F(c, '#fff3e0', OL, 2); rr(c, cx - 14, cy, 28, 8, 3); F(c, '#c99a4a', OL, 2);
};
BG.room_day = function (c, W, H) { // 储秀宫寝殿·清晨
  BG.room_night(c, W, H);
  c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,214,170,0.55)'; c.fillRect(0, 0, W, H); c.restore();
  const r = Math.min(W * 0.15, H * 0.15), mx = W * 0.75, my = H * 0.24;
  c.save(); c.beginPath(); c.arc(mx, my, r - 4, 0, TAU); c.clip(); c.fillStyle = lg(c, 0, my - r, 0, my + r, [[0, '#bfe6ff'], [1, '#ffe9c4']]); c.fillRect(mx - r, my - r, r * 2, r * 2);
  E(c, mx - r * 0.3, my + r * 0.1, r * 0.35, r * 0.35); F(c, '#ffd36b'); cloud(c, mx + r * 0.2, my - r * 0.3, H / 2600, '#fff');
  c.strokeStyle = '#8a5a3a'; c.lineWidth = 3; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(mx + i * r / 3.5, my - r); c.lineTo(mx + i * r / 3.5, my + r); c.stroke(); c.beginPath(); c.moveTo(mx - r, my + i * r / 3.5); c.lineTo(mx + r, my + i * r / 3.5); c.stroke(); } c.restore();
  c.fillStyle = 'rgba(255,240,200,0.18)'; c.beginPath(); c.moveTo(mx - r, my); c.lineTo(mx + r * 0.2, my + r); c.lineTo(W * 0.3, H); c.lineTo(W * 0.0, H); c.closePath(); c.fill();
};
BG.garden = function (c, W, H) { // 御花园·荷花池
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#9fd8f5'], [1, '#e8f6ec']]); c.fillRect(0, 0, W, H);
  cloud(c, W * 0.3, H * 0.08, H / 800, '#fff');
  palaceWall(c, H * 0.26, H * 0.4, W);
  const px = W * 0.7, py = H * 0.42;
  roofTiles(c, px - W * 0.14, py - H * 0.22, W * 0.28, H * 0.08, '#6fbe9a', '#2f7a5a'); c.fillStyle = '#b83b3b'; c.fillRect(px - W * 0.11, py - H * 0.14, 8, H * 0.15); c.fillRect(px + W * 0.11 - 8, py - H * 0.14, 8, H * 0.15); c.fillRect(px - 4, py - H * 0.14, 8, H * 0.15);
  c.fillStyle = '#e8b84a'; c.fillRect(px - W * 0.12, py - H * 0.145, W * 0.24, 6);
  c.beginPath(); c.moveTo(0, H * 0.6); c.quadraticCurveTo(W * 0.04, H * 0.33, W * 0.12, H * 0.4); c.quadraticCurveTo(W * 0.17, H * 0.29, W * 0.25, H * 0.44); c.quadraticCurveTo(W * 0.31, H * 0.5, W * 0.31, H * 0.62); c.closePath(); F(c, lg(c, 0, H * 0.3, 0, H * 0.6, [[0, '#c3ccd2'], [1, '#8a959e']]), '#5a6570', 3);
  E(c, W * 0.14, H * 0.48, W * 0.03, H * 0.03); F(c, '#6a7580'); E(c, W * 0.22, H * 0.52, W * 0.02, H * 0.02); F(c, '#6a7580');
  c.fillStyle = lg(c, 0, H * 0.56, 0, H, [[0, '#a6dca2'], [1, '#7cc48a']]); c.fillRect(0, H * 0.56, W, H * 0.44);
  for (let i = 0; i < 30; i++) { const x = (i * 67.3) % W, y = H * 0.58 + (i * 13) % (H * 0.08); c.strokeStyle = '#5fae6a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x - 3, y); c.moveTo(x, y + 6); c.lineTo(x + 3, y); c.stroke(); }
  E(c, W * 0.5, H * 0.82, W * 0.62, H * 0.16); F(c, lg(c, 0, H * 0.66, 0, H * 0.98, [[0, '#86d0de'], [1, '#4f9eb8']]), '#b8aa90', 7);
  c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(W * (0.2 + i * 0.12), H * (0.8 + (i % 2) * 0.05), W * 0.03, H * 0.006, 0, 0, TAU); c.stroke(); }
  for (let i = 0; i < 9; i++) { const x = W * 0.06 + i * W * 0.11, y = H * 0.77 + Math.sin(i * 2.1) * H * 0.04; c.save(); c.translate(x, y); E(c, 0, 0, W * 0.05, H * 0.017); F(c, '#5fae6a', '#2f6b3a', 2); if (i % 3 === 1) flower(c, 0, -H * 0.02, H * 0.018, '#ffc2d4', '#ffd36b', 6); c.restore(); }
  c.strokeStyle = '#7a5a3a'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(W * 0.93, H * 0.62); c.quadraticCurveTo(W * 0.97, H * 0.3, W * 0.9, H * 0.02); c.stroke();
};
BG.kitchen = function (c, W, H) { // 御膳房后门·夜
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#1f2448'], [1, '#3a3458']]); c.fillRect(0, 0, W, H);
  for (let i = 0; i < 30; i++) { E(c, (i * 113.7) % W, (i * 61.3) % (H * 0.3), 1.2, 1.2); F(c, 'rgba(255,255,255,0.7)'); }
  roofTiles(c, -W * 0.02, H * 0.14, W * 1.04, H * 0.12, '#5a5a7a', '#3a3a5a');
  c.fillStyle = '#7a4a3a'; c.fillRect(0, H * 0.26, W, H * 0.4);
  rr(c, W * 0.34, H * 0.33, W * 0.32, H * 0.33, 4); F(c, lg(c, 0, H * 0.33, 0, H * 0.66, [[0, '#ffd88a'], [1, '#ff9a4a']]), OL, 3);
  c.fillStyle = 'rgba(120,60,20,0.25)'; for (let i = 0; i < 4; i++) c.fillRect(W * 0.36 + i * W * 0.075, H * 0.36, W * 0.05, H * 0.08);
  plaque(c, '御膳房', W * 0.5, H * 0.29, Math.min(W * 0.28, H * 0.24), H * 0.055);
  for (let i = 0; i < 3; i++) { rr(c, W * 0.05, H * 0.6 - i * H * 0.05, W * 0.18, H * 0.05, 6); F(c, '#d9b07a', OL, 2.5); c.strokeStyle = '#a0784a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(W * 0.06, H * 0.625 - i * H * 0.05); c.lineTo(W * 0.22, H * 0.625 - i * H * 0.05); c.stroke(); }
  E(c, W * 0.85, H * 0.62, W * 0.07, H * 0.06); F(c, '#8a4a2a', OL, 2.5); rr(c, W * 0.81, H * 0.55, W * 0.08, H * 0.02, 3); F(c, '#e8304a', OL, 2); rr(c, W * 0.83, H * 0.6, W * 0.04, H * 0.04, 2); F(c, '#e8304a'); txt(c, '酒', W * 0.85, H * 0.62, H * 0.026, '#ffe08a');
  c.fillStyle = '#4a4058'; c.fillRect(0, H * 0.66, W, H * 0.34);
  c.strokeStyle = 'rgba(0,0,0,0.2)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, H * 0.66 + i * H * 0.06); c.lineTo(W, H * 0.66 + i * H * 0.06); c.stroke(); }
};
BG.hall = function (c, W, H) { // 太和殿
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#6a2420'], [1, '#c25a3a']]); c.fillRect(0, 0, W, H);
  c.fillStyle = '#2f5e7a'; c.fillRect(0, 0, W, H * 0.08); for (let i = 0; i < 12; i++) { E(c, i * W / 11, H * 0.04, W * 0.03, H * 0.025); F(c, '#e8b84a'); flower(c, i * W / 11, H * 0.04, H * 0.014, '#2f5e7a', '#e8b84a', 6); }
  plaque(c, '正大光明', W * 0.5, H * 0.13, Math.min(W * 0.36, H * 0.3), H * 0.06);
  const cx = W * 0.5, cy = H * 0.52;
  // 屏风
  for (let i = -3; i <= 3; i++) { rr(c, cx + i * W * 0.07 - W * 0.034, cy - H * 0.36, W * 0.068, H * 0.3, 3); F(c, lg(c, 0, cy - H * 0.36, 0, cy, [[0, '#f7d670'], [1, '#d99a1e']]), '#8a5f10', 2); xiangyun(c, cx + i * W * 0.07 - W * 0.012, cy - H * 0.22, H / 1400, 'rgba(140,90,10,0.6)'); }
  // 龙椅
  rr(c, cx - W * 0.12, cy - H * 0.2, W * 0.24, H * 0.17, 16); F(c, lg(c, 0, cy - H * 0.2, 0, cy, [[0, '#ffe58a'], [1, '#d99a1e']]), '#8a5f10', 4);
  rr(c, cx - W * 0.09, cy - H * 0.08, W * 0.18, H * 0.05, 6); F(c, '#e8304a', '#8a5f10', 2);
  [W * 0.08, W * 0.92].forEach(x => { c.fillStyle = lg(c, x - W * 0.05, 0, x + W * 0.05, 0, [[0, '#a8302c'], [0.5, '#e05a4a'], [1, '#a8302c']]); c.fillRect(x - W * 0.05, H * 0.08, W * 0.1, H * 0.6);
    c.strokeStyle = '#f2c24d'; c.lineWidth = Math.max(4, W * 0.01); c.beginPath(); for (let y = H * 0.1; y < H * 0.66; y += 4) c.lineTo(x + Math.sin(y * 0.03) * W * 0.04, y); c.stroke(); E(c, x + Math.sin(H * 0.1 * 0.03) * W * 0.04, H * 0.1, W * 0.02, W * 0.02); F(c, '#f2c24d', OL, 2); });
  for (let i = 0; i < 4; i++) { c.fillStyle = shade('#e0cfa8', -i * 0.05); c.fillRect(W * 0.2 - i * W * 0.04, cy + i * H * 0.03, W * 0.6 + i * W * 0.08, H * 0.03); }
  floorTiles(c, H * 0.64, W, H, '#dcc6a4', '#b8a07a');
  c.beginPath(); c.moveTo(W * 0.38, H * 0.64); c.lineTo(W * 0.62, H * 0.64); c.lineTo(W * 0.8, H); c.lineTo(W * 0.2, H); c.closePath(); F(c, '#c0392b'); c.strokeStyle = '#f2c24d'; c.lineWidth = 3; c.stroke();
  [W * 0.22, W * 0.78].forEach(x => { E(c, x, H * 0.62, W * 0.045, H * 0.03); F(c, '#8a6a3a', OL, 2); rr(c, x - W * 0.03, H * 0.56, W * 0.06, H * 0.05, 6); F(c, '#a8844a', OL, 2); });
};
BG.rain = function (c, W, H) { BG.courtyard(c, W, H); c.fillStyle = 'rgba(40,50,90,0.55)'; c.fillRect(0, 0, W, H); };
BG.roof = function (c, W, H) { // 屋顶·月夜
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#14183a'], [1, '#3a3a6a']]); c.fillRect(0, 0, W, H);
  const r = Math.min(W, H) * 0.16;
  E(c, W * 0.5, H * 0.24, r * 2, r * 2); F(c, rg(c, W * 0.5, H * 0.24, r * 0.6, r * 2, [[0, 'rgba(255,248,216,0.6)'], [1, 'rgba(255,248,216,0)']])); E(c, W * 0.5, H * 0.24, r, r); F(c, '#fff6d0');
  E(c, W * 0.5 - r * 0.3, H * 0.24 - r * 0.2, r * 0.15, r * 0.12); F(c, 'rgba(220,210,170,0.7)'); E(c, W * 0.5 + r * 0.3, H * 0.24 + r * 0.25, r * 0.2, r * 0.15); F(c, 'rgba(220,210,170,0.7)');
  for (let i = 0; i < 50; i++) { E(c, (i * 89.3) % W, (i * 47.9) % (H * 0.5), 1.3, 1.3); F(c, 'rgba(255,255,255,0.8)'); }
  roofTiles(c, -W * 0.2, H * 0.56, W * 1.4, H * 0.5, '#4a5a8a', '#2a3460');
};
BG.cining = function (c, W, H) { // 慈宁宫
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#7a4a2a'], [1, '#b0703a']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,220,150,0.12)'; for (let i = 0; i < 8; i++) c.fillRect(i * W / 7, 0, W / 30, H * 0.62);
  rr(c, W * 0.3, H * 0.08, W * 0.4, H * 0.28, 10); F(c, '#f3e2c8', '#8a5a2a', 5); txt(c, '福寿', W * 0.5, H * 0.22, Math.min(H * 0.09, W * 0.12), '#8a2a2a');
  lantern(c, W * 0.15, H * 0.2, H / 650, 0, true); lantern(c, W * 0.85, H * 0.2, H / 650, 0, true);
  c.fillStyle = '#5a3018'; c.fillRect(0, H * 0.62, W, H * 0.38);
  rr(c, W * 0.18, H * 0.6, W * 0.64, H * 0.08, 8); F(c, '#2f7a5a', OL, 3);
  for (let i = 0; i < 5; i++) { c.save(); c.translate(W * 0.3 + i * W * 0.1, H * 0.635); c.rotate((i - 2) * 0.12); rr(c, -10, -14, 20, 28, 3); F(c, '#fff8ec', OL, 1.5); txt(c, ['万', '索', '筒', '红', '中'][i], 0, 0, 12, '#c0392b'); c.restore(); }
};
A.roofTiles = roofTiles; A.lantern = lantern; A.cloud = cloud; A.tree = tree; A.palaceWall = palaceWall; A.floorTiles = floorTiles; A.txt = txt; A.plaque = plaque; A.xiangyun = xiangyun;

const cache = {};
A.drawBG = function (c, name, W, H, t) {
  W = Math.max(1, Math.round(W)); H = Math.max(1, Math.round(H));
  const key = name + '|' + W + 'x' + H;
  let cv = cache[key];
  if (!cv) {
    cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const bx = cv.getContext('2d'); (BG[name] || BG.courtyard)(bx, W, H); if (A.FX && A.FX.bake) A.FX.bake(bx, name, W, H);
    const keys = Object.keys(cache); if (keys.length > 14) delete cache[keys[0]];
    cache[key] = cv;
  }
  c.drawImage(cv, 0, 0, W, H);
  anim(c, name, W, H, t || 0);
};
function anim(c, name, W, H, t) {
  c.save();
  if (name === 'title' || name === 'courtyard' || name === 'garden') {
    for (let i = 0; i < 18; i++) { const sp = 0.03 + (i % 5) * 0.01, x = ((i * 137.5 + t * 30 * (1 + i % 3)) % (W + 40)) - 20, y = ((i * 71.3 + t * H * sp) % (H + 40)) - 20; c.save(); c.translate(x, y); c.rotate(t * (1 + i % 3) + i); E(c, 0, 0, 5, 3); F(c, i % 2 ? 'rgba(255,180,205,0.9)' : 'rgba(255,228,236,0.95)'); c.restore(); }
  }
  if (name === 'courtyard' || name === 'gate') { lantern(c, W * 0.2, H * 0.33, H / 700, t, false); lantern(c, W * 0.8, H * 0.33, H / 700, t, false); }
  if (name === 'kitchen') { lantern(c, W * 0.12, H * 0.32, H / 650, t, true); lantern(c, W * 0.88, H * 0.32, H / 650, t, true);
    c.globalAlpha = 0.35; for (let i = 0; i < 3; i++) { const k = (t * 0.3 + i / 3) % 1; cloud(c, W * 0.14 + Math.sin(t + i) * 10, H * 0.45 - k * H * 0.3, H / 2500 * (1 + k), '#fff'); } c.globalAlpha = 1; }
  if (name === 'room_night') { lantern(c, W * 0.1, H * 0.3, H / 650, t, true); const f = 0.9 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7) * 0.05, cx = W * 0.44, cy = H * 0.465;
    E(c, cx, cy, H * 0.12, H * 0.12); F(c, rg(c, cx, cy, 0, H * 0.12, [[0, 'rgba(255,210,120,0.45)'], [1, 'rgba(255,210,120,0)']]));
    c.save(); c.translate(cx, cy); c.scale(f, f); c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(7, -2, 0, 4); c.quadraticCurveTo(-7, -2, 0, -14); F(c, '#ffb84a'); c.restore(); }
  if (name === 'bridge') {
    for (let i = 0; i < 5; i++) { c.globalAlpha = 0.18; const x = ((t * 15 * (i + 1) + i * 300) % (W * 1.6)) - W * 0.3; cloud(c, x, H * (0.62 + i * 0.07), H / 500, '#efe8ff'); }
    for (let i = 0; i < 6; i++) { c.globalAlpha = 0.6 + Math.sin(t * 3 + i) * 0.3; const x = W * (0.08 + i * 0.16) + Math.sin(t + i) * 10, y = H * (0.28 + (i % 3) * 0.08) + Math.cos(t * 1.3 + i) * 8; E(c, x, y, 10, 10); F(c, rg(c, x, y, 0, 12, [[0, '#d8f0ff'], [1, 'rgba(160,200,255,0)']])); }
    c.globalAlpha = 1; lantern(c, W * 0.69, H * 0.33, H / 700, t, true); lantern(c, W * 0.93, H * 0.33, H / 700, t, true); }
  if (name === 'carriage') {
    const wx = W * 0.18, wy = H * 0.1, ww = W * 0.64, wh = H * 0.3;
    c.save(); rr(c, wx, wy, ww, wh, 8); c.clip();
    c.fillStyle = lg(c, 0, wy, 0, wy + wh, [[0, '#8fcaf0'], [1, '#d8eefa']]); c.fillRect(wx, wy, ww, wh);
    cloud(c, wx + ww * 0.3 - (t * 8) % ww, wy + wh * 0.2, wh / 400, '#fff');
    const seg = ww * 0.5, off = (t * 60) % seg;
    for (let k = -1; k < 4; k++) { const x = wx + k * seg - off; c.fillStyle = '#c7443f'; c.fillRect(x, wy + wh * 0.48, seg, wh * 0.52); roofTiles(c, x + seg * 0.05, wy + wh * 0.36, seg * 0.9, wh * 0.13, '#f7cf5a', '#d99a1e'); tree(c, x + seg * 0.5, wy + wh * 1.05, wh / 420, k % 2 === 0); }
    c.restore();
    c.fillStyle = '#d84a4a'; [[wx - 14, 1], [wx + ww + 14, -1]].forEach(([x, s]) => { const sw = Math.sin(t * 3) * 4; c.beginPath(); c.moveTo(x, wy - 12); c.quadraticCurveTo(x + s * (ww * 0.12 + sw), wy + wh * 0.5, x + s * 8, wy + wh + 12); c.lineTo(x, wy + wh + 12); c.closePath(); F(c, '#d84a4a', OL, 2); });
    rr(c, wx - 18, wy - 24, ww + 36, 16, 6); F(c, '#e8b84a', OL, 2);
    for (let i = 0; i < 11; i++) { const x = wx + i * ww / 10; c.strokeStyle = '#e8304a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, wy - 8); c.lineTo(x + Math.sin(t * 6 + i) * 3, wy + 10); c.stroke(); E(c, x + Math.sin(t * 6 + i) * 3, wy + 12, 3, 3); F(c, '#f2c24d'); }
  }
  if (name === 'rain') { c.strokeStyle = 'rgba(200,220,255,0.6)'; c.lineWidth = 1.5; for (let i = 0; i < 90; i++) { const x = (i * 53.7 + t * 120) % W, y = (i * 97.1 + t * 900) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 5, y + 16); c.stroke(); } }
  if (name === 'roof') { for (let i = 0; i < 3; i++) { const k = (t * 0.03 + i / 3) % 1; c.globalAlpha = 0.3; cloud(c, -100 + k * (W + 200), H * (0.15 + i * 0.12), H / 900, '#cfd6ff'); } c.globalAlpha = 1; }
  if (name === 'hall') { lantern(c, W * 0.2, H * 0.2, H / 650, t, true); lantern(c, W * 0.8, H * 0.2, H / 650, t, true); }
  if (name === 'room') { c.fillStyle = 'rgba(255,200,220,' + (0.05 + Math.sin(t * 5) * 0.03) + ')'; c.fillRect(W * 0.5, H * 0.3, W * 0.5, H * 0.4); }
  if (A.ANIM_EXT) A.ANIM_EXT(c, name, W, H, t);
  c.restore();
}

/* ---------- 死法场景（死法卡 / 图鉴） ---------- */
A.drawDeathScene = function (c, W, H, id, t) {
  const d = P.DEATH_MAP[id] || {}, prop = d.prop || 'ghost';
  c.save();
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#fff8ea'], [1, '#f3e2c4']]); c.fillRect(0, 0, W, H);
  c.save(); c.translate(W / 2, H * 0.55); c.rotate(t * 0.15); c.fillStyle = 'rgba(232,184,74,0.2)'; for (let i = 0; i < 16; i++) { c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, W + H, i * TAU / 16, i * TAU / 16 + TAU / 32); c.closePath(); c.fill(); } c.restore();
  const s = H / 430, cx = W / 2, by = H * 0.97;
  const ext = A.DPROPS && A.DPROPS[prop];
  if (ext && ext.back) { c.save(); ext.back(c, cx, by, s, t); c.restore(); } else dprop(c, prop, cx, by, s, t, 'back');
  if (prop === 'tea') A.drawChar(c, 'modern', cx, by - 8 * s, s, { t, ghost: true, face: 'dead', prop: 'none' });
  else if (prop === 'statue') A.drawChar(c, 'me', cx, by, s, { t, stone: true, face: 'dead', still: true });
  else A.drawChar(c, 'me', cx, by - 8 * s, s, { t, ghost: true, face: 'dead' });
  if (ext && ext.front) { c.save(); ext.front(c, cx, by, s, t); c.restore(); } else if (!ext) dprop(c, prop, cx, by, s, t, 'front');
  c.restore();
};
function dprop(c, prop, cx, by, s, t, layer) {
  c.save();
  const X = v => cx + v * s, Y = v => by + v * s, fz = v => v * s;
  if (layer === 'back') {
    if (prop === 'moon') { E(c, X(0), Y(-330), fz(60), fz(60)); F(c, '#fff3c0', '#e8c870', 3); roofTiles(c, X(-220), Y(-70), fz(440), fz(90), '#4a5a8a', '#2a3460'); }
    if (prop === 'lotus') { E(c, X(0), Y(-20), fz(200), fz(42)); F(c, '#7fc8d8', '#4f9eb8', 3); for (let i = -2; i <= 2; i++) { E(c, X(i * 72), Y(-24 + Math.abs(i) * 6), fz(34), fz(12)); F(c, '#5fae6a', '#2f6b3a', 2); } }
    if (prop === 'cat') { rr(c, X(-170), Y(-80), fz(110), fz(80), fz(8)); F(c, '#a8a29a', OL, 3); for (let i = 0; i < 3; i++) { c.strokeStyle = 'rgba(0,0,0,0.2)'; c.lineWidth = 2; c.beginPath(); c.moveTo(X(-170), Y(-60 + i * 22)); c.lineTo(X(-60), Y(-60 + i * 22)); c.stroke(); } E(c, X(-115), Y(-80), fz(55), fz(13)); F(c, '#222', OL, 3); }
    if (prop === 'peony') A.peony(c, X(130), Y(-130), s * 1.6, '#e8304a', t);
    if (prop === 'yoga') { rr(c, X(-170), Y(-16), fz(340), fz(14), fz(6)); F(c, '#8fd0c0', OL, 2); }
  } else {
    const T = (str, x, y, size, col) => txt(c, str, X(x), Y(y), fz(size), col);
    switch (prop) {
      case 'tea': A.drawProp(c, 'milktea', t, X(110), Y(-60)); T('全糖去冰', 110, -160, 24, '#e2577e'); break;
      case 'stars': for (let i = 0; i < 9; i++) { const a = t * 2 + i * TAU / 9; star(c, X(Math.cos(a) * 74), Y(-322 + Math.sin(a) * 18), fz(11), '#ffd84a'); } break;
      case 'sign': c.save(); c.translate(X(118), Y(-130)); c.rotate(0.12); rr(c, fz(-62), fz(-26), fz(124), fz(52), fz(6)); F(c, '#fff', OL, 3); txt(c, '打工人', 0, 0, fz(26), '#c0392b'); c.restore(); break;
      case 'bug': for (let i = 0; i < 6; i++) { E(c, X(90 + i * 12), Y(-30 + Math.sin(t * 6 + i) * 4), fz(9), fz(9)); F(c, '#8fd06a', '#3f7a2a', 2); } E(c, X(166), Y(-34), fz(11), fz(11)); F(c, '#8fd06a', '#3f7a2a', 2); E(c, X(170), Y(-36), fz(2.5), fz(2.5)); F(c, '#222'); T('啊——！', -110, -300, 24, '#e03a3a'); break;
      case 'fail': c.save(); c.translate(X(120), Y(-120)); c.rotate(-0.1); rr(c, fz(-50), fz(-60), fz(100), fz(120), fz(4)); F(c, '#fffaf0', OL, 2.5); c.strokeStyle = '#e03a3a'; c.lineWidth = fz(8); c.beginPath(); c.moveTo(fz(-30), fz(-34)); c.lineTo(fz(30), fz(26)); c.moveTo(fz(30), fz(-34)); c.lineTo(fz(-30), fz(26)); c.stroke(); txt(c, '不及格', 0, fz(46), fz(20), '#e03a3a'); c.restore(); break;
      case 'seal': c.save(); c.translate(X(120), Y(-130)); c.rotate(0.15); rr(c, fz(-36), fz(-72), fz(72), fz(144), fz(3)); F(c, '#fff', '#c0392b', 4); txt(c, '封', 0, fz(-28), fz(40), '#c0392b'); txt(c, '条', 0, fz(28), fz(40), '#c0392b'); c.restore(); break;
      case 'eyes': for (let i = 0; i < 5; i++) sparkle(c, X(Math.cos(t + i) * 130), Y(-230 + Math.sin(t * 1.3 + i) * 80), fz(8 + i % 3 * 4), '#ffd84a'); T('好帅……', 120, -320, 24, '#c0392b'); break;
      case 'qmark': T('？', 130, -260 + Math.sin(t * 3) * 6, 80, '#7a5ab8'); T('前男友是何物', -100, -340, 20, '#7a5ab8'); break;
      case 'peony': T('画像里赶路', -110, -60, 22, '#c0392b'); break;
      case 'cat': A.drawCat(c, X(130), Y(-6), s * 0.9, { t, mood: 'happy' }); for (let k = -1; k <= 1; k += 2) { c.lineCap = 'round'; c.strokeStyle = OL; c.lineWidth = fz(11); c.beginPath(); c.moveTo(X(-115 + k * 12), Y(-88)); c.lineTo(X(-115 + k * 16 + Math.sin(t * 14 + k) * 8), Y(-130)); c.stroke(); c.strokeStyle = '#fcd6e1'; c.lineWidth = fz(7); c.stroke(); } break;
      case 'cake': A.drawProp(c, 'cake', t, X(120), Y(-60)); T('抓贼啊！', -110, -300, 22, '#c0392b'); break;
      case 'incense': A.drawProp(c, 'incense', t, X(120), Y(-40)); T('Z z z', -110, -310 + Math.sin(t * 2) * 6, 40, '#7a8fd0'); break;
      case 'statue': c.strokeStyle = 'rgba(120,150,200,0.55)'; c.lineWidth = fz(2); for (let i = 0; i < 40; i++) { const x = X((i * 37) % 320 - 160), y = Y(-((i * 53 + t * 400) % 430)); c.beginPath(); c.moveTo(x, y); c.lineTo(x - fz(4), y + fz(14)); c.stroke(); } T('储秀宫新景点', 110, -350, 20, '#5a6a8a'); break;
      case 'moon': T('瓦片很滑', 120, -160, 22, '#5a4a8a'); break;
      case 'note': c.save(); c.translate(X(120), Y(-140)); c.rotate(0.2 + Math.sin(t * 2) * 0.05); rr(c, fz(-44), fz(-32), fz(88), fz(64), fz(3)); F(c, '#fffbe8', OL, 2); txt(c, '今夜子时', 0, fz(-10), fz(15), '#3a2a2a'); txt(c, '老地方见', 0, fz(14), fz(15), '#3a2a2a'); c.restore(); break;
      case 'list': c.save(); c.translate(X(125), Y(-160)); rr(c, fz(-44), fz(-84), fz(88), fz(168), fz(4)); F(c, '#fffaf0', OL, 2); ['桂嬷嬷', '李嬷嬷', '张嬷嬷', '王嬷嬷', '钱嬷嬷'].forEach((n, i) => txt(c, n, 0, fz(-58 + i * 29), fz(15), '#3a2a2a')); c.restore(); break;
      case 'yoga': T('下犬式', 120, -310, 22, '#3f9a7c'); break;
      case 'burp': c.save(); c.translate(X(110), Y(-300)); const sc = 1 + Math.sin(t * 4) * 0.05; c.scale(sc, sc); E(c, 0, 0, fz(72), fz(44)); F(c, '#fff', OL, 3); txt(c, '嗝——', 0, 0, fz(38), '#c0392b'); c.restore(); break;
      case 'lotus': c.save(); c.translate(X(120), Y(-60)); c.rotate(Math.sin(t * 2) * 0.1); rr(c, fz(-24), fz(-24), fz(48), fz(48), fz(4)); F(c, '#fff', '#e2577e', 3); flower(c, 0, 0, fz(10), '#ffc2d4'); c.restore(); break;
      case 'hanky': c.save(); c.translate(X(-120), Y(-40)); c.rotate(0.3); rr(c, fz(-22), fz(-22), fz(44), fz(44), fz(4)); F(c, '#fff', '#e2577e', 3); c.restore(); A.drawChar(c, 'guard', X(140), by, s * 0.72, { t, face: 'angry' }); T('此女有异动！', 120, -300, 19, '#c0392b'); break;
      case 'taboo': c.save(); c.translate(X(120), Y(-170)); c.rotate(-0.1); E(c, 0, 0, fz(56), fz(56)); F(c, '#fff', '#c0392b', 5); txt(c, '讳', 0, fz(4), fz(60), '#c0392b'); c.restore(); break;
      case 'abc': ['A', 'B', 'C'].forEach((ch, i) => txt(c, ch, X(80 + i * 40), Y(-230 - Math.sin(t * 3 + i) * 14), fz(46), ['#e2577e', '#3a8fd0', '#e8a020'][i], 'sans-serif')); A.drawChar(c, 'taijian', X(-140), by, s * 0.7, { t, face: 'panic' }); break;
      case 'book': c.save(); c.translate(X(120), Y(-140)); c.rotate(-0.12); rr(c, fz(-50), fz(-66), fz(100), fz(132), fz(6)); F(c, '#4a3a6a', '#e8b84a', 3); ['生', '死', '簿'].forEach((ch, i) => txt(c, ch, 0, fz(-32 + i * 32), fz(26), '#ffe08a')); c.restore(); T('查无此鬼', -110, -320, 20, '#5a4a8a'); break;
    }
  }
  c.restore();
}
})(window.PALACE = window.PALACE || {});
