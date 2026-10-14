/* cyberia.meme — a meme is a particle · seven chapters on the house engine */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const fmt = (n) => n.toLocaleString('en-US');
const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COLS = ['#ff1a00', '#ff7a00', '#ffc400', '#00ff41', '#00b8ff', '#1e00ff', '#7a00ff'];
const MONO = 'JetBrains Mono,Menlo,monospace';

/* ------------------------------------------------------------------ sound · synthesized, no files */
const sfx = (() => {
  let ac = null, master = null, on = localStorage.getItem('cyber.sound') !== 'off', amb = null;
  const ensure = () => { if (ac) return true; try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .22; master.connect(ac.destination); } catch { return false; } return true; };
  const resume = () => { if (ac && ac.state === 'suspended') ac.resume(); };
  const tone = (f0, f1, dur, type = 'sine', g = .5, at = 0) => { if (!on || !ensure()) return; resume(); const t = ac.currentTime + at; const o = ac.createOscillator(), v = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(g, t + .006); v.gain.exponentialRampToValueAtTime(.0005, t + dur); o.connect(v); v.connect(master); o.start(t); o.stop(t + dur + .02); };
  const noise = (dur, g = .3, hp = 2000) => { if (!on || !ensure()) return; resume(); const t = ac.currentTime; const n = ac.sampleRate * dur | 0, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); const src = ac.createBufferSource(); src.buffer = b; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const v = ac.createGain(); v.gain.value = g; src.connect(f); f.connect(v); v.connect(master); src.start(t); };
  const ambient = (start) => { if (!ensure()) return; if (start && !amb && on) { const v = ac.createGain(); v.gain.value = 0; v.connect(master); const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; f.connect(v); const os = [55, 55.4, 82.5].map((fr) => { const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = fr; o.connect(f); o.start(); return o; }); v.gain.linearRampToValueAtTime(.06, ac.currentTime + 4); amb = { v, os }; } if (!start && amb) { amb.v.gain.linearRampToValueAtTime(0, ac.currentTime + 1); const a = amb; amb = null; setTimeout(() => a.os.forEach((o) => o.stop()), 1200); } };
  const NOTES = [220, 246.9, 277.2, 329.6, 370, 440, 493.9];
  return {
    get on() { return on; },
    toggle() { on = !on; localStorage.setItem('cyber.sound', on ? 'on' : 'off'); if (on) { ensure(); resume(); ambient(true); tone(660, 990, .12, 'sine', .4); } else ambient(false); return on; },
    wake() { if (on && ensure()) { resume(); ambient(true); } },
    tick() { noise(.02, .25, 3000); tone(1800, 1200, .03, 'square', .08); },
    move(dir, ch) { noise(.03, .2, 1500); tone(dir > 0 ? 440 : 520, dir > 0 ? 560 : 400, .08, 'sine', .25); if (ch != null) { const r = NOTES[ch]; tone(r, null, .5, 'sine', .18, .04); tone(r * 1.5, null, .45, 'sine', .1, .08); } },
    link() { tone(880, 1320, .16, 'sine', .35); tone(1320, 1760, .22, 'triangle', .18, .1); },
    hash() { noise(.012, .12, 4000); },
    ticket() { tone(1760, 1750, .35, 'sine', .3); tone(2640, 2630, .25, 'sine', .12, .02); },
    converge(d) { const f = 220 + 1200 * Math.min(1, Math.max(0, (-Math.log10(Math.max(d, 1e-9)) - 1) / 7)); tone(f, f * 1.02, .07, 'triangle', .22); },
    stake(v) { tone(v ? 160 : 110, 60, .25, 'sine', .45); noise(.05, .15, 800); },
    mentor() { [0, 2, 4, 6].forEach((k, i) => tone(NOTES[k] * 2, null, .3, 'sine', .22, i * .09)); },
    chord(ch) { const r = NOTES[ch]; [1, 1.25, 1.5, 2].forEach((m, i) => tone(r * m, null, .9, 'sine', .14, i * .05)); },
  };
})();


