// Run many lives per preset and print what "100 lives like yours" looks like.
// usage: node sim/run.mjs [N=500] [--json out.json]
import { writeFileSync } from 'node:fs';
import { simulateLife } from './model.js';
import { LIVES, MAYA_BOOK_IT, MAYA_LATER } from './lives.js';

const args = process.argv.slice(2);
const N = +(args.find(a => /^\d+$/.test(a)) || 500);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

export function runMany(plan, n = N, seed0 = 1) {
  const lives = [];
  for (let i = 0; i < n; i++) lives.push(simulateLife(plan, seed0 + i, { log: false }));
  const pick = f => lives.map(f);
  const oop = pick(l => l.money.outOfPocket + l.money.parentsPaid);
  return {
    name: plan.name,
    n,
    dentalCostMedian: q(oop, 0.5), dentalCostMean: Math.round(mean(oop)), dentalCostP10: q(oop, 0.1), dentalCostP90: q(oop, 0.9),
    billedMean: Math.round(mean(pick(l => l.money.billed))),
    fv65Mean: Math.round(mean(pick(l => l.money.fv65))),
    missing50: +mean(pick(l => l.missingAt[50])).toFixed(1),
    missing65: +mean(pick(l => l.missingAt[65])).toFixed(1),
    missing80: +mean(pick(l => l.missingAt[80])).toFixed(1),
    fillings: +mean(pick(l => l.counts.fillings)).toFixed(1),
    rct: +mean(pick(l => l.counts.rct)).toFixed(1),
    implants: +mean(pick(l => l.counts.implants)).toFixed(1),
    extractions: +mean(pick(l => l.counts.extractions)).toFixed(1),
    anyRctBy80: Math.round(100 * mean(pick(l => (l.counts.rct > 0 ? 1 : 0)))),
    painDays: Math.round(mean(pick(l => l.painDays))),
    missedWork: Math.round(mean(pick(l => l.missedWork))),
    selfConscious: +mean(pick(l => l.selfConsciousYears)).toFixed(1),
    gumYears: +mean(pick(l => l.gumDiseaseYears)).toFixed(1),
    anxietyPeak: +mean(pick(l => l.anxietyPeak)).toFixed(2),
    skipped: +mean(pick(l => l.counts.skipped)).toFixed(1),
    emergencies: +mean(pick(l => l.counts.emergencies + l.counts.er)).toFixed(1),
    // Acid Clock: minutes a day below pH 5.5 (enamel), and below 6.2 on exposed roots
    acid: Object.fromEntries([['toddler', 2, 3], ['kid', 6, 12], ['teen', 13, 17], ['adult', 25, 55], ['elder', 66, 79], ['elderRoot', 66, 79, 'rootMin']]
      .map(([k, a0, a1, f = 'acidMin']) => [k, Math.round(mean(pick(l => mean(l.yearly.filter(y => y.age >= a0 && y.age <= a1).map(y => y[f])))))])),
  };
}

function table(rows, cols) {
  const head = cols.map(c => c[1]);
  const body = rows.map(r => cols.map(([k, , f]) => (f ? f(r[k]) : String(r[k]))));
  const w = head.map((h, i) => Math.max(h.length, ...body.map(b => b[i].length)));
  const line = cells => cells.map((c, i) => (i === 0 ? c.padEnd(w[i]) : c.padStart(w[i]))).join('  ');
  return [line(head), line(w.map(n => '-'.repeat(n))), ...body.map(line)].join('\n');
}

const money = v => '$' + Math.round(v).toLocaleString('en-US');

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = Date.now();
  const rows = Object.values(LIVES).map(p => runMany(p));
  const maya = [runMany(MAYA_BOOK_IT), runMany(MAYA_LATER)];
  const cols = [
    ['name', 'Life'],
    ['dentalCostMedian', 'Median $', money],
    ['dentalCostP90', 'P90 $', money],
    ['fv65Mean', 'FV@65', money],
    ['missing50', 'Miss50'], ['missing65', 'Miss65'], ['missing80', 'Miss80'],
    ['fillings', 'Fill'], ['rct', 'RCT'], ['implants', 'Impl'],
    ['painDays', 'PainD'], ['selfConscious', 'SelfC'], ['gumYears', 'GumY'], ['anxietyPeak', 'Anx'],
  ];
  console.log(`\n${N} lives per preset (lifetime dental out-of-pocket incl. parents' share; FV@65 = what the adult spending before 65 would be worth at 5% real)\n`);
  console.log(table(rows, cols));
  console.log('\nMaya at 34: the dentist\'s office calls.\n');
  console.log(table(maya, cols));
  console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ N, rows, maya }, null, 2));
}
