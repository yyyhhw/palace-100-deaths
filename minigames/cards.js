/* 小游戏：陪太后打叶子牌 —— 简化比大小。太后出一张，你从手里挑一张：大过她就赢。
   关键是“会放水”：一直赢，太后会觉得你“与佛有缘”。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const SUIT = ['🌸', '🍃', '🌙', '🐟'], NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function deal() { // 太后的牌在 3–7 之间；保证手里至少一张大、一张小
  const hou = rnd(3, 7); const hi = rnd(hou + 1, 9), lo = rnd(1, hou - 1), mid = rnd(1, 9);
  return { hou, hand: [hi, lo, mid].sort(() => Math.random() - 0.5) };
}
Q.cards = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show cards'; AU.setMood('quiz');
      const rounds = st.rounds || 5;
      ov.innerHTML = `<div class="ghud"><b>🀄 叶子牌 · 慈宁宫</b><span class="csc"></span></div><canvas class="ccv"></canvas>
        <div class="cmsg"></div><div class="chand"></div>
        <div class="tintro"><div class="tbox"><h3>🀄 陪太后打叶子牌</h3><p>太后先出一张牌，你从手里挑一张：<b>比她大就赢</b>，一样大算太后赢。<br>一共 ${rounds} 局。</p><p class="terr">（嬷嬷悄悄提醒：太后打牌，图的是开心。）</p><button class="btn pri tgo">落座</button></div></div>`;
      const cv = ov.querySelector('.ccv'), ctx = cv.getContext('2d');
      const S = this.state = { round: 0, rounds, wins: 0, losses: 0, streak: 0, hou: 0, hand: [], run: false, face: 'smile', said: '', played: null, end: false };
      let alive = true;
      const say = (txt, face) => { S.said = txt; S.face = face || 'smile'; const m = ov.querySelector('.cmsg'); if (m) m.innerHTML = `<b>太后：</b>${txt}`; };
      const card = (v, i, cls) => `<button class="btn ccard ${cls || ''}" data-i="${i}"><i>${SUIT[(v + i) % 4]}</i><b>${NUM[v]}</b><small>${v}</small></button>`;
      const upd = () => { const e = ov.querySelector('.csc'); if (e) e.textContent = `第 ${Math.min(S.round + 1, rounds)}/${rounds} 局 · 你赢 ${S.wins} · 太后赢 ${S.losses}`;
        const h = ov.querySelector('.chand'); if (h) { h.innerHTML = S.hand.map((v, i) => card(v, i)).join(''); h.querySelectorAll('.ccard').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); S.pick(+b.dataset.i); })); } };
      const next = () => {
        if (S.round >= rounds) return finish();
        const d = deal(); S.hou = d.hou; S.hand = d.hand; S.played = null; S.run = true;
        say(['哀家出这张。该你了。', '嗯……这张如何？', '哀家年轻时，可是叶子牌的好手。', '来来来，别让着哀家。', '最后一局了，好好打。'][S.round] || '该你了。', 'smile'); upd();
      };
      S.pick = i => {
        if (!S.run || S.hand[i] == null) return false; S.run = false;
        const v = S.hand[i]; S.played = v; const win = v > S.hou;
        if (win) { S.wins++; S.streak++; AU.sfx('coin'); } else { S.losses++; S.streak = 0; AU.sfx('page'); }
        const W = [['哎哟，你这丫头手气不错。', 'smile'], ['又是你赢？呵呵……', 'think'], ['……连赢三局了啊。', 'think'], ['哀家看你……与佛有缘。', 'angry'], ['', 'angry']];
        const L = [['哈哈，哀家赢了！', 'smile'], ['承让承让~', 'smile'], ['这牌打得，哀家喜欢。', 'smile']];
        if (win) say(W[Math.min(S.streak - 1, 3)][0], W[Math.min(S.streak - 1, 3)][1]); else say(L[S.losses % 3][0], 'smile');
        S.round++; upd();
        const h = ov.querySelector('.chand'); if (h) h.innerHTML = `<div class="cres ${win ? 'w' : 'l'}">你出了「${NUM[v]}」${win ? ' > ' : ' ≤ '}太后的「${NUM[S.hou]}」 · ${win ? '你赢' : '太后赢'}</div><button class="btn pri cnext">${S.round >= rounds ? '收牌' : '下一局'}</button>`;
        const nb = ov.querySelector('.cnext'); if (nb) nb.onclick = e => { e.stopPropagation(); next(); };
        return true;
      };
      const finish = () => {
        if (S.end) return; S.end = true; S.run = false;
        const sweep = S.wins >= rounds, happy = S.losses >= 1 && S.wins >= 1;
        const box = document.createElement('div'); box.className = 'tintro';
        box.innerHTML = `<div class="tbox"><h3>${sweep ? '😇 全赢了……' : happy ? '🀄 宾主尽欢' : '🀄 输光光'}</h3><p>${sweep ? '太后放下牌，慈祥地看着你：“哀家看你，与佛有缘。”' : happy ? `你赢 ${S.wins} 局、输 ${S.losses} 局。太后笑得很开心。` : '你一局都没赢。太后赢得很开心，但好像也看出来你在放水。'}</p><button class="btn pri tok">起身</button></div>`;
        ov.appendChild(box); AU.sfx(sweep ? 'gong' : 'fanfare');
        box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ wins: S.wins, losses: S.losses, sweep, happy, death: sweep && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); AU.sfx('select'); next(); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const t = now / 1000, d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        c.fillStyle = U.lg(c, 0, 0, 0, H, [[0, '#f3e2c4'], [1, '#d9b98a']]); c.fillRect(0, 0, W, H);
        c.fillStyle = '#7a4a2a'; c.fillRect(0, H * 0.78, W, H * 0.22);
        A.drawChar(c, 'taihou', W * 0.3, H * 1.02, H / 520, { t, face: S.face, pose: 'beads', prop: 'beads' });
        if (S.hou) { const cw = Math.min(W * 0.16, H * 0.36), ch = cw * 1.5, x = W * 0.68, y = H * 0.44; c.save(); c.translate(x, y); c.rotate(Math.sin(t) * 0.03); U.rr(c, -cw / 2, -ch / 2, cw, ch, 8); U.F(c, '#fffaf0', '#8a1f2b', 3);
          c.fillStyle = '#8a1f2b'; c.font = `bold ${Math.round(cw * 0.5)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NUM[S.hou], 0, 0); c.font = `${Math.round(cw * 0.22)}px sans-serif`; c.fillText(SUIT[S.hou % 4], 0, -ch * 0.33); c.restore();
          c.fillStyle = '#5a3a2a'; c.font = `bold ${Math.round(H * 0.07)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.fillText('太后出牌', x, y + ch / 2 + H * 0.07); }
        if (S.played) { const cw = Math.min(W * 0.12, H * 0.28), x = W * 0.88, y = H * 0.5; U.rr(c, x - cw / 2, y - cw * 0.75, cw, cw * 1.5, 6); U.F(c, '#fff', '#2a3a6a', 3); c.fillStyle = '#2a3a6a'; c.font = `bold ${Math.round(cw * 0.5)}px "Noto Serif CJK SC",serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NUM[S.played], x, y); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
