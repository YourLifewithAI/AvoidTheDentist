// The Acid Clock: a 24-hour Stephan curve of plaque pH, built from a day's
// meals, snacks and drinks.
//
// Each intake pushes plaque pH down (how far and how fast depends on the food),
// holds it there while the food lingers (sticky and starchy foods linger), then
// saliva pulls it back up. Overlapping intakes stack (their acid adds up), so
// sipping and grazing keep the mouth acidic for hours. Dry mouth and sleep
// slow the recovery; chewing a meal, cheese, sugar-free gum and a water rinse
// speed it up.
//
// Evidence (see docs/GAME_PLAN.md): critical pH 5.5 enamel, 6.2-6.7 root
// dentin/cementum [V]; "tooth-friendly" = plaque pH stays above 5.7 for 30 min
// (Imfeld telemetry) [V]; Stephan 1944: nadir in ~5-20 min, back in 30-60 min
// [V]; saliva virtually zero in sleep (Schneyer 1956; Dawes 2008) [V]; starch
// snacks drop slower but linger, longer with low saliva (Lingström 1993) [V];
// sugar-free gum speeds recovery (Manning & Edgar 1993) [V], and so does
// cheese (Rugg-Gunn 1975) [U]; caries-active mouths rest lower, dip deeper,
// recover slower [V]; sugar at meals far less cariogenic than between meals
// (Vipeholm, Gustafsson 1954) [U];
// beverage pH: sodas and sports drinks ~3.1, juices ~3.5 (Reddy 2016) [V].
// Per-food depths and linger times are design estimates [D] in that frame.

export const ENAMEL_CRIT = 5.5;
export const ROOT_CRIT = 6.2;
export const SAFE_LINE = 5.7;
const PH_FLOOR = 4.0;
const K0 = 0.08; // per minute recovery rate at normal saliva (nadir 4.7 -> 5.5 in ~25 min)
const SLEEP_SALIVA = 0.08; // saliva flow asleep, relative to awake

