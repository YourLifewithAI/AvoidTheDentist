// Sheets: each export returns a Pix. Used by tools/preview.mjs and tools/render-art.mjs.
import { Pix } from './lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from './palette.js';
import * as P from './sprites/people.js';
import { PROP } from './sprites/props.js';

// The cast: one paper-doll system, many people (skin, hair, outfit, face, pose are all swappable).
export function cast() {
  const pix = new Pix(320, 52).clear(C.paper);
  const people = [
    { head: 'curly', face: 'grin', body: 'tee', arms: 'down', look: { skin: SKIN.deep, hair: HAIR.black, top: CLOTH.mustard, bottom: CLOTH.denim } },
    { head: 'bob', face: 'smile', body: 'skirt', arms: 'down', look: { skin: SKIN.porcelain, hair: HAIR.auburn, top: CLOTH.sage, bottom: CLOTH.plum } },
    { head: 'buzz', face: 'content', body: 'hoodie', arms: 'down', look: { skin: SKIN.brown, hair: HAIR.black, top: CLOTH.teal, bottom: CLOTH.charcoal } },
    { head: 'long', back: 'long', face: 'smile', body: 'tee', arms: 'down', look: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.rose, bottom: CLOTH.denim } },
    { head: 'spiky', face: 'grin', body: 'teen', arms: 'teen', look: { skin: SKIN.peach, hair: HAIR.blonde, top: CLOTH.red, bottom: CLOTH.khaki } },
    { head: 'balding', face: 'content', glasses: true, body: 'shirtTie', arms: 'sleeves', look: { skin: SKIN.peach, hair: HAIR.grey, top: CLOTH.sky, bottom: CLOTH.charcoal, acc: CLOTH.red, acc2: CLOTH.white } },
    { head: 'bun', face: 'smile', body: 'cardigan', arms: 'sleeves', look: { skin: SKIN.brown, hair: HAIR.white, top: CLOTH.white, bottom: CLOTH.brown, acc: CLOTH.lilac } },
    { head: 'short', face: 'neutral', body: 'vest', arms: 'down', hat: 'cap', look: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.grey, bottom: CLOTH.denim, acc: CLOTH.coral, acc2: CLOTH.white } },
    { head: 'pigtails', face: 'grin', body: 'kid', arms: 'kid', look: { skin: SKIN.deep, hair: HAIR.black, top: CLOTH.lilac, bottom: CLOTH.denim } },
    { head: 'curlyShort', face: 'smile', body: 'scrubs', arms: 'down', look: { skin: SKIN.porcelain, hair: HAIR.pepper, top: CLOTH.sky, bottom: CLOTH.sky } },
    { head: 'toddler', face: 'happy', body: 'toddler', arms: null, look: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mint, bottom: CLOTH.denim } },
  ];
  pix.rect(0, 40, 320, 12, C.wood3); pix.hline(0, 319, 40, C.wood4); pix.hline(0, 319, 41, C.wood2);
  people.forEach((p, i) => P.drawPerson(pix, 6 + i * 28, 40, p));
  return pix;
}

import { drawHouse, ROOMS } from './scenes/house.js';

export function house() {
  const pix = new Pix(320, 180);
  drawHouse(pix, { time: 'dusk', counter: ['fruit', 'coffee', 'soda:3'], fridgeNotes: ['calendar', 'postcards'], bike: true });
  return pix;
}

const MAYA = { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown };
const JUNE = { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mint, bottom: CLOTH.mint, shoes: CLOTH.red };

export function keyart() {
  const pix = new Pix(320, 180);
  drawHouse(pix, { time: 'dusk', counter: ['fruit', 'coffee', 'cookies'], fridgeNotes: ['calendar', 'drawing'] });
  // Maya in the kitchen with a mug
  P.drawPerson(pix, 178, 154, { head: 'bun', face: 'content', body: 'tee', arms: 'hold', look: MAYA,
    after: [{ spr: PROP.mug, dx: 5, dy: 0 }, { spr: PROP.steam, dx: 6, dy: -4 }] });
  // June (6) brushing in the bathroom
  P.drawPerson(pix, 176, 100, { head: 'pigtails', face: 'content', body: 'kidDress', arms: 'kidBrush', look: JUNE });
  return pix;
}

import * as UI from './scenes/ui.js';

