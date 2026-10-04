/* 第四章 新角色、新场景、新道具、新死法场景 */
(function (P) {
const A = P.ART, { E, F, L, rr, lg, rg, shade, flower, star, sparkle, heart, OL, TAU } = A.util;
const BG = A.BG;
const { roofTiles, lantern, cloud, tree, palaceWall, floorTiles, txt, plaque, xiangyun } = A;
Object.assign(A.CH, {
  jingtaifei: { name: '静太妃', skin: '#f3dccd', hair: '#c4bcbc', eye: '#4a3a3a', back: 'none', bangs: 'old', buns: 'tight', old: true, eyesDefault: 'kind', mole: true,
    outer: '#9d93b4', inner: '#efe8e0', skirt: '#b3aac4', skirt2: '#8a809e', trim: '#6a6084', sash: '#5a5070', pattern: 'patch', pose: 'hold', prop: 'cabbage', orn: ['pinWood', 'apron'] },
  xuanjizi: { name: '玄机子', skin: '#fbe2cf', hair: '#e2e0e6', eye: '#3a3050', back: 'male', bangs: 'male', buns: 'topknot', male: true, old: true, glasses: true, eyesDefault: 'squint',
    outer: '#2c3c72', inner: '#fbfbff', skirt: '#2c3c72', skirt2: '#1c2754', trim: '#f2c24d', sash: '#f2c24d', pattern: 'taiji', pose: 'whisk', prop: 'whisk', orn: ['daoCrown', 'beard', 'robeStars'] },
});
function cabbage(c, x, y, r) {
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.55; E(c, x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.25 + r * 0.1, r * 0.55, r * 0.7); F(c, i % 2 ? '#a6d88a' : '#8cc870', '#3f7a2a', 1.6); }
  E(c, x, y + r * 0.15, r * 0.5, r * 0.6); F(c, '#eef8d8', '#6aa04a', 1.6);
  c.strokeStyle = 'rgba(80,140,60,0.6)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y - r * 0.35); c.lineTo(x, y + r * 0.6); c.stroke();
}
function mirrorDisc(c, x, y, r, t, half) { // 照影镜
  E(c, x, y, r * 1.12, r * 1.12); F(c, lg(c, x, y - r, x, y + r, [[0, '#f2d58a'], [1, '#a8742a']]), '#5a3a10', 3);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E(c, x + Math.cos(a) * r * 1.06, y + Math.sin(a) * r * 1.06, r * 0.05, r * 0.05); F(c, '#fff1a8'); }
  c.save(); E(c, x, y, r, r); c.clip();
  c.fillStyle = rg(c, x - r * 0.3, y - r * 0.3, r * 0.1, r * 1.2, [[0, '#dfe8ff'], [0.6, '#7a8ac8'], [1, '#2a3060']]); c.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 9; i++) star(c, x + Math.cos(i * 2.1 + t * 0.3) * r * 0.6, y + Math.sin(i * 1.7 + t * 0.2) * r * 0.55, r * 0.05 * (1 + (i % 3) * 0.4), '#fffbe0');
  c.fillStyle = 'rgba(255,255,255,0.28)'; c.beginPath(); c.ellipse(x - r * 0.35, y - r * 0.35, r * 0.18, r * 0.5, -0.7, 0, TAU); c.fill();
  if (half) { c.fillStyle = 'rgba(30,24,40,0.85)'; c.beginPath(); c.moveTo(x + r * 0.05, y - r); c.lineTo(x - r * 0.08, y - r * 0.4); c.lineTo(x + r * 0.1, y); c.lineTo(x - r * 0.06, y + r * 0.5); c.lineTo(x + r * 0.04, y + r); c.lineTo(x + r, y + r); c.lineTo(x + r, y - r); c.closePath(); c.fill(); }
  else { c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + r * 0.05, y - r); c.lineTo(x - r * 0.08, y - r * 0.4); c.lineTo(x + r * 0.1, y); c.lineTo(x - r * 0.06, y + r * 0.5); c.lineTo(x + r * 0.04, y + r); c.stroke(); }
  c.restore();
}
function armillary(c, x, y, r, t) { // 浑天仪
  c.strokeStyle = '#c99a3a'; c.lineWidth = Math.max(2, r * 0.06);
  E(c, x, y, r, r); c.stroke();
  c.save(); c.translate(x, y); c.rotate(0.4); c.beginPath(); c.ellipse(0, 0, r, r * 0.32, 0, 0, TAU); c.stroke(); c.restore();
  c.save(); c.translate(x, y); c.rotate(t * 0.3); c.beginPath(); c.ellipse(0, 0, r * 0.3, r, 0, 0, TAU); c.stroke(); c.restore();
  E(c, x, y, r * 0.16, r * 0.16); F(c, '#ffd86b', '#7a5210', 1.5);
  c.fillStyle = '#7a5210'; c.fillRect(x - r * 0.08, y + r, r * 0.16, r * 0.5); rr(c, x - r * 0.5, y + r * 1.45, r, r * 0.2, 4); F(c, '#8a6020', OL, 2);
}
function radishCake(c, x, y, r) { for (let i = 0; i < 3; i++) { rr(c, x - r + i * r * 0.35, y - r * 0.4 - i * r * 0.25, r * 1.1, r * 0.5, r * 0.08); F(c, '#f6e2b0', '#a8743a', 1.5); c.fillStyle = 'rgba(200,140,60,0.5)'; c.fillRect(x - r + i * r * 0.35, y - r * 0.4 - i * r * 0.25, r * 1.1, r * 0.1); } }
function pill(c, x, y, r, t) { E(c, x, y, r, r); F(c, rg(c, x - r * 0.3, y - r * 0.3, r * 0.1, r, [[0, '#fff6c0'], [1, '#e2a91f']]), '#8a5f10', 2); sparkle(c, x + r * 0.9, y - r * 0.9, r * 0.4 + Math.sin(t * 4) * r * 0.1, '#fff'); }
function pot(c, x, y, r, col, t, steam) {
  c.beginPath(); c.moveTo(x - r, y - r * 0.4); c.quadraticCurveTo(x - r * 1.1, y + r * 0.8, x, y + r * 0.85); c.quadraticCurveTo(x + r * 1.1, y + r * 0.8, x + r, y - r * 0.4); c.closePath(); F(c, col || '#8a5a3a', OL, 2.5);
  E(c, x, y - r * 0.4, r, r * 0.25); F(c, '#4a2a18', OL, 2);
  rr(c, x + r * 0.9, y - r * 0.2, r * 0.5, r * 0.16, r * 0.08); F(c, '#6a4028', OL, 1.5);
  if (steam) for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; c.globalAlpha = 0.7 * (1 - k); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + (i - 1) * r * 0.4, y - r * 0.5); c.quadraticCurveTo(x + (i - 1) * r * 0.4 + Math.sin(t * 3 + i) * r * 0.3, y - r * (0.5 + k * 0.6), x + (i - 1) * r * 0.4, y - r * (0.6 + k * 1.1)); c.stroke(); } c.globalAlpha = 1;
}
function ledger(c, x, y, r, col) { rr(c, x - r, y - r * 0.7, r * 2, r * 1.4, r * 0.1); F(c, col || '#c9a77a', OL, 2); rr(c, x - r * 0.7, y - r * 0.45, r * 0.5, r * 0.9, 2); F(c, '#fff6e0', OL, 1); txt(c, '账', x - r * 0.45, y, r * 0.42, '#8a2a2a'); c.strokeStyle = OL; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x + r * 0.85, y - r * 0.5 + i * r * 0.33); c.lineTo(x + r * 1.0, y - r * 0.5 + i * r * 0.33); c.stroke(); } }
function dessert(c, x, y, r, kind) {
  E(c, x, y + r * 0.3, r * 1.2, r * 0.35); F(c, '#fff', '#4a8fd0', 1.5);
  if (kind === 0) { for (let i = 0; i < 3; i++) { E(c, x + (i - 1) * r * 0.5, y - (i === 1 ? r * 0.3 : 0), r * 0.42, r * 0.38); F(c, '#fff8f2', '#c9b6a6', 1.5); } }
  else if (kind === 1) { rr(c, x - r * 0.7, y - r * 0.5, r * 1.4, r * 0.7, r * 0.15); F(c, '#f3a6b8', '#a8506a', 1.5); flower(c, x, y - r * 0.6, r * 0.25, '#fff', '#ffd36b'); }
  else if (kind === 2) { for (let i = 0; i < 4; i++) { rr(c, x - r * 0.75 + (i % 2) * r * 0.75, y - r * 0.55 + Math.floor(i / 2) * r * 0.4, r * 0.7, r * 0.38, 3); F(c, '#9fd08a', '#3f7a2a', 1.2); } }
  else { E(c, x, y - r * 0.15, r * 0.7, r * 0.5); F(c, '#f2c24d', '#a8742a', 1.5); E(c, x, y - r * 0.3, r * 0.3, r * 0.12); F(c, '#e04a4a'); }
}
A.cabbage = cabbage; A.mirrorDisc = mirrorDisc; A.armillary = armillary; A.medPot = pot; A.ledger = ledger; A.dessert = dessert; A.pillBall = pill;

