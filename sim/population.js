// A random, roughly US-shaped life: used for calibration against national
// surveillance data and as the game's "Surprise me" life.
import { Streams } from './rng.js';

const pick = (S, name, table) => {
  const i = S.pick(name, table.map(t => t[1]));
  return table[i][0];
};

export function randomPlan(seed) {
  const S = new Streams(seed ^ 0x51ed270b);
  const chance = (name, p) => S.u(name) < p;
  const visits = pick(S, 'visits', [['every6', 0.40], ['yearly', 0.20], ['every2y', 0.05], ['pain', 0.30], ['never', 0.05]]);
  const regular = visits === 'every6' || visits === 'yearly';
  const job = pick(S, 'job', [['office', 0.35], ['teacher', 0.10], ['nurse', 0.08], ['warehouse', 0.15], ['driver', 0.12], ['baker', 0.05], ['hygienist', 0.01], ['office', 0.14]]);
  const sodas = pick(S, 'sodas', [[0, 0.40], [1, 0.30], [2, 0.15], [3, 0.10], [4, 0.05]]);
  const sport = pick(S, 'sport', [['none', 0.60], ['soccer', 0.12], ['basketball', 0.12], ['hockey', 0.04], ['football', 0.07], ['boxing', 0.01], ['skate', 0.04]]);
  const smoking = pick(S, 'smoking', [['never', 0.78], ['smoker', 0.14], ['vaper', 0.08]]);
  const plan = {
    name: `Random #${seed}`,
    birth: chance('csection', 0.32) ? 'csection' : 'vaginal',
    parentsOral: pick(S, 'parentsOral', [['healthy', 0.30], ['average', 0.45], ['poor', 0.25]]),
    parentsAnxious: chance('parentsAnxious', 0.2),
    fluoridatedWater: chance('water', 0.63),
    kidInsurance: pick(S, 'kidIns', [['employer', 0.50], ['medicaidChild', 0.38], ['none', 0.12]]),
    firstVisit: pick(S, 'firstVisit', [[1, 0.15], [2, 0.15], [3, 0.30], [5, 0.15], ['pain', 0.25]]),
    kidVisits: pick(S, 'kidVisits', [['every6', 0.50], ['yearly', 0.30], ['pain', 0.20]]),
    kidDentist: chance('pedo', 0.5) ? 'pediatric' : 'general',
    bedtimeBottle: chance('bottle', 0.2),
    kidBrushing: pick(S, 'kidBrush', [['twice', 0.55], ['once', 0.35], ['rarely', 0.10]]),
    kidSugar: pick(S, 'kidSugar', [[2, 0.25], [3, 0.30], [4, 0.25], [6, 0.20]]),
    salivaSharing: chance('saliva', 0.5),
    sealants: chance('sealants', 0.45),
    braces: chance('braces', 0.25),
    sugar: pick(S, 'sugar', [[1, 0.15], [2, 0.25], [3, 0.30], [4, 0.15], [6, 0.15]]),
    sodas,
    sipping: sodas > 0 && chance('sip', 0.2),
    dietSodas: pick(S, 'diet', [[0, 0.7], [1, 0.2], [2, 0.1]]),
    withMeals: chance('withMeals', 0.2),
    gum: chance('gum', 0.15),
    waterAfterSnacks: chance('rinse', 0.1),
    bedtimeSnack: chance('bedSnack', 0.25),
    energyDrinks: pick(S, 'energy', [[0, 0.85], [1, 0.12], [2, 0.03]]),
    brushing: pick(S, 'brush', [['twice', 0.65], ['once', 0.30], ['rarely', 0.05]]),
    fluorideToothpaste: chance('fpaste', 0.95),
    interdental: pick(S, 'floss', [['daily', 0.32], ['sometimes', 0.37], ['never', 0.31]]),
    electricBrush: chance('electric', 0.3),
    visits,
    job,
    insurance: job !== 'driver' && chance('smallEmployer', 0.15) ? 'none' : 'job',
    retireInsurance: pick(S, 'retire', [['medicare', 0.50], ['advantage', 0.45], ['employer', 0.05]]),
    sport,
    sportFrom: 8,
    sportUntil: pick(S, 'sportUntil', [[14, 0.3], [18, 0.4], [22, 0.2], [35, 0.1]]),
    guard: sport === 'football' ? 'boil' : pick(S, 'guard', [['none', 0.6], ['boil', 0.3], ['custom', 0.1]]),
    smoking,
    nightGuard: chance('ng', 0.6) ? 'auto' : false,
    knowsRisk: chance('risk', 0.05),
    coping: pick(S, 'coping', [['none', 0.8], ['tell', 0.12], ['sedation', 0.05], ['cbt', 0.03]]),
    treatment: regular ? pick(S, 'tx', [['follow', 0.75], ['cheapest', 0.15], ['defer', 0.10]]) : pick(S, 'tx2', [['follow', 0.3], ['cheapest', 0.4], ['defer', 0.3]]),
    bookNext: chance('book', 0.3),
    firstAid: chance('firstAid', 0.2),
    iceChewing: chance('ice', 0.05),
    pregnancies: chance('female', 0.5) ? [26, 30, 34].slice(0, pick(S, 'kids', [[0, 0.25], [1, 0.25], [2, 0.35], [3, 0.15]])) : [],
    phases: [],
  };
  if (chance('reflux', 0.15)) plan.phases.push({ age: pick(S, 'refluxAge', [[35, 0.3], [45, 0.4], [55, 0.3]]), set: { reflux: true } });
  if (chance('apnea', 0.12)) plan.phases.push({ age: pick(S, 'apneaAge', [[40, 0.5], [50, 0.5]]), set: { sleepApnea: chance('apneaTreated', 0.3) ? 'treated' : 'untreated' } });
  if (chance('dryMeds', 0.12)) plan.phases.push({ age: pick(S, 'dryMedsAge', [[35, 0.3], [45, 0.4], [55, 0.3]]), set: { dryMouthMeds: true } });
  if (smoking === 'smoker' && chance('quit', 0.55)) plan.phases.push({ age: pick(S, 'quitAge', [[30, 0.3], [40, 0.35], [50, 0.35]]), set: { smoking: 'never' } });
  return plan;
}