export function mockup(time = 'dusk') {
  const pix = new Pix(320, 180);
  drawHouse(pix, { time, moon: [300, 70], counter: ['fruit', 'coffee', 'soda:3'], fridgeNotes: ['calendar', 'postcards'] });
  P.drawPerson(pix, 176, 100, { head: 'pigtails', face: 'content', body: 'kidDress', arms: 'kidBrush', look: JUNE });
  P.drawPerson(pix, 176, 154, { head: 'bun', face: 'worried', body: 'tee', arms: 'hold', look: MAYA,
    after: [{ spr: PROP.phone, dx: 6, dy: 0 }, { spr: PROP.phoneRing, dx: 5, dy: -3 }] });

  // status panel
  UI.panel(pix, 4, 4, 100, 36);
  pix.panel(7, 7, 20, 20, C.wallSage, C.ink);
  P.drawPerson(pix, 9, 42, { head: 'bun', face: 'worried', body: 'tee', arms: 'down', look: MAYA });
  pix.panel(7, 7, 20, 20, null, C.ink);
  pix.rect(8, 27, 18, 13, C.cream); // crop portrait
  pix.text('Maya, 34', 31, 8, C.ink);
  pix.text('Pastry chef', 31, 17, C.shade);
  UI.pips(pix, 7, 30, UI.ICON.heart, 3, 4);
  UI.pips(pix, 38, 30, UI.ICON.smile, 3, 4);
  UI.pips(pix, 69, 30, UI.ICON.calm, 1, 4);
  // re-frame bottom of panel (portrait crop overlapped it)
  pix.hline(5, 102, 39, C.ink);

  // wallet + speed
  UI.panel(pix, 222, 4, 94, 16);
  pix.sprite(UI.ICON.coin, 226, 9);
  pix.text('$12,480', 233, 9, C.ink);
  UI.button(pix, 270, 7, 13, '❚❚');
  UI.button(pix, 285, 7, 11, '▶', { primary: true });
  UI.button(pix, 298, 7, 15, '▶▶');

  // event card
  UI.card(pix, 212, 26, 104, 'Voicemail',
    "Dr. Reyes' office: \"It's been 18 months since your last cleaning!\"",
    ['Book it', 'Later...'], { icon: UI.ICON.phone, note: 'Covered by your plan' });

  // timeline
  UI.timeline(pix, 8, 164, 304, 34, [
    { age: 1, color: C.teal2 }, { age: 6, color: C.teal2 }, { age: 9, color: C.red1 },
    { age: 16, color: C.gold2 }, { age: 24, color: C.gold2 }, { age: 31, color: C.red1 },
  ]);
  return pix;
}
export const mockupDay = () => mockup('day');

// A life in eight moments, in front of a growth-chart wall.
export function lineup() {
  const pix = new Pix(320, 84);
  const F0 = 66; // floor line
  // wall
  pix.rect(0, 0, 320, F0, C.wallCream);
  for (let x = 0; x < 320; x += 10) pix.vline(x, 0, F0 - 1, C.wallCreamS);
  pix.dither(0, 0, 320, 3, C.wallCreamS, 0.5);
  // growth chart strip on the wall
  pix.rect(4, 13, 312, F0 - 16, C.cream, 0.6);
  // floor
  pix.rect(0, F0, 320, 18, C.wood3);
  pix.hline(0, 319, F0, C.wood4);
  pix.hline(0, 319, F0 + 1, C.wood2);
  for (let x = 0; x < 320; x += 13) pix.px(x, F0 + 4, C.wood2);
  pix.rect(0, F0 + 6, 320, 12, C.wood2);
  pix.text('One life, eight moments', 160, 4, C.ink, { align: 'center' });

  const look = (hair, top, bottom, extra = {}) => ({ skin: SKIN.tan, hair, top, bottom, shoes: CLOTH.brown, ...extra });
  const moments = [
    { age: '0', spec: { head: 'baby', face: 'happy', body: 'baby', arms: null, look: look(HAIR.black, CLOTH.butter, CLOTH.butter) }, props: [{ spr: PROP.rattle, dx: 13, dy: -2 }] },
    { age: '2', spec: { head: 'toddler', face: 'smile', body: 'toddler', arms: null, look: look(HAIR.black, CLOTH.rose, CLOTH.denim) }, props: [{ spr: PROP.sippy, dx: 11, dy: -1 }] },
    { age: '7', spec: { head: 'pigtails', face: 'grin', body: 'kidDress', arms: 'kidBalloon', look: look(HAIR.black, CLOTH.mint, CLOTH.mint) }, props: [{ spr: PROP.balloon, dx: 10, dy: -26 }], string: true },
    { age: '15', spec: { head: 'long', back: 'long', face: 'neutral', body: 'teenHoodie', arms: 'teen', look: look(HAIR.black, CLOTH.lilac, CLOTH.denim) } },
    { age: '25', spec: { head: 'bob', face: 'smile', body: 'tee', arms: 'hold', look: look(HAIR.black, CLOTH.teal, CLOTH.denim) }, props: [{ spr: PROP.mug, dx: 5, dy: 0 }] },
    { age: '38', spec: { head: 'bun', face: 'grin', body: 'apron', arms: 'hold', hat: 'chef', look: look(HAIR.black, CLOTH.coral, CLOTH.brown, { acc2: CLOTH.white }) }, props: [{ spr: PROP.cupcake, dx: 5, dy: -1 }] },
    { age: '55', spec: { head: 'bob', face: 'content', glasses: true, body: 'cardigan', arms: 'hold', look: look(HAIR.pepper, CLOTH.white, CLOTH.brown, { acc: CLOTH.sage }) }, props: [{ spr: PROP.book, dx: 5, dy: 0 }] },
    { age: '75', spec: { head: 'curlyShort', face: 'smile', glasses: true, body: 'cardigan', arms: 'cane', look: look(HAIR.white, CLOTH.white, CLOTH.grey, { acc: CLOTH.plum }) } },
  ];
  moments.forEach((m, i) => {
    const cx = 20 + i * 40;
    // pencil mark on the growth chart at the head height
    const x = cx - 8;
    const res = P.drawPerson(pix, x, F0, { ...m.spec, after: m.props || [] });
    if (m.string) pix.vline(x + 13, res.bodyY - 19, res.bodyY - 2, C.ink2);
    pix.hline(cx - 6, cx + 6, res.headY - 2, C.stone, 0.6);
    // floor shadow
    pix.hline(x + 3, x + 12, F0, C.wood2);
    pix.text(m.age, cx, F0 + 8, C.cream, { align: 'center', shadow: C.wood0 });
  });
  return pix;
}