// drop: pH units below resting at the nadir (reference mouth); tDrop: minutes to
// nadir; hold: minutes the food lingers near the nadir; sip: default minutes to
// finish (drinks); drinkPH: the drink's own acidity (erosion);
// effect: speeds recovery (k: x saliva clearance for `minutes`; clear: share of
// earlier foods' lingering it washes away).
export const FOODS = {
  meal: { label: 'Meal', drop: 1.1, tDrop: 8, hold: 12, effect: { k: 1.6, minutes: 30 } },
  dessertMeal: { label: 'Meal + dessert', drop: 1.6, tDrop: 8, hold: 14, effect: { k: 1.6, minutes: 30 } },
  cereal: { label: 'Sweet cereal', drop: 1.8, tDrop: 6, hold: 12 },
  fruit: { label: 'Fruit', drop: 1.4, tDrop: 6, hold: 6 },
  driedFruit: { label: 'Dried fruit', drop: 2.0, tDrop: 6, hold: 32 },
  candy: { label: 'Hard candy', drop: 2.2, tDrop: 4, hold: 18 },
  chewy: { label: 'Chewy candy', drop: 2.3, tDrop: 4, hold: 28 },
  chocolate: { label: 'Chocolate', drop: 1.6, tDrop: 5, hold: 10 },
  pastry: { label: 'Pastry', drop: 2.0, tDrop: 6, hold: 16 },
  tasting: { label: 'Tasting bite', drop: 2.0, tDrop: 4, hold: 12 },
  cookies: { label: 'Cookies', drop: 1.9, tDrop: 7, hold: 20 },
  chips: { label: 'Chips / crackers', drop: 1.7, tDrop: 16, hold: 30 },
  bread: { label: 'Bread', drop: 1.2, tDrop: 12, hold: 16 },
  yogurtSweet: { label: 'Sweet yogurt', drop: 1.5, tDrop: 5, hold: 6 },
  soda: { label: 'Soda', drop: 2.3, tDrop: 3, hold: 3, sip: 10, drinkPH: 3.1 },
  dietSoda: { label: 'Diet soda', drop: 0.8, tDrop: 1, hold: 1, sip: 10, drinkPH: 3.2, noSugar: true },
  juice: { label: 'Juice', drop: 2.1, tDrop: 3, hold: 3, sip: 8, drinkPH: 3.5 },
  juiceBottle: { label: 'Juice bottle in bed', drop: 2.1, tDrop: 3, hold: 30, sip: 25, drinkPH: 3.5 },
  milkBottle: { label: 'Milk bottle in bed', drop: 0.9, tDrop: 4, hold: 30, sip: 25 },
  sportsDrink: { label: 'Sports drink', drop: 2.0, tDrop: 3, hold: 3, sip: 20, drinkPH: 3.1 },
  energy: { label: 'Energy drink', drop: 2.3, tDrop: 3, hold: 3, sip: 20, drinkPH: 3.3 },
  sweetCoffee: { label: 'Sweet coffee', drop: 1.7, tDrop: 4, hold: 4, sip: 25 },
  coffee: { label: 'Black coffee', drop: 0.1, tDrop: 3, hold: 0, sip: 20, noSugar: true },
  milk: { label: 'Milk', drop: 0.3, tDrop: 4, hold: 0, sip: 5 },
  wine: { label: 'Wine', drop: 0.6, tDrop: 3, hold: 2, sip: 30, drinkPH: 3.4 },
  nuts: { label: 'Nuts', drop: 0.1, tDrop: 5, hold: 0, noSugar: true },
  veggies: { label: 'Veggies', drop: 0.2, tDrop: 5, hold: 0, noSugar: true },
  cheese: { label: 'Cheese', drop: 0, tDrop: 1, hold: 0, noSugar: true, effect: { k: 2.5, minutes: 20, clear: 0.5 } },
  gum: { label: 'Sugar-free gum', drop: 0, tDrop: 1, hold: 0, noSugar: true, effect: { k: 2.0, minutes: 20, clear: 0.6 } },
  water: { label: 'Water rinse', drop: 0, tDrop: 1, hold: 0, noSugar: true, effect: { k: 1.4, minutes: 10, clear: 0.4 } },
};

// A mouth: resting pH, dip depth and clearance from bacteria load (ms, ~1 typical)
// and plaque (PI 0..1, ~0.4 brushing twice); saliva 1 normal, ~0.35 dry mouth.
// More bacteria and thicker plaque rest lower, dip deeper and clear slower;
// less saliva buffers less [V, magnitudes D].
export function mouthOf({ ms = 1, PI = 0.4, saliva = 1 } = {}) {
  const rest = Math.max(6.1, Math.min(7.05, 6.95 - 0.2 * Math.max(0, ms - 1) - 0.3 * Math.max(0, PI - 0.45) - 0.25 * Math.max(0, 1 - saliva)));
  const dropScale = (0.9 + 0.25 * PI) * (0.93 + 0.07 * Math.min(3, ms));
  const clear = 1.1 - 0.25 * PI;
  return { rest, dropScale, clear, saliva };
}

