// Pix: a tiny RGBA framebuffer. Pixel-exact in Node and the browser,
// so the same drawing code produces the PNG exports and the live game.

import { C, rgba } from '../palette.js';
import { FONT } from './font.js';

// Bayer 4x4 thresholds (0..15) for ordered dithering.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export class Pix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }

  clear(c) {
    const [r, g, b, a] = rgba(c) || [0, 0, 0, 0];
    const d = this.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = a;
    }
    return this;
  }

  // Set one pixel. `c` is a palette hex, an [r,g,b,a] array, or null (skip).
  // `mode` is 'normal' | 'multiply' | 'screen' | 'add'; `alpha` scales opacity.
  px(x, y, c, alpha = 1, mode = 'normal') {
    if (c == null) return;
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const col = rgba(c);
    const a = (col[3] / 255) * alpha;
    if (a <= 0) return;
    const d = this.data;
    const i = (y * this.w + x) * 4;
    let r = col[0], g = col[1], b = col[2];
    if (mode === 'multiply') {
      r = (d[i] * r) / 255; g = (d[i + 1] * g) / 255; b = (d[i + 2] * b) / 255;
    } else if (mode === 'screen') {
      r = 255 - ((255 - d[i]) * (255 - r)) / 255;
      g = 255 - ((255 - d[i + 1]) * (255 - g)) / 255;
      b = 255 - ((255 - d[i + 2]) * (255 - b)) / 255;
    } else if (mode === 'add') {
      r = d[i] + r; g = d[i + 1] + g; b = d[i + 2] + b;
    }
    if (a >= 1 && mode === 'normal') {
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
      return;
    }
    const da = d[i + 3] / 255;
    const oa = a + da * (1 - a);
    if (oa <= 0) return;
    d[i] = (r * a + d[i] * da * (1 - a)) / oa;
    d[i + 1] = (g * a + d[i + 1] * da * (1 - a)) / oa;
    d[i + 2] = (b * a + d[i + 2] * da * (1 - a)) / oa;
    d[i + 3] = oa * 255;
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    const i = (y * this.w + x) * 4;
    const d = this.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]];
  }

  rect(x, y, w, h, c, alpha = 1, mode = 'normal') {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c, alpha, mode);
    return this;
  }

  frame(x, y, w, h, c) {
    this.hline(x, x + w - 1, y, c);
    this.hline(x, x + w - 1, y + h - 1, c);
    this.vline(x, y, y + h - 1, c);
    this.vline(x + w - 1, y, y + h - 1, c);
    return this;
  }

  // Rounded 1px-corner panel (classic RPG window).
  panel(x, y, w, h, fill, border, shadow) {
    if (shadow) {
      this.rect(x + 1, y + h, w - 1, 1, shadow);
      this.rect(x + w, y + 1, 1, h - 1, shadow);
    }
    this.rect(x + 1, y + 1, w - 2, h - 2, fill);
    this.hline(x + 1, x + w - 2, y, border);
    this.hline(x + 1, x + w - 2, y + h - 1, border);
    this.vline(x, y + 1, y + h - 2, border);
    this.vline(x + w - 1, y + 1, y + h - 2, border);
    return this;
  }

  hline(x0, x1, y, c, alpha = 1) {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.px(x, y, c, alpha);
    return this;
  }

  vline(x, y0, y1, c, alpha = 1) {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.px(x, y, c, alpha);
    return this;
  }

  line(x0, y0, x1, y1, c) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return this;
  }

  disc(cx, cy, r, c, alpha = 1, mode = 'normal') {
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++)
        if (x * x + y * y <= r * r + r * 0.8) this.px(cx + x, cy + y, c, alpha, mode);
    return this;
  }

  // Ordered-dither fill: `level` 0..1 is the share of pixels painted with c.
  dither(x, y, w, h, c, level = 0.5, alpha = 1) {
    const t = level * 16;
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++)
        if (BAYER[(y + j) & 3][(x + i) & 3] < t) this.px(x + i, y + j, c, alpha);
    return this;
  }

  // Vertical banded gradient with dithered seams between stops.
  gradient(x, y, w, h, stops, seam = 3) {
    const n = stops.length;
    const band = h / n;
    for (let k = 0; k < n; k++) {
      const y0 = Math.round(y + k * band);
      const y1 = Math.round(y + (k + 1) * band);
      this.rect(x, y0, w, y1 - y0, stops[k]);
      if (k > 0) {
        for (let s = 0; s < seam; s++) {
          this.dither(x, y0 + s, w, 1, stops[k - 1], 0.75 - (s / seam) * 0.75 + 0.06);
        }
      }
    }
    return this;
  }

  // Soft radial light (for lamps / windows at night).
  glow(cx, cy, r, c, strength = 0.5, mode = 'screen') {
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        const d = Math.sqrt(x * x + y * y) / r;
        if (d >= 1) continue;
        // quantize to 3 steps so it reads as pixel-art banding
        const q = Math.ceil((1 - d) * 3) / 3;
        this.px(cx + x, cy + y, c, strength * q * q, mode);
      }
    return this;
  }

  sprite(spr, x, y, opts = {}) {
    drawSprite(this, spr, x, y, opts);
    return this;
  }

  blit(src, x, y, alpha = 1) {
    for (let j = 0; j < src.h; j++)
      for (let i = 0; i < src.w; i++) {
        const p = src.get(i, j);
        if (p[3]) this.px(x + i, y + j, p, alpha);
      }
    return this;
  }

  text(str, x, y, c, opts = {}) {
    return drawText(this, str, x, y, c, opts);
  }

  scaled(n) {
    const out = new Pix(this.w * n, this.h * n);
    const s = this.data, d = out.data;
    for (let y = 0; y < out.h; y++) {
      const sy = (y / n) | 0;
      for (let x = 0; x < out.w; x++) {
        const si = (sy * this.w + ((x / n) | 0)) * 4;
        const di = (y * out.w + x) * 4;
        d[di] = s[si]; d[di + 1] = s[si + 1]; d[di + 2] = s[si + 2]; d[di + 3] = s[si + 3];
      }
    }
    return out;
  }
}