import { EMOTE } from './sprites/emotes.js';
import { F } from './sprites/furniture.js';

function tileBg(pix, x, y, w, h, wall, pattern) {
  pix.rect(x, y, w, h, wall);
  const d = pattern || C.wallCreamS;
  for (let i = x + 3; i < x + w; i += 6) pix.vline(i, y, y + h - 12, d);
  pix.rect(x, y + h - 11, w, 11, C.wood3);
  pix.hline(x, x + w - 1, y + h - 11, C.wood4);
  pix.hline(x, x + w - 1, y + h - 10, C.wood2);
  pix.frame(x, y, w, h, C.ink);
}

// Feelings, not teeth: how oral health shows up in a person's day.
export function feelings() {
  const pix = new Pix(320, 150).clear(C.paper);
  pix.text('Feelings, not teeth', 160, 4, C.ink, { align: 'center' });
  const look = { ...MAYA, top: CLOTH.teal };
  const tiles = [
    { cap: 'Smiles freely', wall: C.wallSage, pat: C.wallSageS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'grin', body: 'tee', look }); pix.sprite(EMOTE.sparkle, x + 15, f - 34); pix.sprite(EMOTE.sparkleSm, x - 3, f - 28); } },
    { cap: 'Hides her smile', wall: C.wallRose, pat: C.wallRoseS, draw: (x, f) => P.drawPerson(pix, x, f, { head: 'bun', face: 'content', body: 'tee', arms: 'cover', look }) },
    { cap: 'Toothache', wall: C.wallLilac, pat: C.wallLilacS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'wince', body: 'tee', arms: 'cheek', look }); pix.sprite(EMOTE.pain, x + 17, f - 20); } },
    { cap: 'Cold sting', wall: C.wallBlue, pat: C.wallBlueS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'wince', body: 'tee', arms: 'hold', look, after: [{ spr: PROP.icecream, dx: 6, dy: -2 }] }); pix.sprite(EMOTE.shiver, x - 3, f - 22); pix.sprite(EMOTE.shiver, x + 17, f - 22); } },
    { cap: 'Grinds at night', wall: C.night2, pat: C.night1, draw: (x, f) => {
      F.bed(pix, x - 16, f - 18, C.plum2);
      const head = P.HEAD.bun;
      pix.sprite(head, x - 13, f - 26, { look });
      pix.sprite(P.FACE.clench, x - 10, f - 26 + head.h - 6, { look });
      // quilt over the body
      pix.rect(x + 2, f - 12, 26, 6, C.plum2); pix.hline(x + 2, x + 27, f - 12, C.plum3); pix.frame(x + 1, f - 12, 28, 7, C.ink);
      pix.sprite(EMOTE.grr, x + 4, f - 17);
      pix.sprite(EMOTE.zzz, x + 12, f - 36);
    } },
    { cap: 'Dodges the call', wall: C.wallCream, pat: C.wallCreamS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'worried', body: 'tee', arms: 'hold', look, after: [{ spr: PROP.phone, dx: 6, dy: 0 }, { spr: PROP.phoneRing, dx: 5, dy: -3 }] }); pix.sprite(EMOTE.sweat, x + 14, f - 32); } },
    { cap: 'Swollen jaw', wall: C.wallSage, pat: C.wallSageS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'sad', body: 'tee', arms: 'cheek', look, after: [{ spr: PROP.icepack, dx: 10, dy: -6 }] }); } },
    { cap: 'Clean checkup!', wall: C.wallRose, pat: C.wallRoseS, draw: (x, f) => { P.drawPerson(pix, x, f, { head: 'bun', face: 'content', body: 'tee', arms: 'wave', look }); pix.sprite(EMOTE.heart, x + 1, f - 36); pix.sprite(EMOTE.sparkleSm, x + 9, f - 40); } },
  ];
  tiles.forEach((t, i) => {
    const col = i % 4, row = (i / 4) | 0;
    const tx = 6 + col * 78, ty = 16 + row * 66;
    tileBg(pix, tx, ty, 74, 52, t.wall, t.pat);
    t.draw(tx + 29, ty + 45);
    pix.text(t.cap, tx + 37, ty + 55, C.ink, { align: 'center' });
  });
  return pix;
}

function scene(pix, x, y, w, h) {
  pix.frame(x, y, w, h, C.ink);
  return { x: x + 1, y: y + 1, w: w - 2, h: h - 2 };
}

