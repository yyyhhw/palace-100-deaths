/* ui.js —— 界面层：对话气泡 / 选项 / HUD / 过场 / 命名 / 死法卡 / 奈何桥 / 图鉴 / 设置 / 标题 / 章末 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO, G = P.G;
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const UI = P.UI = {};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function show(id) { const e = $(id); e.classList.add('show'); return e; }
function hide(id) { const e = $(id); if (e) e.classList.remove('show'); return e; }
UI.isOpen = id => $(id).classList.contains('show');

/* ---------- 初始化 ---------- */
UI.init = function () {
  const first = () => { AU.unlock(); primeSpeech(); };
  document.addEventListener('pointerdown', first, { capture: true });
  document.addEventListener('keydown', first, { capture: true }); document.addEventListener('touchend', first, { capture: true });
  $('#tapLayer').addEventListener('click', () => UI.advance());
  $('#dlg').addEventListener('click', () => UI.advance());
  document.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !document.activeElement.matches('input') && !popupOpen()) { if (!$('#choices').children.length) UI.advance(); } });
  $('#btnMenu').onclick = e => { e.stopPropagation(); AU.sfx('tap'); UI.menu(); };
  $('#btnSkip').onclick = e => { e.stopPropagation(); if (UI.skip) UI.stopSkip(); else { AU.sfx('tap'); UI.startSkip(false); } };
  $('#btnAuto').onclick = e => { e.stopPropagation(); AU.sfx('tap'); UI.setAuto(!UI.auto); };
  // 长按（触屏/鼠标）临时快进；桌面 Ctrl 键按住快进
  let holdT = null, held = false;
  const holdStart = e => { if (e.button > 0) return; clearTimeout(holdT); held = false; holdT = setTimeout(() => { held = true; UI.startSkip(true); }, 450); };
  const holdEnd = () => { clearTimeout(holdT); if (held && UI.skipHold) UI.stopSkip(true); };
  ['#tapLayer', '#dlg'].forEach(id => { const n = $(id); n.addEventListener('pointerdown', holdStart); n.addEventListener('pointerup', holdEnd); n.addEventListener('pointercancel', holdEnd); n.addEventListener('pointerleave', holdEnd);
    n.addEventListener('click', e => { if (held) { e.stopImmediatePropagation(); held = false; } }, true); n.addEventListener('contextmenu', e => e.preventDefault()); });
  document.addEventListener('keydown', e => { if (e.key === 'Control' && !e.repeat && !UI.skip) UI.startSkip(true); });
  document.addEventListener('keyup', e => { if (e.key === 'Control' && UI.skipHold) UI.stopSkip(true); });
  window.addEventListener('blur', () => { if (UI.skipHold) UI.stopSkip(true); });
  $('#stats').onclick = e => { e.stopPropagation(); UI.statsHelp(); };
};
let primed = false;
function primeSpeech() { if (primed) return; primed = true; try { if ('speechSynthesis' in window && AU.cfg.speech) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'zh-CN'; speechSynthesis.speak(u); } } catch (e) {} }

/* ---------- HUD ---------- */
UI.hud = function () {
  const r = G.run; if (!r) return;
  $('#dayPill').innerHTML = r.day ? `<b>第${r.day}天</b><i>${r.time || ''}</i>` : (r.ch === 'ch0' ? '<b>序章</b>' : '<b>入宫</b>');
  $('#stats').innerHTML = G.STAT_KEYS.map(k => `<span class="st" data-k="${k}"><em>${G.STAT_ICON[k]}</em>${r.stats[k]}</span>`).join('');
  $('#lifePill').textContent = '第' + G.meta.lives + '世';
};
UI.statsHelp = function () {
  const r = G.run; if (!r) return;
  const tips = { 圣眷: '皇上的注意力。太低谁都能欺负你，太高会招人恨。', 名声: '宫里人对你的评价。选秀看它。', 健康: '熬夜、罚跪、饿肚子都会扣。', 警觉: '越高越容易识破陷阱（≥30 能闻出香里的猫腻）。', 疑心: '别人觉得你“未卜先知”的程度。别太像先知。', 规矩: '桂嬷嬷眼里的你。选秀也看它。' };
  UI.modal('📜 属性说明', G.STAT_KEYS.map(k => `<p><b>${G.STAT_ICON[k]} ${k} ${r.stats[k]}</b><br><small>${tips[k]}</small></p>`).join('') + `<p><small>物品：${Object.keys(r.items).filter(k => r.items[k] > 0).map(k => r.items[k] > 1 ? k + '×' + r.items[k] : k).join('、') || '无'}</small></p>` + (UI.relHelp ? UI.relHelp(r) : ''));
};
UI.toast = function (msg, kind, ms) {
  const t = el('div', 'toast ' + (kind || ''), esc(msg)); $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('out'), ms || 1700); setTimeout(() => t.remove(), (ms || 1700) + 500);
};
let modalDone = null;
UI.modal = function (title, html, buttons, opt) {
  if (modalDone) modalDone(); // 旧弹窗被新弹窗顶掉时，按“取消”结算，避免挂起
  return new Promise(res => {
    const m = $('#modal'); const card = m.querySelector('.mcard'); card.className = 'mcard ' + ((opt && opt.cls) || '');
    m.querySelector('.mtitle').innerHTML = title; const body = m.querySelector('.mbody'); body.innerHTML = html; body.scrollTop = 0;
    const bar = m.querySelector('.mbtns'); bar.innerHTML = '';
    const list = buttons || [{ t: '知道了' }];
    const cancel = list.find(b => b.v === null || b.v === false || b.v === undefined); const dv = cancel ? cancel.v : undefined;
    let done = false;
    const finish = v => { if (done) return; done = true; if (modalDone === fin0) modalDone = null; hide('#modal'); res(v); };
    const fin0 = () => finish(dv); modalDone = fin0;
    list.forEach(b => { const btn = el('button', 'btn ' + (b.cls || ''), b.t); btn.onclick = e => { e.stopPropagation(); AU.sfx('tap'); finish(b.v); }; bar.appendChild(btn); });
    m.querySelector('.mx').onclick = e => { e.stopPropagation(); AU.sfx('tap'); finish(dv); };
    m.onclick = e => { if (e.target === m) { AU.sfx('tap'); finish(dv); } };
    UI.stopSkip && UI.stopSkip();
    show('#modal');
  });
};
UI.closeModal = () => { if (modalDone) modalDone(); else hide('#modal'); };
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (UI.isOpen('#modal')) { e.preventDefault(); AU.sfx('tap'); UI.closeModal(); }
  else if (UI.isOpen('#galleryOv')) { e.preventDefault(); AU.sfx('tap'); hide('#galleryOv'); }
});

/* ---------- 过场 ---------- */
UI.transition = async function (kind, mid) {
  const f = $('#fader'); f.className = 'show ' + (kind || 'fade'); const d = UI.skip ? 40 : 260;
  await sleep(kind === 'cut' ? 0 : d); mid && mid(); await sleep(UI.skip ? 10 : 60); f.className = kind || 'fade'; await sleep(kind === 'cut' ? 0 : d);
};
const NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
UI.dayCard = function (day, time, date) {
  return new Promise(res => {
    const d = $('#dayCard'); d.querySelector('.big').textContent = '第' + (NUM[day] || day) + '天';
    d.querySelector('.sub').textContent = (date || ('承平三年 · 三月初' + (NUM[day] || day))) + ' · ' + time;
    show('#dayCard'); AU.sfx('muyu');
    let done = false; const fin = () => { if (done) return; done = true; hide('#dayCard'); setTimeout(res, 250); };
    d.onclick = fin; setTimeout(fin, UI.skip ? 300 : 1500);
  });
};
UI.chapterCard = function (title, sub) {
  return new Promise(res => {
    const d = $('#chapterCard'); d.querySelector('.ct').textContent = title; d.querySelector('.cs').textContent = sub || '';
    show('#chapterCard'); AU.sfx('gong');
    let done = false; const fin = () => { if (done) return; done = true; hide('#chapterCard'); setTimeout(res, 300); };
    d.onclick = fin; setTimeout(fin, UI.skip ? 600 : 2600);
  });
};

