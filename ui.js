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
  document.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !document.activeElement.matches('input')) { if (!$('#choices').children.length) UI.advance(); } });
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
UI.modal = function (title, html, buttons) {
  return new Promise(res => {
    const m = $('#modal'); m.querySelector('.mtitle').innerHTML = title; m.querySelector('.mbody').innerHTML = html;
    const bar = m.querySelector('.mbtns'); bar.innerHTML = '';
    (buttons || [{ t: '知道了' }]).forEach(b => { const btn = el('button', 'btn ' + (b.cls || ''), b.t); btn.onclick = () => { AU.sfx('tap'); hide('#modal'); res(b.v); }; bar.appendChild(btn); });
    show('#modal');
  });
};

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
  if (UI.skip) return; UI.skip = true; UI.skipHold = !!hold; $('#btnSkip').classList.add('on'); skipBadge();
  if (sayState && sayState.done) setTimeout(() => UI.skip && sayState && sayState.done && UI.advance(), 30);
  else if (sayState && (skipAll() || G.isRead(sayState.node, sayState.key))) sayState.finish();
  else if (sayState) { UI.stopSkip(); UI.toast('已到未读剧情', 'info', 1100); }
};
UI.stopSkip = function () { if (!UI.skip) return; UI.skip = false; UI.skipHold = false; $('#btnSkip').classList.remove('on'); skipBadge(); };
UI.setAuto = function (on) { UI.auto = !!on; $('#btnAuto').classList.toggle('on', UI.auto); skipBadge(); if (UI.auto && sayState && sayState.done) sayState.autoT = setTimeout(() => UI.auto && sayState && sayState.done && UI.advance(), 900); };
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
    sayState = { done: false, finish: null, res, my, node, key };
    const me = sayState;
    const finishType = () => { tx.innerHTML = esc(text).replace(/\n/g, '<br>'); i = chars.length; G.stage.talking = false; d.classList.add('done'); me.done = true; G.markRead(node, key);
      if (UI.skip) setTimeout(() => sayState === me && UI.skip && UI.advance(), 30);
      else if (UI.auto) me.autoT = setTimeout(() => sayState === me && UI.auto && !UI.skip && UI.advance(), 1100 + chars.length * 55); };
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
UI.deathCard = function (d, isNew, mem) {
  return new Promise(res => {
    const ov = $('#deathOv'); $('#stage').classList.add('gray');
    ov.querySelector('.dno').textContent = d.extra ? `番外第 ${+d.id.slice(1)} 种死法` : `第 ${+d.id} 种死法`;
    ov.querySelector('.dtitle').textContent = '《' + d.title + '》';
    ov.querySelector('.dcat').textContent = (P.DEATH_CATS[d.cat] || '') + ' ' + d.cat + ' ｜ ' + d.ch + ' ｜ 累计死亡 ' + G.meta.totalDeaths + ' 次';
    ov.querySelector('.ddesc').textContent = G.render(d.desc.replace(/【姓】/g, '{姓}').replace(/【玩家名】/g, '{现代名}'));
    ov.querySelector('.droast').textContent = G.render(d.roast || '');
    const mm = ov.querySelector('.dmem'); const mi = mem && P.MEM_MAP[mem]; mm.innerHTML = mi ? `🔮 获得记忆碎片：<b>${esc(mi.title)}</b>` : ''; mm.style.display = mi ? '' : 'none';
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
UI.station = function (d) {
  const ov = $('#stationOv'); AU.setMood('bridge'); G.run.mood = 'bridge';
  const td = G.meta.totalDeaths;
  const greet = G.render(MP_GREET[Math.min(MP_GREET.length - 1, td <= 1 ? 0 : 1 + ((td * 7) % (MP_GREET.length - 1)))]);
  let lore = '';
  if (td >= 3 && td % 2 === 1) lore = MP_LORE[((td - 3) / 2 | 0) % MP_LORE.length];
  const lines = [greet, G.render(d.roast || ''), '💡 孟婆小提示：' + G.render(d.hint || '多死几次就知道了。')];
  if (lore) lines.push(lore);
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
  ov.querySelector('.gcount').innerHTML = `已收录 <b>${n}</b> / 100　番外 <b>${P.DEATHS.filter(d => d.extra && G.meta.deaths[d.id]).length}</b> / ${P.DEATHS.filter(d => d.extra).length}　记忆 <b>${Object.keys(G.meta.mems).length}</b> / 24`;
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
  } else {
    P.MEMORIES.forEach(m => {
      const got = G.meta.mems[m.id];
      const cell = el('div', 'mcell' + (got ? ' got' : ''), `<i>${m.id}</i><b>${got ? esc(m.title) : '？？？'}</b><small>${got ? esc(m.text || m.src) : (m.chap && P.chapters['ch' + m.chap] ? (G.CH_NAME['ch' + m.chap] || '') + '可获得 · ' + esc(m.riddle || '') : '后续章节开放')}</small>`);
      grid.appendChild(cell);
    });
  }
  ov.querySelector('.gclose').onclick = () => { AU.sfx('tap'); hide('#galleryOv'); };
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
  let armed = false; $('#sWipe').onclick = () => { if (!armed) { armed = true; $('#sWipe').textContent = '⚠️ 再点一次确认清除（不可恢复）'; return; } G.wipe(); hide('#modal'); G.stop(); UI.title(); UI.toast('存档已清除', 'info'); };
};

/* ---------- 标题 ---------- */
UI.title = function () {
  G.stop(); document.body.classList.add('nohud');
  ['#deathOv', '#stationOv', '#galleryOv', '#endOv', '#nameOv'].forEach(hide);
  G.stage.bg = 'title'; G.stage.prevBg = null; G.stage.cat = { pos: 0.86, x: 0.86, mood: 'happy' };
  G.stage.cast = []; G.stage.titleMode = true;
  const land = G.layout().land;
  P.G.setTitleCast && P.G.setTitleCast();
  AU.setMood('title');
  const ov = show('#titleOv');
  const has = G.run && G.run.node;
  ov.querySelector('.tcont').style.display = has ? '' : 'none';
  const n = Object.keys(G.meta.deaths).filter(k => !P.DEATH_MAP[k].extra).length;
  ov.querySelector('.tinfo').innerHTML = (G.meta.totalDeaths ? `第 ${G.meta.lives} 世 · 图鉴 ${n}/100` : '一百种死法，总有一种适合你') + (G.meta.clear.ch1 ? ' · 🏅 ' + ['ch1', 'ch2', 'ch3'].filter(k => G.meta.clear[k]).map(k => G.CH_NAME[k]).join('、') + '已通关' : '');
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
  const list = ['ch1', 'ch2', 'ch3'].filter(k => P.chapters[k]);
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
  return rows.length ? '<hr>' + rows.map(x => `<p><b>${x[0]} ${x[1]}</b><br><small>${x[2]}</small></p>`).join('') : '';
};
})(window.PALACE = window.PALACE || {});
