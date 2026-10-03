/* engine.js —— 剧情引擎：存档 / 状态 / 剧本解释器 / 舞台渲染
   章节脚本通过 PALACE.registerChapter() 注册，节点 id 全局唯一（建议加章节前缀），
   以后序章 + 五章可以直接按顺序加载合并成一个游戏。 */
(function (P) {
'use strict';
const A = P.ART, AU = P.AUDIO;
const $ = s => document.querySelector(s);
const SAVE_KEY = 'palace100_save', SAVE_VERSION = 1;
const G = P.G = {};
P.chapters = {}; P.NODES = {}; P.DEATH_MEM = {}; P.DEATH_CONT = {};
P.registerChapter = function (ch) {
  P.chapters[ch.id] = ch;
  Object.keys(ch.nodes).forEach(k => { if (P.NODES[k]) console.warn('duplicate node', k); P.NODES[k] = ch.nodes[k]; });
  Object.assign(P.DEATH_MEM, ch.deathMems || {}); Object.assign(P.DEATH_CONT, ch.deathCont || {});
};

/* ---------- 存档（版本化） ---------- */
const STAT_KEYS = ['圣眷', '名声', '健康', '警觉', '疑心', '规矩'];
const STAT_ICON = { 圣眷: '☀️', 名声: '🌸', 健康: '💊', 警觉: '🔍', 疑心: '👁️', 规矩: '📏' };
G.STAT_KEYS = STAT_KEYS; G.STAT_ICON = STAT_ICON;
function freshMeta() { return { v: SAVE_VERSION, names: { modern: '', surname: '', given: '' }, deaths: {}, mems: {}, know: {}, lives: 1, totalDeaths: 0, clear: {}, settings: { music: 0.5, sfx: 0.8, speech: true, speed: 2 }, created: Date.now() }; }
function freshRun(ch) { return { ch: ch || 'ch0', node: null, ip: 0, day: 0, time: '', stats: { 圣眷: 10, 名声: 30, 健康: 80, 警觉: 10, 疑心: 0, 规矩: 30 }, flags: {}, items: {}, cnt: {}, scene: { bg: 'title', cast: [], cat: null }, cp: null, started: Date.now() }; }
G.meta = freshMeta(); G.run = null;
function migrate(d) {
  if (!d || typeof d !== 'object') return null;
  if (!d.meta) return null;
  // v1 是首个版本；以后在这里加 if (d.v < 2) {...}
  d.meta = Object.assign(freshMeta(), d.meta); d.meta.settings = Object.assign(freshMeta().settings, d.meta.settings || {});
  d.v = SAVE_VERSION; return d;
}
G.load = function () {
  try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) return false; const d = migrate(JSON.parse(raw)); if (!d) return false; G.meta = d.meta; G.run = d.run || null; return true; }
  catch (e) { console.warn('load failed', e); return false; }
};
G.save = function () {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: SAVE_VERSION, meta: G.meta, run: G.run, at: Date.now() })); } catch (e) { /* 无痕模式可能写不进去 */ }
};
G.wipe = function () { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} G.meta = freshMeta(); G.run = null; };
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------- 名字 ---------- */
G.palaceName = () => (G.meta.names.surname || '') + (G.meta.names.given || '');
G.hasLatin = s => /[A-Za-z]/.test(s || '');
G.hasTaboo = s => /[景珩]/.test(s || '');
G.render = function (text) {
  if (!text) return '';
  const n = G.meta.names, given = n.given || '', die = given ? (given.length >= 2 ? given.slice(-1).repeat(2) : given.repeat(2)) : '';
  return String(text).replace(/\{现代名\}/g, n.modern || '无名氏').replace(/\{姓\}/g, n.surname || '某').replace(/\{名\}/g, given || '某某')
    .replace(/\{宫名\}/g, G.palaceName() || '某某').replace(/\{叠字\}/g, die).replace(/\{世\}/g, G.meta.lives).replace(/\{死\}/g, G.meta.totalDeaths)
    .replace(/\{位份\}/g, (G.run && G.run.flags.rank) || '秀女');
};