/* ---------- 对话 · 快进 / 自动播放 ---------- */
let sayState = null;
UI.skip = false; UI.skipHold = false; UI.auto = false;
const skipAll = () => G.meta.settings.skipAll === true;
const skipBadge = () => { const b = $('#skipBadge'); if (!b) return; b.textContent = UI.skip ? (skipAll() ? '⏩ 快进中（全部）' : '⏩ 快进中') : UI.auto ? '▶ 自动播放' : ''; b.classList.toggle('show', UI.skip || UI.auto); document.body.classList.toggle('skipping', UI.skip); };
UI.startSkip = function (hold) {
  if (UI.skip || popupOpen()) return; UI.skip = true; UI.skipHold = !!hold; $('#btnSkip').classList.add('on'); skipBadge();
  if (sayState && sayState.done) setTimeout(() => UI.skip && sayState && sayState.done && UI.advance(), 30);
  else if (sayState && (skipAll() || G.isRead(sayState.node, sayState.key))) sayState.finish();
  else if (sayState) { UI.stopSkip(); UI.toast('已到未读剧情', 'info', 1100); }
};
UI.stopSkip = function () { if (!UI.skip) return; UI.skip = false; UI.skipHold = false; $('#btnSkip').classList.remove('on'); skipBadge(); };
const popupOpen = () => UI.isOpen('#modal') || UI.isOpen('#galleryOv');
const autoAdv = me => { if (!me || sayState !== me || !UI.auto || UI.skip || !me.done) return; if (popupOpen()) { me.autoT = setTimeout(() => autoAdv(me), 400); return; } UI.advance(); };
UI.setAuto = function (on) { UI.auto = !!on; $('#btnAuto').classList.toggle('on', UI.auto); skipBadge(); if (UI.auto && sayState && sayState.done) { const me = sayState; me.autoT = setTimeout(() => autoAdv(me), 900); } };
UI.isSkipping = () => UI.skip;
function speakerName(who, st) {
  if (st && st.name) return G.render(st.name);
  if (who === 'n') return '';
  if (who === 'os') return '内心OS';
  if (who === 'me' || who === 'modern') return G.run && G.run.flags.modernMode ? (G.meta.names.modern || '我') : (G.palaceName() || G.meta.names.modern || '我');
  return (A.CH[who] && A.CH[who].name) || who;
}
UI.say = function (who, text, st, my, node, key) {
  return new Promise(res => {
    const d = $('#dlg'), tx = d.querySelector('.txt'), tag = d.querySelector('.nameTag');
    d.className = 'show ' + (who === 'n' ? 'narr' : who === 'os' ? 'think' : 'speech') + (st.big ? ' big' : '');
    const nm = speakerName(who, st); tag.textContent = nm; tag.style.display = nm ? '' : 'none';
    G.stage.speaker = who === 'os' ? 'me' : who; G.stage.talking = true;
    UI.positionTail(who === 'os' ? 'me' : who);
    const speed = [60, 38, 22, 0][G.meta.settings.speed != null ? G.meta.settings.speed : 2];
    const chars = Array.from(text); let i = 0; tx.innerHTML = '';
    d.classList.remove('done');
    const wasRead = G.isRead(node, key);
    if (UI.skip && !wasRead && !skipAll()) { UI.stopSkip(); UI.toast('已到未读剧情', 'info', 1100); }
    d.classList.toggle('readline', wasRead);
    sayState = { done: false, finish: null, res, my, node, key, cls: d.className, text, nm };
    const me = sayState;
    const finishType = () => { tx.innerHTML = esc(text).replace(/\n/g, '<br>'); i = chars.length; G.stage.talking = false; d.classList.add('done'); me.done = true; G.markRead(node, key);
      if (UI.skip) setTimeout(() => sayState === me && UI.skip && UI.advance(), 30);
      else if (UI.auto) me.autoT = setTimeout(() => autoAdv(me), 1100 + chars.length * 55); };
    sayState.finish = finishType;
    if (!speed || UI.skip) { finishType(); return; }
    const tick = () => { if (!sayState || sayState.res !== res) return; if (i >= chars.length) { finishType(); return; } i += 1; tx.innerHTML = esc(chars.slice(0, i).join('')).replace(/\n/g, '<br>'); if (i % 3 === 0) AU.sfx('tick'); setTimeout(tick, speed); };
    tick();
  });
};
UI.advance = function () {
  if (!sayState) return;
  if (!sayState.done) { sayState.finish(); return; }
  const r = sayState.res; clearTimeout(sayState.autoT); G.markRead(sayState.node, sayState.key); sayState = null; G.stage.talking = false; if (!UI.skip) AU.sfx('tap'); r();
};
UI.hideDialog = function () { $('#dlg').className = ''; sayState = null; G.stage.speaker = null; G.stage.talking = false; };
UI.positionTail = function (who) {
  const d = $('#dlg'); const p = who && G.charScreen(who); const L = G.layout();
  if (!p) { d.style.setProperty('--tail', 'none'); return; }
  const r = d.getBoundingClientRect();
  if (L.land) { d.style.setProperty('--tailx', '0px'); d.style.setProperty('--taily', Math.max(30, Math.min(r.height - 30, p.y + 60 - r.top)) + 'px'); }
  else d.style.setProperty('--tailx', Math.max(28, Math.min(r.width - 40, p.x - r.left)) + 'px');
  d.style.setProperty('--tail', 'block');
};
UI.reposition = function () { if (G.stage.speaker) UI.positionTail(G.stage.speaker); };

/* ---------- 选项 ---------- */
UI.choose = function (opts, st, my) {
  return new Promise(res => {
    UI.stopSkip(); const curNode = G.run && G.run.node;
    const box = $('#choices'); box.innerHTML = '';
    $('#dlg').classList.add('choosing');
    if (st.q) { box.appendChild(el('div', 'cq', esc(G.render(st.q)))); }
    const list = opts.filter(o => (!o.need || o.need(G)) && (!o.mem || G.mem(o.mem)) && (!o.know || G.know(o.know)));
    list.forEach((o, idx) => {
      const b = el('button', 'choice' + (o.mem || o.know ? ' memo' : '') + ((o.death || (typeof o.danger === 'function' ? o.danger(G) : o.danger)) && G.meta.settings.sixth !== false ? ' danger' : ''));
      let html = (o.mem || o.know ? '<span class="crys">🔮</span>' : '') + esc(G.render(o.t));
      const did = o.death || (typeof o.danger === 'string' ? o.danger : null);
      if (did && G.died(did)) html += '<span class="gb">👻 已收录</span>';
      else if (curNode && G.wasPicked(curNode, o)) html += '<span class="gb picked">✓ 已选</span>';
      if (o.hint) html += `<small>${esc(G.render(o.hint))}</small>`;
      b.innerHTML = html; b.dataset.idx = idx;
      b.onclick = e => { e.stopPropagation(); if (box.dataset.lock) return; box.dataset.lock = '1'; b.classList.add('picked'); AU.sfx('stamp'); setTimeout(() => { UI.hideChoices(); res(o); }, 260); };
      box.appendChild(b);
    });
    box.className = 'show' + (list.length >= 5 ? ' many' : ''); delete box.dataset.lock;
    UI.lastChoices = list;
  });
};
UI.hideChoices = function () { const b = $('#choices'); b.className = ''; b.innerHTML = ''; $('#dlg').classList.remove('choosing'); };

