// "Hearth" palette: warm, slightly desaturated, purple-leaning shadows.
// Every color in the game comes from here so the art stays cohesive.

export const C = {
  // ink & neutrals
  ink: '#2b2135',
  ink2: '#453449',
  shade: '#6b5566',
  stone: '#9b8a93',
  mist: '#c9bdc0',
  paper: '#efe3d3',
  cream: '#fbf3e4',
  white: '#fffaf0',

  // wood
  wood0: '#4e2f2f',
  wood1: '#764537',
  wood2: '#a0613f',
  wood3: '#c9884f',
  wood4: '#e3b073',

  // reds
  red0: '#7a2e3a',
  red1: '#b5473f',
  red2: '#de6a4f',
  red3: '#f09a73',

  // golds
  gold0: '#9a5b2b',
  gold1: '#d48f38',
  gold2: '#f0bd52',
  gold3: '#fae28e',

  // greens
  green0: '#2e4a3f',
  green1: '#3f6f4c',
  green2: '#62a15a',
  green3: '#9fcf73',
  green4: '#d4eaa0',

  // teals
  teal0: '#1f4a5a',
  teal1: '#2d7480',
  teal2: '#4aa8a0',
  teal3: '#8fd3c0',

  // blues
  blue0: '#232d57',
  blue1: '#34518f',
  blue2: '#4f7fc4',
  blue3: '#86b4e6',
  blue4: '#c6e2f5',

  // purples & pinks
  plum0: '#3b2552',
  plum1: '#5e3d78',
  plum2: '#8e62a8',
  plum3: '#bf97d1',
  pink1: '#c95e8a',
  pink2: '#e88fa8',
  pink3: '#f6c1c8',

  // walls
  wallCream: '#f3e2c0',
  wallCreamS: '#dcc59e',
  wallSage: '#cfdcb4',
  wallSageS: '#aebf92',
  wallRose: '#efcabf',
  wallRoseS: '#d6a79d',
  wallBlue: '#c8dfe6',
  wallBlueS: '#a5c3cf',
  wallLilac: '#ddd0e8',
  wallLilacS: '#bfaed0',

  // sky
  night0: '#151a33',
  night1: '#222a4e',
  night2: '#333a68',
  dusk0: '#4f4577',
  dusk1: '#8a5b86',
  dusk2: '#cf7a7f',
  dusk3: '#f0a77a',
  dusk4: '#f8d493',
  day0: '#7fb8e8',
  day1: '#a9d3f2',
  day2: '#d4ecfa',

  // light
  glow0: '#ffd27a',
  glow1: '#ffe6a3',

  // mouth
  mouth: '#7a2e3a',
  tongue: '#d8616a',
};

// Ramps are [shadow, base, light] (+ blush for skin).
export const SKIN = {
  porcelain: ['#e0a58a', '#f7cfb1', '#fde8d4', '#f19b92'],
  peach: ['#c9855f', '#e8ad83', '#f5cda6', '#e5836f'],
  tan: ['#a4633f', '#c98a5e', '#e0aa7b', '#c9674f'],
  brown: ['#74432c', '#9c6242', '#b8805b', '#b0503e'],
  deep: ['#4d2c20', '#6e422f', '#8a5a41', '#8c3f31'],
};

export const HAIR = {
  black: ['#231b2b', '#3d3149', '#62536f'],
  brown: ['#4b2d22', '#744733', '#9d6645'],
  auburn: ['#6e2c20', '#a4462f', '#cf6a41'],
  blonde: ['#b0813b', '#dcb25e', '#f3dc91'],
  pepper: ['#4f4a58', '#7d7887', '#a9a4b2'],
  grey: ['#7f7a88', '#aca7b4', '#d6d2dc'],
  white: ['#b3aebb', '#dcd9e3', '#f6f5fa'],
};

// Fabric ramps for clothing, keyed by name.
export const CLOTH = {
  red: [C.red0, C.red1, C.red2],
  coral: [C.red1, C.red2, C.red3],
  mustard: [C.gold0, C.gold1, C.gold2],
  butter: [C.gold1, C.gold2, C.gold3],
  sage: [C.green1, C.green2, C.green3],
  forest: [C.green0, C.green1, C.green2],
  teal: [C.teal0, C.teal1, C.teal2],
  mint: [C.teal1, C.teal2, C.teal3],
  denim: [C.blue0, C.blue1, C.blue2],
  sky: [C.blue1, C.blue2, C.blue3],
  plum: [C.plum0, C.plum1, C.plum2],
  lilac: [C.plum1, C.plum2, C.plum3],
  rose: [C.pink1, C.pink2, C.pink3],
  brown: [C.wood0, C.wood1, C.wood2],
  khaki: [C.wood2, C.wood3, C.wood4],
  charcoal: [C.ink, C.ink2, C.shade],
  grey: [C.shade, C.stone, C.mist],
  white: [C.mist, C.paper, C.white],
  black: ['#1b1622', C.ink, C.ink2],
};

const cache = new Map();
export function rgba(c) {
  if (c == null) return null;
  if (Array.isArray(c)) return c;
  let v = cache.get(c);
  if (v) return v;
  const h = c.replace('#', '');
  v = [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
    h.length > 6 ? parseInt(h.slice(6, 8), 16) : 255,
  ];
  cache.set(c, v);
  return v;
}

export function mix(a, b, t) {
  const A = rgba(a), B = rgba(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t);
  const g = Math.round(A[1] + (B[1] - A[1]) * t);
  const bl = Math.round(A[2] + (B[2] - A[2]) * t);
  return '#' + [r, g, bl].map(n => n.toString(16).padStart(2, '0')).join('');
}
