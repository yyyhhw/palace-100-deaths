/* 小游戏：寿宴献舞 —— 节奏点击。音符落到金线时点对应的那一列。连续漏拍 5 次就会出事。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const LN = [{ n: '左袖', e: '🌸', col: '#ef6f93' }, { n: '转身', e: '🌀', col: '#f2c24d' }, { n: '右袖', e: '🍃', col: '#5fae8a' }];
Q.dance = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show dance'; AU.setMood('happy');
      const total = st.notes || 24, gap = st.gap || 0.8, travel = st.travel || 1.8, win = st.win || 0.25, maxMiss = st.maxMiss || 5;
      ov.innerHTML = `<div class="ghud"><b>💃 寿宴献舞</b><span class="dsc"></span></div><canvas class="dcv"></canvas>
        <div class="dbtnz">${LN.map((l, i) => `<button class="btn dbtn" data-i="${i}"><span>${l.e}</span>${l.n}</button>`).join('')}</div>
        <div class="tintro"><div class="tbox"><h3>💃 给太后献舞</h3><p>花瓣落到<b>金线</b>的时候，点下面<b>同一列</b>的按钮。<br>点准了是“好！”，漏掉了裙摆会乱。</p><p class="terr">⚠️ 连续漏拍 ${maxMiss} 次……灯笼就在你头顶。</p><button class="btn pri tgo">乐起</button></div></div>`;
      const cv = ov.querySelector('.dcv'), ctx = cv.getContext('2d');
      const notes = []; let lastLane = 1;
      for (let i = 0; i < total; i++) { let l = Math.floor(Math.random() * 3); if (i < 4) l = [1, 0, 2, 1][i]; else if (l === lastLane && Math.random() < 0.5) l = (l + 1) % 3; lastLane = l; notes.push({ t: 2 + i * gap + (i > total / 2 ? 0 : 0.1), lane: l, done: 0 }); }
      const S = this.state = { notes, time: 0, run: false, end: false, hits: 0, misses: 0, streak: 0, maxStreak: 0, fx: [], combo: 0, pose: 0 };
      let alive = true, last = performance.now();
      const upd = () => { const e = ov.querySelector('.dsc'); if (e) e.textContent = `好 ${S.hits} · 漏 ${S.misses} · 连漏 ${S.streak}/${maxMiss}`; };
      const pop = (txt, col, lane) => S.fx.push({ txt, col, lane, a: 1 });
      const miss = n => { n.done = 2; S.misses++; S.streak++; S.combo = 0; S.maxStreak = Math.max(S.maxStreak, S.streak); pop('漏！', '#c0392b', n.lane); AU.sfx('buzz'); upd(); if (S.streak >= maxMiss) finish(); };
      S.hit = lane => {
        if (!S.run) return false; S.pose = lane - 1;
        let best = null; S.notes.forEach(n => { if (!n.done && n.lane === lane && Math.abs(n.t - S.time) < win && (!best || Math.abs(n.t - S.time) < Math.abs(best.t - S.time))) best = n; });
        if (best) { best.done = 1; S.hits++; S.streak = 0; S.combo++; pop(Math.abs(best.t - S.time) < win * 0.45 ? '妙！' : '好！', '#2a7a3a', lane); AU.sfx('tick'); upd(); return true; }
        return false; // 空拍不算失误（简单模式）
      };
      ov.querySelectorAll('.dbtn').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 120); S.hit(+b.dataset.i); }));
      const finish = () => {
        if (S.end) return; S.end = true; S.run = false;
        const ok = S.streak < maxMiss, great = ok && S.hits >= total * 0.75;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${!ok ? '😵 裙摆勾住了灯笼！' : great ? '✨ 满堂喝彩！' : '🙂 跳完了'}</h3><p>${!ok ? '你在空中转了一圈、两圈、三圈……' : `点中 ${S.hits}/${total} 拍。${great ? '太后笑得眼睛都眯起来了。' : '有几下踩错了，好在没人注意（大概）。'}`}</p><button class="btn pri tok">${ok ? '谢幕' : '……'}</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, great, hits: S.hits, misses: S.misses, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) { S.time += dt; S.notes.forEach(n => { if (!n.done && S.time - n.t > win) miss(n); }); if (S.run && S.notes.every(n => n.done)) setTimeout(finish, 400), S.run = false; }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#7a1f2a'], [1, '#c0474f']]); c.fillRect(0, 0, W, H);
        const lw = W / 3, hitY = H * 0.82;
        for (let i = 0; i < 3; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; c.fillRect(i * lw, 0, lw, H); }
        // 舞者
        const s = H / 600; c.globalAlpha = 0.9; A.drawChar(c, 'me', W / 2 + S.pose * lw * 0.2, H * 0.98, s, { t, face: S.streak >= 3 ? 'panic' : S.combo >= 3 ? 'star' : 'smile' }); c.globalAlpha = 1;
        if (S.streak >= 3) A.lantern(c, W / 2, H * 0.06, H / 700, t, true);
        c.strokeStyle = '#ffd36b'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, hitY); c.lineTo(W, hitY); c.stroke();
        for (let i = 0; i < 3; i++) { U.E(c, (i + 0.5) * lw, hitY, lw * 0.22, lw * 0.22 > H * 0.07 ? H * 0.07 : lw * 0.22); U.F(c, 'rgba(255,255,255,0.12)', '#ffd36b', 2); }
        const rad = Math.min(lw * 0.2, H * 0.06);
        S.notes.forEach(n => { if (n.done) return; const k = 1 - (n.t - S.time) / travel; if (k < -0.1 || k > 1.3) return; const x = (n.lane + 0.5) * lw, y = k * hitY; U.E(c, x, y, rad, rad); U.F(c, LN[n.lane].col, '#fff', 3); c.font = `${Math.round(rad * 1.1)}px sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(LN[n.lane].e, x, y + 1); });
        S.fx = S.fx.filter(f => (f.a -= dt * 1.5) > 0); S.fx.forEach(f => { c.globalAlpha = f.a; c.font = `bold ${Math.round(H * 0.07)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.lineWidth = 5; c.strokeStyle = '#fff'; const y = hitY - H * 0.12 - (1 - f.a) * 30; c.strokeText(f.txt, (f.lane + 0.5) * lw, y); c.fillStyle = f.col; c.fillText(f.txt, (f.lane + 0.5) * lw, y); c.globalAlpha = 1; });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
