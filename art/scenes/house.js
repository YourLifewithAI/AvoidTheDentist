// The House: a cozy cutaway dollhouse at 320x180. Every life plays out here.
// drawHouse(pix, state) paints sky, shell, rooms and furniture; people and UI
// are layered on top by the caller.
import { C, mix } from '../palette.js';
import { F } from '../sprites/furniture.js';

export const W = 320;
export const H = 180;
export const GROUND = 160;

// Room rectangles (interior, inclusive-exclusive). footY = floor surface.
export const ROOMS = {
  bedroom: { x: 44, y: 54, w: 112, h: 46, footY: 100 },
  bath: { x: 159, y: 54, w: 63, h: 46, footY: 100 },
  study: { x: 225, y: 54, w: 51, h: 46, footY: 100 },
  living: { x: 44, y: 106, w: 124, h: 48, footY: 154 },
  kitchen: { x: 171, y: 106, w: 105, h: 48, footY: 154 },
  attic: { x: 96, y: 22, w: 128, h: 28, footY: 50 },
};

const SKIES = {
  dusk: [C.night1, C.night2, C.dusk0, C.dusk1, C.dusk2, C.dusk3, C.dusk4],
  day: [C.day0, C.day0, C.day1, C.day1, C.day2, C.day2, C.cream],
  night: [C.night0, C.night0, C.night1, C.night1, C.night2, C.night2, C.dusk0],
};

// ---------------------------------------------------------------------------
// helpers

function box(pix, x, y, w, h, fill, opts = {}) {
  const { outline = C.ink, light, shadow } = opts;
  pix.rect(x, y, w, h, fill);
  if (light) pix.hline(x + 1, x + w - 2, y + 1, light);
  if (shadow) {
    pix.vline(x + w - 2, y + 1, y + h - 2, shadow);
    pix.hline(x + 1, x + w - 2, y + h - 2, shadow);
  }
  if (outline) pix.frame(x, y, w, h, outline);
}

function wallpaper(pix, r, base, pattern, accent) {
  pix.rect(r.x, r.y, r.w, r.h, base);
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) {
      const lx = x - r.x, ly = y - r.y;
      let on = false;
      if (pattern === 'stripes') on = lx % 8 === 0;
      else if (pattern === 'dots') on = (lx % 8 === 3 && ly % 8 === 3) || (lx % 8 === 7 && ly % 8 === 7);
      else if (pattern === 'diamonds') on = (lx + ly) % 10 === 0 && ly % 10 < 5 || (lx - ly + 100) % 10 === 0 && ly % 10 >= 5;
      else if (pattern === 'stars') on = (lx % 12 === 5 && ly % 12 === 4) || (lx % 12 === 11 && ly % 12 === 10);
      if (on) pix.px(x, y, accent);
    }
  // soft shadow under the ceiling
  pix.hline(r.x, r.x + r.w - 1, r.y, mix(base, C.ink, 0.35));
  pix.dither(r.x, r.y + 1, r.w, 2, mix(base, C.ink, 0.25), 0.5);
}

function wainscot(pix, r, h, base, dark, light) {
  const y = r.y + r.h - h;
  pix.rect(r.x, y, r.w, h, base);
  pix.hline(r.x, r.x + r.w - 1, y, light);
  pix.hline(r.x, r.x + r.w - 1, y + 1, dark);
  for (let x = r.x + 4; x < r.x + r.w; x += 10) pix.vline(x, y + 3, y + h - 2, dark);
}

function tiles(pix, x, y, w, h, a, b, size = 4) {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const t = (((i / size) | 0) + ((j / size) | 0)) & 1;
      pix.px(x + i, y + j, t ? a : b);
    }
}

// Wood floor strip (the visible top of the floor slab inside a room).
function floorboards(pix, x, y, w) {
  pix.hline(x, x + w - 1, y, C.wood3);
  pix.hline(x, x + w - 1, y + 1, C.wood2);
  for (let i = x + 3; i < x + w; i += 9) pix.px(i, y + 1, C.wood1);
}

// ---------------------------------------------------------------------------
// sky & exterior

