// Review page: draws the house and every art sample live with the game's own
// renderer, and runs a small What-If Lab on the real model in a Web Worker.
import { Pix } from '../art/lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from '../art/palette.js';
import * as P from '../art/sprites/people.js';
import { PROP } from '../art/sprites/props.js';
import { EMOTE } from '../art/sprites/emotes.js';
import { drawHouse } from '../art/scenes/house.js';
import * as sheets from '../art/sheets.js';
import { SAMPLE_DAYS, simulateDay, mouthOf, FOODS, attribution, acidRR, ENAMEL_CRIT, ROOT_CRIT, REPAIR_LINE } from '../sim/stephan.js';
import { simulateLife } from '../sim/model.js';
import { LIVES, MAYA_ACID, MAYA_ACID_MARKERS } from '../sim/lives.js';
import { drawGarden } from '../art/garden.js';
import { TOOLS, BADGES } from '../sim/toolshed.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DATA = JSON.parse(document.getElementById('page-data').textContent);

// ---------------------------------------------------------------------------
// Pixel canvases: native resolution, integer-scaled to fit the column.

function blit(canvas, pix) {
  if (canvas.width !== pix.w) canvas.width = pix.w;
  if (canvas.height !== pix.h) canvas.height = pix.h;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(new ImageData(pix.data, pix.w, pix.h), 0, 0);
}

const fits = new Set();
function fit(canvas) {
  const box = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const avail = box.clientWidth * dpr;
  const scale = Math.max(1, Math.floor(avail / canvas.width));
  canvas.style.width = (canvas.width * scale) / dpr + 'px';
  canvas.style.height = (canvas.height * scale) / dpr + 'px';
}
const ro = new ResizeObserver(() => fits.forEach(fit));
function mount(canvas) {
  fits.add(canvas);
  ro.observe(canvas.parentElement);
  fit(canvas);
}

// ---------------------------------------------------------------------------
// Hero: Maya's house. Pick her answer at 34 and jump to 45 or 62.

const hero = document.getElementById('house');
const state = { choice: 'later', age: 34, time: 'dusk' };
const FEAT = DATA.featured;

const LOOKS = {
  34: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown },
  45: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.teal, bottom: CLOTH.denim, shoes: CLOTH.brown },
  62: { skin: SKIN.tan, hair: HAIR.pepper, top: CLOTH.white, bottom: CLOTH.brown, acc: CLOTH.sage, shoes: CLOTH.brown },
};
const JUNE = {
  34: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mint, bottom: CLOTH.mint, shoes: CLOTH.red },
  45: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.lilac, bottom: CLOTH.denim, shoes: CLOTH.brown },
  62: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mustard, bottom: CLOTH.denim, shoes: CLOTH.brown },
};
const GRANDKID = { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.sky, bottom: CLOTH.denim, shoes: CLOTH.red };

function houseOptions({ choice, age, time }) {
  const later = choice === 'later';
  const base = { time, moon: [300, 58], cat: true };
  if (age === 34) return { ...base, counter: ['fruit', 'coffee'], fridgeNotes: later ? ['calendar', 'postcards'] : ['calendar', 'drawing'], dreams: 2, savings: 0.5 };
  if (age === 45) return later
    ? { ...base, counter: ['soda:3', 'bills'], fridgeNotes: ['postcards'], dreams: 1, savings: 0.3 }
    : { ...base, counter: ['fruit', 'water', 'coffee'], fridgeNotes: ['calendar', 'drawing'], dreams: 2, savings: 0.6 };
  return later
    ? { ...base, counter: ['bills', 'soda:2'], fridgeNotes: ['postcards'], dreams: 0, savings: 0.1 }
    : { ...base, counter: ['fruit', 'water'], fridgeNotes: ['calendar', 'photo'], dreams: 4, savings: 0.9 };
}

function bubble(pix, x, y, text, good) {
  const w = 7 + text.length * 5;
  pix.panel(x, y, w, 11, good ? C.teal1 : C.red1, C.ink);
  pix.text(text, x + 4, y + 3, C.white);
  pix.px(x + w - 5, y + 11, C.ink); pix.px(x + w - 4, y + 12, C.ink);
}

let cacheKey = '', cache = null;
function drawHero(t) {
  const key = `${state.choice}|${state.age}|${state.time}`;
  if (key !== cacheKey) {
    cache = new Pix(320, 180);
    drawHouse(cache, houseOptions(state));
    cacheKey = key;
  }
  const pix = new Pix(320, 180);
  pix.data.set(cache.data);
  const later = state.choice === 'later';
  const age = state.age;
  const blink = !reduceMotion && t % 44 === 0;
  const look = LOOKS[age];
  const glasses = age === 62;
  const head = age === 62 ? 'bob' : 'bun';

  // twinkling stars
  if (!reduceMotion && state.time !== 'day') {
    for (const [x, y, k] of [[44, 16, 0], [98, 12, 1], [262, 18, 2], [120, 4, 3]]) if (((t >> 2) + k) % 4 === 0) pix.px(x, y, C.gold3);
  }

  // June through the years
  if (age === 34) {
    const jig = !reduceMotion && (t >> 1) % 2 ? 1 : 0;
    P.drawPerson(pix, 176 + jig, 100, { head: 'pigtails', face: 'content', body: 'kidDress', arms: 'kidBrush', look: JUNE[34] });
  } else if (age === 45) {
    P.drawPerson(pix, 78, 100, { head: 'long', back: 'long', face: 'smile', body: 'teenHoodie', arms: 'hold', look: JUNE[45], after: [{ spr: PROP.phone, dx: 6, dy: 0 }] });
  } else {
    P.drawPerson(pix, 116, 154, { head: 'long', back: 'long', face: 'grin', body: 'tee', arms: 'down', look: JUNE[62] });
    P.drawPerson(pix, 134, 154, { head: 'toddler', face: 'happy', body: 'toddler', arms: null, look: GRANDKID });
  }

  // Maya
  const x = 176, f = 154;
  let spec;
  if (age === 34) {
    spec = { arms: 'hold', face: later ? 'worried' : 'smile', after: [{ spr: PROP.phone, dx: 6, dy: 0 }] };
  } else if (age === 45) {
    spec = later ? { arms: 'cheek', face: 'wince' } : { arms: 'hold', face: 'content', after: [{ spr: PROP.mug, dx: 5, dy: 0 }] };
  } else {
    spec = later ? { arms: 'cheek', face: 'sad', after: [{ spr: PROP.icepack, dx: 10, dy: -6 }] } : { arms: 'hold', face: 'grin', after: [{ spr: PROP.ticket, dx: 4, dy: 1 }] };
  }
  const body = age === 62 ? 'cardigan' : 'tee';
  const res = P.drawPerson(pix, x, f, { head, body, look, glasses, ...spec, face: blink ? 'sleep' : spec.face });
  if (age === 34) {
    if (!reduceMotion && (t >> 1) % 2 === 0) pix.sprite(PROP.phoneRing, x + 5, res.bodyY - 3);
    bubble(pix, x - 2, res.headY - 16, later ? 'Later...' : 'Book it!', !later);
    if (later) pix.sprite(EMOTE.sweat, x + 14, res.headY + 1);
  } else if (age === 45 && later) {
    pix.sprite(EMOTE.pain, x + 17, res.headY + 6);
  } else if (age === 45 && !later && !reduceMotion) {
    pix.sprite(PROP.steam, x + 6, res.bodyY - 4, { flip: (t >> 2) % 2 === 1 });
  } else if (age === 62 && !later) {
    pix.sprite(PROP.suitcase, 200, f - 8);
    pix.sprite(EMOTE.sparkleSm, x + 15, res.headY - 2);
  }
  blit(hero, pix);
}

