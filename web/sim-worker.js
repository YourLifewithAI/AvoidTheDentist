// Web Worker for the What-If Lab: the same model the game uses, run in pairs
// with identical seeds so the only difference is the change.
import { simulateLife } from '../sim/model.js';
import { LIVES, MAYA } from '../sim/lives.js';

const BASES = { typical: LIVES.typical, maya: MAYA, prevention: LIVES.prevention };
export const CHANGES = {
  later34: { phases: [{ age: 34, set: { visits: 'pain' } }] },
  sodas: { sodas: 3, sipping: true },
  painOnly: { visits: 'pain' },
  brushOnce: { brushing: 'once' },
  noFluoride: { fluorideToothpaste: false },
  smoker: { smoking: 'smoker' },
  baker: { job: 'baker' },
  lifting: { job: 'warehouse', nightGuard: false },
  liftingGuard: { job: 'warehouse', nightGuard: 'auto' },
  hockey: { sport: 'hockey', sportUntil: 30, guard: 'none' },
  hockeyGuard: { sport: 'hockey', sportUntil: 30, guard: 'custom' },
  every6: { visits: 'every6' },
  floss: { interdental: 'daily' },
  sealants: { sealants: true },
  cheapest: { treatment: 'cheapest' },
  noInsurance: { insurance: 'none' },
  birth: { birth: 'csection', parentsOral: 'poor' },
  withMeals: { withMeals: true },
  gum: { gum: true },
  bedtimeSnack: { bedtimeSnack: true },
  dryMeds45: { phases: [{ age: 45, set: { dryMouthMeds: true } }] },
  reflux40: { phases: [{ age: 40, set: { reflux: true } }] },
  apnea45: { phases: [{ age: 45, set: { sleepApnea: 'untreated' } }] },
  apnea45treated: { phases: [{ age: 45, set: { sleepApnea: 'treated' } }] },
};

const cost = l => l.money.outOfPocket + l.money.parentsPaid;

self.onmessage = e => {
  const { base, change, n = 100 } = e.data;
  const b = BASES[base] || LIVES.typical;
  const ch = CHANGES[change] || {};
  const changed = { ...b, ...ch, phases: [...(b.phases || []), ...(ch.phases || [])], name: 'changed' };
  const results = [];
  for (let s = 1; s <= n; s++) {
    const A = simulateLife(b, s, { log: false });
    const B = simulateLife(changed, s, { log: false });
    results.push({
      dCost: cost(B) - cost(A),
      dMiss: B.missingAt[80] - A.missingAt[80],
      dPain: B.painDays - A.painDays,
      dSelf: B.selfConsciousYears - A.selfConsciousYears,
    });
    if (s % 5 === 0) self.postMessage({ type: 'progress', done: s });
  }
  const mean = k => results.reduce((a, r) => a + r[k], 0) / n;
  self.postMessage({
    type: 'done',
    results,
    summary: {
      dCost: mean('dCost'), dMiss: mean('dMiss'), dPain: mean('dPain'), dSelf: mean('dSelf'),
      worse: results.filter(r => r.dMiss > 0).length,
      better: results.filter(r => r.dMiss < 0).length,
      same: results.filter(r => r.dMiss === 0).length,
    },
  });
};
