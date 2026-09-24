// The Acid Clock in the game's pixel style: a 24-hour plaque-pH strip for one
// day, and acid time per day across a whole life. Numbers come from the sim
// (sim/stephan.js for the day, sim/model.js for the life).
import { Pix, measure } from './lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from './palette.js';
import * as P from './sprites/people.js';
import { PROP } from './sprites/props.js';
import { EMOTE } from './sprites/emotes.js';
import { simulateDay, mouthOf, ENAMEL_CRIT, ROOT_CRIT, REPAIR_LINE, SAMPLE_DAYS } from '../sim/stephan.js';
import { simulateLife } from '../sim/model.js';
import { MAYA_ACID, MAYA_ACID_MARKERS } from '../sim/lives.js';

export const FOOD_ICON = {
  meal: 'plate', dessertMeal: 'cupcake', cereal: 'plate', fruit: 'apple', driedFruit: 'apple', candy: 'candy', chewy: 'candy',
  chocolate: 'cookie', pastry: 'cupcake', tasting: 'cupcake', cookies: 'cookie', chips: 'chips', bread: 'plate',
  yogurtSweet: 'icecream', soda: 'soda', dietSoda: 'dietSoda', juice: 'juiceBox', juiceBottle: 'bottle', milkBottle: 'bottle',
  sportsDrink: 'sportsDrink', energy: 'energy', sweetCoffee: 'mug', coffee: 'mug', milk: 'sippy', wine: 'mug',
  nuts: 'apple', veggies: 'apple', cheese: 'cheese', gum: 'gum', water: 'water',
};

const hhmm = m => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
export { hhmm };

// One day as a strip: x = 6 am -> 6 am, y = pH 7 (top) -> 4 (bottom).
// Night (asleep) is shaded; acid below 5.5 is filled; foods sit on a shelf above.
export function drawAcidStrip(pix, x, y, w, h, day, opts = {}) {
  const { intakes, sleep, result } = day;
  const start = opts.start ?? 6 * 60;
  const mpp = 1440 / w; // minutes per pixel column
  const top = 7.0, bottom = 4.0;
  const py = pH => y + Math.round(((top - Math.min(top, Math.max(bottom, pH))) / (top - bottom)) * (h - 1));
  const asleep = m => (sleep[0] < sleep[1] ? m >= sleep[0] && m < sleep[1] : m >= sleep[0] || m < sleep[1]);
  const minuteAt = i => Math.round(start + i * mpp) % 1440;
  // background: day paper, night lilac-blue with stars
  for (let i = 0; i < w; i++) {
    const night = asleep(minuteAt(i));
    pix.vline(x + i, y, y + h - 1, night ? C.blue4 : C.cream);
  }
  // guide lines: roots 6.2 (dotted), enamel 5.5 (solid)
  const yRoot = py(ROOT_CRIT), yEnamel = py(ENAMEL_CRIT);
  for (let i = 0; i < w; i += 3) pix.px(x + i, yRoot, C.gold1);
  // curve: lowest pH within each column keeps short dips visible
  const col = [];
  for (let i = 0; i < w; i++) {
    let lo = 14;
    for (let k = 0; k < Math.ceil(mpp); k++) lo = Math.min(lo, result.curve[(Math.floor(start + i * mpp) + k) % 1440]);
    col.push(lo);
  }
  for (let i = 0; i < w; i++) {
    if (col[i] < ENAMEL_CRIT) {
      const yy = py(col[i]);
      pix.rect(x + i, yEnamel + 1, 1, yy - yEnamel, C.red3);
      for (let j = yEnamel + 1; j <= yy; j++) if ((i + j) % 2 === 0) pix.px(x + i, j, C.red2);
    }
  }
  pix.hline(x, x + w - 1, yEnamel, C.red1);
  for (let i = 0; i < w; i++) {
    const y0 = py(col[i]), y1 = i + 1 < w ? py(col[i + 1]) : y0;
    pix.vline(x + i, Math.min(y0, y1), Math.max(y0, y1), C.ink);
  }
  pix.frame(x - 1, y - 1, w + 2, h + 2, C.ink);
  // acid vs. repair: a 2-px balance band under the strip (red: dissolving, teal: regaining minerals)
  for (let i = 0; i < w; i++) {
    const v = col[i] < ENAMEL_CRIT ? C.red1 : col[i] >= REPAIR_LINE ? C.teal2 : C.mist;
    pix.vline(x + i, y + h + 2, y + h + 3, v);
  }
  // moon + zzz in the night band
  const nightCols = [];
  for (let i = 0; i < w; i++) if (asleep(minuteAt(i))) nightCols.push(i);
  if (nightCols.length > 20 && opts.zzz !== false) {
    const mid = nightCols[Math.floor(nightCols.length / 2)];
    pix.sprite(EMOTE.zzz, x + mid - 3, y + h - 9);
  }
  // foods on the shelf above the strip; sipped drinks get a bar for how long they lasted
  const shelf = y - 2;
  const placed = [];
  for (const it of intakes) {
    const icon = PROP[FOOD_ICON[it.food]] || PROP.apple;
    let off = ((it.t - start + 1440) % 1440) / mpp;
    const ix = x + Math.round(off) - Math.floor(icon.w / 2);
    let lift = 0;
    while (placed.some(p => Math.abs(p.x - ix) < Math.max(p.w, icon.w) + 1 && p.lift === lift)) lift += 7;
    placed.push({ x: ix, w: icon.w, lift });
    const iy = shelf - icon.h - lift;
    pix.sprite(icon, ix, iy);
    const sip = it.sip ?? 0;
    if (sip >= 30) pix.hline(x + Math.round(off), Math.min(x + w - 1, x + Math.round(off + sip / mpp)), shelf, C.red1);
  }
  // time ticks
  if (opts.axis) {
    for (const [m, label] of [[6 * 60, '6am'], [12 * 60, 'noon'], [18 * 60, '6pm'], [0, 'midnight'], [6 * 60 + 1439, '6am']]) {
      const i = Math.round(((m - start + 1440) % 1440) / mpp) + (label === '6am' && m > 1440 ? w - 1 : 0);
      const cx = Math.min(x + w - 1, x + i);
      pix.vline(cx, y + h + 4, y + h + 5, C.ink2);
      const tw = measure(label);
      pix.text(label, Math.max(x - 1, Math.min(x + w - tw + 1, cx - Math.floor(tw / 2))), y + h + 7, C.shade);
    }
  }
  return { yRoot, yEnamel };
}