/* ---------- 状态操作 ---------- */
G.stat = k => G.run.stats[k];
G.flag = k => G.run && G.run.flags[k];
G.item = k => G.run && (G.run.items[k] || 0);
G.mem = k => !!G.meta.mems[k];
G.know = k => !!G.meta.know[k];
G.died = id => !!G.meta.deaths[id];
G.cnt = k => (G.run && G.run.cnt[k]) || 0;
G.fx = function (fx, silent) {
  const out = [];
  Object.keys(fx || {}).forEach(k => { if (!(k in G.run.stats)) return; const v = Math.max(0, Math.min(100, G.run.stats[k] + fx[k])); const d = v - G.run.stats[k]; G.run.stats[k] = v; if (d) out.push([k, d]); });
  if (!silent) out.forEach(([k, d], i) => setTimeout(() => P.UI.toast(STAT_ICON[k] + ' ' + k + ' ' + (d > 0 ? '+' : '') + d, d > 0 ? 'up' : 'down'), i * 160));
  P.UI.hud();
};
G.unlockMem = function (id) {
  if (G.meta.mems[id]) return false; G.meta.mems[id] = { at: Date.now(), life: G.meta.lives };
  const m = P.MEM_MAP[id]; P.UI.toast('🔮 获得记忆碎片：' + (m ? m.title : id), 'mem', 2600); AU.sfx('sparkle'); G.save(); return true;
};