// ---------------------------------------------------------------------------
// Sprites
// A sprite is ASCII art plus a key that maps characters to colors. Colors may
// be palette names ('ink'), hex ('#ff00aa'), or roles ('skin.1') resolved from
// a `look` at draw time, which is how skin tone, hair and outfits swap.

export const CHAR_KEY = {
  o: 'ink', O: 'ink2',
  h: 'hair.1', H: 'hair.0', i: 'hair.2',
  s: 'skin.1', S: 'skin.0', l: 'skin.2', b: 'skin.3',
  e: 'ink', w: 'white', m: 'mouth', n: 'tongue',
  c: 'top.1', C: 'top.0', d: 'top.2',
  p: 'bottom.1', P: 'bottom.0', q: 'bottom.2',
  f: 'shoes.1', F: 'shoes.0', g: 'shoes.2',
  x: 'acc.1', X: 'acc.0', y: 'acc.2',
  u: 'acc2.1', U: 'acc2.0', v: 'acc2.2',
  k: 'cream', K: 'mist', t: 'stone', T: 'shade',
};

export function sprite(art, key = {}, extra = {}) {
  const rows = art.replace(/^\n+|\s+$/g, '').split('\n').map(r => r.replace(/^\s*\|?/, '').replace(/\|\s*$/, ''));
  const w = Math.max(...rows.map(r => r.length));
  if (typeof process !== 'undefined' && process.env && process.env.STRICT_SPRITES) {
    rows.forEach((r, i) => {
      if (r.length !== w) console.warn(`sprite row ${i} has ${r.length} cols (expected ${w}): "${r}"`);
    });
  }
  return { w, h: rows.length, rows: rows.map(r => r.padEnd(w, '.')), key: { ...CHAR_KEY, ...key }, ...extra };
}