// Acid minutes per day, age 0 to 80, as a row of bars; markers above for choices.
export function drawAcidLife(pix, x, y, w, h, yearly, markers = [], opts = {}) {
  const maxMin = opts.max ?? 480;
  const bw = Math.max(1, Math.floor(w / 80));
  pix.rect(x - 1, y - 1, bw * 80 + 2, h + 2, C.cream);
  // hour grid
  for (let m = 120; m < maxMin; m += 120) {
    const gy = y + h - 1 - Math.round((m / maxMin) * (h - 1));
    for (let i = 0; i < bw * 80; i += 2) pix.px(x + i, gy, C.mist);
  }
  for (const yr of yearly) {
    if (yr.age >= 80) continue;
    const v = Math.min(maxMin, yr.acidMin);
    const bh = Math.max(v > 0 ? 1 : 0, Math.round((v / maxMin) * (h - 1)));
    const bx = x + yr.age * bw;
    pix.rect(bx, y + h - bh, bw, bh, v >= 240 ? C.red1 : v >= 120 ? C.red2 : C.red3);
    if (bw >= 3) pix.vline(bx + bw - 1, y + h - bh, y + h - 1, C.cream);
  }
  pix.frame(x - 1, y - 1, bw * 80 + 2, h + 2, C.ink);
  // markers: icon above the bars at the age a choice changed
  for (const mk of markers) {
    const icon = PROP[mk.icon];
    const mx = x + mk.age * bw;
    pix.vline(mx, y, y + h - 1, C.ink2, 0.5);
    pix.sprite(icon, mx - Math.floor(icon.w / 2), y - icon.h - 2);
  }
  // age ticks
  for (const a of [0, 20, 40, 60, 80]) {
    const ax = x + Math.min(a * bw, bw * 80 - 1);
    pix.vline(ax, y + h + 1, y + h + 2, C.ink2);
    const t = String(a);
    pix.text(t, ax - Math.floor(measure(t) / 2), y + h + 4, C.shade);
  }
}

const LOOKS = {
  young: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown },
  older: { skin: SKIN.tan, hair: HAIR.pepper, top: CLOTH.white, bottom: CLOTH.brown, acc: CLOTH.sage, shoes: CLOTH.brown },
};

function portrait(pix, x, y, w, h, wall, stripe, draw) {
  pix.rect(x, y, w, h, wall);
  for (let i = x + 3; i < x + w; i += 6) pix.vline(i, y, y + h - 9, stripe);
  pix.rect(x, y + h - 8, w, 8, C.wood3);
  pix.hline(x, x + w - 1, y + h - 8, C.wood4);
  pix.hline(x, x + w - 1, y + h - 7, C.wood2);
  draw(y + h - 8);
  pix.frame(x, y, w, h, C.ink);
}