/* ---------- 场景 ---------- */
BG.lenggong = function (c, W, H) { // 冷宫·菜园
  c.fillStyle = lg(c, 0, 0, 0, H * 0.5, [[0, '#b9c0c8'], [1, '#e2e2dc']]); c.fillRect(0, 0, W, H * 0.5);
  cloud(c, W * 0.25, H * 0.1, H / 800, '#f4f4f0'); cloud(c, W * 0.8, H * 0.14, H / 1000, '#f4f4f0');
  palaceWall(c, H * 0.2, H * 0.46, W);
  c.fillStyle = 'rgba(120,110,100,0.35)'; for (let i = 0; i < 6; i++) { const x = W * (0.1 + i * 0.16); c.beginPath(); c.moveTo(x, H * 0.3); c.lineTo(x + 8, H * 0.36); c.lineTo(x - 4, H * 0.4); c.lineTo(x + 6, H * 0.45); c.lineWidth = 2; c.strokeStyle = 'rgba(80,60,50,0.4)'; c.stroke(); }
  plaque(c, '冷宫', W * 0.5, H * 0.18, Math.min(W * 0.16, H * 0.2), H * 0.05);
  // 歪门
  rr(c, W * 0.44, H * 0.24, W * 0.12, H * 0.22, 2); F(c, '#6a4a3a', OL, 2.5); c.save(); c.translate(W * 0.5, H * 0.24); c.rotate(0.05); rr(c, 0, 0, W * 0.06, H * 0.22, 2); F(c, '#8a5a3a', OL, 2); c.restore();
  // 地面
  c.fillStyle = '#b8a888'; c.fillRect(0, H * 0.46, W, H * 0.54);
  // 菜畦
  for (let r = 0; r < 3; r++) { const y = H * (0.6 + r * 0.11); c.fillStyle = '#8a6a48'; rr(c, W * 0.04, y - H * 0.02, W * 0.4, H * 0.05, 8); c.fill(); for (let i = 0; i < 5; i++) cabbage(c, W * (0.08 + i * 0.08), y - H * 0.01, Math.min(W, H) * 0.028); }
  // 井
  const wx = W * 0.8, wy = H * 0.66; E(c, wx, wy, W * 0.07, H * 0.025); F(c, '#4a4a4a', OL, 2); rr(c, wx - W * 0.07, wy, W * 0.14, H * 0.08, 4); F(c, '#9a9488', OL, 2.5);
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 5; c.beginPath(); c.moveTo(wx - W * 0.06, wy); c.lineTo(wx - W * 0.06, wy - H * 0.14); c.lineTo(wx + W * 0.06, wy - H * 0.14); c.lineTo(wx + W * 0.06, wy); c.stroke();
  // 杂草
  c.strokeStyle = '#7a9a5a'; c.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = H * (0.47 + (i % 4) * 0.012); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y - 10); c.moveTo(x, y); c.lineTo(x + 4, y - 8); c.stroke(); }
};
BG.lenggong_night = function (c, W, H) { BG.lenggong(c, W, H); c.fillStyle = 'rgba(18,22,52,0.66)'; c.fillRect(0, 0, W, H); const r = Math.min(W, H) * 0.06; E(c, W * 0.86, H * 0.1, r, r); F(c, '#fff6d0'); E(c, W * 0.86 + r * 0.35, H * 0.1 - r * 0.2, r * 0.85, r * 0.85); F(c, '#3a3e66'); };
BG.juanku = function (c, W, H) { // 太医院·卷宗库
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#4a3a2c'], [1, '#2a2018']]); c.fillRect(0, 0, W, H);
  for (let k = 0; k < 3; k++) { const x0 = W * (0.03 + k * 0.33), cw = W * 0.28; rr(c, x0, H * 0.08, cw, H * 0.56, 3); F(c, '#6a4428', OL, 3);
    for (let j = 0; j < 5; j++) { const y = H * (0.12 + j * 0.105); c.fillStyle = '#4a2c18'; c.fillRect(x0 + 6, y + H * 0.08, cw - 12, 5); for (let i = 0; i < 8; i++) { const sx = x0 + 10 + i * (cw - 20) / 8; E(c, sx + (cw - 20) / 16, y + H * 0.06, (cw - 20) / 18, H * 0.022); F(c, ['#efe2c0', '#e6d2a8', '#d8c8a0'][(i + j + k) % 3], '#8a6a3a', 1); c.fillStyle = '#c0392b'; c.fillRect(sx + (cw - 20) / 16 - 2, y + H * 0.04, 4, H * 0.04); } } }
  c.fillStyle = '#3a2a1e'; c.fillRect(0, H * 0.64, W, H * 0.36); c.fillStyle = 'rgba(0,0,0,0.15)'; for (let x = 0; x < W; x += 70) c.fillRect(x, H * 0.64, 2, H * 0.36);
  rr(c, W * 0.38, H * 0.72, W * 0.24, H * 0.04, 3); F(c, '#6a4428', OL, 2); ledger(c, W * 0.47, H * 0.71, Math.min(W, H) * 0.03, '#d8c090');
};
BG.guanxing = function (c, W, H) { // 观星台
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#0e1236'], [0.6, '#2a2c6a'], [1, '#4a3a7a']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(200,190,255,0.08)'; c.beginPath(); c.ellipse(W * 0.5, H * 0.3, W * 0.7, H * 0.08, -0.3, 0, TAU); c.fill();
  for (let i = 0; i < 70; i++) { const x = (i * 137.5) % W, y = (i * 61.3) % (H * 0.6); c.fillStyle = 'rgba(255,255,240,' + (0.4 + (i % 5) * 0.12) + ')'; c.fillRect(x, y, i % 7 ? 2 : 3, i % 7 ? 2 : 3); }
  // 北斗
  const bd = [[0.12, 0.12], [0.18, 0.1], [0.24, 0.13], [0.3, 0.16], [0.33, 0.24], [0.42, 0.24], [0.43, 0.16]]; c.strokeStyle = 'rgba(255,240,180,0.3)'; c.lineWidth = 1; c.beginPath(); bd.forEach(([x, y], i) => i ? c.lineTo(W * x, H * y) : c.moveTo(W * x, H * y)); c.stroke(); bd.forEach(([x, y]) => star(c, W * x, H * y, Math.min(W, H) * 0.012, '#fff6c0'));
  // 台面
  c.fillStyle = '#5a5a6e'; c.beginPath(); c.moveTo(0, H * 0.62); c.lineTo(W, H * 0.62); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#7a7a8e'; c.fillRect(0, H * 0.6, W, H * 0.03);
  for (let x = 0; x < W; x += W / 14) { rr(c, x, H * 0.54, 8, H * 0.07, 2); F(c, '#8a8aa0', OL, 1.5); } c.fillStyle = '#8a8aa0'; c.fillRect(0, H * 0.54, W, 6);
  armillary(c, W * 0.8, H * 0.38, Math.min(W * 0.09, H * 0.12), 0);
  // 台阶（左侧向下）
  for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#4a4a5e' : '#545468'; c.fillRect(W * (0.02 + i * 0.025), H * (0.66 + i * 0.055), W * 0.16, H * 0.055); }
};
BG.chahui = function (c, W, H) { // 永和宫水榭·茶会
  c.fillStyle = lg(c, 0, 0, 0, H * 0.5, [[0, '#bfe6f5'], [1, '#f4fbff']]); c.fillRect(0, 0, W, H * 0.5);
  c.fillStyle = lg(c, 0, H * 0.4, 0, H, [[0, '#8fd0c8'], [1, '#4f9eb0']]); c.fillRect(0, H * 0.4, W, H * 0.6);
  for (let i = 0; i < 7; i++) { const x = W * (0.06 + i * 0.15), y = H * (0.5 + (i % 3) * 0.05); E(c, x, y, W * 0.04, H * 0.014); F(c, '#5fae6a', '#2f6b3a', 1.5); if (i % 2) { c.beginPath(); c.moveTo(x, y - 4); c.quadraticCurveTo(x - 8, y - 22, x, y - 28); c.quadraticCurveTo(x + 8, y - 22, x, y - 4); F(c, '#f8b8c8', '#c2607a', 1.2); } }
  // 水榭屋檐
  roofTiles(c, -W * 0.02, H * 0.02, W * 1.04, H * 0.1, '#4f8a7a', '#2f5a50');
  c.fillStyle = '#c0392b'; [0.04, 0.3, 0.67, 0.93].forEach(k => c.fillRect(W * k, H * 0.12, W * 0.025, H * 0.5));
  for (let i = 0; i < 9; i++) { c.strokeStyle = '#7fbfa8'; c.lineWidth = 2; c.beginPath(); c.moveTo(W * (0.05 + i * 0.11), H * 0.12); c.quadraticCurveTo(W * (0.1 + i * 0.11), H * 0.18, W * (0.16 + i * 0.11), H * 0.12); c.stroke(); }
  // 地板 + 栏杆
  c.fillStyle = '#d8c6a6'; c.fillRect(0, H * 0.66, W, H * 0.34); c.fillStyle = 'rgba(0,0,0,0.07)'; for (let x = 0; x < W; x += 50) c.fillRect(x, H * 0.66, 2, H * 0.34);
  c.fillStyle = '#c0392b'; c.fillRect(0, H * 0.62, W, H * 0.015); for (let x = 0; x < W; x += W / 20) c.fillRect(x, H * 0.58, 4, H * 0.05);
  // 茶桌
  rr(c, W * 0.3, H * 0.74, W * 0.4, H * 0.05, 6); F(c, '#8a4a2a', OL, 2.5);
  for (let i = 0; i < 4; i++) dessert(c, W * (0.36 + i * 0.09), H * 0.72, Math.min(W, H) * 0.022, i);
};
BG.mirror = function (c, W, H) { // 镜中
  c.fillStyle = rg(c, W * 0.5, H * 0.4, 10, Math.max(W, H), [[0, '#3a3a7a'], [1, '#0a0a22']]); c.fillRect(0, 0, W, H);
  for (let i = 0; i < 50; i++) { const x = (i * 173.3) % W, y = (i * 91.7) % H; c.fillStyle = 'rgba(220,220,255,' + (0.2 + (i % 4) * 0.12) + ')'; c.fillRect(x, y, 2, 2); }
  mirrorDisc(c, W * 0.5, H * 0.34, Math.min(W * 0.2, H * 0.24), 0, false);
  c.fillStyle = 'rgba(180,190,255,0.12)'; c.beginPath(); c.ellipse(W * 0.5, H * 0.86, W * 0.45, H * 0.1, 0, 0, TAU); c.fill();
};
const prevAnim = A.ANIM_EXT;
A.ANIM_EXT = function (c, name, W, H, t) {
  if (prevAnim) prevAnim(c, name, W, H, t);
  if (name === 'lenggong') { for (let i = 0; i < 2; i++) { const k = (t * 0.04 + i * 0.5) % 1, x = -40 + k * (W + 80), y = H * (0.12 + i * 0.06) + Math.sin(t * 3 + i) * 6; c.strokeStyle = '#2a2a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 10, y - Math.abs(Math.sin(t * 8 + i)) * 6); c.quadraticCurveTo(x - 4, y, x, y + 2); c.quadraticCurveTo(x + 4, y, x + 10, y - Math.abs(Math.sin(t * 8 + i)) * 6); c.stroke(); }
    for (let i = 0; i < 5; i++) { const k = (t * 0.15 + i / 5) % 1; c.globalAlpha = 0.6 * (1 - k); E(c, W * (0.1 + i * 0.2) + Math.sin(t + i) * 20, H * (0.5 + k * 0.1), 3, 2); F(c, '#c8a878'); } c.globalAlpha = 1; }
  if (name === 'lenggong_night') { lantern(c, W * 0.2 + Math.sin(t * 0.7) * W * 0.05, H * 0.42, H / 800, t, true); for (let i = 0; i < 6; i++) { const a = t * 0.7 + i; c.globalAlpha = 0.5 + Math.sin(t * 3 + i) * 0.3; E(c, W * (0.1 + i * 0.15) + Math.sin(a) * 20, H * (0.55 + Math.cos(a * 1.3) * 0.08), 2.5, 2.5); F(c, '#e8ff9a'); } c.globalAlpha = 1; }
  if (name === 'juanku') { E(c, W * 0.5, H * 0.66, W * 0.32, H * 0.22); F(c, rg(c, W * 0.5, H * 0.66, 5, W * 0.32, [[0, 'rgba(255,200,110,' + (0.18 + Math.sin(t * 7) * 0.03) + ')'], [1, 'rgba(255,200,110,0)']])); for (let i = 0; i < 14; i++) { const k = (t * 0.05 + i / 14) % 1; c.globalAlpha = 0.5 * Math.sin(k * Math.PI); E(c, W * (0.2 + (i * 0.37) % 0.6) + Math.sin(t + i) * 10, H * (0.7 - k * 0.5), 1.6, 1.6); F(c, '#ffe8b0'); } c.globalAlpha = 1; }
  if (name === 'guanxing') { for (let i = 0; i < 12; i++) { const x = (i * 211.7) % W, y = (i * 47.3) % (H * 0.5); c.globalAlpha = 0.5 + Math.sin(t * 2 + i * 1.7) * 0.5; sparkle(c, x, y, 4 + (i % 3) * 2, '#fffbe0'); } c.globalAlpha = 1; armillary(c, W * 0.8, H * 0.38, Math.min(W * 0.09, H * 0.12), t);
    const k = (t * 0.12) % 1; if (k < 0.15) { const x = W * (0.2 + k * 3), y = H * (0.05 + k * 1.2); c.strokeStyle = 'rgba(255,255,230,' + (1 - k / 0.15) + ')'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - W * 0.08, y - H * 0.04); c.stroke(); } }
  if (name === 'chahui') { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5; for (let i = 0; i < 10; i++) { const x = ((i * 131 + t * 15) % (W + 40)) - 20, y = H * (0.44 + (i % 5) * 0.035); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 10, y - 3, x + 20, y); c.stroke(); } }
  if (name === 'mirror') { mirrorDisc(c, W * 0.5, H * 0.34, Math.min(W * 0.2, H * 0.24), t, false); E(c, W * 0.5, H * 0.34, Math.min(W * 0.2, H * 0.24) * (1.3 + Math.sin(t * 2) * 0.05), Math.min(W * 0.2, H * 0.24) * (1.3 + Math.sin(t * 2) * 0.05)); F(c, null, 'rgba(200,210,255,0.25)', 3); }
};
/* ---------- 手持道具 / 头饰 ---------- */
const prevProp = A.PROP_EXT;
A.PROP_EXT = function (c, prop, t) {
  if (prevProp) prevProp(c, prop, t);
  switch (prop) {
    case 'cabbage': cabbage(c, 0, -6, 20); break;
    case 'radish': E(c, 0, 8, 28, 8); F(c, '#fff', '#4a8fd0', 2); radishCake(c, 0, 4, 16); break;
    case 'pill': rr(c, -18, -10, 36, 22, 6); F(c, '#8a2a2a', OL, 2); pill(c, 0, -14, 9, t); break;
    case 'medpot': pot(c, 0, -4, 16, '#8a5a3a', t, true); break;
    case 'ledger': ledger(c, 0, -6, 18); break;
    case 'mirrorHalf': mirrorDisc(c, 0, -10, 18, t, true); break;
  }
};
const prevOrn = A.ORN_EXT;
A.ORN_EXT = function (c, orn, t, sp) {
  if (prevOrn) prevOrn(c, orn, t, sp);
  if (orn.includes('beard')) { const sw = Math.sin(t * 1.6) * 2; c.beginPath(); c.moveTo(-24, -164); c.quadraticCurveTo(-30, -130, sw - 4, -96); c.quadraticCurveTo(sw, -104, sw + 4, -96); c.quadraticCurveTo(30, -130, 24, -164); c.quadraticCurveTo(0, -150, -24, -164); F(c, '#f4f4f8', '#a8a8b8', 1.6);
    c.strokeStyle = '#c8c8d4'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 7, -150); c.quadraticCurveTo(i * 5 + sw, -126, i * 2 + sw, -104); c.stroke(); }
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 6, -174); c.quadraticCurveTo(s * 22, -176, s * 30, -164 + Math.sin(t * 2) * 1.5); c.lineWidth = 3; c.strokeStyle = '#f4f4f8'; c.stroke(); }); }
  if (orn.includes('daoCrown')) { c.save(); c.translate(0, -300); rr(c, -12, -6, 24, 14, 4); F(c, '#e8d8a8', '#8a6a2a', 2); c.strokeStyle = '#8a6a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-22, 0); c.lineTo(22, 0); c.stroke(); E(c, 0, -2, 3, 3); F(c, '#4aa0e0'); c.restore(); }
  if (orn.includes('robeStars')) { [[-26, -116], [24, -98], [-14, -70], [20, -52]].forEach(([x, y], i) => star(c, x, y, 3.5 + (i % 2), '#f2c24d')); }
  if (orn.includes('apron')) { c.save(); rr(c, -24, -110, 48, 56, 6); F(c, 'rgba(240,232,214,0.95)', '#8a7a6a', 1.5); rr(c, 4, -96, 14, 12, 3); F(c, null, '#8a7a6a', 1.2); c.restore(); }
};

