// Which choices matter most? Flip one lever at a time on the same luck (paired
// seeds) against a typical life and measure the lifetime difference.
// usage: node sim/levers.mjs [N=300] [out.json]
import { writeFileSync } from 'node:fs';
import { simulateLife } from './model.js';
import { LIVES } from './lives.js';

const N = +(process.argv[2] || 300);
const base = LIVES.typical;
const levers = [
  ['Sips 3 sodas a day (vs 1)', { sodas: 3, sipping: true }],
  ['Only goes when it hurts (vs yearly)', { visits: 'pain' }],
  ['Checkups every 6 months (vs yearly)', { visits: 'every6' }],
  ['Brushes once a day (vs twice)', { brushing: 'once' }],
  ['Cleans between teeth daily', { interdental: 'daily' }],
  ['No fluoride toothpaste', { fluorideToothpaste: false }],
  ['Sealants as a kid', { sealants: true }],
  ['First visit at 1 (vs 3)', { firstVisit: 1 }],
  ['First visit only for pain (vs 3)', { firstVisit: 'pain', kidVisits: 'pain' }],
  ['Bedtime bottle as a toddler', { bedtimeBottle: true }],
  ['Baker, tasting all day (vs office)', { job: 'baker' }],
  ['Warehouse lifting, no night guard', { job: 'warehouse', nightGuard: false }],
  ['Warehouse lifting + night guard', { job: 'warehouse', nightGuard: 'auto' }],
  ['Hockey 8-30, no mouthguard', { sport: 'hockey', sportUntil: 30, guard: 'none' }],
  ['Hockey 8-30, custom mouthguard', { sport: 'hockey', sportUntil: 30, guard: 'custom' }],
  ['Smokes from 18', { smoking: 'smoker' }],
  ['Vapes from 18', { smoking: 'vaper' }],
  ['C-section + parents with decay', { birth: 'csection', parentsOral: 'poor' }],
  ['Anxious parents + general dentist', { parentsAnxious: true, kidDentist: 'general' }],
  ['No dental insurance as an adult', { insurance: 'none' }],
  ['Picks the cheapest fix every time', { treatment: 'cheapest' }],
  ['Books next visit before leaving', { bookNext: true }],
  ['Knows the first aid for a knocked-out tooth', { firstAid: true, sport: 'hockey', sportUntil: 30 }],
];

const baseLives = [];
for (let s = 1; s <= N; s++) baseLives.push(simulateLife(base, s, { log: false }));
const med = arr => { const v = [...arr].sort((a, b) => a - b); return v[v.length >> 1]; };
const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const cost = l => l.money.outOfPocket + l.money.parentsPaid;

const rows = levers.map(([label, set]) => {
  const d = { cost: [], miss: [], pain: [], self: [] };
  for (let s = 1; s <= N; s++) {
    const b = baseLives[s - 1];
    const l = simulateLife({ ...base, ...set, name: label }, s, { log: false });
    d.cost.push(cost(l) - cost(b));
    d.miss.push(l.missingAt[80] - b.missingAt[80]);
    d.pain.push(l.painDays - b.painDays);
    d.self.push(l.selfConsciousYears - b.selfConsciousYears);
  }
  return { lever: label, dCostMedian: Math.round(med(d.cost)), dCostMean: Math.round(mean(d.cost)), dMissing80: +mean(d.miss).toFixed(1), dPainDays: Math.round(mean(d.pain)), dSelfConsciousYears: +mean(d.self).toFixed(1) };
});
rows.sort((a, b) => b.dCostMean - a.dCostMean);
const f = v => (v > 0 ? '+' : '') + v;
const fm = v => (v >= 0 ? '+$' : '-$') + Math.abs(v).toLocaleString('en-US');
console.log(`\nOne choice at a time vs a typical life (${N} paired lives, same luck)\n`);
console.log('Choice'.padEnd(44), 'Mean $'.padStart(10), 'Teeth@80'.padStart(9), 'Pain d'.padStart(7), 'Hiding smile (yrs)'.padStart(19));
for (const r of rows) console.log(r.lever.padEnd(44), fm(r.dCostMean).padStart(10), f(r.dMissing80).padStart(9), f(r.dPainDays).padStart(7), f(r.dSelfConsciousYears).padStart(19));
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify({ N, rows }, null, 2));