// intakes: [{ t: minute of day (0..1439), food: id, sip?: minutes, size?: portions }]
// sleep: [startMinute, endMinute] (may wrap past midnight)
// Runs two identical days and keeps the second, so late-night intakes carry into the morning.
export function simulateDay(intakes, mouth = mouthOf(), sleep = [23 * 60, 7 * 60], opts = {}) {
  const nightAwake = opts.nightAwake ?? 0.7; // circadian dip in saliva at night, even awake
  const asleep = m => (sleep[0] < sleep[1] ? m >= sleep[0] && m < sleep[1] : m >= sleep[0] || m < sleep[1]);
  const saliva = new Float64Array(1440), sleeping = new Uint8Array(1440);
  for (let m = 0; m < 1440; m++) {
    sleeping[m] = asleep(m) ? 1 : 0;
    saliva[m] = mouth.saliva * (sleeping[m] ? SLEEP_SALIVA : m < 6 * 60 || m >= 22 * 60 ? nightAwake : 1);
  }
  const H0 = Math.pow(10, -mouth.rest);
  const events = intakes.map(x => {
    const f = FOODS[x.food];
    const sip = x.sip ?? f.sip ?? 0;
    // a drink nursed for an hour is many small sips: a long, slightly shallower plateau
    const drop = f.drop * (1 + 0.15 * ((x.size ?? 1) - 1)) * (1 - 0.15 * Math.min(1, Math.max(0, (sip - 20) / 70)));
    const nadir = Math.max(PH_FLOOR, mouth.rest - drop * mouth.dropScale);
    // food lingers longer when saliva is low (dry mouth, asleep)
    const hold = f.hold / Math.sqrt(Math.max(0.25, saliva[x.t]));
    return { t: x.t, f, sip, flat: f.tDrop + sip + hold, eMax: Math.max(0, Math.pow(10, -nadir) - H0) };
  });
  // helpers (a meal's chewing, water, gum, cheese) speed clearance for a while and
  // wash away part of what earlier foods left behind
  const logBoost = new Float64Array(1440);
  for (const h of events) {
    const fx = h.f.effect;
    if (!fx) continue;
    for (let d = 0; d < fx.minutes; d++) logBoost[(h.t + d) % 1440] += Math.log(fx.k);
    if (!fx.clear) continue;
    for (const e of events) {
      const d = (h.t - e.t + 1440) % 1440, a = Math.max(e.f.tDrop + e.sip, d);
      if (e !== h && a < e.flat) e.flat = a + (e.flat - a) * (1 - fx.clear);
    }
  }
  const decay = new Float64Array(1440), rate = new Map();
  for (let m = 0; m < 1440; m++) {
    let r = rate.get(saliva[m]);
    if (r === undefined) rate.set(saliva[m], r = K0 * Math.pow(Math.max(saliva[m], 0.02), 0.8) * mouth.clear);
    decay[m] = Math.exp(-r * (logBoost[m] ? Math.exp(logBoost[m]) : 1));
  }

  // Two identical days, keep the second. Acid from finished intakes decays at the
  // same rate, so it lives in one pool; intakes still dropping/lingering are tracked apart.
  const starts = [];
  for (let day = 0; day < 2; day++) for (const e of events) if (e.eMax > 0) starts.push({ T: day * 1440 + e.t, e, last: 0 });
  starts.sort((p, q) => p.T - q.T);
  const curve = new Float32Array(1440);
  let pool = 0, next = 0, active = [];
  let acidMinutes = 0, acidDose = 0, rootMinutes = 0, rootDose = 0, safeMinutes = 0, sleepAcid = 0, lowest = 14;
  let run = 0, runStart = 0, longest = 0, longestStart = 0;
  for (let T = 0; T < 2880; T++) {
    const m = T % 1440;
    pool *= decay[m];
    while (next < starts.length && starts[next].T === T) active.push(starts[next++]);
    let E = pool;
    if (active.length) {
      const still = [];
      for (const o of active) {
        const s = T - o.T, e = o.e;
        if (s >= e.flat) { pool += o.last * decay[m]; E += o.last * decay[m]; continue; }
        o.last = s < e.f.tDrop ? e.eMax * (s + 1) / e.f.tDrop : e.eMax;
        E += o.last;
        still.push(o);
      }
      active = still;
    }
    if (T < 1440) continue;
    const pH = Math.max(PH_FLOOR, -Math.log10(H0 + E));
    curve[m] = pH;
    if (pH < lowest) lowest = pH;
    if (pH < SAFE_LINE) safeMinutes++;
    if (pH < ROOT_CRIT) { rootMinutes++; rootDose += ROOT_CRIT - pH; }
    if (pH < ENAMEL_CRIT) {
      acidMinutes++; acidDose += ENAMEL_CRIT - pH;
      if (sleeping[m]) sleepAcid++;
      if (!run) runStart = m;
      if (++run > longest) { longest = run; longestStart = runStart; }
    } else run = 0;
  }
  // erosion: acidic drinks bathe the teeth directly (stronger acid, longer contact = more wear)
  let erosion = 0;
  for (const e of events) {
    if (e.f.drinkPH == null) continue;
    const contact = 2 + 0.6 * e.sip + 3 / Math.sqrt(Math.max(mouth.saliva, 0.1));
    erosion += contact * Math.max(0, 4.5 - e.f.drinkPH);
  }
  return { curve, rest: mouth.rest, acidMinutes, acidDose, rootMinutes, rootDose, safeMinutes, sleepAcid, lowest, longest, longestStart, erosion };
}

