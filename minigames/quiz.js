/* 小游戏①：宫规问答（限时选择题，5 题，答对 3 题及格；失败 → No.004《宫规挂科》） */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO;
const POOL = [
  { q: '见到皇上，第一件事是？', a: ['跪下，低头，不可直视龙颜', '上前要个签名', '夸他一句“好帅”'], c: '龙颜不可直视！' },
  { q: '秀女在主子面前应当自称？', a: ['臣女', '本宫', '宝宝'], c: '“宝宝”？你想被拖出去吗？' },
  { q: '华贵妃的仪仗经过时，你应该？', a: ['退到路边，跪下回避', '抢在前面先走', '拍照留念'], c: '抢贵妃的道，等于抢阎王的号。' },
  { q: '皇上的名讳，能不能随便说、随便写？', a: ['不能，要避讳', '能，反正他听不见', '能，还能起个外号'], c: '犯讳可是大罪！' },
  { q: '走路时，裙摆应当？', a: ['步子小，裙摆不乱晃', '提起来跑，效率第一', '甩起来转圈圈'], c: '这里是皇宫，不是舞池。' },
  { q: '给嬷嬷奉茶，茶倒几分满？', a: ['七分', '十二分', '空杯，讲究意境'], c: '十二分？茶会自己溢出来哦。' },
  { q: '夜里宫门落锁以后？', a: ['不得随意走动', '翻墙出去吃夜宵', '上屋顶看月亮'], c: '屋顶的瓦，可是很滑的。' },
  { q: '别人送你东西，应当？', a: ['谨慎收下，先报备', '来者不拒，越多越好', '转手卖掉'], c: '后宫的礼物，都是带利息的。' },
  { q: '遇见御猫糯米，应当？', a: ['恭恭敬敬绕开', '追着撸', '抱回屋里养'], c: '那是太后的猫！而且……它会带你去奇怪的地方。' },
  { q: '在宫里，可以说“打工人”“绩效”这种词吗？', a: ['不可以，言语要合规矩', '可以，显得有文化', '可以，还要教大家说'], c: '会被当成中邪的。' },
  { q: '选秀殿上被问话，应当？', a: ['恭敬作答，不卑不亢', '讲个段子活跃气氛', '故意掉手帕引起注意'], c: '电视剧都是骗人的！' },
];
const Q = P.GAMES = P.GAMES || {};
Q.quiz = {
  state: null,
  play(G, st) {
    return new Promise(res => {
      const ov = document.querySelector('#gameOv'); ov.className = 'show quiz'; ov.innerHTML = '';
      AU.setMood('quiz');
      const pool = POOL.slice().sort(() => Math.random() - 0.5).slice(0, 5);
      const S = this.state = { i: 0, score: 0, total: pool.length, answer: -1, done: false, face: 'normal', timer: 0, limit: 12 };
      ov.innerHTML = `<div class="qwrap"><div class="qhead"><canvas class="qmama"></canvas><div class="qht"><b>宫规小测</b><span class="qprog"></span><div class="qbar"><i></i></div><span class="qscore"></span></div></div>
        <div class="qcard"><div class="qq"></div><div class="qopts"></div><div class="qfb"></div></div><div class="qtip">答对 3 题及格 · 每题 ${S.limit} 秒</div></div>`;
      const mcv = ov.querySelector('.qmama'); let alive = true, last = performance.now(), tt = 0;
      const loop = now => { if (!alive || !mcv.isConnected) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; tt += dt;
        const r = mcv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); if (mcv.width !== (r.width * d | 0)) { mcv.width = r.width * d | 0; mcv.height = r.height * d | 0; }
        const c = mcv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, r.width, r.height);
        A.drawChar(c, 'guimama', r.width / 2, r.height * 1.55, r.height / 230, { t: tt, face: S.face, noShadow: true, blink: (tt % 3) < 0.12 });
        if (S.running) { S.timer += dt; const k = Math.max(0, 1 - S.timer / S.limit); ov.querySelector('.qbar i').style.width = (k * 100) + '%'; ov.querySelector('.qbar').classList.toggle('low', k < 0.3); if (S.timer >= S.limit) pick(-1); }
        requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      const fb = ov.querySelector('.qfb');
      const show = () => {
        const it = pool[S.i]; const order = [0, 1, 2].sort(() => Math.random() - 0.5);
        S.answer = order.indexOf(0); S.timer = 0; S.running = true; S.face = 'normal';
        ov.querySelector('.qprog').textContent = `第 ${S.i + 1} / ${S.total} 题`; ov.querySelector('.qscore').textContent = `得分 ${S.score}`;
        ov.querySelector('.qq').textContent = it.q; fb.className = 'qfb'; fb.textContent = '';
        const box = ov.querySelector('.qopts'); box.innerHTML = '';
        order.forEach((oi, k) => { const b = document.createElement('button'); b.className = 'qopt'; b.dataset.k = k; b.innerHTML = `<em>${'甲乙丙'[k]}</em>${it.a[oi]}`; b.onclick = () => pick(k); box.appendChild(b); });
        ov.querySelector('.qcard').classList.remove('in'); void ov.offsetWidth; ov.querySelector('.qcard').classList.add('in');
      };
      const pick = k => {
        if (!S.running) return; S.running = false;
        const it = pool[S.i], ok = k === S.answer, btns = ov.querySelectorAll('.qopt');
        btns.forEach((b, j) => { b.disabled = true; if (j === S.answer) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
        if (ok) { S.score += 20; S.face = 'smile'; AU.sfx('ding'); fb.className = 'qfb on ok'; fb.innerHTML = '<b>对</b> 嗯，还算用功。'; }
        else { S.face = 'angry'; AU.sfx('buzz'); fb.className = 'qfb on bad'; fb.innerHTML = '<b>错</b> ' + (k < 0 ? '时间到！' : '') + it.c; }
        ov.querySelector('.qscore').textContent = `得分 ${S.score}`;
        setTimeout(() => { S.i++; if (S.i < S.total) show(); else finish(); }, ok ? 900 : 1500);
      };
      const finish = () => {
        S.done = true; const pass = S.score >= 60;
        S.face = pass ? 'smile' : 'angry';
        ov.querySelector('.qcard').innerHTML = `<div class="qres ${pass ? 'pass' : 'fail'}"><div class="qbig">${S.score}<small>分</small></div><div class="qstamp">${pass ? '及格' : '挂科'}</div><p>${pass ? (S.score === 100 ? '满分！桂嬷嬷的嘴角好像动了一下。' : '桂嬷嬷：“勉强过关。”') : '桂嬷嬷：“退回原籍。”'}</p><button class="btn pri qok">${pass ? '继续' : '……完了'}</button></div>`;
        AU.sfx(pass ? 'fanfare' : 'gong');
        ov.querySelector('.qok').onclick = () => { alive = false; ov.className = ''; ov.innerHTML = ''; this.state = null; res({ score: S.score, pass }); };
      };
      show();
    });
  },
};
})(window.PALACE = window.PALACE || {});