// Work & play: how a job or a sport shapes a mouth, told through the person.
export function workplay() {
  const pix = new Pix(320, 164).clear(C.paper);
  pix.text('Work & play', 160, 4, C.ink, { align: 'center' });
  const TW = 100, TH = 62;
  const at = i => [5 + (i % 3) * (TW + 5), 16 + ((i / 3) | 0) * (TH + 12)];

  // 1. Bakery
  {
    const [x, y] = at(0); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.rect(r.x, r.y, r.w, r.h, C.wallRose);
    for (let i = r.x; i < r.x + r.w; i += 8) pix.rect(i, r.y, Math.min(4, r.x + r.w - i), 6, C.pink3);
    pix.hline(r.x, r.x + r.w - 1, r.y + 6, C.pink1);
    // shelves with loaves
    pix.rect(r.x + 60, r.y + 14, 34, 2, C.wood2); pix.rect(r.x + 60, r.y + 26, 34, 2, C.wood2);
    for (let i = 0; i < 4; i++) { pix.rect(r.x + 62 + i * 8, r.y + 10, 6, 4, C.wood4); pix.hline(r.x + 62 + i * 8, r.x + 67 + i * 8, r.y + 10, C.gold3); pix.frame(r.x + 62 + i * 8, r.y + 10, 6, 4, C.wood1); }
    for (let i = 0; i < 3; i++) pix.sprite(F.sprites.cake, r.x + 62 + i * 11, r.y + 19);
    // floor + display case
    pix.rect(r.x, f, r.w, 9, C.wood3); pix.hline(r.x, r.x + r.w - 1, f, C.wood4);
    pix.rect(r.x + 44, f - 16, 50, 16, C.blue4, 0.8); pix.rect(r.x + 44, f - 4, 50, 4, C.wood2); pix.frame(r.x + 44, f - 16, 50, 16, C.ink);
    for (let i = 0; i < 4; i++) pix.sprite(PROP.cupcake, r.x + 47 + i * 11, f - 11);
    P.drawPerson(pix, r.x + 20, f, { head: 'bun', face: 'grin', body: 'apron', arms: 'hold', hat: 'chef',
      look: { skin: SKIN.peach, hair: HAIR.auburn, top: CLOTH.butter, bottom: CLOTH.brown, acc2: CLOTH.white }, after: [{ spr: PROP.spoon, dx: 7, dy: -3 }] });
    pix.sprite(EMOTE.heart, r.x + 14, f - 38);
  }
  // 2. Warehouse
  {
    const [x, y] = at(1); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.rect(r.x, r.y, r.w, r.h, C.mist);
    for (let i = r.x; i < r.x + r.w; i += 12) pix.vline(i, r.y, f, C.stone);
    // racking with boxes
    for (const sx of [r.x + 2, r.x + 64]) {
      pix.vline(sx, r.y + 4, f - 1, C.blue1); pix.vline(sx + 30, r.y + 4, f - 1, C.blue1);
      for (const sy of [r.y + 18, r.y + 36]) {
        pix.rect(sx, sy, 31, 2, C.gold1);
        F.box(pix, sx + 2, sy - 9, 11, 9); F.box(pix, sx + 15, sy - 7, 9, 7);
      }
    }
    pix.rect(r.x, f, r.w, 9, C.stone); pix.hline(r.x, r.x + r.w - 1, f, C.mist);
    for (let i = r.x + 4; i < r.x + r.w; i += 10) pix.rect(i, f + 4, 5, 1, C.gold2);
    P.drawPerson(pix, r.x + 42, f, { head: 'buzz', face: 'clench', body: 'vest', arms: 'carry', hat: 'hardhat',
      look: { skin: SKIN.brown, hair: HAIR.black, top: CLOTH.grey, bottom: CLOTH.denim, acc: CLOTH.mustard, acc2: CLOTH.white, shoes: CLOTH.brown } });
    pix.sprite(EMOTE.grr, r.x + 46, f - 29);
  }
  // 3. Office
  {
    const [x, y] = at(2); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.rect(r.x, r.y, r.w, r.h, C.wallBlue);
    // window with city
    pix.rect(r.x + 6, r.y + 6, 30, 22, C.day1); pix.frame(r.x + 6, r.y + 6, 30, 22, C.ink);
    for (const [bx, bh] of [[8, 12], [14, 16], [21, 9], [27, 14]]) pix.rect(r.x + bx, r.y + 27 - bh, 5, bh, C.blue3);
    pix.vline(r.x + 21, r.y + 7, r.y + 26, C.cream); pix.hline(r.x + 7, r.x + 34, r.y + 17, C.cream);
    pix.rect(r.x, f, r.w, 9, C.stone); pix.hline(r.x, r.x + r.w - 1, f, C.mist);
    // desk with laptop, candy jar, sticky notes
    pix.rect(r.x + 50, f - 14, 44, 3, C.wood3); pix.frame(r.x + 50, f - 14, 44, 3, C.ink);
    pix.rect(r.x + 52, f - 11, 2, 11, C.ink2); pix.rect(r.x + 90, f - 11, 2, 11, C.ink2);
    F.laptopOpen(pix, r.x + 72, f - 21, true);
    pix.sprite(F.sprites.cookieJar, r.x + 56, f - 20);
    pix.sprite(PROP.candy, r.x + 84, f - 17);
    for (let i = 0; i < 3; i++) pix.rect(r.x + 44 + i * 5, r.y + 10 + (i % 2) * 5, 4, 4, [C.gold3, C.pink3, C.teal3][i]);
    P.drawPerson(pix, r.x + 28, f, { head: 'short', face: 'worried', body: 'shirtTie', arms: 'hold',
      look: { skin: SKIN.porcelain, hair: HAIR.brown, top: CLOTH.white, bottom: CLOTH.charcoal, acc: CLOTH.teal, acc2: CLOTH.white }, after: [{ spr: PROP.mug, dx: 5, dy: 0 }] });
    pix.sprite(EMOTE.sweat, r.x + 43, f - 31);
  }
  // 4. Night shift
  {
    const [x, y] = at(3); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.rect(r.x, r.y, r.w, r.h, C.wallBlue);
    pix.rect(r.x, r.y, r.w, 22, C.cream);
    pix.hline(r.x, r.x + r.w - 1, r.y + 22, C.teal1);
    // night window + clock
    pix.rect(r.x + 58, r.y + 5, 30, 18, C.night1); pix.frame(r.x + 58, r.y + 5, 30, 18, C.ink);
    pix.disc(r.x + 80, r.y + 11, 3, C.gold3); pix.disc(r.x + 81, r.y + 10, 2, C.night1);
    pix.px(r.x + 63, r.y + 9, C.cream); pix.px(r.x + 70, r.y + 15, C.cream);
    F.clock(pix, r.x + 8, r.y + 6);
    pix.text('3:12', r.x + 17, r.y + 8, C.shade);
    // vending machine
    pix.rect(r.x + 4, f - 30, 16, 30, C.red1); pix.frame(r.x + 4, f - 30, 16, 30, C.ink);
    pix.rect(r.x + 6, f - 27, 9, 18, C.blue4);
    for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) pix.rect(r.x + 7 + i * 4, f - 25 + j * 6, 2, 4, [C.green3, C.gold2, C.red2][j]);
    pix.rect(r.x, f, r.w, 9, C.mist); pix.hline(r.x, r.x + r.w - 1, f, C.white);
    P.drawPerson(pix, r.x + 34, f, { head: 'curly', face: 'sleep', body: 'scrubs', arms: 'hold',
      look: { skin: SKIN.deep, hair: HAIR.black, top: CLOTH.mint, bottom: CLOTH.mint }, after: [{ spr: PROP.energy, dx: 6, dy: -1 }] });
    pix.sprite(EMOTE.zzz, r.x + 50, f - 38);
  }
  // 5. Ice rink
  {
    const [x, y] = at(4); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.gradient(r.x, r.y, r.w, 24, [C.blue1, C.blue2, C.blue3], 2);
    // crowd dots
    for (let i = r.x + 2; i < r.x + r.w; i += 4) pix.px(i, r.y + 8 + ((i * 7) % 5), [C.red2, C.gold2, C.cream, C.teal3][i % 4]);
    // boards
    pix.rect(r.x, r.y + 24, r.w, 14, C.white); pix.hline(r.x, r.x + r.w - 1, r.y + 24, C.ink2); pix.hline(r.x, r.x + r.w - 1, r.y + 36, C.red1);
    pix.rect(r.x + 8, r.y + 27, 20, 6, C.blue2); pix.rect(r.x + 64, r.y + 27, 22, 6, C.gold2);
    pix.rect(r.x, r.y + 38, r.w, r.h - 38, C.blue4);
    pix.hline(r.x, r.x + r.w - 1, f - 2, C.red1);
    for (const [kx, guard] of [[r.x + 18, false], [r.x + 62, true]]) {
      const res = P.drawPerson(pix, kx, f + 2, { head: 'spiky', face: guard ? 'clench' : 'grin', body: 'jersey', arms: 'down', hat: 'helmet',
        look: { skin: guard ? SKIN.brown : SKIN.porcelain, hair: guard ? HAIR.black : HAIR.blonde, top: guard ? CLOTH.teal : CLOTH.red, bottom: CLOTH.black, acc: guard ? CLOTH.teal : CLOTH.red, acc2: CLOTH.white, shoes: CLOTH.charcoal } });
      if (guard) { pix.rect(kx + 6, res.headY + 11, 4, 1, C.blue3); } // mouthguard color in the mouth
      // stick
      pix.line(kx + 13, res.bodyY + 6, kx + 20, f + 1, C.wood2);
      pix.rect(kx + 19, f, 6, 2, C.ink);
    }
    pix.text('no guard', r.x + 26, r.y + 1, C.white, { align: 'center', shadow: C.blue0 });
    pix.text('guard', r.x + 70, r.y + 1, C.white, { align: 'center', shadow: C.blue0 });
  }
  // 6. On the road
  {
    const [x, y] = at(5); const r = scene(pix, x, y, TW, TH); const f = r.y + r.h - 9;
    pix.gradient(r.x, r.y, r.w, r.h - 9, [C.dusk2, C.dusk3, C.dusk4], 2);
    // gas station sign + road
    pix.rect(r.x + 70, r.y + 6, 20, 12, C.teal1); pix.frame(r.x + 70, r.y + 6, 20, 12, C.ink);
    pix.text('24h', r.x + 74, r.y + 9, C.white);
    pix.vline(r.x + 80, r.y + 18, f - 1, C.ink2);
    pix.rect(r.x, f, r.w, 9, C.ink2); for (let i = r.x + 2; i < r.x + r.w; i += 10) pix.rect(i, f + 4, 5, 1, C.gold2);
    // little car
    const cx = r.x + 40, cy = f - 13;
    pix.rect(cx, cy + 5, 34, 7, C.gold1); pix.rect(cx + 6, cy, 20, 6, C.gold1);
    pix.rect(cx + 8, cy + 1, 7, 4, C.blue4); pix.rect(cx + 17, cy + 1, 7, 4, C.blue4);
    pix.frame(cx, cy + 5, 34, 7, C.ink); pix.frame(cx + 6, cy, 20, 6, C.ink);
    pix.disc(cx + 7, cy + 12, 3, C.ink); pix.disc(cx + 27, cy + 12, 3, C.ink);
    pix.px(cx + 7, cy + 12, C.stone); pix.px(cx + 27, cy + 12, C.stone);
    P.drawPerson(pix, r.x + 16, f, { head: 'balding', face: 'smile', body: 'tee', arms: 'hold', hat: 'cap',
      look: { skin: SKIN.peach, hair: HAIR.pepper, top: CLOTH.sage, bottom: CLOTH.denim, acc: CLOTH.denim }, after: [{ spr: PROP.soda, dx: 6, dy: -1 }] });
  }

  const caps = ['Baker: tastes all day', 'Loader: clenches', 'Office: coffee + stress', 'Night shift: energy', 'Hockey: guard or not?', 'Driver: soda on the go'];
  caps.forEach((c, i) => { const [x, y] = at(i); pix.text(c, x + TW / 2, y + TH + 2, C.ink, { align: 'center' }); });
  return pix;
}