/* ---------- 命名 ---------- */
const SUG = { modern: ['林小满', '苏糯糯', '唐甜甜', '夏多多', '许一一', '陈半夏', '叶知秋', '白小鹿'], surname: ['林', '许', '唐', '夏', '宋', '叶', '白', '陆', '欧阳', '上官'], given: ['婉', '念卿', '知意', '清欢', '如初', '安', '小满', '糯糯'] };
const BAD = ['傻逼', '妈的', '他妈', '操你', '屎', '尿', '屁', '死鬼', '贱'];
const ALLOW_RE = /^[\u4e00-\u9fa5A-Za-z·]+$/;
function okChars(s) { return ALLOW_RE.test(s); }
UI.nameInput = function (kind, st) {
  return new Promise(res => {
    const ov = $('#nameOv'); const n = G.meta.names;
    const isM = kind === 'modern';
    ov.querySelector('.ntitle').textContent = isM ? '生死簿 · 亡魂登记' : '选秀名牌';
    ov.querySelector('.nsub').textContent = isM ? '孟婆：“姓甚名谁？报上名来，我好登记。”' : '名牌被泪水晕开了……小桃：“小姐，您叫什么来着？”';
    ov.classList.toggle('modern', isM); ov.classList.toggle('palace', !isM);
    const f = ov.querySelector('.nfields'); f.innerHTML = '';
    const mk = (key, label, ph, max) => { const w = el('label', 'nf'); w.innerHTML = `<span>${label}</span><input type="text" maxlength="${max}" autocomplete="off" enterkeyhint="done" placeholder="${ph}">`; const inp = w.querySelector('input'); inp.value = n[key] || ''; inp.dataset.key = key; f.appendChild(w);
      const chips = el('div', 'chips'); SUG[key].slice(0, 6).forEach(s => { const c = el('button', 'chip', esc(s)); c.onclick = e => { e.preventDefault(); inp.value = s; AU.sfx('tap'); msg(''); confirmSame = false; }; chips.appendChild(c); }); f.appendChild(chips); return inp; };
    const inputs = isM ? [mk('modern', '现代名', '1–6 个字，如：林小满', 12)] : [mk('surname', '姓', '如：许', 8), mk('given', '名', '如：知意', 10)];
    const m = ov.querySelector('.nmsg'); const msg = t => { m.textContent = t; m.classList.toggle('on', !!t); if (t) AU.sfx('buzz'); };
    msg(st.msg ? G.render(st.msg) : '');
    let confirmSame = false;
    ov.querySelector('.dice').onclick = e => { e.preventDefault(); AU.sfx('pop'); inputs.forEach(inp => { const arr = SUG[inp.dataset.key]; let v; do { v = arr[(Math.random() * arr.length) | 0]; } while (arr.length > 1 && v === inp.value); inp.value = v; }); msg(''); confirmSame = false; };
    const go = ov.querySelector('.seal');
    go.onclick = e => {
      e.preventDefault();
      const vals = inputs.map(i => i.value.trim().replace(/\s+/g, ''));
      if (isM) {
        const v = vals[0];
        if (!v || Array.from(v).length > 6 && !/^[A-Za-z]+$/.test(v) || v.length > 12 || !okChars(v)) return msg('孟婆：“这名字生死簿上写不下。”（1–6 个字，只能用汉字或英文字母）');
        if (BAD.some(b => v.includes(b))) return msg('孟婆：“换一个，阎王爷看了会脸红。”');
      } else {
        const [s1, g1] = vals;
        if (!s1 || !okChars(s1) || (!G.hasLatin(s1) && s1.length > 2) || s1.length > 8) return msg('小桃：“小姐，咱家姓什么您都忘啦？”（1–2 个汉字）');
        if (!g1 || !okChars(g1) || (!G.hasLatin(g1) && g1.length > 2) || g1.length > 10) return msg('小桃：“名牌就这么大，写不下呀。”（1–2 个汉字）');
        if (BAD.some(b => (s1 + g1).includes(b))) return msg('小桃：“小姐！这、这可不能写上去！”');
        if (/^[沈苏温萧]/.test(s1) && !confirmSame) { confirmSame = true; return msg('小桃：“这……和某位娘娘同姓，真的没关系吗？”（再按一次确认）'); }
      }
      inputs.forEach((inp, i) => { G.meta.names[inp.dataset.key] = vals[i]; });
      G.save(); AU.sfx('stamp'); go.classList.add('stamped');
      setTimeout(() => { go.classList.remove('stamped'); hide('#nameOv'); res(); }, 520);
    };
    inputs.forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go.click(); } }));
    show('#nameOv');
  });
};

/* ---------- 死法卡 ---------- */
let cardLoop = null;
function loopCanvas(canvas, draw) {
  let alive = true; const ctx = canvas.getContext('2d'); let t = 0, last = performance.now();
  const f = now => { if (!alive) return; const dpr = Math.min(2, devicePixelRatio || 1), r = canvas.getBoundingClientRect(); const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    t += Math.min(0.05, (now - last) / 1000); last = now; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); draw(ctx, w, h, t); requestAnimationFrame(f); };
  requestAnimationFrame(f); return () => { alive = false; };
}
UI.deathNo = d => d.extra ? '番外 · ' + d.id : d.id;
UI.deathCard = function (d, isNew, mem, gf) {
  return new Promise(res => {
    const ov = $('#deathOv'); $('#stage').classList.add('gray');
    ov.querySelector('.dno').textContent = d.extra ? `番外第 ${+d.id.slice(1)} 种死法` : `第 ${+d.id} 种死法`;
    ov.querySelector('.dtitle').textContent = '《' + d.title + '》';
    ov.querySelector('.dcat').textContent = (P.DEATH_CATS[d.cat] || '') + ' ' + d.cat + ' ｜ ' + d.ch + ' ｜ 累计死亡 ' + G.meta.totalDeaths + ' 次';
    ov.querySelector('.ddesc').textContent = G.render(d.desc.replace(/【姓】/g, '{姓}').replace(/【玩家名】/g, '{现代名}'));
    ov.querySelector('.droast').textContent = G.render(d.roast || '');
    const mm = ov.querySelector('.dmem'); const mi = mem && P.MEM_MAP[mem]; mm.innerHTML = mi ? `🔮 获得记忆碎片：<b>${esc(mi.title)}</b>` : ''; mm.style.display = mi ? '' : 'none';
    let dg = ov.querySelector('.dgame'); if (!dg) { dg = el('div', 'dgame'); mm.after(dg); }
    dg.innerHTML = gf ? (gf.n >= G.SKIP_AFTER ? `🎮「${esc(gf.name)}」已失败 <b>${gf.n}</b> 次，可以跳过——再玩到它时可选「⏭ 跳过小游戏（按完美通过）」` : `🎮「${esc(gf.name)}」已失败 <b>${gf.n}</b> 次（失败 ${G.SKIP_AFTER} 次后可跳过）`) : ''; dg.style.display = gf ? '' : 'none';
    ov.querySelector('.dnew').style.display = isNew ? '' : 'none';
    const stamp = ov.querySelector('.dstamp'); stamp.classList.remove('slam');
    ov.classList.remove('open');
    show('#deathOv');
    if (cardLoop) cardLoop();
    cardLoop = loopCanvas(ov.querySelector('canvas'), (c, w, h, t) => A.drawDeathScene(c, w, h, d.id, t));
    AU.sfx('gong');
    requestAnimationFrame(() => ov.classList.add('open'));
    setTimeout(() => { stamp.classList.add('slam'); AU.sfx('stamp'); G.stage.shake = 0.4; const sc = ov.querySelector('.scroll'); sc.classList.add('shk'); setTimeout(() => sc.classList.remove('shk'), 400); }, 900);
    setTimeout(() => AU.speak(G.render(d.roast || d.title)), 650);
    ov.querySelector('.dspeak').onclick = e => { e.stopPropagation(); AU.cfg.speech = true; G.meta.settings.speech = true; AU.speak(G.render(d.roast || d.title)); UI.syncMute(); };
    ov.querySelector('.dmute').onclick = e => { e.stopPropagation(); AU.cfg.speech = !AU.cfg.speech; G.meta.settings.speech = AU.cfg.speech; if (!AU.cfg.speech) AU.stopSpeak(); UI.syncMute(); G.save(); };
    UI.syncMute();
    ov.querySelector('.dgo').onclick = e => { e.stopPropagation(); AU.sfx('select'); if (cardLoop) { cardLoop(); cardLoop = null; } hide('#deathOv'); $('#stage').classList.remove('gray'); res(); };
  });
};
UI.syncMute = function () { const b = $('#deathOv .dmute'); if (b) b.textContent = AU.cfg.speech ? '🔈 朗读：开' : '🔇 朗读：关'; };