/* ---------- 舞台 ---------- */
const stage = { bg: 'title', prevBg: null, bgFade: 1, cast: [], cat: null, emotes: [], shake: 0, flash: 0, flashCol: '#fff', t: 0, speaker: null, talking: false, ghostAnim: 0, particles: [], gray: 0 };
G.stage = stage;
let cv, cx, W = 0, H = 0, DPR = 1, LAYOUT = {};
const POS = { LL: 0.12, L: 0.25, CL: 0.38, C: 0.5, CR: 0.62, R: 0.75, RR: 0.88 };
function layout() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  const r = $('#app').getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height);
  cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const land = W > H * 1.15;
  document.body.classList.toggle('land', land); document.body.classList.toggle('port', !land);
  LAYOUT = { land, sw: land ? W * 0.58 : W, base: land ? H * 1.0 : H * 0.79, maxH: land ? H * 0.86 : H * 0.6 };
}
G.layout = () => LAYOUT;
const BASE = () => (stage.titleMode && !LAYOUT.land ? H * 0.7 : LAYOUT.base);
function castScale(n) { const L = LAYOUT, per = L.sw / Math.max(2, n); return Math.min(L.maxH, per / 0.6) / 330; }
G.charScreen = function (id) { // 角色在屏幕上的头顶位置（给对话气泡的尾巴用）
  const c = stage.cast.find(k => k.id === id); if (!c) return null;
  const s = castScale(stage.cast.length); return { x: c.x * LAYOUT.sw, y: BASE() - 300 * s };
};
function frame(ts) {
  const now = ts / 1000, dt = Math.min(0.05, now - (frame.last || now)); frame.last = now; stage.t += dt;
  const t = stage.t;
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cx.save();
  if (stage.shake > 0) { stage.shake = Math.max(0, stage.shake - dt * 2.5); cx.translate((Math.random() - 0.5) * 16 * stage.shake, (Math.random() - 0.5) * 12 * stage.shake); }
  if (stage.prevBg && stage.bgFade < 1) { A.drawBG(cx, stage.prevBg, W, H, t); cx.globalAlpha = stage.bgFade; stage.bgFade = Math.min(1, stage.bgFade + dt * 2.2); }
  A.drawBG(cx, stage.bg, W, H, t); cx.globalAlpha = 1;
  if (stage.bg === 'rain' || stage.bg === 'roof' || stage.bg === 'kitchen' || stage.bg === 'room_night') { cx.fillStyle = 'rgba(30,20,60,0.12)'; cx.fillRect(0, 0, W, H); }
  // 角色
  const n = stage.cast.length, s = castScale(n);
  stage.cast.forEach((c, i) => {
    const tx = (POS[c.pos] != null ? POS[c.pos] : c.pos) || 0.5;
    if (c.x == null) c.x = tx + (c.from || 0); c.x += (tx - c.x) * Math.min(1, dt * 7);
    c.a = Math.min(1, (c.a || 0) + dt * 4); if (c.leaving) c.a = Math.max(0, c.a - dt * 8);
    if (!c.blinkT || t > c.blinkT + 0.14) { if (!c.blinkT || t > c.blinkT + 0.14 + (c.blinkGap || 3)) { c.blinkT = t; c.blinkGap = 2 + Math.random() * 3; } }
    const blink = t - c.blinkT < 0.13;
    const speaking = stage.speaker === c.id, jump = c.jump ? Math.max(0, c.jump) : 0;
    if (c.jump) c.jump -= dt * 3;
    let y = BASE() - Math.sin(Math.max(0, jump) * Math.PI) * 30;
    let sc = s * (speaking ? 1.03 : 1) * (c.big || 1);
    const ghost = c.ghost;
    if (ghost) y -= Math.min(1, (t - (c.ghostT || t))) * 40;
    A.drawChar(cx, c.id, c.x * LAYOUT.sw, y, sc, { t: t + i * 0.7, phase: i, face: c.face, talk: speaking && stage.talking && Math.sin(t * 22) > 0, blink: blink && c.face !== 'dead', ghost, stone: c.stone, pose: c.pose, prop: c.prop, flip: c.flip, alpha: c.a * (speaking || !stage.speaker || stage.speaker === 'n' || stage.speaker === 'os' ? 1 : 0.92), tilt: c.tilt, squash: c.squash });
  });
  stage.cast = stage.cast.filter(c => !(c.leaving && c.a <= 0));
  if (stage.cat) { const k = stage.cat; k.x += ((POS[k.pos] || k.pos) - k.x) * Math.min(1, dt * (k.run ? 3 : 6)); A.drawCat(cx, k.x * LAYOUT.sw, BASE() - 4, s * 1.1, { t, mood: k.mood, run: k.run, flip: k.flip }); }
  // 情绪气泡
  stage.emotes = stage.emotes.filter(e => { e.k += dt / 1.6; if (e.k >= 1) return false; const p = G.charScreen(e.id); if (!p) return false; A.drawEmote(cx, p.x + 42 * s * 3, p.y + 10, Math.max(0.6, s * 3.2), e.e, e.k); return true; });
  // 粒子
  stage.particles = stage.particles.filter(p => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g || 0) * dt; p.r += (p.vr || 0) * dt; if (p.life <= 0) return false;
    cx.save(); cx.globalAlpha = Math.min(1, p.life * 2); cx.translate(p.x, p.y); cx.rotate(p.r);
    if (p.kind === 'star') A.util.star(cx, 0, 0, p.size, p.col); else if (p.kind === 'petal') { A.util.E(cx, 0, 0, p.size, p.size * 0.6); A.util.F(cx, p.col); } else { cx.fillStyle = p.col; cx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); }
    cx.restore(); return true; });
  cx.restore();
  if (stage.flash > 0) { cx.fillStyle = stage.flashCol; cx.globalAlpha = Math.min(1, stage.flash); cx.fillRect(0, 0, W, H); cx.globalAlpha = 1; stage.flash = Math.max(0, stage.flash - dt * 2.5); }
  if (G.onFrame) G.onFrame(dt, t);
  requestAnimationFrame(frame);
}
G.burst = function (kind, x, y, n, cols) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260; stage.particles.push({ kind, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 160, g: 420, r: Math.random() * 6, vr: (Math.random() - 0.5) * 10, life: 1 + Math.random() * 0.8, size: 5 + Math.random() * 6, col: cols[i % cols.length] }); } };
G.confetti = () => G.burst('rect', W / 2, H * 0.35, 80, ['#e2577e', '#f2c24d', '#7fb8a8', '#b9a7d6', '#fff']);

