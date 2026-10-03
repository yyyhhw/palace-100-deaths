/* 小游戏：召见下棋（五子棋 9×9）——你执黑先行，三局。
   皇上棋力一般（简单模式会偶尔走神）；连赢三局 → No.031《棋逢对手》。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, U = A.util;
const Q = P.GAMES = P.GAMES || {};
const N = 9, DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
function lineScore(b, x, y, col) {
  let total = 0, five = false;
  for (const [dx, dy] of DIRS) {
    let cnt = 1, open = 0;
    for (const s of [1, -1]) { let i = 1; while (true) { const xx = x + dx * i * s, yy = y + dy * i * s; if (xx < 0 || yy < 0 || xx >= N || yy >= N) break; const v = b[yy * N + xx]; if (v === col) { cnt++; i++; continue; } if (v === 0) open++; break; } }
    if (cnt >= 5) { five = true; total += 100000; }
    else if (cnt === 4) total += open === 2 ? 12000 : open === 1 ? 1500 : 0;
    else if (cnt === 3) total += open === 2 ? 1200 : open === 1 ? 120 : 0;
    else if (cnt === 2) total += open === 2 ? 110 : open === 1 ? 12 : 0;
    else total += open;
  }
  return { total, five };
}
function bestMoves(b, col) {
  const opp = 3 - col, list = [];
  for (let i = 0; i < N * N; i++) { if (b[i]) continue; const x = i % N, y = i / N | 0;
    const a = lineScore(b, x, y, col).total, d = lineScore(b, x, y, opp).total;
    const center = 4 - Math.max(Math.abs(x - 4), Math.abs(y - 4));
    list.push({ i, s: a * 1.05 + d * 0.95 + center }); }
  list.sort((p, q) => q.s - p.s); return list;
}
function winAt(b, i) { const x = i % N, y = i / N | 0, col = b[i]; if (!col) return false;
  for (const [dx, dy] of DIRS) { let cnt = 1; for (const s of [1, -1]) { let k = 1; while (true) { const xx = x + dx * k * s, yy = y + dy * k * s; if (xx < 0 || yy < 0 || xx >= N || yy >= N || b[yy * N + xx] !== col) break; cnt++; k++; } } if (cnt >= 5) return true; }
  return false; }
Q.gomoku = {
  state: null,
  suggest() { const S = this.state; if (!S) return -1; const m = bestMoves(S.b, 1); return m.length ? m[0].i : -1; },
  play(G, st) {
    st = st || {};
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show gomoku'; AU.setMood('quiz');
      ov.innerHTML = `<div class="ghud"><b>♟️ 养心殿 · 五子棋</b><span class="gsc"></span></div><div class="gboard"><canvas class="gcv"></canvas></div>
        <div class="gfoot"><span class="gmsg"></span><button class="btn gcon">🏳️ 让皇上一局</button></div>
        <div class="tintro"><div class="tbox"><h3>♟️ 陪皇上下棋</h3><p>你执<b>黑子</b>先行，横竖斜<b>连成五子</b>就赢。<br>点棋盘落子。一共下三局。</p><p class="terr">（高公公小声提醒：皇上……不太喜欢输。）</p><button class="btn pri tgo">开局</button></div></div>`;
      const cv = ov.querySelector('.gcv'), ctx = cv.getContext('2d');
      const S = this.state = { b: new Array(N * N).fill(0), turn: 1, game: 1, games: st.games || 3, wins: 0, losses: 0, results: [], run: false, last: -1, busy: false, lastWin: null, slip: st.slip == null ? 0.4 : st.slip, msg: '' };
      let alive = true;
      const upd = () => { ov.querySelector('.gsc').textContent = `第 ${S.game}/${S.games} 局 · 你 ${S.wins} : ${S.losses} 皇上`; ov.querySelector('.gmsg').textContent = S.msg; };
      const geo = () => { const r = cv.getBoundingClientRect(); const pad = r.width * 0.07, step = (r.width - pad * 2) / (N - 1); return { r, pad, step }; };
      S.cellXY = i => { const { r, pad, step } = geo(); return { x: r.left + pad + (i % N) * step, y: r.top + pad + (i / N | 0) * step }; };
      const draw = () => {
        if (!alive) return;
        const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(), W = r.width;
        if (cv.width !== (W * d | 0)) { cv.width = W * d | 0; cv.height = W * d | 0; }
        const c = ctx; c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, W);
        const { pad, step } = geo(); const t = performance.now() / 1000;
        U.rr(c, 2, 2, W - 4, W - 4, 14); U.F(c, U.lg(c, 0, 0, W, W, [[0, '#f3cf8a'], [1, '#d9a85a']]), '#7a4a1a', 3);
        c.strokeStyle = 'rgba(90,50,20,0.75)'; c.lineWidth = 1.5;
        for (let k = 0; k < N; k++) { c.beginPath(); c.moveTo(pad, pad + k * step); c.lineTo(W - pad, pad + k * step); c.stroke(); c.beginPath(); c.moveTo(pad + k * step, pad); c.lineTo(pad + k * step, W - pad); c.stroke(); }
        [[2, 2], [6, 2], [4, 4], [2, 6], [6, 6]].forEach(([x, y]) => { U.E(c, pad + x * step, pad + y * step, 3.5, 3.5); U.F(c, '#5a3010'); });
        for (let i = 0; i < N * N; i++) { const v = S.b[i]; if (!v) continue; const x = pad + (i % N) * step, y = pad + (i / N | 0) * step, rr = step * 0.42;
          U.E(c, x + 2, y + 3, rr, rr); U.F(c, 'rgba(0,0,0,0.2)');
          U.E(c, x, y, rr, rr); U.F(c, v === 1 ? U.rg(c, x - rr * 0.3, y - rr * 0.3, 1, rr, [[0, '#6a6a7a'], [1, '#141420']]) : U.rg(c, x - rr * 0.3, y - rr * 0.3, 1, rr, [[0, '#ffffff'], [1, '#e6dcc8']]), '#2a1a1a', 1.5);
          if (v === 2) { U.E(c, x - rr * 0.32, y - rr * 0.05, rr * 0.08, rr * 0.08); U.F(c, '#3a2a2a'); U.E(c, x + rr * 0.32, y - rr * 0.05, rr * 0.08, rr * 0.08); U.F(c, '#3a2a2a'); c.strokeStyle = '#3a2a2a'; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y + rr * 0.15, rr * 0.18, 0.2, Math.PI - 0.2); c.stroke(); }
          if (i === S.last) { c.strokeStyle = '#e2577e'; c.lineWidth = 2.5; U.E(c, x, y, rr * 0.5 + Math.sin(t * 5) * 1.5, rr * 0.5 + Math.sin(t * 5) * 1.5); c.stroke(); } }
        if (S.lastWin) { c.strokeStyle = 'rgba(226,87,126,0.85)'; c.lineWidth = 5; c.lineCap = 'round'; const a = S.lastWin[0], b = S.lastWin[1]; c.beginPath(); c.moveTo(pad + (a % N) * step, pad + (a / N | 0) * step); c.lineTo(pad + (b % N) * step, pad + (b / N | 0) * step); c.stroke(); }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      const winLine = i => { const x = i % N, y = i / N | 0, col = S.b[i]; for (const [dx, dy] of DIRS) { let lo = 0, hi = 0; while (true) { const xx = x - dx * (lo + 1), yy = y - dy * (lo + 1); if (xx < 0 || yy < 0 || xx >= N || yy >= N || S.b[yy * N + xx] !== col) break; lo++; } while (true) { const xx = x + dx * (hi + 1), yy = y + dy * (hi + 1); if (xx < 0 || yy < 0 || xx >= N || yy >= N || S.b[yy * N + xx] !== col) break; hi++; } if (lo + hi + 1 >= 5) return [(y - dy * lo) * N + (x - dx * lo), (y + dy * hi) * N + (x + dx * hi)]; } return null; };
      const LINES_WIN = ['皇上：“……再来！”', '皇上：“朕刚才是在让你。”', '皇上把棋子捏得咔咔响。'];
      const LINES_LOSE = ['皇上：“哈哈哈！你也不过如此嘛！”', '皇上：“朕的棋艺，天下第一。”', '皇上龙颜大悦，多吃了一块桂花糕。'];
      const finishGame = (who) => { // who: 1 你赢 2 皇上赢 0 和
        S.run = false; S.results.push(who); if (who === 1) S.wins++; else if (who === 2) S.losses++;
        S.msg = who === 1 ? LINES_WIN[Math.min(2, S.wins - 1)] : who === 2 ? LINES_LOSE[Math.min(2, S.losses - 1)] : '和棋。皇上：“哼，算你识相。”';
        upd(); AU.sfx(who === 1 ? 'ding' : who === 2 ? 'fanfare' : 'tap');
        const last = S.game >= S.games;
        setTimeout(() => {
          if (!alive) return;
          const box = document.createElement('div'); box.className = 'tintro';
          box.innerHTML = `<div class="tbox"><h3>${who === 1 ? '⚫ 你赢了！' : who === 2 ? '⚪ 皇上赢了' : '🤝 和棋'}</h3><p>${S.msg}</p><button class="btn pri tok">${last ? '结束对弈' : '下一局'}</button></div>`;
          ov.appendChild(box);
          box.querySelector('.tok').onclick = ev => { ev.stopPropagation(); box.remove();
            if (last) { alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ wins: S.wins, losses: S.losses, results: S.results, sweep: S.wins >= S.games }); return; }
            S.game++; S.b.fill(0); S.last = -1; S.lastWin = null; S.turn = 1; S.msg = '你先手。'; S.run = true; upd(); };
        }, 700);
      };
      const place = (i, col) => { S.b[i] = col; S.last = i; AU.sfx('tap'); if (winAt(S.b, i)) { S.lastWin = winLine(i); finishGame(col); return true; } if (S.b.every(v => v)) { finishGame(0); return true; } return false; };
      const aiMove = () => {
        const list = bestMoves(S.b, 2); if (!list.length) return;
        let pick = list[0];
        const urgent = pick.s >= 90000; // 能直接赢就赢
        if (!urgent && Math.random() < S.slip) pick = list[Math.min(list.length - 1, 1 + (Math.random() * 4 | 0))]; // 皇上走神
        place(pick.i, 2); S.turn = 1; S.busy = false; if (S.run) { S.msg = ['皇上：“该你了。”', '皇上捻着胡子（并没有胡子）。', '皇上：“这步妙吧？”'][Math.random() * 3 | 0]; upd(); }
      };
      S.tap = i => {
        if (!S.run || S.busy || S.turn !== 1 || i < 0 || S.b[i]) return false;
        if (place(i, 1)) return true;
        S.turn = 2; S.busy = true; S.msg = '皇上思考中……'; upd();
        setTimeout(() => { if (alive && S.run) aiMove(); else S.busy = false; }, st.aiDelay || 420);
        return true;
      };
      cv.addEventListener('pointerdown', e => { e.preventDefault(); const { r, pad, step } = geo(); const x = Math.round((e.clientX - r.left - pad) / step), y = Math.round((e.clientY - r.top - pad) / step); if (x < 0 || y < 0 || x >= N || y >= N) return; S.tap(y * N + x); });
      ov.querySelector('.gcon').onclick = e => { e.stopPropagation(); if (!S.run || S.busy) return; S.lastWin = null; finishGame(2); };
      ov.querySelector('.tgo').onclick = e => { e.stopPropagation(); ov.querySelector('.tintro').remove(); S.run = true; S.msg = '你先手。'; upd(); AU.sfx('select'); };
      upd();
    });
  },
};
})(window.PALACE = window.PALACE || {});