// Same person, same luck, one choice at 34. Numbers come from the simulation
// (docs/sim-report.json -> two.featured), passed in by tools/render-art.mjs.
const FEATURED = {
  snapBookIt: { 45: { oop: 1763, missing: 0, painDays: 11 }, 62: { oop: 4119, missing: 0, painDays: 15 }, 79: { oop: 21547, missing: 2, painDays: 20 } },
  snapLater: { 45: { oop: 6577, missing: 1, painDays: 28 }, 62: { oop: 11801, missing: 3, painDays: 54 }, 79: { oop: 31401, missing: 7, painDays: 116 } },
};
export function twolives(featured = FEATURED) {
  const $ = v => '$' + Math.round(v).toLocaleString('en-US');
  const A = featured.snapBookIt, B = featured.snapLater;
  const lost = n => (n === 1 ? '1 tooth lost' : `${n} teeth lost`);
  const pix = new Pix(320, 204).clear(C.paper);
  pix.text('Same person. Same luck. One choice at 34.', 160, 3, C.ink, { align: 'center' });
  const TW = 100, TH = 60;
  const X = i => 8 + i * (TW + 3);
  const rowY = [22, 114];
  const young = { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown };
  const mid = { ...young, top: CLOTH.teal };
  const older = { skin: SKIN.tan, hair: HAIR.pepper, top: CLOTH.white, bottom: CLOTH.brown, acc: CLOTH.sage, shoes: CLOTH.brown };

  const room = (x, y, wall, pat) => { tileBg(pix, x, y, TW, TH, wall, pat); return y + TH - 10; };
  const badge = (x, y, t) => { pix.panel(x + 2, y + 2, 15, 10, C.cream, C.ink); pix.text(t, x + 10, y + 4, C.ink, { align: 'center' }); };
  const say = (x, y, t, good) => {
    const w = 7 + t.length * 5;
    pix.panel(x, y, w, 11, good ? C.teal1 : C.red1, C.ink);
    pix.text(t, x + 4, y + 3, C.white);
    pix.px(x + 4, y + 11, C.ink); pix.px(x + 3, y + 12, C.ink);
  };
  const board = (x, y, stars) => F.dreamBoard(pix, x, y, stars);

  // row labels
  pix.text('"Book it"', 10, 14, C.teal0);
  pix.text('"Later..."', 10, 106, C.red0);

  // --- Book it
  { const x = X(0), y = rowY[0]; const f = room(x, y, C.wallCream, C.wallCreamS);
    F.fridge(pix, x + 80, y + 12, ['calendar']);
    P.drawPerson(pix, x + 36, f, { head: 'bun', face: 'smile', body: 'tee', arms: 'hold', look: young, after: [{ spr: PROP.phone, dx: 6, dy: 0 }] });
    say(x + 4, y + 15, 'Book it!', true); badge(x, y, '34'); }
  { const x = X(1), y = rowY[0]; const f = room(x, y, C.wallSage, C.wallSageS);
    board(x + 6, y + 14, 2);
    pix.sprite(PROP.guitar, x + 66, f - 14);
    P.drawPerson(pix, x + 42, f, { head: 'bun', face: 'grin', body: 'tee', arms: 'down', look: mid });
    pix.sprite(EMOTE.note, x + 60, y + 16); pix.sprite(EMOTE.sparkleSm, x + 40, y + 16);
    badge(x, y, '45'); }
  { const x = X(2), y = rowY[0]; const f = room(x, y, C.wallBlue, C.wallBlueS);
    board(x + 64, y + 14, 4);
    pix.sprite(PROP.suitcase, x + 12, f - 8);
    P.drawPerson(pix, x + 32, f, { head: 'bob', face: 'grin', glasses: true, body: 'cardigan', arms: 'hold', look: older, after: [{ spr: PROP.ticket, dx: 4, dy: 1 }] });
    badge(x, y, '62'); }

  // --- Later...
  { const x = X(0), y = rowY[1]; const f = room(x, y, C.wallCream, C.wallCreamS);
    F.fridge(pix, x + 80, y + 12, ['postcards']);
    P.drawPerson(pix, x + 36, f, { head: 'bun', face: 'worried', body: 'tee', arms: 'hold', look: young, after: [{ spr: PROP.phone, dx: 6, dy: 0 }] });
    pix.sprite(EMOTE.sweat, x + 50, y + 24);
    say(x + 4, y + 16, 'Later...', false); badge(x, y, '34'); }
  { const x = X(1), y = rowY[1]; const f = room(x, y, C.wallSage, C.wallSageS);
    board(x + 6, y + 14, 1);
    pix.rect(x + 66, f - 10, 20, 2, C.wood3); pix.frame(x + 66, f - 10, 20, 2, C.ink); pix.vline(x + 68, f - 8, f - 1, C.ink2); pix.vline(x + 83, f - 8, f - 1, C.ink2);
    pix.sprite(PROP.billStack, x + 72, f - 17);
    P.drawPerson(pix, x + 42, f, { head: 'bun', face: 'wince', body: 'tee', arms: 'cheek', look: mid });
    pix.sprite(EMOTE.pain, x + 59, y + 28);
    badge(x, y, '45'); }
  { const x = X(2), y = rowY[1]; const f = room(x, y, C.wallBlue, C.wallBlueS);
    board(x + 64, y + 14, 0);
    pix.rect(x + 8, f - 10, 22, 2, C.wood3); pix.frame(x + 8, f - 10, 22, 2, C.ink); pix.vline(x + 10, f - 8, f - 1, C.ink2); pix.vline(x + 27, f - 8, f - 1, C.ink2);
    pix.sprite(PROP.soup, x + 10, f - 15); pix.sprite(PROP.billStack, x + 20, f - 17);
    P.drawPerson(pix, x + 38, f, { head: 'bob', face: 'sad', glasses: true, body: 'cardigan', arms: 'cheek', look: older, after: [{ spr: PROP.icepack, dx: 10, dy: -6 }] });
    badge(x, y, '62'); }

  // numbers under each tile (from the featured same-luck pair)
  const capA = [['Same start', ''], [`${$(A[45].oop)} spent`, `${A[45].painDays} pain days`], [`${$(A[62].oop)} spent`, lost(A[62].missing)]];
  const capB = [['Same start', ''], [`${$(B[45].oop)} spent`, `${B[45].painDays} pain days`], [`${$(B[62].oop)} spent`, lost(B[62].missing)]];
  for (let i = 0; i < 3; i++) {
    const colA = i === 0 ? C.shade : C.teal0, colB = i === 0 ? C.shade : C.red0;
    pix.text(capA[i][0], X(i) + TW / 2, rowY[0] + TH + 2, colA, { align: 'center' });
    pix.text(capA[i][1], X(i) + TW / 2, rowY[0] + TH + 10, colA, { align: 'center' });
    pix.text(capB[i][0], X(i) + TW / 2, rowY[1] + TH + 2, colB, { align: 'center' });
    pix.text(capB[i][1], X(i) + TW / 2, rowY[1] + TH + 10, colB, { align: 'center' });
  }
  // footer
  pix.hline(8, 312, 193, C.stone);
  pix.text(`By 79: ${$(A[79].oop)} vs ${$(B[79].oop)} spent, ${A[79].missing} vs ${B[79].missing} teeth lost`, 160, 196, C.ink, { align: 'center' });
  return pix;
}

