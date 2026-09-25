// QR code, printable poster and app icon, in the game's pixel style.
import { Pix, measure } from './lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from './palette.js';
import * as P from './sprites/people.js';
import { PROP } from './sprites/props.js';
import { drawHouse } from './scenes/house.js';

// modules: qrcode's BitMatrix ({ size, get(row, col) }); 4-module quiet zone
export function qrPix(modules, dark = C.ink, light = '#ffffff') {
  const n = modules.size, q = 4, pix = new Pix(n + 2 * q, n + 2 * q).clear(light);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (modules.get(r, c)) pix.px(c + q, r + q, dark);
  return pix;
}

// A waiting-room poster: the cozy house, "scan to play", the QR code.
export function qrPoster(modules, url) {
  const W = 200, H = 340, pix = new Pix(W, H).clear(C.night0 || C.ink);
  pix.rect(0, 0, W, H, '#1b2040');
  pix.text('Avoid the Dentist', W / 2, 8, C.cream, { align: 'center' });
  // a crop of the house at dusk
  const house = new Pix(320, 180);
  drawHouse(house, { time: 'dusk', moon: [300, 58], cat: true, counter: ['fruit', 'water'], fridgeNotes: ['calendar'], dreams: 3, savings: 0.7 });
  P.drawPerson(house, 176, 154, { head: 'bun', face: 'grin', body: 'tee', arms: 'hold', look: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.teal, bottom: CLOTH.denim, shoes: CLOTH.brown }, after: [{ spr: PROP.mug, dx: 5, dy: 0 }] });
  P.drawPerson(house, 176, 100, { head: 'pigtails', face: 'content', body: 'kidDress', arms: 'kidBrush', look: { skin: SKIN.tan, hair: HAIR.brown, top: CLOTH.mint, bottom: CLOTH.mint, shoes: CLOTH.red } });
  const sx = 88, sy = 40, cw = 184, ch = 118;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const i = ((sy + y) * 320 + (sx + x)) * 4, o = ((20 + y) * W + (8 + x)) * 4;
    for (let k = 0; k < 4; k++) pix.data[o + k] = house.data[i + k];
  }
  pix.frame(7, 19, cw + 2, ch + 2, '#0b0e20');
  pix.text('Live a whole life in two minutes.', W / 2, 144, C.cream, { align: 'center' });
  pix.text('See how everyday choices play out', W / 2, 153, C.mist, { align: 'center' });
  pix.text('for your teeth, wallet and smile.', W / 2, 162, C.mist, { align: 'center' });
  // the code, 3 px per module on a white card
  const code = qrPix(modules), s = 3, cx = Math.round((W - code.w * s) / 2), cy = 174;
  pix.rect(cx - 3, cy - 3, code.w * s + 6, code.w * s + 6, C.cream);
  for (let y = 0; y < code.h; y++) for (let x = 0; x < code.w; x++) {
    const i = (y * code.w + x) * 4, dark = code.data[i] < 128;
    pix.rect(cx + x * s, cy + y * s, s, s, dark ? C.ink : '#ffffff');
  }
  const after = cy + code.h * s + 6;
  pix.text('Scan to play', W / 2, after, C.gold2, { align: 'center' });
  pix.text('No sign-up. Nothing leaves your phone.', W / 2, after + 10, C.mist, { align: 'center' });
  const short = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  if (measure(short) < W - 8) pix.text(short, W / 2, after + 19, C.stone, { align: 'center' });
  return pix;
}

// 32x32 app icon: a grinning face on the night sky (no teeth, per the art direction)
export function appIcon() {
  const pix = new Pix(32, 32).clear('#1b2040');
  pix.px(4, 5, C.gold3); pix.px(26, 3, C.gold3); pix.px(28, 9, C.gold3);
  pix.disc(16, 22, 13, C.teal1);
  P.drawPerson(pix, 8, 38, { head: 'bun', face: 'grin', body: 'tee', arms: 'down', look: { skin: SKIN.tan, hair: HAIR.black, top: CLOTH.coral, bottom: CLOTH.denim, shoes: CLOTH.brown } });
  return pix;
}