// Which intakes cost the most acid time? (for the Acid Clock's "biggest dip" callouts)
export function attribution(intakes, mouth, sleep, opts) {
  const base = simulateDay(intakes, mouth, sleep, opts);
  return intakes.map((x, i) => {
    const without = simulateDay(intakes.filter((_, j) => j !== i), mouth, sleep, opts);
    return { ...x, acidMinutes: base.acidMinutes - without.acidMinutes, acidDose: base.acidDose - without.acidDose };
  });
}

// ---------------------------------------------------------------------------
// A typical day from a life plan (see DEFAULT_PLAN in model.js). Working
// adults get a workday; snacks are spaced through waking hours.

const hm = (h, m = 0) => h * 60 + m;
const ADULT_SLOTS = [3, 8.5, 13.5, 7, 4.25, 10, 14.5, 2]; // hours after waking
const KID_SLOTS = [3, 8.5, 6.5, 11.75, 4, 10, 2, 9.5]; // all before bedtime
const ADULT_SNACKS = ['cookies', 'candy', 'chips', 'pastry', 'chocolate', 'driedFruit', 'cookies', 'chewy'];
const KID_SNACKS = ['juice', 'cookies', 'candy', 'chips', 'fruit', 'chewy', 'juice', 'chocolate'];

export function buildDay(pl, ctx) {
  const { age, job, working, sportActive } = ctx;
  const kid = age < 13, teen = age >= 13 && age < 18, toddler = age < 4;
  const night = working && job === 'nurse';
  const baker = working && job === 'baker';
  const intakes = [];
  const add = (t, food, extra) => intakes.push({ t: ((Math.round(t) % 1440) + 1440) % 1440, food, ...extra });
  if (age < 1) return { intakes: [hm(6, 30), hm(10), hm(13, 30), hm(17), hm(19)].map(t => ({ t, food: 'milk' })), sleep: [hm(19, 30), hm(6, 30)] };
  let sleep, meals;
  if (night) { sleep = [hm(8, 30), hm(15, 30)]; meals = [hm(16), hm(20), hm(1)]; }
  else if (baker) { sleep = [hm(21), hm(4, 30)]; meals = [hm(4, 45), hm(11, 30), hm(17, 30)]; }
  else if (kid) { sleep = toddler ? [hm(19, 45), hm(6, 45)] : [hm(20, 30), hm(7)]; meals = [hm(7, 15), hm(12), hm(18)]; }
  else if (teen) { sleep = [hm(23, 30), hm(7)]; meals = [hm(7, 15), hm(12), hm(18, 30)]; }
  else { sleep = [hm(23), hm(7)]; meals = [hm(7, 30), hm(12, 30), hm(18, 30)]; }
  const wake = sleep[1];
  const gumAfter = pl.gum && !toddler;

  // sweets: separate snacks through the day, or folded into meals as dessert
  const sweets = kid ? pl.kidSugar : pl.sugar;
  const atMeal = meals.map(() => 0);
  for (let i = 0; i < sweets; i++) {
    if (pl.withMeals) { atMeal[i % meals.length]++; continue; }
    const t = wake + 60 * (kid ? KID_SLOTS : ADULT_SLOTS)[i % 8];
    add(t, (kid ? KID_SNACKS : ADULT_SNACKS)[i % 8]);
    if (pl.waterAfterSnacks) add(t + 10, 'water');
    if (gumAfter) add(t + 10, 'gum');
  }
  meals.forEach((t, i) => {
    add(t, atMeal[i] ? 'dessertMeal' : 'meal', atMeal[i] > 1 ? { size: atMeal[i] } : undefined);
    if (gumAfter) add(t + 20, 'gum');
  });
  const sip = pl.sipping ? { sip: 90 } : undefined;
  if (!kid) {
    const sodaSlots = night ? [hm(23), hm(2, 30), hm(18)] : [hm(13), hm(16), hm(20), hm(11)];
    for (let i = 0; i < pl.sodas; i++) {
      const t = pl.withMeals ? meals[i % meals.length] + 5 : sodaSlots[i % sodaSlots.length];
      add(t, 'soda', sip);
      if (pl.waterAfterSnacks && !pl.sipping) add(t + 15, 'water');
    }
    for (let i = 0; i < pl.dietSodas; i++) add(night ? [hm(21), hm(3)][i % 2] : [hm(15), hm(19, 30)][i % 2], 'dietSoda', sip);
    for (let i = 0; i < pl.energyDrinks; i++) add(night ? [hm(23, 30), hm(3)][i % 2] : [hm(8, 30), hm(14, 30)][i % 2], 'energy');
  }
  if (pl.bedtimeSnack && !toddler) add(sleep[0] - 20, 'cookies');
  if (working) {
    if (baker) [hm(5, 30), hm(6, 30), hm(8), hm(9, 30), hm(10, 45)].forEach(t => add(t, 'tasting'));
    else if (night) { add(hm(0, 30), 'energy'); add(hm(4, 30), 'cookies'); }
    else if (job === 'office') add(hm(9), 'sweetCoffee');
    else if (job === 'teacher') add(hm(15, 15), 'pastry'); // the staff-room treats
    else if (job === 'warehouse') { add(hm(10), 'sportsDrink'); add(hm(14), 'sportsDrink'); }
    else if (job === 'driver') add(hm(10, 30), 'soda', { sip: 60 }); // nursed between rides
  }
  if (sportActive) add(hm(17), kid ? 'juice' : 'sportsDrink', { sip: 30 });
  if (toddler && pl.bedtimeBottle) add(sleep[0] - 10, 'juiceBottle');
  intakes.sort((a, b) => a.t - b.t);
  return { intakes, sleep };
}

