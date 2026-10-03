/* 第三章 新角色、新场景、新道具、新死法场景 */
(function (P) {
const A = P.ART, { E, F, L, rr, lg, rg, shade, flower, star, sparkle, heart, OL, TAU } = A.util;
const BG = A.BG;
const { roofTiles, lantern, cloud, tree, palaceWall, floorTiles, txt, plaque, xiangyun } = A;
Object.assign(A.CH, {
  ayun: { name: '阿芸', skin: '#fbe0cc', hair: '#3a2a22', eye: '#5a3a2a', back: 'short', bangs: 'full', buns: 'side2', ribbon: '#7aa6d8', freckle: true,
    outer: '#a9c4e0', inner: '#ffffff', skirt: '#d6e4f2', skirt2: '#9ab6d6', trim: '#4f74a8', sash: '#6a8ab8', pattern: 'none', orn: [] },
  momo: { name: '刘嬷嬷', skin: '#f1d6c4', hair: '#4a4040', eye: '#3a2a2a', back: 'none', bangs: 'slick', buns: 'tight', old: true, eyesDefault: 'stern', mole: true,
    outer: '#4a4a5a', inner: '#e8e0d4', skirt: '#5a5a6a', skirt2: '#3a3a48', trim: '#8a8a9a', sash: '#2a2a36', pattern: 'lines', pose: 'ruler', prop: 'ruler', orn: ['headband'] },
});
function boat(c, x, y, s, col, t) { // 龙舟
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-120, 0); c.quadraticCurveTo(0, 26, 120, 0); c.lineTo(110, -10); c.lineTo(-110, -10); c.closePath(); F(c, col, OL, 3);
  c.fillStyle = '#f2c24d'; for (let i = 0; i < 9; i++) { E(c, -96 + i * 24, 2, 5, 4); c.fill(); }
  // 龙头
  c.beginPath(); c.moveTo(110, -10); c.quadraticCurveTo(140, -30, 132, -54); c.quadraticCurveTo(150, -52, 158, -40); c.quadraticCurveTo(150, -30, 140, -30); c.quadraticCurveTo(142, -14, 120, 0); c.closePath(); F(c, col, OL, 3);
  E(c, 142, -46, 3, 3); F(c, '#fff', OL, 1); c.strokeStyle = '#f2c24d'; c.lineWidth = 3; c.beginPath(); c.moveTo(134, -54); c.lineTo(128, -70); c.stroke();
  // 桨手
  for (let i = 0; i < 6; i++) { const px = -80 + i * 30, a = Math.sin(t * 8 + i * 0.3) * 0.5; E(c, px, -18, 7, 7); F(c, '#ffe0c8', OL, 1.5); c.save(); c.translate(px, -12); c.rotate(0.6 + a); c.strokeStyle = '#8a5a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 30); c.stroke(); c.restore(); }
  c.restore();
}
A.boat = boat;
BG.taiye = function (c, W, H) { // 太液池·龙舟宴
  c.fillStyle = lg(c, 0, 0, 0, H * 0.5, [[0, '#8fd0f5'], [1, '#dff2fb']]); c.fillRect(0, 0, W, H * 0.5);
  cloud(c, W * 0.2, H * 0.1, H / 700, '#fff'); cloud(c, W * 0.75, H * 0.16, H / 900, '#fff');
  // 远处亭台 + 柳树
  c.fillStyle = '#9ec8a8'; c.beginPath(); c.moveTo(0, H * 0.42); for (let i = 0; i <= 10; i++) c.quadraticCurveTo(W * (i + 0.5) / 10, H * (0.34 + (i % 2) * 0.03), W * (i + 1) / 10, H * 0.42); c.lineTo(W, H * 0.46); c.lineTo(0, H * 0.46); c.fill();
  const px = W * 0.62; roofTiles(c, px - W * 0.08, H * 0.28, W * 0.16, H * 0.05, '#f7cf5a', '#d99a1e'); c.fillStyle = '#b83b3b'; c.fillRect(px - W * 0.06, H * 0.33, 5, H * 0.1); c.fillRect(px + W * 0.06 - 5, H * 0.33, 5, H * 0.1);
  // 水面
  c.fillStyle = lg(c, 0, H * 0.45, 0, H, [[0, '#7cc4d8'], [1, '#3f8fb0']]); c.fillRect(0, H * 0.45, W, H * 0.55);
  // 前景：栏杆 + 看台
  c.fillStyle = '#c0392b'; c.fillRect(0, H * 0.84, W, H * 0.02); for (let x = 0; x < W; x += W / 16) { rr(c, x, H * 0.8, 6, H * 0.08, 2); F(c, '#c0392b', OL, 1.5); }
  c.fillStyle = '#d8c6a6'; c.fillRect(0, H * 0.86, W, H * 0.14); c.fillStyle = 'rgba(0,0,0,0.08)'; for (let x = 0; x < W; x += 60) c.fillRect(x, H * 0.86, 2, H * 0.14);
};
BG.shouyan = function (c, W, H) { // 慈宁宫寿宴
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#7a1f2a'], [1, '#b8323a']]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,210,120,0.12)'; for (let i = 0; i < 6; i++) c.fillRect(W * (0.05 + i * 0.18), H * 0.08, W * 0.04, H * 0.56);
  plaque(c, '福寿康宁', W * 0.5, H * 0.14, Math.min(W * 0.34, H * 0.36), H * 0.06);
  const r = Math.min(W * 0.11, H * 0.13); E(c, W * 0.5, H * 0.36, r, r); F(c, '#f2c24d', '#7a5210', 4); E(c, W * 0.5, H * 0.36, r * 0.86, r * 0.86); F(c, null, '#c0392b', 2); txt(c, '寿', W * 0.5, H * 0.37, r * 1.2, '#c0392b');
  for (let i = 0; i < 4; i++) xiangyun(c, W * (0.18 + (i % 2) * 0.64), H * (0.26 + (i > 1 ? 0.12 : 0)), H / 500, '#f2c24d');
  floorTiles(c, H * 0.62, W, H, '#e9d2a6', '#c9ae80');
  c.fillStyle = '#c0392b'; c.beginPath(); c.moveTo(W * 0.4, H * 0.62); c.lineTo(W * 0.6, H * 0.62); c.lineTo(W * 0.72, H); c.lineTo(W * 0.28, H); c.fill();
  c.fillStyle = '#f2c24d'; c.fillRect(W * 0.4, H * 0.62, W * 0.2, H * 0.008);
  // 两侧席位
  [0.04, 0.76].forEach(k => { rr(c, W * k, H * 0.68, W * 0.2, H * 0.05, 4); F(c, '#8a4a2a', OL, 2); for (let i = 0; i < 3; i++) { E(c, W * (k + 0.04 + i * 0.06), H * 0.675, W * 0.02, H * 0.01); F(c, '#fff', OL, 1); } });
};
BG.fotang = function (c, W, H) { // 慈宁宫小佛堂
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#3a2418'], [1, '#6a4028']]); c.fillRect(0, 0, W, H);
  const r = Math.min(W * 0.16, H * 0.22);
  E(c, W * 0.5, H * 0.34, r * 1.6, r * 1.6); F(c, rg(c, W * 0.5, H * 0.34, r * 0.4, r * 1.6, [[0, 'rgba(255,220,140,0.55)'], [1, 'rgba(255,220,140,0)']]));
  E(c, W * 0.5, H * 0.3, r, r); F(c, null, '#e8b84a', 4);
  // 佛像（坐姿剪影）+ 莲台
  const bx = W * 0.5, hy = H * 0.24, hr = r * 0.17;
  c.beginPath(); c.moveTo(bx - hr * 0.7, hy + hr * 0.9); c.quadraticCurveTo(bx - r * 0.5, hy + hr * 1.3, bx - r * 0.55, hy + r * 0.75); c.quadraticCurveTo(bx - r * 0.75, hy + r * 1.05, bx - r * 0.7, H * 0.5); c.lineTo(bx + r * 0.7, H * 0.5); c.quadraticCurveTo(bx + r * 0.75, hy + r * 1.05, bx + r * 0.55, hy + r * 0.75); c.quadraticCurveTo(bx + r * 0.5, hy + hr * 1.3, bx + hr * 0.7, hy + hr * 0.9); c.closePath();
  F(c, lg(c, 0, hy, 0, H * 0.5, [[0, '#f0c860'], [1, '#b8862a']]), '#7a5210', 2);
  c.strokeStyle = 'rgba(122,82,16,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - r * 0.25, hy + r * 0.85); c.quadraticCurveTo(bx, hy + r * 1.05, bx + r * 0.25, hy + r * 0.85); c.stroke(); // 手印
  c.beginPath(); c.moveTo(bx - r * 0.6, H * 0.47); c.quadraticCurveTo(bx, H * 0.44, bx + r * 0.6, H * 0.47); c.stroke(); // 盘腿
  E(c, bx, hy, hr, hr * 1.1); F(c, '#f0c860', '#7a5210', 2); E(c, bx, hy - hr * 1.05, hr * 0.42, hr * 0.38); F(c, '#d9a640', '#7a5210', 1.5);
  E(c, bx - hr * 1.0, hy + hr * 0.2, hr * 0.22, hr * 0.5); F(c, '#e8b850', '#7a5210', 1.2); E(c, bx + hr * 1.0, hy + hr * 0.2, hr * 0.22, hr * 0.5); F(c, '#e8b850', '#7a5210', 1.2);
  c.strokeStyle = '#7a5210'; c.lineWidth = 1.5; c.beginPath(); c.arc(bx - hr * 0.38, hy + hr * 0.05, hr * 0.2, 0.2, Math.PI - 0.2); c.moveTo(bx + hr * 0.58, hy + hr * 0.05); c.arc(bx + hr * 0.38, hy + hr * 0.05, hr * 0.2, 0.2, Math.PI - 0.2); c.stroke();
  E(c, bx, hy - hr * 0.35, hr * 0.06, hr * 0.06); F(c, '#c0392b');
  for (let i = 0; i < 9; i++) { c.save(); c.translate(bx + (i - 4) * r * 0.17, H * 0.515); E(c, 0, 0, r * 0.11, r * 0.06); F(c, '#f3a6b8', '#a8506a', 1.5); c.restore(); }
  c.fillStyle = '#8a1f2b'; c.fillRect(0, H * 0.04, W, H * 0.03); for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? '#f2c24d' : '#c0392b'; c.fillRect(W * i / 10, H * 0.07, W / 10, H * 0.08); }
  rr(c, W * 0.25, H * 0.58, W * 0.5, H * 0.06, 4); F(c, '#8a4a2a', OL, 2.5); // 供桌
  rr(c, W * 0.45, H * 0.52, W * 0.1, H * 0.06, 6); F(c, '#c99a3a', OL, 2); // 香炉
  floorTiles(c, H * 0.64, W, H, '#7a5a3a', '#5a3e28');
};
BG.taiyiyuan = function (c, W, H) { // 太医院·药柜
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#efe6d2'], [1, '#d9c9a8']]); c.fillRect(0, 0, W, H);
  plaque(c, '太医院', W * 0.5, H * 0.135, Math.min(W * 0.22, H * 0.24), H * 0.05);
  const x0 = W * 0.05, y0 = H * 0.19, cw = W * 0.9, ch = H * 0.43, cols = 12, rows = 6;
  rr(c, x0 - 6, y0 - 6, cw + 12, ch + 12, 4); F(c, '#7a4a2a', OL, 3);
  const names = ['当归', '黄芪', '甘草', '川芎', '白术', '茯苓', '人参', '枸杞', '红花', '杏仁', '半夏', '陈皮'];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const x = x0 + i * cw / cols, y = y0 + j * ch / rows; rr(c, x + 2, y + 2, cw / cols - 4, ch / rows - 4, 2); F(c, '#b8804a', '#5a3418', 1.5); E(c, x + cw / cols / 2, y + ch / rows * 0.72, 3, 3); F(c, '#f2c24d'); if ((i + j) % 3 === 0) txt(c, names[(i * 7 + j) % 12], x + cw / cols / 2, y + ch / rows * 0.36, Math.min(cw / cols, ch / rows) * 0.26, '#3a2010'); }
  c.fillStyle = '#9a6a3a'; c.fillRect(0, H * 0.64, W, H * 0.36);
  rr(c, W * 0.3, H * 0.7, W * 0.4, H * 0.05, 4); F(c, '#7a4a2a', OL, 2);
  for (let i = 0; i < 4; i++) { E(c, W * (0.36 + i * 0.09), H * 0.695, W * 0.018, H * 0.012); F(c, ['#fff', '#e8d8b8', '#fff', '#d8e8d8'][i], OL, 1); }
};
BG.laundry = function (c, W, H) { // 浣衣局
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#c4d4e0'], [1, '#e2e8ec']]); c.fillRect(0, 0, W, H);
  palaceWall(c, H * 0.18, H * 0.42, W);
  c.strokeStyle = '#6a5040'; c.lineWidth = 2; [0.16, 0.26].forEach((k, j) => { c.beginPath(); c.moveTo(0, H * k); c.quadraticCurveTo(W * 0.5, H * (k + 0.05), W, H * k); c.stroke();
    for (let i = 0; i < 7; i++) { const x = W * (0.06 + i * 0.14) + j * W * 0.06, y = H * (k + 0.02 + Math.sin(i / 7 * Math.PI) * 0.035); rr(c, x, y, W * 0.07, H * 0.1, 3); F(c, ['#f3b6c8', '#bfe3cf', '#fff6dc', '#a9c4e0', '#e9cf7a', '#fff'][(i + j) % 6], OL, 1.5); } });
  c.fillStyle = '#b8a890'; c.fillRect(0, H * 0.58, W, H * 0.42); c.fillStyle = 'rgba(0,0,0,0.06)'; for (let x = 0; x < W; x += 50) c.fillRect(x, H * 0.58, 2, H * 0.42);
  [[0.12, 0.74], [0.82, 0.72], [0.6, 0.86]].forEach(([kx, ky]) => { E(c, W * kx, H * ky, W * 0.08, H * 0.03); F(c, '#8fc0d8', '#5a3e28', 3); c.beginPath(); c.moveTo(W * (kx - 0.08), H * ky); c.lineTo(W * (kx - 0.07), H * (ky + 0.07)); c.lineTo(W * (kx + 0.07), H * (ky + 0.07)); c.lineTo(W * (kx + 0.08), H * ky); F(c, '#a8743a', OL, 2.5); for (let i = 0; i < 3; i++) { E(c, W * (kx - 0.03 + i * 0.03), H * (ky - 0.012), 6, 5); F(c, 'rgba(255,255,255,0.85)'); } });
};
BG.shenxing = function (c, W, H) { // 慎刑司
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#2a2a34'], [1, '#4a4a56']]); c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 2; for (let y = 0; y < H * 0.62; y += H * 0.06) for (let x = ((y / (H * 0.06)) % 2) * 40; x < W; x += 80) c.strokeRect(x, y, 80, H * 0.06);
  plaque(c, '慎刑司', W * 0.5, H * 0.135, Math.min(W * 0.22, H * 0.24), H * 0.05);
  const wx = W * 0.75, wy = H * 0.18, ww = W * 0.14, wh = H * 0.16; rr(c, wx, wy, ww, wh, 2); F(c, '#9ab0d0', OL, 3); c.fillStyle = '#222'; for (let i = 1; i < 5; i++) c.fillRect(wx + i * ww / 5 - 2, wy, 4, wh);
  c.fillStyle = '#3a3640'; c.fillRect(0, H * 0.62, W, H * 0.38);
  rr(c, W * 0.32, H * 0.64, W * 0.36, H * 0.05, 3); F(c, '#5a3e28', OL, 2.5);
  rr(c, W * 0.47, H * 0.58, W * 0.06, H * 0.06, 3); F(c, '#c99a3a', OL, 2);
};
BG.storm = function (c, W, H) { // 雷雨夜
  BG.courtyard(c, W, H); c.fillStyle = 'rgba(20,24,50,0.68)'; c.fillRect(0, 0, W, H);
};
BG.garden_night = function (c, W, H) { // 御花园·夜
  BG.garden(c, W, H); c.fillStyle = 'rgba(16,22,60,0.62)'; c.fillRect(0, 0, W, H);
  const r = Math.min(W, H) * 0.07; E(c, W * 0.14, H * 0.12, r, r); F(c, '#fff6d0');
};
BG.coldroom = function (c, W, H) { // 小黑屋
  c.fillStyle = '#1e1c22'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(200,210,255,0.12)'; c.beginPath(); c.moveTo(W * 0.6, 0); c.lineTo(W * 0.7, 0); c.lineTo(W * 0.85, H); c.lineTo(W * 0.5, H); c.fill();
};
const prevAnim = A.ANIM_EXT;
A.ANIM_EXT = function (c, name, W, H, t) {
  if (prevAnim) prevAnim(c, name, W, H, t);
  if (name === 'taiye') {
    c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 2; for (let i = 0; i < 18; i++) { const x = ((i * 113 + t * 20) % (W + 60)) - 30, y = H * (0.5 + (i % 6) * 0.055); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 12, y - 4, x + 24, y); c.stroke(); }
    const k = (t * 0.05) % 1; boat(c, -W * 0.3 + k * W * 1.6, H * 0.6, H / 900, '#d9343f', t); boat(c, -W * 0.5 + ((k + 0.35) % 1) * W * 1.6, H * 0.7, H / 760, '#3f8f5a', t);
    lantern(c, W * 0.08, H * 0.6, H / 750, t, false); lantern(c, W * 0.92, H * 0.6, H / 750, t, false);
  }
  if (name === 'shouyan') { lantern(c, W * 0.12, H * 0.2, H / 600, t, true); lantern(c, W * 0.88, H * 0.2, H / 600, t, true); lantern(c, W * 0.3, H * 0.14, H / 800, t, true); lantern(c, W * 0.7, H * 0.14, H / 800, t, true); }
  if (name === 'fotang') { for (let i = 0; i < 3; i++) { const k = (t * 0.25 + i / 3) % 1; c.globalAlpha = 0.5 * (1 - k); c.strokeStyle = '#eee'; c.lineWidth = 2; c.beginPath(); c.moveTo(W * 0.5, H * 0.52); c.quadraticCurveTo(W * 0.5 + Math.sin(t + i) * 20, H * (0.52 - k * 0.2), W * 0.5 + Math.sin(t * 1.3 + i) * 30, H * (0.52 - k * 0.4)); c.stroke(); } c.globalAlpha = 1; }
  if (name === 'shenxing' || name === 'coldroom') { E(c, W * 0.5, H * 0.56, 6 + Math.sin(t * 9) * 1.5, 10 + Math.sin(t * 7) * 2); F(c, 'rgba(255,200,90,0.9)'); E(c, W * 0.5, H * 0.56, 60, 60); F(c, 'rgba(255,200,90,0.06)'); }
  if (name === 'storm') {
    c.strokeStyle = 'rgba(200,220,255,0.6)'; c.lineWidth = 1.5; for (let i = 0; i < 110; i++) { const x = (i * 53.7 + t * 160) % W, y = (i * 97.1 + t * 1000) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 18); c.stroke(); }
    const ph = t % 5; if (ph < 0.18) { c.fillStyle = 'rgba(255,255,255,' + (0.5 - ph * 2) + ')'; c.fillRect(0, 0, W, H); c.strokeStyle = '#fffbe0'; c.lineWidth = 3; c.beginPath(); c.moveTo(W * 0.7, 0); c.lineTo(W * 0.66, H * 0.12); c.lineTo(W * 0.72, H * 0.16); c.lineTo(W * 0.64, H * 0.34); c.stroke(); }
  }
  if (name === 'garden_night') { lantern(c, W * 0.85, H * 0.4 + Math.sin(t) * 6, H / 700, t, true); }
  if (name === 'laundry') { for (let i = 0; i < 8; i++) { const k = (t * 0.3 + i / 8) % 1; c.globalAlpha = 0.6 * (1 - k); E(c, W * (0.12 + (i % 3) * 0.24), H * (0.72 - k * 0.15), 5 + k * 4, 5 + k * 4); F(c, '#fff', 'rgba(140,180,220,0.8)', 1); } c.globalAlpha = 1; }
};
/* ---------- 手持道具 ---------- */
function zongzi(c, x, y, r, tint) { c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r * 0.9, y + r * 0.6); c.lineTo(x - r * 0.9, y + r * 0.6); c.closePath(); F(c, tint || '#6fae5a', OL, 2); c.strokeStyle = '#d8b878'; c.lineWidth = Math.max(1.5, r * 0.12); c.beginPath(); c.moveTo(x - r * 0.6, y + r * 0.1); c.lineTo(x + r * 0.6, y + r * 0.1); c.stroke(); c.strokeStyle = 'rgba(40,80,30,0.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - r); c.lineTo(x - r * 0.2, y + r * 0.6); c.stroke(); }
function doll(c, x, y, r) { E(c, x, y - r * 0.9, r * 0.5, r * 0.5); F(c, '#f3e6c8', OL, 2); c.beginPath(); c.moveTo(x - r * 0.4, y - r * 0.5); c.lineTo(x - r * 0.9, y + r * 0.9); c.lineTo(x + r * 0.9, y + r * 0.9); c.lineTo(x + r * 0.4, y - r * 0.5); c.closePath(); F(c, '#bfe3cf', OL, 2); for (let i = 0; i < 3; i++) xiangyun(c, x + (i - 1) * r * 0.4, y + r * 0.3, r / 60, '#7fbfa8');
  c.strokeStyle = '#cfd6e0'; c.lineWidth = 2; [[-0.3, -1.1], [0.2, -0.2], [0.5, 0.4]].forEach(([a, b]) => { c.beginPath(); c.moveTo(x + a * r, y + b * r); c.lineTo(x + a * r + r * 0.5, y + b * r - r * 0.5); c.stroke(); }); c.fillStyle = '#c0392b'; c.font = `bold ${r * 0.4}px serif`; c.textAlign = 'center'; c.fillText('X', x, y - r * 0.8); }