function sky(pix, time, moon = [24, 24]) {
  pix.gradient(0, 0, W, GROUND, SKIES[time] || SKIES.dusk, 3);
  if (time !== 'day') {
    // stars
    const stars = [[12, 8], [44, 16], [70, 6], [98, 12], [232, 9], [262, 18], [300, 7], [286, 30], [20, 40], [305, 46], [120, 4], [205, 5], [58, 30], [250, 38]];
    for (const [x, y] of stars) {
      pix.px(x, y, C.cream);
      if ((x + y) % 3 === 0) { pix.px(x - 1, y, C.mist, 0.5); pix.px(x + 1, y, C.mist, 0.5); }
    }
    // crescent moon
    const [mx, my] = moon;
    pix.disc(mx, my, 7, C.gold3);
    pix.disc(mx + 3, my - 2, 6, SKIES[time][Math.min(6, Math.floor(my / 23))]);
    pix.glow(mx, my, 16, C.gold3, 0.12);
  } else {
    pix.disc(292, 26, 9, C.gold3);
    pix.disc(292, 26, 7, C.cream);
    // clouds
    cloud(pix, 20, 30); cloud(pix, 250, 50); cloud(pix, 90, 14);
  }
  // distant hills
  for (let x = 0; x < W; x++) {
    const hgt = 14 + Math.round(6 * Math.sin(x / 23) + 4 * Math.sin(x / 9 + 1));
    pix.vline(x, GROUND - hgt, GROUND - 1, time === 'day' ? C.green2 : C.dusk0);
    pix.vline(x, GROUND - Math.round(hgt * 0.55), GROUND - 1, time === 'day' ? C.green1 : C.plum1);
  }
}

function cloud(pix, x, y) {
  pix.rect(x + 4, y, 14, 3, C.white);
  pix.rect(x, y + 3, 26, 4, C.white);
  pix.hline(x + 1, x + 25, y + 7, C.day1);
}

function ground(pix, time) {
  const g1 = time === 'day' ? C.green2 : C.green1;
  const g0 = time === 'day' ? C.green1 : C.green0;
  pix.rect(0, GROUND, W, 4, g1);
  for (let x = 0; x < W; x += 3) pix.px(x, GROUND - 1, g1);
  pix.hline(0, W - 1, GROUND + 3, g0);
  pix.rect(0, GROUND + 4, W, H - GROUND - 4, C.wood1);
  pix.dither(0, GROUND + 4, W, H - GROUND - 4, C.wood0, 0.35);
  // stepping stones
  for (const x of [8, 18, 28]) { pix.rect(x, GROUND + 1, 5, 2, C.stone); pix.hline(x, x + 4, GROUND + 1, C.mist); }
}

function tree(pix, x, y) {
  // trunk
  pix.rect(x + 13, y + 30, 6, 20, C.wood1);
  pix.vline(x + 13, y + 30, y + 49, C.wood0);
  pix.vline(x + 18, y + 30, y + 49, C.ink2);
  // canopy blobs
  const blob = (cx, cy, r, c) => pix.disc(cx, cy, r, c);
  blob(x + 16, y + 18, 15, C.green0);
  blob(x + 8, y + 24, 10, C.green0);
  blob(x + 25, y + 25, 10, C.green0);
  blob(x + 15, y + 16, 13, C.green1);
  blob(x + 9, y + 22, 8, C.green1);
  blob(x + 23, y + 22, 8, C.green1);
  blob(x + 12, y + 11, 6, C.green2);
  blob(x + 20, y + 14, 4, C.green2);
}

// ---------------------------------------------------------------------------
// house shell

function shell(pix) {
  const X0 = 38, X1 = 282; // outer wall extents
  // roof (gable, slope 1:3) with attic cutaway
  const apexX = 160, eaveY = 50, apexY = 10;
  for (let y = apexY; y <= eaveY; y++) {
    const half = Math.round((y - apexY) * 3.2);
    const xl = apexX - half, xr = apexX + half;
    // shingle band 6px along the slope, attic interior inside
    for (let x = xl; x <= xr; x++) {
      const edge = Math.min(x - xl, xr - x);
      let c;
      if (edge < 1) c = C.ink;
      else if (edge < 7) c = (((y + (x >> 2)) & 3) === 0) ? C.red0 : C.red1;
      else if (edge < 9) c = C.wood0;
      else c = null;
      if (c) pix.px(x, y, c);
    }
  }
  // attic interior (dim wood)
  for (let y = apexY + 4; y < eaveY; y++) {
    const half = Math.round((y - apexY) * 3.2) - 9;
    if (half <= 0) continue;
    pix.hline(apexX - half, apexX + half, y, (y & 3) === 0 ? mix(C.wood1, C.night1, 0.35) : mix(C.wood0, C.night1, 0.35));
  }
  // attic collar tie + struts
  pix.hline(apexX - 40, apexX + 40, apexY + 14, C.wood1);
  pix.hline(apexX - 40, apexX + 40, apexY + 15, C.ink2);
  // eave fascia
  pix.hline(apexX - 128, apexX + 128, eaveY, C.ink);
  pix.hline(apexX - 127, apexX + 127, eaveY + 1, C.cream);
  // chimney
  box(pix, 226, 12, 10, 16, C.red1, { light: C.red2, shadow: C.red0 });
  pix.rect(224, 10, 14, 3, C.stone); pix.frame(224, 10, 14, 3, C.ink);

  // outer walls: siding outside, cross-section inside
  for (const [x, dir] of [[X0, 1], [X1 - 5, -1]]) {
    pix.rect(x, 52, 6, GROUND - 52, C.wood0);
    const sidingX = dir > 0 ? x : x + 3;
    for (let y = 52; y < GROUND; y++) {
      pix.hline(sidingX, sidingX + 2, y, y % 4 === 0 ? C.red0 : C.red1);
    }
    pix.vline(dir > 0 ? x : x + 5, 52, GROUND - 1, C.ink);
    pix.vline(dir > 0 ? x + 5 : x, 52, GROUND - 1, C.ink2);
  }
  // ceiling beam under the attic
  pix.rect(X0, 50, X1 - X0, 4, C.wood0);
  pix.hline(X0, X1 - 1, 53, C.ink);
  // floor slab between storeys
  pix.rect(X0 + 6, 100, X1 - X0 - 12, 6, C.wood0);
  floorboards(pix, 44, 100, 232);
  pix.hline(44, 275, 102, C.wood1);
  pix.hline(44, 275, 105, C.ink);
  // ground floor slab + foundation
  floorboards(pix, 44, 154, 232);
  pix.rect(X0, 156, X1 - X0, 4, C.stone);
  for (let x = X0; x < X1; x += 7) pix.vline(x, 156, 159, C.shade);
  pix.hline(X0, X1 - 1, 156, C.mist);
  pix.hline(X0, X1 - 1, 159, C.ink2);
}