import { drawClinic, chairBack, chairFront, chairTray } from './scenes/clinic.js';

// A friendly dental office: stickers, fish, cartoons, nobody scolding.
export function clinic() {
  const W = 320, H = 120, floor = H - 14;
  const pix = new Pix(W, H);
  drawClinic(pix, W, H);
  const hyg = { skin: SKIN.brown, hair: HAIR.black, top: CLOTH.plum, bottom: CLOTH.plum, shoes: CLOTH.white };
  const recep = { skin: SKIN.porcelain, hair: HAIR.blonde, top: CLOTH.rose, bottom: CLOTH.denim };
  const june = { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mint, bottom: CLOTH.mint, shoes: CLOTH.red };
  const maya = { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown };
  const kid2 = { skin: SKIN.deep, hair: HAIR.black, top: CLOTH.mustard, bottom: CLOTH.denim, shoes: CLOTH.teal };
  const dad = { skin: SKIN.deep, hair: HAIR.black, top: CLOTH.sage, bottom: CLOTH.khaki };
  // receptionist behind the desk (desk front drawn over her)
  P.drawPerson(pix, 116, floor - 6, { head: 'bob', face: 'smile', body: 'tee', arms: 'down', look: recep });
  pix.rect(104, floor - 15, 42, 15, C.wood3); pix.hline(105, 144, floor - 14, C.wood4); pix.vline(144, floor - 14, floor - 2, C.wood2); pix.frame(104, floor - 15, 42, 15, C.ink);
  pix.rect(102, floor - 17, 46, 3, C.cream); pix.frame(102, floor - 17, 46, 3, C.ink);
  pix.text('Hi!', 125, floor - 10, C.teal0, { align: 'center' });
  // a dad and kid waiting, kid excited about the fish
  P.drawPerson(pix, 6, floor, { head: 'short', face: 'smile', body: 'tee', arms: 'down', look: dad });
  P.drawPerson(pix, 60, floor, { head: 'curly', face: 'grin', body: 'kid', arms: 'kid', look: kid2 });
  // June in the chair
  chairBack(pix, 196, floor);
  chairTray(pix, 196, floor);
  const jr = P.drawPerson(pix, 198, floor - 8, { head: 'pigtails', face: 'grin', body: 'kidDress', arms: 'kidBalloon', look: june, after: [{ spr: PROP.balloon, dx: 10, dy: -26 }] });
  pix.vline(211, jr.bodyY - 19, jr.bodyY - 2, C.ink2);
  chairFront(pix, 196, floor);
  // hygienist with a sticker, Maya relaxed
  P.drawPerson(pix, 244, floor, { head: 'curly', face: 'grin', body: 'scrubs', arms: 'wave', look: hyg });
  pix.sprite(PROP.sticker, 257, floor - 44);
  P.drawPerson(pix, 160, floor, { head: 'bun', face: 'content', body: 'tee', arms: 'down', look: maya });
  pix.sprite(EMOTE.heart, 165, floor - 34);
  return pix;
}