A.zongzi = zongzi; A.doll = doll;
const prevProp = A.PROP_EXT;
A.PROP_EXT = function (c, prop, t) {
  if (prevProp) prevProp(c, prop, t);
  switch (prop) {
    case 'zongzi': E(c, 0, 8, 28, 8); F(c, '#fff', '#4a8fd0', 2); zongzi(c, -10, -6, 14); zongzi(c, 12, -4, 12); break;
    case 'cards': for (let i = 0; i < 4; i++) { c.save(); c.rotate((i - 1.5) * 0.25); rr(c, -9, -34, 18, 34, 3); F(c, '#fffaf0', '#8a1f2b', 2); E(c, 0, -22, 4, 4); F(c, i % 2 ? '#c0392b' : '#2a3a6a'); c.restore(); } break;
    case 'doll': doll(c, 0, 0, 20); break;
    case 'cloth': rr(c, -22, -16, 44, 30, 4); F(c, '#bfe3cf', OL, 2); for (let i = 0; i < 3; i++) xiangyun(c, -12 + i * 12, 0, 0.35, '#7fbfa8'); break;
    case 'kite': c.beginPath(); c.moveTo(0, -36); c.lineTo(22, -8); c.lineTo(0, 14); c.lineTo(-22, -8); c.closePath(); F(c, '#ffd36b', OL, 2); c.strokeStyle = '#e0344a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 14); c.quadraticCurveTo(10, 30, -4, 44); c.stroke(); break;
  }
};