function setCast(list) {
  const keep = {};
  stage.cast.forEach(c => { keep[c.id] = c; });
  stage.cast = list.map(item => {
    const [id, face, pos, extra] = Array.isArray(item) ? item : [item.id, item.face, item.pos, item];
    const old = keep[id];
    const c = old || { id, a: 0, from: (POS[pos] || 0.5) < 0.5 ? -0.25 : 0.25 };
    c.face = face || c.face || 'normal'; c.pos = pos || c.pos || 'C'; c.leaving = false;
    ['ghost', 'stone', 'pose', 'prop', 'flip', 'big', 'tilt'].forEach(k => { c[k] = extra && extra[k] !== undefined ? extra[k] : (old ? undefined : undefined); });
    return c;
  });
}
function sceneSnapshot() { return { bg: stage.bg, cast: stage.cast.filter(c => !c.leaving).map(c => [c.id, c.face, c.pos, { pose: c.pose, prop: c.prop, flip: c.flip, ghost: c.ghost }]), cat: stage.cat ? { pos: stage.cat.pos, mood: stage.cat.mood } : null }; }
function restoreScene(sc) {
  if (!sc) return; stage.bg = sc.bg || 'courtyard'; stage.prevBg = null; stage.bgFade = 1; stage.cast = []; setCast(sc.cast || []); stage.cast.forEach(c => { c.x = POS[c.pos] || 0.5; c.a = 1; });
  stage.cat = sc.cat ? { pos: sc.cat.pos, x: POS[sc.cat.pos] || 0.5, mood: sc.cat.mood } : null;
}

