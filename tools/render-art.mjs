// Export every art sheet to docs/art/ at native size and scaled up.
// usage: node tools/render-art.mjs
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { encodePNG } from '../art/lib/png.js';
import * as sheets from '../art/sheets.js';

const out = new URL('../docs/art/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const report = new URL('../docs/sim-report.json', import.meta.url).pathname;
const featured = existsSync(report) ? JSON.parse(readFileSync(report, 'utf8')).two.featured : undefined;

const list = [
  ['keyart', 4, () => sheets.keyart()],
  ['mockup', 4, () => sheets.mockup()],
  ['mockup-day', 4, () => sheets.mockupDay()],
  ['lineup', 4, () => sheets.lineup()],
  ['cast', 4, () => sheets.cast()],
  ['feelings', 4, () => sheets.feelings()],
  ['work-and-play', 4, () => sheets.workplay()],
  ['two-lives', 4, () => sheets.twolives(featured)],
  ['acid-clock', 4, () => sheets.acidclock()],
  ['garden', 4, () => sheets.garden()],
  ['tool-shed', 4, () => sheets.toolshed()],
  ['clinic', 4, () => sheets.clinic()],
  ['props', 4, () => sheets.props()],
  ['palette', 5, () => sheets.palette()],
];
for (const [name, scale, fn] of list) {
  const pix = fn();
  writeFileSync(`${out}${name}@1x.png`, encodePNG(pix));
  writeFileSync(`${out}${name}.png`, encodePNG(pix.scaled(scale)));
  console.log(`docs/art/${name}.png  ${pix.w}x${pix.h} @${scale}x`);
}
