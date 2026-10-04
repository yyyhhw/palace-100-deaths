/* 小游戏：火场逃脱 —— 三条路，房梁往下掉、火苗往上窜。左右换道躲开，捡水桶压住浓烟；半路上，小桃在喊你。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
Q.huozai = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show huozai gp'; AU.setMood('danger');
      const ready = !!st.ready, dur = st.dur || 18, lives = st.lives || (ready ? 3 : 2), travel = st.travel || 2.3, every = st.every || 1.1;
      const smokeRate = ready ? 2.2 : 5, wantTao = !!st.tao;
      const hint = ready ? '🔮 你早有准备：湿帕子捂着口鼻，浓烟涨得慢多了。' : '';
      ov.innerHTML = `<div class="ghud"><b>🔥 走水了！</b><span class="hsc"></span></div><canvas class="hcv"></canvas>
        <div class="hmsg smsg">${hint || '躲开房梁和火苗，捡 🪣 水桶压住浓烟！'}</div>
        <div class="xbtnz"><button class="btn xbtn" data-d="-1">◀ 左</button><button class="btn xbtn" data-d="1">右 ▶</button></div>
        <div class="tintro"><div class="tbox"><h3>🔥 往东门跑！</h3><p>点 <b>◀ ▶</b>（或点屏幕左右两边、左右滑动）换一条路。<br>躲开 <b>掉下来的房梁</b> 和 <b>火苗</b>；捡 <b>🪣 水桶</b> 能把浓烟压下去。${wantTao ? '<br>听见 <b>小桃</b> 喊你时，跑到她那条路上把她拉走！' : ''}</p><p class="terr">撞上 ${lives} 次，或者浓烟满了，就跑不出去了。坚持 ${dur} 秒。</p><button class="btn pri tgo">捂住口鼻，跑！</button></div></div>`;
      const cv = ov.querySelector('.hcv'), ctx = cv.getContext('2d');
      const S = this.state = { lane: 1, px: 1, obs: [], time: 0, left: dur, hits: 0, smoke: ready ? 0 : 15, run: false, end: false, inv: 0, spawnT: 0.7, travel, rescued: false, taoSpawned: !wantTao, waterT: 2.2 };
      let alive = true, last = performance.now();
      const msg = t => { const m = ov.querySelector('.hmsg'); if (m) m.textContent = t; };
      const upd = () => { const e = ov.querySelector('.hsc'); if (e) e.textContent = `剩 ${Math.ceil(S.left)} 秒 · 撞到 ${S.hits}/${lives} · 浓烟 ${Math.round(S.smoke)}%${wantTao ? (S.rescued ? ' · 🍑 已救下' : '') : ''}`; };
      S.goto = l => { if (!S.run) return false; S.lane = Math.max(0, Math.min(2, l)); AU.sfx('whoosh'); return true; };
      S.move = d => S.goto(S.lane + d);
      ov.querySelectorAll('.xbtn').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); S.move(+b.dataset.d); }));
      let sx = null;
      cv.addEventListener('pointerdown', e => { e.preventDefault(); sx = e.clientX; });
      cv.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; const r = cv.getBoundingClientRect(); if (Math.abs(dx) > 30) S.move(dx > 0 ? 1 : -1); else S.move(e.clientX - r.left < r.width / 2 ? -1 : 1); sx = null; });
      const finish = (ok, why) => {
        if (S.end) return; S.end = true; S.run = false;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '😮‍💨 冲出来了！' : '🔥 咳、咳咳……'}</h3><p>${ok ? (S.rescued ? '你一手拽着小桃，一头扎出了东门。两个人的脸，一个比一个黑。' : '你一头扎出了东门，脸黑得像刚从灶膛里爬出来。') : (why === 'smoke' ? '烟太大了。你看不清门在哪儿。' : '一根烧着的房梁，正正砸在你面前。')}</p><button class="btn pri tok">${ok ? '呼——' : '……'}</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, hits: S.hits, rescued: S.rescued, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) {
          S.time += dt; S.left -= dt; S.inv = Math.max(0, S.inv - dt);
          S.smoke = Math.min(100, S.smoke + smokeRate * dt);
          S.spawnT -= dt; S.waterT -= dt;
          if (S.spawnT <= 0 && S.left > travel * 0.6) { S.spawnT = every * (0.8 + Math.random() * 0.4); const l = Math.floor(Math.random() * 3); S.obs.push({ lane: l, k: 0, kind: Math.random() < 0.5 ? 'beam' : 'fire' }); if (S.time > 7 && Math.random() < 0.3) S.obs.push({ lane: (l + 1 + Math.floor(Math.random() * 2)) % 3, k: 0, kind: 'fire' }); }
          if (S.waterT <= 0 && S.left > travel) { S.waterT = 2.6 + Math.random(); const busy = S.obs.filter(o => o.k < 0.25).map(o => o.lane); const free = [0, 1, 2].filter(l => !busy.includes(l)); if (free.length) S.obs.push({ lane: free[Math.floor(Math.random() * free.length)], k: 0, kind: 'water' }); }
          if (!S.taoSpawned && S.time > dur * 0.4) { S.taoSpawned = true; const busy = S.obs.filter(o => o.k < 0.3).map(o => o.lane); const free = [0, 1, 2].filter(l => !busy.includes(l)); const l = free.length ? free[Math.floor(Math.random() * free.length)] : 0; S.obs = S.obs.filter(o => !(o.lane === l && o.k < 0.35)); S.obs.push({ lane: l, k: 0, kind: 'tao' }); msg('“小主——！救命啊——！”是小桃的声音！'); AU.sfx('buzz'); }
          S.obs.forEach(o => { o.k += dt / travel; if (!o.hit && !o.passed && o.k > 0.86 && o.k < 0.98 && o.lane === S.lane) {
              if (o.kind === 'water') { o.hit = true; S.smoke = Math.max(0, S.smoke - 35); AU.sfx('coin'); msg('🪣 哗——浓烟压下去了一截！'); }
              else if (o.kind === 'tao') { o.hit = true; S.rescued = true; AU.sfx('ding'); msg('🍑 你一把拽起小桃：“抓紧我！”'); }
              else if (S.inv <= 0) { o.hit = true; S.hits++; S.inv = 0.8; AU.sfx('buzz'); msg(o.kind === 'beam' ? '房梁擦着你的肩膀砸下来！' : '火苗燎着了你的裙角！'); if (S.hits >= lives) finish(false, 'hit'); } }
            if (o.k >= 0.98) { if (o.kind === 'tao' && !o.hit && !o.passed) msg('……小桃的声音被烟吞没了。（陆峥会去找她的！）'); o.passed = true; } });
          S.obs = S.obs.filter(o => o.k < 1.2);
          if ((t * 4 | 0) % 2) upd();
          if (S.smoke >= 100 && S.run) finish(false, 'smoke');
          if (S.left <= 0 && S.run) { S.left = 0; finish(true); }
        }
        S.px += (S.lane - S.px) * Math.min(1, dt * 14);
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#3a0e08'], [1, '#6a2a14']]); c.fillRect(0, 0, W, H);
        const lw = W / 3;
        for (let i = 0; i < 3; i++) { c.fillStyle = '#4a2a1e'; c.fillRect(i * lw + lw * 0.12, 0, lw * 0.76, H); c.fillStyle = 'rgba(255,160,80,0.08)'; for (let y = ((S.time * 140) % 70) - 70; y < H; y += 70) c.fillRect(i * lw + lw * 0.12, y, lw * 0.76, 3); }
        for (let i = 0; i < 6; i++) { const y = ((i * H / 5 + S.time * 140) % (H + 80)) - 40; A.flame(c, i % 2 ? W - 10 : 10, y + 30, Math.min(W, H) * 0.04, t, i); }
        const s = H / 700, rad = Math.min(lw * 0.3, H * 0.08);
        S.obs.forEach(o => { const x = (o.lane + 0.5) * lw, y = o.k * H * 0.95;
          if (o.kind === 'beam') { if (o.k < 0.5) { c.fillStyle = 'rgba(0,0,0,0.25)'; U.E(c, x, y + rad * 0.5, rad * 1.2, rad * 0.3); c.fill(); } A.beam(c, x, y - (o.k < 0.6 ? (0.6 - o.k) * H * 0.3 : 0), lw * 0.6, rad * 0.45, Math.sin(o.lane + o.k * 3) * 0.2); }
          else if (o.kind === 'fire') A.flame(c, x, y + rad * 0.4, rad * 0.8, t, o.lane);
          else if (o.kind === 'water') { if (!o.hit) A.bucket(c, x, y, rad * 0.7); }
          else if (o.kind === 'tao' && !o.hit) { A.drawChar(c, 'xiaotao', x, y + rad, s * 0.5, { t, face: 'cry', still: true }); c.fillStyle = '#fff'; c.font = `bold ${Math.round(rad * 0.45)}px sans-serif`; c.textAlign = 'center'; c.fillText('救我！', x, y - rad * 2.2); } });
        // 浓烟
        c.fillStyle = `rgba(40,30,30,${Math.min(0.75, S.smoke / 130)})`; c.fillRect(0, 0, W, H * (0.2 + S.smoke / 160));
        const blink = S.inv > 0 && (t * 12 | 0) % 2;
        if (!blink) { A.drawChar(c, 'me', (S.px + 0.5) * lw, H * 0.99, s * 0.6, { t, face: S.hits ? 'panic' : 'sweat' }); if (S.rescued) A.drawChar(c, 'xiaotao', (S.px + 0.5) * lw + lw * 0.28, H * 0.99, s * 0.5, { t, face: 'cry' }); }
        // 浓烟条
        U.rr(c, 10, H - 22, W * 0.3, 12, 6); U.F(c, 'rgba(0,0,0,0.4)'); U.rr(c, 10, H - 22, W * 0.3 * S.smoke / 100, 12, 6); U.F(c, S.smoke > 70 ? '#e04a3a' : '#c8a0a0');
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