/* ---------- 剧本解释器 ---------- */
let gen = 0;
G.busy = false;
const sleep = ms => new Promise(r => setTimeout(r, ms));
G.sleep = sleep;
G.play = async function (node, ip) {
  const my = ++gen; stage.titleMode = false; P.UI.hud(); G.run.node = node; G.run.ip = ip || 0; G.save();
  try {
    while (my === gen) {
      const steps = P.NODES[G.run.node];
      if (!steps) { console.error('missing node', G.run.node); return; }
      if (G.run.ip >= steps.length) return;
      const st = steps[G.run.ip]; G.run.ip++;
      const r = await exec(st, my);
      if (my !== gen) return;
      if (r && r.go) { G.run.node = r.go; G.run.ip = 0; }
      G.run.scene = sceneSnapshot();
      G.save();
    }
  } catch (e) { if (e && e.__death) return; console.error(e); }
};
G.stop = () => { gen++; P.UI.hideDialog(); P.UI.hideChoices(); };
G.alive = my => my === gen;
async function execList(list, my) { for (const st of list) { const r = await exec(st, my); if (my !== gen) return null; if (r && (r.go || r.dead)) return r; } return null; }
async function exec(st, my) {
  if (typeof st === 'function') { const r = st(G); return r && r.then ? await r : r; }
  if (st.if !== undefined) {
    const ok = typeof st.if === 'function' ? st.if(G) : !!st.if;
    if (ok) { if (st.then) { const r = await execList(st.then, my); if (r) return r; if (st.go) return { go: st.go }; if (st.death) return G.death(st.death); return null; } if (st.go) return { go: st.go }; if (st.death) return G.death(st.death); }
    else { if (st.else && Array.isArray(st.else)) return execList(st.else, my); if (st.else) return { go: st.else }; }
    return null;
  }
  if (st.bg) { if (st.music) G.run.mood = st.music;
    await P.UI.transition(st.trans || 'fade', () => { stage.prevBg = null; stage.bg = st.bg; if (st.cast) setCast(st.cast); else if (!st.keepCast) stage.cast = []; stage.cat = st.cat || null; if (stage.cat) stage.cat.x = POS[stage.cat.pos] || 0.5; restoreXs(); }); if (st.music) AU.setMood(st.music); return null; }
  if (st.music) { AU.setMood(st.music); G.run.mood = st.music; if (Object.keys(st).length === 1) return null; }
  if (st.cast) { setCast(st.cast); return null; }
  if (st.enter) { const list = sceneSnapshot().cast; list.push([st.enter, st.face, st.pos || 'R', st]); setCast(list); if (st.sfx) AU.sfx(st.sfx); await sleep(250); return null; }
  if (st.exit) { stage.cast.forEach(c => { if (c.id === st.exit) c.leaving = true; }); await sleep(200); return null; }
  if (st.face) { Object.keys(st.face).forEach(id => { const c = stage.cast.find(k => k.id === id); if (c) c.face = st.face[id]; }); return null; }
  if (st.move) { Object.keys(st.move).forEach(id => { const c = stage.cast.find(k => k.id === id); if (c) c.pos = st.move[id]; }); await sleep(300); return null; }
  if (st.look) { Object.keys(st.look).forEach(id => { const c = stage.cast.find(k => k.id === id); if (c) Object.assign(c, st.look[id]); }); return null; }
  if (st.cat !== undefined) { if (!st.cat) stage.cat = null; else { stage.cat = Object.assign(stage.cat || { x: (POS[st.cat.from] || 1.2) }, st.cat); } return null; }
  if (st.s !== undefined) { // 台词
    if (st.f) { const c = stage.cast.find(k => k.id === st.s); if (c) c.face = st.f; }
    if (st.emote) stage.emotes.push({ id: st.s === 'os' ? 'me' : st.s, e: st.emote, k: 0 });
    if (st.jump) { const c = stage.cast.find(k => k.id === (st.s === 'os' ? 'me' : st.s)); if (c) c.jump = 1; }
    if (st.sfx) AU.sfx(st.sfx);
    if (st.shake) stage.shake = st.shake;
    await P.UI.say(st.s, G.render(st.t), st, my); return null;
  }
  if (st.c) { const r = await P.UI.choose(st.c, st, my); if (my !== gen || !r) return null; return applyChoice(r, my); }
  if (st.fx) { G.fx(st.fx, st.silent); return null; }
  if (st.set) { Object.assign(G.run.flags, st.set); return null; }
  if (st.inc) { G.run.cnt[st.inc] = (G.run.cnt[st.inc] || 0) + (st.by || 1); return null; }
  if (st.item) { G.run.items[st.item] = (G.run.items[st.item] || 0) + (st.n == null ? 1 : st.n); if (!st.silent) P.UI.toast((st.n < 0 ? '失去：' : '获得：') + st.item, 'item'); AU.sfx(st.n < 0 ? 'tap' : 'pop'); return null; }
  if (st.mem) { G.unlockMem(st.mem); return null; }
  if (st.learn) { G.meta.know[st.learn] = true; G.save(); return null; }
  if (st.sfx) { AU.sfx(st.sfx); return null; }
  if (st.shake) { stage.shake = st.shake; return null; }
  if (st.flash) { stage.flash = 1; stage.flashCol = st.flash === true ? '#fff' : st.flash; return null; }
  if (st.emote) { stage.emotes.push({ id: st.who || 'me', e: st.emote, k: 0 }); return null; }
  if (st.wait) { await sleep(st.wait); return null; }
  if (st.toast) { P.UI.toast(G.render(st.toast), st.kind || 'info', st.ms); return null; }
  if (st.confetti) { G.confetti(); return null; }
  if (st.day !== undefined) {
    G.run.day = st.day; G.run.time = st.time || '晨'; G.run.ch = st.ch || G.run.ch;
    G.checkpoint(st.label);
    P.UI.hud(); await P.UI.dayCard(st.day, st.time || '晨', st.date); return null;
  }
  if (st.time) { G.run.time = st.time; P.UI.hud(); P.UI.toast('🕯️ ' + st.time, 'info', 1200); return null; }
  if (st.checkpoint) { G.checkpoint(st.checkpoint); return null; }
  if (st.chapterEnd) { P.UI.hideDialog(); await P.UI.chapterEnd(st.chapterEnd, st); return null; }
  if (st.title) { await P.UI.chapterCard(st.title, st.sub); return null; }
  if (st.input) { await P.UI.nameInput(st.input, st); return null; }
  if (st.game) { const res = await P.GAMES[st.game].play(G, st); if (my !== gen) return null; G.run.flags['game_' + st.game] = res; if (res && res.death) return G.death(res.death); return st.after ? { go: st.after } : null; }
  if (st.death) return G.death(st.death, st);
  if (st.go) return { go: st.go };
  if (st.hud !== undefined) { document.body.classList.toggle('nohud', !st.hud); return null; }
  console.warn('unknown step', st); return null;
}
function restoreXs() { stage.cast.forEach(c => { c.x = null; }); }
async function applyChoice(o, my) {
  AU.sfx('select');
  if (o.inc) G.run.cnt[o.inc] = (G.run.cnt[o.inc] || 0) + 1;
  if (o.set) Object.assign(G.run.flags, o.set);
  if (o.fx) G.fx(o.fx);
  if (o.item) G.run.items[o.item] = (G.run.items[o.item] || 0) + 1;
  if (o.then) { const r = await execList(o.then, my); if (my !== gen) return null; if (r) return r; }
  if (o.death) return G.death(o.death);
  if (o.go) return { go: o.go };
  return null;
}

