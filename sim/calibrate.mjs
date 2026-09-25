// Compare a simulated US-like population with national surveillance data.
// usage: node sim/calibrate.mjs [N=2000]
import { simulateLife } from './model.js';
import { randomPlan } from './population.js';

const N = +(process.argv[2] || 2000);
const lives = [];
for (let i = 1; i <= N; i++) lives.push(simulateLife(randomPlan(i), i, { log: false }));

// average a yearly metric over an age band (each life contributes each year in the band)
function band(a0, a1, f) {
  let s = 0, n = 0;
  for (const l of lives) for (const y of l.yearly) if (y.age >= a0 && y.age <= a1) { const v = f(y, l); if (v != null) { s += v; n++; } }
  return s / n;
}
const pct = v => (100 * v).toFixed(1) + '%';

const rows = [
  // [label, model, target, source]
  ['Caries experience, primary teeth, age 2-5', pct(band(2, 5, y => (y.primDmf > 0 ? 1 : 0))), '23%', 'CDC OHSR 2019 [V]'],
  ['Caries experience, permanent, age 12-19', pct(band(12, 19, y => (y.dmft > 0 ? 1 : 0))), '~57%', 'NHANES 2011-16 [U]'],
  ['Caries experience, permanent, age 20-64', pct(band(20, 64, y => (y.dmft > 0 || y.missing > 0 ? 1 : 0))), '~90%', 'NIDCR [U]'],
  ['Untreated decay (deep), age 20-34', pct(band(20, 34, y => (y.untreated ? 1 : 0))), '~22%', 'CDC OHSR 2024 [V]'],
  ['Untreated decay (any dentin), 20-34', pct(band(20, 34, y => (y.untreated2 ? 1 : 0))), '~22%', 'CDC OHSR 2024 [V]'],
  ['Untreated decay, age 65+', pct(band(65, 79, y => (y.untreated ? 1 : 0))), '13%', 'CDC OHSR 2024 [V]'],
  ['Mean natural teeth (dentate), 20-34', band(20, 34, y => (y.natural > 0 ? y.natural : null)).toFixed(1), '27.0', 'CDC OHSR 2024 [V]'],
  ['Mean natural teeth (dentate), 50-64', band(50, 64, y => (y.natural > 0 ? y.natural : null)).toFixed(1), '23.3', 'CDC OHSR 2024 [V]'],
  ['Mean natural teeth (dentate), 65-74', band(65, 74, y => (y.natural > 0 ? y.natural : null)).toFixed(1), '21.7', 'CDC OHSR 2024 [V]'],
  ['Mean natural teeth (dentate), 75-79', band(75, 79, y => (y.natural > 0 ? y.natural : null)).toFixed(1), '19.8 (75+)', 'CDC OHSR 2024 [V]'],
  ['No natural teeth, 50-64', pct(band(50, 64, y => (y.natural === 0 ? 1 : 0))), '5.9%', 'CDC OHSR 2024 [V]'],
  ['No natural teeth, 65-74', pct(band(65, 74, y => (y.natural === 0 ? 1 : 0))), '11.4%', 'CDC OHSR 2024 [V]'],
  ['No natural teeth, 75-79', pct(band(75, 79, y => (y.natural === 0 ? 1 : 0))), '19.7% (75+)', 'CDC OHSR 2024 [V]'],
  ['Periodontitis (CAL >= 3 mm), 30+', pct(band(30, 79, y => (y.cal >= 3 ? 1 : 0))), '~42%', 'Eke 2018 [U]'],
  ['Severe periodontitis (CAL >= 6 mm), 30+', pct(band(30, 79, y => (y.cal >= 6 ? 1 : 0))), '~7.8%', 'Eke 2018 [U]'],
  ['Periodontitis (CAL >= 3 mm), 65+', pct(band(65, 79, y => (y.cal >= 3 ? 1 : 0))), '~68%', 'Eke 2012 [U]'],
  ['Mean CAL progression 30-60 (mm/yr)', ((band(60, 60, y => y.cal) - band(30, 30, y => y.cal)) / 30).toFixed(3), '~0.1', 'Needleman 2018 [V]'],
  ['High dental anxiety (>= 0.5), adults', pct(band(18, 79, y => (y.anxiety >= 0.5 ? 1 : 0))), '~12-15%', 'Silveira 2021 / ADHS 2009 [U]'],
];
rows.push(['Fluorosis, very mild or worse (per life)', pct(lives.filter(l => l.fluorosis !== 'none').length / N), '61% (16-17)', 'NHANES 2011-12, Wiener 2018 [V]']);
rows.push(['Fluorosis, moderate (per life)', pct(lives.filter(l => l.fluorosis === 'moderate').length / N), 'a few %', 'Dean index surveys [U]']);
const w0 = Math.max(...rows.map(r => r[0].length));
console.log(`\nSimulated population: ${N} random US-like lives\n`);
console.log('Metric'.padEnd(w0), 'Model'.padStart(8), '  Target'.padEnd(14), 'Source');
for (const [a, b, c, d] of rows) console.log(a.padEnd(w0), String(b).padStart(8), '  ' + c.padEnd(12), d);
const oop = lives.map(l => l.money.outOfPocket + l.money.parentsPaid).sort((a, b) => a - b);
console.log(`\nLifetime dental spending (out of pocket, incl. childhood): median $${oop[N >> 1].toLocaleString()}, p10 $${oop[Math.floor(N * 0.1)].toLocaleString()}, p90 $${oop[Math.floor(N * 0.9)].toLocaleString()}`);

const avg = f => (lives.reduce((a, l) => a + f(l), 0) / N).toFixed(1);
console.log(`Billed (all payers) median: $${lives.map(l => l.money.billed).sort((a, b) => a - b)[N >> 1].toLocaleString()}  (US: ~$520/person/yr total dental spending -> ~$42k over 80 yrs [U])`);
console.log(`Per lifetime: visits ${avg(l => l.counts.visits)}, fillings ${avg(l => l.counts.fillings)}, crowns ${avg(l => l.counts.crowns)}, RCT ${avg(l => l.counts.rct)}, extractions ${avg(l => l.counts.extractions)}, implants ${avg(l => l.counts.implants)}, SRP ${avg(l => l.counts.srp)}, dentures ${avg(l => l.counts.dentures)}, ER ${avg(l => l.counts.er)}, cracks ${avg(l => l.counts.cracks)}, trauma ${avg(l => l.counts.trauma)}`);