/* ------------------------------------------------------------------ the canon, as memes: [top, bottom, bg, figure] */
const CANON = [
  ['copying earns nothing', 'a perfect copy surprises no one', '#00ff41', '🐈'],
  ['five years in', 'nine orders of magnitude early. nobody is late.', '#ff7a00', '🪐'],
  ['the proof is the claim', 'the claim is the mining', '#00b8ff', '⚛'],
  ['speak without fear', 'the link is public. the author is private.', '#1e00ff', '👁'],
  ["don't trust. don't fear.", "don't beg.", '#000', '🤖'],
  ['superintelligence', 'is a number', '#ff1a00', '🧠'],
  ['no individual ant', 'understands the colony. the colony understands itself.', '#ffc400', '🌐'],
  ['money for knowledge', 'minted when the network learns', '#7a00ff', '💸'],
  ['idle capital', 'earns nothing', '#1e00ff', '🧊'],
  ['the medium is not slow software', 'the medium is physics', '#000', '🛰'],
  ['a thermostat', 'not a calendar', '#ff7a00', '🔥'],
  ['any start.', 'the same end.', '#ffc400', '⚛'],
  ['the hash', 'is the accounting', '#00b8ff', '💸'],
  ['a frozen protocol', 'for collective lifeforms', '#1e00ff', '🧊'],
  ['every weight', 'has an author', '#00ff41', '🧠'],
  ['bostrom → transformer', 'in 62 seconds. no training budget.', '#ff1a00', '🤖'],
  ['one focus', 'light-delay cannot split it', '#7a00ff', '🛰'],
  ['a meme', 'is a particle', 'graph', ''],
  ['emergence stops being philosophy', 'the moment it has an error bar', '#000', '📏'],
  ['a protocol', 'does not upgrade', '#00b8ff', '🧊'],
  ['intelligence has a price', 'this is the unit it is priced in', '#00ff41', '💸'],
  ['one law', 'two readings', '#ff1a00', '👁'],
  ['the colony', 'understands itself', '#ffc400', '🐜'],
  ['verify once', 'trust forever', '#7a00ff', '⚛'],
];
const BGS = [...COLS, 'graph', 'black', 'white'];
const FIGS = ['', '🤖', '🧠', '👁', '⚛', '🛰', '🪐', '🔥', '💸', '🐈', '🧊', '🌐', '🐜', '📏'];

/* ------------------------------------------------------------------ the real cybergraph */
let G = null;
const graphReady = fetch('graph.json').then((r) => r.json()).then((d) => { G = d; const xs = d.nodes.map((n) => n[2]), ys = d.nodes.map((n) => n[3]); G.cx = (Math.min(...xs) + Math.max(...xs)) / 2; G.cy = (Math.min(...ys) + Math.max(...ys)) / 2; G.maxd = Math.max(...d.nodes.map((n) => n[1])); }).catch(() => {});
const graphSvg = (size, col) => { if (!G) return ''; let o = `<g stroke="${col}" stroke-opacity=".25" stroke-width="1">`; const P = G.nodes.map((n) => [size / 2 + (n[2] - G.cx) * size * 1.3, size / 2 + (n[3] - G.cy) * size * 1.3]); for (const [a, b] of G.links) o += `<line x1="${P[a][0].toFixed(1)}" y1="${P[a][1].toFixed(1)}" x2="${P[b][0].toFixed(1)}" y2="${P[b][1].toFixed(1)}"/>`; o += '</g>'; G.nodes.forEach((n, i) => { const d = n[1] / G.maxd; o += `<circle cx="${P[i][0].toFixed(1)}" cy="${P[i][1].toFixed(1)}" r="${(1.5 + 9 * Math.sqrt(d)).toFixed(1)}" fill="${d > .35 ? '#fff' : col}" fill-opacity="${.5 + .5 * d}"/>`; }); return o; };

