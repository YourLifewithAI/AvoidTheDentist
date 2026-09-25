// The backyard garden (the mouth's ecosystem, no teeth) and the tool shed.
// Garden state comes from the sim's yearly `garden` record:
//   flowers = health-associated bacteria, sugar weeds = acid-loving decay
//   bacteria, gum weeds = anaerobes that creep low and hide deep, dry = saliva.
import { Pix, sprite, measure } from './lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from './palette.js';
import * as P from './sprites/people.js';
import { PROP } from './sprites/props.js';
import { simulateLife } from '../sim/model.js';
import { LIVES } from '../sim/lives.js';
import { TOOLS, SHELVES, BADGES } from '../sim/toolshed.js';

export const G = {
  flower: sprite(`
.p.p.
ppypp
.pgp.
..g..
.gg..
..g..
`, { p: 'pink2', y: 'gold2', g: 'green2' }),
  flower2: sprite(`
.w.w.
wwyww
.wgw.
..g..
..gg.
..g..
`, { w: 'white', y: 'gold1', g: 'green2' }),
  flower3: sprite(`
..b..
.bbb.
..g..
.gg..
..g..
`, { b: 'blue3', g: 'green2' }),
  sugarWeed: sprite(`
..y...y..
.yoy.yoy.
..k...k..
k.k.k.k.k
.kkk.kkk.
k.kkkkk.k
.k.kkk.k.
...kkk...
..k.k.k..
`, { y: 'gold2', o: 'gold0', k: 'green0' }),
  gumWeed: sprite(`
...q.....q..
..qpq.p.qpq.
.qp.pqpqp.pq
qp...p.p...p
p..........p
`, { q: 'plum0', p: 'plum2' }),
  sprout: sprite(`
g.g
.g.
`, { g: 'green3' }),
  soilKit: sprite(`
.oooo.
okkkko
oxyzxo
okkkko
.oooo.
`, { k: 'white', x: 'green2', y: 'gold2', z: 'plum2' }),
  can: sprite(`
....oo.
.ooooo.
oxxxxo.
oxxxxooo
oxxxxo..
.oooo...
`, { x: 'teal2' }),
};

