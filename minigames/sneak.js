/* 小游戏：夜探卷宗库 —— “一二三木头人”。按住前进；小药童一回头（灯笼照过来）就松手，蹲在药柜后面别动。
   药童回头前会先“嗯？”一声，有提示。走到最里面那排药柜就算成功。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const MUTTER = ['（打哈欠）', '♪ 当归、黄芪、甘草……', '（揉眼睛）', '好困啊……', '♪ 一味川芎二钱半……', '（数药柜）'];
Q.sneak = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show sneak gp'; AU.setMood('danger');
      const dur = st.dur || 22, lives = st.lives || 2, need = st.need || 1;
      ov.innerHTML = `<div class="ghud"><b>🏮 夜探卷宗库</b><span class="ksc"></span></div><canvas class="kcv"></canvas>
        <div class="kmsg smsg">按住下面的按钮往前挪。药童一回头，马上松手！</div>
        <button class="btn pri kbtn">🤫 按住 · 往前挪</button>
        <div class="tintro"><div class="tbox"><h3>🤫 一、二、三，木头人</h3><p>小药童提着灯笼来回巡。<b>按住按钮</b>（或按住画面、空格键）往前挪；<br>听见他“<b>嗯？</b>”一声、要回头了——<b>立刻松手</b>，躲在药柜后面。</p><p class="terr">${dur} 秒内走到最里面的药柜。被灯笼照到 ${lives} 次就完了。</p><button class="btn pri tgo">屏住呼吸</button></div></div>`;
      const cv = ov.querySelector('.kcv'), ctx = cv.getContext('2d');
      const S = this.state = { prog: 0, walk: false, phase: 'away', ph: 2.2, left: dur, hits: 0, run: false, end: false, inv: 0, mut: MUTTER[0], time: 0 };
      let alive = true, last = performance.now();
      const upd = () => { const e = ov.querySelector('.ksc'); if (e) e.textContent = `剩余 ${Math.ceil(S.left)} 秒 · 进度 ${Math.round(S.prog * 100)}% · 被照到 ${S.hits}/${lives}`; };
      const msg = t => { const m = ov.querySelector('.kmsg'); if (m) m.textContent = t; };
      S.setWalk = b => { if (!S.run) { S.walk = false; return false; } S.walk = !!b; return true; };
      const btn = ov.querySelector('.kbtn');
      const on = e => { e.preventDefault(); e.stopPropagation(); S.setWalk(true); btn.classList.add('hit'); };
      const off = e => { if (e) e.preventDefault(); S.setWalk(false); btn.classList.remove('hit'); };
      btn.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => btn.addEventListener(k, off));
      cv.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(k => cv.addEventListener(k, off));
      btn.addEventListener('contextmenu', e => e.preventDefault());
      const kd = e => { if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); S.setWalk(true); } };
      const ku = e => { if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); S.setWalk(false); } };
      window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false; S.walk = false;
        window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${ok ? '😮‍💨 摸到了！' : '🏮 “谁在那儿？！”'}</h3><p>${ok ? '你蹲在最里面那排药柜后面，小药童打着哈欠走远了。' : (S.prog >= 1 ? '' : '灯笼的光，正正照在你脸上。小药童扯着嗓子喊来了巡夜的人。')}</p><button class="btn pri tok">${ok ? '开始翻找' : '……'}</button></div>`;
        ov.appendChild(box); AU.sfx(ok ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, hits: S.hits, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run) {
          S.time += dt; S.left -= dt; S.inv = Math.max(0, S.inv - dt); S.ph -= dt;
          if (S.ph <= 0) {
            if (S.phase === 'away') { S.phase = 'warn'; S.ph = 0.75; AU.sfx('pop'); msg('药童：“嗯？”——要回头了，松手！'); }
            else if (S.phase === 'warn') { S.phase = 'look'; S.ph = 1.1 + Math.random() * 0.8; }
            else { S.phase = 'away'; S.ph = 1.6 + Math.random() * 1.6; S.mut = MUTTER[Math.floor(Math.random() * MUTTER.length)]; msg('药童转回去了。走！'); }
          }
          if (S.walk) { S.prog = Math.min(1, S.prog + dt / 8.5); if (S.phase === 'look' && S.inv <= 0) { S.hits++; S.inv = 1.2; S.prog = Math.max(0, S.prog - 0.08); AU.sfx('buzz'); msg('被照到了！快缩回去！'); if (S.hits >= lives) finish(false); } }
          if (S.prog >= 1 && S.run) finish(true);
          if (S.left <= 0 && S.run) { S.left = 0; finish(false); }
          if ((t * 4 | 0) % 2) upd();
        }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#2a2018'], [1, '#4a3828']]); c.fillRect(0, 0, W, H);
        c.fillStyle = '#3a2a1e'; c.fillRect(0, H * 0.72, W, H * 0.28);
        // 药柜 ×5（远→近：右边是终点）
        const n = 5;
        for (let i = 0; i < n; i++) { const x = W * (0.1 + i * 0.19), cw = W * 0.12; U.rr(c, x - cw / 2, H * 0.2, cw, H * 0.54, 3); U.F(c, i === n - 1 ? '#7a5030' : '#6a4428', U.OL, 2.5);
          for (let j = 0; j < 5; j++) for (let k = 0; k < 2; k++) { U.rr(c, x - cw / 2 + 4 + k * (cw - 8) / 2, H * (0.22 + j * 0.1), (cw - 8) / 2 - 2, H * 0.09, 2); U.F(c, '#b8804a', '#5a3418', 1); U.E(c, x - cw / 2 + 4 + k * (cw - 8) / 2 + (cw - 8) / 4, H * (0.27 + j * 0.1), 2, 2); U.F(c, '#f2c24d'); } }
        A.txt(c, '🎯', W * 0.86, H * 0.15, Math.min(W, H) * 0.06, '#fff');
        // 药童（左侧）
        const bx = W * 0.06, look = S.phase === 'look', warn = S.phase === 'warn';
        if (look) { c.fillStyle = 'rgba(255,220,120,0.28)'; c.beginPath(); c.moveTo(bx + W * 0.04, H * 0.5); c.lineTo(W, H * 0.3); c.lineTo(W, H * 0.95); c.closePath(); c.fill(); }
        A.drawChar(c, 'taijian', bx, H * 0.98, H / 1250, { t, face: look ? 'angry' : warn ? 'think' : 'sleepy', still: true, flip: !(look || warn) });
        A.lantern(c, bx + W * 0.04, H * 0.52, H / 1400, t, true);
        const bub = warn ? '嗯？' : look ? '……' : S.mut;
        c.font = `bold ${Math.round(Math.max(12, H * 0.045))}px sans-serif`; const tw = c.measureText(bub).width;
        U.rr(c, bx - 6, H * 0.05, tw + 16, H * 0.08, 8); U.F(c, warn ? '#ffe08a' : '#fffaf0', U.OL, 2); c.fillStyle = U.OL; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(bub, bx + 2, H * 0.09); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
        // 我
        const px = W * (0.2 + S.prog * 0.66), blink = S.inv > 0 && (t * 12 | 0) % 2;
        const hide = !S.walk; const bob = S.walk ? Math.abs(Math.sin(t * 10)) * H * 0.01 : 0;
        if (!blink) A.drawChar(c, 'me', px, H * (hide ? 1.06 : 0.99) - bob, H / (hide ? 1300 : 1150), { t, face: S.hits ? 'panic' : (S.walk ? 'sweat' : 'normal'), still: !S.walk });
        if (hide && S.run) { c.fillStyle = 'rgba(0,0,0,0.25)'; U.E(c, px, H * 0.98, W * 0.05, H * 0.015); c.fill(); }
        // 进度条
        U.rr(c, W * 0.2, H * 0.94, W * 0.66, H * 0.025, 4); U.F(c, 'rgba(255,255,255,0.15)'); U.rr(c, W * 0.2, H * 0.94, W * 0.66 * S.prog, H * 0.025, 4); U.F(c, '#7ad07a');
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