/* ---------- 奈何桥中转站 ---------- */
let stLoop = null;
const MP_GREET = ['哟，新来的？', '又是你，{现代名}。', '老顾客了，坐。', '{现代名}，你是来办年卡的吗？', '今天第几回了？我这碗汤都凉了三次。'];
const MP_LORE = [
  '说起来，四十年前也有个丫头，在我这儿死了几百回……后来她不来了。听说现在过得挺好，还天天打叶子牌。',
  '那丫头当年也不肯喝汤，嘴里还老哼什么“两只老虎，跑得快”……你们那边的人，都这么怪吗？',
  '你身上有那面镜子的味道。上一个有这味道的人，现在住在慈宁宫。',
];
const MP_LORE5 = G => [
  '百日宴？我这儿也办。来的都是在宴上没吃完就走了的。你那桌留个座儿，我给你温着汤。',
  '烤鸭的事别问我。我只知道上个月来了一只鸭，非说自己叫“大将军”，排队还插队。',
  G.flag('houAlly') ? '慈宁宫那丫头当年走的时候说：“下次见！”我说：“别再来了！”……她真没再来。你也别来了，听见没有？' : '镜子合上的那天晚上，记得抬头看看星星。有人在那上头等了四十年。',
  '火？我这儿不怕火。就是上回有个小丫头一身烟灰过来，把我的汤锅当成了水缸。',
];
const MP_LORE4 = G => [
  '冷宫那位种白菜的老太妃？她送过来的客人，我这儿能凑两桌麻将。全是永和宫的。',
  '观星台那老道，三十年前爬上去看星星，摔下来过一回。我劝他喝汤，他说：“贫道夜观天象，今日不宜喝汤。”',
  G.flag('houAlly') ? '慈宁宫那丫头认出你了？……哼。她欠我三盆花，你替我问问，啥时候还。' : '你身上那面镜子的味儿越来越重了。小心点，镜子里的人，不一定跟你一个想法。',
  '暗杀周？我们这儿管这叫“冲业绩周”。这礼拜奈何桥排队的号，都排到永和宫门口了。',
];
UI.station = function (d) {
  const ov = $('#stationOv'); AU.setMood('bridge'); G.run.mood = 'bridge';
  const td = G.meta.totalDeaths;
  const greet = G.render(MP_GREET[Math.min(MP_GREET.length - 1, td <= 1 ? 0 : 1 + ((td * 7) % (MP_GREET.length - 1)))]);
  let lore = '';
  const LP = G.run && G.run.ch === 'ch5' ? MP_LORE5(G) : G.run && G.run.ch === 'ch4' ? MP_LORE4(G) : MP_LORE;
  if (td >= 3 && td % 2 === 1) lore = LP[((td - 3) / 2 | 0) % LP.length];
  const lines = [greet, G.render(d.roast || ''), '💡 孟婆小提示：' + G.render(d.hint || '多死几次就知道了。')];
  if (lore) lines.push(lore);
  if (td >= 50 && !G.meta.mems.M24 && P.MEM_MAP.M24) { lines.push('……五十回了？行吧，告诉你个秘密：慈宁宫那位，四十年前也在我这儿死了三百多回。她走的时候还欠我三盆花。你见了她，替我催催。'); setTimeout(() => G.unlockMem('M24'), 900); }
  ov.querySelector('.mpsay').innerHTML = lines.map(l => `<p>${esc(l)}</p>`).join('');
  const n = Object.keys(G.meta.deaths).filter(k => !P.DEATH_MAP[k].extra).length;
  ov.querySelector('.mpstat').innerHTML = `第 <b>${G.meta.lives}</b> 世 · 《百死图鉴》<b>${n}</b>/100 · 记忆碎片 <b>${Object.keys(G.meta.mems).length}</b>/24`;
  const needRename = (d.id === 'E01' || d.id === '098') ? 'palace' : null;
  const cp = G.run.cp;
  const b1 = ov.querySelector('.rb'); b1.innerHTML = '🍵 不喝孟婆汤 · 重生<small>' + (cp ? '回到「' + esc(G.run.cpLabel || '本日清晨') + '」' : '回到入宫马车上') + '</small>';
  b1.onclick = async () => { AU.sfx('select'); if (needRename) { await UI.nameInput(needRename, { msg: needRename === 'modern' ? '孟婆：“写方块字！”' : '孟婆：“名字惹的祸，改个名再走。”' }); } leave(); G.rebirth(false); };
  const rsB = ov.querySelector('.rs'), inCh = G.run.ch && G.run.ch !== 'ch0' && G.run.ch !== 'ch1' && P.chapters[G.run.ch];
  rsB.innerHTML = inCh ? '📜 回到本章开头<small>' + esc(inCh.title || '') + '</small>' : '🐴 回到马车上';
  if (inCh) rsB.onclick = async () => { const ok = await UI.modal('回到本章开头？', '<p>从「' + esc(inCh.title) + '」第一天重新开始（属性回到进入本章时；图鉴、记忆、名字都会保留）。</p>', [{ t: '取消', v: false }, { t: '回到本章开头', v: true, cls: 'pri' }]); if (!ok) return; if (needRename) await UI.nameInput(needRename, { msg: '孟婆：“名字惹的祸，改个名再走。”' }); leave(); G.startChapter(G.run.ch); };
  else rsB.onclick = async () => { const ok = await UI.modal('回到马车上？', '<p>从入宫马车重新开始这一世（属性重置；图鉴、记忆、名字都会保留）。</p>', [{ t: '取消', v: false }, { t: '回到马车', v: true, cls: 'pri' }]); if (!ok) return; if (needRename) await UI.nameInput(needRename, { msg: '孟婆：“名字惹的祸，改个名再走。”' }); leave(); G.rebirth(true); };
  ov.querySelector('.rg').onclick = () => { AU.sfx('page'); UI.gallery(); };
  ov.querySelector('.rn').onclick = async () => { AU.sfx('tap'); const which = await UI.modal('✍️ 找孟婆改名', '<p>孟婆：“又改？生死簿都被你涂花了。”</p>', [{ t: '改现代名', v: 'modern' }, { t: '改宫中名', v: 'palace', cls: 'pri' }, { t: '算了', v: null }]); if (which) await UI.nameInput(which, {}); };
  ov.querySelector('.rn').classList.toggle('hl', !!needRename);
  show('#stationOv');
  if (stLoop) stLoop();
  stLoop = loopCanvas(ov.querySelector('canvas'), (c, w, h, t) => {
    A.drawBG(c, 'bridge', w, h, t);
    const s = Math.min(h * 0.62, w * 0.9) / 330;
    A.drawChar(c, 'mengpo', w * 0.68, h * 0.93, s, { t, face: (t % 6) < 3 ? 'smirk' : 'normal', blink: (t % 3.3) < 0.12 });
    A.drawChar(c, G.run.ch === 'ch0' && !G.meta.names.surname ? 'modern' : 'me', w * 0.28, h * 0.9, s * 0.85, { t: t + 1, ghost: true, face: (t % 5) < 2.5 ? 'dead' : 'sweat', prop: 'none' });
  });
  function leave() { if (stLoop) { stLoop(); stLoop = null; } hide('#stationOv'); }
};
UI.closeStation = () => { if (stLoop) { stLoop(); stLoop = null; } hide('#stationOv'); };