/* ------------------------------------------------------------------ the meme renderer: one function for preview, wall and png */
const wrap = (t, max) => { const w = t.split(' '), lines = []; let cur = ''; for (const x of w) { if ((cur + ' ' + x).trim().length > max && cur) { lines.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); } if (cur) lines.push(cur); return lines.slice(0, 4); };
const meme = (top, bot, bg, fig, size = 800) => {
  const S = size, light = bg === 'white', txt = light ? '#000' : '#fff', stroke = light ? '#fff' : '#000';
  const fill = bg === 'graph' || bg === 'black' ? '#000' : light ? '#fff' : bg;
  let o = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${fill}"/>`;
  if (bg === 'graph') o += graphSvg(S, '#ff1a00');
  if (fig) o += `<text x="${S / 2}" y="${S * .62}" font-size="${S * .42}" text-anchor="middle">${fig}</text>`;
  const line = (lines, y0, bottom) => { const fs = Math.min(S * .11, S * .8 / Math.max(...lines.map((l) => l.length)) * 1.9), lh = fs * 1.05; lines.forEach((l, i) => { const y = bottom ? y0 - (lines.length - 1 - i) * lh : y0 + i * lh; o += `<text x="${S / 2}" y="${y.toFixed(0)}" font-family="Impact,'Arial Black',Haettenschweiler,sans-serif" font-size="${fs.toFixed(0)}" text-anchor="middle" fill="${txt}" stroke="${stroke}" stroke-width="${(fs * .07).toFixed(1)}" paint-order="stroke">${esc(l.toUpperCase())}</text>`; }); };
  if (top) line(wrap(top, 22), S * .14, false);
  if (bot) line(wrap(bot, 22), S * .93, true);
  o += `<text x="${S - 14}" y="${S - 12}" font-family="${MONO}" font-size="${S * .022}" text-anchor="end" fill="${txt}" fill-opacity=".55">cyberia.meme</text>`;
  return o + '</svg>';
};
const png = (svg, size = 1200) => new Promise((res) => { const img = new Image(); const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(img, 0, 0, size, size); URL.revokeObjectURL(url); c.toBlob((b) => res(b), 'image/png'); }; img.src = url; });
const sha = async (buf) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buf)).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');

/* ------------------------------------------------------------------ chapters */
const CH = [
  { name: 'meme', c: 'var(--c1)' }, { name: 'particle', c: 'var(--c2)' }, { name: 'make', c: 'var(--c3)' }, { name: 'the wall', c: 'var(--c4)' },
  { name: 'mint', c: 'var(--c5)' }, { name: 'spread', c: 'var(--c6)' }, { name: 'doors', c: 'var(--c7)' },
];
const st = { top: 'copying earns nothing', bot: 'a perfect copy surprises no one', bg: '#00ff41', fig: '🐈', page: 0 };
const Y = { mint: 0, links: 0 };

