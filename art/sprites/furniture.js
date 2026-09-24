// Furniture & decor for the house cutaway. Mostly procedural (boxes with an
// ink outline, light top edge, shadowed right edge) plus small ASCII sprites.
import { C, CLOTH, mix } from '../palette.js';
import { sprite } from '../lib/pix.js';

function box(pix, x, y, w, h, fill, light, shadow, outline = C.ink) {
  pix.rect(x, y, w, h, fill);
  if (light) pix.hline(x + 1, x + w - 2, y + 1, light);
  if (shadow) pix.vline(x + w - 2, y + 1, y + h - 2, shadow);
  if (outline) pix.frame(x, y, w, h, outline);
}

const SPR = {
  cat: sprite(`
.o.o......
oxoxo.....
oxkxxooooo
oxexxxxxxXo
.oxxxXxXxXo
..oooooooo.
`, { x: 'gold1', X: 'gold0', k: 'gold2', e: 'ink' }),
  catSleep: sprite(`
.o.o.......
oxoxooooo..
oxxxxxxxxo.
oKxxXxxXxxo
.oooooooooo
`, { x: 'gold1', X: 'gold0', K: 'gold2' }),
  trophy: sprite(`
ooooo
oxkxo
.oxo.
..o..
.oxo.
ooooo
`, { x: 'gold2', k: 'gold3' }),
  plantSmall: sprite(`
.g.g.
gGgGg
.gGg.
.ooo.
.oxo.
.ooo.
`, { g: 'green2', G: 'green1', x: 'red2' }),
  guitar: sprite(`
..oo.
..ox.
..ox.
.oxxo
oxkxxo
oxoxxo
oxxxxo
.oooo.
`, { x: 'wood3', k: 'wood4' }),
  plane: sprite(`
...o...
..oxo..
ooxxxoo
..oxo..
.oxxxo.
`, { x: 'white' }),
  house: sprite(`
..o..
.oxo.
oxxxo
ohkho
ohkho
`, { x: 'red1', h: 'cream', k: 'wood2' }),
  pagoda: sprite(`
..o..
ooxoo
.oxo.
oooxo
.oxo.
`, { x: 'red1' }),
  car: sprite(`
.ooo..
oxkxo.
oxxxxo
.o..o.
`, { x: 'teal2', k: 'blue4' }),
  star: sprite(`
.o.
oxo
.o.
`, { x: 'gold2' }),
  fruit: sprite(`
.g.r..
oyxrro
oooooo
.oxxo.
`, { g: 'green2', r: 'red1', y: 'gold2', x: 'teal2' }),
  sodaCan: sprite(`
.t.
oxo
owo
oxo
`, { x: 'red1', w: 'cream', t: 'stone' }),
  cookieJar: sprite(`
.oo.
oxxo
okko
oyyo
oyyo
.oo.
`, { x: 'wood2', k: 'blue4', y: 'wood3' }),
  cake: sprite(`
..r...
.okkko.
okpkpko
oyyyyyo
.ooooo.
..oxo..
.ooooo.
`, { r: 'red1', k: 'cream', p: 'pink2', y: 'gold2', x: 'mist' }),
  bills: sprite(`
.oooo..
okkkoo.
okrrkko
okkkkko
okkkkko
.ooooo.
`, { k: 'cream', r: 'red1' }),
  coffeeMaker: sprite(`
ooooo
oxxxo
oxbbo
oxoooo
oxkko.
ooooo.
`, { x: 'ink2', b: 'wood1', k: 'mist' }),
  mailbox: sprite(`
.oooo..
oxxxxoo
oxxxxor
oXXXXor
.oooo..
...o...
...o...
...o...
...o...
...o...
..ooo..
`, { x: 'blue2', X: 'blue1', r: 'red1' }),
};