/* ---------- 第三章死法场景 ---------- */
const T = (c, s, str, x, y, cx, by, size, col) => txt(c, str, cx + x * s, by + y * s, size * s, col);
const D = A.DPROPS = A.DPROPS || {};
const water = (c, cx, by, s, t) => { c.fillStyle = 'rgba(80,170,210,0.55)'; c.beginPath(); c.moveTo(cx - 230 * s, by - 90 * s); for (let i = 0; i <= 12; i++) c.lineTo(cx + (-230 + i * 38) * s, by - (90 + Math.sin(t * 3 + i) * 8) * s); c.lineTo(cx + 230 * s, by); c.lineTo(cx - 230 * s, by); c.fill(); };
D.lake = { front: (c, cx, by, s, t) => { water(c, cx, by, s, t); A.drawChar(c, 'guifei', cx + 140 * s, by - 40 * s + Math.sin(t * 2) * 6 * s, s * 0.45, { t, face: 'smirk', still: true }); T(c, s, '咕噜噜……', -140, -330, cx, by, 22, '#3a6db5'); T(c, s, '本宫会游泳', 140, -230, cx, by, 18, '#c0392b'); } };
D.prow = { back: (c, cx, by, s, t) => { A.boat(c, cx - 30 * s, by - 60 * s, s * 1.4, '#d9343f', t); }, front: (c, cx, by, s, t) => { water(c, cx, by, s, t); T(c, s, 'You jump…', -140, -330, cx, by, 22, '#3a6db5'); T(c, s, '…I don\u2019t.', 140, -300, cx, by, 20, '#c0392b'); } };
D.zongzi = { front: (c, cx, by, s, t) => { E(c, cx + 120 * s, by - 40 * s, 44 * s, 12 * s); F(c, '#fff', '#4a8fd0', 2); zongzi(c, cx + 105 * s, by - 70 * s, 26 * s, '#6fae5a'); zongzi(c, cx + 140 * s, by - 64 * s, 22 * s, '#5a9e7a'); T(c, s, '红枣馅', 140, -140, cx, by, 18, '#8a2a2a'); T(c, s, '“妹妹尝尝~”', -140, -330, cx, by, 20, '#3f7a62'); } };
D.dice = { front: (c, cx, by, s, t) => { for (let i = 0; i < 2; i++) { c.save(); c.translate(cx + (100 + i * 50) * s, by - 50 * s); c.rotate(Math.sin(t * 3 + i) * 0.3); rr(c, -18 * s, -18 * s, 36 * s, 36 * s, 6 * s); F(c, '#fff', OL, 2); E(c, 0, 0, 5 * s, 5 * s); F(c, '#c0392b'); c.restore(); } T(c, s, '聚众赌博', 140, -130, cx, by, 20, '#c0392b'); T(c, s, '赢了一百两！', -140, -330, cx, by, 20, '#c99a3a'); } };
D.spin = { back: (c, cx, by, s, t) => { lantern(c, cx, by - 380 * s, s * 1.4, t, true); c.strokeStyle = '#e0344a'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(cx, by - 340 * s); c.lineTo(cx, by - 300 * s); c.stroke(); },
  front: (c, cx, by, s, t) => { for (let i = 0; i < 3; i++) { const a = t * 3 + i * TAU / 3; star(c, cx + Math.cos(a) * 160 * s, by - 200 * s + Math.sin(a) * 40 * s, 8 * s, '#ffd36b'); } T(c, s, '人形走马灯', 140, -100, cx, by, 20, '#c0392b'); } };
