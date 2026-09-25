// Build the single-file review page: bundle web/review.js and web/sim-worker.js
// with esbuild and inline them, plus the numbers from docs/sim-report.json.
// usage: node tools/build-review.mjs [out.html]   (needs esbuild: npm i -D esbuild)
import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const out = process.argv[2] || `${root}docs/review.html`;
const bundle = async entry => (await build({ entryPoints: [root + entry], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020' })).outputFiles[0].text;
const safe = s => s.replace(/<\/script/gi, '<\\/script');

const report = JSON.parse(readFileSync(root + 'docs/sim-report.json', 'utf8'));
const snap = s => Object.fromEntries(Object.entries(s).map(([a, v]) => [a, { oop: v.oop, missing: v.missing, painDays: v.painDays }]));
const levers = report.levers.rows.filter(r => !/first aid|Books next|Bedtime bottle|Anxious parents|First visit at 1/.test(r.lever));
const data = {
  featured: { seed: report.two.featured.seed, snapBookIt: snap(report.two.featured.snapBookIt), snapLater: snap(report.two.featured.snapLater) },
  summary: report.two.summary,
  levers,
  paste: report.paste,
};

let html = readFileSync(root + 'web/review.html', 'utf8');
// replacer functions, so "$&" and friends inside the bundles are left alone
const worker = safe(await bundle('web/sim-worker.js')), main = safe(await bundle('web/review.js'));
html = html.replace('/*PAGE_DATA*/', () => safe(JSON.stringify(data)));
html = html.replace('/*SIM_WORKER*/', () => worker);
html = html.replace('/*MAIN*/', () => main);
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