// Sheet: "the same day three ways" + acid time across one life.
export function acidclock(data = acidclockData()) {
  const { days, life, markers } = data;
  const pix = new Pix(320, 314).clear(C.paper);
  pix.text('The Acid Clock', 160, 3, C.ink, { align: 'center' });
  pix.text('Plaque pH through one day. Below the red line, enamel dissolves.', 160, 12, C.shade, { align: 'center' });
  pix.text('Dotted: roots dissolve. Blue: asleep. Band: acid vs. repair.', 160, 21, C.shade, { align: 'center' });

  const SX = 72, SW = 216, SH = 30;
  const rows = [
    { key: 'asIs', y: 57, title: 'Her Tuesday at 30: snacks, two sodas sipped', wall: C.wallCream, stripe: C.wallCreamS,
      person: fy => P.drawPerson(pix, 16, fy, { head: 'bun', face: 'content', body: 'tee', arms: 'hold', look: LOOKS.young, after: [{ spr: PROP.soda, dx: 7, dy: -1 }] }) },
    { key: 'better', y: 119, title: 'Same food: sweets as dessert, sodas with meals', wall: C.wallSage, stripe: C.wallSageS,
      person: fy => P.drawPerson(pix, 16, fy, { head: 'bun', face: 'grin', body: 'tee', arms: 'hold', look: LOOKS.young, after: [{ spr: PROP.cupcake, dx: 6, dy: -1 }] }) },
    { key: 'dry', y: 181, title: 'Same Tuesday at 70, on a drying medication', wall: C.wallBlue, stripe: C.wallBlueS,
      person: fy => P.drawPerson(pix, 16, fy, { head: 'bob', face: 'worried', glasses: true, body: 'cardigan', arms: 'hold', look: LOOKS.older, after: [{ spr: PROP.pill, dx: 6, dy: 0 }] }) },
  ];
  rows.forEach((r, i) => {
    const d = days[r.key];
    portrait(pix, 4, r.y - 18, 48, 48, r.wall, r.stripe, r.person);
    pix.text(r.title, SX - 1, r.y - 26, C.ink);
    drawAcidStrip(pix, SX, r.y, SW, SH, d, { axis: i === rows.length - 1 });
    pix.text(hhmm(d.result.acidMinutes), 317, r.y + 7, C.red0, { align: 'right' });
    pix.text('acid', 317, r.y + 16, C.shade, { align: 'right' });
  });
  // pH scale beside the first strip
  pix.text('7', SX - 6, rows[0].y - 1, C.stone);
  pix.text('5.5', SX - 14, rows[0].y + 12, C.red1);
  pix.text('4', SX - 6, rows[0].y + SH - 5, C.stone);

  // lifetime
  const LY = 252, LH = 30, MAX = 600;
  pix.hline(8, 312, 228, C.stone);
  pix.text('Acid time per day, age 0 to 80: one life, from the sim', 160, 232, C.ink, { align: 'center' });
  drawAcidLife(pix, SX, LY, 240, LH, life.yearly, markers, { max: MAX });
  pix.text('10h', SX - 16, LY - 1, C.stone);
  pix.text('0', SX - 7, LY + LH - 5, C.stone);
  // marker key along the bottom, wrapping
  let kx = 8, ky = 297;
  for (const mk of markers) {
    const ic = PROP[mk.icon], label = `${mk.age}: ${mk.label}`;
    const w = ic.w + 2 + measure(label);
    if (kx + w > 314) { kx = 8; ky += 9; }
    pix.sprite(ic, kx, ky + 5 - ic.h);
    pix.text(label, kx + ic.w + 2, ky, C.shade);
    kx += w + 8;
  }
  return pix;
}

// The sheet's numbers: three versions of one day, and Maya's Acid Clock life.
export function acidclockData(seed = 12) {
  const byId = Object.fromEntries(SAMPLE_DAYS.map(d => [d.id, d]));
  const run = (d, saliva = d.saliva) => ({ intakes: d.intakes, sleep: d.sleep, result: simulateDay(d.intakes, mouthOf({ saliva }), d.sleep) });
  return {
    days: { asIs: run(byId.sodaSip), better: run(byId.better), dry: run(byId.sodaSip, 0.35) },
    life: simulateLife(MAYA_ACID, seed, { log: false }),
    markers: MAYA_ACID_MARKERS,
  };
}

export function sampleDay(intakes, sleep, mouth = {}) {
  return { intakes, sleep, result: simulateDay(intakes, mouthOf(mouth), sleep) };
}