/* ---------- 检查点 / 死亡 / 重生 ---------- */
G.checkpoint = function (label) {
  const snap = clone(G.run); snap.cp = null; snap.ip = G.run.ip - 1; snap.scene = sceneSnapshot();
  G.run.cp = snap; G.run.cpLabel = label || ('第' + G.run.day + '天');
};
G.death = async function (id, st) {
  const my = ++gen; const d = P.DEATH_MAP[id];
  if (!d) { console.error('unknown death', id); return { dead: true }; }
  P.UI.hideChoices(); P.UI.hideDialog();
  const rec = G.meta.deaths[id], isNew = !rec;
  G.meta.deaths[id] = { n: (rec ? rec.n : 0) + 1, first: rec ? rec.first : G.meta.lives, at: Date.now() };
  G.meta.totalDeaths++; G.meta.lives++;
  const mem = P.DEATH_MEM[id]; let gotMem = null; if (mem && !G.meta.mems[mem]) { G.meta.mems[mem] = { at: Date.now(), life: G.meta.lives - 1 }; gotMem = mem; }
  G.run.lastDeath = id; G.save();
  // 舞台演出：变成小幽灵飘走
  AU.sfx('death');
  const me = stage.cast.find(c => c.id === 'me' || c.id === 'modern');
  if (me && id !== '012') { me.face = 'dead'; me.ghost = true; me.ghostT = stage.t; } else if (me) { me.face = 'dead'; me.stone = true; }
  if (!me && G.run.ch !== 'ch0') { setCast([['me', 'dead', 'C', { ghost: true }]]); }
  stage.shake = 0.8; stage.flash = 0.6; stage.flashCol = '#fff';
  await sleep(1000);
  if (my !== gen) return { dead: true };
  await P.UI.deathCard(d, isNew, gotMem);
  if (my !== gen) return { dead: true };
  const cont = P.DEATH_CONT[id];
  if (cont) { G.play(cont, 0); return { dead: true }; }
  P.UI.station(d);
  throw { __death: true };
};
G.rebirth = function (fromStart) {
  AU.stopSpeak();
  let cp = G.run && G.run.cp;
  if (fromStart || !cp) {
    const keep = G.run; G.run = freshRun('ch0');
    const ch0 = P.chapters.ch0; const start = ch0.rebirthStart || ch0.start;
    restoreScene({ bg: 'carriage', cast: [] }); G.play(start, 0); return;
  }
  const base = clone(cp); base.cp = cp; base.cpLabel = G.run.cpLabel; G.run = base;
  restoreScene(base.scene);
  G.play(base.node, base.ip);
};
G.resume = function () { if (!G.run || !G.run.node) return false; restoreScene(G.run.scene); P.UI.hud(); AU.setMood(G.run.mood || 'day'); G.play(G.run.node, G.run.ip); return true; };
G.newGame = function () { G.run = freshRun('ch0'); restoreScene({ bg: 'room', cast: [] }); P.UI.hud(); G.play(P.chapters.ch0.start, 0); };
G.startNode = function (node, run) { G.run = Object.assign(freshRun(), run || {}); G.play(node, 0); };

/* ---------- 启动 ---------- */
G.boot = function () {
  cv = $('#stage'); cx = cv.getContext('2d');
  layout(); window.addEventListener('resize', () => { layout(); P.UI.reposition && P.UI.reposition(); });
  window.addEventListener('orientationchange', () => setTimeout(layout, 200));
  G.load();
  Object.assign(AU.cfg, G.meta.settings);
  P.UI.init();
  requestAnimationFrame(frame);
  P.UI.title();
};
})(window.PALACE = window.PALACE || {});