D.notes = { front: (c, cx, by, s, t) => { for (let i = 0; i < 5; i++) T(c, s, i % 2 ? '♪' : '♫', -160 + i * 80, -320 + Math.sin(t * 3 + i) * 12, cx, by, 30, '#3a6db5'); A.drawChar(c, 'taihou', cx + 140 * s, by, s * 0.5, { t, face: 'think', still: true }); T(c, s, '天青色等烟雨', -140, -250, cx, by, 18, '#3a6db5'); } };
D.hotpot = { front: (c, cx, by, s, t) => { E(c, cx + 120 * s, by - 50 * s, 50 * s, 16 * s); F(c, '#c0392b', OL, 2); c.beginPath(); c.arc(cx + 120 * s, by - 50 * s, 50 * s, 0, Math.PI); F(c, '#8a5a3a', OL, 2.5); for (let i = 0; i < 5; i++) { E(c, cx + (95 + i * 12) * s, by - (54 + Math.sin(t * 6 + i) * 3) * s, 4 * s, 4 * s); F(c, '#ff6a3a'); } T(c, s, '🌶🌶🌶', 140, -140, cx, by, 20, '#c0392b'); T(c, s, '刷锅中……', -140, -330, cx, by, 20, '#5a6a8a'); } };
D.clock = { front: (c, cx, by, s, t) => { rr(c, cx + 80 * s, by - 170 * s, 80 * s, 130 * s, 10 * s); F(c, '#c99a3a', OL, 2.5); E(c, cx + 120 * s, by - 130 * s, 28 * s, 28 * s); F(c, '#fffaf0', OL, 2); c.strokeStyle = OL; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(cx + 120 * s, by - 130 * s); c.lineTo(cx + 120 * s + Math.cos(t) * 20 * s, by - 130 * s + Math.sin(t) * 20 * s); c.stroke(); T(c, s, '当——', 120, -200, cx, by, 22, '#8a5210'); T(c, s, '送钟＝送终', -140, -330, cx, by, 20, '#c0392b'); } };
D.sutra = { front: (c, cx, by, s, t) => { for (let i = 0; i < 8; i++) { rr(c, cx + (80 + (i % 2) * 10) * s, by - (24 + i * 20) * s, 100 * s, 18 * s, 4); F(c, '#fff6e0', OL, 1.5); } T(c, s, '《金刚经》×999', 130, -210, cx, by, 18, '#8a2a2a'); T(c, s, '“与佛有缘”', -140, -330, cx, by, 20, '#8e6128'); } };
D.afro = { back: (c, cx, by, s, t) => { for (let i = 0; i < 14; i++) { const a = i * TAU / 14; E(c, cx + Math.cos(a) * 70 * s, by - 300 * s + Math.sin(a) * 60 * s, 34 * s, 34 * s); F(c, '#2a2020', OL, 1.5); } },
  front: (c, cx, by, s, t) => { for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t; star(c, cx + 160 * s + Math.cos(a) * 30 * s, by - 300 * s + Math.sin(a) * 30 * s, 6 * s, ['#ff6a8a', '#ffd36b', '#8fd0ff'][i % 3]); } T(c, s, '砰！', 140, -220, cx, by, 34, '#e03a3a'); } };
