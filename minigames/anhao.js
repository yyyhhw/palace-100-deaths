/* 小游戏：对暗号 —— 太后起个头（“那边”的歌和顺口溜），你接下一句。
   太后是 2008 年来的，所以她的“那边”，停在 2008 年。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
// [起头, 正确下一句, 宫里味的错误答案, 离谱的错误答案, 太后接对后的反应]
const POOL = [
  ['天王盖地虎', '宝塔镇河妖', '皇上万岁万万岁', '小鸡炖蘑菇', '这句哀家年轻时候，跟她对了一百遍。'],
  ['两只老虎，两只老虎', '跑得快，跑得快', '一只没有尾巴，一只没有耳朵', '御花园里吃白菜', '哀家给小皇子唱这个哄睡，他到现在都以为是宫里的童谣。'],
  ['天青色等烟雨', '而我在等你', '本宫在等皇上', '雨下整夜', '这首出来那年，哀家还在排队买 CD 呢。'],
  ['北京欢迎你', '为你开天辟地', '奉天承运皇帝诏曰', '欢迎你来喝奶茶', '开幕式……哀家就看到这一段。'],
  ['我爱你，爱着你', '就像老鼠爱大米', '就像皇上爱江山', '就像糯米爱小鱼干', '哈！这首当年满大街都是。'],
  ['葫芦娃，葫芦娃', '一根藤上七个瓜', '一棵树上七只鸦', '一个宫里七个妃', '七个瓜，哀家宫里那时候正好七个嫔妃，一个比一个能打。'],
  ['不是我不明白', '这世界变化快', '是本宫不想说', '是这道题太难', '变化快……可不是么。'],
  ['大河向东流哇', '天上的星星参北斗哇', '宫里的嫔妃往西走哇', '奈何桥上排长队哇', '嗨呀，这一嗓子，哀家憋了四十年。'],
  ['一闪一闪亮晶晶', '满天都是小星星', '观星台上全是灯', '玄机子的眼镜真亮', '玄机子那老头，就是被这首歌骗上观星台的。'],
  ['2002 年的第一场雪', '比以往时候来得更晚一些', '比御膳房的饭来得更早一些', '下在了冷宫的白菜上', '这首歌，哀家在 KTV 唱过三十遍。'],
];
Q.anhao = {
  state: null,
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show anhao gp'; AU.setMood('mystery');
      const rounds = st.rounds || 6, need = st.need || Math.max(1, rounds - 1), per = st.per || 10;
      const qs = POOL.slice().sort(() => Math.random() - 0.5).slice(0, rounds);
      const hint = G.mem && G.mem('M11') ? '🔮 你记得：太后会哼“两只老虎”和“天青色等烟雨”。' : '';
      ov.innerHTML = `<div class="ghud"><b>🎵 对暗号</b><span class="asc"></span></div><canvas class="acv"></canvas>
        <div class="amsg smsg">${hint || '太后起了个头……接下一句！'}</div><div class="aopts"></div>
        <div class="tintro"><div class="tbox"><h3>🎵 老乡见老乡</h3><p>太后会起个头——<b>“那边”</b>的歌，或者“那边”的顺口溜。<br>你从三句里挑出<b>正确的下一句</b>。</p><p class="terr">一共 ${rounds} 句，至少对上 ${need} 句。每句 ${per} 秒。</p><button class="btn pri tgo">清清嗓子</button></div></div>`;
      const cv = ov.querySelector('.acv'), ctx = cv.getContext('2d'), box = ov.querySelector('.aopts');
      const S = this.state = { i: -1, right: 0, wrong: 0, rounds, run: false, end: false, left: per, q: null, opts: [], answered: false, face: 'smile', say: '' };
      let alive = true, last = performance.now();
      const upd = () => { const e = ov.querySelector('.asc'); if (e) e.textContent = `第 ${Math.min(rounds, S.i + 1)}/${rounds} 句 · 对上 ${S.right} · 剩 ${Math.max(0, Math.ceil(S.left))} 秒`; };
      const msg = t => { const m = ov.querySelector('.amsg'); if (m) m.textContent = t; };
      const next = () => {
        S.i++; if (S.i >= rounds) return finish(S.right >= need);
        const q = qs[S.i]; S.q = q; S.answered = false; S.left = per; S.face = 'smile'; S.say = '♪ ' + q[0] + '——';
        S.opts = [{ t: q[1], ok: true }, { t: q[2] }, { t: q[3] }].sort(() => Math.random() - 0.5);
        box.innerHTML = S.opts.map((o, j) => `<button class="btn abtn" data-j="${j}"${o.ok ? ' data-ok="1"' : ''}>${o.t}</button>`).join('');
        box.querySelectorAll('.abtn').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); S.pick(+b.dataset.j); }));
        msg(S.i === 0 && hint ? hint : '太后：“' + q[0] + '——”'); AU.sfx('ding'); upd();
      };
      S.pick = j => {
        if (!S.run || S.answered) return false; S.answered = true; const o = S.opts[j];
        box.querySelectorAll('.abtn').forEach((b, k) => { b.disabled = true; if (S.opts[k].ok) b.classList.add('good'); else if (k === j) b.classList.add('bad'); });
        if (o && o.ok) { S.right++; S.face = 'star'; S.say = '♪ ' + S.q[1] + '！'; msg('太后：“' + S.q[4] + '”'); AU.sfx('coin'); }
        else { S.wrong++; S.face = 'shock'; S.say = o ? '……' + o.t + '？' : '……嗯？'; msg(o ? ['太后：“……你再说一遍？”', '太后：“这孩子，莫不是烧糊涂了。”', '太后的佛珠停了一下。'][S.wrong % 3] : '你张了张嘴，什么也没想起来。'); AU.sfx('buzz'); }
        upd(); setTimeout(() => { if (alive && S.run) next(); }, 1300); return true;
      };
      const finish = ok => {
        if (S.end) return; S.end = true; S.run = false;
        const b = document.createElement('div'); b.className = 'tintro';
        b.innerHTML = `<div class="tbox"><h3>${ok ? '🎉 对上了！' : '😶 “……这孩子，烧糊涂了。”'}</h3><p>${ok ? `${rounds} 句对上了 ${S.right} 句。太后手里的佛珠，啪嗒一声停了。` : `${rounds} 句只对上了 ${S.right} 句。太后慢慢收起了笑容。`}</p><button class="btn pri tok">${ok ? '……老乡？' : '……'}</button></div>`;
        ov.appendChild(b); AU.sfx(ok ? 'fanfare' : 'gong');
        b.querySelector('.tok').onclick = ev => { ev.stopPropagation(); alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ ok, right: S.right, rounds, death: !ok && st.failDeath ? st.failDeath : undefined }); };
      };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; AU.sfx('select'); next(); };
      upd();
      const loop = now => {
        if (!alive || !cv.isConnected) { alive = false; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (S.run && !S.answered) { S.left -= dt; if ((t * 4 | 0) % 2) upd(); if (S.left <= 0) S.pick(-1); }
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width, H = r.height;
        if (cv.width !== (W * d | 0) || cv.height !== (H * d | 0)) { cv.width = W * d | 0; cv.height = H * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0);
        A.BG.cining ? A.BG.cining(c, W, H) : (c.fillStyle = '#8a5a3a', c.fillRect(0, 0, W, H));
        c.fillStyle = 'rgba(40,20,10,0.25)'; c.fillRect(0, 0, W, H);
        const s = H / 820, tx = W * 0.3;
        A.drawChar(c, 'taihou', tx, H * 1.02, s, { t, face: S.face, talk: S.run && !S.answered && Math.sin(t * 18) > 0 });
        if (S.say) { const fs = Math.max(14, Math.min(W * 0.045, H * 0.07)); c.font = `bold ${fs}px sans-serif`; const tw = Math.min(W * 0.5, c.measureText(S.say).width);
          const bx = Math.min(W - tw - 30, tx + W * 0.1), by = H * 0.12; U.rr(c, bx, by, tw + 24, fs * 1.8, 12); U.F(c, '#fffaf0', U.OL, 2.5);
          c.beginPath(); c.moveTo(bx + 10, by + fs * 1.8); c.lineTo(bx - 10, by + fs * 2.6); c.lineTo(bx + 30, by + fs * 1.8); U.F(c, '#fffaf0', U.OL, 2.5); c.fillStyle = '#fffaf0'; c.fillRect(bx + 12, by + fs * 1.8 - 3, 16, 5);
          c.fillStyle = '#6b3f1c'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(S.say, bx + 12, by + fs * 0.9, W * 0.5); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; }
        for (let k = 0; k < 3; k++) { const ph = (t * 0.5 + k / 3) % 1; c.globalAlpha = 1 - ph; A.txt(c, k % 2 ? '♪' : '♫', tx + W * (0.12 + k * 0.05), H * (0.45 - ph * 0.25), Math.min(W, H) * 0.06, '#ffd36b'); } c.globalAlpha = 1;
        if (S.run && !S.answered) { U.rr(c, W * 0.05, H * 0.94, W * 0.9, H * 0.025, 4); U.F(c, 'rgba(255,255,255,0.3)'); U.rr(c, W * 0.05, H * 0.94, W * 0.9 * Math.max(0, S.left / per), H * 0.025, 4); U.F(c, S.left < 3 ? '#e04a4a' : '#7ad07a'); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  },
};
})(window.PALACE = window.PALACE || {});