export const F = {
  window(pix, x, y, w, h, time, curtain) {
    box(pix, x, y, w, h, C.cream, null, null);
    const gx = x + 2, gy = y + 2, gw = w - 4, gh = h - 4;
    const top = time === 'day' ? C.day1 : time === 'night' ? C.night0 : C.night2;
    const mid = time === 'day' ? C.day2 : time === 'night' ? C.night1 : C.dusk1;
    const bot = time === 'day' ? C.cream : time === 'night' ? C.night2 : C.dusk2;
    pix.gradient(gx, gy, gw, gh, [top, mid, bot], 2);
    if (time !== 'day') { pix.px(gx + 2, gy + 2, C.cream); pix.px(gx + gw - 3, gy + 4, C.mist); }
    // mullions
    pix.vline(x + (w >> 1), gy, gy + gh - 1, C.cream);
    pix.hline(gx, gx + gw - 1, y + (h >> 1), C.cream);
    // glare
    pix.px(gx + 1, gy + gh - 3, C.white, 0.5); pix.px(gx + 2, gy + gh - 4, C.white, 0.5);
    // sill
    pix.rect(x - 2, y + h, w + 4, 2, C.wood3);
    pix.hline(x - 2, x + w + 1, y + h + 1, C.wood1);
    pix.frame(x - 2, y + h, w + 4, 2, C.ink);
    // curtains
    if (curtain) {
      const dark = mix(curtain, C.ink, 0.35), light = mix(curtain, C.white, 0.25);
      pix.rect(x - 3, y - 2, w + 6, 2, C.wood1);
      for (const cx of [x - 3, x + w - 1]) {
        for (let j = 0; j < h + 2; j++) {
          const pinch = j > (h >> 1) - 1 && j < (h >> 1) + 2;
          const wdt = pinch ? 2 : 4;
          const off = cx < x ? 0 : 4 - wdt;
          for (let i = 0; i < wdt; i++) pix.px(cx + off + i, y + j, i === 0 ? light : i === wdt - 1 ? dark : curtain);
        }
        pix.hline(cx, cx + 3, y + (h >> 1), C.gold1);
      }
    }
  },

  frame(pix, x, y, w, h, content) {
    box(pix, x, y, w, h, C.wood2, null, null);
    const ix = x + 1, iy = y + 1, iw = w - 2, ih = h - 2;
    pix.rect(ix, iy, iw, ih, C.day1);
    if (content === 'mountain') {
      for (let i = 0; i < iw; i++) {
        const m = Math.max(0, (iw >> 1) - Math.abs(i - (iw >> 1)) - 1);
        pix.vline(ix + i, iy + ih - m - 1, iy + ih - 1, C.green1);
        if (m > 3) pix.px(ix + i, iy + ih - m - 1, C.white);
      }
      pix.px(ix + iw - 2, iy + 1, C.gold2);
    } else if (content === 'family') {
      pix.rect(ix, iy, iw, ih, C.gold3);
      pix.rect(ix + 1, iy + 2, 2, 3, C.wood1); pix.rect(ix + 4, iy + 1, 2, 4, C.red1); pix.rect(ix + 7, iy + 3, 2, 2, C.teal1);
    }
  },

  dresser(pix, x, y) {
    box(pix, x, y, 20, 16, C.wood2, C.wood3, C.wood1);
    for (const dy of [5, 10]) pix.hline(x + 1, x + 18, y + dy, C.wood1);
    for (const dy of [3, 8, 13]) { pix.px(x + 6, y + dy, C.gold2); pix.px(x + 13, y + dy, C.gold2); }
    pix.rect(x + 1, y + 16, 2, 0, C.ink);
    // jewelry box + small photo on top
    box(pix, x + 3, y - 3, 5, 3, C.red1, C.red2, null);
    box(pix, x + 12, y - 5, 5, 5, C.wood3, null, null);
    pix.rect(x + 13, y - 4, 3, 3, C.pink3);
  },

  bed(pix, x, y, quilt, person) {
    // headboard (left)
    box(pix, x, y, 5, 18, C.wood2, C.wood3, C.wood1);
    pix.rect(x + 1, y + 2, 3, 1, C.wood1);
    // footboard (right)
    box(pix, x + 41, y + 7, 4, 11, C.wood2, C.wood3, C.wood1);
    // frame
    box(pix, x + 4, y + 13, 38, 4, C.wood1, C.wood2, null);
    // mattress + quilt
    const qd = mix(quilt, C.ink, 0.35), ql = mix(quilt, C.white, 0.3);
    pix.rect(x + 5, y + 8, 36, 5, C.cream);
    pix.rect(x + 13, y + 7, 28, 6, quilt);
    pix.hline(x + 13, x + 40, y + 7, ql);
    for (let i = x + 15; i < x + 41; i += 5) { pix.px(i, y + 9, ql); pix.px(i + 2, y + 11, qd); }
    pix.hline(x + 13, x + 40, y + 12, qd);
    pix.frame(x + 4, y + 6, 38, 8, C.ink);
    // pillow
    pix.rect(x + 5, y + 5, 8, 4, C.white);
    pix.hline(x + 5, x + 12, y + 8, C.mist);
    pix.frame(x + 5, y + 4, 8, 5, C.ink);
    if (person) person(pix, x + 3, y - 8);
  },

  nightstand(pix, x, y, nightGuard) {
    box(pix, x, y, 9, 12, C.wood2, C.wood3, C.wood1);
    pix.hline(x + 1, x + 7, y + 5, C.wood1);
    pix.px(x + 4, y + 3, C.gold2);
    if (nightGuard) {
      // tiny case for the night guard
      pix.rect(x + 5, y - 2, 3, 2, C.teal2);
      pix.frame(x + 5, y - 2, 3, 2, C.ink);
    }
  },

  lamp(pix, x, y, lit) {
    if (lit) pix.glow(x + 3, y + 3, 16, C.glow0, 0.35);
    const shade = sprite(`
.ooooo.
okkkkko
okkkkKo
oookooo
...o...
..ooo..
..oxo..
.ooooo.
`, { k: lit ? 'glow1' : 'cream', K: lit ? 'glow0' : 'mist', x: 'teal2' });
    pix.sprite(shade, x, y + 2);
  },

  mirror(pix, x, y) {
    box(pix, x, y, 12, 13, C.gold1, null, null);
    pix.rect(x + 1, y + 1, 10, 11, C.blue4);
    pix.line(x + 3, y + 9, x + 8, y + 3, C.white);
    pix.line(x + 3, y + 10, x + 4, y + 9, C.white);
    pix.rect(x + 1, y + 1, 10, 11, C.blue3, 0.25);
  },

  sink(pix, x, y, toothbrush) {
    // basin
    box(pix, x, y, 14, 5, C.white, null, C.mist);
    pix.hline(x + 2, x + 11, y + 1, C.mist);
    // faucet
    pix.rect(x + 6, y - 3, 2, 3, C.stone); pix.rect(x + 6, y - 3, 4, 1, C.stone);
    pix.frame(x + 5, y - 4, 3, 4, C.ink);
    // pedestal
    box(pix, x + 5, y + 5, 4, 15, C.white, null, C.mist);
    // cup + toothbrush on the basin rim
    if (toothbrush && toothbrush !== 'none') {
      const cx = x + 10, cy = y - 4;
      box(pix, cx, cy, 4, 4, C.teal2, null, null);
      if (toothbrush === 'electric') {
        pix.rect(cx + 1, cy - 5, 2, 5, C.white); pix.px(cx + 1, cy - 3, C.teal1); pix.px(cx + 2, cy - 3, C.teal1);
        pix.frame(cx, cy - 6, 4, 6, C.ink);
      } else {
        pix.vline(cx + 1, cy - 5, cy, toothbrush === 'dusty' ? C.stone : C.pink1);
        pix.px(cx + 1, cy - 6, C.white); pix.px(cx + 2, cy - 6, C.white);
        pix.vline(cx + 2, cy - 4, cy, C.blue2);
        pix.px(cx + 2, cy - 5, C.white); pix.px(cx + 3, cy - 5, C.white);
      }
      if (toothbrush === 'dusty') { pix.px(cx - 1, cy - 7, C.mist); pix.px(cx + 3, cy - 8, C.mist); pix.line(cx + 4, cy - 6, cx + 6, cy - 8, C.mist); }
    }
  },

  towel(pix, x, y, color) {
    pix.hline(x - 1, x + 8, y, C.stone);
    pix.px(x - 1, y - 1, C.ink2); pix.px(x + 8, y - 1, C.ink2);
    const d = mix(color, C.ink, 0.3);
    box(pix, x, y + 1, 8, 11, color, mix(color, C.white, 0.3), d);
    pix.hline(x + 1, x + 6, y + 8, C.white);
  },

  tub(pix, x, y) {
    box(pix, x, y, 30, 11, C.white, null, C.mist);
    pix.hline(x, x + 29, y + 1, C.mist);
    pix.rect(x + 2, y + 2, 26, 2, C.blue4);
    // bubbles
    for (const [bx, by] of [[x + 6, y - 1], [x + 9, y - 2], [x + 19, y - 1], [x + 23, y - 2], [x + 14, y - 1]]) {
      pix.px(bx, by, C.white); pix.px(bx + 1, by, C.blue4);
    }
    // faucet
    pix.rect(x + 25, y - 4, 2, 4, C.stone); pix.rect(x + 23, y - 4, 3, 1, C.stone);
    // feet
    for (const fx of [x + 2, x + 25]) { pix.rect(fx, y + 11, 3, 3, C.gold1); pix.px(fx, y + 13, C.gold0); }
  },

  books(pix, x, y, n) {
    const cols = [C.red1, C.teal1, C.gold1, C.plum2, C.green2, C.blue2, C.pink1, C.wood2, C.teal2];
    let bx = x;
    for (let i = 0; i < n; i++) {
      const h = 5 + ((i * 7) % 3);
      const c = cols[i % cols.length];
      pix.rect(bx, y + 7 - h, 1, h, c);
      pix.px(bx, y + 7 - h + 1, mix(c, C.white, 0.4));
      bx += 1 + (i % 4 === 3 ? 1 : 0);
    }
    pix.frame(x - 1, y - 1, bx - x + 1, 9, null);
  },

  trophy(pix, x, y) { pix.sprite(SPR.trophy, x, y); },
  plantSmall(pix, x, y) { pix.sprite(SPR.plantSmall, x, y + 2); },

  desk(pix, x, y) {
    box(pix, x, y, 26, 3, C.wood3, C.wood4, null);
    box(pix, x + 16, y + 3, 9, 7, C.wood2, null, C.wood1);
    pix.px(x + 20, y + 5, C.gold2);
    pix.rect(x + 1, y + 3, 2, 13, C.wood1); pix.rect(x + 23, y + 10, 2, 6, C.wood1);
    pix.vline(x, y + 3, y + 15, C.ink); pix.vline(x + 3, y + 3, y + 15, C.ink);
  },

  laptopOpen(pix, x, y, lit) {
    if (lit) pix.glow(x + 5, y + 3, 10, C.blue3, 0.25);
    box(pix, x, y, 10, 7, C.blue1, null, null);
    pix.rect(x + 1, y + 1, 8, 5, lit ? C.blue3 : C.blue1);
    pix.hline(x + 2, x + 5, y + 2, C.white); pix.hline(x + 2, x + 7, y + 4, C.blue4);
    pix.rect(x - 2, y + 7, 13, 1, C.stone); pix.hline(x - 2, x + 10, y + 7, C.mist);
    pix.px(x - 3, y + 7, C.ink);
  },

  chair(pix, x, y, color) {
    const d = mix(color, C.ink, 0.35);
    box(pix, x, y - 8, 3, 14, color, null, d);
    box(pix, x, y + 4, 9, 3, color, mix(color, C.white, 0.3), null);
    pix.vline(x + 1, y + 7, y + 15, C.ink); pix.vline(x + 7, y + 7, y + 15, C.ink);
  },

  bookshelf(pix, x, y) {
    box(pix, x, y, 22, 38, C.wood1, null, null);
    pix.rect(x + 2, y + 2, 18, 34, C.wood0);
    for (let k = 0; k < 4; k++) {
      const sy = y + 2 + k * 9;
      pix.rect(x + 1, sy + 8, 20, 1, C.wood2);
      if (k === 1) {
        // photo frame + plant on this shelf
        pix.rect(x + 4, sy + 2, 6, 6, C.gold1); pix.rect(x + 5, sy + 3, 4, 4, C.pink3);
        pix.sprite(SPR.plantSmall, x + 13, sy + 2);
      } else if (k === 3) {
        // board games / boxes
        pix.rect(x + 3, sy + 4, 8, 4, C.red1); pix.hline(x + 3, x + 10, sy + 4, C.red2);
        pix.rect(x + 3, sy + 1, 8, 3, C.teal1); pix.hline(x + 3, x + 10, sy + 1, C.teal2);
        this.books(pix, x + 13, sy + 1, 5);
      } else {
        this.books(pix, x + 3, sy + 1, 12 - k * 2);
      }
    }
  },

  dreamBoard(pix, x, y, dreams = 2) {
    box(pix, x, y, 26, 17, C.wood1, null, null);
    pix.rect(x + 1, y + 1, 24, 15, C.wood3);
    pix.dither(x + 1, y + 1, 24, 15, C.gold1, 0.3);
    const cards = [
      [SPR.pagoda, x + 3, y + 3, C.day2],
      [SPR.guitar, x + 11, y + 3, C.cream],
      [SPR.house, x + 18, y + 4, C.green4],
      [SPR.car, x + 4, y + 10, C.pink3],
    ];
    cards.forEach(([spr, cx, cy, bg], i) => {
      pix.rect(cx - 1, cy - 1, spr.w + 2, Math.min(spr.h + 2, 16 - (cy - y)), bg);
      pix.sprite(spr, cx, cy);
      pix.px(cx + (spr.w >> 1), cy - 1, C.red1); // pin
      if (i < dreams) pix.sprite(SPR.star, cx + spr.w - 1, cy + spr.h - 2);
      else if (dreams === 0 || i >= dreams + 1) pix.rect(cx - 1, cy - 1, spr.w + 2, Math.min(spr.h + 2, 16 - (cy - y)), C.mist, 0.55); // fading dreams
    });
  },

  floorLamp(pix, x, y, lit) {
    if (lit) pix.glow(x + 3, y + 4, 22, C.glow0, 0.35);
    const sh = lit ? C.glow1 : C.cream;
    pix.rect(x, y, 7, 5, sh);
    pix.hline(x, x + 6, y + 4, lit ? C.glow0 : C.mist);
    pix.frame(x, y, 7, 5, C.ink);
    pix.vline(x + 3, y + 5, y + 30, C.ink2);
    pix.rect(x + 1, y + 30, 5, 2, C.ink2);
  },

  couch(pix, x, y, color) {
    const ramp = Array.isArray(color) ? color : [mix(color, C.ink, 0.35), color, mix(color, C.white, 0.3)];
    const [d, b, l] = ramp;
    // back cushions
    box(pix, x + 3, y, 15, 8, b, l, d);
    box(pix, x + 18, y, 15, 8, b, l, d);
    // seat
    box(pix, x + 3, y + 7, 30, 6, b, l, d);
    pix.vline(x + 18, y + 8, y + 11, d);
    // arms
    box(pix, x, y + 4, 5, 11, b, l, d);
    box(pix, x + 31, y + 4, 5, 11, b, l, d);
    // base + legs
    pix.rect(x + 1, y + 13, 34, 3, d);
    pix.frame(x, y + 13, 36, 3, C.ink);
    pix.rect(x + 2, y + 16, 2, 2, C.wood0); pix.rect(x + 32, y + 16, 2, 2, C.wood0);
    // throw pillow
    box(pix, x + 5, y + 3, 6, 5, C.teal2, C.teal3, C.teal1);
  },

  tv(pix, x, y, era = 'modern', on = true) {
    // stand
    box(pix, x, y + 16, 20, 12, C.wood2, C.wood3, C.wood1);
    pix.hline(x + 1, x + 18, y + 21, C.wood1);
    pix.px(x + 5, y + 19, C.gold2); pix.px(x + 14, y + 19, C.gold2);
    if (era === 'crt') {
      box(pix, x + 2, y + 2, 16, 14, C.stone, C.mist, C.shade);
      pix.rect(x + 4, y + 4, 10, 9, on ? C.blue3 : C.ink2);
      pix.frame(x + 3, y + 3, 12, 11, C.ink);
      pix.px(x + 16, y + 6, C.red1); pix.px(x + 16, y + 9, C.ink2);
      pix.line(x + 8, y + 1, x + 5, y - 4, C.ink2); pix.line(x + 10, y + 1, x + 13, y - 4, C.ink2);
    } else {
      box(pix, x - 1, y + 2, 22, 13, C.ink, null, null);
      pix.rect(x + 1, y + 4, 18, 9, on ? C.blue2 : C.ink2);
      if (on) {
        // a cozy show: hills and a sun
        pix.rect(x + 1, y + 10, 18, 3, C.green2);
        pix.rect(x + 13, y + 5, 3, 3, C.gold2);
        pix.hline(x + 3, x + 8, y + 6, C.blue4);
      }
      pix.rect(x + 8, y + 15, 4, 1, C.ink2);
    }
    if (on) pix.glow(x + 10, y + 9, 14, C.blue3, 0.2);
  },

  coinJar(pix, x, y, fill = 0.5) {
    const lid = y, top = y + 2, h = 6;
    pix.rect(x + 1, lid, 5, 2, C.red1); pix.frame(x + 1, lid, 5, 2, C.ink);
    pix.rect(x, top, 7, h, C.blue4, 0.6);
    const lvl = Math.round(fill * (h - 1));
    for (let j = 0; j < lvl; j++) for (let i = 1; i < 6; i++) pix.px(x + i, top + h - 1 - j, (i + j) % 3 ? C.gold2 : C.gold1);
    pix.frame(x, top, 7, h, C.ink);
    pix.px(x + 1, top + 1, C.white);
  },

  plant(pix, x, y) {
    const leaves = sprite(`
....g..g....
..ggGggGgg..
.gGgggggGgg.
ggGgGggGgGgg
.gggGGggggG.
..gGgggGgg..
...gg.ggg...
....oooo....
...oxxxxo...
...oxxxXo...
....oxXo....
....oooo....
`, { g: 'green2', G: 'green1', x: 'red2', X: 'red1' });
    pix.sprite(leaves, x - 2, y + 6);
  },

  cat(pix, x, y, sleeping = true) { pix.sprite(sleeping ? SPR.catSleep : SPR.cat, x, y); },

  upperCabinets(pix, x, y, w) {
    box(pix, x, y, w, 13, C.wood3, C.wood4, C.wood2);
    const doors = Math.max(1, Math.round(w / 11));
    const dw = w / doors;
    for (let i = 1; i < doors; i++) pix.vline(Math.round(x + i * dw), y + 1, y + 11, C.ink2);
    for (let i = 0; i < doors; i++) pix.px(Math.round(x + i * dw + dw / 2 + (i % 2 ? -2 : 2)), y + 9, C.gold2);
  },

  counter(pix, x, y, w) {
    pix.rect(x, y, w, 3, C.mist);
    pix.hline(x, x + w - 1, y, C.white);
    pix.frame(x, y, w, 3, C.ink);
    box(pix, x + 1, y + 3, w - 2, 13, C.wood2, null, C.wood1);
    const n = Math.round(w / 12);
    for (let i = 1; i < n; i++) pix.vline(x + 1 + Math.round(i * (w - 2) / n), y + 4, y + 14, C.wood1);
    for (let i = 0; i < n; i++) pix.px(x + 1 + Math.round((i + 0.5) * (w - 2) / n), y + 6, C.gold2);
    pix.rect(x + 2, y + 16, w - 4, 2, C.ink2);
  },

  stove(pix, x, y) {
    box(pix, x, y - 4, 16, 4, C.stone, C.mist, null);
    pix.px(x + 3, y - 2, C.red1); pix.px(x + 6, y - 2, C.ink2); pix.px(x + 9, y - 2, C.ink2); pix.px(x + 12, y - 2, C.red1);
    box(pix, x, y, 16, 18, C.white, null, C.mist);
    pix.rect(x + 3, y + 5, 10, 6, C.ink2);
    pix.rect(x + 4, y + 6, 8, 4, C.gold1, 0.6);
    pix.frame(x + 2, y + 4, 12, 8, C.ink);
    pix.hline(x + 3, x + 12, y + 2, C.stone);
    // pot on the burner
    box(pix, x + 2, y - 9, 7, 5, C.teal1, C.teal2, null);
    pix.px(x + 1, y - 8, C.ink); pix.px(x + 9, y - 8, C.ink);
  },

  counterStuff(pix, s) {
    const items = s.counter || [];
    let cx = 201;
    const baseY = 136;
    for (const it of items) {
      if (it === 'fruit') { pix.sprite(SPR.fruit, cx, baseY - 4); cx += 9; }
      else if (it === 'coffee') { pix.sprite(SPR.coffeeMaker, cx, baseY - 6); cx += 9; }
      else if (it === 'cookies') { pix.sprite(SPR.cookieJar, cx, baseY - 6); cx += 7; }
      else if (it === 'cake') { pix.sprite(SPR.cake, cx, baseY - 7); cx += 10; }
      else if (it === 'bills') { pix.sprite(SPR.bills, cx, baseY - 6); cx += 9; }
      else if (it.startsWith('soda')) {
        const n = +(it.split(':')[1] || 3);
        for (let i = 0; i < n; i++) pix.sprite(SPR.sodaCan, cx + i * 4, baseY - 4 - (i % 2 ? 0 : 0));
        cx += n * 4 + 3;
      } else if (it === 'water') {
        pix.rect(cx, baseY - 7, 3, 7, C.blue3); pix.frame(cx, baseY - 7, 3, 7, C.ink); pix.px(cx + 1, baseY - 8, C.teal1); cx += 6;
      }
    }
  },

  fridge(pix, x, y, notes = []) {
    box(pix, x, y, 16, 38, C.cream, C.white, C.mist);
    pix.hline(x + 1, x + 14, y + 12, C.ink2);
    pix.rect(x + 12, y + 4, 1, 6, C.stone); pix.rect(x + 12, y + 15, 1, 9, C.stone);
    let ny = y + 15;
    for (const n of notes) {
      if (n === 'calendar') {
        pix.rect(x + 2, ny, 8, 9, C.white); pix.rect(x + 2, ny, 8, 2, C.red1);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) pix.px(x + 3 + c * 2, ny + 3 + r * 2, C.stone);
        pix.frame(x + 2, ny, 8, 9, C.ink2);
        ny += 11;
      } else if (n === 'postcard' || n === 'postcards') {
        const k = n === 'postcards' ? 3 : 1;
        for (let i = 0; i < k; i++) {
          const px = x + 2 + i * 2, py = ny + i * 3;
          pix.rect(px, py, 7, 5, C.blue4); pix.hline(px, px + 6, py, C.teal2);
          pix.px(px + 2, py + 2, C.teal1); pix.px(px + 4, py + 3, C.stone);
          pix.frame(px, py, 7, 5, C.ink2);
        }
        ny += 6 + k * 3;
      } else if (n === 'drawing') {
        pix.rect(x + 2, ny, 8, 7, C.white);
        pix.line(x + 3, ny + 5, x + 5, ny + 2, C.red1); pix.line(x + 5, ny + 2, x + 8, ny + 5, C.blue2);
        pix.px(x + 7, ny + 1, C.gold2);
        pix.frame(x + 2, ny, 8, 7, C.ink2);
        ny += 9;
      } else if (n === 'photo') {
        pix.rect(x + 3, y + 4, 6, 5, C.pink3); pix.frame(x + 3, y + 4, 6, 5, C.white);
      }
    }
    // magnets
    pix.px(x + 4, y + 3, C.red1); pix.px(x + 8, y + 7, C.teal2);
  },

  clock(pix, x, y) {
    pix.disc(x + 3, y + 3, 3, C.ink);
    pix.disc(x + 3, y + 3, 2, C.cream);
    pix.px(x + 3, y + 2, C.ink); pix.px(x + 4, y + 3, C.ink);
  },

  mailbox(pix, x, y) { pix.sprite(SPR.mailbox, x, y + 3); },

  bush(pix, x, y) {
    pix.disc(x + 4, y + 4, 4, C.green0);
    pix.disc(x + 9, y + 5, 3, C.green0);
    pix.disc(x + 4, y + 3, 3, C.green1);
    pix.disc(x + 9, y + 4, 2, C.green1);
    pix.px(x + 3, y + 2, C.green2);
  },

  box(pix, x, y, w, h) {
    box(pix, x, y, w, h, C.wood3, C.wood4, C.wood2);
    pix.vline(x + (w >> 1), y + 1, y + 3, C.gold3);
    pix.hline(x + 2, x + w - 3, y + (h >> 1) + 1, C.wood2);
  },

  crib(pix, x, y) {
    pix.rect(x, y + 2, 20, 2, C.cream);
    pix.rect(x, y + 11, 20, 2, C.cream);
    for (let i = 0; i < 20; i += 3) pix.vline(x + i, y + 2, y + 13, C.cream);
    pix.vline(x, y, y + 14, C.mist); pix.vline(x + 19, y, y + 14, C.mist);
    pix.rect(x + 2, y + 9, 16, 2, C.pink3);
  },

  hockeyStick(pix, x, y) {
    pix.line(x, y, x + 8, y + 16, C.wood3);
    pix.line(x + 1, y, x + 9, y + 16, C.wood2);
    pix.rect(x + 9, y + 15, 5, 2, C.ink2);
  },

  sprites: SPR,
};