/* ---------- 百死图鉴 ---------- */
let galLoop = null;
UI.gallery = function (tab) {
  const ov = $('#galleryOv'); tab = tab || 'death';
  const n = Object.keys(G.meta.deaths).filter(k => !P.DEATH_MAP[k].extra).length;
  const ne = Object.keys(G.meta.endings || {}).filter(k => P.ENDING_MAP && P.ENDING_MAP[k] && !P.ENDING_MAP[k].extra).length;
  ov.querySelector('.gcount').innerHTML = `已收录 <b>${n}</b> / 100　番外 <b>${P.DEATHS.filter(d => d.extra && G.meta.deaths[d.id]).length}</b> / ${P.DEATHS.filter(d => d.extra).length}　记忆 <b>${Object.keys(G.meta.mems).length}</b> / 24` + (P.ENDINGS ? `　结局 <b>${ne}</b> / ${P.ENDINGS.filter(e => !e.extra).length}` : '');
  $$('#galleryOv .tab').forEach(t => { t.classList.toggle('on', t.dataset.tab === tab); t.onclick = () => { AU.sfx('page'); UI.gallery(t.dataset.tab); }; });
  const grid = ov.querySelector('.ggrid'); grid.innerHTML = ''; grid.className = 'ggrid ' + tab;
  if (tab === 'death') {
    P.DEATHS.forEach(d => {
      const got = G.meta.deaths[d.id];
      const cell = el('button', 'gcell' + (got ? ' got' : '') + (d.playable ? ' avail' : '') + (d.extra ? ' extra' : ''));
      cell.dataset.id = d.id;
      cell.innerHTML = `<i>${d.extra ? d.id : d.id}</i><b>${got ? P.DEATH_CATS[d.cat] : (d.playable ? '❔' : '🔒')}</b><span>${got ? esc(d.title) : '？？？'}</span>`;
      cell.onclick = () => { AU.sfx('page'); UI.deathDetail(d); };
      grid.appendChild(cell);
    });
  } else if (tab === 'ending') {
    (P.ENDINGS || []).forEach(e => {
      const got = G.meta.endings && G.meta.endings[e.id];
      const cell = el('button', 'ecell' + (got ? ' got' : ''), `<i>${esc(e.kind)}${e.extra ? ' · 番外' : ''}</i><b>${got ? '【' + esc(e.title) + '】' : '？？？'}</b><small>${got ? esc(G.render(e.line)) : '谜语：' + esc(e.riddle)}</small>`);
      cell.onclick = () => { AU.sfx('page'); if (got) UI.endingDetail(e); };
      grid.appendChild(cell);
    });
  } else if (tab === 'reward') {
    (P.REWARDS || []).forEach(r => {
      const got = n >= r.n;
      const cell = el('div', 'rcell' + (got ? ' got' : ''), `<i>图鉴 ${r.n}</i><b>${got ? '🎁 ' : '🔒 '}${esc(r.t)}</b><small>${got ? esc(r.d) : '收集 ' + r.n + ' 种死法后解锁（现在 ' + n + '）'}</small>`);
      if (got && r.n === 100) { const b = el('button', 'btn pri', '📷 看片尾彩蛋'); b.onclick = () => { AU.sfx('page'); UI.egg(); }; cell.appendChild(b); }
      grid.appendChild(cell);
    });
  } else {
    P.MEMORIES.forEach(m => {
      const got = G.meta.mems[m.id];
      const cell = el('div', 'mcell' + (got ? ' got' : ''), `<i>${m.id}</i><b>${got ? esc(m.title) : '？？？'}</b><small>${got ? esc(m.text || m.src) : (m.chap && P.chapters['ch' + m.chap] ? (G.CH_NAME['ch' + m.chap] || '') + '可获得 · ' + esc(m.riddle || '') : '后续章节开放')}</small>`);
      grid.appendChild(cell);
    });
  }
  ov.querySelector('.gclose').onclick = () => { AU.sfx('tap'); hide('#galleryOv'); };
  ov.onclick = e => { if (e.target === ov) { AU.sfx('tap'); hide('#galleryOv'); } };
  show('#galleryOv');
};
UI.deathDetail = function (d) {
  const got = G.meta.deaths[d.id];
  const html = got
    ? `<canvas class="mini"></canvas><p class="dt">《${esc(d.title)}》</p><p><small>${P.DEATH_CATS[d.cat]} ${esc(d.cat)} ｜ ${esc(d.ch)}</small></p><p>${esc(G.render(d.desc.replace(/【姓】/g, '{姓}').replace(/【玩家名】/g, '{现代名}')))}</p><p class="rq">“${esc(G.render(d.roast || ''))}”</p><p><small>触发：${esc(d.cond)}</small></p><p><small>首次：第 ${got.first} 世 ｜ 累计：${got.n} 次</small></p>`
    : `<p class="dt">？？？</p><p><small>${d.playable ? '本版本可解锁 · ' + esc(d.ch) : esc(d.ch) + ' · 后续版本开放'}</small></p><p>${d.playable ? '谜语：' + esc(d.riddle || '多死几次就知道了') : '（这一章还在施工中，孟婆说“急什么，以后有的是机会死”）'}</p>`;
  UI.modal(d.extra ? '番外 ' + d.id : 'No.' + d.id, html);
  if (got) { if (galLoop) galLoop(); const c = $('#modal canvas.mini'); galLoop = loopCanvas(c, (ctx, w, h, t) => { if (!UI.isOpen('#modal')) { galLoop && galLoop(); galLoop = null; return; } A.drawDeathScene(ctx, w, h, d.id, t); }); }
};