function resolve(spec, look) {
  if (spec == null) return null;
  if (Array.isArray(spec)) return spec;
  if (spec[0] === '#') return spec;
  const dot = spec.indexOf('.');
  if (dot > 0) {
    const role = spec.slice(0, dot);
    const idx = +spec.slice(dot + 1);
    const ramp = (look && look[role]) || DEFAULT_LOOK[role];
    return ramp ? ramp[idx] ?? ramp[ramp.length - 1] : null;
  }
  return C[spec] ?? null;
}

export const DEFAULT_LOOK = {
  skin: ['#c9855f', '#e8ad83', '#f5cda6', '#e5836f'],
  hair: ['#4b2d22', '#744733', '#9d6645'],
  top: [C.teal0, C.teal1, C.teal2],
  bottom: [C.blue0, C.blue1, C.blue2],
  shoes: [C.ink, C.wood0, C.wood1],
  acc: [C.gold0, C.gold1, C.gold2],
  acc2: [C.mist, C.paper, C.white],
};

export function drawSprite(pix, spr, x, y, opts = {}) {
  const { look, flip = false, alpha = 1, mode = 'normal', recolor } = opts;
  const colors = {};
  for (const ch in spr.key) colors[ch] = resolve(spr.key[ch], look);
  if (opts.key) for (const ch in opts.key) colors[ch] = resolve(opts.key[ch], look);
  for (let j = 0; j < spr.h; j++) {
    const row = spr.rows[j];
    for (let i = 0; i < spr.w; i++) {
      const ch = row[i];
      if (ch === '.' || ch === ' ') continue;
      let col = colors[ch];
      if (col === undefined) continue;
      if (recolor) col = recolor(col, ch);
      const sc = opts.scale || 1;
      if (sc === 1) pix.px(x + (flip ? spr.w - 1 - i : i), y + j, col, alpha, mode);
      else pix.rect(x + (flip ? spr.w - 1 - i : i) * sc, y + j * sc, sc, sc, col, alpha, mode);
    }
  }
}

// Stamp a 1px outline around every opaque pixel of a sprite (for selection glow, etc.).
export function outlineSprite(pix, spr, x, y, c, opts = {}) {
  const { flip = false } = opts;
  const solid = (i, j) => i >= 0 && j >= 0 && i < spr.w && j < spr.h && spr.rows[j][i] !== '.';
  for (let j = -1; j <= spr.h; j++)
    for (let i = -1; i <= spr.w; i++) {
      if (solid(i, j)) continue;
      if (solid(i - 1, j) || solid(i + 1, j) || solid(i, j - 1) || solid(i, j + 1))
        pix.px(x + (flip ? spr.w - 1 - i : i), y + j, c);
    }
}

// ---------------------------------------------------------------------------
// Text (bitmap font, 6px caps, 4px x-height, 2px descenders)

export function measure(str, opts = {}) {
  const sp = opts.spacing ?? 1;
  let w = 0, max = 0;
  for (const ch of str) {
    if (ch === '\n') { max = Math.max(max, w - sp); w = 0; continue; }
    const g = FONT[ch] || FONT['?'];
    w += g.w + sp;
  }
  return Math.max(max, w - sp);
}

export function drawText(pix, str, x, y, c, opts = {}) {
  const sp = opts.spacing ?? 1;
  const lh = opts.lineHeight ?? 9;
  const shadow = opts.shadow;
  let cx = x, cy = y;
  if (opts.align === 'center') cx = x - Math.floor(measure(str, opts) / 2);
  if (opts.align === 'right') cx = x - measure(str, opts);
  const startX = cx;
  for (const ch of str) {
    if (ch === '\n') { cx = startX; cy += lh; continue; }
    const g = FONT[ch] || FONT['?'];
    for (let j = 0; j < g.rows.length; j++)
      for (let i = 0; i < g.w; i++)
        if (g.rows[j][i] === '#') {
          if (shadow) pix.px(cx + i, cy + j + 1, shadow);
          pix.px(cx + i, cy + j, c);
        }
    cx += g.w + sp;
  }
  return cx;
}

// Word-wrap to a pixel width; returns array of lines.
export function wrap(str, width, opts = {}) {
  const words = str.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (measure(t, opts) > width && line) { lines.push(line); line = w; }
    else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
