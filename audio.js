/* audio.js —— 纯 WebAudio 合成：古风背景音乐（简谱乐句 + 变奏 + 交叉淡入淡出）/ 音效 / 吐槽朗读
   乐器：古筝（Karplus-Strong 拨弦）、琵琶（亮音 + 轮指）、笛/箫（正弦 + 气声 + 颤音）、木鱼/梆子、堂鼓、碰铃、低音持续音。
   调度：25ms 定时器 + 0.3s 前瞻（lookahead），同时发声数有上限，手机也不卡。 */
(function (P) {
'use strict';
const AU = P.AUDIO = { cfg: { music: 0.5, musicOn: true, sfx: 0.8, speech: true }, mood: null, ready: false };
let ctx = null, master, comp, musicBus, duckG, sfxBus, timer = null;
const ksCache = {};
const MAXV = 22; let voices = []; // 当前已排程音符的结束时间（用于限制复音数）
AU.debug = { notes: 0, skipped: 0, ticks: 0, phrases: 0, crossfades: 0, ducks: 0 };

AU.unlock = function () {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); AU.ctx = ctx;
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(master);
      duckG = ctx.createGain(); musicBus = ctx.createGain(); duckG.connect(musicBus); musicBus.connect(comp);
      sfxBus = ctx.createGain(); sfxBus.connect(comp);
      const conv = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 1.8), buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
      conv.buffer = buf; conv.connect(comp);
      AU.rev = ctx.createGain(); AU.rev.gain.value = 0.22; AU.rev.connect(conv);           // 音效混响
      const mrev = ctx.createGain(); mrev.gain.value = 0.3; musicBus.connect(mrev); mrev.connect(conv); // 音乐混响（跟随音乐音量）
      // iOS：播放一个静音 buffer 解锁
      const sb = ctx.createBufferSource(); sb.buffer = ctx.createBuffer(1, 1, 22050); sb.connect(ctx.destination); sb.start(0);
      AU.applyVol(); AU.ready = true;
      document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) { ctx.suspend(); AU.stopSpeak(); } else if (AU.unlockedOnce) ctx.resume(); });
    }
    AU.unlockedOnce = true;
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    if (!timer) timer = setInterval(tick, 25);
    if (AU.mood && !track) startTrack(AU.mood);
  } catch (e) { /* 静默失败 */ }
};
AU.applyVol = function () {
  if (!ctx) return;
  const mv = AU.cfg.musicOn === false ? 0 : AU.cfg.music * 0.6;
  musicBus.gain.setTargetAtTime(mv, ctx.currentTime, 0.08); sfxBus.gain.value = AU.cfg.sfx * 0.9;
};
/* 说话/音效时把音乐压低一点 */
let duckUntil = 0;
AU.duck = function (level, hold) {
  if (!ctx) return; const t = ctx.currentTime; AU.debug.ducks++;
  duckUntil = Math.max(duckUntil, t + (hold || 1));
  duckG.gain.cancelScheduledValues(t); duckG.gain.setTargetAtTime(level == null ? 0.35 : level, t, 0.06);
  duckG.gain.setTargetAtTime(1, duckUntil, 0.35);
};
AU.unduck = function () { if (!ctx) return; const t = ctx.currentTime; duckUntil = t; duckG.gain.cancelScheduledValues(t); duckG.gain.setTargetAtTime(1, t + 0.2, 0.35); };

function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function canVoice(t, prio) { const now = ctx.currentTime; voices = voices.filter(e => e > now); if (voices.length >= (prio ? MAXV + 6 : MAXV)) { AU.debug.skipped++; return false; } return true; }
function addVoice(end) { voices.push(end); AU.debug.notes++; }