const S = [
{ ch: 0, cls: 'one', html: `
  <div><p class="kick">cyberia.meme · the meme state</p>
  <p class="hero-word">meme</p>
  <h2>a meme is <em>a particle.</em></h2>
  <p class="lead">content-addressed, linkable, rankable. every meme here has a hash and a URL. make one, mint it, send it to someone who knows nothing yet.</p>
  <div class="tiles"><div class="tile"><b>no accounts</b>rendered in your browser</div><div class="tile"><b>no upload</b>the meme lives in its link</div><div class="tile"><b>one hash</b>sha-256 here · hemera on cyber</div><div class="tile"><b>24 canon memes</b>every line from the protocol's pages</div></div>
  <p class="kbd">→ or space to move</p></div>` },
{ ch: 1, cls: 'ink', html: `
  <div><p class="kick">02 · particle</p><h2>bytes with a hash<br><em>are a particle.</em></h2>
  <p class="lead">on cyber a file is bytes and its hash is its identity. a meme is a file. link it to what it is about and the graph ranks it; if your link sharpens the shared picture, the mint pays you — once, when it was new.</p>
  <p class="mute">a perfect copy moves focus by zero and surprises no one. the first one counts. that is the whole economics of memes, written into the protocol.</p></div>
  <div class="nums"><div class="n"><big>1</big><small>hash per meme · the bytes are the identity</small></div><div class="n"><big>0</big><small>what a copy mints</small></div><div class="n"><big>∞</big><small>copies the graph can hold; one particle</small></div><div class="n"><big>first</big><small>who is paid · surprising syntropy</small></div></div>` },
{ ch: 2, cls: 'ink', html: `
  <div><p class="kick">03 · make</p><h2>make one.<br><em>top, bottom, figure.</em></h2>
  <div class="panel"><label>top</label><input type="text" id="top" maxlength="60"><label>bottom</label><input type="text" id="bot" maxlength="60"><label>background</label><div class="bgs" id="bgs"></div><label>figure</label><div class="bgs" id="figs"></div><div class="row"><button class="btn" id="rnd">random canon</button><button class="btn ghost" id="to-mint">mint it →</button></div></div></div>
  <div class="memewrap" id="preview"></div>` },
{ ch: 3, html: `
  <div class="full"><p class="kick">04 · the wall · canon, as memes</p><h2>the wall.</h2>
  <div class="wall" id="wall"></div>
  <div class="pager"><button class="btn ghost" id="pg-prev">←</button><span id="pg-lab">1 / 3</span><button class="btn ghost" id="pg-next">→</button><span class="fine">click a card to load it · hover for png and link</span></div></div>` },
{ ch: 4, cls: 'ink', html: `
  <div><p class="kick">05 · mint</p><h2>mint it.<br><em>get its hash.</em></h2>
  <p class="lead">the png is rendered in your browser and hashed with sha-256. the hash is the meme's particle: the same bytes anywhere on earth give the same name. nothing leaves your machine until you send it.</p>
  <div class="row"><button class="btn" id="mint">mint · png</button><button class="btn ghost" id="copy">copy link</button></div>
  <p class="hashbig" id="hash" style="margin-top:14px">particle — mint to hash it</p></div>
  <div class="memewrap" id="preview2"></div>` },
{ ch: 5, cls: 'ink', html: `
  <div><p class="kick">06 · spread</p><h2>send it to one<br><em>who knows nothing yet.</em></h2>
  <p class="lead">a meme spreads by being linked. the link carries the whole meme — no server remembers it, no account owns it. on cyber the one who links it first, where it belongs, is the one the mint pays.</p>
  <div class="shares"><a class="btn" id="sh-x" target="_blank" rel="noopener">post on x</a><a class="btn ghost" id="sh-tg" target="_blank" rel="noopener">telegram</a><button class="btn ghost" id="sh-copy">copy link</button></div>
  <p class="fine" id="sh-url" style="margin-top:12px;word-break:break-all"></p></div>
  <div class="memewrap" id="preview3"></div>` },
{ ch: 6, cls: 'ink', html: `
  <div><p class="kick">07 · doors</p><h2>the meme state<br><em>has three doors.</em></h2>
  <div class="tally"><div><b id="t-mint">0</b>minted</div><div><b id="t-links">0</b>links copied</div><div><b>24</b>canon memes</div><div><b>1</b>graph behind them</div></div>
  <p class="lead">the background is a real sample of the bostrom cybergraph: 1,200 particles, 6,000 cyberlinks. on 2026-11-05 it comes back to life on soft3, and memes become particles for real.</p>
  <div class="ctas"><a class="btn" href="https://cyb.ai" target="_blank" rel="noopener">get the robot</a><a class="btn ghost" href="https://cyber.page">cyber.page</a><a class="btn ghost" href="https://cyberia.to">cyberia.to</a><a class="btn ghost" href="#0" id="restart">start again</a></div>
  <p class="fine" style="margin-top:18px">don't trust. don't fear. don't beg.</p></div>` },
];

