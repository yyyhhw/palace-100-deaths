/* 小游戏：永和宫奶茶铺 —— 按订单顺序加料，做出一杯“宫廷奶茶”。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const ING = [
  { k: 'tea', n: '红茶', e: '🍵', col: '#b5653a' }, { k: 'milk', n: '牛乳', e: '🥛', col: '#fff6ea' }, { k: 'pearl', n: '珍珠', e: '⚫', col: '#3a2418' },
  { k: 'honey', n: '蜂蜜', e: '🍯', col: '#f2c24d' }, { k: 'osm', n: '桂花', e: '🌼', col: '#ffd36b' }, { k: 'ice', n: '冰块', e: '🧊', col: '#cfeaff' },
];
const IM = {}; ING.forEach(g => { IM[g.k] = g; });
const CUST = [['xiaotao', '小桃'], ['taijian', '小太监'], ['cuilv', '翠缕'], ['xiaoan', '小安子'], ['guard', '侍卫大哥'], ['taijian', '另一个小太监']];
function makeOrder(n) { const base = ['tea', 'milk']; const extra = ['pearl', 'honey', 'osm', 'ice'].sort(() => Math.random() - 0.5).slice(0, n - 2); const o = base.concat(extra); if (Math.random() < 0.4) [o[0], o[1]] = [o[1], o[0]]; return o; }
Q.milktea = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show milktea'; AU.setMood('quiz');
      ov.innerHTML = `<div class="ghud"><b>🧋 永和宫奶茶铺</b><span class="msc"></span></div><canvas class="mcv"></canvas>
        <div class="mord"></div><div class="mpat"><i></i></div><div class="mbtnz">${ING.map(g => `<button class="btn ming" data-k="${g.k}"><span>${g.e}</span>${g.n}</button>`).join('')}</div>
        <div class="tintro"><div class="tbox"><h3>🧋 开张啦</h3><p>照着订单<b>按顺序</b>加料！加错一样，这杯就废了。<br>客人等久了会走哦。</p><p class="terr">（每杯 ${st.price || 30} 两银子）</p><button class="btn pri tgo">开门迎客</button></div></div>`;
      const cv = ov.querySelector('.mcv'), ctx = cv.getContext('2d');
      const total = st.customers || 4, pat = st.patience || 15;
      const S = this.state = { idx: 0, total, served: 0, ruined: 0, earned: 0, order: [], step: 0, cup: [], left: pat, run: false, mood: 'normal', flashT: 0, cust: null };
      let alive = true, last = performance.now();
      const upd = () => {
        ov.querySelector('.msc').textContent = `客人 ${Math.min(S.idx + 1, total)}/${total} · 卖出 ${S.served} 杯 · 💰${S.earned} 两`;
        ov.querySelector('.mord').innerHTML = '订单：' + S.order.map((k, j) => `<span class="mchip${j < S.step ? ' ok' : ''}${j === S.step ? ' nx' : ''}">${IM[k].e}${IM[k].n}</span>`).join('<em>→</em>');
      };
      const next = () => {
        if (S.idx >= total) return finish();
        S.order = makeOrder(S.idx < 1 ? 3 : 4); S.step = 0; S.cup = []; S.left = pat; S.mood = 'normal'; S.cust = CUST[(S.idx + (st.seed || 0)) % CUST.length]; upd();
      };
      const after = (ok) => {
        if (ok) { S.served++; S.earned += st.price || 30; S.mood = 'smile'; AU.sfx('coin'); } else { S.ruined++; S.mood = 'cry'; AU.sfx('spill'); }
        S.flashT = 0.9; S.run = false; upd();
        setTimeout(() => { if (!alive) return; S.idx++; S.run = true; next(); }, 900);
      };
      S.add = k => {
        if (!S.run || !IM[k]) return false;
        S.cup.push(k); AU.sfx('pop');
        if (S.order[S.step] !== k) { after(false); return true; }
        S.step++; upd(); if (S.step >= S.order.length) after(true); return true;
      };
      ov.querySelectorAll('.ming').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 150); S.add(b.dataset.k); }));
      const finish = () => {
        S.run = false;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${S.served ? '🧋 打烊！' : '😵 一杯都没卖出去'}</h3><p>卖出 ${S.served} 杯，赚了 <b>${S.earned}</b> 两银子。${S.ruined ? `<br>（做废了 ${S.ruined} 杯，小安子帮你喝掉了）` : ''}</p><button class="btn pri tok">收摊</button></div>`;
        ov.appendChild(box); AU.sfx(S.served ? 'fanfare' : 'gong');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ served: S.served, earned: S.earned, ruined: S.ruined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; next(); AU.sfx('select'); };
      const loop = now => {
        if (!alive) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (S.run && S.cust) { S.left -= dt; if (S.left <= 0) { S.left = 0; after(false); } }
        if (S.flashT > 0) S.flashT -= dt;
        const pb = ov.querySelector('.mpat i'); if (pb) { pb.style.width = (S.left / pat * 100) + '%'; pb.style.background = S.left < 5 ? '#e2577e' : '#7fb8a8'; }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0); const t = now / 1000;
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#fff1dc'], [1, '#f3d9b0']]); c.fillRect(0, 0, W, H);
        c.fillStyle = '#e0344a'; c.fillRect(0, 0, W, H * 0.1); for (let i = 0; i < W / 30; i++) { c.beginPath(); c.arc(i * 30 + 15, H * 0.1, 15, 0, Math.PI); c.fillStyle = i % 2 ? '#e0344a' : '#fff'; c.fill(); }
        c.fillStyle = '#a8743a'; c.fillRect(0, H * 0.78, W, H * 0.22);
        const s = H / 430;
        if (S.cust) A.drawChar(c, S.cust[0], W * 0.28, H * 0.98, s * 0.85, { t, face: S.mood === 'normal' ? (S.left < 5 ? 'sweat' : 'normal') : S.mood, still: false });
        if (S.cust) { c.font = `bold ${Math.round(H * 0.06)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.fillStyle = '#5a3a2a'; c.fillText(S.cust[1], W * 0.28, H * 0.2); }
        // 杯子
        const cx = W * 0.7, cb = H * 0.86, cw = Math.min(W * 0.18, H * 0.3), ch = cw * 1.5;
        c.save(); c.beginPath(); c.moveTo(cx - cw / 2, cb - ch); c.lineTo(cx + cw / 2, cb - ch); c.lineTo(cx + cw * 0.4, cb); c.lineTo(cx - cw * 0.4, cb); c.closePath(); c.clip();
        c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(cx - cw, cb - ch, cw * 2, ch);
        S.cup.forEach((k, j) => { const h = ch / 5; c.fillStyle = IM[k].col; c.fillRect(cx - cw, cb - (j + 1) * h, cw * 2, h + 1); if (k === 'pearl') for (let q = 0; q < 6; q++) { U.E(c, cx - cw * 0.3 + q * cw * 0.12, cb - j * h - h * 0.4, cw * 0.05, cw * 0.05); U.F(c, '#1a0f0a'); } });
        c.restore();
        c.beginPath(); c.moveTo(cx - cw / 2, cb - ch); c.lineTo(cx + cw / 2, cb - ch); c.lineTo(cx + cw * 0.4, cb); c.lineTo(cx - cw * 0.4, cb); c.closePath(); U.F(c, null, U.OL, 3);
        c.strokeStyle = '#e2577e'; c.lineWidth = cw * 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx + cw * 0.12, cb - ch * 0.6); c.lineTo(cx + cw * 0.3, cb - ch * 1.25); c.stroke();
        if (S.flashT > 0) { c.save(); c.globalAlpha = Math.min(1, S.flashT * 2); c.font = `bold ${Math.round(H * 0.1)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.lineWidth = 6; c.strokeStyle = '#fff'; const m = S.mood === 'smile' ? '好喝！+' + (st.price || 30) + '两' : '这……不对啊'; c.strokeText(m, W * 0.5, H * 0.45); c.fillStyle = S.mood === 'smile' ? '#3f9a7c' : '#c0392b'; c.fillText(m, W * 0.5, H * 0.45); c.restore(); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