// Helpers, temptations and dreams: the objects that carry the game's choices.
export function props() {
  const pix = new Pix(320, 150).clear(C.paper);
  const rows = [
    ['Helpers', C.teal0, [[PROP.eBrush, 'e-brush'], [PROP.picks, 'floss picks'], [PROP.paste, 'fluoride'], [PROP.water, 'water'], [PROP.guard, 'night guard'], [PROP.calendar, 'booked!']]],
    ['Temptations', C.red0, [[PROP.soda, 'soda'], [PROP.energy, 'energy'], [PROP.sportsDrink, 'sports'], [PROP.mug, 'sweet latte'], [PROP.donut, 'donut'], [PROP.cupcake, 'tasting']]],
    ['Dreams', C.gold0, [[PROP.guitar, 'guitar'], [PROP.ticket, 'a trip'], [PROP.bike, 'a bike'], [PROP.car, 'a car'], [PROP.key, 'a home'], [PROP.book, 'classes']]],
  ];
  rows.forEach(([title, col, items], r) => {
    const y = 4 + r * 48;
    pix.panel(4, y, 312, 45, C.cream, C.ink);
    pix.text(title, 10, y + 4, col);
    items.forEach(([spr, label], i) => {
      const cx = 44 + i * 50;
      const sc = spr.h > 8 ? 2 : 3;
      pix.sprite(spr, cx - ((spr.w * sc) >> 1), y + 32 - spr.h * sc, { scale: sc });
      pix.text(label, cx, y + 35, C.shade, { align: 'center' });
    });
  });
  return pix;
}