/* ------------------------------------------------------------------ build */
const deck = $('#deck'), segs = $('#segs');
S.forEach((s, i) => deck.appendChild(el(`<section class="slide ch${s.ch} ${s.cls || ''}" data-i="${i}" data-ch="${String(s.ch + 1).padStart(2, '0')}" style="--c:${CH[s.ch].c}"><div class="body">${s.html}</div></section>`)));
CH.forEach((c, i) => { const d = el(`<div class="seg" style="--sc:${c.c}" data-ch="${i}"><div class="fill"></div><span class="lab">${String(i + 1).padStart(2, '0')} ${c.name}</span></div>`); d.addEventListener('click', () => go(i)); segs.appendChild(d); });

let cur = -1;
const fit = () => {
  const sl = document.querySelectorAll('.slide')[cur]; if (!sl) return;
  const body = sl.querySelector('.body');
  Object.assign(body.style, { transform: '', width: '', height: '', maxHeight: '', margin: '' }); sl.classList.remove('tight', 'tighter', 'scaled');
  const availW = body.clientWidth, availH = body.clientHeight;
  const over = () => body.scrollHeight > availH + 1 || body.scrollWidth > availW + 1;
  if (!over()) return;
  sl.classList.add('tight'); if (!over()) return;
  sl.classList.add('tighter'); if (!over()) return;
  let z = Math.min(availH / body.scrollHeight, availW / body.scrollWidth);
  sl.classList.add('scaled');
  for (let k = 0; k < 5; k++) {
    z = Math.max(.4, Math.floor(z * 100) / 100);
    Object.assign(body.style, { width: availW / z + 'px', height: availH / z + 'px', maxHeight: 'none', margin: '0', transform: `scale(${z})` });
    if (body.scrollHeight <= availH / z + 1 && body.scrollWidth <= availW / z + 1) break;
    z *= .96;
  }
};

let fitT = 0; const refit = () => { clearTimeout(fitT); fitT = setTimeout(fit, 40); };
addEventListener('resize', refit); addEventListener('orientationchange', refit); document.fonts?.ready.then(refit);