/* ---------- 第四章死法场景 ---------- */
const T = (c, s, str, x, y, cx, by, size, col) => txt(c, str, cx + x * s, by + y * s, size * s, col);
const D = A.DPROPS = A.DPROPS || {};
const dim = (c, cx, by, s, a) => { c.fillStyle = 'rgba(16,20,50,' + (a || 0.5) + ')'; c.fillRect(cx - 230 * s, by - 430 * s, 460 * s, 430 * s); };
const who = (c, id, x, cx, by, s, t, face, k) => A.drawChar(c, id, cx + x * s, by, s * (k || 0.5), { t, face, still: true });
D.ghost = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.45), front: (c, cx, by, s, t) => { c.globalAlpha = 0.9; c.beginPath(); c.moveTo(cx - 90 * s, by - 120 * s); c.quadraticCurveTo(cx - 100 * s, by - 380 * s, cx, by - 390 * s); c.quadraticCurveTo(cx + 100 * s, by - 380 * s, cx + 90 * s, by - 120 * s); for (let i = 0; i < 6; i++) c.lineTo(cx + (90 - i * 36) * s, by - (120 + (i % 2 ? 0 : 18)) * s); c.closePath(); F(c, '#fbfbff', '#b8bcd0', 2); c.globalAlpha = 1; who(c, 'guard', 150, cx, by, s, t, 'shock', 0.5); lantern(c, cx + 100 * s, by - 200 * s, s, t, true); T(c, s, '冷宫白衣', -140, -330, cx, by, 22, '#fff'); T(c, s, '有鬼啊——', 150, -270, cx, by, 18, '#ffd36b'); } };
D.radish = { front: (c, cx, by, s, t) => { E(c, cx + 120 * s, by - 40 * s, 46 * s, 12 * s); F(c, '#fff', '#4a8fd0', 2); radishCake(c, cx + 120 * s, by - 52 * s, 28 * s); who(c, 'jingtaifei', -150, cx, by, s, t, 'smirk'); T(c, s, '又一个永和宫的', -140, -230, cx, by, 16, '#5a5070'); T(c, s, '乌头 一钱', 130, -110, cx, by, 16, '#8a2a2a'); } };
D.pill = { front: (c, cx, by, s, t) => { pill(c, cx + 130 * s, by - 120 * s, 26 * s, t); T(c, s, 'Hg Pb HgS', 130, -170, cx, by, 16, '#8a5f10'); T(c, s, '永远十八岁', -140, -330, cx, by, 22, '#c99a3a'); who(c, 'xuanjizi', -160, cx, by, s, t, 'smile', 0.45); } };
D.stairs = { back: (c, cx, by, s, t) => { dim(c, cx, by, s, 0.6); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#4a4a5e' : '#5a5a6e'; c.fillRect(cx + (-230 + i * 50) * s, by - (i * 46) * s - 40 * s, 120 * s, 46 * s); } for (let i = 0; i < 10; i++) star(c, cx + ((i * 97) % 440 - 220) * s, by - (300 + (i * 37) % 120) * s, 5 * s, '#fffbe0'); },
  front: (c, cx, by, s, t) => { star(c, cx + 150 * s - ((t * 80) % 200) * s, by - 360 * s + ((t * 60) % 150) * s, 10 * s, '#ffd36b'); T(c, s, '坠于西阶', 130, -100, cx, by, 20, '#ffd36b'); T(c, s, '第 299 级', -140, -330, cx, by, 18, '#fff'); } };
D.mirror = { back: (c, cx, by, s, t) => { dim(c, cx, by, s, 0.55); mirrorDisc(c, cx, by - 240 * s, 150 * s, t, false); A.drawChar(c, 'yuanzhu', cx, by - 140 * s, s * 0.42, { t, face: 'smile', still: true, alpha: 0.85 }); },
  front: (c, cx, by, s, t) => { T(c, s, '换你在里面', 150, -100, cx, by, 18, '#dfe8ff'); T(c, s, '👋', -150, -330, cx, by, 26, '#fff'); } };
D.teacup = { front: (c, cx, by, s, t) => { who(c, 'taihou', 150, cx, by, s, t, 'smile'); E(c, cx - 130 * s, by - 60 * s, 30 * s, 9 * s); F(c, '#fff', '#3f8f5a', 2); c.beginPath(); c.moveTo(cx - 154 * s, by - 60 * s); c.quadraticCurveTo(cx - 150 * s, by - 20 * s, cx - 130 * s, by - 20 * s); c.quadraticCurveTo(cx - 110 * s, by - 20 * s, cx - 106 * s, by - 60 * s); F(c, '#fff', '#3f8f5a', 2); for (let i = 0; i < 2; i++) { c.strokeStyle = 'rgba(160,200,160,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - (136 - i * 12) * s, by - 70 * s); c.quadraticCurveTo(cx - (130 - i * 12 + Math.sin(t * 2 + i) * 6) * s, by - 100 * s, cx - (136 - i * 12) * s, by - 130 * s); c.stroke(); } T(c, s, '明前龙井', -130, -160, cx, by, 16, '#3f7a42'); T(c, s, '“乖，喝茶。”', -140, -330, cx, by, 20, '#8e6128'); } };
D.tiger = { front: (c, cx, by, s, t) => { who(c, 'taihou', 150, cx, by, s, t, 'shock'); rr(c, cx - 220 * s, by - 380 * s, 190 * s, 110 * s, 10 * s); F(c, '#fff', OL, 2); T(c, s, '天王盖地虎', -125, -350, cx, by, 18, '#8e6128'); T(c, s, '小鸡炖蘑菇！', -125, -300, cx, by, 18, '#c0392b'); T(c, s, '❌', 60, -300, cx, by, 30, '#c0392b'); } };
D.pit = { back: (c, cx, by, s) => { E(c, cx, by - 30 * s, 200 * s, 50 * s); F(c, '#3a2a1e', OL, 3); for (let i = 0; i < 14; i++) { c.strokeStyle = '#e2c46a'; c.lineWidth = 2 * s; c.beginPath(); c.moveTo(cx + (-160 + i * 24) * s, by - 30 * s); c.lineTo(cx + (-150 + i * 24) * s, by - 50 * s); c.stroke(); } },
  front: (c, cx, by, s, t) => { T(c, s, '大家都知道', -140, -330, cx, by, 20, '#5a6a8a'); T(c, s, '只有你不知道', 130, -290, cx, by, 18, '#c0392b'); rr(c, cx + 100 * s, by - 180 * s, 90 * s, 36 * s, 4); F(c, '#fff6e0', OL, 1.5); T(c, s, '晨报·特供', 145, -162, cx, by, 13, '#8a2a2a'); } };
D.stone = { back: (c, cx, by, s, t) => { dim(c, cx, by, s, 0.5); c.fillStyle = 'rgba(80,140,190,0.6)'; c.fillRect(cx - 230 * s, by - 90 * s, 460 * s, 90 * s); },
  front: (c, cx, by, s, t) => { E(c, cx + 140 * s, by - 100 * s, 50 * s, 30 * s); F(c, '#8a8a92', OL, 2.5); lantern(c, cx - 160 * s - (t * 10 % 40) * s, by - 260 * s, s * 0.8, t, true); T(c, s, '“刚好”松了', 130, -160, cx, by, 18, '#fff'); T(c, s, '扑通', -120, -100, cx, by, 24, '#bfe3ff'); } };
D.herbpot = { front: (c, cx, by, s, t) => { pot(c, cx + 130 * s, by - 70 * s, 40 * s, '#8a5a3a', t, true); c.save(); c.translate(cx + 60 * s, by - 160 * s); c.rotate(0.6); rr(c, -6 * s, -40 * s, 12 * s, 60 * s, 4); F(c, '#f3d6c4', OL, 1.5); c.restore(); T(c, s, '甘草→醉心花', 130, -170, cx, by, 15, '#8a2a2a'); T(c, s, '巨苦回更苦', -140, -330, cx, by, 20, '#5a3a2a'); } };
D.scrolls = { front: (c, cx, by, s, t) => { who(c, 'emperor', 150, cx, by, s, t, 'angry'); for (let i = 0; i < 4; i++) { rr(c, cx + (-200 + i * 22) * s, by - (40 + i * 26) * s, 110 * s, 22 * s, 6); F(c, '#fff6e0', '#a8742a', 1.5); } T(c, s, '证据呢？', 150, -260, cx, by, 20, '#c0392b'); T(c, s, '诬告·罪加一等', -140, -330, cx, by, 16, '#8a2a2a'); } };
D.candle = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.7), front: (c, cx, by, s, t) => { for (let i = 0; i < 9; i++) { const x = cx + (-200 + i * 50) * s; rr(c, x - 5 * s, by - 80 * s, 10 * s, 50 * s, 2); F(c, '#fff6e0', OL, 1); E(c, x, by - 88 * s, 4 * s, (8 + Math.sin(t * 9 + i) * 2) * s); F(c, '#ffc85a'); } T(c, s, '“皇上怕黑！”', -140, -330, cx, by, 20, '#ffd36b'); T(c, s, '（全场安静）', 130, -280, cx, by, 16, '#dfe8ff'); } };
D.beaker = { front: (c, cx, by, s, t) => { c.beginPath(); c.moveTo(cx + 110 * s, by - 160 * s); c.lineTo(cx + 110 * s, by - 110 * s); c.lineTo(cx + 80 * s, by - 40 * s); c.lineTo(cx + 180 * s, by - 40 * s); c.lineTo(cx + 150 * s, by - 110 * s); c.lineTo(cx + 150 * s, by - 160 * s); F(c, 'rgba(220,240,255,0.7)', OL, 2.5); c.fillStyle = '#7ad07a'; c.beginPath(); c.moveTo(cx + 96 * s, by - 76 * s); c.lineTo(cx + 84 * s, by - 44 * s); c.lineTo(cx + 176 * s, by - 44 * s); c.lineTo(cx + 164 * s, by - 76 * s); c.fill(); for (let i = 0; i < 4; i++) { const k = (t * 0.7 + i / 4) % 1; E(c, cx + (120 + i * 8) * s, by - (70 + k * 120) * s, 5 * s, 5 * s); F(c, 'rgba(140,220,140,' + (1 - k) + ')'); } T(c, s, '妖术！', -140, -330, cx, by, 28, '#c0392b'); T(c, s, 'Hg²⁺', 130, -200, cx, by, 18, '#3a6db5'); } };
D.wall = { back: (c, cx, by, s) => { c.fillStyle = '#b83b3b'; c.fillRect(cx - 230 * s, by - 300 * s, 460 * s, 240 * s); roofTiles(c, cx - 240 * s, by - 340 * s, 480 * s, 50 * s, '#f7cf5a', '#d99a1e'); },
  front: (c, cx, by, s, t) => { for (let i = 0; i < 12; i++) { E(c, cx + (60 + (i * 37) % 140) * s, by - (20 + (i * 23) % 50) * s, 6 * s, 4 * s); F(c, '#e8c88a', '#8a6a3a', 1); } who(c, 'guard', 150, cx, by, s, t, 'shock', 0.42); T(c, s, '御前侍卫值房', -140, -330, cx, by, 18, '#fff'); T(c, s, '我的花生米！', 150, -230, cx, by, 16, '#c0392b'); } };
D.spear = { back: (c, cx, by, s) => dim(c, cx, by, s, 0.55), front: (c, cx, by, s, t) => { who(c, 'luzheng', 150, cx, by, s, t, 'normal'); lantern(c, cx + 80 * s, by - 210 * s, s, t, true); T(c, s, '职责所在。', 150, -270, cx, by, 18, '#dfe8ff'); T(c, s, '请你喝奶茶！', -140, -330, cx, by, 18, '#ffd36b'); T(c, s, '不喝甜的。', 150, -240, cx, by, 14, '#9ab0d0'); } };
D.herbs = { front: (c, cx, by, s, t) => { const cols = ['#c8a26a', '#8a6a3a', '#d8b878', '#6a8a4a', '#b87a4a']; for (let i = 0; i < 60; i++) { const x = cx + ((i * 53) % 400 - 200) * s, y = by - ((i * 29) % 160) * s * (1 - Math.abs((i * 53) % 400 - 200) / 260); E(c, x, y, 12 * s, 6 * s); F(c, cols[i % 5], 'rgba(0,0,0,0.3)', 1); } rr(c, cx + 80 * s, by - 330 * s, 120 * s, 80 * s, 3); F(c, '#b8804a', '#5a3418', 2); T(c, s, '当归', 140, -290, cx, by, 16, '#3a2010'); T(c, s, '三百斤', -140, -330, cx, by, 22, '#8a5a2a'); } };
D.dessert = { front: (c, cx, by, s, t) => { rr(c, cx - 210 * s, by - 60 * s, 420 * s, 40 * s, 6); F(c, '#8a4a2a', OL, 2.5); for (let i = 0; i < 4; i++) dessert(c, cx + (-150 + i * 100) * s, by - 74 * s, 22 * s, i); who(c, 'ningpin', 150, cx, by - 40 * s, s, t, 'smile', 0.42); T(c, s, '妹妹多吃些~', -140, -330, cx, by, 18, '#3f7a62'); T(c, s, '后劲很大', -140, -290, cx, by, 15, '#8a2a2a'); } };
D.tears = { front: (c, cx, by, s, t) => { who(c, 'ningpin', 150, cx, by, s, t, 'cry'); for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; E(c, cx + (138 + i * 8) * s, by - (200 - k * 60) * s, 4 * s, 6 * s); F(c, 'rgba(120,180,255,' + (1 - k) + ')'); } T(c, s, '妹妹为何害我？', 150, -280, cx, by, 15, '#3f7a62'); T(c, s, '影后', -140, -330, cx, by, 26, '#c99a3a'); for (let i = 0; i < 3; i++) star(c, cx + (-180 + i * 40) * s, by - 360 * s, 8 * s, '#ffd36b'); } };
})(window.PALACE = window.PALACE || {});
