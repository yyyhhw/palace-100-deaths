/* 小游戏：绣荷包 —— 手指沿着虚线一笔描过去（按顺序经过每个针脚）。限时内完成 85% 就算绣好。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
function pattern(n) { // 心形 + 尾巴（像一只胖鸳鸯）
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI * 2; const x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); pts.push([x / 18, y / 18]); }
  return pts;
}
Q.embroider = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show embroider'; AU.setMood('quiz');
      const dur = st.dur || 25, need = st.need || 0.85, tired = !!st.tired;
      ov.innerHTML = `<div class="ghud"><b>🪡 绣荷包</b><span class="esc"></span></div><canvas class="ecv"></canvas>
        <div class="tintro"><div class="tbox"><h3>🪡 给太后绣荷包</h3><p>按住屏幕，<b>沿着虚线</b>从<b>红点</b>开始描，一针一针绣过去。<br>${dur} 秒内绣完 ${Math.round(need * 100)}% 就算成功。</p><p class="terr">${tired ? '（你熬了夜，手有点抖……）' : '（心静，手稳。）'}</p><button class="btn pri tgo">穿针引线</button></div></div>`;
      const cv = ov.querySelector('.ecv'), ctx = cv.getContext('2d');
      const base = pattern(st.n || 28);
      const S = this.state = { pts: base, done: 0, left: dur, run: false, end: false, drag: false, trail: [], shake: tired ? 1 : 0, prog: 0 };
      let alive = true, last = performance.now();
      const geo = () => { const r = cv.getBoundingClientRect(); const sc = Math.min(r.width, r.height) * 0.36; return { r, sc, cx: r.width / 2, cy: r.height * 0.55 }; };
      S.ptXY = j => { const { r, sc, cx, cy } = geo(); const p = S.pts[j]; return { x: r.left + cx + p[0] * sc, y: r.top + cy + p[1] * sc }; };
      const upd = () => { S.prog = S.done / S.pts.length; ov.querySelector('.esc').textContent = `进度 ${Math.round(S.prog * 100)}% · 剩余 ${Math.ceil(S.left)} 秒`; };
      const finish = () => {
        if (S.end) return; S.end = true; S.run = false;
        const ok = S.prog >= need;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '✨ 绣好啦！' : '😵 绣歪了……'}</h3><p>${ok ? '一对胖鸳鸯，憨态可掬。小桃说像两个汤圆。' : '鸳鸯绣成了……鸭子。还是被门夹过的那种。'}</p><button class="btn pri tok">放下针线</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, prog: S.prog, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      const near = (x, y) => {
        if (!S.run || S.done >= S.pts.length) return;
        const { r } = geo(); const tol = Math.max(22, Math.min(r.width, r.height) * 0.05);
        // 允许跳过一个针脚（简单模式）
        for (let k = S.done; k < Math.min(S.pts.length, S.done + 2); k++) { const p = S.ptXY(k); if (Math.hypot(p.x - x, p.y - y) < tol) { S.done = k + 1; AU.sfx('tick'); upd(); if (S.done >= S.pts.length) finish(); return; } }
      };
      const mv = e => { if (!S.drag) return; e.preventDefault(); const { r } = geo(); S.trail.push([e.clientX - r.left, e.clientY - r.top]); if (S.trail.length > 400) S.trail.shift(); near(e.clientX, e.clientY); };
      cv.addEventListener('pointerdown', e => { e.preventDefault(); S.drag = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} mv(e); });
      cv.addEventListener('pointermove', mv);
      const up = () => { S.drag = false; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) { S.left -= dt; if (S.left <= 0) { S.left = 0; upd(); finish(); } else if ((t * 10 | 0) % 3 === 0) upd(); }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#f7e6d0'], [1, '#e8c9a0']]); c.fillRect(0, 0, W, H);
        const { sc, cx, cy } = geo();
        // 绣绷
        U.E(c, cx, cy - sc * 0.1, sc * 1.45, sc * 1.45); U.F(c, '#fffaf0', '#a8743a', 14); U.E(c, cx, cy - sc * 0.1, sc * 1.36, sc * 1.36); U.F(c, null, '#c99a5a', 3);
        c.save(); c.setLineDash([6, 8]); c.strokeStyle = 'rgba(160,80,90,0.6)'; c.lineWidth = 2.5; c.beginPath(); S.pts.forEach((p, j) => { const x = cx + p[0] * sc, y = cy + p[1] * sc; j ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore();
        c.strokeStyle = '#e0344a'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); for (let j = 0; j < S.done; j++) { const p = S.pts[j], x = cx + p[0] * sc, y = cy + p[1] * sc; j ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        if (S.done < S.pts.length) { const p = S.pts[S.done], x = cx + p[0] * sc, y = cy + p[1] * sc; U.E(c, x, y, 10 + Math.sin(t * 6) * 3, 10 + Math.sin(t * 6) * 3); U.F(c, 'rgba(224,52,74,0.35)', '#e0344a', 2); }
        if (S.done >= S.pts.length * 0.5) { U.flower(c, cx - sc * 0.25, cy - sc * 0.15, sc * 0.08, '#ffd36b', '#fff'); }
        if (S.trail.length > 1) { c.strokeStyle = 'rgba(90,60,180,0.25)'; c.lineWidth = 2; c.beginPath(); S.trail.forEach(([x, y], j) => { const jx = S.shake ? Math.sin(j * 1.7 + t * 20) * 3 : 0; j ? c.lineTo(x + jx, y) : c.moveTo(x + jx, y); }); c.stroke(); }
        // 针
        if (S.trail.length) { const [x, y] = S.trail[S.trail.length - 1]; c.strokeStyle = '#cfd6e0'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18, y - 26); c.stroke(); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
