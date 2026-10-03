/* audio.js —— WebAudio 合成：五声音阶古筝（Karplus-Strong 预渲染）+ 场景音乐 + 音效 + 朗读（Web Speech API） */
(function (P) {
'use strict';
const AU = P.AUDIO = { cfg: { music: 0.5, sfx: 0.8, speech: true }, mood: null, ready: false };
let ctx = null, master, musicBus, sfxBus, timer = null, nextT = 0, step = 0, cur = null;
const ksCache = {};

AU.unlock = function () {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(master);
      musicBus = ctx.createGain(); musicBus.connect(comp); sfxBus = ctx.createGain(); sfxBus.connect(comp);
      // 简易混响（给古筝一点空间感）
      const conv = ctx.createConvolver(), len = ctx.sampleRate * 1.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
      conv.buffer = buf; AU.rev = ctx.createGain(); AU.rev.gain.value = 0.22; AU.rev.connect(conv); conv.connect(comp);
      AU.applyVol(); AU.ready = true;
      document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume(); });
    }
    if (ctx.state === 'suspended') ctx.resume();
    if (AU.mood && !timer) AU.setMood(AU.mood, true);
  } catch (e) { /* 静默失败 */ }
};
AU.applyVol = function () { if (!ctx) return; musicBus.gain.value = AU.cfg.music * 0.55; sfxBus.gain.value = AU.cfg.sfx * 0.9; };
function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function ksBuffer(m, dur, bright) { // Karplus-Strong 拨弦
  const key = m + '|' + bright; if (ksCache[key]) return ksCache[key];
  const sr = ctx.sampleRate, n = Math.floor(sr * dur), buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / midiHz(m))), ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / N * Math.PI));
  let idx = 0, last = 0; const decay = 0.996 - (m > 84 ? 0.004 : 0), b = bright || 0.5;
  for (let i = 0; i < n; i++) { const v = ring[idx], nx = ring[(idx + 1) % N]; const out = (v * b + nx * (1 - b)) * decay; ring[idx] = out; d[i] = v; idx = (idx + 1) % N; last = v; }
  // 起音包络
  for (let i = 0; i < 64 && i < n; i++) d[i] *= i / 64;
  ksCache[key] = buf; return buf;
}
function pluck(m, t, vol, bus, opt) {
  opt = opt || {};
  const src = ctx.createBufferSource(); src.buffer = ksBuffer(m, opt.dur || 1.8, opt.bright || 0.5);
  if (opt.bend) { src.playbackRate.setValueAtTime(1, t); src.playbackRate.linearRampToValueAtTime(1 + opt.bend, t + 0.12); src.playbackRate.linearRampToValueAtTime(1, t + 0.3); }
  if (opt.vib) { const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5.5; lg.gain.value = 0.006; lfo.connect(lg); lg.connect(src.playbackRate); lfo.start(t + 0.15); lfo.stop(t + 2); }
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + (opt.dur || 1.8));
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opt.lp || 3800;
  src.connect(f); f.connect(g); g.connect(bus || musicBus); if (AU.rev && !opt.dry) g.connect(AU.rev);
  src.start(t); src.stop(t + (opt.dur || 1.8) + 0.05);
}
function tone(type, f0, f1, t, dur, vol, bus, opt) {
  opt = opt || {};
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (opt.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o; if (opt.lp) { const f = ctx.createBiquadFilter(); f.type = opt.ft || 'lowpass'; f.frequency.value = opt.lp; f.Q.value = opt.q || 1; o.connect(f); node = f; }
  node.connect(g); g.connect(bus || sfxBus); if (opt.rev && AU.rev) g.connect(AU.rev);
  o.start(t); o.stop(t + dur + 0.05); return o;
}
function noise(t, dur, vol, ft, freq, q, bus, f1) {
  const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(); s.buffer = buf; const f = ctx.createBiquadFilter(); f.type = ft || 'bandpass'; f.frequency.setValueAtTime(freq || 1000, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q || 1;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus || sfxBus); s.start(t); s.stop(t + dur + 0.02);
}

/* ---------- 场景音乐（宫商角徵羽） ---------- */
const PENTA = [0, 2, 4, 7, 9];
function scaleNote(root, deg) { const o = Math.floor(deg / 5), r = ((deg % 5) + 5) % 5; return root + o * 12 + PENTA[r]; }
const MOODS = {
  title:  { bpm: 84, root: 62, mel: [4, 5, 7, 5, 4, 2, 1, 2, 4, -1, 5, 4, 2, 1, 0, -1], bass: [0, -3, -2, 0], perc: 'soft', vol: 0.5 },
  day:    { bpm: 100, root: 64, mel: [0, 2, 4, 2, 5, 4, 2, -1, 1, 2, 4, 5, 7, 5, 4, -1], bass: [0, 3, -2, 1], perc: 'wood', vol: 0.45 },
  night:  { bpm: 72, root: 57, mel: [4, -1, 2, -1, 1, 0, -1, -1, 2, -1, 4, 5, 4, -1, -1, -1], bass: [0, -2, -3, -1], perc: null, vol: 0.4, soft: true },
  danger: { bpm: 112, root: 52, mel: [0, -1, 0, 1, -1, 0, -1, 3, 0, -1, 0, 1, 2, -1, 1, -1], bass: [0, 0, -1, 0], perc: 'drum', vol: 0.45, drone: true },
  bridge: { bpm: 60, root: 69, mel: [7, -1, -1, 5, -1, -1, 4, -1, 2, -1, -1, 4, -1, -1, -1, -1], bass: [0, -2], perc: null, vol: 0.4, pad: true, chime: true },
  modern: { bpm: 92, root: 60, mel: [0, 2, 4, 7, 4, 2, 0, -1, 5, 4, 2, 0, 2, -1, -1, -1], bass: [0, -3, -2, -4], perc: 'lofi', vol: 0.4 },
  hall:   { bpm: 76, root: 55, mel: [0, -1, 2, 4, -1, 5, 4, -1, 2, 1, 0, -1, 1, 2, 0, -1], bass: [0, 0, -3, -2], perc: 'drum', vol: 0.45, drone: true },
  quiz:   { bpm: 126, root: 67, mel: [0, 2, 4, 2, 0, 2, 4, 5, 4, 2, 0, -1, 2, 1, 0, -1], bass: [0, 2, -2, 0], perc: 'wood', vol: 0.4 },
  happy:  { bpm: 110, root: 65, mel: [4, 5, 7, 9, 7, 5, 4, 2, 4, 7, 5, 4, 2, 1, 0, -1], bass: [0, 3, 1, 0], perc: 'wood', vol: 0.45 },
};
AU.setMood = function (m, force) {
  if (!m) return; if (AU.mood === m && timer && !force) return;
  AU.mood = m; cur = MOODS[m] || MOODS.day; step = 0;
  if (!ctx) return;
  if (timer) clearInterval(timer);
  nextT = ctx.currentTime + 0.1;
  timer = setInterval(tick, 60);
};
AU.stopMusic = function () { if (timer) clearInterval(timer); timer = null; };
function tick() {
  if (!ctx || ctx.state !== 'running' || !cur) return;
  const spb = 60 / cur.bpm / 2; // 八分音符
  while (nextT < ctx.currentTime + 0.25) {
    const m = cur, s = step % 16, bar = Math.floor(step / 16);
    const deg = m.mel[s];
    const varied = bar % 2 === 1 && s >= 8 ? (deg >= 0 ? deg + ((step * 7) % 3 === 0 ? 1 : 0) : deg) : deg;
    if (varied >= 0) pluck(scaleNote(m.root, varied), nextT, m.vol * (s % 4 === 0 ? 0.42 : 0.3), musicBus, { dur: m.soft ? 2.4 : 1.6, bend: s === 7 ? 0.06 : 0, vib: s % 8 === 0, bright: m.soft ? 0.35 : 0.5 });
    if (s % 8 === 0) { const b = m.bass[(bar * 2 + s / 8) % m.bass.length]; pluck(scaleNote(m.root - 24, b), nextT, m.vol * 0.4, musicBus, { dur: 2.4, lp: 900, bright: 0.3 }); }
    if (s === 15 && bar % 4 === 3 && !m.soft) { for (let k = 0; k < 6; k++) pluck(scaleNote(m.root + 12, 6 - k), nextT + k * 0.04, m.vol * 0.16, musicBus, { dur: 0.9 }); } // 刮奏
    if (m.perc === 'wood' && (s === 0 || s === 6 || s === 10)) tone('sine', 820, 760, nextT, 0.06, 0.12 * m.vol * 2, musicBus);
    if (m.perc === 'drum' && (s === 0 || s === 8 || s === 11)) { tone('sine', 120, 50, nextT, 0.3, 0.32 * m.vol * 2, musicBus); }
    if (m.perc === 'soft' && s === 0) tone('sine', 640, 600, nextT, 0.08, 0.06, musicBus);
    if (m.perc === 'lofi') { if (s % 4 === 0) tone('sine', 110, 45, nextT, 0.22, 0.3 * m.vol * 2, musicBus); if (s % 4 === 2) noise(nextT, 0.06, 0.08, 'highpass', 6000, 0.7, musicBus); }
    if (m.drone && s === 0 && bar % 2 === 0) tone('triangle', midiHz(m.root - 24), null, nextT, spb * 16, 0.06, musicBus, { a: 0.6, lp: 500 });
    if (m.pad && s === 0) { [0, 7, 12].forEach(iv => tone('sine', midiHz(m.root - 12 + iv), null, nextT, spb * 16, 0.035, musicBus, { a: 1.2, rev: true })); }
    if (m.chime && (s === 3 || s === 13) && Math.random() < 0.6) tone('sine', midiHz(scaleNote(m.root + 24, (step * 3) % 5)), null, nextT, 1.6, 0.04, musicBus, { rev: true });
    nextT += spb; step++;
  }
}

/* ---------- 音效 ---------- */
AU.sfx = function (name) {
  if (!ctx || ctx.state !== 'running' || AU.cfg.sfx <= 0) return;
  const t = ctx.currentTime + 0.01;
  switch (name) {
    case 'tap': tone('sine', 1200, 900, t, 0.05, 0.12); break;
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
  if (!AU.cfg.speech || !text) return false;
  try {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[《》“”]/g, ''));
    u.lang = 'zh-CN'; if (zhVoice) u.voice = zhVoice; u.rate = 1.05; u.pitch = 1.15; u.volume = 1;
    speechSynthesis.speak(u); return true;
  } catch (e) { return false; }
};
AU.stopSpeak = function () { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} };
})(window.PALACE = window.PALACE || {});