function ksBuffer(m, dur, bright) { // Karplus-Strong 拨弦（按音高缓存）
  const key = m + '|' + bright + '|' + dur; if (ksCache[key]) return ksCache[key];
  const sr = ctx.sampleRate, n = Math.floor(sr * dur), buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / midiHz(m))), ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / N * Math.PI));
  let idx = 0; const decay = 0.996 - (m > 84 ? 0.004 : 0), b = bright || 0.5;
  for (let i = 0; i < n; i++) { const v = ring[idx], nx = ring[(idx + 1) % N]; ring[idx] = (v * b + nx * (1 - b)) * decay; d[i] = v; idx = (idx + 1) % N; }
  for (let i = 0; i < 64 && i < n; i++) d[i] *= i / 64;
  ksCache[key] = buf; return buf;
}
function pluck(m, t, vol, bus, opt) {
  opt = opt || {}; const dur = opt.dur || 1.8;
  const src = ctx.createBufferSource(); src.buffer = ksBuffer(m, opt.buf || (dur > 1.2 ? 2.4 : 1.2), opt.bright || 0.5);
  if (opt.bend) { src.playbackRate.setValueAtTime(1, t); src.playbackRate.linearRampToValueAtTime(1 + opt.bend, t + 0.12); src.playbackRate.linearRampToValueAtTime(1, t + 0.32); }
  if (opt.slideFrom) { src.playbackRate.setValueAtTime(opt.slideFrom, t); src.playbackRate.linearRampToValueAtTime(1, t + 0.09); }
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opt.lp || 3800;
  src.connect(f); f.connect(g); g.connect(bus || musicBus); if (opt.rev && AU.rev) g.connect(AU.rev);
  src.start(t); src.stop(t + dur + 0.05); return src;
}
function tone(type, f0, f1, t, dur, vol, bus, opt) {
  opt = opt || {};
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (opt.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o; if (opt.lp) { const f = ctx.createBiquadFilter(); f.type = opt.ft || 'lowpass'; f.frequency.value = opt.lp; f.Q.value = opt.q || 1; o.connect(f); node = f; }
  node.connect(g); g.connect(bus || sfxBus); if (opt.rev && AU.rev) g.connect(AU.rev);
  o.start(t); o.stop(t + dur + 0.05); return o;
}
let noiseBuf = null;
function noise(t, dur, vol, ft, freq, q, bus, f1) {
  if (!noiseBuf) { const n = ctx.sampleRate * 1.5; noiseBuf = ctx.createBuffer(1, n, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = ft || 'bandpass'; f.frequency.setValueAtTime(freq || 1000, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q || 1;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus || sfxBus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}

/* ---------- 乐器 ---------- */
const INST = {
  zheng(m, t, len, vol, bus, o) { pluck(m, t, vol, bus, { dur: Math.min(2.4, 0.5 + len * 0.9), bright: 0.5, bend: o.bend, slideFrom: o.slide }); return t + Math.min(2.4, 0.5 + len * 0.9); },
  pipa(m, t, len, vol, bus, o) {
    if (len >= 0.6 && o.trem) { const n = Math.min(7, Math.floor(len / 0.075)); for (let i = 0; i < n; i++) pluck(m, t + i * 0.075, vol * (0.85 - i * 0.06), bus, { dur: 0.35, bright: 0.72, buf: 1.2, lp: 4200 }); return t + len; }
    pluck(m, t, vol * 1.05, bus, { dur: Math.min(1.1, 0.35 + len * 0.6), bright: 0.72, buf: 1.2, lp: 4500, bend: o.bend }); return t + Math.min(1.1, 0.35 + len * 0.6);
  },
  flute(m, t, len, vol, bus, o) { // 笛子：明亮；o.xiao=箫：更暗更气声
    const f = midiHz(m + (o.xiao ? 0 : 12)), dur = Math.max(0.18, len * 0.96), a = o.xiao ? 0.09 : 0.045;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.setValueAtTime(vol * 0.85, t + Math.max(a, dur - 0.08)); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.06);
    const o1 = ctx.createOscillator(); o1.type = 'sine'; const o2 = ctx.createOscillator(); o2.type = 'triangle';
    const g2 = ctx.createGain(); g2.gain.value = o.xiao ? 0.12 : 0.25;
    if (o.from) { o1.frequency.setValueAtTime(o.from, t); o1.frequency.exponentialRampToValueAtTime(f, t + 0.07); o2.frequency.setValueAtTime(o.from * 2, t); o2.frequency.exponentialRampToValueAtTime(f * 2, t + 0.07); }
    else { o1.frequency.setValueAtTime(f * (o.scoop ? 0.94 : 1), t); o1.frequency.exponentialRampToValueAtTime(f, t + 0.06); o2.frequency.setValueAtTime(f * 2, t); }
    if (dur > 0.45) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.wobble ? 3.2 : 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * (o.wobble ? 0.03 : 0.012), t + Math.min(0.5, dur * 0.6)); l.connect(lg); lg.connect(o1.frequency); l.start(t); l.stop(t + dur + 0.1); }
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.xiao ? 1800 : 3600;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(bus);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
    noise(t, 0.08, vol * (o.xiao ? 0.5 : 0.3), 'bandpass', f * 2, 2, bus); // 气声
    return t + dur + 0.08;
  },
  bass(m, t, len, vol, bus) { pluck(m, t, vol, bus, { dur: Math.min(2.4, 0.6 + len), lp: 900, bright: 0.3 }); return t + Math.min(2.4, 0.6 + len); },
  wood(t, vol, bus, hi) { tone('sine', hi ? 1250 : 820, hi ? 1150 : 760, t, 0.06, vol, bus); noise(t, 0.015, vol * 0.5, 'bandpass', 2500, 3, bus); return t + 0.07; },
  drum(t, vol, bus) { tone('sine', 150, 55, t, 0.32, vol, bus); noise(t, 0.08, vol * 0.35, 'lowpass', 700, 1, bus); return t + 0.33; },
  bell(m, t, vol, bus) { tone('sine', midiHz(m), null, t, 1.6, vol, bus, { a: 0.003 }); tone('sine', midiHz(m) * 2.76, null, t, 0.6, vol * 0.3, bus, { a: 0.003 }); return t + 1.6; },
  hat(t, vol, bus) { noise(t, 0.05, vol, 'highpass', 6500, 0.7, bus); return t + 0.06; },
  kick(t, vol, bus) { tone('sine', 110, 42, t, 0.24, vol, bus); return t + 0.25; },
  pad(m, t, dur, vol, bus) { [0, 7].forEach(iv => tone('triangle', midiHz(m + iv), null, t, dur, vol * (iv ? 0.6 : 1), bus, { a: Math.min(0.8, dur * 0.3), lp: 700 })); return t + dur; },
  gong(t, vol, bus) { [1, 1.48, 2.1].forEach((r, i) => tone('sine', 98 * r, 96 * r, t, 2.4 - i * 0.5, vol / (i + 1), bus, { a: 0.01 })); return t + 2.4; },
  slide(t, vol, bus, up) { tone('sine', up ? 500 : 1200, up ? 1300 : 420, t, 0.35, vol, bus); return t + 0.35; },
};

/* ---------- 曲库（简谱：1-7，' 高八度，, 低八度，- 延长，0 休止；每个记号 = 八分音符，8 个一小节） ---------- */
const TRACKS = {
  title: { // 标题：典雅、好记 —— 笛子主奏，古筝分解和弦
    bpm: 76, key: 62, lead: ['flute', 'zheng', 'flute'], acc: 'arp', density: 0.8, vol: 0.5,
    phr: {
      A: '3 - - 5 6 - 5 3 | 2 - 3 5 3 - - - | 6, - 1 2 3 - 2 1 | 2 - - - - - 0 0',
      B: '5 - 6 1\' 6 - 5 3 | 5 - - 6 5 3 2 - | 1 - 2 3 5 - 3 2 | 1 - - - - - 0 0',
      C: '1\' - 6 5 6 - 5 3 | 2 3 5 6 5 - - - | 3 - 2 1 6, - 1 2 | 3 - - - - - 0 0',
    },
    bass: { A: [1, 5, 6, 2], B: [5, 5, 1, 1], C: [6, 5, 6, 1] },
    form: ['A', 'B', 'A', 'C', 'B'], perc: { wood: 'o.......' }, gliss: true, bell: 0.25,
  },
  day: { // 宫中日常：轻快俏皮（琵琶 + 梆子）
    bpm: 112, key: 65, lead: ['pipa', 'zheng', 'flute'], acc: 'pluck', density: 0.9, vol: 0.42, swing: 0.08,
    phr: {
      A: '1 2 3 5 3 2 1 0 | 2 3 5 6 5 0 3 0 | 5 6 1\' 6 5 3 2 3 | 1 - 0 6, 1 - 0 0',
      B: '3 3 5 0 3 3 6 0 | 5 6 5 3 2 0 2 0 | 3 5 3 2 1 2 6, 1 | 2 - 0 3 2 - 0 0',
      C: '6 - 5 6 1\' 0 6 5 | 3 5 6 0 5 3 2 0 | 1 2 3 0 2 3 5 0 | 6 5 3 2 1 - 0 0',
    },
    bass: { A: [1, 2, 6, 1], B: [1, 5, 6, 5], C: [6, 3, 1, 1] },
    form: ['A', 'A', 'B', 'C', 'A', 'B'], perc: { wood: 'x.o...x.', drum: 'x.......' }, slide: 0.3,
  },
  night: { // 夜：箫，稀疏的古筝
    bpm: 64, key: 57, lead: ['xiao', 'zheng'], acc: 'sparse', density: 0.5, vol: 0.42,
    phr: {
      A: '6, - - 1 2 - - - | 3 - 2 1 6, - - - | 1 - 2 3 5 - 3 2 | 3 - - - - - 0 0',
      B: '5 - 6 5 3 - - - | 2 - 3 2 1 - 6, - | 1 - - 2 3 - 2 1 | 6, - - - - - 0 0',
    },
    bass: { A: [6, 1, 6, 3], B: [5, 2, 6, 6] }, form: ['A', 'B', 'A', 'B'], bell: 0.35, pad: true,
  },
  danger: { // 紧张：低音古筝固定音型 + 堂鼓 + 笛子短句
    bpm: 120, key: 52, lead: ['flute', 'pipa'], acc: 'ostinato', density: 1, vol: 0.45,
    phr: {
      A: '0 0 0 0 6 - 5 6 | 0 0 0 0 1\' - 6 0 | 0 0 3 0 2 0 1 0 | 6, - - - 0 0 0 0',
      B: '6 0 6 0 1\' 6 5 3 | 5 0 5 0 6 5 3 2 | 3 0 3 0 2 3 1 2 | 6, - 0 6, 6, - 0 0',
      C: '0 0 6 - 0 0 7 - | 0 0 1\' - 7 - 6 - | 0 0 3 0 4 0 3 0 | 2 - 1 - 7, - 0 0',
    },
    bass: { A: [6, 6, 5, 6], B: [6, 5, 3, 6], C: [6, 6, 4, 3] },
    form: ['A', 'B', 'A', 'C'], perc: { drum: 'x..x..x.', wood: '.....o.o' }, trem: true,
  },
  bridge: { // 奈何桥：阴森又滑稽（偏音 4/7、颤巍巍的箫、嘭嚓伴奏）
    bpm: 84, key: 57, lead: ['xiao', 'zheng'], acc: 'oompah', density: 1, vol: 0.42, wobble: true,
    phr: {
      A: '6, 0 3 0 4 3 0 0 | 6, 0 3 0 7, - 0 0 | 1 0 2 0 3 0 4 3 | 2 - 7, - 6, - 0 0',
      B: '3\' - 2\' 1\' 7 - 6 0 | 4 - 3 2 3 - 0 0 | 6, 7, 1 2 3 - 6 - | 7, - - - 6, - 0 0',
    },
    bass: { A: [6, 3, 6, 3], B: [4, 3, 6, 6] }, form: ['A', 'B', 'A', 'A', 'B'], perc: { wood: 'x...o...' }, bell: 0.5, slide: 0.35,
  },
  modern: { // 现代出租屋：lo-fi
    bpm: 86, key: 60, lead: ['zheng', 'flute'], acc: 'pad', density: 1, vol: 0.4,
    phr: {
      A: '1 2 3 5 3 - 2 1 | 6, - 1 - 2 - 0 0 | 3 5 6 5 3 - 2 3 | 2 - - - 0 0 0 0',
      B: '5 - 6 1\' 6 - 5 3 | 2 3 5 - 3 - 0 0 | 1 2 3 2 1 - 6, 1 | 1 - - - 0 0 0 0',
    },
    bass: { A: [1, 6, 4, 5], B: [4, 5, 6, 1] }, form: ['A', 'B', 'A', 'B'], perc: { kick: 'x...x.o.', hat: '..x...x.' },
  },
  hall: { // 太和殿：庄重
    bpm: 72, key: 55, lead: ['flute', 'zheng'], acc: 'pluck', density: 0.7, vol: 0.45,
    phr: {
      A: '1 - - 2 3 - 5 - | 6 - 5 3 2 - - - | 3 - 5 6 1\' - 6 5 | 5 - - - - - 0 0',
      B: '6 - 1\' 6 5 - 3 - | 2 - 3 5 3 - 2 1 | 2 - 3 2 1 - 6, - | 1 - - - - - 0 0',
    },
    bass: { A: [1, 6, 1, 5], B: [6, 2, 6, 1] }, form: ['A', 'B', 'A', 'B'], perc: { drum: 'x...x.o.' }, gong: true, pad: true,
  },
  quiz: { // 小游戏：欢快
    bpm: 138, key: 67, lead: ['pipa', 'flute'], acc: 'pump', density: 1, vol: 0.4,
    phr: {
      A: '1 1 3 5 6 5 3 0 | 2 2 3 5 3 2 1 0 | 6, 1 2 3 5 3 2 1 | 2 - 5 - 1 - 0 0',
      B: '5 6 1\' 0 6 5 3 0 | 3 5 6 0 5 3 2 0 | 1 2 3 5 6 5 3 2 | 1 0 1 0 1 - 0 0',
    },
    bass: { A: [1, 2, 6, 5], B: [5, 6, 1, 1] }, form: ['A', 'B', 'A', 'B'], perc: { wood: 'x.ox.ox.', drum: 'x...x..o' }, slide: 0.2,
  },
  happy: { // 章节通关
    bpm: 116, key: 65, lead: ['flute', 'pipa'], acc: 'arp', density: 0.9, vol: 0.45,
    phr: {
      A: '3 5 6 1\' 6 5 3 5 | 6 - 5 3 2 3 5 0 | 1\' 6 5 3 2 3 1 2 | 3 - - - 5 - 0 0',
      B: '6 5 6 1\' 2\' 1\' 6 5 | 3 5 6 5 3 2 1 0 | 2 3 5 6 5 3 2 3 | 1 - - - 1\' - 0 0',
    },
    bass: { A: [1, 6, 1, 5], B: [6, 1, 5, 1] }, form: ['A', 'B'], perc: { wood: 'x.o.x.o.', drum: 'x.......' }, gliss: true,
  },
  mystery: { // 慈宁宫 / 太后：神秘（偶尔漏出一句“两只老虎”）
    bpm: 70, key: 57, lead: ['xiao', 'pipa'], acc: 'sparse', density: 0.6, vol: 0.42, trem: true,
    phr: {
      A: '6, - 1 - 3 - 2 1 | 7, - - 6, - - 0 0 | 3 - 5 - 6 - 5 3 | 4 - - 3 - - 0 0',
      B: '1 2 3 1 1 2 3 1 | 3 4 5 - 3 4 5 - | 6, - 7, 1 2 - 1 7, | 6, - - - - - 0 0',
    },
    bass: { A: [6, 3, 6, 4], B: [1, 1, 6, 6] }, form: ['A', 'A', 'B', 'A'], bell: 0.4, pad: true,
  },
};
Object.keys(TRACKS).forEach(k => { if (!TRACKS[k].name) TRACKS[k].name = k; });
TRACKS.palace = TRACKS.day;
AU.TRACKS = TRACKS;

/* ---------- 编曲引擎 ---------- */
const DEG = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };
const PENTA = [0, 2, 4, 7, 9];
const rnd = () => Math.random();
function parse(str) {
  const toks = str.replace(/\|/g, ' ').trim().split(/\s+/); const notes = [];
  toks.forEach((tk, i) => {
    if (tk === '-') { if (notes.length && notes[notes.length - 1].open) notes[notes.length - 1].len++; return; }
    if (notes.length) notes[notes.length - 1].open = false;
    const d = +tk[0]; if (!d) return;
    const oct = (tk.match(/'/g) || []).length - (tk.match(/,/g) || []).length;
    notes.push({ i, len: 1, semi: DEG[d] + oct * 12, open: true });
  });
  return { notes, n: toks.length };
}
const parsed = {};
function getPhrase(name, ph) { const k = name + ph; return parsed[k] || (parsed[k] = parse(TRACKS[name].phr[ph])); }
function pentaIdx(semi) { const o = Math.floor(semi / 12), r = semi - o * 12; let best = 0; PENTA.forEach((p, i) => { if (Math.abs(p - r) < Math.abs(PENTA[best] - r)) best = i; }); return o * 5 + best; }
function idxSemi(i) { const o = Math.floor(i / 5), r = ((i % 5) + 5) % 5; return o * 12 + PENTA[r]; }

let track = null, queue = [];
function startTrack(mood) {
  const spec = TRACKS[mood] || TRACKS.day; const t = ctx.currentTime;
  if (track) { const old = track.gain; old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(old.gain.value, t); old.gain.linearRampToValueAtTime(0, t + 1.6); setTimeout(() => { try { old.disconnect(); } catch (e) {} }, 2600); AU.debug.crossfades++; }
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(spec.vol, t + (track ? 1.6 : 0.6)); g.connect(duckG);
  queue = [];
  track = { mood, spec, gain: g, fi: 0, cycle: 0, next: t + (track ? 0.5 : 0.15), form: spec.form.slice() };
}
function buildPhrase(tr) {
  const s = tr.spec, ph = tr.form[tr.fi], P0 = getPhrase(s.name, ph);
  const e = 60 / s.bpm / 2, t0 = tr.next, bus = tr.gain, bars = Math.ceil(P0.n / 8);
  AU.debug.phrases++;
  const v = { lead: s.lead[(tr.cycle + tr.fi + (rnd() < 0.3 ? 1 : 0)) % s.lead.length], orn: rnd() < 0.55, up: tr.cycle > 0 && rnd() < 0.2, dens: (s.density || 0.8) * (0.75 + rnd() * 0.25), fill: rnd() < 0.5, echo: rnd() < 0.45 };
  const T = i => t0 + i * e + (s.swing && i % 2 ? s.swing * e : 0);
  const key = s.key + (v.up && v.lead !== 'flute' ? 12 : 0);
  let prevM = null;
  P0.notes.forEach((nt, k) => {
    const m = key + nt.semi, len = nt.len * e, t = T(nt.i);
    const o = { trem: s.trem && v.lead === 'pipa', wobble: s.wobble, xiao: v.lead === 'xiao' };
    if (v.orn && nt.len >= 2 && rnd() < 0.5) { if (v.lead === 'zheng' || v.lead === 'pipa') o.slide = 1.12; else o.from = midiHz(m + 12 + 2); }
    else if ((v.lead === 'flute' || v.lead === 'xiao') && prevM != null && rnd() < 0.3) o.from = midiHz(prevM + (o.xiao ? 0 : 12));
    if (v.lead === 'zheng' && nt.len >= 3 && rnd() < 0.4) o.bend = 0.05;
    const inst = v.lead === 'xiao' ? 'flute' : v.lead;
    queue.push({ t, lead: true, f: () => INST[inst](m, t, len, (inst === 'flute' ? 0.16 : 0.32) * (k % 4 === 0 ? 1.1 : 1), bus, o) });
    if (v.echo && nt.len >= 3 && rnd() < 0.5) { const te = t + 2 * e; queue.push({ t: te, f: () => INST.zheng(m - 12, te, 1, 0.14, bus, {}) }); }
    prevM = m;
  });
  for (let b = 0; b < bars; b++) {
    const deg = (s.bass[ph] || [1])[b % (s.bass[ph] || [1]).length], bs = s.key - 24 + DEG[deg], bi = pentaIdx(DEG[deg]);
    const tb = T(b * 8), last = b === bars - 1;
    queue.push({ t: tb, f: () => INST.bass(bs, tb, 4 * e, 0.3, bus) });
    const accM = i => s.key - 12 + idxSemi(bi + i);
    for (let j = 0; j < 8; j++) {
      const tj = T(b * 8 + j); let m = null, vol = 0.12;
      if (s.acc === 'arp') { const pat = [0, 2, 4, 5, 4, 2, 3, 2]; if (j === 0 || rnd() < v.dens) m = accM(pat[j]) + 12 * (j === 3 ? 0 : 0); }
      else if (s.acc === 'pluck') { if (j === 2 || j === 6) { const a = accM(2), c = accM(4); queue.push({ t: tj, f: () => { INST.zheng(a, tj, 1, 0.1, bus, {}); return INST.zheng(c, tj + 0.012, 1, 0.09, bus, {}); } }); } }
      else if (s.acc === 'sparse') { if ((j === 0 || j === 5) && rnd() < v.dens) m = accM(j ? 4 : 2); vol = 0.1; }
      else if (s.acc === 'ostinato') { const pat = [0, 0, 1, 0, 0, 0, 2, 0]; m = s.key - 12 + DEG[deg] + idxSemi(pat[j]) - (pat[j] ? 0 : 0); vol = j % 2 ? 0.08 : 0.12; }
      else if (s.acc === 'oompah') { if (j === 4) queue.push({ t: tj, f: () => INST.bass(bs + 7, tj, 2 * e, 0.2, bus) }); if (j === 2 || j === 6) { const a = accM(2), c = accM(3); queue.push({ t: tj, f: () => { INST.pipa(a, tj, e, 0.09, bus, {}); return INST.pipa(c, tj, e, 0.08, bus, {}); } }); } }
      else if (s.acc === 'pump') { if (j % 2 === 1) m = accM(j % 4 === 1 ? 2 : 4); vol = 0.1; if (j === 4) queue.push({ t: tj, f: () => INST.bass(bs + 12, tj, e, 0.18, bus) }); }
      else if (s.acc === 'pad') { if (j === 0) queue.push({ t: tj, f: () => INST.pad(s.key - 12 + DEG[deg], tj, 8 * e, 0.05, bus) }); }
      if (m != null) { const mm = m, vv = vol; queue.push({ t: tj, f: () => INST.zheng(mm, tj, 1, vv, bus, {}) }); }
      // 打击乐
      Object.keys(s.perc || {}).forEach(pi => { const ch = s.perc[pi][j]; if (ch === 'x' || ch === 'o') { const vol2 = ch === 'x' ? 1 : 0.55; queue.push({ t: tj, perc: true, f: () => pi === 'wood' ? INST.wood(tj, 0.14 * vol2, bus, j % 4 === 2) : pi === 'drum' ? INST.drum(tj, 0.3 * vol2, bus) : pi === 'kick' ? INST.kick(tj, 0.3 * vol2, bus) : INST.hat(tj, 0.07 * vol2, bus) }); } });
    }
    if (s.pad && s.acc !== 'pad') queue.push({ t: tb, f: () => INST.pad(s.key - 24 + DEG[deg], tb, 8 * e, 0.035, bus) });
    if (last && v.fill) {
      if (s.perc && s.perc.drum) for (let r = 0; r < 4; r++) { const tr2 = T(b * 8 + 6) + r * e / 2; queue.push({ t: tr2, perc: true, f: () => INST.drum(tr2, 0.12 + r * 0.04, bus) }); }
      else if (s.gliss) for (let r = 0; r < 6; r++) { const tg = T(b * 8 + 6) + r * 0.045, mg = s.key + 12 + idxSemi(6 - r); queue.push({ t: tg, f: () => INST.zheng(mg, tg, 1, 0.08, bus, {}) }); }
    }
    if (s.bell && rnd() < s.bell) { const tbell = T(b * 8 + 3 + ((rnd() * 4) | 0)), mb = s.key + 24 + idxSemi((rnd() * 5) | 0); queue.push({ t: tbell, f: () => INST.bell(mb, tbell, 0.035, bus) }); }
  }
  if (s.gong && tr.fi === 0) queue.push({ t: t0, f: () => INST.gong(t0, 0.12, bus) });
  if (s.slide && rnd() < s.slide) { const ts = T(P0.n - 3), up = rnd() < 0.5; queue.push({ t: ts, f: () => INST.slide(ts, 0.05, bus, up) }); }
  queue.sort((a, b) => a.t - b.t);
  tr.next = t0 + P0.n * e;
  tr.fi++; if (tr.fi >= tr.form.length) { tr.fi = 0; tr.cycle++; // 每轮小洗牌：保留开头乐句，其余随机换位
    const head = s.form[0], rest = s.form.slice(1).sort(() => rnd() - 0.5); tr.form = [head].concat(rest); }
}
function tick() {
  AU.debug.ticks++;
  if (!ctx || ctx.state !== 'running' || !track || AU.cfg.musicOn === false || AU.cfg.music <= 0) return;
  const now = ctx.currentTime, ahead = now + 0.3;
  if (track.next < now - 0.2) { queue = queue.filter(q => q.t > now); track.next = now + 0.1; } // 从后台回来时跳过积压
  if (track.next - now < 0.6) buildPhrase(track);
  while (queue.length && queue[0].t < ahead) {
    const q = queue.shift(); if (q.t < now - 0.05) continue;
    if (!canVoice(q.t, q.lead || q.perc)) continue;
    const end = q.f(); addVoice(end || q.t + 1);
  }
}
AU.setMood = function (m, force) {
  if (!m) return; if (AU.mood === m && track && track.mood === m && !force) return;
  AU.mood = m; if (!ctx) return;
  startTrack(m);
};
AU.stopMusic = function () { if (track && ctx) { track.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3); } track = null; queue = []; };
AU.state = function () { return { ctx: ctx ? ctx.state : 'none', mood: AU.mood, track: track && track.mood, queued: queue.length, voices: voices.length, duck: duckG ? duckG.gain.value : null, music: musicBus ? musicBus.gain.value : null, cfg: Object.assign({}, AU.cfg), debug: Object.assign({}, AU.debug) }; };

/* ---------- 音效 ---------- */
const STING = { death: [0.3, 1.6], gong: [0.45, 1.6], fanfare: [0.4, 2.2], scream: [0.4, 1], stamp: [0.6, 0.6], burp: [0.5, 1], splash: [0.6, 0.9] };
AU.sfx = function (name) {
  if (!ctx || ctx.state !== 'running' || AU.cfg.sfx <= 0) return;
  if (P.UI && P.UI.skip) return; // 快进时不放音效/插曲（音乐照常）
  const t = ctx.currentTime + 0.01;
  if (STING[name]) AU.duck(STING[name][0], STING[name][1]);
  switch (name) {
    case 'tap': tone('sine', 1200, 900, t, 0.05, 0.12); break;
    case 'coin': tone('square', 988, null, t, 0.08, 0.08, sfxBus, { lp: 4000 }); tone('square', 1319, null, t + 0.07, 0.25, 0.08, sfxBus, { lp: 4000 }); break;
    case 'select': pluck(76, t, 0.35, sfxBus, { dur: 0.8 }); pluck(81, t + 0.06, 0.3, sfxBus, { dur: 0.8 }); break;
    case 'gong': [1, 1.48, 2.1, 2.76].forEach((r, i) => tone('sine', 98 * r, 96 * r, t, 2.6 - i * 0.4, 0.28 / (i + 1), sfxBus, { a: 0.01, rev: true })); noise(t, 0.4, 0.15, 'lowpass', 400); break;
    case 'muyu': tone('sine', 520, 480, t, 0.12, 0.4); tone('sine', 1040, 900, t, 0.05, 0.1); break;
    case 'stamp': noise(t, 0.12, 0.6, 'lowpass', 300); tone('sine', 110, 50, t, 0.18, 0.5); noise(t, 0.03, 0.25, 'highpass', 3000); break;
    case 'page': noise(t, 0.25, 0.25, 'bandpass', 1800, 0.6, sfxBus, 4200); break;
    case 'meow': { const o = tone('sawtooth', 600, null, t, 0.5, 0.12, sfxBus, { lp: 1500, ft: 'bandpass', q: 3 }); o.frequency.setValueAtTime(560, t); o.frequency.linearRampToValueAtTime(880, t + 0.15); o.frequency.linearRampToValueAtTime(520, t + 0.45); break; }
    case 'paper': noise(t, 0.18, 0.2, 'highpass', 2500); noise(t + 0.1, 0.12, 0.15, 'highpass', 3500); break;
    case 'splash': noise(t, 0.6, 0.4, 'lowpass', 1800, 0.7, sfxBus, 300); tone('sine', 300, 900, t, 0.15, 0.15); break;
    case 'whoosh': noise(t, 0.35, 0.3, 'bandpass', 400, 1.2, sfxBus, 2400); break;
    case 'burp': { const o = tone('sawtooth', 90, 70, t, 0.6, 0.35, sfxBus, { lp: 600 }); const l = ctx.createOscillator(), g = ctx.createGain(); l.frequency.value = 18; g.gain.value = 18; l.connect(g); g.connect(o.frequency); l.start(t); l.stop(t + 0.6); break; }
    case 'scream': tone('sawtooth', 700, 1600, t, 0.5, 0.15, sfxBus, { lp: 3000 }); break;
    case 'ding': pluck(84, t, 0.45, sfxBus, { dur: 1 }); pluck(88, t + 0.08, 0.4, sfxBus, { dur: 1.2 }); break;
    case 'buzz': tone('square', 160, 120, t, 0.3, 0.12, sfxBus, { lp: 900 }); break;
    case 'sparkle': [0, 2, 4, 7, 9, 12].forEach((d, i) => pluck(81 + d, t + i * 0.05, 0.25, sfxBus, { dur: 0.8 })); break;
    case 'boing': tone('sine', 200, 600, t, 0.25, 0.3); break;
    case 'pop': tone('sine', 400, 1200, t, 0.08, 0.25); break;
    case 'death': tone('sine', 520, 480, t, 0.12, 0.4); tone('sine', 520, 480, t + 0.22, 0.12, 0.35); [0, 3, 6].forEach((k, i) => tone('triangle', midiHz(64 - k * 2), midiHz(60 - k * 2), t + 0.45 + i * 0.18, 0.3, 0.15)); break;
    case 'slip': tone('sine', 900, 200, t, 0.4, 0.25); break;
    case 'thud': tone('sine', 140, 40, t, 0.3, 0.6); noise(t, 0.15, 0.3, 'lowpass', 500); break;
    case 'fanfare': [0, 4, 7, 12].forEach((d, i) => pluck(67 + d, t + i * 0.12, 0.45, sfxBus, { dur: 1.4 })); setTimeout(() => AU.sfx('gong'), 500); break;
    case 'tick': tone('sine', 1500, 1500, t, 0.03, 0.08); break;
    case 'spill': noise(t, 0.4, 0.35, 'lowpass', 1200, 0.8, sfxBus, 300); tone('sine', 700, 300, t, 0.2, 0.12); break;
  }
};

/* ---------- 朗读 ---------- */
let zhVoice = null;
function pickVoice() { try { const vs = speechSynthesis.getVoices() || []; zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs.find(v => /^zh/i.test(v.lang)) || null; } catch (e) {} }
if ('speechSynthesis' in window) { pickVoice(); try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {} }
AU.speak = function (text) {
  if (P.UI && P.UI.skip) return;
  if (!AU.cfg.speech || !text) return false;
  try {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[《》“”]/g, ''));
    u.lang = 'zh-CN'; if (zhVoice) u.voice = zhVoice; u.rate = 1.05; u.pitch = 1.15; u.volume = 1;
    u.onend = u.onerror = () => AU.unduck();
    AU.duck(0.25, Math.min(8, 1 + text.length * 0.24));
    speechSynthesis.speak(u); return true;
  } catch (e) { return false; }
};
AU.stopSpeak = function () { try { AU.unduck(); if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} };
})(window.PALACE = window.PALACE || {});
