// Review page: draws the house and every art sample live with the game's own
// renderer, and runs a small What-If Lab on the real model in a Web Worker.
import { Pix } from '../art/lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from '../art/palette.js';
import * as P from '../art/sprites/people.js';
import { PROP } from '../art/sprites/props.js';
import { EMOTE } from '../art/sprites/emotes.js';
import { drawHouse } from '../art/scenes/house.js';
import * as sheets from '../art/sheets.js';

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
  const pix = name === 'mockupDay' ? sheets.mockupDay() : name === 'twolives' ? sheets.twolives(DATA.featured) : sheets[name]();
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
