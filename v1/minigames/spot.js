/* 小游戏：观察验毒 —— 一排看起来一样的东西里，有一个不对劲（颜色、气泡、气味）。点出它。
   不靠银针（银针只验砒霜，见 M04）。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const KIND = {
  zongzi: { title: '🔍 哪个粽子不对劲？', item: '粽子', base: '#6fae5a', odd: '#7fa04a', intro: '宁嫔端来一盘粽子，说“随便挑”。<br>仔细看：<b>颜色、气泡、气味</b>，总有一个不一样。' },
  dessert: { title: '🔍 哪碟点心加了料？', item: '点心', base: '#f6e2b0', odd: '#c8c890', intro: '宁嫔的水榭茶会，八碟点心“随便挑”。<br>看<b>颜色、气泡、气味</b>——还有，<b>糯米</b>一直盯着哪一碟。' },
  wine: { title: '🔍 哪杯酒加了料？', item: '酒', base: '#e8b84a', odd: '#b8c84a', intro: '百日宴上，宁嫔那一桌敬来一排酒。<br>鸳鸯壶倒出来的酒，看<b>颜色、气泡、气味</b>——总有一杯不一样。' },
  incense: { title: '🔍 哪支香被换过？', item: '香', base: '#a8743a', odd: '#9a6a46', intro: '佛堂供桌上摆着一排新香。<br>其中一支被人动过手脚——<b>看颜色、看烟、闻气味</b>。' },
};
Q.spot = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const K = KIND[st.kind || 'zongzi'], n = st.n || 6, dur = st.dur || 15, tries = st.tries || 2;
      const ov = document.querySelector('#gameOv'); ov.className = 'show spot gp'; AU.setMood('mystery');
      const hint = st.kind === 'wine' && G.flag && G.flag('wineKnown') ? '🔍 温太医说过：鸳鸯壶倒出来的那一杯，颜色发暗、冒细泡、有股甜腻的怪味。' : G.mem && G.mem('M04') ? '🔮 你记得：银针不可靠，要靠眼睛和鼻子。' : '';
      ov.innerHTML = `<div class="ghud"><b>${K.title}</b><span class="ssc"></span></div><canvas class="scv"></canvas><div class="smsg">${hint || '点一下你觉得有问题的那个。'}</div>
        <div class="tintro"><div class="tbox"><h3>${K.title}</h3><p>${K.intro}</p><p class="terr">${dur} 秒内找出来，最多点错 ${tries - 1} 次。</p><button class="btn pri tgo">仔细看</button></div></div>`;
      const cv = ov.querySelector('.scv'), ctx = cv.getContext('2d');
      const cues0 = st.hard ? ['color', 'bubble', 'smell'].sort(() => Math.random() - 0.5).slice(0, 1) : ['color', 'bubble', 'smell'].sort(() => Math.random() - 0.5).slice(0, 2);
      const cues = (st.kind === 'dessert') ? cues0.concat(['cat']) : cues0;
      const S = this.state = { odd: Math.floor(Math.random() * n), n, left: dur, wrong: 0, run: false, end: false, cues, marks: {} };
      let alive = true, last = performance.now();
      const geo = () => { const r = cv.getBoundingClientRect(); const cols = r.width > r.height * 1.6 ? n : (n > 6 ? (r.height > r.width * 1.3 ? 2 : 4) : 3), rows = Math.ceil(n / cols); const cw = r.width / cols, ch = r.height / rows; return { r, cols, rows, cw, ch, rad: Math.min(cw, ch) * 0.3 }; };
      S.itemXY = i => { const { r, cols, cw, ch } = geo(); return { x: r.left + (i % cols + 0.5) * cw, y: r.top + (Math.floor(i / cols) + 0.5) * ch }; };
      const upd = () => { const e = ov.querySelector('.ssc'); if (e) e.textContent = `剩余 ${Math.ceil(S.left)} 秒 · 机会 ${tries - S.wrong}`; };
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false; S.marks[S.odd] = 'odd';
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '✨ 找到了！' : '😵 没看出来……'}</h3><p>${ok ? `第 ${S.odd + 1} 个${K.item}${cues.includes('color') ? '颜色发暗' : ''}${cues.includes('bubble') ? '、冒着细小的气泡' : ''}${cues.includes('smell') ? '、有股甜腻的怪味' : ''}${cues.includes('cat') ? '，糯米一直冲它炸毛' : ''}。你不动声色地避开了它。` : `有问题的是第 ${S.odd + 1} 个。可惜你没发现。`}</p><button class="btn pri tok">继续</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'ding' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      S.tap = i => {
        if (!S.run || i < 0 || i >= n || S.marks[i]) return false;
        if (i === S.odd) { S.marks[i] = 'odd'; finish(true); return true; }
        S.marks[i] = 'x'; S.wrong++; AU.sfx('buzz'); const m = ov.querySelector('.smsg'); if (m) m.textContent = '这个看起来没问题……再仔细看看。'; upd(); if (S.wrong >= tries) finish(false); return true;
      };
      cv.addEventListener('pointerdown', e => { e.preventDefault(); if (!S.run) return; let best = -1, bd = 1e9; for (let i = 0; i < n; i++) { const p = S.itemXY(i), dd = Math.hypot(p.x - e.clientX, p.y - e.clientY); if (dd < bd) { bd = dd; best = i; } } S.tap(best); });
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) { S.left -= dt; if ((t * 4 | 0) % 2) upd(); if (S.left <= 0) { S.left = 0; finish(false); } }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#fff6e6'], [1, '#efd9b4']]); c.fillRect(0, 0, W, H);
        const { cols, cw, ch, rad } = geo();
        for (let i = 0; i < n; i++) {
          const x = (i % cols + 0.5) * cw, y = (Math.floor(i / cols) + 0.5) * ch, odd = i === S.odd;
          U.E(c, x, y + rad * 0.8, rad * 1.2, rad * 0.32); U.F(c, '#fff', '#4a8fd0', 2);
          const col = odd && cues.includes('color') ? K.odd : K.base;
          if ((st.kind || 'zongzi') === 'zongzi') A.zongzi(c, x, y, rad, col);
          else if (st.kind === 'wine') { A.wineCup(c, x, y, rad * 0.85, col, t); }
          else if (st.kind === 'dessert') { A.dessert(c, x, y, rad * 0.9, i % 4); if (odd && cues.includes('color')) { U.E(c, x, y - rad * 0.2, rad * 0.75, rad * 0.5); U.F(c, 'rgba(110,130,60,0.38)'); }
            if (odd && cues.includes('cat') && (t % 3) < 1.4) { const cx2 = x + rad * 0.95, cy2 = y - rad * 0.95; U.E(c, cx2, cy2, rad * 0.28, rad * 0.24); U.F(c, '#fffaf2', U.OL, 1.5); [-1, 1].forEach(k => { c.beginPath(); c.moveTo(cx2 + k * rad * 0.22, cy2 - rad * 0.1); c.lineTo(cx2 + k * rad * 0.16, cy2 - rad * 0.36); c.lineTo(cx2 + k * rad * 0.04, cy2 - rad * 0.2); c.closePath(); U.F(c, '#fffaf2', U.OL, 1.5); }); c.fillStyle = U.OL; c.font = `bold ${Math.round(rad * 0.3)}px sans-serif`; c.fillText('!', cx2 + rad * 0.4, cy2 - rad * 0.3); } }
          else { U.rr(c, x - rad * 0.5, y + rad * 0.2, rad, rad * 0.5, 6); U.F(c, '#c99a3a', U.OL, 2); c.strokeStyle = col; c.lineWidth = Math.max(3, rad * 0.12); c.beginPath(); c.moveTo(x, y + rad * 0.2); c.lineTo(x, y - rad * 0.8); c.stroke(); E2(c, x, y - rad * 0.85, rad * 0.08, '#ff7a3a');
            c.globalAlpha = 0.5; c.strokeStyle = odd && cues.includes('smell') ? '#b06ad8' : '#ccc'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - rad * 0.9); c.quadraticCurveTo(x + Math.sin(t * 2 + i) * rad * 0.3, y - rad * 1.2, x + Math.sin(t * 1.5 + i) * rad * 0.2, y - rad * 1.5); c.stroke(); c.globalAlpha = 1; }
          if (odd && cues.includes('bubble')) for (let k = 0; k < 3; k++) { const ph = (t * 0.8 + k / 3) % 1; c.globalAlpha = 1 - ph; U.E(c, x + (k - 1) * rad * 0.3, y + rad * 0.4 - ph * rad * 0.9, rad * 0.06, rad * 0.06); U.F(c, 'rgba(255,255,255,0.6)', '#7a8a6a', 1); c.globalAlpha = 1; }
          if (odd && cues.includes('smell') && st.kind !== 'incense') { c.globalAlpha = 0.55 + Math.sin(t * 3) * 0.2; c.strokeStyle = '#b06ad8'; c.lineWidth = 2; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(x + (k ? 0.3 : -0.3) * rad, y - rad * 0.9); c.quadraticCurveTo(x + (k ? 0.5 : -0.1) * rad, y - rad * 1.2, x + (k ? 0.3 : -0.2) * rad, y - rad * 1.45); c.stroke(); } c.globalAlpha = 1; }
          c.fillStyle = '#5a3a2a'; c.font = `bold ${Math.round(rad * 0.35)}px sans-serif`; c.textAlign = 'center'; c.fillText(String(i + 1), x - rad * 1.05, y - rad * 0.7);
          if (S.marks[i] === 'x') { c.strokeStyle = 'rgba(192,57,43,0.8)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - rad * 0.6, y - rad * 0.6); c.lineTo(x + rad * 0.6, y + rad * 0.6); c.moveTo(x + rad * 0.6, y - rad * 0.6); c.lineTo(x - rad * 0.6, y + rad * 0.6); c.stroke(); }
          if (S.marks[i] === 'odd') { U.E(c, x, y, rad * 1.25, rad * 1.25); U.F(c, null, '#e0344a', 4); }
        }
        requestAnimationFrame(loop);
      };
      function E2(c, x, y, r, col) { U.E(c, x, y, r, r); U.F(c, col); }
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
