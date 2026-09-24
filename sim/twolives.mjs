// "Same luck, one choice": run Maya's two lives on the same seeds and find a
// representative pair for the art sample and the plan.
// usage: node sim/twolives.mjs [N=400]
import { writeFileSync } from 'node:fs';
import { simulateLife } from './model.js';
import { MAYA_BOOK_IT, MAYA_LATER } from './lives.js';

const N = +(process.argv[2] || 400);
const at = (l, a) => l.yearly.find(y => y.age === a);
const cost = (l, a) => at(l, a).oop; // adult out-of-pocket to date
const pairs = [];
for (let s = 1; s <= N; s++) {
  const A = simulateLife(MAYA_BOOK_IT, s), B = simulateLife(MAYA_LATER, s);
  pairs.push({
    seed: s, A, B,
    d45: cost(B, 45) - cost(A, 45),
    d80: (B.money.outOfPocket) - (A.money.outOfPocket),
    miss45: at(B, 45).missing - at(A, 45).missing,
    miss80: B.missingAt[80] - A.missingAt[80],
  });
}
const med = f => { const v = pairs.map(f).sort((a, b) => a - b); return v[v.length >> 1]; };
const share = f => pairs.filter(f).length / N;
const summary = {
  N,
  medianExtraCostBy45: med(p => p.d45),
  medianExtraCostBy80: med(p => p.d80),
  medianExtraMissingAt80: med(p => p.miss80),
  shareWorseBy80: share(p => p.miss80 > 0 || p.d80 > 0),
  shareCheaperButMoreMissing: share(p => p.d80 < 0 && p.miss80 > 0),
};
// representative seed: close to median on both cost and teeth, with a clear story by 45
const target = summary.medianExtraCostBy80;
const mm = summary.medianExtraMissingAt80;
const featured = pairs
  .filter(p => p.d45 > 800 && at(p.B, 62).missing > at(p.A, 62).missing)
  .sort((a, b) => (Math.abs(a.d80 - target) / 4000 + Math.abs(a.miss80 - mm) / 3) - (Math.abs(b.d80 - target) / 4000 + Math.abs(b.miss80 - mm) / 3))[0];

const story = l => l.events.filter(e => e.age >= 33 && !['skippedVisit', 'scaryVisit'].includes(e.type)).map(e => `${Math.floor(e.age)}: ${e.type}${e.what ? ` (${e.what})` : ''}${e.why ? ` (${e.why})` : ''}${e.cause ? ` (${e.cause})` : ''}`);
const brief = l => ({
  oop45: cost(l, 45), oop80: l.money.outOfPocket, missing45: at(l, 45).missing, missing80: l.missingAt[80],
  painDays: l.painDays, selfConsciousYears: l.selfConsciousYears, counts: l.counts, traits: l.traits,
});
const snap = l => Object.fromEntries([34, 45, 62, 79].map(a => [a, (({ oop, missing, painDays, selfConscious, cal, anxiety }) => ({ oop, missing, painDays, selfConscious, cal, anxiety }))(at(l, a))]));
const out = { summary, featured: { seed: featured.seed, snapBookIt: snap(featured.A), snapLater: snap(featured.B), bookIt: brief(featured.A), later: brief(featured.B), storyLater: story(featured.B).slice(0, 30), storyBookIt: story(featured.A).slice(0, 20) } };
console.log(JSON.stringify(out, null, 2));
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