UI.endingDetail = function (e) {
  const r = G.meta.endings[e.id] || {};
  UI.modal('【' + esc(e.title) + '】', `<canvas class="mini endmini"></canvas><p><small>${esc(e.kind)} ｜ 首次达成：第 ${r.first || '?'} 世 ｜ 共 ${r.n || 1} 次</small></p><p class="rq">“${esc(G.render(e.line))}”</p>`);
  if (galLoop) galLoop(); const c = $('#modal canvas.mini'); galLoop = loopCanvas(c, (ctx, w, h, t) => { if (!UI.isOpen('#modal')) { galLoop && galLoop(); galLoop = null; return; } A.drawEnding(ctx, w, h, e.id, t); });
};
UI.egg = function () {
  UI.modal('📷 片尾彩蛋 · 百死不悔', `<canvas class="mini endmini"></canvas><p>奈何桥头。一个扎马尾的姑娘，和一个还没那么老的孟婆，比着剪刀手。</p><p><small>照片背面写着：“2008 · 第 312 回 · 下次见！”——另一行字迹潦草：“别再来了！”</small></p><p><small>🏆 获得称号：<b>百死不悔</b></small></p>`);
  if (galLoop) galLoop(); const c = $('#modal canvas.mini'); galLoop = loopCanvas(c, (ctx, w, h, t) => { if (!UI.isOpen('#modal')) { galLoop && galLoop(); galLoop = null; return; } A.drawEgg(ctx, w, h, t); });
};
let finLoop = null;
const CREDITS = () => [
  ['', '《穿越回后宫的100种死法》'], ['主演', '{宫名}（{现代名}）'], ['死亡次数', '{死} 次（一种不少，一次不亏）'],
  ['贴身宫女', '小桃（爱吃，胆小，最勇敢）'], ['首席情报官', '小安子（已戒赌）'], ['御前侍卫', '陆峥（不喝甜的；少糖可以）'],
  ['太医', '温太医（和他舅舅不是一家人）'], ['浣衣局分局长', '阿芸'], ['冷宫农业顾问', '静太妃'], ['天气预报', '玄机子（只报雨）'],
  ['大反派', '宁嫔（影后）'], ['幕后黑手', '温尚书（以及他的两只帽翅）'], ['特别出演', '太后（2008 届）'],
  ['奈何桥后勤', '孟婆（汤已凉）'], ['道具', '御膳房 · 鸭子“大将军”（已越狱）'], ['白菜指导', '小华、小宁'], ['猫', '糯米（只认小鱼干）'],
  ['鸣谢', '每一碗没喝下去的孟婆汤'], ['', '本片所有死法均为卡通演出，<br>没有任何一位小主在拍摄中受到真正的伤害。'], ['', '—— 完 ——'],
];
UI.ending = function (id, st) {
  return new Promise(res => {
    const e = (P.ENDING_MAP && P.ENDING_MAP[id]) || { id, title: id, kind: '', line: '' };
    const em = G.meta.endings = G.meta.endings || {}; const isNew = !em[id];
    em[id] = { n: (em[id] ? em[id].n : 0) + 1, first: em[id] ? em[id].first : G.meta.lives, at: Date.now() };
    if (id !== 'E_dream') G.meta.clear.ch5 = G.meta.clear.ch5 || { at: Date.now(), life: G.meta.lives, rank: G.run && G.run.flags.rank, ending: id };
    G.save();
    let ov = $('#finOv'); if (!ov) { ov = el('div', 'ov'); ov.id = 'finOv'; $('#app').appendChild(ov); }
    const n = G.uniqueDeaths(), ne = Object.keys(em).filter(k => P.ENDING_MAP[k] && !P.ENDING_MAP[k].extra).length;
    const cred = CREDITS().map(([a, b]) => `<p>${a ? '<b>' + esc(a) + '</b>　' : ''}${G.render(b)}</p>`).join('');
    ov.innerHTML = `<div class="fcard"><canvas></canvas><div class="fside"><div class="fbody"><div class="fkind">${esc(e.kind)}结局${isNew ? ' · 🆕 首次达成' : ''}</div><div class="ftitle">【${esc(e.title)}】</div>
      <p class="fline">${esc(G.render(st.line || e.line))}</p>
      <div class="fstat">第 <b>${G.meta.lives}</b> 世 · 累计死亡 <b>${G.meta.totalDeaths}</b> 次 · 图鉴 <b>${n}</b>/100 · 记忆 <b>${Object.keys(G.meta.mems).length}</b>/24 · 结局 <b>${ne}</b>/${P.ENDINGS.filter(x => !x.extra).length}</div>
      ${st.cont ? '' : `<div class="fcred"><div class="roll">${cred}</div></div>`}</div>
      <div class="fbtns">${st.cont ? `<button class="btn pri fcont">${esc(st.cont)}</button>` : `<button class="btn pri fgal">🏁 结局画廊</button><button class="btn freplay">🔁 重玩第五章</button>${n >= 100 ? '<button class="btn fegg">📷 片尾彩蛋</button>' : ''}<button class="btn ftitleb">🏯 回到标题</button>`}</div></div></div>`;
    if (finLoop) finLoop(); finLoop = loopCanvas(ov.querySelector('canvas'), (c, w, h, t) => A.drawEnding(c, w, h, id, t));
    show('#finOv'); AU.sfx('fanfare'); AU.setMood(id === 'E_dream' || id === 'E_her' ? 'mystery' : 'happy'); if (id !== 'E_dream' && id !== 'E_her') G.confetti();
    const close = () => { if (finLoop) { finLoop(); finLoop = null; } hide('#finOv'); };
    const q = s2 => ov.querySelector(s2);
    if (st.cont) q('.fcont').onclick = e2 => { e2.stopPropagation(); AU.sfx('select'); close(); res(); };
    else {
      q('.fgal').onclick = e2 => { e2.stopPropagation(); AU.sfx('page'); UI.gallery('ending'); };
      q('.freplay').onclick = e2 => { e2.stopPropagation(); AU.sfx('select'); close(); G.startChapter('ch5'); res(); };
      q('.ftitleb').onclick = e2 => { e2.stopPropagation(); AU.sfx('tap'); close(); if (G.run) { G.run.node = null; G.save(); } UI.title(); res(); };
      if (q('.fegg')) q('.fegg').onclick = e2 => { e2.stopPropagation(); UI.egg(); };
    }
  });
};

