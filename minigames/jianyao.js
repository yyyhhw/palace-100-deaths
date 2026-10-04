/* 小游戏：盯着煎药 —— 三只药罐在灶上咕嘟。总有“路过”的手伸过来想换药材——点它（拍掉）！
   别拍小桃（粉袖子、拿蒲扇）——她是来帮你扇火的。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const SLEEVES = [['#5f6f8a', '“路过”的小太监'], ['#8a6a4a', '送柴的大叔？'], ['#3f7a62', '永和宫的袖子'], ['#7a4a6a', '不认识的宫女']];
Q.jianyao = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show jianyao gp'; AU.setMood('danger');
      const dur = st.dur || 24, maxSwap = st.maxSwap || 2;
      ov.innerHTML = `<div class="ghud"><b>🍵 盯着煎药</b><span class="jsc"></span></div><canvas class="jcv"></canvas>
        <div class="jmsg smsg">有手伸向药罐？点它！</div>
        <div class="tintro"><div class="tbox"><h3>🖐 拍掉那只手！</h3><p>三只药罐在灶上咕嘟。小厨房人来人往，总有手“顺路”伸过来往罐里加东西。<br><b>点那只手</b>把它拍回去！</p><p>⚠️ <b>粉袖子、拿蒲扇</b>的是小桃，她来帮你扇火——<b>别拍她</b>。</p><p class="terr">坚持 ${dur} 秒。被换掉 ${maxSwap} 罐，这药就不能喝了。</p><button class="btn pri tgo">撸起袖子</button></div></div>`;
      const cv = ov.querySelector('.jcv'), ctx = cv.getContext('2d');
      const S = this.state = { hands: [], left: dur, time: 0, swaps: 0, slaps: 0, slapTao: 0, run: false, end: false, spawnT: 1.0, bad: [0, 0, 0], fire: 1 };
      let alive = true, last = performance.now(), uid = 0;
      const geo = () => { const r = cv.getBoundingClientRect(); return { r, W: r.width, H: r.height }; };
      const potXY = i => { const { W, H } = geo(); return { x: W * (0.2 + i * 0.3), y: H * 0.62 }; };
      // 手：从 (sx,sy) 伸向 罐 i，k: 0→1 为伸到
      const handPos = h => { const p = potXY(h.pot), k = Math.min(1, h.k); return { x: h.sx + (p.x - h.sx) * k, y: h.sy + (p.y - h.sy - geo().H * 0.12) * k }; };
      S.handXY = h => { const r = geo().r, p = handPos(h); return { x: r.left + p.x, y: r.top + p.y }; };
      const upd = () => { const e = ov.querySelector('.jsc'); if (e) e.textContent = `剩余 ${Math.ceil(S.left)} 秒 · 拍掉 ${S.slaps} · 被换 ${S.swaps}/${maxSwap}`; };
      const msg = t => { const m = ov.querySelector('.jmsg'); if (m) m.textContent = t; };
      const spawn = () => {
        const { W, H } = geo(); const pot = Math.floor(Math.random() * 3); const side = Math.random() < 0.5 ? -1 : 1;
        const tao = S.time > 3 && Math.random() < 0.22 && !S.hands.some(h => h.tao);
        const sl = SLEEVES[Math.floor(Math.random() * SLEEVES.length)];
        S.hands.push({ id: ++uid, pot, k: 0, sx: side < 0 ? -W * 0.05 : W * 1.05, sy: H * (0.08 + Math.random() * 0.3), spd: 1 / (tao ? 2.2 : (2.0 - Math.min(0.6, S.time * 0.03))), tao, col: tao ? '#f3a6b8' : sl[0], who: tao ? '小桃' : sl[1], back: 0 });
      };
      S.slap = id => {
        const h = S.hands.find(x => x.id === id); if (!S.run || !h || h.back) return false;
        h.back = 1; AU.sfx(h.tao ? 'buzz' : 'pop');
        if (h.tao) { S.slapTao++; msg('小桃：“哎哟！小主，是奴婢呀……”（委屈地揉手）'); S.fire = Math.max(0.4, S.fire - 0.2); }
        else { S.slaps++; msg(['啪！' + h.who + '缩回去了。', '“哎呀我就是路过……”', '啪！手背红了一片。', '“这罐闻着香，我就看看……”'][S.slaps % 4]); }
        upd(); return true;
      };
      cv.addEventListener('pointerdown', e => { e.preventDefault(); if (!S.run) return; let best = null, bd = 1e9; S.hands.forEach(h => { if (h.back) return; const p = S.handXY(h), dd = Math.hypot(p.x - e.clientX, p.y - e.clientY); if (dd < bd) { bd = dd; best = h; } }); const { W, H } = geo(); if (best && bd < Math.max(60, Math.min(W, H) * 0.16)) S.slap(best.id); });
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '✨ 一罐都没让换！' : '😵 药被换了……'}</h3><p>${ok ? `你拍掉了 ${S.slaps} 只手${S.slapTao ? `，还误伤了小桃 ${S.slapTao} 次（她说不疼）` : ''}。三罐药，干干净净。` : `被换掉了 ${S.swaps} 罐。可你根本看不出来是哪罐。`}</p><button class="btn pri tok">${ok ? '端药' : '……喝吧'}</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, swaps: S.swaps, slapTao: S.slapTao, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const drawHand = (c, h, W, H, t) => {
        const p = handPos(h), ang = Math.atan2(p.y - h.sy, p.x - h.sx), L0 = Math.hypot(p.x - h.sx, p.y - h.sy), w = Math.min(W, H) * 0.055;
        c.save(); c.translate(h.sx, h.sy); c.rotate(ang);
        U.rr(c, -w, -w * 0.7, L0 + w * 0.2, w * 1.4, w * 0.5); U.F(c, h.col, U.OL, 2);
        if (h.tao) { A.util.flower(c, L0 * 0.5, 0, w * 0.4, '#fff', '#ffd36b'); }
        c.translate(L0, 0); U.E(c, w * 0.5, 0, w * 0.75, w * 0.65); U.F(c, '#ffe0c8', U.OL, 2);
        if (h.tao) { c.save(); c.translate(w * 1.2, 0); c.rotate(Math.sin(t * 10) * 0.4); U.E(c, w * 0.9, 0, w * 0.9, w * 0.8); U.F(c, '#e8d08a', '#8a6a2a', 2); c.restore(); }
        else { U.E(c, w * 1.3, 0, w * 0.35, w * 0.3); U.F(c, '#b06ad8', U.OL, 1.5); }
        c.restore();
      };
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) {
          S.time += dt; S.left -= dt; S.spawnT -= dt; S.fire = Math.min(1, S.fire + dt * 0.05);
          if (S.spawnT <= 0 && S.left > 1.5) { spawn(); S.spawnT = Math.max(0.75, 1.6 - S.time * 0.035) * (0.8 + Math.random() * 0.4); }
          S.hands.forEach(h => {
            if (h.back) { h.k -= dt * 2.5; return; }
            h.k += dt * h.spd;
            if (h.k >= 1) { if (h.tao) { h.back = 1; S.fire = 1; msg('小桃扇了扇火，火苗旺起来了~'); } else { h.back = 1; S.swaps++; S.bad[h.pot] = 1; AU.sfx('buzz'); msg(h.who + '往第 ' + (h.pot + 1) + ' 罐里丢了一把东西！'); upd(); if (S.swaps >= maxSwap) finish(false); } }
          });
          S.hands = S.hands.filter(h => !(h.back && h.k <= 0));
          if ((t * 4 | 0) % 2) upd();
          if (S.left <= 0 && S.run) { S.left = 0; finish(true); }
        }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#e9d8bc'], [1, '#c9ae86']]); c.fillRect(0, 0, W, H);
        // 灶台
        U.rr(c, W * 0.03, H * 0.7, W * 0.94, H * 0.28, 8); U.F(c, '#9a7a5a', U.OL, 3);
        for (let i = 0; i < 3; i++) { const p = potXY(i), rad = Math.min(W * 0.11, H * 0.16);
          U.rr(c, p.x - rad * 0.8, H * 0.78, rad * 1.6, H * 0.12, 6); U.F(c, '#3a2a20', U.OL, 2);
          for (let k = 0; k < 3; k++) { const fh = (0.5 + Math.sin(t * 12 + k * 2 + i) * 0.2) * S.fire; c.beginPath(); c.moveTo(p.x + (k - 1) * rad * 0.4 - rad * 0.15, H * 0.86); c.quadraticCurveTo(p.x + (k - 1) * rad * 0.4, H * 0.86 - rad * fh * 0.8, p.x + (k - 1) * rad * 0.4 + rad * 0.15, H * 0.86); U.F(c, k === 1 ? '#ffd36b' : '#ff7a3a'); }
          A.medPot(c, p.x, p.y, rad, S.bad[i] ? '#6a5a7a' : '#8a5a3a', t, true);
          c.fillStyle = '#5a3a2a'; c.font = `bold ${Math.round(rad * 0.4)}px sans-serif`; c.textAlign = 'center'; c.fillText(String(i + 1), p.x, p.y + rad * 0.45);
          if (S.bad[i]) A.txt(c, '✗', p.x + rad * 0.9, p.y - rad * 0.8, rad * 0.6, '#c0392b'); }
        S.hands.forEach(h => drawHand(c, h, W, H, t));
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
