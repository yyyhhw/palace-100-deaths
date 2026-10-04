/* 小游戏：举证推理 —— 温尚书和宁嫔一句一句地抵赖，你从袖子里挑出对应的证据卡，把五环证据链扣上。
   出错 3 次 → 证据不足（080）；拿出“上一世”的东西 → 妖女坐实（081）。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const CLAIMS = [
  { who: 'wenshang', q: '“先帝是头风病逝！太医院有脉案为证，白纸黑字！”', ok: '旧案卷宗', react: '脉案上“疑为外毒”四个字被人涂黑了——可对着烛光，墨底下的字还看得清清楚楚。' },
  { who: 'wenshang', q: '“醉心花？那是西域的毒草，温府清清白白，从不经手！”', ok: '西域账本', react: '账本翻开：温府商队每月一车“胭脂”，收货人，永和宫王福。温尚书的帽翅抖了一下。' },
  { who: 'ningpin', q: '“巫蛊娃娃的布料，宫里谁都弄得到，凭什么赖在本宫头上？”', ok: '永和宫布料', react: '云纹软烟罗，内务府的册子上写着：今年只赏了永和宫一匹。' },
  { who: 'ningpin', q: '“翠缕是长春宫的丫头。她做的事，与本宫何干？”', ok: '翠缕证词', react: '翠缕跪在殿下，声音发抖，却一个字一个字说清楚了：逼她的人，是永和宫。' },
  { who: 'wenshang', q: '“三年前{姓}家的巫蛊案，是先帝亲断的铁案！人证物证俱在！”', ok: '静太妃证词', react: '静太妃拄着锄头……不，拐杖，走进殿来：“那只娃娃，是温府的管家亲手放进书房的。老身就站在窗外。”' },
];
const DECOY = {
  '桂花糕': '皇上把桂花糕接了过去，咬了一口：“……这个朕收下了。但它不是证据。”',
  '小鱼干': '糯米从房梁上跳下来，叼走了小鱼干。满殿寂静。宁嫔笑出了声。',
  '太后的回礼·玉镯': '太后轻轻咳了一声：“丫头，那是哀家送你的镯子。”',
};
Q.juzheng = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show juzheng gp'; AU.setMood('danger');
      const maxStrike = st.strikes || 3;
      const have = Object.keys(G.run.items).filter(k => k.startsWith('证据卡·') && G.run.items[k] > 0).map(k => k.slice(4));
      const cards = have.map(n => ({ n, kind: 'ev' })).concat(Object.keys(DECOY).filter(k => k !== '太后的回礼·玉镯' || (G.run.items[k] || 0) > 0).map(n => ({ n, kind: 'decoy' })));
      if (Object.keys(G.meta.mems || {}).length >= 10) cards.push({ n: '🔮 上一世的记忆', kind: 'trap' });
      cards.sort(() => Math.random() - 0.5);
      ov.innerHTML = `<div class="ghud"><b>📜 举证</b><span class="jzsc"></span></div><canvas class="jzcv"></canvas>
        <div class="jzq smsg"></div><div class="jzcards"></div>
        <div class="tintro"><div class="tbox"><h3>📜 当殿举证</h3><p>温尚书和宁嫔会一句一句地抵赖。<br>每一句，从你的袖子里挑出<b>能驳倒它的那张证据卡</b>。</p><p class="terr">挑错 ${maxStrike} 次就会被反咬“诬告”。<br>只用这一世拿到的证据——别拿“上辈子”的事出来说。</p><button class="btn pri tgo">（深吸一口气）</button></div></div>`;
      const cv = ov.querySelector('.jzcv'), ctx = cv.getContext('2d'), box = ov.querySelector('.jzcards');
      const S = this.state = { i: -1, strikes: 0, run: false, end: false, claim: null, cards, linked: 0, face: 'normal', shake: 0, busy: false };
      let alive = true, last = performance.now();
      const upd = () => { const e = ov.querySelector('.jzsc'); if (e) e.textContent = `证据链 ${S.linked}/${CLAIMS.length} · 失误 ${S.strikes}/${maxStrike}`; };
      const msg = h => { const m = ov.querySelector('.jzq'); if (m) m.innerHTML = h; };
      const nm = id => (A.CH[id] && A.CH[id].name) || id;
      const render = () => {
        box.innerHTML = S.cards.map((c, j) => `<button class="btn jzc ${c.kind}${c.used ? ' used' : ''}" data-j="${j}"${c.n === (S.claim && S.claim.ok) ? ' data-ok="1"' : ''}${c.used ? ' disabled' : ''}>${c.kind === 'ev' ? '📜 ' : c.kind === 'trap' ? '' : '🍡 '}${c.n}</button>`).join('');
        box.querySelectorAll('.jzc').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); S.pick(+b.dataset.j); }));
      };
      const next = () => {
        S.i++; if (S.i >= CLAIMS.length) return finish(true);
        S.claim = CLAIMS[S.i]; S.face = 'smirk'; S.busy = false;
        msg(`<b>${nm(S.claim.who)}</b>：${G.render(S.claim.q)}`); render(); upd(); AU.sfx('ding');
      };
      S.pick = j => {
        if (!S.run || S.busy) return false; const c = S.cards[j]; if (!c || c.used) return false;
        if (c.kind === 'trap') { S.busy = true; msg('你脱口而出：“三年前那个雨夜，温府管家穿着青布衫，左手提着灯笼——”<br><b>温尚书</b>：“……你那年才几岁？你怎么会知道？！”满殿哗然。'); AU.sfx('gong'); S.shake = 1; setTimeout(() => finish(false, 'trap'), 1600); return true; }
        if (c.n === S.claim.ok) { S.busy = true; c.used = true; S.linked++; S.face = 'shock'; msg('✅ ' + G.render(S.claim.react)); AU.sfx('stamp'); upd(); render(); box.querySelectorAll('.jzc').forEach(b => { b.disabled = true; }); setTimeout(() => { if (alive && S.run) next(); }, 1500); return true; }
        S.strikes++; S.shake = 0.6; AU.sfx('buzz');
        const lines = ['宁嫔掩着嘴笑：“妹妹这是……拿错了吧？”', '温尚书捋了捋胡子：“荒唐。”', '皇上皱了皱眉。'];
        msg(`❌ ${c.kind === 'decoy' ? (DECOY[c.n] || '这不是证据。') : '这张卡说的是另一件事。'}<br>${lines[(S.strikes - 1) % 3]}<br><small>再看一遍：<b>${nm(S.claim.who)}</b>：${G.render(S.claim.q)}</small>`);
        if (c.kind === 'decoy') c.used = true;
        render(); upd();
        if (S.strikes >= maxStrike) { S.busy = true; setTimeout(() => finish(false, 'strike'), 1200); }
        return true;
      };
      const finish = (ok, why) => {
        if (S.end) return; S.end = true; S.run = false;
        const b = document.createElement('div'); b.className = 'tintro';
        b.innerHTML = `<div class="tbox"><h3>${ok ? '⚖️ 证据链扣上了！' : why === 'trap' ? '😱 “妖女！”' : '😶 “证据呢？”'}</h3><p>${ok ? `五环证据，一环扣一环。温尚书张了张嘴，什么也没说出来。` : why === 'trap' ? '你说出了一件这一世的你不可能知道的事。' : '证据对不上。宁嫔慢慢站了起来：“皇上，她这是诬告。”'}</p><button class="btn pri tok">${ok ? '（看向宁嫔）' : '……'}</button></div>`;
        ov.appendChild(b); AU.sfx(ok ? 'fanfare' : 'gong');
        b.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, strikes: S.strikes, trap: why === 'trap', death: ok ? undefined : (why === 'trap' ? '081' : (st.failDeath || undefined)) }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); next(); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000; S.shake = Math.max(0, S.shake - dt * 2);
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0); c.save(); if (S.shake) c.translate((Math.random() - 0.5) * 10 * S.shake, 0);
        A.drawBG(c, 'bairiyan', W, H, t);
        const s = H / 560;
        A.drawChar(c, 'me', W * 0.2, H * 1.02, s, { t, face: S.strikes >= 2 ? 'sweat' : 'normal' });
        A.drawChar(c, 'wenshang', W * 0.66, H * 1.02, s * 0.95, { t, face: S.claim && S.claim.who === 'wenshang' ? S.face : 'normal' });
        A.drawChar(c, 'ningpin', W * 0.86, H * 1.02, s * 0.9, { t, face: S.claim && S.claim.who === 'ningpin' ? S.face : 'smile' });
        // 证据链
        for (let i = 0; i < CLAIMS.length; i++) { const x = W * (0.3 + i * 0.1), y = H * 0.12; c.lineWidth = Math.max(3, H * 0.012); c.strokeStyle = i < S.linked ? '#f2c24d' : 'rgba(255,255,255,0.3)'; c.beginPath(); c.ellipse(x, y, W * 0.04, H * 0.035, 0, 0, Math.PI * 2); c.stroke(); if (i < S.linked) A.util.sparkle(c, x, y - H * 0.04, 5 + Math.sin(t * 4 + i) * 2, '#fff'); }
        c.restore(); requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
Q.juzheng.CLAIMS = CLAIMS;
})(window.PALACE = window.PALACE || {});