// Reference day for the risk scale: 3 meals + 3 separate sweet snacks, a typical mouth.
export const REF_MOUTH = mouthOf({ ms: 1, PI: 0.4, saliva: 1 });
const REF = (() => {
  const { intakes, sleep } = buildDay({ sugar: 3, sodas: 0, dietSodas: 0, energyDrinks: 0, kidSugar: 3 }, { age: 30, job: 'none', working: false });
  return simulateDay(intakes, REF_MOUTH, sleep);
})();
export const REF_DOSE = REF.acidDose;
export const REF_ROOT = REF.rootDose;
export const REF_EROSION = 2 * (2 + 0.6 * 10 + 3) * (4.5 - 3.1); // two regular sodas

// Caries pressure from a day's acid dose, relative to the reference day
// (exponent and floor are calibration knobs [D]). Good fluoride use lets enamel
// shrug off part of any excess acid (halves the excess, as for sugar [V]).
export function acidRR(dose, goodFluoride = false) {
  const base = Math.max(0.35, Math.min(5, Math.pow(Math.max(dose, 0.5) / REF_DOSE, 0.75)));
  return goodFluoride && base > 1 ? 1 + (base - 1) * 0.6 : base;
}

// Exposed roots (recession) dissolve at a milder acid, so they feel the whole
// shallow part of every dip (minutes below 6.2), relative to the reference day.
export function rootRR(rootDose, goodFluoride = false) {
  const base = Math.max(0.35, Math.min(5, Math.pow(Math.max(rootDose, 0.5) / REF_ROOT, 0.75)));
  return goodFluoride && base > 1 ? 1 + (base - 1) * 0.6 : base;
}

