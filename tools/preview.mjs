// Dev helper: render a named sheet from art/sheets.js to a PNG for inspection.
// usage: node tools/preview.mjs <sheetName> [scale] [outPath] [--grid]
import { writeFileSync } from 'node:fs';
import { encodePNG } from '../art/lib/png.js';
import { Pix } from '../art/lib/pix.js';
import * as sheets from '../art/sheets.js';

const [name, scaleArg = '6', out = `/tmp/preview-${name}.png`] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const grid = process.argv.includes('--grid');
const fn = sheets[name];
if (!fn) {
  console.error('unknown sheet', name, 'available:', Object.keys(sheets).join(', '));
  process.exit(1);
}
const pix = fn();
const scale = +scaleArg;
let big = pix.scaled(scale);
if (grid && scale >= 4) {
  // faint grid every pixel, stronger every 8
  for (let y = 0; y < big.h; y++)
    for (let x = 0; x < big.w; x++) {
      const on8 = (x % (scale * 8) === 0) || (y % (scale * 8) === 0);
      if (x % scale === 0 || y % scale === 0) big.px(x, y, on8 ? '#ff00ff' : '#000000', on8 ? 0.35 : 0.12);
    }
}
writeFileSync(out, encodePNG(big));
console.log(`wrote ${out} (${big.w}x${big.h})`);