/* ---------- 菜单 / 设置 ---------- */
UI.menu = async function () {
  const v = await UI.modal('☰ 菜单', `<p><small>第 ${G.meta.lives} 世 · 累计死亡 ${G.meta.totalDeaths} 次</small></p><p><small>现代名：${esc(G.meta.names.modern || '未登记')} ｜ 宫中名：${esc(G.palaceName() || '未填写')}</small></p>`,
    [{ t: '📖 百死图鉴', v: 'g' }, { t: '⚙️ 设置', v: 's' }, { t: '🏯 回到标题', v: 't' }, { t: '继续', v: null, cls: 'pri' }]);
  if (v === 'g') UI.gallery(); if (v === 's') UI.settings(); if (v === 't') { G.stop(); UI.closeStation(); hide('#deathOv'); UI.title(); }
};
UI.settings = function () {
  const s = G.meta.settings;
  const html = `<div class="set"><label>🎶 背景音乐 <input type="checkbox" id="sMusOn" ${s.musicOn !== false ? 'checked' : ''}></label><label>🎵 音乐音量 <input type="range" min="0" max="1" step="0.05" id="sMus" value="${s.music}"></label>
  <label>🔔 音效 <input type="range" min="0" max="1" step="0.05" id="sSfx" value="${s.sfx}"></label>
  <label>🗣️ 死法卡朗读吐槽 <input type="checkbox" id="sSp" ${s.speech ? 'checked' : ''}></label>
  <label>🫨 危险选项轻微抖动（简单模式·第六感）<input type="checkbox" id="sSix" ${s.sixth !== false ? 'checked' : ''}></label>
  <label>⏩ 快进范围 <select id="sSkip"><option value="0" ${s.skipAll !== true ? 'selected' : ''}>仅快进已读</option><option value="1" ${s.skipAll === true ? 'selected' : ''}>全部快进</option></select></label>
  <p><small>⏩ 快进会在第一句未读剧情、选项、小游戏、死法卡处自动停下。长按画面（或按住 Ctrl）临时快进，松开即停。▶ 自动播放。</small></p>
  <label>📜 文字速度 <select id="sSpd">${['慢', '中', '快', '瞬间'].map((t, i) => `<option value="${i}" ${+s.speed === i ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
  <p><small>难度：简单（死亡后立即重生、无惩罚，图鉴与记忆永久保留）</small></p>
  <button class="btn warn" id="sWipe">🗑️ 清除全部存档</button></div>`;
  UI.modal('⚙️ 设置', html, [{ t: '完成', cls: 'pri' }]);
  const upd = () => { s.musicOn = $('#sMusOn').checked; s.music = +$('#sMus').value; s.sfx = +$('#sSfx').value; s.speech = $('#sSp').checked; s.sixth = $('#sSix').checked; s.speed = +$('#sSpd').value; s.skipAll = $('#sSkip').value === '1'; skipBadge(); Object.assign(AU.cfg, s); AU.applyVol(); if (!s.speech) AU.stopSpeak(); G.save(); };
  ['#sMus', '#sSfx', '#sSp', '#sSix', '#sSpd'].forEach(id => $(id).addEventListener('input', upd));
  ['#sMusOn', '#sSp', '#sSix', '#sSpd', '#sSkip'].forEach(id => $(id).addEventListener('change', upd));
  let armed = false; $('#sWipe').onclick = () => { if (!armed) { armed = true; $('#sWipe').textContent = '⚠️ 再点一次确认清除（不可恢复）'; return; } G.wipe(); UI.closeModal(); G.stop(); UI.title(); UI.toast('存档已清除', 'info'); };
};

/* ---------- 标题 ---------- */
UI.title = function () {
  G.stop(); document.body.classList.add('nohud');
  ['#deathOv', '#stationOv', '#galleryOv', '#endOv', '#nameOv', '#finOv'].forEach(hide); if (finLoop) { finLoop(); finLoop = null; }
  G.stage.bg = 'title'; G.stage.prevBg = null; G.stage.cat = { pos: 0.86, x: 0.86, mood: 'happy' };
  G.stage.cast = []; G.stage.titleMode = true;
  const land = G.layout().land;
  P.G.setTitleCast && P.G.setTitleCast();
  AU.setMood('title');
  const ov = show('#titleOv');
  const has = G.run && G.run.node;
  ov.querySelector('.tcont').style.display = has ? '' : 'none';
  const n = Object.keys(G.meta.deaths).filter(k => !P.DEATH_MAP[k].extra).length;
  const nE = Object.keys(G.meta.endings || {}).filter(k => P.ENDING_MAP && P.ENDING_MAP[k] && !P.ENDING_MAP[k].extra).length;
  ov.querySelector('.tinfo').innerHTML = (n >= 100 ? '🏆 百死不悔 · ' : '') + (G.meta.totalDeaths ? `第 ${G.meta.lives} 世 · 图鉴 ${n}/100` : '一百种死法，总有一种适合你') + (nE ? ` · 🏁 结局 ${nE}/10` : '') + (G.meta.clear.ch1 ? ' · 🏅 ' + G.CH_ORDER.slice(1).filter(k => G.meta.clear[k]).map(k => G.CH_NAME[k]).join('、') + '已通关' : '');
  const tch = ov.querySelector('.tchap'); if (tch) { tch.style.display = G.meta.clear.ch1 ? '' : 'none'; tch.onclick = () => { AU.unlock(); AU.sfx('page'); UI.chapterSelect(); }; }
  ov.querySelector('.tnew').onclick = async () => {
    AU.unlock(); AU.sfx('select');
    if (has) { const ok = await UI.modal('重新开始？', '<p>重新开始会覆盖当前这一世的进度。<br>《百死图鉴》、记忆碎片和名字会保留。</p>', [{ t: '取消', v: false }, { t: '重新开始', v: true, cls: 'pri' }]); if (!ok) return; }
    hide('#titleOv'); document.body.classList.remove('nohud'); G.newGame();
  };
  ov.querySelector('.tcont').onclick = () => { AU.unlock(); AU.sfx('select'); hide('#titleOv'); document.body.classList.remove('nohud'); if (!G.resume()) G.newGame(); };
  ov.querySelector('.tgal').onclick = () => { AU.unlock(); AU.sfx('page'); UI.gallery(); };
  ov.querySelector('.tset').onclick = () => { AU.unlock(); AU.sfx('tap'); UI.settings(); };
};

/* ---------- 章末结算 ---------- */
UI.chapterEnd = function (chId, st) {
  return new Promise(res => {
    const ov = $('#endOv'); const r = G.run;
    G.meta.clear[chId] = G.meta.clear[chId] || { at: Date.now(), life: G.meta.lives, rank: r.flags.rank }; G.save();
    const chName = G.CH_NAME[chId]; const chDeaths = P.DEATHS.filter(d => d.playable && d.ch === chName); const allP = P.DEATHS.filter(d => d.playable); const nxt = st.next && P.chapters[st.next];
    const got = chDeaths.filter(d => G.meta.deaths[d.id]).length;
    const mins = Math.max(1, Math.round((Date.now() - (r.started || Date.now())) / 60000));
    ov.querySelector('.etitle').textContent = st.title || '第一章 · 通关！';
    ov.querySelector('.ebody').innerHTML = `<p class="erank">${esc(G.render(st.rankText || '{宫名}，你活下来了！'))}</p>
      <ul><li>🏯 结果：<b>${esc(r.flags.rankName || r.flags.rank || '留宫')}</b></li><li>🔁 本次轮回：第 <b>${G.meta.lives}</b> 世（累计死亡 ${G.meta.totalDeaths} 次）</li>
      <li>📖 本章死法收集：<b>${got}</b> / ${chDeaths.length}（全部已开放：${allP.filter(d => G.meta.deaths[d.id]).length} / ${allP.length}）</li><li>🔮 记忆碎片：<b>${Object.keys(G.meta.mems).length}</b> / 24</li>
      <li>${G.STAT_KEYS.map(k => G.STAT_ICON[k] + k + ' ' + r.stats[k]).join('　')}</li></ul>
      <p class="tease">${nxt ? (st.teaseNext || '下一章已开放！') : (st.tease || '下一章敬请期待——')}</p>`;
    const en = ov.querySelector('.en'); en.style.display = nxt ? '' : 'none'; ov.querySelector('.et').classList.toggle('pri', !nxt); if (nxt) en.innerHTML = '▶ 进入' + esc(nxt.title || G.CH_NAME[st.next]);
    en.onclick = () => { AU.sfx('select'); hide('#endOv'); G.enterChapter(st.next); res(); };
    show('#endOv'); G.confetti(); AU.sfx('fanfare'); AU.setMood('happy');
    ov.querySelector('.eg').onclick = () => { AU.sfx('page'); UI.gallery(); };
    ov.querySelector('.er').innerHTML = chId === 'ch1' ? '🔁 再来一世（收集死法）' : '🔁 重玩本章（收集死法）';
    ov.querySelector('.er').onclick = () => { AU.sfx('select'); hide('#endOv'); if (chId === 'ch1') G.rebirth(true); else G.startChapter(chId); res(); };
    ov.querySelector('.et').onclick = () => { AU.sfx('tap'); hide('#endOv'); G.run.node = null; G.save(); UI.title(); res(); };
  });
};

/* ---------- 章节选择 / 关系值 ---------- */
UI.chapterSelect = async function () {
  const list = G.CH_ORDER.slice(1).filter(k => P.chapters[k]);
  const html = '<div class="chsel">' + list.map(k => { const ch = P.chapters[k], un = G.chapterUnlocked(k), cl = G.meta.clear[k];
    return `<p><b>${esc(ch.title)}</b>${cl ? ' 🏅' : ''}<br><small>${un ? esc(ch.blurb || '') : '🔒 通关上一章后解锁'}</small></p>`; }).join('') + '</div><p><small>从章节开头开始会覆盖“继续这一世”的进度；图鉴、记忆、名字都会保留。</small></p>';
  const btns = list.filter(k => G.chapterUnlocked(k)).map(k => ({ t: '▶ ' + G.CH_NAME[k], v: k, cls: 'pri' })).concat([{ t: '返回', v: null }]);
  const v = await UI.modal('📚 章节选择', html, btns);
  if (!v) return;
  if (G.run && G.run.node) { const ok = await UI.modal('覆盖当前进度？', '<p>“继续这一世”的进度会被替换。</p>', [{ t: '取消', v: false }, { t: '确定', v: true, cls: 'pri' }]); if (!ok) return; }
  hide('#titleOv'); document.body.classList.remove('nohud');
  if (v === 'ch1') { G.newGame(); return; }
  G.startChapter(v);
};
UI.relHelp = function (r) {
  const c = r.cnt || {}; const rows = [];
  if (r.ch === 'ch2' || r.ch === 'ch3') {
    rows.push(['🍑 小桃信任', c.trust_tao || 0, '太低会被人收买；≥40 关键时刻会为你作证。']);
    rows.push(['🛡️ 陆峥信任', c.trust_lu || 0, '御前侍卫。≥40 才不会把你当刺客。']);
    if (r.ch === 'ch2') rows.push(['🐱 糯米好感', c.cat || 0, '御猫。好感太高……午睡记得关窗。']);
    rows.push(['🔪 贵妃杀意', c.kill || 0, r.ch === 'ch2' ? '≥100 时千万别走长春宫的近路。' : '太高时，贵妃会在人前对你发难。']);
    if (r.ch === 'ch3') rows.push(['🙏 太后信任', c.trust_hou || 0, '≥40 时，太后会在关键时刻替你说话。']);
    rows.push(['🕸️ 情报', c.intel || 0, '小安子、假山八卦、陆峥……关键时刻能救命。']);
    if (r.ch === 'ch2') rows.push(['💰 银两', c.silver || 0, '超过 300 两太招摇。']);
    if (r.ch === 'ch3' && c.ayun) rows.push(['🧺 阿芸', c.ayun, '浣衣局的小宫女，知道各宫衣物的去向。']);
  }
  if (r.ch === 'ch4' || r.ch === 'ch5') {
    rows.push(['🍑 小桃信任', c.trust_tao || 0, '≥60 时，她就是你最靠得住的证人。']);
    rows.push(['🛡️ 陆峥信任', c.trust_lu || 0, '≥60 时，他会站出来替你说话。']);
    rows.push(['🙏 太后信任', c.trust_hou || 0, r.flags.houAlly ? '老乡相认。她是你的靠山。' : '≥60 之前，别跟她摊牌。']);
    rows.push(['💊 温太医信任', c.trust_wen || 0, '懂毒的人，信你才肯作证。']);
    rows.push(['🥬 静太妃信任', c.jing || 0, '冷宫里那位，是三年前的目击者。']);
    rows.push(['🧺 阿芸好感', c.ayun || 0, '浣衣局知道各宫的衣物——和藏在衣物里的东西。']);
    rows.push(['🐍 宁嫔杀意', c.ning || 0, '越高，她出手越狠。']);
    if (r.ch === 'ch5') { rows.push(['👑 皇后杀意', c.hh || 0, '皇后、贵妃、宁嫔的杀意别同时 ≥ 70。']); rows.push(['🔪 贵妃杀意', c.kill || 0, r.flags.sisters ? '姐妹一场，她不会对你下手。' : '排座次时别得罪她。']); }
    rows.push(['📜 证据卡', Object.keys(r.items).filter(k => k.startsWith('证据卡') && r.items[k] > 0).length, '百日宴举证需要五张：卷宗、账本、布料、翠缕、静太妃。']);
    if (r.ch === 'ch5') rows.push(['💰 银两', c.silver || 0, (c.silver || 0) < 0 ? '⚠️ 欠着债！五天之内要还上。' : '别借王公公的钱。']);
  }
  return rows.length ? '<hr>' + rows.map(x => `<p><b>${x[0]} ${x[1]}</b><br><small>${x[2]}</small></p>`).join('') : '';
};

/* ---------- 看门狗：剧情在跑、屏幕上却什么都没有（没台词、没选项、没卡片）超过 3 秒时自动自愈 ---------- */
UI.watch = { idle: 0, fixes: 0 };
function somethingVisible() {
  const vis = id => { const e = $(id); return !!(e && e.classList.contains('show')); };
  const d = $('#dlg'), ch = $('#choices');
  if (d.classList.contains('show') && !d.classList.contains('choosing') && sayState) return true; // 框还在但没有台词在等 = 假死
  if (ch.classList.contains('show') && ch.children.length) return true;
  if (['#titleOv', '#dayCard', '#chapterCard', '#modal', '#galleryOv', '#gameOv', '#deathOv', '#stationOv', '#endOv', '#nameOv', '#finOv'].some(vis)) return true;
  const f = $('#fader'); if (f && /\bshow\b/.test(f.className)) return true;
  return false;
}
UI.recover = function (why) {
  const r = G.run; if (!r || !r.node) return false;
  UI.watch.fixes++; const stp = (P.NODES[r.node] || [])[r.ip - 1]; G.diag && G.diag('watchdog', (why || '') + ' dlg=' + $('#dlg').className + ' say=' + !!sayState + ' ch=' + $('#choices').children.length + ' alive=' + G.loopAlive() + ' step=' + (stp ? (typeof stp === 'function' ? 'fn' : Object.keys(stp).join(',')) : '-') + ' fader=' + $('#fader').className);
  const d = $('#dlg');
  if (sayState && G.alive(sayState.my)) { // 台词还在等，只是框没了：把它重新显示出来
    d.className = (sayState.cls || 'show narr').replace(/\bchoosing\b/g, '') + ' done'; if (!/\bshow\b/.test(d.className)) d.className += ' show';
    d.querySelector('.txt').innerHTML = esc(sayState.text || '').replace(/\n/g, '<br>'); const tag = d.querySelector('.nameTag'); tag.textContent = sayState.nm || ''; tag.style.display = sayState.nm ? '' : 'none';
    sayState.done = true; return 'say';
  }
  const ch = $('#choices');
  if (ch.children.length && !ch.classList.contains('show')) { ch.classList.add('show'); d.classList.add('choosing'); return 'choices'; }
  const steps = P.NODES[r.node] || [];
  if (G.loopAlive()) { G.play(r.node, Math.max(0, r.ip - 1)); return 'replay'; } // 卡在一个看不见的等待上：从当前这一步重来
  G.play(r.node, Math.min(r.ip, steps.length)); return 'resume'; // 剧情循环意外停了：接着往下走（走到头/节点没了时 G.play 会回到当天清晨）
};
setInterval(() => { // 用真实时间计：连续 3.5 秒“什么都没有”且当前这一步没动过，并且下一次检查时依然如此，才出手（避免卡顿时误判）
  const r = G.run, w = UI.watch, now = Date.now();
  if (!r || !r.node || document.hidden || somethingVisible()) { w.since = 0; w.armed = null; return; }
  if (!w.since) { w.since = now; return; }
  if (now - w.since < 3500 || now - (G.stepT || 0) < 3500) { w.armed = null; return; }
  const sig = r.node + ':' + r.ip + ':' + G.stepT;
  if (w.armed !== sig) { w.armed = sig; return; }
  w.since = 0; w.armed = null; const k = UI.recover('idle'); if (k) console.warn('watchdog recovered:', k, r.node, r.ip);
}, 500);
})(window.PALACE = window.PALACE || {});