D.doll = { front: (c, cx, by, s, t) => { rr(c, cx - 210 * s, by - 50 * s, 420 * s, 50 * s, 6); F(c, '#8a5a3a', OL, 2.5); doll(c, cx + 130 * s, by - 90 * s, 36 * s); T(c, s, '床底下的“惊喜”', 140, -170, cx, by, 18, '#c0392b'); } };
D.confess = { front: (c, cx, by, s, t) => { A.drawChar(c, 'xiaotao', cx + 140 * s, by, s * 0.5, { t, face: 'cry', still: true }); rr(c, cx - 210 * s, by - 340 * s, 140 * s, 90 * s, 4); F(c, '#fff6e0', OL, 2); T(c, s, '供词：', -170, -320, cx, by, 16, '#3a2a2a'); T(c, s, '小主会飞……', -140, -290, cx, by, 15, '#3a2a2a'); T(c, s, '还会喝奶茶……', -140, -265, cx, by, 15, '#3a2a2a'); } };
D.pins = { front: (c, cx, by, s, t) => { doll(c, cx + 120 * s, by - 80 * s, 34 * s); A.drawChar(c, 'ningpin', cx - 150 * s, by, s * 0.5, { t, face: 'smirk', still: true }); T(c, s, '人赃并获~', -150, -210, cx, by, 18, '#3f7a62'); } };
D.mushroom = { back: (c, cx, by, s) => { c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(cx - 230 * s, by - 430 * s, 460 * s, 430 * s); },
  front: (c, cx, by, s, t) => { [[-120, 0.9], [130, 1.1], [100, 0.7], [-90, 0.6], [0, 0.8]].forEach(([x, k], i) => { const yy = i === 4 ? -330 : -20; rr(c, cx + (x - 6 * k) * s, by + (yy - 24 * k) * s, 12 * k * s, 24 * k * s, 4); F(c, '#fff6e0', OL, 1.5); c.beginPath(); c.arc(cx + x * s, by + (yy - 22 * k) * s, 22 * k * s, Math.PI, 0); F(c, '#e04a4a', OL, 2); E(c, cx + (x - 8 * k) * s, by + (yy - 32 * k) * s, 4 * k * s, 4 * k * s); F(c, '#fff'); }); T(c, s, '我不说！', 140, -260, cx, by, 20, '#fff'); } };