// deterministic scatter positions
const rnd = (i, k) => { let h = (i * 374761393 + k * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

export function drawGarden(pix, x, y, w, h, g, opts = {}) {
  const ground = y + Math.round(h * 0.42);
  // sky + fence
  pix.rect(x, y, w, ground - y, C.day1 || C.blue4);
  pix.rect(x, y, w, 3, C.blue4);
  for (let i = x + 1; i < x + w; i += 7) { pix.rect(i, ground - 14, 5, 14, C.wood4); pix.vline(i + 4, ground - 14, ground - 1, C.wood3); pix.px(i + 2, ground - 15, C.wood4); }
  pix.hline(x, x + w - 1, ground - 10, C.wood2); pix.hline(x, x + w - 1, ground - 4, C.wood2);
  // grass + soil bed (cracked and pale when dry)
  pix.rect(x, ground, w, y + h - ground, C.green2);
  pix.dither(x, ground, w, 3, C.green3, 0.5);
  const bedY = ground + 6, bedH = y + h - bedY - 3;
  const soil = g.dry > 0.3 ? C.wood3 : C.wood1;
  pix.rect(x + 3, bedY, w - 6, bedH, soil);
  pix.dither(x + 3, bedY, w - 6, bedH, g.dry > 0.3 ? C.wood4 : C.wood0, 0.25);
  if (g.dry > 0.3) for (let i = 0; i < Math.round(w / 9); i++) {
    const cx = x + 6 + Math.floor(rnd(i, 9) * (w - 12)), cy = bedY + 2 + Math.floor(rnd(i, 10) * (bedH - 4));
    pix.px(cx, cy, C.wood0); pix.px(cx + 1, cy + 1, C.wood0); pix.px(cx + 2, cy + 1, C.wood0); pix.px(cx - 1, cy - 1, C.wood0);
  }
  // plants: slots across the bed; flowers vs weeds by share
  const slots = Math.max(6, Math.floor((w - 12) / 9));
  const nSugar = Math.round(g.sugar * slots * 0.8), nFlower = Math.max(0, Math.round(g.flowers * slots));
  const order = [...Array(slots).keys()].sort((a, b) => rnd(a, 1) - rnd(b, 1));
  const flowers = [G.flower, G.flower2, G.flower3];
  order.forEach((slot, k) => {
    const px = x + 7 + Math.floor(slot * ((w - 16) / slots));
    const py = bedY - 3 + Math.floor(rnd(slot, 2) * Math.max(1, bedH - 6));
    let spr = null;
    if (k < nSugar) spr = G.sugarWeed;
    else if (k < nSugar + nFlower) spr = g.dry > 0.3 && rnd(slot, 3) < 0.4 ? G.sprout : flowers[slot % 3];
    else if (rnd(slot, 4) < 0.5) spr = G.sprout;
    if (spr) pix.sprite(spr, px, py - spr.h + 4);
  });
  // gum weeds creep along the bottom of the bed
  const nGum = Math.round(g.gum * (w - 10) / 11);
  for (let i = 0; i < nGum; i++) pix.sprite(G.gumWeed, x + 4 + Math.floor(rnd(i, 7) * (w - 18)), y + h - 8);
  pix.frame(x, y, w, h, C.ink);
}

const HYG = { skin: SKIN.brown, hair: HAIR.black, top: CLOTH.sky, bottom: CLOTH.sky, shoes: CLOTH.white };

export function gardenData(seed = 5) {
  const at = (plan, age) => simulateLife(plan, seed, { log: false }).yearly.find(y => y.age === age).garden;
  return [
    { title: 'Prevention Pro, 30', note: 'mostly flowers', g: at(LIVES.prevention, 30) },
    { title: 'Soda Sipper, 30', note: 'sugar weeds', g: at(LIVES.soda, 30) },
    { title: 'The Avoider, 50', note: 'gum weeds: no cleanings', g: at(LIVES.avoider, 50) },
    { title: 'Drying medication, 70', note: 'dry, cracked soil', g: at(LIVES.dryMouth, 70) },
  ];
}

// Sheet: four gardens from four lives, plus the soil test and the gardener.
export function garden(panels = gardenData()) {
  const pix = new Pix(320, 212).clear(C.paper);
  pix.text('The backyard garden: your mouth\'s ecosystem, no teeth', 160, 3, C.ink, { align: 'center' });
  const PW = 152, PH = 62;
  panels.forEach((p, i) => {
    const x = 6 + (i % 2) * (PW + 4), y = 16 + Math.floor(i / 2) * (PH + 24);
    drawGarden(pix, x, y, PW, PH, p.g);
    pix.text(p.title, x + 1, y + PH + 3, C.ink);
    const pct = v => Math.round(v * 100) + '%';
    pix.text(`sugar weeds ${pct(p.g.sugar)} · gum weeds ${pct(p.g.gum)}`, x + 1, y + PH + 11, C.shade);
  });
  // soil test + gardener strip
  const y = 190;
  pix.hline(8, 312, y - 4, C.stone);
  pix.sprite(G.soilKit, 10, y + 1);
  pix.text('Soil test = microbiome test: see the weeds, change a habit, test again.', 20, y + 1, C.shade);
  pix.sprite(G.can, 10, y + 11 - 2);
  pix.text('The hygienist is the gardener: cleanings pull the gum weeds.', 20, y + 11, C.shade);
  return pix;
}

const BADGE_COLOR = { strong: C.green2, moderate: C.teal2, low: C.gold2, emerging: C.plum3 };

// Sheet: the tool shed. Shelves of options, each with its evidence badge.
export function toolshed() {
  const pix = new Pix(320, 172).clear(C.paper);
  pix.text('The tool shed: generics first, every tool with its evidence', 160, 3, C.ink, { align: 'center' });
  // shed interior
  const X = 6, Y = 16, W = 244, H = 144;
  pix.rect(X, Y, W, H, C.wood2);
  for (let i = X + 4; i < X + W; i += 8) pix.vline(i, Y, Y + H - 1, C.wood1);
  pix.frame(X, Y, W, H, C.ink);
  const rowH = Math.floor((H - 8) / SHELVES.length);
  SHELVES.forEach((sh, r) => {
    const sy = Y + 4 + r * rowH;
    const shelfY = sy + rowH - 6;
    pix.rect(X + 3, shelfY, W - 6, 3, C.wood4); pix.hline(X + 3, X + W - 4, shelfY + 3, C.wood0);
    pix.text(sh.label, X + 6, sy + 1, C.cream, { shadow: C.wood0 });
    const items = TOOLS.filter(t => t.shelf === sh.id);
    items.forEach((t, i) => {
      const icon = t.id === 'microbiomeTest' ? G.soilKit : PROP[t.icon] || PROP.paste;
      const ix = X + 66 + i * 29, iw = icon.w * 2;
      pix.sprite(icon, ix, shelfY - icon.h * 2, { scale: 2 });
      pix.rect(ix + iw + 1, shelfY - 5, 5, 5, BADGE_COLOR[t.badge]); pix.frame(ix + iw + 1, shelfY - 5, 5, 5, C.ink);
      if (t.dentistOnly) { pix.rect(ix + iw + 2, shelfY - 10, 3, 3, C.white); pix.frame(ix + iw + 1, shelfY - 11, 5, 5, C.ink); }
    });
  });
  // the player browsing, and the legend
  P.drawPerson(pix, 262, 110, { head: 'bun', face: 'content', body: 'tee', arms: 'hold', look: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown }, after: [{ spr: PROP.gum, dx: 5, dy: 0 }] });
  let ly = 118;
  for (const [k, b] of Object.entries(BADGES)) {
    pix.rect(256, ly, 5, 5, BADGE_COLOR[k]); pix.frame(256, ly, 5, 5, C.ink);
    pix.text(b.short, 264, ly, C.ink);
    ly += 9;
  }
  pix.rect(256, ly, 5, 5, C.white); pix.frame(256, ly, 5, 5, C.ink);
  pix.text('Dentist', 264, ly, C.ink);
  return pix;
}

// Sheet: how much toothpaste for little kids. Numbers from the sim (sim-report.json `paste`).
export const PASTE_DEFAULT = {
  recommended: { fluorosis: 0.65, moderate: 0.017, ecc5: 0.28 }, pea: { fluorosis: 0.72, moderate: 0.017, ecc5: 0.28 },
  lots: { fluorosis: 0.81, moderate: 0.027, ecc5: 0.28 }, none: { fluorosis: 0.5, moderate: 0.007, ecc5: 0.45 },
};
export function toothpaste(data = PASTE_DEFAULT) {
  const pix = new Pix(320, 120).clear(C.paper);
  pix.text('How much toothpaste for little kids?', 160, 3, C.ink, { align: 'center' });
  const pct = v => Math.round(v * 100) + '%';
  const panels = [
    ['brushSmear', 'Rice grain, <3', data.recommended, true],
    ['brushPea', 'Pea, 3 to 6', data.pea, true],
    ['brushRibbon', 'Full ribbon', data.lots, false],
    [null, 'No fluoride', data.none, false],
  ];
  panels.forEach(([spr, label, d, good], i) => {
    const x = 6 + i * 78, y = 16;
    pix.panel(x, y, 74, 70, C.cream, C.ink);
    if (spr) pix.sprite(PROP[spr], x + 13, y + 16, { scale: 4 });
    else { pix.sprite(PROP.toothbrush, x + 21, y + 22, { scale: 4 }); pix.line(x + 14, y + 38, x + 60, y + 12, C.red1); }
    pix.text(label, x + 37, y + 42, C.ink, { align: 'center' });
    pix.text(`fluorosis ${pct(d.fluorosis)}`, x + 37, y + 52, C.shade, { align: 'center' });
    pix.text(`cavities ${pct(d.ecc5)}`, x + 37, y + 61, d.ecc5 > 0.35 ? C.red0 : C.shade, { align: 'center' });
    if (good) pix.sprite(EMOTE_STAR, x + 64, y + 3);
  });
  pix.text('Cavities by age 5. Fluorosis: mostly very mild white flecks.', 160, 92, C.shade, { align: 'center' });
  pix.text('The smear keeps the protection and limits swallowing.', 160, 102, C.shade, { align: 'center' });
  return pix;
}
const EMOTE_STAR = sprite(`
..y..
.yyy.
yyyyy
.y.y.
`, { y: 'gold2' });