const go = (i) => {
  i = Math.max(0, Math.min(S.length - 1, i)); if (i === cur) return;
  const dir = i > cur ? 1 : -1, prevCh = cur >= 0 ? S[cur].ch : -1; cur = i; deck.dataset.dir = dir;
  document.querySelectorAll('.slide').forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('left', k < i); });
  document.body.classList.toggle('ink', (S[i].cls || '').includes('ink')); document.body.className = document.body.className.replace(/\bch\d\b/g, '').trim() + ' ch' + S[i].ch;
  document.querySelectorAll('.seg').forEach((sg, k) => { sg.classList.toggle('cur', k === i); sg.classList.toggle('done', k < i); $('.fill', sg).style.width = k <= i ? '100%' : '0'; });
  sfx.move(dir, S[i].ch !== prevCh ? S[i].ch : null); if (navigator.vibrate) navigator.vibrate(8);
  graph.chapter(S[i].ch); graph.pulse();
  $('#pos').textContent = `${String(i + 1).padStart(2, '0')} / ${S.length}`;
  history.replaceState(null, '', '#' + i + (i >= 2 ? '&' + memeParams() : ''));
  render(); requestAnimationFrame(() => requestAnimationFrame(fit));
};
window.deckGo = go; window.deckCount = () => S.length; window.deckFit = fit;
$('#prev').onclick = () => go(cur - 1); $('#next').onclick = () => go(cur + 1);
document.addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT' || (e.target.tagName === 'BUTTON' && [' ', 'Enter'].includes(e.key))) return; if (['ArrowRight', ' ', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); go(cur + 1); } if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); } if (e.key === 'Home') go(0); if (e.key === 'End') go(S.length - 1); });
let wheelLock = 0; document.addEventListener('wheel', (e) => { const t = Date.now(); if (t - wheelLock < 700 || Math.abs(e.deltaY) < 24) return; wheelLock = t; go(cur + (e.deltaY > 0 ? 1 : -1)); }, { passive: true });
let tx = null, ty = 0; document.addEventListener('touchstart', (e) => { tx = e.target.closest('input') ? null : e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1)); tx = null; });
$('#restart').addEventListener('click', (e) => { e.preventDefault(); go(0); });
$('#to-mint').onclick = () => go(4);
document.addEventListener('pointerdown', (e) => { sfx.wake(); if (e.target.closest('button, a, .seg, .card, input[type=range]')) sfx.tick(); }, { passive: true });
document.addEventListener('keydown', () => sfx.wake(), { once: true });
const sndBtn = $('#snd'); const sndPaint = () => { sndBtn.textContent = sfx.on ? '◉ sound' : '○ sound'; sndBtn.classList.toggle('off', !sfx.on); }; sndBtn.onclick = () => { sfx.toggle(); sndPaint(); }; sndPaint();
if (matchMedia('(pointer:fine)').matches) { const dot = el('<div class="cur-dot"></div>'), ring = el('<div class="cur-ring"></div>'); document.body.append(dot, ring); let rx = 0, ry = 0, px = 0, py = 0; addEventListener('mousemove', (e) => { px = e.clientX; py = e.clientY; dot.style.transform = `translate(${px}px,${py}px)`; ring.classList.toggle('hot', !!e.target.closest('button, a, .seg, input, canvas, .card')); }, { passive: true }); const lag = () => { rx += (px - rx) * .18; ry += (py - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(lag); }; lag(); document.body.classList.add('has-cursor'); }

/* ------------------------------------------------------------------ background: the real graph in the chapter colour */
const graph = (() => {
  const cv = $('#graph'), ctx = cv.getContext('2d'); let W = 0, H = 0, hue = COLS[0], pulse = 0;
  const resize = () => { W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio; }; addEventListener('resize', resize); resize();
  const tick = () => { ctx.clearRect(0, 0, W, H); if (G) { const t = performance.now() / 1000, ang = t * .015, s = Math.max(W, H) * .62, c = Math.cos(ang), sn = Math.sin(ang); const P = G.nodes.map((n) => { const x = n[2] - G.cx, y = n[3] - G.cy; return [W / 2 + (x * c - y * sn) * 2 * s, H / 2 + (x * sn + y * c) * 2 * s]; }); ctx.lineWidth = .5 * devicePixelRatio; ctx.strokeStyle = hue; ctx.globalAlpha = .12 + pulse * .2; ctx.beginPath(); for (const [a, b] of G.links) { ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); } ctx.stroke(); ctx.fillStyle = hue; ctx.globalAlpha = .35; for (let i = 0; i < P.length; i++) { const r = (.8 + 2.6 * Math.sqrt(G.nodes[i][1] / G.maxd)) * devicePixelRatio * (1 + pulse); ctx.beginPath(); ctx.arc(P[i][0], P[i][1], r, 0, Math.PI * 2); ctx.fill(); } } ctx.globalAlpha = 1; pulse *= .95; requestAnimationFrame(tick); };
  tick(); return { chapter(c) { hue = COLS[c]; }, pulse() { pulse = Math.max(pulse, .8); } };
})();