D.monkey = { back: (c, cx, by, s, t) => { c.save(); c.translate(cx + 150 * s, by); c.rotate(0.5 + Math.sin(t) * 0.05); rr(c, -14 * s, -300 * s, 28 * s, 300 * s, 6); F(c, '#8a5a3a', OL, 2.5); E(c, 0, -320 * s, 80 * s, 50 * s); F(c, '#5fae6a', OL, 2.5); c.restore(); },
  front: (c, cx, by, s, t) => { T(c, s, '树倒猢狲散', -140, -330, cx, by, 20, '#c0392b'); T(c, s, '（贵妃倒台）', 140, -60, cx, by, 16, '#8a1f2b'); } };
D.letters = { front: (c, cx, by, s, t) => { [[-150, '#2f5e9a', '坤宁宫'], [150, '#d9343f', '长春宫']].forEach(([x, col, n]) => { rr(c, cx + (x - 40) * s, by - 120 * s, 80 * s, 56 * s, 4); F(c, '#fff6e0', col, 3); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + (x - 40) * s, by - 120 * s); c.lineTo(cx + x * s, by - 92 * s); c.lineTo(cx + (x + 40) * s, by - 120 * s); c.stroke(); T(c, s, n, x, -50, cx, by, 16, col); }); T(c, s, '投名状 ×2', 0, -340, cx, by, 22, '#c0392b'); } };
D.incense = { front: (c, cx, by, s, t) => { rr(c, cx + 90 * s, by - 60 * s, 60 * s, 40 * s, 8 * s); F(c, '#c99a3a', OL, 2); for (let i = 0; i < 3; i++) { c.strokeStyle = '#8a4a2a'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(cx + (108 + i * 12) * s, by - 60 * s); c.lineTo(cx + (108 + i * 12) * s, by - 110 * s); c.stroke(); c.globalAlpha = 0.5; c.strokeStyle = '#b9a0d8'; c.lineWidth = 2 * s; c.beginPath(); c.moveTo(cx + (108 + i * 12) * s, by - 110 * s); c.quadraticCurveTo(cx + (120 + Math.sin(t * 2 + i) * 20) * s, by - 160 * s, cx + (100 + i * 20) * s, by - 220 * s); c.stroke(); c.globalAlpha = 1; } T(c, s, '甜腻的苦味', -140, -330, cx, by, 20, '#7a5ab8'); } };
D.kite = { back: (c, cx, by, s, t) => { c.fillStyle = 'rgba(20,24,50,0.5)'; c.fillRect(cx - 230 * s, by - 430 * s, 460 * s, 430 * s); c.strokeStyle = '#fffbe0'; c.lineWidth = 5 * s; c.beginPath(); c.moveTo(cx + 140 * s, by - 430 * s); c.lineTo(cx + 110 * s, by - 380 * s); c.lineTo(cx + 150 * s, by - 360 * s); c.lineTo(cx + 120 * s, by - 300 * s); c.stroke(); },
  front: (c, cx, by, s, t) => { c.save(); c.translate(cx + 120 * s, by - 270 * s); c.scale(s * 1.4, s * 1.4); A.drawProp(c, 'kite', t, 0, 0); c.restore(); T(c, s, '富兰克林', -140, -330, cx, by, 20, '#ffd36b'); T(c, s, '滋滋——', 140, -150, cx, by, 20, '#fffbe0'); } };