// Sample days for the report, the art and the review page. Adult schedule:
// asleep 23:00-07:00, meals 07:30 / 12:30 / 18:30.
const MEALS = [hm(7, 30), hm(12, 30), hm(18, 30)];
const meals = (food = 'meal') => MEALS.map(t => ({ t, food }));
const SNACKS3 = [{ t: hm(10), food: 'cookies' }, { t: hm(15, 30), food: 'candy' }, { t: hm(20, 30), food: 'chips' }];
const ADULT_SLEEP = [hm(23), hm(7)];
const sorted = xs => [...xs].sort((a, b) => a.t - b.t);
export const SAMPLE_DAYS = [
  { id: 'snacks', label: 'Three sweet snacks between meals', intakes: sorted([...meals(), ...SNACKS3]) },
  { id: 'withMeals', label: 'The same sweets, as dessert', intakes: sorted(meals('dessertMeal')) },
  { id: 'gum', label: 'Snacks + sugar-free gum after', intakes: sorted([...meals(), ...SNACKS3, ...SNACKS3.map(x => ({ t: x.t + 10, food: 'gum' })), ...MEALS.map(t => ({ t: t + 20, food: 'gum' }))]) },
  { id: 'bedtime', label: 'Snacks + a cookie after brushing', intakes: sorted([...meals(), ...SNACKS3, { t: hm(22, 40), food: 'cookies' }]) },
  { id: 'sodaSip', label: 'Snacks + 2 sodas sipped all afternoon', intakes: sorted([...meals(), ...SNACKS3, { t: hm(13), food: 'soda', sip: 90 }, { t: hm(16), food: 'soda', sip: 90 }]) },
  { id: 'better', label: 'Same food: sweets as dessert, sodas with meals', intakes: sorted([...meals('dessertMeal'), { t: hm(12, 35), food: 'soda' }, { t: hm(18, 35), food: 'soda' }]) },
  { id: 'sodaMeals', label: 'Snacks + 2 sodas finished at meals', intakes: sorted([...meals(), ...SNACKS3, { t: hm(12, 35), food: 'soda' }, { t: hm(18, 35), food: 'soda' }]) },
  { id: 'diet', label: 'Snacks + 2 diet sodas', intakes: sorted([...meals(), ...SNACKS3, { t: hm(13), food: 'dietSoda' }, { t: hm(16), food: 'dietSoda' }]) },
  { id: 'dry', label: 'Three snacks, dry mouth (meds)', intakes: sorted([...meals(), ...SNACKS3]), saliva: 0.35 },
  { id: 'dryCandy', label: 'Dry mouth, sucking candies for relief', intakes: sorted([...meals(), { t: hm(10), food: 'candy' }, { t: hm(11, 30), food: 'candy' }, { t: hm(14), food: 'candy' }, { t: hm(16), food: 'candy' }, { t: hm(20, 30), food: 'candy' }]), saliva: 0.35 },
  { id: 'baker', label: 'Baker: tastings from 5 am', ...buildDay({ sugar: 3, sodas: 0, dietSodas: 0, energyDrinks: 0 }, { age: 35, job: 'baker', working: true }) },
  { id: 'nurse', label: 'Night nurse: snacks on the night shift', ...buildDay({ sugar: 3, sodas: 1, dietSodas: 0, energyDrinks: 0 }, { age: 35, job: 'nurse', working: true }) },
  { id: 'toddler', label: 'Toddler: juice, cookies, candy', ...buildDay({ kidSugar: 3 }, { age: 2 }) },
  { id: 'bottle', label: 'Toddler + juice bottle in bed', ...buildDay({ kidSugar: 3, bedtimeBottle: true }, { age: 2 }) },
].map(d => ({ sleep: ADULT_SLEEP, saliva: 1, ...d }));

export function runSample(d, mouth = {}) {
  return simulateDay(d.intakes, mouthOf({ ...mouth, saliva: d.saliva }), d.sleep);
}
