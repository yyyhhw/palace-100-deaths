/* 小游戏②：奉茶（练习版）——端着托盘走过长廊，按住左右两侧保持平衡。
   每洒一次 = 规矩课错误 +1；累计错误 3 次 → 雨中罚跪（No.012《跪成一尊雕塑》）。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
Q.tea = {
  state: null,
  play(G, st) {
    return new Promise(res => {
      st = st || {}; const EK = st.errKey || 'err', MAX = st.max || 3, HARD = st.hard || 1, WHO = st.who || 'guimama', NM = st.whoName || '桂嬷嬷';
      const ov = document.querySelector('#gameOv'); ov.className = 'show tea'; AU.setMood('quiz');
      ov.innerHTML = `<canvas class="tcv"></canvas><div class="thud"><b>${st.gtitle || '奉茶 · 练习'}</b><span class="tspill"></span><div class="tprog"><i></i></div></div>
        <div class="tzone tl"><span>◀ 按住</span></div><div class="tzone tr"><span>按住 ▶</span></div>
        <div class="tintro"><div class="tbox"><h3>🍵 奉茶</h3><p>${st.intro || '托盘往哪边歪，就<b>按住另一边</b>把它扶正！<br>小心风、滑地板，还有……某只猫。'}</p><p class="terr"></p><button class="btn pri tgo">开始端茶</button></div></div>`;
      const cv = ov.querySelector('.tcv'), ctx = cv.getContext('2d');
      let alive = true, last = 0;
      const err0 = G.cnt(EK);
      const S = this.state = { th: 0, w: 0, u: 0, prog: 0, spills: 0, err: err0, run: false, done: false, t: 0, gust: 0, gustT: 2.2, ev: '', evT: 0, cat: -1, slosh: 0, splash: 0, dur: st.dur || 17, who: WHO, keys: { l: false, r: false }, ptr: {} };
      ov.querySelector('.terr').textContent = st.warn || (err0 ? `（今天已经错了 ${err0} 次，再错 ${MAX - err0} 次就要罚跪！）` : '（洒 3 次就要去雨里罚跪哦）');
      const upd = () => { if (!ov.isConnected || !ov.querySelector('canvas')) return; ov.querySelector('.tspill').textContent = (st.errKey ? `洒出 ${S.spills}/${MAX}` : `洒出 ${S.spills} · 今日错误 ${S.err}/3`); ov.querySelector('.tprog i').style.width = (S.prog * 100) + '%'; };
      upd();
      const recomputeU = () => { if (!alive) return; const vals = Object.values(S.ptr); const l = S.keys.l || vals.includes(-1), r = S.keys.r || vals.includes(1); S.u = l && !r ? -1 : r && !l ? 1 : 0; ov.querySelector('.tl').classList.toggle('on', S.u < 0); ov.querySelector('.tr').classList.toggle('on', S.u > 0); };
      const down = e => { if (!S.run) return; const r = ov.getBoundingClientRect(); S.ptr[e.pointerId] = (e.clientX - r.left) < r.width / 2 ? -1 : 1; recomputeU(); e.preventDefault(); };
      const up = e => { delete S.ptr[e.pointerId]; recomputeU(); };
      ov.addEventListener('pointerdown', down); ov.addEventListener('pointerup', up); ov.addEventListener('pointercancel', up); ov.addEventListener('pointerleave', up);
      const kd = e => { if (e.key === 'ArrowLeft' || e.key === 'a') S.keys.l = true; if (e.key === 'ArrowRight' || e.key === 'd') S.keys.r = true; recomputeU(); };
      const ku = e => { if (e.key === 'ArrowLeft' || e.key === 'a') S.keys.l = false; if (e.key === 'ArrowRight' || e.key === 'd') S.keys.r = false; recomputeU(); };
      window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      last = performance.now();
      const end = (fail) => {
        S.run = false; S.done = true; G.run.cnt[EK] = S.err;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${fail ? '😱 茶全洒了！' : '✨ 奉茶完成！'}</h3><p>${fail ? NM + '的脸，比茶还烫。' : S.spills ? `洒了 ${S.spills} 次，${NM}勉强点了点头。` : `一滴都没洒！${NM}挑了挑眉。`}</p><button class="btn pri tok">继续</button></div>`;
        ov.appendChild(box); AU.sfx(fail ? 'gong' : 'ding');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); ov.removeEventListener('pointerdown', down); ov.removeEventListener('pointerup', up); ov.removeEventListener('pointercancel', up); ov.removeEventListener('pointerleave', up); ov.className = ''; ov.innerHTML = ''; this.state = null; res({ spills: S.spills, fail, err: S.err, death: fail && st.failDeath ? st.failDeath : undefined }); };
      };
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.04, (now - last) / 1000); last = now;
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        if (S.run) {
          S.t += dt; S.prog = Math.min(1, S.t / S.dur);
          // 干扰：风 / 地滑 / 猫
          S.gustT -= dt;
          if (S.gustT <= 0) { const kind = Math.random(); S.gust = (Math.random() < 0.5 ? -1 : 1) * (1.6 + Math.random() * 1.6) * HARD; S.gustDur = 0.5; S.gustT = 1.8 + Math.random() * 1.6;
            if (kind < 0.5) { S.ev = '一阵风！'; AU.sfx('whoosh'); } else if (kind < 0.8) { S.ev = '地板好滑！'; AU.sfx('slip'); S.gust *= 1.2; } else { S.ev = '糯米冲过来了！'; S.cat = 0; AU.sfx('meow'); S.gust *= 1.35; } S.evT = 1.1; }
          let g = 0; if (S.gustDur > 0) { S.gustDur -= dt; g = S.gust; }
          const acc = 1.3 * S.th + g - 1.9 * S.w + S.u * 4.2 + Math.sin(S.t * 1.7) * 0.25;
          S.w += acc * dt; S.th += S.w * dt; S.slosh += (S.th * 1.4 - S.slosh) * Math.min(1, dt * 6);
          if (Math.abs(S.th) > 0.55) { S.spills++; S.err++; S.th = 0; S.w = 0; S.splash = 1; AU.sfx('spill'); G.stage.shake = 0.3; upd(); if (S.err >= MAX) end(true); }
          if (S.prog >= 1 && !S.done) end(false);
          upd();
        }
        if (S.evT > 0) S.evT -= dt; if (S.splash > 0) S.splash -= dt * 1.5; if (S.cat >= 0) { S.cat += dt * 0.9; if (S.cat > 1.2) S.cat = -1; }
        draw(ctx, d, W, H, S, now / 1000);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
function draw(c, d, W, H, S, t) {
  c.setTransform(d, 0, 0, d, 0, 0);
  // 长廊（滚动）
  c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#ffe9c9'], [0.55, '#f6d6a8'], [1, '#d9b98a']]); c.fillRect(0, 0, W, H);
  const off = (S.t * 140) % 220;
  c.fillStyle = '#b83b3b'; c.fillRect(0, H * 0.08, W, H * 0.05); c.fillStyle = '#2f6e8a'; c.fillRect(0, H * 0.13, W, H * 0.03);
  for (let i = -1; i < W / 220 + 2; i++) { const x = i * 220 - off; c.fillStyle = U.lg(c, x, 0, x + 34, 0, [[0, '#9e2f2f'], [0.5, '#d8573f'], [1, '#9e2f2f']]); c.fillRect(x, H * 0.16, 34, H * 0.56); A.lantern(c, x + 110, H * 0.25, H / 900, t, false);
    c.save(); c.globalAlpha = 0.5; U.flower(c, x + 110, H * 0.5, 10, '#ffd9e4', '#fff'); c.restore(); }
  c.fillStyle = '#d9c6a3'; c.fillRect(0, H * 0.72, W, H * 0.28); c.strokeStyle = 'rgba(120,90,60,0.25)'; c.lineWidth = 2; for (let i = -1; i < W / 80 + 2; i++) { const x = i * 80 - (S.t * 140) % 80; c.beginPath(); c.moveTo(x, H * 0.72); c.lineTo(x - 40, H); c.stroke(); }
  // 终点的桂嬷嬷
  if (S.prog > 0.7) { const k = (S.prog - 0.7) / 0.3; A.drawChar(c, S.who, W * (1.15 - k * 0.35), H * 0.92, H / 520, { t, face: S.splash > 0 ? 'angry' : 'normal' }); }
  // 主角（端托盘）
  const s = Math.min(H / 560, W / 400), mx = W * (W > H ? 0.4 : 0.45), my = H * 0.92;
  A.drawChar(c, 'me', mx, my, s, { t: t * 1.6, face: S.splash > 0 ? 'shock' : Math.abs(S.th) > 0.35 ? 'panic' : 'normal', pose: 'tray', tilt: -S.th * 0.15 });
  // 托盘 + 茶杯
  c.save(); c.translate(mx, my - 86 * s); c.rotate(S.th); c.scale(s, s);
  U.rr(c, -62, -6, 124, 12, 5); U.F(c, '#b8604a', U.OL, 3); U.rr(c, -56, -10, 112, 6, 3); U.F(c, '#d8826a');
  c.save(); c.translate(0, -10);
  U.E(c, 0, -24, 22, 6); U.F(c, '#fff', U.OL, 2.5);
  c.beginPath(); c.moveTo(-22, -24); c.quadraticCurveTo(-20, 0, 0, 0); c.quadraticCurveTo(20, 0, 22, -24); U.F(c, '#fffaf0', U.OL, 2.5);
  c.save(); c.beginPath(); c.moveTo(-22, -24); c.quadraticCurveTo(-20, 0, 0, 0); c.quadraticCurveTo(20, 0, 22, -24); c.clip(); c.rotate(-S.slosh * 0.6); c.fillStyle = '#8fbf6a'; c.fillRect(-30, -20, 60, 30); c.restore();
  U.flower(c, 0, -10, 5, '#7fb8d8', '#fff');
  c.globalAlpha = 0.5; c.strokeStyle = '#fff'; c.lineWidth = 3; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 8, -30); c.quadraticCurveTo(i * 8 + 5, -42 - Math.sin(t * 3 + i) * 4, i * 8, -54); c.stroke(); }
  c.restore(); c.restore();
  if (S.splash > 0) { c.save(); c.globalAlpha = S.splash; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; U.E(c, mx + Math.cos(a) * 60 * (1.2 - S.splash) * 1.5, my - 114 * s + Math.sin(a) * 40 * (1.2 - S.splash), 6, 8); U.F(c, '#8fbf6a'); } c.restore(); }
  // 平衡仪
  const gr = Math.min(W * 0.3, H * 0.2, 120), gx = W / 2, gy = Math.max(H * 0.22, 104 + gr * 0.4);
  c.save(); c.lineCap = 'round'; c.lineWidth = 14; c.strokeStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(gx, gy + gr * 0.6, gr, Math.PI * 1.2, Math.PI * 1.8); c.stroke();
  c.strokeStyle = '#7fb8a8'; c.beginPath(); c.arc(gx, gy + gr * 0.6, gr, Math.PI * 1.5 - 0.22, Math.PI * 1.5 + 0.22); c.stroke();
  c.strokeStyle = '#e2577e'; c.lineWidth = 6; c.beginPath(); c.arc(gx, gy + gr * 0.6, gr, Math.PI * 1.2, Math.PI * 1.26); c.stroke(); c.beginPath(); c.arc(gx, gy + gr * 0.6, gr, Math.PI * 1.74, Math.PI * 1.8); c.stroke();
  const na = Math.PI * 1.5 + Math.max(-0.6, Math.min(0.6, S.th)) / 0.55 * (Math.PI * 0.3);
  c.strokeStyle = U.OL; c.lineWidth = 4; c.beginPath(); c.moveTo(gx, gy + gr * 0.6); c.lineTo(gx + Math.cos(na) * (gr + 10), gy + gr * 0.6 + Math.sin(na) * (gr + 10)); c.stroke();
  U.E(c, gx + Math.cos(na) * (gr + 12), gy + gr * 0.6 + Math.sin(na) * (gr + 12), 9, 9); U.F(c, Math.abs(S.th) > 0.35 ? '#e2577e' : '#f2c24d', U.OL, 2.5);
  c.restore();
  if (S.evT > 0) { c.save(); c.globalAlpha = Math.min(1, S.evT * 2); c.font = `bold ${Math.round(Math.min(W, H) * 0.06)}px "Noto Serif CJK SC", serif`; c.textAlign = 'center'; c.lineWidth = 6; c.strokeStyle = '#fff'; c.strokeText(S.ev, W / 2, H * 0.4); c.fillStyle = '#c0392b'; c.fillText(S.ev, W / 2, H * 0.4); c.restore();
    if (S.ev[0] === '一') { for (let i = 0; i < 6; i++) { c.save(); c.translate(((t * 400 + i * 120) % (W + 100)) - 50, H * (0.3 + i * 0.07)); c.rotate(t * 4 + i); U.E(c, 0, 0, 8, 4); U.F(c, '#7cc48a'); c.restore(); } } }
  if (S.cat >= 0) A.drawCat(c, W * (1.1 - S.cat * 1.3), H * 0.96, H / 900, { t, run: true, flip: false });
}
})(window.PALACE = window.PALACE || {});