function caption() {
  const s = FEAT[state.choice === 'later' ? 'snapLater' : 'snapBookIt'][state.age];
  const money = '$' + s.oop.toLocaleString('en-US');
  const lost = s.missing === 1 ? '1 tooth' : `${s.missing} teeth`;
  const who = state.choice === 'later' ? '“Later...”' : '“Book it”';
  document.getElementById('house-caption').textContent =
    state.age === 34
      ? `Maya at 34, the moment she answers ${who}. Spent on her teeth since 18: ${money}.`
      : `Maya at ${state.age} after ${who}: ${money} spent on her teeth since 18, ${s.painDays} days in pain, ${lost} lost.`;
}

function bindSegmented(id, key, parse = v => v) {
  const group = document.getElementById(id);
  group.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state[key] = parse(b.dataset.value);
    for (const x of group.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
    caption();
    drawHero(frame);
  });
}
bindSegmented('choice', 'choice');
bindSegmented('age', 'age', Number);
bindSegmented('time', 'time');

let frame = 0;
blit(hero, new Pix(320, 180));
mount(hero);
drawHero(0);
caption();
if (!reduceMotion) setInterval(() => { frame++; drawHero(frame); }, 125);

// Maya's numbers (400 same-luck pairs)
if (FEAT.seed) document.getElementById('hero-note').textContent = `Every image on this page is drawn live by the game's own pixel renderer. The numbers come from the simulation: one same-luck pair of Maya's lives, seed ${FEAT.seed}.`;
{
  const s = DATA.summary;
  const $ = v => '$' + Math.round(v).toLocaleString('en-US');
  document.getElementById('t-45').textContent = $(s.medianExtraCostBy45);
  document.getElementById('t-80').textContent = $(s.medianExtraCostBy80);
  document.getElementById('t-teeth').textContent = String(s.medianExtraMissingAt80);
  document.getElementById('t-share').textContent = Math.round(s.shareWorseBy80 * 100) + '%';
}

// ---------------------------------------------------------------------------
// Gallery: every art sample, drawn live.

for (const canvas of document.querySelectorAll('canvas[data-sheet]')) {
  const name = canvas.dataset.sheet;
  const pix = name === 'mockupDay' ? sheets.mockupDay() : name === 'twolives' ? sheets.twolives(DATA.featured) : name === 'toothpaste' ? sheets.toothpaste(DATA.paste) : sheets[name]();
  blit(canvas, pix);
  mount(canvas);
}

// ---------------------------------------------------------------------------
// Which choices matter most: two small multiples (cost, teeth) sharing rows.