// The palette, grouped into ramps.
export function palette() {
  const pix = new Pix(160, 88).clear(C.paper);
  const groups = [
    ['ink', [C.ink, C.ink2, C.shade, C.stone, C.mist, C.paper, C.cream, C.white]],
    ['wood', [C.wood0, C.wood1, C.wood2, C.wood3, C.wood4]],
    ['warm', [C.red0, C.red1, C.red2, C.red3, C.gold0, C.gold1, C.gold2, C.gold3]],
    ['green', [C.green0, C.green1, C.green2, C.green3, C.green4, C.teal0, C.teal1, C.teal2, C.teal3]],
    ['cool', [C.blue0, C.blue1, C.blue2, C.blue3, C.blue4, C.plum0, C.plum1, C.plum2, C.plum3]],
    ['rose', [C.pink1, C.pink2, C.pink3, C.wallCream, C.wallSage, C.wallRose, C.wallBlue, C.wallLilac]],
    ['sky', [C.night0, C.night1, C.night2, C.dusk0, C.dusk1, C.dusk2, C.dusk3, C.dusk4, C.day0, C.day1, C.day2]],
    ['skin', [...SKIN.porcelain.slice(0, 3), ...SKIN.peach.slice(0, 3), ...SKIN.tan.slice(0, 3), ...SKIN.brown.slice(0, 3), ...SKIN.deep.slice(0, 3)]],
  ];
  groups.forEach(([name, cols], r) => {
    pix.text(name, 4, 4 + r * 10, C.shade);
    cols.forEach((c, i) => { pix.rect(34 + i * 8, 3 + r * 10, 7, 8, c); pix.frame(34 + i * 8, 3 + r * 10, 7, 8, C.ink); });
  });
  return pix;
}

export { acidclock } from './acidclock.js';
export { garden, toolshed } from './garden.js';
export { toothpaste } from './garden.js';