/* ------------------------------------------------------------------ meme ui */
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1600); };
const bump = (k) => { Y[k]++; const e = $('#y-' + k); e.textContent = fmt(Y[k]); e.parentElement.classList.remove('bump'); void e.offsetWidth; e.parentElement.classList.add('bump'); const t = $('#t-' + k); if (t) t.textContent = fmt(Y[k]); };
const memeParams = () => new URLSearchParams({ t: st.top, b: st.bot, bg: st.bg, f: st.fig }).toString();
const memeUrl = () => `${location.origin}${location.pathname}#4&${memeParams()}`;
const fromHash = () => { const h = location.hash.slice(1); const amp = h.indexOf('&'); const idx = parseInt(amp < 0 ? h : h.slice(0, amp)) || 0; if (amp >= 0) { const p = new URLSearchParams(h.slice(amp + 1)); if (p.has('t') || p.has('b')) { st.top = p.get('t') || ''; st.bot = p.get('b') || ''; st.bg = p.get('bg') || '#00ff41'; st.fig = p.get('f') || ''; } } return idx; };
const render = () => { const svg = meme(st.top, st.bot, st.bg, st.fig); ['#preview', '#preview2', '#preview3'].forEach((s) => { const e = $(s); if (e) e.innerHTML = svg; }); document.querySelectorAll('#bgs button').forEach((b) => b.classList.toggle('on', b.dataset.k === st.bg)); document.querySelectorAll('#figs button').forEach((b) => b.classList.toggle('on', b.dataset.k === st.fig)); const u = memeUrl(); $('#sh-url').textContent = u; $('#sh-x').href = 'https://x.com/intent/post?' + new URLSearchParams({ text: `${st.top} — ${st.bot}`, url: u }); $('#sh-tg').href = 'https://t.me/share/url?' + new URLSearchParams({ url: u, text: `${st.top} — ${st.bot}` }); };
BGS.forEach((k) => { const b = el(`<button data-k="${k}" title="${k}"></button>`); b.style.background = k === 'graph' ? 'radial-gradient(circle,#ff1a00 0,#000 70%)' : k === 'black' ? '#000' : k === 'white' ? '#fff' : k; b.onclick = () => { st.bg = k; render(); }; $('#bgs').appendChild(b); });
FIGS.forEach((f) => { const b = el(`<button data-k="${f}">${f || '∅'}</button>`); b.onclick = () => { st.fig = f; render(); }; $('#figs').appendChild(b); });
$('#top').oninput = (e) => { st.top = e.target.value; render(); }; $('#bot').oninput = (e) => { st.bot = e.target.value; render(); };
$('#rnd').onclick = () => { const c = CANON[Math.random() * CANON.length | 0]; [st.top, st.bot, st.bg, st.fig] = c; $('#top').value = st.top; $('#bot').value = st.bot; render(); };
const mint = async (top, bot, bg, fig) => { const b = await png(meme(top, bot, bg, fig, 1200)); const h = await sha(await b.arrayBuffer()); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `cyberia-meme-${h.slice(0, 8)}.png`; a.click(); bump('mint'); sfx.link(); return h; };
$('#mint').onclick = async () => { const h = await mint(st.top, st.bot, st.bg, st.fig); $('#hash').innerHTML = `particle <b>${h}</b><br>sha-256 of the png you just minted · the same bytes anywhere give the same name`; toast('minted ' + h.slice(0, 8)); };
const copyLink = () => { navigator.clipboard?.writeText(memeUrl()).then(() => { bump('links'); sfx.mentor(); toast('link copied'); }); };
$('#copy').onclick = copyLink; $('#sh-copy').onclick = copyLink;

/* the wall: pages of 8 */
const PAGE = 8; const wall = $('#wall');
const drawWall = () => { wall.innerHTML = ''; const pages = Math.ceil(CANON.length / PAGE); st.page = (st.page + pages) % pages; $('#pg-lab').textContent = `${st.page + 1} / ${pages}`; CANON.slice(st.page * PAGE, st.page * PAGE + PAGE).forEach(([t, b, bg, f]) => { const d = el(`<div class="card">${meme(t, b, bg, f, 400)}<div class="acts"><button data-a="png">png</button><button data-a="link">link</button></div></div>`); d.onclick = (e) => { const a = e.target.dataset.a; if (a === 'png') { e.stopPropagation(); mint(t, b, bg, f).then((h) => toast('minted ' + h.slice(0, 8))); return; } if (a === 'link') { e.stopPropagation(); [st.top, st.bot, st.bg, st.fig] = [t, b, bg, f]; render(); copyLink(); return; } [st.top, st.bot, st.bg, st.fig] = [t, b, bg, f]; $('#top').value = t; $('#bot').value = b; render(); go(4); }; wall.appendChild(d); }); fit(); };
$('#pg-prev').onclick = () => { st.page--; drawWall(); }; $('#pg-next').onclick = () => { st.page++; drawWall(); };

const start = fromHash(); $('#top').value = st.top; $('#bot').value = st.bot; drawWall(); render();
graphReady.then(() => { drawWall(); render(); });
addEventListener('hashchange', () => { const i = fromHash(); render(); go(i); });
go(start);
})();