D.laundry = { front: (c, cx, by, s, t) => { for (let i = 0; i < 7; i++) { rr(c, cx + (80 + (i % 2) * 14) * s, by - (24 + i * 18) * s, 100 * s, 16 * s, 5); F(c, ['#f3b6c8', '#bfe3cf', '#fff6dc', '#a9c4e0'][i % 4], OL, 1.5); } for (let i = 0; i < 6; i++) { const k = (t * 0.4 + i / 6) % 1; E(c, cx + (-150 + i * 20) * s, by - (60 + k * 200) * s, (8 + k * 6) * s, (8 + k * 6) * s); F(c, 'rgba(255,255,255,0.6)', 'rgba(140,180,220,0.9)', 1); } T(c, s, '第一千件', 140, -180, cx, by, 18, '#3f6aa6'); } };
D.bucket = { front: (c, cx, by, s, t) => { c.beginPath(); c.moveTo(cx + 80 * s, by - 100 * s); c.lineTo(cx + 90 * s, by - 20 * s); c.lineTo(cx + 160 * s, by - 20 * s); c.lineTo(cx + 170 * s, by - 100 * s); c.closePath(); F(c, '#a8743a', OL, 2.5); E(c, cx + 125 * s, by - 100 * s, 45 * s, 10 * s); F(c, '#7a4a2a', OL, 2); for (let i = 0; i < 3; i++) { c.strokeStyle = 'rgba(120,160,60,0.7)'; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(cx + (110 + i * 14) * s, by - 112 * s); c.quadraticCurveTo(cx + (100 + i * 14 + Math.sin(t * 3 + i) * 10) * s, by - 140 * s, cx + (114 + i * 14) * s, by - 170 * s); c.stroke(); } T(c, s, '“恭桶娘娘”', -140, -330, cx, by, 20, '#6a8a2a'); } };
D.lanternG = { front: (c, cx, by, s, t) => { A.drawChar(c, 'guard', cx + 140 * s, by, s * 0.55, { t, face: 'angry', still: true }); lantern(c, cx + 80 * s, by - 200 * s, s, t, true); T(c, s, '站住！', -140, -330, cx, by, 26, '#e03a3a'); T(c, s, '禁地', -140, -290, cx, by, 18, '#5a6a8a'); } };
})(window.PALACE = window.PALACE || {});