function partition(pix, x, y, h, doorTop) {
  pix.rect(x, y, 3, h, C.wood1);
  pix.vline(x, y, y + h - 1, C.ink2);
  pix.vline(x + 2, y, y + h - 1, C.wood0);
  if (doorTop != null) {
    // cut a doorway from doorTop down to the floor
    pix.rect(x, doorTop, 3, y + h - doorTop, null);
  }
}

// ---------------------------------------------------------------------------
// rooms

function bedroom(pix, s) {
  const r = ROOMS.bedroom;
  wallpaper(pix, r, C.wallLilac, 'dots', C.wallLilacS);
  // window with night sky
  F.window(pix, 52, 62, 22, 20, s.time, C.teal1);
  // framed picture
  F.frame(pix, 84, 64, 12, 9, 'mountain');
  // rug
  pix.rect(78, 98, 20, 2, C.red1);
  pix.hline(78, 97, 98, C.red2);
  for (let x = 78; x < 98; x += 2) pix.px(x, 99, C.gold2);
  // dresser
  F.dresser(pix, 56, 84);
  // bed + nightstand + lamp
  F.bed(pix, 108, 82, C.teal1, s.bedPerson);
  F.nightstand(pix, 99, 88, s.nightGuard);
  F.lamp(pix, 100, 78, s.time !== 'day');
}

function bathroom(pix, s) {
  const r = ROOMS.bath;
  wallpaper(pix, r, C.cream, 'none');
  tiles(pix, r.x, r.y + 24, r.w, r.h - 24, C.wallBlue, C.blue4, 3);
  pix.hline(r.x, r.x + r.w - 1, r.y + 24, C.wallBlueS);
  // small round window
  pix.disc(214, 64, 4, C.ink);
  pix.disc(214, 64, 3, s.time === 'day' ? C.day1 : C.night2);
  // mirror + sink + toothbrush cup
  F.mirror(pix, 166, 60);
  F.sink(pix, 165, 80, s.toothbrush);
  // towel
  F.towel(pix, 204, 70, C.pink2);
  // tub
  F.tub(pix, 190, 86);
  // bath mat
  pix.rect(176, 98, 12, 2, C.teal2);
}

function study(pix, s) {
  const r = ROOMS.study;
  wallpaper(pix, r, C.wallRose, 'stars', C.wallRoseS);
  // shelf with trophies / books
  pix.rect(229, 66, 24, 2, C.wood2);
  pix.hline(229, 252, 68, C.wood0);
  F.books(pix, 230, 59, 9);
  F.trophy(pix, 242, 60);
  F.plantSmall(pix, 248, 58);
  // desk + laptop + chair
  F.desk(pix, 236, 84);
  F.laptopOpen(pix, 244, 78, s.time !== 'day');
  F.chair(pix, 228, 84, C.teal1);
  // window
  F.window(pix, 262, 62, 11, 18, s.time, C.gold1);
}

