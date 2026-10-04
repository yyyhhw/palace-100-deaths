/* 小游戏：御花园夜间逃脱 QTE —— 三条小路，巡逻侍卫提着灯笼迎面走来。左右换道躲开灯光，坚持到终点。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
Q.escape = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show escape gp'; AU.setMood('danger');
      const dur = st.dur || 16, lives = st.lives || 2, travel = st.travel || 2.2, every = st.every || 1.15;
      ov.innerHTML = `<div class="ghud"><b>🏮 夜逃御花园</b><span class="xsc"></span></div><canvas class="xcv"></canvas>
        <div class="xbtnz"><button class="btn xbtn" data-d="-1">◀ 左躲</button><button class="btn xbtn" data-d="1">右躲 ▶</button></div>
        <div class="tintro"><div class="tbox"><h3>🏮 别被灯笼照到！</h3><p>巡逻的侍卫提着灯笼迎面走来。点 <b>◀ ▶</b>（或点屏幕左右两边、左右滑动）换一条小路。<br>坚持 ${dur} 秒，就能溜回去。</p><p class="terr">被照到 ${lives} 次就会被抓。</p><button class="btn pri tgo">猫着腰，走！</button></div></div>`;
      const cv = ov.querySelector('.xcv'), ctx = cv.getContext('2d');
      const S = this.state = { lane: 1, px: 1, obs: [], time: 0, left: dur, hits: 0, run: false, end: false, inv: 0, spawnT: 0.6, travel };
      let alive = true, last = performance.now();
      const upd = () => { const e = ov.querySelector('.xsc'); if (e) e.textContent = `剩余 ${Math.ceil(S.left)} 秒 · 被照到 ${S.hits}/${lives}`; };
      S.goto = l => { if (!S.run) return false; S.lane = Math.max(0, Math.min(2, l)); AU.sfx('whoosh'); return true; };
      S.move = d => S.goto(S.lane + d);
      ov.querySelectorAll('.xbtn').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); S.move(+b.dataset.d); }));
      let sx = null;
      cv.addEventListener('pointerdown', e => { e.preventDefault(); sx = e.clientX; });
      cv.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; const r = cv.getBoundingClientRect(); if (Math.abs(dx) > 30) S.move(dx > 0 ? 1 : -1); else S.move(e.clientX - r.left < r.width / 2 ? -1 : 1); sx = null; });
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '😮‍💨 溜回来了！' : '🏮 “站住！什么人！”'}</h3><p>${ok ? '你贴着墙根，一路摸回了住处。心跳得像打鼓。' : '灯笼的光，正正照在你脸上。'}</p><button class="btn pri tok">${ok ? '呼——' : '……'}</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, hits: S.hits, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) {
          S.time += dt; S.left -= dt; S.inv = Math.max(0, S.inv - dt);
          S.spawnT -= dt; if (S.spawnT <= 0 && S.left > travel * 0.6) { S.spawnT = every * (0.8 + Math.random() * 0.4); const l = Math.floor(Math.random() * 3); S.obs.push({ lane: l, k: 0 }); if (S.time > 6 && Math.random() < 0.35) S.obs.push({ lane: (l + 1 + Math.floor(Math.random() * 2)) % 3, k: 0 }); }
          S.obs.forEach(o => { o.k += dt / travel; if (!o.hit && !o.passed && o.k > 0.86 && o.k < 0.98) { if (o.lane === S.lane && S.inv <= 0) { o.hit = true; S.hits++; S.inv = 0.8; AU.sfx('buzz'); upd(); if (S.hits >= lives) finish(false); } } if (o.k >= 0.98) o.passed = true; });
          S.obs = S.obs.filter(o => o.k < 1.2);
          if ((t * 4 | 0) % 2) upd();
          if (S.left <= 0 && S.run) { S.left = 0; finish(true); }
        }
        S.px += (S.lane - S.px) * Math.min(1, dt * 14);
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#0f1430'], [1, '#26305a']]); c.fillRect(0, 0, W, H);
        const lw = W / 3;
        for (let i = 0; i < 3; i++) { c.fillStyle = '#3a3a5a'; c.fillRect(i * lw + lw * 0.15, 0, lw * 0.7, H); c.fillStyle = 'rgba(255,255,255,0.08)'; for (let y = ((S.time * 120) % 60) - 60; y < H; y += 60) c.fillRect(i * lw + lw * 0.48, y, lw * 0.04, 26); }
        for (let i = 0; i < 6; i++) { const y = ((i * H / 5 + S.time * 120) % (H + 80)) - 40; A.tree(c, i % 2 ? W - 6 : 6, y + 40, H / 2200, false); }
        const s = H / 700;
        S.obs.forEach(o => { const x = (o.lane + 0.5) * lw, y = o.k * H * 0.95; c.fillStyle = 'rgba(255,220,120,0.28)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x - lw * 0.42, y + H * 0.2); c.lineTo(x + lw * 0.42, y + H * 0.2); c.closePath(); c.fill(); A.drawChar(c, 'guard', x, y, s * 0.55, { t, face: 'angry', still: true }); A.lantern(c, x + lw * 0.15, y - H * 0.04, H / 1100, t, true); });
        const blink = S.inv > 0 && (t * 12 | 0) % 2;
        if (!blink) A.drawChar(c, 'me', (S.px + 0.5) * lw, H * 0.99, s * 0.6, { t, face: S.hits ? 'panic' : 'sweat' });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
