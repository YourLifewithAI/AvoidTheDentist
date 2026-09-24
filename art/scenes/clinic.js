// A friendly neighborhood dental office: the place the game wants you to
// stop dreading. Waiting room on the left, treatment room on the right.
import { C, mix } from '../palette.js';
import { F } from '../sprites/furniture.js';
import { sprite } from '../lib/pix.js';

const FISH = sprite(`
.o..
oxxo
.oxo
`, { x: 'gold2' });
const FISH2 = sprite(`
..o.
oxxo
oxo.
`, { x: 'red2' });

function box(pix, x, y, w, h, fill, light, shadow) {
  pix.rect(x, y, w, h, fill);
  if (light) pix.hline(x + 1, x + w - 2, y + 1, light);
  if (shadow) pix.vline(x + w - 2, y + 1, y + h - 2, shadow);
  pix.frame(x, y, w, h, C.ink);
}

export function drawClinic(pix, W = 320, H = 120) {
  const floor = H - 14;
  // walls
  pix.rect(0, 0, W, floor, C.wallBlue);
  for (let x = 4; x < W; x += 8) pix.vline(x, 0, floor - 16, C.wallBlueS);
  pix.rect(0, floor - 15, W, 15, C.teal3);
  pix.hline(0, W - 1, floor - 15, C.white);
  pix.hline(0, W - 1, floor - 14, C.teal2);
  // floor
  pix.rect(0, floor, W, H - floor, C.wood4);
  pix.hline(0, W - 1, floor, C.cream);
  for (let x = 0; x < W; x += 12) pix.px(x, floor + 5, C.wood3);
  // ceiling beam + lights
  pix.rect(0, 0, W, 4, C.cream); pix.hline(0, W - 1, 4, C.stone);
  for (const lx of [40, 120, 230, 290]) { pix.rect(lx, 4, 12, 2, C.white); pix.glow(lx + 6, 8, 18, C.glow1, 0.25); }

  // ---- waiting room
  // window with a tree outside
  pix.rect(8, 16, 34, 26, C.day1); pix.frame(8, 16, 34, 26, C.ink);
  pix.disc(22, 34, 8, C.green2); pix.rect(21, 36, 2, 6, C.wood1); pix.disc(34, 26, 3, C.gold3);
  pix.vline(25, 17, 40, C.cream); pix.hline(9, 40, 28, C.cream);
  // chairs
  for (const cx of [8, 24]) { F.chair(pix, cx, floor - 16, C.gold1); }
  // fish tank on a cabinet
  box(pix, 46, floor - 16, 30, 16, C.wood2, C.wood3, C.wood1);
  pix.rect(47, floor - 34, 28, 18, C.blue3); pix.frame(46, floor - 35, 30, 20, C.ink);
  pix.rect(47, floor - 34, 28, 3, C.blue4);
  pix.sprite(FISH, 53, floor - 28); pix.sprite(FISH2, 64, floor - 24);
  for (const [bx, by] of [[70, floor - 31], [71, floor - 28], [58, floor - 30]]) pix.px(bx, by, C.white);
  pix.rect(48, floor - 18, 26, 2, C.gold3);
  pix.line(52, floor - 18, 52, floor - 24, C.green1); pix.line(68, floor - 18, 69, floor - 26, C.green2);
  // poster
  box(pix, 84, 14, 28, 26, C.cream, null, null);
  pix.rect(86, 17, 24, 10, C.teal3); pix.disc(98, 22, 3, C.gold2);
  pix.text('2 min', 98, 30, C.teal0, { align: 'center' });
  // reception desk + receptionist
  F.plant(pix, 134, floor - 34);
  // toy box
  box(pix, 84, floor - 9, 16, 9, C.red1, C.red2, C.red0);
  pix.px(88, floor - 12, C.gold2); pix.rect(91, floor - 13, 3, 4, C.teal2); pix.px(96, floor - 11, C.pink2);

  // partition with doorway
  pix.rect(150, 5, 4, floor - 5, C.cream); pix.vline(150, 5, floor - 1, C.stone); pix.vline(153, 5, floor - 1, C.ink2);
  pix.rect(150, 40, 4, floor - 40, null);
  pix.rect(151, 40, 2, floor - 40, mix(C.wallBlue, C.ink, 0.1));

  // ---- treatment room
  // window
  pix.rect(160, 14, 26, 22, C.day1); pix.frame(160, 14, 26, 22, C.ink); pix.vline(173, 15, 34, C.cream);
  pix.disc(180, 20, 3, C.gold3);
  // sticker chart
  box(pix, 192, 14, 22, 18, C.white, null, null);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) pix.px(195 + c * 5, 18 + r * 5, [C.gold2, C.teal2, C.pink2, C.red2][(r + c) % 4]);
  // ceiling TV with cartoons
  pix.vline(262, 5, 10, C.ink2);
  box(pix, 250, 10, 26, 16, C.ink, null, null);
  pix.rect(252, 12, 22, 12, C.day1); pix.rect(252, 20, 22, 4, C.green2); pix.disc(262, 17, 2, C.gold2);
  // counter + sink + cabinets
  box(pix, 282, floor - 20, 36, 20, C.white, null, C.mist);
  pix.rect(282, floor - 22, 36, 3, C.mist); pix.frame(282, floor - 22, 36, 3, C.ink);
  pix.rect(290, floor - 27, 2, 5, C.stone); pix.rect(290, floor - 27, 5, 1, C.stone);
  box(pix, 284, 16, 32, 14, C.white, null, C.mist); pix.vline(300, 17, 28, C.mist);
  // overhead light arm
  pix.line(236, 5, 236, 14, C.stone); pix.line(236, 14, 226, 26, C.stone);
  box(pix, 220, 26, 12, 5, C.white, null, C.mist);
  pix.glow(226, 32, 14, C.glow1, 0.3);
}

// The dental chair (upright), drawn in two passes so a person can sit in it.
export function chairBack(pix, x, floor) {
  // base + column
  pix.rect(x + 6, floor - 4, 22, 4, C.stone); pix.frame(x + 6, floor - 4, 22, 4, C.ink);
  pix.rect(x + 14, floor - 12, 6, 8, C.mist); pix.frame(x + 14, floor - 12, 6, 8, C.ink);
  // backrest + headrest
  box(pix, x + 2, floor - 38, 9, 26, C.teal1, C.teal2, C.teal0);
  box(pix, x + 3, floor - 44, 7, 7, C.teal1, C.teal2, C.teal0);
}
export function chairFront(pix, x, floor) {
  // seat cushion + leg rest in front of the sitter's legs
  box(pix, x + 2, floor - 14, 26, 5, C.teal1, C.teal2, C.teal0);
  box(pix, x + 24, floor - 12, 12, 5, C.teal1, C.teal2, C.teal0);
}
export function chairTray(pix, x, floor) {
  pix.line(x + 36, floor - 34, x + 44, floor - 34, C.stone);
  pix.vline(x + 44, floor - 34, floor - 12, C.stone);
  box(pix, x + 32, floor - 37, 12, 3, C.white, null, null);
}