function living(pix, s) {
  const r = ROOMS.living;
  wallpaper(pix, r, C.wallSage, 'stripes', C.wallSageS);
  wainscot(pix, r, 12, C.wood3, C.wood2, C.wood4);
  // bookshelf
  F.bookshelf(pix, 48, 116);
  // dream board
  F.dreamBoard(pix, 76, 113, s.dreams);
  // floor lamp
  F.floorLamp(pix, 104, 122, s.time !== 'day');
  // couch
  F.couch(pix, 110, 136, C.gold1);
  // rug
  pix.rect(96, 152, 50, 2, C.plum2);
  pix.hline(96, 145, 152, C.plum3);
  // TV on stand (facing the couch, at the right edge of the living room)
  F.tv(pix, 146, 126, s.era, s.time !== 'day');
  // coin jar on the bookshelf top
  F.coinJar(pix, 52, 108, s.savings);
  // plant
  F.plant(pix, 96, 136);
  // cat
  if (s.cat) F.cat(pix, 118, 133);
}

function kitchen(pix, s) {
  const r = ROOMS.kitchen;
  wallpaper(pix, r, C.wallCream, 'diamonds', C.wallCreamS);
  // wall calendar + clock over the open floor area
  F.clock(pix, 182, 114);
  pix.rect(176, 124, 9, 10, C.white); pix.rect(176, 124, 9, 3, C.red1);
  for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 3; c++) pix.px(177 + c * 3, 128 + rr * 2, C.stone);
  pix.frame(176, 124, 9, 10, C.ink2);
  // window over the sink
  F.window(pix, 214, 112, 22, 16, s.time, C.red2);
  // upper cabinets
  F.upperCabinets(pix, 199, 110, 13);
  F.upperCabinets(pix, 239, 110, 17);
  // backsplash + counters
  tiles(pix, 199, 128, 58, 8, C.cream, C.blue4, 2);
  F.counter(pix, 199, 136, 42);
  F.stove(pix, 240, 136);
  // sink + faucet under the window
  pix.rect(217, 136, 16, 1, C.stone);
  pix.rect(223, 131, 2, 5, C.stone); pix.rect(223, 131, 5, 1, C.stone); pix.frame(222, 130, 3, 6, C.ink);
  // counter clutter
  F.counterStuff(pix, s);
  // fridge at the far end
  F.fridge(pix, 258, 116, s.fridgeNotes);
}

// ---------------------------------------------------------------------------

export function drawHouse(pix, state = {}) {
  const s = {
    time: 'dusk',
    era: 'modern',
    cat: true,
    dreams: 2,
    savings: 0.6,
    toothbrush: 'electric',
    nightGuard: true,
    fridgeNotes: ['calendar'],
    counter: ['fruit'],
    ...state,
  };
  sky(pix, s.time, s.moon);
  tree(pix, 0, 104);
  if (s.time !== 'day') pix.dither(2, 106, 30, 34, C.dusk1, 0.12);
  ground(pix, s.time);
  F.bush(pix, 284, 152);
  F.mailbox(pix, 300, 146);
  if (s.time !== 'day') pix.rect(0, 0, W, H, C.night1, 0.22, 'multiply');
  shell(pix);
  bedroom(pix, s);
  bathroom(pix, s);
  study(pix, s);
  living(pix, s);
  kitchen(pix, s);
  attic(pix, s);
  // partitions (drawn last so they overlap wallpaper edges cleanly)
  partition(pix, 156, 54, 46);
  partition(pix, 222, 54, 46);
  partition(pix, 168, 106, 48, 116);
  // evening: a gentle cool wash over the rooms, lamps push back warm
  if (s.time !== 'day') {
    for (const r of Object.values(ROOMS)) if (r !== ROOMS.attic) pix.rect(r.x, r.y, r.w, r.h, C.plum3, 0.10, 'multiply');
    lampGlows(pix, s);
  }
  return s;
}

function lampGlows(pix, s) {
  // warm pools of light around lamps & screens (screen blend)
  pix.glow(103, 83, 26, C.glow0, 0.22);
  pix.glow(107, 126, 30, C.glow0, 0.22);
  pix.glow(156, 135, 18, C.blue3, 0.12);
  pix.glow(249, 82, 16, C.blue3, 0.14);
  pix.glow(225, 120, 30, C.glow1, 0.12);
  pix.glow(190, 70, 24, C.glow1, 0.10);
}

function attic(pix, s) {
  // memory boxes & the old crib
  F.box(pix, 112, 40, 12, 10);
  F.box(pix, 124, 43, 9, 7);
  F.box(pix, 190, 41, 11, 9);
  F.crib(pix, 142, 36);
  F.hockeyStick(pix, 206, 32);
  // round attic window
  pix.disc(160, 32, 4, C.ink);
  pix.disc(160, 32, 3, s.time === 'day' ? C.day1 : C.dusk1);
  pix.hline(157, 163, 32, C.ink2);
  pix.vline(160, 29, 35, C.ink2);
}