function leverChart() {
  const rows = DATA.levers;
  const host = document.getElementById('levers');
  const tip = document.getElementById('lever-tip');
  const fmtMoney = v => (v > 0 ? '+$' : v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US');
  const fmtCompact = v => {
    const a = Math.abs(v), sign = v > 0 ? '+' : v < 0 ? '−' : '';
    return sign + '$' + (a >= 1000 ? (a / 1000).toFixed(1) + 'k' : String(Math.round(a)));
  };
  const fmtNum = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
  // one scale per column; labels get reserved room inside the cell so nothing spills
  const scaleFor = vals => {
    const min = Math.min(0, ...vals), max = Math.max(0, ...vals);
    const padL = min < 0 ? 33 : 2, padR = 33;
    const usable = 100 - padL - padR, span = max - min || 1;
    const zero = padL + (-min / span) * usable;
    return { zero, len: v => (Math.abs(v) / span) * usable };
  };
  const costS = scaleFor(rows.map(r => r.dCostMean));
  const teethS = scaleFor(rows.map(r => r.dMissing80));
  const cell = (v, S, fmt) => {
    const len = S.len(v);
    const pos = v >= 0;
    const left = pos ? S.zero : S.zero - len;
    const label = pos ? `left:calc(${(S.zero + len).toFixed(2)}% + 5px)` : `right:calc(${(100 - left).toFixed(2)}% + 5px)`;
    return `<div class="bar-cell" style="--zero:${S.zero.toFixed(2)}%">
      <span class="bar ${pos ? 'pos' : 'neg'}" style="left:${left.toFixed(2)}%;width:${Math.max(0.6, len).toFixed(2)}%"></span>
      <span class="bar-val" style="${label}">${fmt(v)}</span>
    </div>`;
  };
  host.innerHTML = rows.map((r, i) => `
    <div class="lever-row" tabindex="0" data-i="${i}">
      <div class="lever-label">${r.lever}</div>
      ${cell(r.dCostMean, costS, fmtCompact)}
      ${cell(r.dMissing80, teethS, fmtNum)}
    </div>`).join('');
  const show = (el, e) => {
    const r = rows[+el.dataset.i];
    tip.innerHTML = `<strong>${r.lever}</strong><br>Lifetime dental cost ${fmtMoney(r.dCostMean)}<br>Teeth lost by 80 ${fmtNum(r.dMissing80)}<br>Days in pain ${r.dPainDays > 0 ? '+' : r.dPainDays < 0 ? '−' : ''}${Math.abs(r.dPainDays)}<br>Years hiding a smile ${fmtNum(r.dSelfConsciousYears)}`;
    tip.hidden = false;
    const box = host.getBoundingClientRect();
    const rb = el.getBoundingClientRect();
    tip.style.top = rb.bottom - box.top + 6 + 'px';
    const x = e && e.clientX ? e.clientX - box.left : rb.width / 2;
    tip.style.left = Math.max(0, Math.min(x - 115, box.width - 234)) + 'px';
  };
  host.addEventListener('mousemove', e => { const el = e.target.closest('.lever-row'); if (el) show(el, e); });
  host.addEventListener('mouseleave', () => { tip.hidden = true; });
  host.addEventListener('focusin', e => { const el = e.target.closest('.lever-row'); if (el) show(el); });
  host.addEventListener('focusout', () => { tip.hidden = true; });
  // a label that can't fit its cell is hidden, never clipped (tooltip + table keep the value)
  const place = () => {
    for (const el of host.querySelectorAll('.bar-val')) {
      el.style.visibility = '';
      const c = el.parentElement.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (r.right > c.right + 1 || r.left < c.left - 1) el.style.visibility = 'hidden';
    }
  };
  place();
  new ResizeObserver(place).observe(host);
  // table view
  document.getElementById('lever-table').innerHTML = `<table><thead><tr><th>One change vs a typical life</th><th>Lifetime cost</th><th>Teeth lost by 80</th><th>Days in pain</th><th>Years hiding a smile</th></tr></thead><tbody>${rows
    .map(r => `<tr><td>${r.lever}</td><td>${fmtMoney(r.dCostMean)}</td><td>${fmtNum(r.dMissing80)}</td><td>${r.dPainDays > 0 ? '+' : ''}${r.dPainDays}</td><td>${fmtNum(r.dSelfConsciousYears)}</td></tr>`)
    .join('')}</tbody></table>`;
}
leverChart();

// ---------------------------------------------------------------------------
// What-If Lab: 100 same-luck pairs in a Web Worker.

const worker = new Worker(URL.createObjectURL(new Blob([document.getElementById('sim-worker').textContent], { type: 'text/javascript' })));
const labBtn = document.getElementById('lab-run');
const progress = document.getElementById('lab-progress');
const icons = document.getElementById('lab-icons');
const PERSON = [
  '..###..', '.#####.', '.#####.', '..###..', '.#####.', '#######', '#.###.#', '..#.#..', '..#.#..',
];
function drawIcons(results) {
  const cols = 20, rows = 5, cw = 9, chh = 12;
  const pix = new Pix(cols * cw + 1, rows * chh + 1);
  const css = getComputedStyle(document.documentElement);
  const colorOf = k => css.getPropertyValue(k).trim();
  const worse = colorOf('--worse'), better = colorOf('--better'), same = colorOf('--same');
  for (let i = 0; i < cols * rows; i++) {
    const r = results ? results[i] : null;
    const c = !r ? same : r.dMiss > 0 ? worse : r.dMiss < 0 ? better : same;
    const ox = (i % cols) * cw + 1, oy = Math.floor(i / cols) * chh + 2;
    PERSON.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') pix.px(ox + x, oy + y, c); }));
  }
  blit(icons, pix);
}
drawIcons(null);
mount(icons);

worker.onmessage = e => {
  const m = e.data;
  if (m.type === 'progress') { progress.value = m.done; return; }
  if (m.type === 'done') {
    labBtn.disabled = false;
    labBtn.textContent = 'Live it 100 times';
    const s = m.summary;
    const signM = v => (v > 0 ? '+$' : v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US');
    const sign1 = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
    document.getElementById('lab-cost').textContent = signM(s.dCost);
    document.getElementById('lab-teeth').textContent = sign1(s.dMiss);
    document.getElementById('lab-pain').textContent = (s.dPain > 0 ? '+' : s.dPain < 0 ? '−' : '') + Math.abs(Math.round(s.dPain));
    document.getElementById('lab-smile').textContent = sign1(s.dSelf);
    document.getElementById('lab-summary').textContent =
      `Across 100 lives with the same luck, this change cost teeth in ${s.worse}, saved teeth in ${s.better}, and made no difference to teeth in ${s.same}.`;
    drawIcons(m.results);
  }
};
labBtn.addEventListener('click', () => {
  labBtn.disabled = true;
  labBtn.textContent = 'Living 100 lives...';
  progress.value = 0;
  worker.postMessage({ base: document.getElementById('lab-base').value, change: document.getElementById('lab-change').value, n: 100 });
});
// open in a realistic working state: run the default comparison once
labBtn.click();

// ---------------------------------------------------------------------------
// The Acid Clock: one day's plaque-pH curve (Stephan curve), live from the sim.

const clock = m => { const h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0'); return `${h % 12 || 12}:${mm} ${h < 12 ? 'am' : 'pm'}`; };
const hhmm = m => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const DAY_START = 6 * 60; // the chart runs 6 am -> 6 am
const since6 = m => (m - DAY_START + 1440) % 1440;
const eats = f => !FOODS[f].noSugar; // meals, snacks and sugary drinks
const isMeal = f => f === 'meal' || f === 'dessertMeal';

const ACID_DAYS = SAMPLE_DAYS.filter(d => !['gum', 'dry', 'reflux', 'apnea'].includes(d.id));
const daySelect = document.getElementById('acid-day');
daySelect.innerHTML = ACID_DAYS.map(d => `<option value="${d.id}">${esc(d.label)}</option>`).join('');
const tg = { dry: document.getElementById('acid-dry'), gum: document.getElementById('acid-gum'), water: document.getElementById('acid-water'), ms: document.getElementById('acid-ms'), reflux: document.getElementById('acid-reflux'), apnea: document.getElementById('acid-apnea') };

function acidState() {
  const d = ACID_DAYS.find(x => x.id === daySelect.value) || ACID_DAYS[0];
  const toddler = d.id === 'toddler' || d.id === 'bottle';
  tg.gum.disabled = toddler;
  tg.gum.parentElement.title = toddler ? 'Not for toddlers' : '';
  tg.reflux.disabled = toddler; tg.apnea.disabled = toddler;
  const extra = [];
  for (const it of d.intakes) {
    if (!eats(it.food)) continue;
    const done = it.t + Math.max(it.sip ?? FOODS[it.food].sip ?? 0, 0);
    const meal = isMeal(it.food);
    if (tg.gum.checked && !toddler) extra.push({ t: (done + (meal ? 20 : 10)) % 1440, food: 'gum' });
    if (tg.water.checked && !meal) extra.push({ t: (done + 10) % 1440, food: 'water' });
  }
  if (tg.reflux.checked && !toddler) [30, 200, 380].forEach(dt => extra.push({ t: (d.sleep[0] + dt) % 1440, food: 'reflux' }));
  const intakes = [...d.intakes, ...extra].sort((p, q) => p.t - q.t);
  const nightDry = tg.apnea.checked && !toddler ? 0.4 : 1;
  const baseMouth = mouthOf({ saliva: d.saliva });
  const mouth = mouthOf({ saliva: tg.dry.checked ? 0.35 : d.saliva, ms: tg.ms.checked ? 2 : 1, nightDry });
  const changed = extra.length > 0 || tg.dry.checked && d.saliva > 0.35 || tg.ms.checked || nightDry < 1;
  return {
    d, intakes, mouth, changed,
    base: simulateDay(d.intakes, baseMouth, d.sleep),
    mod: simulateDay(intakes, mouth, d.sleep),
  };
}

function svgEl(host, W, H) {
  let svg = host.querySelector('svg');
  if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); host.prepend(svg); }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  return svg;
}

let acidNow = null, acidCursor = null;
function drawAcid() {
  const st = acidNow = acidState();
  const host = document.getElementById('acid-chart');
  const W = Math.max(300, Math.round(host.clientWidth - 12));
  const narrow = W < 560;
  const H = Math.round(Math.min(360, Math.max(250, W * 0.4)));
  const L = 34, R = 10, T = 34, B = 36, pw = W - L - R, ph = H - T - B;
  const x = m => L + (since6(m) / 1440) * pw;
  const y = v => T + ((7.2 - Math.max(4, Math.min(7.2, v))) / 3.2) * ph;
  const path = curve => { let p = ''; for (let i = 0; i <= 1440; i++) { const m = (DAY_START + i) % 1440; p += `${i ? 'L' : 'M'}${(L + (i / 1440) * pw).toFixed(1)},${y(curve[m]).toFixed(1)}`; } return p; };
  let out = '';
  // asleep bands
  const [s0, s1] = st.d.sleep.map(since6);
  const band = (a, b) => `<rect x="${(L + (a / 1440) * pw).toFixed(1)}" y="${T}" width="${(((b - a) / 1440) * pw).toFixed(1)}" height="${ph}" style="fill: color-mix(in srgb, var(--rule) 55%, transparent)"/>`;
  out += s0 < s1 ? band(s0, s1) : band(s0, 1440) + band(0, s1);
  // grid + axis labels
  for (const v of [7, 6, 5, 4]) out += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" style="stroke: var(--rule)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  out += `<text x="${L - 6}" y="${T - 22}" text-anchor="end">pH</text>`;
  const step = narrow ? 360 : 180;
  for (let i = 0; i <= 1440; i += step) {
    const m = (DAY_START + i) % 1440, xx = L + (i / 1440) * pw;
    const label = m === 0 ? 'midnight' : m === 720 ? 'noon' : clock(m).replace(':00', '');
    out += `<line x1="${xx}" x2="${xx}" y1="${T + ph + 10}" y2="${T + ph + 14}" style="stroke: var(--muted)"/><text x="${xx}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === 1440 ? 'end' : 'middle'}">${label}</text>`;
  }
  // acid vs. repair, a balance strip under the plot
  for (let i = 0; i < 1440; ) {
    const v = c0 => (c0 < ENAMEL_CRIT ? 'acid' : c0 >= REPAIR_LINE ? 'repair' : 'none');
    const k = v(st.mod.curve[(DAY_START + i) % 1440]);
    let j = i; while (j < 1440 && v(st.mod.curve[(DAY_START + j) % 1440]) === k) j++;
    if (k !== 'none') out += `<rect x="${(L + (i / 1440) * pw).toFixed(1)}" y="${T + ph + 3}" width="${(((j - i) / 1440) * pw).toFixed(1)}" height="6" style="fill: color-mix(in srgb, var(${k === 'acid' ? '--worse' : '--better'}) ${k === 'acid' ? 75 : 55}%, transparent)"/>`;
    i = j;
  }
  // acid area of the current curve
  const c = st.mod.curve;
  let area = '';
  for (let i = 0; i < 1440; i++) {
    const m = (DAY_START + i) % 1440;
    if (c[m] >= ENAMEL_CRIT) continue;
    let j = i; while (j < 1440 && c[(DAY_START + j) % 1440] < ENAMEL_CRIT) j++;
    area += `M${(L + (i / 1440) * pw).toFixed(1)},${y(ENAMEL_CRIT)}`;
    for (let k = i; k < j; k++) area += `L${(L + (k / 1440) * pw).toFixed(1)},${y(c[(DAY_START + k) % 1440]).toFixed(1)}`;
    area += `L${(L + ((j - 1) / 1440) * pw).toFixed(1)},${y(ENAMEL_CRIT)}Z`;
    i = j;
  }
  out += `<path d="${area}" style="fill: color-mix(in srgb, var(--worse) 45%, transparent)"/>`;
  // reference lines
  out += `<line x1="${L}" x2="${W - R}" y1="${y(ROOT_CRIT)}" y2="${y(ROOT_CRIT)}" style="stroke: var(--muted); stroke-dasharray: 2 4"/>`;
  out += `<text class="ref-label" x="${W - R - 4}" y="${y(ROOT_CRIT) - 5}" text-anchor="end">${narrow ? '6.2 roots' : '6.2 exposed roots dissolve'}</text>`;
  out += `<line x1="${L}" x2="${W - R}" y1="${y(ENAMEL_CRIT)}" y2="${y(ENAMEL_CRIT)}" style="stroke: var(--worse)"/>`;
  out += `<text class="ref-label" x="${W - R - 4}" y="${y(ENAMEL_CRIT) - 5}" text-anchor="end">${narrow ? '5.5 enamel' : '5.5 enamel dissolves'}</text>`;
  // curves
  if (st.changed) out += `<path d="${path(st.base.curve)}" fill="none" style="stroke: var(--muted); stroke-width: 2; stroke-dasharray: 5 3"/>`;
  out += `<path d="${path(c)}" fill="none" style="stroke: var(--better); stroke-width: 2; stroke-linejoin: round"/>`;
  // what was eaten, on a shelf above the plot
  const placed = [];
  for (const it of st.intakes) {
    const f = FOODS[it.food], xx = x(it.t);
    let row = 0; while (placed.some(p => p.row === row && Math.abs(p.x - xx) < 11)) row++;
    placed.push({ x: xx, row });
    const cy = T - 8 - row * 10;
    const kind = !eats(it.food) ? (f.effect ? 'helper' : 'none') : isMeal(it.food) ? 'meal' : 'sugar';
    const style = kind === 'sugar' ? 'fill: var(--worse); stroke: var(--surface); stroke-width: 2' : kind === 'helper' ? 'fill: var(--surface); stroke: var(--better); stroke-width: 2' : 'fill: var(--muted); stroke: var(--surface); stroke-width: 2';
    const sip = it.sip ?? f.sip ?? 0;
    if (sip >= 30) out += `<line x1="${xx}" x2="${Math.min(W - R, xx + (sip / 1440) * pw)}" y1="${cy}" y2="${cy}" style="stroke: var(--worse); stroke-width: 2"/>`;
    out += `<circle cx="${xx.toFixed(1)}" cy="${cy}" r="4.5" style="${style}"><title>${clock(it.t)} · ${esc(f.label)}${sip >= 30 ? `, sipped over ${sip} min` : ''}</title></circle>`;
  }
  // crosshair (hidden until hover/focus)
  out += `<g id="acid-cross" style="display:none"><line y1="${T}" y2="${T + ph}" style="stroke: var(--ink-2)"/><circle r="4" class="dot-mod" style="fill: var(--better); stroke: var(--surface); stroke-width: 2"/><circle r="4" class="dot-base" style="fill: var(--muted); stroke: var(--surface); stroke-width: 2; display: ${st.changed ? 'inline' : 'none'}"/></g>`;
  const svg = svgEl(host, W, H);
  svg.innerHTML = out;
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Plaque pH from 6 am to 6 am for “${st.d.label}”. ${hhmm(st.mod.acidMinutes)} below pH 5.5. Use the arrow keys to read the curve; the table below lists every food.`);
  svg._geom = { L, pw, T, ph, x, y, W };
  const lg = document.getElementById('acid-legend').children;
  lg[0].textContent = st.changed ? 'With your changes' : 'This day';
  lg[1].style.display = st.changed ? '' : 'none';
  acidTiles(st);
  if (acidCursor != null) showAcidCursor(acidCursor);
}

function acidTiles(st) {
  const { mod, base, changed } = st;
  const delta = (a, b, fmt, moreIsBetter = false) => {
    if (!changed || a === b) return '';
    const up = a > b;
    return `<span class="delta ${up !== moreIsBetter ? 'up' : 'down'}">${fmt(Math.abs(a - b))} ${up ? 'more' : 'less'}</span>`;
  };
  const rrM = acidRR(mod.acidDose), rrB = acidRR(base.acidDose);
  const tiles = [
    ['Acid time', hhmm(mod.acidMinutes) + delta(mod.acidMinutes, base.acidMinutes, hhmm), 'below pH 5.5, where enamel dissolves'],
    ['Longest stretch', `${mod.longest} min` + delta(mod.longest, base.longest, v => `${v} min`), `starting ${clock(mod.longestStart)}`],
    ['Repair time', hhmm(mod.repairMinutes) + delta(mod.repairMinutes, base.repairMinutes, hhmm, true), 'back above pH 6.0, enamel regains minerals'],
    ['Acid while asleep', hhmm(mod.sleepAcid) + delta(mod.sleepAcid, base.sleepAcid, hhmm), 'saliva nearly stops in sleep'],
    ['Cavity pressure', `×${rrM.toFixed(2)}` + delta(Math.round(rrM * 100), Math.round(rrB * 100), v => `${(v / 100).toFixed(2)}`), 'vs. three snacks between meals'],
    ['Exposed roots', hhmm(mod.rootMinutes) + delta(mod.rootMinutes, base.rootMinutes, hhmm), 'below pH 6.2, if gums have receded'],
  ];
  document.getElementById('acid-tiles').innerHTML = tiles.map(([l, v, sub]) => { const [val, d = ''] = v.split('<span'); return `<div class="tile"><span class="label">${l}</span><span class="value">${val}</span>${d ? '<span' + d : ''}<span class="sub">${sub}</span></div>`; }).join('');
  // one plain sentence about what changed
  const why = [];
  if (tg.dry.checked && st.d.saliva > 0.35) why.push('a drying medication slows saliva, so every dip lasts longer and food lingers');
  if (tg.ms.checked) why.push('more cavity bacteria make every dip deeper');
  if (tg.gum.checked && !tg.gum.disabled) why.push('gum after eating brings the pH back up faster');
  if (tg.water.checked) why.push('a water rinse after snacks helps a little');
  if (tg.reflux.checked && !tg.reflux.disabled) why.push('night-time reflux connects with acid spikes while asleep, with no food involved, and with acid wear');
  if (tg.apnea.checked && !tg.apnea.disabled) why.push('mouth breathing in sleep connects with a drier mouth at night, so anything eaten near bedtime (or reflux) lingers');
  const same = base.acidMinutes === mod.acidMinutes;
  const nightTip = same && tg.apnea.checked ? ' On this day nothing is eaten near bedtime, so try “Snacks + a cookie after brushing” or add reflux.' : '';
  document.getElementById('acid-note').textContent = changed
    ? `${same ? `Acid time stays at ${hhmm(mod.acidMinutes)}` : `Acid time goes from ${hhmm(base.acidMinutes)} to ${hhmm(mod.acidMinutes)}`}: ${why.join('; ')}.${nightTip}`
    : `${st.d.label}: ${hhmm(mod.acidMinutes)} a day below pH 5.5, the longest stretch ${mod.longest} minutes. Tick a box above to change the mouth or the habits.`;
  // table: what each food adds
  const att = attribution(st.intakes, st.mouth, st.d.sleep);
  document.getElementById('acid-table').innerHTML = `<table><thead><tr><th>Time</th><th>Food or drink</th><th class="num">Acid time it adds</th></tr></thead><tbody>${att
    .map(a => `<tr><td>${clock(a.t)}</td><td>${esc(FOODS[a.food].label)}${(a.sip ?? 0) >= 30 ? `, sipped over ${a.sip} min` : ''}</td><td class="num">${a.acidMinutes > 0 ? '+' + hhmm(a.acidMinutes) : a.acidMinutes < 0 ? '−' + hhmm(-a.acidMinutes) : '0'}</td></tr>`)
    .join('')}</tbody></table>`;
}

function showAcidCursor(i) {
  const st = acidNow, svg = document.querySelector('#acid-chart svg');
  if (!svg || !st) return;
  const g = svg._geom, m = (DAY_START + i) % 1440;
  const cross = svg.querySelector('#acid-cross');
  const xx = g.L + (i / 1440) * g.pw;
  cross.style.display = '';
  cross.querySelector('line').setAttribute('x1', xx); cross.querySelector('line').setAttribute('x2', xx);
  const dm = cross.querySelector('.dot-mod'), db = cross.querySelector('.dot-base');
  dm.setAttribute('cx', xx); dm.setAttribute('cy', g.y(st.mod.curve[m]));
  db.setAttribute('cx', xx); db.setAttribute('cy', g.y(st.base.curve[m]));
  const last = [...st.intakes].filter(it => since6(it.t) <= i && FOODS[it.food].drop > 0).pop();
  const tip = document.getElementById('acid-tip');
  tip.innerHTML = `<strong>${clock(m)}</strong><br>pH ${st.mod.curve[m].toFixed(2)}${st.changed ? ' with your changes' : ''}${st.changed ? `<br>pH ${st.base.curve[m].toFixed(2)} as described` : ''}${last ? `<br>Last: ${esc(FOODS[last.food].label)} at ${clock(last.t)}` : ''}${st.mod.curve[m] < ENAMEL_CRIT ? '<br><em>Enamel is dissolving</em>' : st.mod.curve[m] >= REPAIR_LINE ? '<br><em>Repairing</em>' : ''}`;
  tip.hidden = false;
  const host = document.getElementById('acid-chart');
  const scale = svg.getBoundingClientRect().width / g.W;
  tip.style.top = '6px';
  tip.style.left = Math.max(4, Math.min(xx * scale + 14, host.clientWidth - 238)) + 'px';
  if (xx * scale + 250 > host.clientWidth) tip.style.left = Math.max(4, xx * scale - 244) + 'px';
}
{
  const host = document.getElementById('acid-chart');
  const toIndex = e => {
    const svg = host.querySelector('svg'), g = svg._geom, r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * g.W;
    return Math.max(0, Math.min(1439, Math.round(((px - g.L) / g.pw) * 1440)));
  };
  host.addEventListener('mousemove', e => { if (e.target.closest('svg')) { acidCursor = toIndex(e); showAcidCursor(acidCursor); } });
  host.addEventListener('mouseleave', () => { acidCursor = null; document.getElementById('acid-tip').hidden = true; const c = host.querySelector('#acid-cross'); if (c) c.style.display = 'none'; });
  host.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    acidCursor = e.key === 'Home' ? 0 : e.key === 'End' ? 1439 : Math.max(0, Math.min(1439, (acidCursor ?? 0) + (e.key === 'ArrowLeft' ? -10 : 10)));
    showAcidCursor(acidCursor);
  });
  host.addEventListener('focusout', () => { acidCursor = null; document.getElementById('acid-tip').hidden = true; });
  daySelect.addEventListener('change', () => {
    const d = ACID_DAYS.find(x => x.id === daySelect.value);
    if (d.saliva < 1) tg.dry.checked = true;
    drawAcid();
  });
  for (const t of Object.values(tg)) t.addEventListener('change', drawAcid);
  new ResizeObserver(() => drawAcid()).observe(host);
}

// ---------------------------------------------------------------------------
// The Acid Clock over a lifetime: minutes a day below 5.5, age 0-79, one life.

const PHASE_WORDS = {
  sodas: v => `${v} soda${v === 1 ? '' : 's'} a day`, sipping: v => (v ? 'sips drinks' : 'finishes drinks'), withMeals: v => (v ? 'sweets with meals' : 'snacks between meals'),
  gum: v => (v ? 'gum after eating' : 'no gum'), dryMouthMeds: v => (v ? 'drying medication' : 'off the medication'), bedtimeSnack: v => (v ? 'snack after brushing' : 'no bedtime snack'),
  job: v => `job: ${v}`, visits: v => `visits: ${v}`, smoking: v => (v === 'never' ? 'quits smoking' : v),
};
const ACID_LIVES = [
  ['maya', 'Maya, as her habits change', MAYA_ACID, MAYA_ACID_MARKERS],
  ['typical', 'A typical US life', LIVES.typical],
  ['baker', 'The Baker', LIVES.baker],
  ['soda', 'The Soda Sipper', LIVES.soda],
  ['nightSnacker', 'Night snacker', LIVES.nightSnacker],
  ['mealtime', 'Sweets with meals + gum', LIVES.mealtime],
  ['dryMouth', 'Dry-mouth medication from 55', LIVES.dryMouth],
];
const lifeSelect = document.getElementById('acid-life');
lifeSelect.innerHTML = ACID_LIVES.map(([id, label]) => `<option value="${id}">${esc(label)}</option>`).join('');
const lifeCache = new Map();
function lifeFor(id) {
  if (!lifeCache.has(id)) {
    const [, label, plan, markers] = ACID_LIVES.find(l => l[0] === id);
    const life = simulateLife(plan, 12, { log: false });
    const mk = markers || (plan.phases || []).map(ph => ({ age: ph.age, label: Object.entries(ph.set).map(([k, v]) => (PHASE_WORDS[k] ? PHASE_WORDS[k](v) : k)).join(', ') }));
    lifeCache.set(id, { label, life, markers: mk });
  }
  return lifeCache.get(id);
}

function drawAcidLifeChart() {
  const { life, markers, label } = lifeFor(lifeSelect.value);
  const host = document.getElementById('acid-life-chart');
  const W = Math.max(300, Math.round(host.clientWidth - 12));
  const H = Math.round(Math.min(260, Math.max(190, W * 0.26)));
  const L = 40, R = 10, T = 30, B = 26, pw = W - L - R, ph = H - T - B;
  const years = life.yearly.filter(yr => yr.age < 80);
  const peakH = Math.max(...years.map(yr => yr.acidMin)) / 60, stepH = peakH > 8 ? 4 : 2;
  const maxH = Math.max(6, Math.ceil(peakH / stepH) * stepH);
  const y = v => T + ph - (v / (maxH * 60)) * ph;
  const bw = pw / 80;
  let out = '';
  for (let hh = 0; hh <= maxH; hh += stepH) out += `<line x1="${L}" x2="${W - R}" y1="${y(hh * 60)}" y2="${y(hh * 60)}" style="stroke: var(--rule)"/><text x="${L - 6}" y="${y(hh * 60) + 4}" text-anchor="end">${hh}h</text>`;
  for (const yr of years) {
    const v = yr.acidMin;
    if (v <= 0) continue;
    const bx = L + yr.age * bw, top = y(v);
    out += `<rect x="${(bx + 0.5).toFixed(1)}" y="${top.toFixed(1)}" width="${Math.max(1, bw - 1.5).toFixed(1)}" height="${(T + ph - top).toFixed(1)}" rx="${bw > 6 ? 2 : 0}" style="fill: var(--worse)"/>`;
  }
  for (const a of [0, 10, 20, 30, 40, 50, 60, 70, 80]) {
    const xx = L + a * bw;
    out += `<line x1="${xx}" x2="${xx}" y1="${T + ph}" y2="${T + ph + 4}" style="stroke: var(--muted)"/><text x="${xx}" y="${H - 6}" text-anchor="${a === 0 ? 'start' : a === 80 ? 'end' : 'middle'}">${a}</text>`;
  }
  markers.forEach((mk, i) => {
    const xx = L + mk.age * bw + bw / 2;
    out += `<line x1="${xx}" x2="${xx}" y1="${T - 4}" y2="${T + ph}" style="stroke: var(--ink-2); stroke-dasharray: 2 3"/>`;
    out += `<circle cx="${xx}" cy="${T - 8 - (i % 2) * 10}" r="4.5" style="fill: var(--surface); stroke: var(--ink-2); stroke-width: 2"><title>${mk.age}: ${esc(mk.label)}</title></circle>`;
  });
  out += `<rect id="acid-life-hover" x="0" y="${T}" width="0" height="${ph}" style="fill: var(--ink); opacity: 0.08; display: none"/>`;
  const svg = svgEl(host, W, H);
  svg.innerHTML = out;
  svg.setAttribute('role', 'img');
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('aria-label', `Minutes a day below pH 5.5 for each year of life, 0 to 79: ${label}. The table below has the numbers by stage of life.`);
  svg._geom = { L, pw, bw, W, years, markers };
  // table by stage
  const stages = [['Toddler', 1, 3], ['Kid', 4, 12], ['Teen', 13, 17], ['18–21', 18, 21], ['Working years', 22, 64], ['Retired', 65, 79]];
  const avg = (a0, a1, k) => { const v = years.filter(yr => yr.age >= a0 && yr.age <= a1).map(yr => yr[k]); return Math.round(v.reduce((p, q) => p + q, 0) / (v.length || 1)); };
  document.getElementById('acid-life-table').innerHTML = `<table><thead><tr><th>Stage of life</th><th class="num">Acid time a day (below 5.5)</th><th class="num">Exposed roots (below 6.2)</th></tr></thead><tbody>${stages
    .map(([n, a0, a1]) => `<tr><td>${n} (${a0}–${a1})</td><td class="num">${hhmm(avg(a0, a1, 'acidMin'))}</td><td class="num">${avg(a0, a1, 'rootMin') ? hhmm(avg(a0, a1, 'rootMin')) : '–'}</td></tr>`)
    .join('')}</tbody></table>${markers.length ? `<p style="margin-top:10px; color: var(--ink-2)">Changes: ${markers.map(mk => `at ${mk.age}, ${esc(mk.label)}`).join('; ')}.</p>` : ''}`;
}
{
  const host = document.getElementById('acid-life-chart');
  const tip = document.getElementById('acid-life-tip');
  let cursor = null;
  const show = age => {
    const svg = host.querySelector('svg'), g = svg._geom, yr = g.years.find(q => q.age === age);
    if (!yr) return;
    const hover = svg.querySelector('#acid-life-hover');
    hover.style.display = ''; hover.setAttribute('x', g.L + age * g.bw); hover.setAttribute('width', g.bw);
    const mk = g.markers.filter(q => q.age <= age).pop();
    tip.innerHTML = `<strong>Age ${age}</strong><br>${hhmm(yr.acidMin)} a day below pH 5.5${yr.rootMin ? `<br>${hhmm(yr.rootMin)} below 6.2 on exposed roots` : ''}${mk ? `<br>Since ${mk.age}: ${esc(mk.label)}` : ''}`;
    tip.hidden = false;
    const scale = svg.getBoundingClientRect().width / g.W, xx = (g.L + age * g.bw) * scale;
    tip.style.top = '6px';
    tip.style.left = (xx + 250 > host.clientWidth ? Math.max(4, xx - 244) : xx + 14) + 'px';
  };
  host.addEventListener('mousemove', e => {
    const svg = host.querySelector('svg'); if (!svg || !e.target.closest('svg')) return;
    const g = svg._geom, r = svg.getBoundingClientRect();
    const age = Math.floor((((e.clientX - r.left) / r.width) * g.W - g.L) / g.bw);
    if (age >= 0 && age < 80) { cursor = age; show(age); }
  });
  const hide = () => { cursor = null; tip.hidden = true; const h = host.querySelector('#acid-life-hover'); if (h) h.style.display = 'none'; };
  host.addEventListener('mouseleave', hide);
  host.addEventListener('focusout', hide);
  host.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    cursor = e.key === 'Home' ? 0 : e.key === 'End' ? 79 : Math.max(0, Math.min(79, (cursor ?? 0) + (e.key === 'ArrowLeft' ? -1 : 1)));
    show(cursor);
  });
  lifeSelect.addEventListener('change', drawAcidLifeChart);
  new ResizeObserver(() => drawAcidLifeChart()).observe(host);
}
drawAcid();
drawAcidLifeChart();

// ---------------------------------------------------------------------------
// The backyard garden: the mouth's ecosystem for one life, as lived and with one
// tool from the shed (same luck).

const gardenLife = document.getElementById('garden-life');
const gardenTool = document.getElementById('garden-tool');
const gardenAge = document.getElementById('garden-age');
const GARDEN_LIVES = [
  ['typical', 'A typical US life', LIVES.typical], ['soda', 'The Soda Sipper', LIVES.soda], ['avoider', 'The Avoider', LIVES.avoider],
  ['baker', 'The Baker', LIVES.baker], ['nightSnacker', 'Night snacker', LIVES.nightSnacker], ['dryMouth', 'Dry-mouth medication from 55', LIVES.dryMouth],
  ['prevention', 'Prevention Pro', LIVES.prevention],
];
gardenLife.innerHTML = GARDEN_LIVES.map(([id, l]) => `<option value="${id}">${esc(l)}</option>`).join('');
const TRYABLE = TOOLS.filter(t => t.set);
gardenTool.innerHTML = `<option value="">Nothing, just compare ages</option>` + TRYABLE.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')
  + `<option value="__cleanings">Cleanings every 6 months</option>`;
const gardenCache = new Map();
function lifeWith(lifeId, toolId) {
  const key = lifeId + '|' + toolId;
  if (!gardenCache.has(key)) {
    const base = GARDEN_LIVES.find(l => l[0] === lifeId)[2];
    const tool = TOOLS.find(t => t.id === toolId);
    const set = toolId === '__cleanings' ? { visits: 'every6' } : tool ? tool.set : {};
    gardenCache.set(key, simulateLife({ ...base, ...set, name: key }, 12, { log: false }));
  }
  return gardenCache.get(key);
}
const pct = v => Math.round(v * 100) + '%';
function drawGardenPair() {
  const age = +gardenAge.value;
  document.getElementById('garden-age-out').textContent = age;
  const toolId = gardenTool.value;
  const A = lifeWith(gardenLife.value, ''), B = toolId ? lifeWith(gardenLife.value, toolId) : null;
  const gA = A.yearly.find(y => y.age === age).garden;
  // with no tool picked, the right-hand garden is the same life 10 years later
  const ageB = B ? age : Math.min(79, age + 10);
  const gB = (B || A).yearly.find(y => y.age === ageB).garden;
  for (const [id, g] of [['garden-a', gA], ['garden-b', gB]]) {
    const pix = new Pix(160, 80);
    drawGarden(pix, 0, 0, 160, 80, g);
    const cv = document.getElementById(id);
    blit(cv, pix);
    if (!fits.has(cv)) mount(cv);
  }
  const label = g => `sugar weeds ${pct(g.sugar)} · gum weeds ${pct(g.gum)} · flowers ${pct(g.flowers)}${g.dry > 0.3 ? ' · dry soil' : ''}`;
  const tool = TOOLS.find(t => t.id === toolId);
  const toolName = toolId === '__cleanings' ? 'cleanings every 6 months' : tool ? tool.name.toLowerCase() : '';
  document.getElementById('garden-a-cap').textContent = `As lived, age ${age}: ${label(gA)}`;
  document.getElementById('garden-b-cap').textContent = B ? `With ${toolName}, age ${age}: ${label(gB)}` : `The same life at ${ageB}: ${label(gB)}`;
  const d = B ? Math.round((gB.sugar - gA.sugar) * 100) : 0, dg = B ? Math.round((gB.gum - gA.gum) * 100) : 0;
  document.getElementById('garden-note').textContent = B
    ? (d === 0 && dg === 0 ? `No change in the garden at ${age}. ${tool && tool.badge === 'emerging' ? 'That can be the honest answer for an emerging tool.' : 'This tool works elsewhere: teeth, injuries or comfort.'}` : `Sugar weeds ${d > 0 ? '+' : ''}${d} points, gum weeds ${dg > 0 ? '+' : ''}${dg} points, same luck. Tools stack with habits; none works alone.`)
    : 'Pick something from the tool shed to see the same life, with the same luck, using it.';
}
gardenLife.addEventListener('change', drawGardenPair);
gardenTool.addEventListener('change', drawGardenPair);
gardenAge.addEventListener('input', drawGardenPair);
drawGardenPair();

// ---------------------------------------------------------------------------
// The tool shed: cards with evidence badges, filterable.

const FILTERS = [['all', 'All'], ['strong', 'Strong'], ['moderate', 'Moderate'], ['low', 'Low certainty'], ['emerging', 'Emerging'], ['generic', 'Generic'], ['dentist', "Ask your dentist"]];
const shedFilter = document.getElementById('shed-filter');
shedFilter.innerHTML = FILTERS.map(([id, l], i) => `<button type="button" data-f="${id}" aria-pressed="${i === 0}">${l}</button>`).join('');
function drawShed(f = 'all') {
  const list = TOOLS.filter(t => f === 'all' || t.badge === f || (f === 'generic' && t.generic) || (f === 'dentist' && t.dentistOnly));
  document.getElementById('shed-grid').innerHTML = list.map(t => `
    <article class="tool">
      <span class="badge" style="--c: var(--b-${t.badge})">${BADGES[t.badge].label}</span>
      <h3>${esc(t.name)}</h3>
      <p>${esc(t.what)}</p>
      <p><strong>What's known:</strong> ${esc(t.known)} <a href="${t.source.url}" target="_blank" rel="noopener">${esc(t.source.label)}</a></p>
      <p><strong>In the game:</strong> ${esc(t.game)}</p>
      <div class="meta">${t.generic ? '<span>Generic options exist</span>' : '<span>Specific products</span>'}${t.dentistOnly ? '<span>Ask your dentist</span>' : ''}</div>
      ${t.set ? `<button type="button" data-try="${t.id}">Try it in the garden</button>` : ''}
    </article>`).join('');
}
shedFilter.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  for (const x of shedFilter.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
  drawShed(b.dataset.f);
});
document.getElementById('shed-grid').addEventListener('click', e => {
  const b = e.target.closest('button[data-try]'); if (!b) return;
  gardenTool.value = b.dataset.try;
  drawGardenPair();
  document.getElementById('garden').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});
drawShed();
