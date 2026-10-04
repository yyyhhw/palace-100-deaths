/* 小游戏：排座次 —— 百日宴主桌两边六个位子，六位客人。按太后的规矩排好，谁也不得罪，还得盯住宁嫔的酒壶。
   先点名字，再点座位；点已坐好的位子可以把人请回去。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const SEATS = ['左一', '左二', '左三', '右一', '右二', '右三'];
const PEOPLE = [['huanghou', '皇后'], ['guifei', '贵妃'], ['ningpin', '宁嫔'], ['jingtaifei', '静太妃'], ['lizhaoyi', '丽昭仪'], ['me', '你']];
const ANSWER = { huanghou: '左一', jingtaifei: '左二', me: '左三', guifei: '右一', lizhaoyi: '右二', ningpin: '右三' };
const side = s => s[0], idx = s => SEATS.indexOf(s) % 3;
const adj = (a, b) => a && b && side(a) === side(b) && Math.abs(idx(a) - idx(b)) === 1;
const facing = (a, b) => a && b && side(a) !== side(b) && idx(a) === idx(b);
const RULES = [
  { t: '皇后坐<b>左一</b>——那是尊位，谁抢谁倒霉。', ok: m => m.huanghou === '左一' },
  { t: '贵妃要和皇后<b>面对面</b>坐，谁也不比谁低。', ok: m => facing(m.guifei, m.huanghou) },
  { t: '宁嫔坐<b>右三</b>：靠门，陆峥一抬眼就能看见她。', ok: m => m.ningpin === '右三' },
  { t: '你要坐在宁嫔<b>正对面</b>，好盯住她的酒壶。', ok: m => facing(m.me, m.ningpin) },
  { t: '静太妃是证人，要<b>挨着你</b>坐（同一边、相邻）。', ok: m => adj(m.jingtaifei, m.me) },
  { t: '丽昭仪要<b>挨着宁嫔</b>——她俩是牌搭子，分开了要闹。', ok: m => adj(m.lizhaoyi, m.ningpin) },
];
Q.zuoci = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show zuoci gp'; AU.setMood('mystery');
      const tries = st.tries || 3;
      const order = RULES.map((r, i) => i).sort(() => Math.random() - 0.5);
      ov.innerHTML = `<div class="ghud"><b>🪑 排座次</b><span class="zsc"></span></div><canvas class="zcv"></canvas>
        <div class="zrules">${order.map(i => `<p data-r="${i}">· ${RULES[i].t}</p>`).join('')}</div>
        <div class="zmsg smsg">先点一个名字，再点一个座位。</div>
        <div class="zpeople">${PEOPLE.map(([id, n]) => `<button class="btn zp" data-id="${id}">${n}</button>`).join('')}</div>
        <div class="zseats">${SEATS.map(s => `<button class="btn zs" data-s="${s}"><i>${s}</i><b>空</b></button>`).join('')}</div>
        <button class="btn pri zgo">✅ 排好了，请太后过目</button>
        <div class="tintro"><div class="tbox"><h3>🪑 百日宴 · 排座次</h3><p>太后：“主桌两边六个位子，你来排。<br>排错一个，明天就有人当场翻脸。”</p><p class="terr">按六条规矩把六个人排好。太后最多看 ${tries} 次。</p><button class="btn pri tgo">（接过座次图）</button></div></div>`;
      const cv = ov.querySelector('.zcv'), ctx = cv.getContext('2d');
      const S = this.state = { map: {}, sel: null, checks: 0, run: false, end: false, bad: [] };
      let alive = true, last = performance.now();
      const nm = id => (PEOPLE.find(p => p[0] === id) || [])[1];
      const msg = t => { const m = ov.querySelector('.zmsg'); if (m) m.innerHTML = t; };
      const upd = () => { const e = ov.querySelector('.zsc'); if (e) e.textContent = `已排 ${Object.keys(S.map).length}/6 · 太后还能看 ${tries - S.checks} 次`;
        ov.querySelectorAll('.zp').forEach(b => { b.classList.toggle('on', S.sel === b.dataset.id); b.classList.toggle('placed', !!S.map[b.dataset.id]); });
        ov.querySelectorAll('.zs').forEach(b => { const who = Object.keys(S.map).find(k => S.map[k] === b.dataset.s); b.querySelector('b').textContent = who ? nm(who) : '空'; b.classList.toggle('full', !!who); });
        ov.querySelectorAll('.zrules p').forEach(p => p.classList.toggle('bad', S.bad.includes(+p.dataset.r))); };
      S.select = id => { if (!S.run) return false; S.sel = S.sel === id ? null : id; AU.sfx('tap'); upd(); return true; };
      S.seat = s => { if (!S.run) return false; const who = Object.keys(S.map).find(k => S.map[k] === s);
        if (!S.sel) { if (who) { delete S.map[who]; AU.sfx('tap'); upd(); } return true; }
        if (who && who !== S.sel) { if (S.map[S.sel]) S.map[who] = S.map[S.sel]; else delete S.map[who]; }
        S.map[S.sel] = s; S.sel = null; AU.sfx('pop'); upd(); return true; };
      S.assign = (id, s) => { S.sel = id; return S.seat(s); };
      S.check = () => {
        if (!S.run) return false;
        if (Object.keys(S.map).length < 6) { msg('还有人没座位呢——总不能让谁站着吃。'); AU.sfx('buzz'); return true; }
        S.checks++; S.bad = RULES.map((r, i) => r.ok(S.map) ? -1 : i).filter(i => i >= 0); upd();
        if (!S.bad.length) { finish(true); return true; }
        AU.sfx('buzz');
        if (S.checks >= tries) { finish(false); return true; }
        msg(`太后的佛珠停了：“不对。”（标红的规矩没满足，还能再看 ${tries - S.checks} 次）`); return true;
      };
      ov.querySelectorAll('.zp').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); S.select(b.dataset.id); }));
      ov.querySelectorAll('.zs').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); S.seat(b.dataset.s); }));
      ov.querySelector('.zgo').addEventListener('click', e => { e.stopPropagation(); S.check(); });
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false;
        const b = document.createElement('div'); b.className = 'tintro';
        b.innerHTML = `<div class="tbox"><h3>${ok ? '🎉 太后点头了！' : '😬 “……罢了，就这么着吧。”'}</h3><p>${ok ? '“皇后、贵妃面对面，宁嫔在门口，你盯着她——不错，有点哀家当年的样子。”' : '太后叹了口气，自己动手改了两个位子。明天，怕是有人要不痛快了。'}</p><button class="btn pri tok">${ok ? '谢太后！' : '……'}</button></div>`;
        ov.appendChild(b); AU.sfx(ok ? 'fanfare' : 'gong');
        b.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, checks: S.checks, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        last = now; const t = now / 1000;
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#a8322e'], [1, '#7a1e1a']]); c.fillRect(0, 0, W, H);
        const tw = W * 0.22, th = H * 0.7, tx = W / 2 - tw / 2, ty = H * 0.2;
        U.rr(c, tx, ty, tw, th, 10); U.F(c, '#8a3a1a', '#3a1a0a', 3);
        A.txt(c, '太后', W / 2, H * 0.1, Math.min(W, H) * 0.06, '#ffe08a'); A.txt(c, '皇上', W / 2, H * 0.16, Math.min(W, H) * 0.04, '#ffe08a');
        A.txt(c, '门 ▼ 陆峥', W * 0.82, H * 0.96, Math.min(W, H) * 0.04, '#fff');
        SEATS.forEach((s, i) => { const L = i < 3, k = i % 3, x = L ? tx - W * 0.12 : tx + tw + W * 0.12, y = ty + th * (0.18 + k * 0.32);
          const who = Object.keys(S.map).find(q => S.map[q] === s);
          U.E(c, x, y, Math.min(W, H) * 0.09, Math.min(W, H) * 0.09); U.F(c, who ? '#fff3c4' : 'rgba(255,255,255,0.18)', '#3a1a0a', 2);
          if (who) { const sc = Math.min(W, H) / 1500; A.drawChar(c, who, x, y + Math.min(W, H) * 0.08, sc, { t, face: S.bad.length && !S.end ? 'sweat' : 'smile', still: true, noShadow: true }); }
          A.txt(c, s, x, y - Math.min(W, H) * 0.11, Math.min(W, H) * 0.035, '#ffe08a'); });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
Q.zuoci.ANSWER = ANSWER; Q.zuoci.RULES = RULES;
})(window.PALACE = window.PALACE || {});
