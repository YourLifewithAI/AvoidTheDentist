// Cozy RPG-window UI drawn in-canvas with the Hearth bitmap font.
// (The shipped game will render text in the DOM for accessibility; these are
// the mockups that define the look.)
import { C } from '../palette.js';
import { sprite, measure, wrap } from '../lib/pix.js';

export const ICON = {
  heart: sprite(`
.oo.oo.
orroRro
orrrrRo
.orrRo.
..oRo..
...o...
`, { r: 'red2', R: 'red1' }),
  smile: sprite(`
.ooooo.
oyyyyyo
oyoyoyo
oyyyyyo
oyoooyo
.ooooo.
`, { y: 'gold2' }),
  calm: sprite(`
..ooo..
.obbbo.
obbbbbo
obkbbbo
.ooooo.
`, { b: 'blue3', k: 'blue4' }),
  energy: sprite(`
..oo..
.oyo..
oyyyoo
.ooyyo
..oyo.
..oo..
`, { y: 'gold2' }),
  coin: sprite(`
.ooo.
oyYyo
oYkYo
oyYyo
.ooo.
`, { y: 'gold2', Y: 'gold1', k: 'gold3' }),
  phone: sprite(`
.oooooo.
okkkkkko
obbbbbbo
obkbbbbo
obbbbbbo
obbbbbbo
okkookko
.oooooo.
`, { b: 'blue2', k: 'ink2' }),
  calendar: sprite(`
.o..o..
ooooooo
orrrrro
okkkkko
okokoko
okkkkko
okoRoko
ooooooo
`, { r: 'red1', k: 'cream', R: 'red1' }),
  sparkle: sprite(`
..o..
..y..
oyyyo
..y..
..o..
`, { y: 'gold3' }),
};

export function panel(pix, x, y, w, h, opts = {}) {
  const { fill = C.cream, border = C.ink, accent = C.paper } = opts;
  pix.rect(x + 1, y + h, w - 1, 1, C.ink, 0.35);
  pix.rect(x + w, y + 1, 1, h, C.ink, 0.35);
  pix.panel(x, y, w, h, fill, border);
  pix.hline(x + 1, x + w - 2, y + h - 2, accent);
}

export function button(pix, x, y, w, label, opts = {}) {
  const { primary = false } = opts;
  const fill = primary ? C.teal1 : C.paper;
  const text = primary ? C.white : C.ink;
  pix.rect(x + 1, y + 10, w - 1, 1, C.ink, 0.4);
  pix.panel(x, y, w, 10, fill, C.ink);
  pix.hline(x + 1, x + w - 2, y + 1, primary ? C.teal2 : C.white);
  pix.text(label, x + Math.floor((w - measure(label)) / 2), y + 2, text);
}

export function pips(pix, x, y, icon, n, of = 5) {
  pix.sprite(icon, x, y);
  for (let i = 0; i < of; i++) {
    const px = x + icon.w + 2 + i * 5;
    pix.rect(px, y + 1, 4, 4, i < n ? C.teal2 : C.paper);
    if (i < n) pix.px(px + 1, y + 2, C.teal3);
    pix.frame(px, y + 1, 4, 4, C.ink2);
  }
}

export function card(pix, x, y, w, title, body, buttons, opts = {}) {
  const lines = wrap(body, w - 12);
  const h = 22 + lines.length * 9 + 16 + (opts.note ? 8 : 0);
  panel(pix, x, y, w, h);
  // title strip
  pix.rect(x + 1, y + 1, w - 2, 12, C.teal1);
  pix.hline(x + 1, x + w - 2, y + 1, C.teal2);
  pix.hline(x + 1, x + w - 2, y + 13, C.ink);
  if (opts.icon) pix.sprite(opts.icon, x + 4, y + 2);
  pix.text(title, x + (opts.icon ? 15 : 5), y + 4, C.white, { shadow: C.teal0 });
  lines.forEach((ln, i) => pix.text(ln, x + 6, y + 18 + i * 9, C.ink));
  let by = y + 20 + lines.length * 9;
  if (opts.note) {
    pix.text(opts.note, x + 6, by, C.shade);
    by += 8;
  }
  const bw = Math.floor((w - 12 - (buttons.length - 1) * 4) / buttons.length);
  buttons.forEach((b, i) => button(pix, x + 6 + i * (bw + 4), by, bw, b, { primary: i === 0 }));
  return h;
}

export function bubble(pix, x, y, icon) {
  // thought bubble with a tail pointing down-left
  const w = icon.w + 6, h = icon.h + 6;
  pix.panel(x, y, w, h, C.white, C.ink);
  pix.sprite(icon, x + 3, y + 3);
  pix.px(x + 2, y + h + 1, C.ink); pix.px(x + 1, y + h + 3, C.ink);
  pix.px(x + 3, y + h, C.white); pix.px(x + 2, y + h, C.ink); pix.px(x + 4, y + h, C.ink);
}

export function timeline(pix, x, y, w, age, events = []) {
  const stages = [
    ['Baby', 0, 3], ['Kid', 3, 13], ['Teen', 13, 19], ['Adult', 19, 50], ['Midlife', 50, 65], ['Senior', 65, 85],
  ];
  const span = 85;
  const ax = a => x + Math.round((a / span) * (w - 1));
  panel(pix, x - 3, y - 3, w + 6, 17, { fill: C.paper });
  const cols = [C.pink3, C.gold3, C.plum3, C.teal3, C.blue3, C.wallLilac];
  stages.forEach(([name, a0, a1], i) => {
    const x0 = ax(a0), x1 = ax(a1);
    pix.rect(x0, y, x1 - x0, 4, cols[i % cols.length]);
    pix.vline(x0, y - 1, y + 4, C.ink2);
    if (x1 - x0 > measure(name) + 2) pix.text(name, x0 + 2, y + 6, C.shade);
  });
  // lived portion
  pix.rect(ax(0), y, ax(age) - ax(0), 4, C.teal2, 0.55);
  for (const e of events) {
    const ex = ax(e.age);
    pix.rect(ex - 1, y, 3, 4, e.color || C.gold2);
    pix.frame(ex - 1, y, 3, 4, C.ink);
  }
  // marker
  const mx = ax(age);
  pix.vline(mx, y - 2, y + 5, C.red1);
  pix.rect(mx - 1, y - 3, 3, 2, C.red1);
}
