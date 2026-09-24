// The hidden engine: one life, month by month, from birth to 80.
//
// Players never see these numbers directly. They see a person: smiling or
// hiding a smile, sleeping or lying awake with a toothache, a dream board that
// fills up or a stack of bills. This file decides which.
//
// Pure & deterministic: simulateLife(plan, seed) always returns the same life.

import { P, JOBS } from './params.js';
import { Streams, Clock } from './rng.js';

export const DEFAULT_PLAN = {
  name: 'Default',
  // --- born into
  birth: 'vaginal', // 'vaginal' | 'csection'
  parentsOral: 'average', // 'healthy' | 'average' | 'poor' (untreated decay -> more cariogenic bacteria)
  parentsAnxious: false, // parents' own dental fear rubs off
  fluoridatedWater: true,
  kidInsurance: 'employer', // 'employer' | 'medicaidChild' | 'none'
  // --- parents' choices (0-12)
  firstVisit: 3, // age in years, or 'pain'
  kidVisits: 'every6', // 'every6' | 'yearly' | 'pain'
  kidDentist: 'pediatric', // 'pediatric' | 'general'
  bedtimeBottle: false,
  kidBrushing: 'twice', // 'twice' | 'once' | 'rarely'
  kidSugar: 3, // sugar hits per day
  salivaSharing: true,
  sealants: true,
  braces: false,
  // --- your choices (13+). Change any of these later with `phases`.
  sugar: 3, // sugar hits per day from snacks, sweets, sweet coffee
  sodas: 0, // sugary drinks per day
  sipping: false, // nursing a drink for hours: each counts as ~3 hits
  dietSodas: 0, // no sugar, still acidic
  energyDrinks: 0,
  brushing: 'twice', // 'twice' | 'once' | 'rarely'
  fluorideToothpaste: true,
  interdental: 'sometimes', // 'daily' | 'sometimes' | 'never'
  electricBrush: false,
  visits: 'yearly', // 'every6' | 'yearly' | 'every2y' | 'pain' | 'never'
  job: 'office',
  insurance: 'job', // 'job' (whatever the job offers) | 'employer' | 'none' | 'medicaidAdult'
  retireInsurance: 'medicare', // 'medicare' | 'advantage' | 'employer'
  sport: 'none',
  sportFrom: 8,
  sportUntil: 22,
  guard: 'none', // 'none' | 'boil' | 'custom'
  smoking: 'never', // 'never' | 'smoker' | 'vaper'
  nightGuard: 'auto', // 'auto' (accept if recommended) | true | false
  knowsRisk: false, // took a risk assessment / microbiome test
  coping: 'none', // 'none' | 'tell' | 'sedation' | 'cbt'
  treatment: 'follow', // 'follow' | 'cheapest' | 'defer'
  bookNext: false, // books the next visit before leaving
  firstAid: false, // knows what to do with a knocked-out tooth
  iceChewing: false,
  pregnancies: [],
  phases: [], // [{ age: 34, set: { visits: 'pain' } }]
};

const CADENCE = { every6: 6, yearly: 12, every2y: 24, pain: Infinity, never: Infinity };
const MS_PARENT = { healthy: 0.7, average: 1.0, poor: 1.6 };

function planAt(plan, age) {
  if (!plan.phases.length) return plan;
  const e = { ...plan };
  for (const ph of plan.phases) if (age >= ph.age) Object.assign(e, ph.set);
  return e;
}

function makeTeeth() {
  const teeth = [];
  const prim = [
    ...Array(8).fill(['incisor', 0.8, 7.0]),
    ...Array(4).fill(['canine', 1.5, 10.5]),
    ...Array(4).fill(['molar', 1.2, 10.5]),
    ...Array(4).fill(['molar', 2.2, 11.5]),
  ];
  prim.forEach(([type, e, s], i) => teeth.push(tooth(`p${i}`, 'primary', type, e + (i % 4) * 0.1, s + (i % 4) * 0.3)));
  const perm = [
    ...Array(8).fill(['incisor', 7.0, null]),
    ...Array(4).fill(['canine', 11.0, null]),
    ...Array(8).fill(['premolar', 11.0, null]),
    ...Array(4).fill(['molar', 6.0, 'm1']),
    ...Array(4).fill(['molar', 12.0, 'm2']),
  ];
  perm.forEach(([type, e, grp], i) => teeth.push(tooth(`t${i}`, 'permanent', type, e + (i % 4) * 0.15, Infinity, grp)));
  return teeth;
}

function tooth(id, kind, type, erupt, shed, grp = null) {
  return {
    id, kind, type, erupt, shed, grp,
    present: false, gone: false,
    stage: 0, // 0 sound, 1 enamel, 2 dentin, 3 deep, 4 pulp, 5 abscess
    resto: 'none', // none | fillS | fillL | crown | rct | missing | implant | bridge | partial | denture
    needs: null, // a failure waiting for treatment: 'crown' | 'rct' | 'retreat' | 'extract' | 'recrown' | 'reimplant'
    sealed: false,
    varnishUntil: -1,
    anterior: type === 'incisor' || type === 'canine',
    posterior: type === 'molar' || type === 'premolar',
    clocks: null,
  };
}

function clockFor(S, t, name) {
  if (!t.clocks) t.clocks = {};
  return t.clocks[name] || (t.clocks[name] = new Clock(S, `${t.id}:${name}`));
}

// Out-of-pocket for one procedure under an insurance plan, tracking the annual max.
function charge(life, fee, cat, payer) {
  const ins = P.insurance[life.insNow] || P.insurance.none;
  if (ins.max > 0 && cat !== 'none') fee *= 1 - P.networkDiscount; // in-network negotiated fees
  let cover = ins[cat] ?? 0;
  if (cat === 'emergency' && ins.emergency) cover = ins.emergency;
  if (cat === 'extraction') cover = ins.emergency ?? ins.basic;
  let insPays = 0;
  if (cover > 0) {
    let allowed = fee;
    if (life.dedLeft > 0 && cat !== 'prev') {
      const d = Math.min(life.dedLeft, allowed);
      life.dedLeft -= d;
      allowed -= d;
    }
    insPays = Math.min(allowed * cover, life.maxLeft);
    life.maxLeft -= insPays;
  }
  const oop = fee - insPays;
  life.billed += fee;
  life.insPaid += insPays;
  if (payer === 'parents') life.parentsPaid += oop;
  else {
    life.oop += oop;
    life.wallet -= oop;
    if (life.age < 65) life.oopBefore65.push([life.age, oop]);
  }
  return oop;
}

export function simulateLife(planIn, seed = 1, opts = {}) {
  const plan = { ...DEFAULT_PLAN, ...planIn, phases: planIn.phases || [] };
  const S = new Streams(seed);
  const dt = 1 / 12;
  const months = P.lifespan * 12;
  const log = opts.log !== false;

  // ---- hidden traits, fixed at birth
  const enamel = Math.exp((S.u('trait:enamel') - 0.5) * 0.6);
  const perioCls = P.perioClass[S.pick('trait:perio', P.perioClass.map(c => c[1]))];
  const bruxBase = P.bruxBase[S.pick('trait:brux', P.bruxBase.map(b => b[1]))][0];
  const temperament = S.u('trait:temperament');
  const gumFactor = Math.exp((S.u('trait:gums') - 0.5) * 1.0);
  const dryMouthLater = S.u('trait:drymouth') < 0.35;
  const colonizeAge = Math.max(0.5,
    1.6 + (S.u('trait:colonize') - 0.5) * 1.2
    - (plan.birth === 'csection' ? 0.98 : 0) // Li 2005: 11.7 months earlier
    - (plan.parentsOral === 'poor' ? 0.4 : 0)
    - (plan.salivaSharing ? 0.2 : 0));

  const teeth = makeTeeth();
  const perm = teeth.filter(t => t.kind === 'permanent');

  const life = {
    seed, plan: plan.name,
    age: 0,
    traits: { perio: perioCls[0], bruxism: bruxBase, enamel: +enamel.toFixed(2), colonizeAge: +colonizeAge.toFixed(2) },
    wallet: 0, walletNoDental: 0, billed: 0, insPaid: 0, oop: 0, parentsPaid: 0, oopBefore65: [],
    insNow: 'none', dedLeft: 0, maxLeft: 0,
    anxiety: Math.min(0.9, 0.05 + (plan.parentsAnxious ? 0.2 : 0) + 0.35 * temperament * temperament),
    anxietyPeak: 0,
    ms: 0.25,
    perio: { PI: 0.4, calc: 0, G: 0.2, CAL: 0, srp: false, maint: false, boost: 0 },
    diabetic: false,
    counts: { visits: 0, skipped: 0, emergencies: 0, er: 0, cleanings: 0, sealants: 0, fillings: 0, crowns: 0, rct: 0, extractions: 0, implants: 0, bridges: 0, partials: 0, dentures: 0, srp: 0, nightGuard: 0, trauma: 0, cracks: 0, negVisits: 0, painEpisodes: 0, wisdom: 0, ga: 0 },
    painDays: 0, missedWork: 0, sleepless: 0, selfConsciousMonths: 0, gumDiseaseMonths: 0,
    events: [],
    yearly: [],
    firstVisitDone: false,
    nextVisit: Infinity,
    lastVisitAge: -99,
    hasNightGuard: false,
    hasCustomGuard: false,
    cbtDone: false,
    lostBy: { caries: 0, perio: 0, crack: 0, trauma: 0 },
  };
  life.guidance = { bedtimeBottle: plan.bedtimeBottle, kidBrushing: plan.kidBrushing, kidSugar: plan.kidSugar };
  const ev = (type, extra = {}) => { if (log) life.events.push({ age: +life.age.toFixed(2), type, ...extra }); };

  const clocks = {
    diabetes: new Clock(S, 'diabetes'),
    trauma: new Clock(S, 'trauma'),
    perioAbscess: new Clock(S, 'perioAbscess'),
    tmd: new Clock(S, 'tmd'),
    wisdom: new Clock(S, 'wisdom'),
    prosthesis: new Clock(S, 'prosthesis'),
  };
  const wisdomTrouble = S.u('trait:wisdom') < 0.6;
  let wisdomDone = false;
  let lastYearIns = -1;

  for (let m = 0; m < months; m++) {
    const age = m / 12;
    life.age = age;
    const pl0 = planAt(plan, age);
    const pl = age < 13 ? { ...pl0, ...life.guidance } : pl0;
    const kid = age < 13;
    const adult = age >= 18;
    const working = age >= 22 && age < 65;
    const job = JOBS[pl.job] || JOBS.office;

    // ---- insurance & money (per plan-year)
    const yr = Math.floor(age);
    if (yr !== lastYearIns) {
      lastYearIns = yr;
      let ins;
      if (age < 18) ins = pl.kidInsurance;
      else if (age < 22) ins = pl.kidInsurance === 'employer' ? 'employer' : 'none';
      else if (age < 65) ins = pl.insurance === 'job' ? job.insurance : pl.insurance;
      else ins = pl.retireInsurance;
      life.insNow = ins;
      const I = P.insurance[ins] || P.insurance.none;
      life.dedLeft = I.ded;
      life.maxLeft = I.max;
    }
    const monthlyGrowth = Math.pow(1 + P.returnReal, dt);
    life.wallet *= life.wallet >= 0 ? monthlyGrowth : Math.pow(1 + P.debtRate, dt);
    life.walletNoDental *= monthlyGrowth;
    if (working) {
      life.wallet += job.savings / 12;
      life.walletNoDental += job.savings / 12;
    }

    // ---- exposures
    const sipMult = pl.sipping ? 3 : 1;
    let sugarHits, brushing;
    if (kid) {
      sugarHits = pl.kidSugar + (pl.bedtimeBottle && age < 4 ? 2 : 0);
      brushing = pl.kidBrushing;
    } else {
      sugarHits = pl.sugar + pl.sodas * sipMult + pl.energyDrinks + (working ? job.sugar + job.energy : 0);
      brushing = pl.brushing;
    }
    const sportActive = pl.sport !== 'none' && age >= pl.sportFrom && age < pl.sportUntil;
    if (sportActive && pl.sport === 'running') sugarHits += 1; // sports drinks & gels
    const acidic = !kid && (pl.dietSodas + pl.sodas + pl.energyDrinks >= 2);
    const goodFluoride = brushing === 'twice' && pl.fluorideToothpaste;
    const smoker = !kid && pl.smoking === 'smoker';
    const vaper = !kid && pl.smoking === 'vaper';
    const dryMouth = dryMouthLater && age >= 60;
    const bracesOn = pl.braces && age >= 12 && age < 14.5;

    // ---- microbiome: cariogenic load drifts toward what the diet feeds it
    if (age >= colonizeAge) {
      if (life.ms < 0.3) life.ms = life.ms0 = MS_PARENT[pl.parentsOral] * (pl.salivaSharing ? 1.1 : 1);
      let target = 0.6 + 0.12 * sugarHits + 0.3 * (life.ms0 - 1); // early colonizers persist
      if (pl.knowsRisk && target > 1.2) target *= 0.85; // targeted prevention after testing
      life.ms += (target - life.ms) * (dt / 4);
    }

    // ---- caries risk multiplier (mouth level)
    let rr = P.sugarRR(sugarHits, goodFluoride) * P.msRR(life.ms) * enamel;
    if (pl.fluorideToothpaste) rr *= P.rr.fluorideToothpaste;
    if (pl.fluoridatedWater) rr *= P.rr.waterFluoride;
    if (brushing === 'once') rr *= P.rr.brushOnce;
    else if (brushing === 'rarely') rr *= P.rr.brushRarely * 1.15;
    if (dryMouth) rr *= P.rr.dryMouth;
    if (vaper) rr *= P.rr.vaping;
    if (bracesOn) rr *= P.rr.braces;
    if (acidic) rr *= P.rr.erosion;
    if (plan.birth === 'csection' && age < 6) rr *= P.rr.cSection;
    if (pl.salivaSharing && age < 3) rr *= P.rr.salivaSharing;
    const kidHighRisk = pl.knowsRisk && rr > 1.6;

    // ---- bruxism
    let brux = bruxBase + (working ? job.brux : 0) + (pl.energyDrinks > 0 ? 0.05 : 0) + (smoker ? 0.05 : 0) + (age > 45 ? 0.05 : 0);
    brux = Math.min(1, brux);
    const guardOn = life.hasNightGuard ? P.nightGuardProtection * P.nightGuardAdherence : 0;
    const bruxEff = brux * (1 - guardOn);

    // ---- periodontal
    const pr = life.perio;
    let PI = P.plaque[brushing] - P.interdental[kid ? 'never' : pl.interdental] - (pl.electricBrush ? P.electricBrush : 0);
    if (kid && brushing === 'twice') PI -= 0.03;
    pr.PI = Math.max(0.1, PI);
    pr.calc = Math.min(1, pr.calc + P.calculusPerMonth * pr.PI);
    const pregnant = pl.pregnancies.some(a => age >= a && age < a + 0.75);
    let G = 0.05 + 0.75 * pr.PI + 0.2 * pr.calc + (pregnant ? 0.2 : 0) + (life.diabetic ? 0.1 : 0) + (smoker ? 0.05 : 0) + (bracesOn ? 0.1 : 0);
    if (pr.boost > 0) { G *= pr.maint ? 0.5 : 0.7; pr.boost--; }
    pr.G = Math.max(0, Math.min(1, G));
    if (age >= 15) {
      const ageF = age < 40 ? 1 : age < 60 ? 1.3 : 1.5;
      const rate = perioCls[2] * gumFactor * Math.pow(Math.max(0, pr.G - 0.2) / 0.75, 1.7) * (smoker ? P.smokingPerio : vaper ? 1.3 : 1)
        * (life.diabetic ? P.diabetesPerio : 1) * (job.shift && working ? 1.1 : 1) * ageF;
      pr.CAL += (rate + (age >= 20 ? 0.032 : 0) + (smoker ? 0.03 : vaper ? 0.012 : 0)) * dt;
    }
    // smokers bleed less, so the warning sign is quieter than the disease
    pr.visibleG = smoker ? Math.max(0, pr.G - 0.15) : pr.G;
    if (pr.G > 0.5) life.gumDiseaseMonths++;

    // ---- diabetes (bidirectional with gums)
    if (!life.diabetic && age >= 25) {
      const h = (age < 45 ? 0.003 : age < 60 ? 0.009 : 0.012) * (sugarHits >= 6 ? 1.5 : 1) * (pr.CAL >= 5 ? 1.2 : 1);
      if (clocks.diabetes.tick(h, dt)) { life.diabetic = true; ev('diabetes'); }
    }

    // ---- teeth: eruption, shedding, decay, failures, cracks
    let severePain = false, painWhy = null;
    let visibleIssue = false;
    for (const t of teeth) {
      if (t.gone) continue;
      if (!t.present) {
        if (age >= t.erupt) t.present = true;
        else continue;
      }
      if (t.kind === 'primary' && age >= t.shed) { t.present = false; t.gone = true; continue; }
      const missing = t.resto === 'missing';
      if (missing || t.resto === 'implant' || t.resto === 'bridge' || t.resto === 'partial' || t.resto === 'denture' || t.resto === 'arch') {
        // single implants & bridges can fail; partials/dentures/arches are maintained at the mouth level
        if (t.resto === 'implant' || t.resto === 'bridge') {
          if (clockFor(S, t, 'fail').tick(P.fail[t.resto], dt)) {
            t.needs = t.resto === 'implant' ? 'reimplant' : 'replace';
            ev('replacementFails', { tooth: t.id, what: t.resto });
          }
          if (t.resto === 'implant' && clockFor(S, t, 'periImplant').tick(P.periImplantitis, dt)) t.needs = t.needs || 'periImplant';
        }
        if (t.anterior && missing && t.kind === 'permanent') visibleIssue = true;
        continue;
      }

      // decay
      const isPrim = t.kind === 'primary';
      const baseInit = isPrim ? P.cariesInit.primary[t.type] : P.cariesInit.permanent[t.type] * P.cariesAge(age);
      let trr = rr;
      if (isPrim && pl.bedtimeBottle && age < 4) trr *= P.rr.bedtimeBottle;
      if (t.sealed) trr *= P.rr.sealant;
      const varnish = m <= t.varnishUntil;
      if (varnish) trr *= isPrim ? P.rr.varnishPrimary : P.rr.varnishPermanent;
      if (life.ms < 0.3) trr *= 0.2; // not yet colonized
      if (t.resto === 'fillS' || t.resto === 'fillL') trr *= 1.3; // margins
      const progF = (isPrim ? P.primaryProgFactor : age >= 12 && age < 18 ? P.teenProgFactor : 1) * Math.pow(trr, P.progRiskExponent);

      if (t.stage === 0 && t.resto !== 'crown' && t.resto !== 'rct') {
        if (clockFor(S, t, 'init').tick(baseInit * trr, dt)) t.stage = 1;
      } else if (t.stage === 1) {
        const arrest = P.prog.arrest * (varnish ? 2.5 : 1) * (goodFluoride ? 1.3 : 0.7) / Math.max(0.5, Math.min(2.5, trr));
        if (clockFor(S, t, 'arrest').tick(arrest, dt)) t.stage = 0;
        else if (clockFor(S, t, 'prog').tick(P.prog.enamelToDentin * progF, dt)) t.stage = 2;
      } else if (t.stage === 2) {
        if (clockFor(S, t, 'prog').tick(P.prog.dentinToDeep * progF, dt)) t.stage = 3;
      } else if (t.stage === 3) {
        if (clockFor(S, t, 'prog').tick(P.prog.deepToPulp * progF, dt)) t.stage = 4;
      } else if (t.stage === 4) {
        if (clockFor(S, t, 'prog').tick(P.prog.pulpToAbscess * (isPrim ? 1.5 : 1), dt)) t.stage = 5;
      }

      // restorations age and fail (the restorative cycle)
      if (t.resto !== 'none' && !t.needs) {
        let fr = P.fail[t.resto] || 0;
        fr *= Math.pow(Math.max(1, trr), 0.5) * (t.resto === 'crown' || t.resto === 'fillL' ? 1 + bruxEff : 1);
        if (clockFor(S, t, 'fail').tick(fr, dt)) {
          const u = S.u(`${t.id}:failKind`);
          if (t.resto === 'fillS') { t.resto = 'none'; t.stage = u < 0.6 ? 2 : 3; }
          else if (t.resto === 'fillL') {
            if (u < 0.5) t.needs = 'crown';
            else if (u < 0.8) { t.resto = 'none'; t.stage = 3; }
            else { t.resto = 'none'; t.stage = 4; }
          } else if (t.resto === 'crown') t.needs = u < 0.6 ? 'recrown' : 'rct';
          else if (t.resto === 'rct') t.needs = u < 0.5 ? 'retreat' : 'extract';
          if (t.needs && S.u(`${t.id}:failPain`) < 0.4) { severePain = true; painWhy = 'broken tooth'; }
        }
      }

      // cracks (grinding, big fillings, ice)
      if (t.posterior && !isPrim && t.resto !== 'crown') {
        const rf = { none: 1, fillS: 1.5, fillL: 4, rct: 5 }[t.resto] ?? 1;
        const h = P.crackBase * (1 + 5 * bruxEff) * rf * (pl.iceChewing ? 2 : 1) * (age >= 40 ? 1.6 : 1);
        if (clockFor(S, t, 'crack').tick(h, dt)) {
          const u = S.u(`${t.id}:crackKind`);
          life.counts.cracks++;
          t.needs = u < 0.55 ? 'crown' : u < 0.85 ? 'rct' : 'extract';
          t.crackCause = true;
          severePain = true; painWhy = 'cracked tooth';
          ev('crack', { tooth: t.id, severity: t.needs });
        }
      }

      // gum disease loosens teeth
      if (!isPrim && pr.CAL > 2) {
        if (t.site == null) t.site = Math.exp((S.u(`${t.id}:site`) - 0.5) * 2.4);
        const h = P.perioToothLoss(pr.CAL) * t.site * (pr.maint ? P.maintainedFactor : 1) * (t.type === 'molar' ? 1.5 : t.type === 'incisor' ? 0.8 : 1);
        if (clockFor(S, t, 'perio').tick(h, dt)) {
          t.needs = 'extract'; t.perioLoose = true;
          if (S.u(`${t.id}:perioPain`) < 0.5) { severePain = true; painWhy = 'loose tooth'; }
        }
      }

      // symptoms
      const sym = P.symptoms[t.stage];
      if (sym) {
        const rate = sym.rate * (isPrim ? P.primaryPainFactor : 1);
        if (clockFor(S, t, 'pain').tick(rate, dt)) {
          life.painDays += sym.days;
          life.counts.painEpisodes++;
          if (sym.severe) { severePain = true; painWhy = t.stage === 5 ? 'abscess' : 'toothache'; life.sleepless += 3; }
        }
      }
      if (t.anterior && !isPrim && (t.stage >= 3 || t.needs)) visibleIssue = true;
    }
    if (pr.CAL >= 6) visibleIssue = true; // gaps, recession, bad breath
    {
      const kinds = new Set(perm.filter(t => t.present).map(t => t.resto));
      const upkeep = kinds.has('denture') ? [P.fail.denture, P.fee.denture * 2, 'dentures'] : kinds.has('arch') ? [0.03, 8000, 'arch'] : kinds.has('partial') ? [P.fail.partial, P.fee.partial, 'partial'] : null;
      if (upkeep && clocks.prosthesis.tick(upkeep[0], dt)) {
        charge(life, upkeep[1], 'major', adult ? 'self' : 'parents');
        ev('prosthesisRedo', { what: upkeep[2] });
      }
    }
    if (!kid && visibleIssue) life.selfConsciousMonths++;

    // gum abscess / jaw pain
    if (pr.CAL >= 6 && clocks.perioAbscess.tick(0.3, dt)) { severePain = true; painWhy = painWhy || 'gum abscess'; life.painDays += 5; }
    if (clocks.tmd.tick(12 * Math.max(0, bruxEff - 0.15), dt)) life.painDays += 2;

    // ---- trauma (falls, sports, work)
    {
      let h = age >= 1 && age < 4 ? P.trauma.toddler : age >= 6 && age < 18 ? P.trauma.kid : age >= 18 ? P.trauma.adult : 0;
      if (sportActive) h += (P.sports[pl.sport] || 0) * (P.guardRR[pl.guard] ?? 1);
      if (working && job.trauma) h += job.trauma;
      if (clocks.trauma.tick(h, dt)) trauma(life, teeth, S, pl, ev);
    }

    // ---- wisdom teeth
    if (!wisdomDone && wisdomTrouble && age >= 17 && age < 26 && clocks.wisdom.tick(0.2, dt)) {
      wisdomDone = true;
      life.counts.wisdom++;
      charge(life, P.fee.wisdom, 'basic', age < 18 ? 'parents' : 'self');
      life.painDays += 4; if (working) life.missedWork += 2;
      experience(life, S, pl, 'extraction', age);
      ev('wisdomTeeth');
    }

    // ---- braces
    if (pl.braces && Math.abs(age - 12) < dt / 2) {
      const insOrtho = life.insNow === 'employer' ? Math.min(1500, P.fee.braces * 0.5) : 0;
      life.billed += P.fee.braces; life.insPaid += insOrtho; life.parentsPaid += P.fee.braces - insOrtho;
      ev('braces');
    }

    // ---- scheduled visits
    const cadence = kid || age < 18 ? CADENCE[pl.kidVisits] : CADENCE[pl.visits];
    const perioCadence = pr.maint ? 4 : Infinity;
    const eff = Math.min(cadence, perioCadence);
    if (!life.firstVisitDone && typeof pl.firstVisit === 'number' && age >= pl.firstVisit) life.nextVisit = Math.min(life.nextVisit, m);
    if (life.firstVisitDone && life.nextVisit === Infinity && eff < Infinity) life.nextVisit = m + eff;
    let visitedThisMonth = false;
    if (m >= life.nextVisit) {
      if (!life.firstVisitDone && pl.firstVisit === 'pain') life.nextVisit = Infinity;
      else {
        const skip = skipChance(life, pl, age, job, working);
        if (S.u('visit:skip') < skip) {
          life.counts.skipped++;
          ev('skippedVisit');
          life.nextVisit = eff < Infinity ? m + Math.max(3, Math.round(eff / 2)) : Infinity;
        } else {
          visit(life, teeth, S, pl, age, m, 'routine', { rr, kidHighRisk, bruxEff, sportActive, ev });
          visitedThisMonth = true;
          life.nextVisit = eff < Infinity ? m + eff : Infinity;
        }
      }
    }

    // ---- pain drives care (or doesn't)
    if (severePain && !visitedThisMonth) {
      const regular = CADENCE[age < 18 ? pl.kidVisits : pl.visits] <= 24;
      let go = life.anxiety > 0.7 ? (painWhy === 'abscess' ? 0.65 : 0.3) : regular ? 0.85 : 0.6;
      if (!adult) go = Math.max(go, 0.7);
      const broke = adult && life.insNow === 'none' && life.wallet < 500;
      if (broke) go *= 0.7;
      if (S.u('pain:go') < go) {
        if (broke && S.u('pain:er') < 0.3) {
          // the ER can calm the pain but can't fix the tooth
          life.counts.er++;
          charge(life, P.fee.er, 'emergency', adult ? 'self' : 'parents');
          if (working) life.missedWork += 1;
          ev('er', { why: painWhy });
        } else {
          visit(life, teeth, S, pl, age, m, 'emergency', { rr, kidHighRisk, bruxEff, sportActive, ev, painWhy });
        }
      } else {
        ev('enduredPain', { why: painWhy });
        life.sleepless += 2;
        if (working) life.missedWork += 0.5;
      }
    }

    // anxiety slowly fades with time if nothing bad happens
    life.anxiety = Math.max(0, life.anxiety - 0.0004);
    life.anxietyPeak = Math.max(life.anxietyPeak, life.anxiety);

    // yearly snapshot
    if (m % 12 === 11) {
      const natural = perm.filter(t => t.present && !['missing', 'implant', 'bridge', 'partial', 'denture', 'arch'].includes(t.resto)).length;
      const erupted = perm.filter(t => t.present).length;
      life.yearly.push({
        age: yr, natural, missing: erupted - natural,
        dmft: perm.filter(t => t.present && (t.resto !== 'none' || t.stage >= 2)).length,
        primDmf: teeth.filter(t => t.kind === 'primary' && t.present && (t.resto !== 'none' || t.stage >= 2)).length + teeth.filter(t => t.kind === 'primary' && !t.present && !t.gone && t.resto === 'missing').length,
        untreated: perm.some(t => t.present && t.resto === 'none' && t.stage >= 3),
        untreated2: perm.some(t => t.present && t.resto === 'none' && t.stage >= 2),
        cal: +pr.CAL.toFixed(2), gums: +pr.G.toFixed(2),
        anxiety: +life.anxiety.toFixed(2), oop: Math.round(life.oop), wallet: Math.round(life.wallet),
        painDays: Math.round(life.painDays), selfConscious: +(life.selfConsciousMonths / 12).toFixed(1),
        walletNoDental: Math.round(life.walletNoDental),
      });
    }
  }

  return summarize(life, perm);
}

function skipChance(life, pl, age, job, working) {
  if (age < 18) return Math.min(0.9, 0.05 + 0.3 * life.anxiety + (pl.parentsAnxious ? 0.1 : 0) + (pl.kidInsurance === 'none' ? 0.15 : 0));
  let p = 0.06 + 0.8 * life.anxiety * life.anxiety;
  if (life.insNow === 'none') p += 0.12;
  if (working && job.shift) p += 0.06;
  if (age - life.lastVisitAge > 3) p += 0.10; // "it's been so long, they'll judge me"
  if (pl.bookNext) p -= 0.04;
  if (life.anxiety > 0.7) p = Math.max(p, 0.9);
  return Math.max(0.02, Math.min(0.97, p));
}

function experience(life, S, pl, kind, age) {
  let p = P.negExperience[kind] ?? 0.05;
  if (age < 12) p *= 1.5;
  if (age < 13 && pl.kidDentist === 'pediatric') p *= 0.5;
  p *= 1 + life.anxiety;
  if (pl.coping === 'tell') p *= 0.8;
  if (pl.coping === 'sedation' && kind !== 'preventive') p *= 0.6;
  if (life.cbtDone) p *= 0.7;
  if (S.u('visit:experience') < p) {
    life.anxiety = Math.min(1, life.anxiety + (age < 13 ? 0.25 : 0.15) * (1 - life.anxiety * 0.5));
    life.counts.negVisits++;
    return false;
  }
  life.anxiety = Math.max(0, life.anxiety - (age < 13 ? 0.03 : 0.015));
  return true;
}

function trauma(life, teeth, S, pl, ev) {
  life.counts.trauma++;
  const kidTeeth = life.age < 7;
  const pool = teeth.filter(t => t.present && t.type === 'incisor' && (kidTeeth ? t.kind === 'primary' : t.kind === 'permanent') && !['missing', 'implant', 'bridge', 'partial', 'denture', 'arch'].includes(t.resto));
  if (!pool.length) return;
  const t = pool[Math.floor(S.u('trauma:which') * pool.length)];
  const payer = life.age < 18 ? 'parents' : 'self';
  const u = S.u('trauma:kind');
  if (kidTeeth) {
    if (u < 0.2) { t.resto = 'missing'; charge(life, P.fee.extraction, 'basic', payer); }
    ev('fall', { tooth: t.id });
    return;
  }
  life.painDays += 3;
  if (u < 0.55) { t.resto = 'fillS'; charge(life, P.fee.bonding, 'basic', payer); ev('trauma', { what: 'chipped tooth' }); }
  else if (u < 0.85) { t.resto = 'rct'; charge(life, P.fee.rctAnterior, 'basic', payer); charge(life, P.fee.crown, 'major', payer); life.counts.rct++; life.counts.crowns++; ev('trauma', { what: 'broken tooth' }); }
  else {
    const kept = pl.firstAid && S.u('trauma:replant') < P.avulsionKeptWithFirstAid;
    if (kept) { t.resto = 'rct'; charge(life, 1800, 'basic', payer); life.counts.rct++; ev('trauma', { what: 'knocked out, saved in milk' }); }
    else {
      t.resto = 'missing'; life.lostBy.trauma++;
      if (life.age < 18) charge(life, P.fee.flipper, 'major', payer);
      else { charge(life, P.fee.implant, 'major', payer); t.resto = 'implant'; life.counts.implants++; }
      ev('trauma', { what: 'knocked out' });
      if (life.age < 18) t.implantAt = 18;
    }
  }
}

function rctFee(t) { return t.type === 'molar' ? P.fee.rctMolar : t.type === 'premolar' ? P.fee.rctPremolar : P.fee.rctAnterior; }

function visit(life, teeth, S, pl, age, m, kind, ctx) {
  const payer = age < 18 ? 'parents' : 'self';
  const adult = age >= 18;
  const c = life.counts;
  c.visits++;
  if (kind === 'emergency') c.emergencies++;
  const firstEver = !life.firstVisitDone;
  life.firstVisitDone = true;
  life.lastVisitAge = age;
  if (firstEver) ctx.ev('firstVisit', { why: kind });
  if (firstEver && age < 2 && kind === 'routine' && life.guidance) {
    // anticipatory guidance: a chance the family drops one risky habit
    const g = life.guidance;
    if (g.bedtimeBottle && S.u('guidance:bottle') < 0.4) { g.bedtimeBottle = false; ctx.ev('advice', { what: 'water at bedtime' }); }
    if (g.kidBrushing !== 'twice' && S.u('guidance:brush') < 0.35) { g.kidBrushing = 'twice'; ctx.ev('advice', { what: 'brush twice with fluoride' }); }
    if (g.kidSugar > 3 && S.u('guidance:sugar') < 0.3) { g.kidSugar -= 1; ctx.ev('advice', { what: 'fewer sweet snacks' }); }
  }
  let worst = 'preventive';
  const bump = k => {
    const order = ['preventive', 'filling', 'implant', 'rct', 'extraction', 'emergency', 'ga'];
    if (order.indexOf(k) > order.indexOf(worst)) worst = k;
  };
  const working = age >= 22 && age < 65;
  if (working) life.missedWork += 0.25;

  // CBT course once fear is high, if chosen
  if (adult && pl.coping === 'cbt' && !life.cbtDone && life.anxiety > 0.4) {
    life.cbtDone = true;
    life.anxiety *= P.cbtFactor;
    charge(life, P.fee.cbt, 'none', 'self');
    ctx.ev('cbt');
  }

  // exam, x-rays, cleaning
  charge(life, kind === 'emergency' ? P.fee.emergencyExam : firstEver ? P.fee.newExam : P.fee.exam, kind === 'emergency' ? 'basic' : 'prev', payer);
  const pr = life.perio;
  if (kind === 'routine') {
    if (!life.lastXray || age - life.lastXray >= 1) { charge(life, P.fee.bitewings, 'prev', payer); life.lastXray = age; }
    if (age >= 3) {
      if (pr.maint) charge(life, P.fee.perioMaint, 'basic', payer);
      else charge(life, age < 14 ? P.fee.kidCleaning : P.fee.cleaning, 'prev', payer);
      pr.calc = 0; pr.boost = Math.max(pr.boost, pr.maint ? 4 : 2);
      c.cleanings++;
    }
    if (age < 16 || ctx.kidHighRisk) {
      charge(life, P.fee.fluoride, 'prev', payer);
      for (const t of teeth) if (t.present) t.varnishUntil = m + 6;
    }
    // gum treatment when attachment loss shows up (stage II+)
    if (adult && pr.CAL >= 3.5 && !pr.srp) {
      pr.srp = true; pr.maint = true; pr.calc = 0; pr.boost = 6; pr.CAL = Math.max(0, pr.CAL - 0.5);
      charge(life, P.fee.srp, 'basic', payer);
      c.srp++; bump('filling');
      ctx.ev('deepCleaning', { cal: +pr.CAL.toFixed(1), diabetic: life.diabetic });
    }
  }

  // sealants on newly erupted molars
  if (kind === 'routine' && pl.sealants && age >= 6 && age < 16) {
    for (const t of teeth) if (t.grp && t.present && !t.sealed && t.stage === 0 && t.resto === 'none') {
      t.sealed = true; c.sealants++;
      charge(life, P.fee.sealant, 'prev', payer);
    }
  }
  // seal loss check is folded into sealant retention clock
  for (const t of teeth) if (t.sealed && clockFor(S, t, 'sealLoss').tick(P.rr.sealantLossPerYear, 0.5)) t.sealed = false;

  // night guard for grinders
  if (kind === 'routine' && adult && !life.hasNightGuard && ctx.bruxEff >= 0.28 && pl.nightGuard !== false && S.u('visit:wear') < 0.35) {
    life.hasNightGuard = true; c.nightGuard++;
    charge(life, P.fee.nightGuard, 'none', payer);
    ctx.ev('nightGuard');
  }
  // custom sports guard
  if (kind === 'routine' && ctx.sportActive && pl.guard === 'custom' && !life.hasCustomGuard) {
    life.hasCustomGuard = true;
    charge(life, P.fee.mouthguardCustom, 'none', payer);
  }

  // find and treat problems
  const det = kind === 'emergency' ? P.detectEmergency : P.detect;
  let extractedNow = 0;
  let manyKidLesions = 0;
  const plan = [];
  for (const t of teeth) {
    if (!t.present || t.gone) continue;
    const seen = t.needs || (t.stage > 0 && S.u(`${t.id}:detect`) < (det[t.stage] ?? 0));
    if (!seen) continue;
    if (t.kind === 'primary' && t.stage >= 2) manyKidLesions++;
    plan.push(t);
  }
  // toddlers with many cavities: treatment under general anesthesia
  if (age < 6 && manyKidLesions >= 4) {
    charge(life, P.fee.ga, 'basic', 'parents');
    c.ga++; bump('ga');
    for (const t of plan) if (t.kind === 'primary') { if (t.stage >= 4) t.resto = 'missing'; else { t.resto = 'fillS'; } t.stage = 0; c.fillings++; }
    ctx.ev('generalAnesthesia', { teeth: manyKidLesions });
  }
  for (const t of plan) {
    if (t.resto === 'missing' && !t.needs) continue;
    const urgent = t.stage >= 4 || t.needs === 'extract' || t.needs === 'rct' || (kind === 'emergency' && t.stage >= 3);
    const deferP = pl.treatment === 'defer' && !urgent ? 0.7 : 0;
    const poor = adult && life.insNow === 'none' && life.wallet < 0 && !urgent ? 0.5 : 0;
    if (S.u(`${t.id}:defer`) < Math.max(deferP, poor)) { ctx.ev('deferred', { tooth: t.id, stage: t.stage }); continue; }
    const cheap = pl.treatment === 'cheapest' || (adult && life.insNow === 'none' && life.wallet < -2000);

    if (t.needs === 'replace' || t.needs === 'reimplant') {
      if (t.resto === 'implant' && !cheap) { charge(life, P.fee.implant, 'major', payer); c.implants++; bump('implant'); }
      else if (t.resto === 'bridge' && !cheap) { charge(life, P.fee.bridge, 'major', payer); c.bridges++; }
      else t.resto = 'missing';
      t.needs = null; continue;
    }
    if (t.needs === 'periImplant') { charge(life, P.fee.periImplant, 'basic', payer); t.needs = null; continue; }
    if (t.needs === 'crown' || t.needs === 'recrown') {
      if (cheap && t.needs === 'crown') { extract(); continue; }
      charge(life, P.fee.crown, 'major', payer); c.crowns++; bump('filling');
      t.resto = t.resto === 'rct' ? 'rct' : 'crown'; t.stage = 0; t.needs = null; continue;
    }
    if (t.needs === 'retreat') {
      if (cheap) { extract(); continue; }
      charge(life, P.fee.retreat, 'basic', payer); c.rct++; bump('rct'); t.needs = null; t.stage = 0; continue;
    }
    if (t.needs === 'rct') { treatPulp(); continue; }
    if (t.needs === 'extract') { extract(); continue; }

    if (t.stage === 1) { t.varnishUntil = m + 12; continue; } // watch & remineralize
    if (t.stage === 2) { charge(life, P.fee.fillS, 'basic', payer); c.fillings++; bump('filling'); t.resto = t.resto === 'fillS' || t.resto === 'fillL' ? 'fillL' : 'fillS'; t.stage = 0; continue; }
    if (t.stage === 3) { charge(life, P.fee.fillL, 'basic', payer); c.fillings++; bump('filling'); t.resto = 'fillL'; t.stage = 0; continue; }
    if (t.stage >= 4) { treatPulp(); continue; }

    function treatPulp() {
      if (t.kind === 'primary') { extract(); return; }
      const restorable = S.u(`${t.id}:restorable`) < (t.stage >= 5 ? 0.7 : 0.9);
      if (cheap || !restorable) { extract(); return; }
      charge(life, rctFee(t), 'basic', payer); charge(life, P.fee.core, 'major', payer); charge(life, P.fee.crown, 'major', payer);
      c.rct++; c.crowns++; bump('rct');
      t.resto = 'rct'; t.stage = 0; t.needs = null;
      if (working) life.missedWork += 0.5;
    }
    function extract() {
      const cause = t.perioLoose ? 'perio' : t.crackCause ? 'crack' : 'caries';
      charge(life, t.type === 'molar' ? P.fee.surgicalExtraction : P.fee.extraction, 'extraction', payer);
      c.extractions++; bump('extraction');
      t.stage = 0; t.needs = null; t.resto = 'missing'; extractedNow++;
      if (working) life.missedWork += 1;
      if (t.kind === 'primary') return;
      life.lostBy[cause]++;
      ctx.ev('extraction', { tooth: t.id, cause });
      // replace it? Most people replace one or two teeth with implants; with many
      // gone they move to partials, dentures or (if they can) implant-supported arches.
      const appliance = ['arch', 'denture', 'partial'].find(k => teeth.some(x => x.kind === 'permanent' && x.resto === k));
      const missingCount = teeth.filter(x => x.kind === 'permanent' && ['missing', 'partial'].includes(x.resto)).length;
      const replacedCount = teeth.filter(x => x.kind === 'permanent' && ['implant', 'bridge', 'arch'].includes(x.resto)).length;
      const failing = teeth.filter(x => x.kind === 'permanent' && x.present && !['missing', 'implant', 'bridge', 'partial', 'denture', 'arch'].includes(x.resto) && (x.stage >= 2 || x.needs)).length;
      if (appliance !== 'arch' && appliance !== 'denture' && missingCount >= 10 && (cheap || pl.treatment !== 'follow') && (failing >= 4 || life.perio.CAL >= 5.5)) {
        // "just take them all out": full clearance and dentures
        for (const x of teeth) if (x.kind === 'permanent' && x.present && !['implant', 'bridge', 'missing', 'partial', 'denture', 'arch'].includes(x.resto)) {
          charge(life, P.fee.extraction, 'extraction', payer); c.extractions++; life.lostBy[x.perioLoose || life.perio.CAL >= 5 ? 'perio' : 'caries']++;
          x.stage = 0; x.needs = null; x.resto = 'denture';
        }
        for (const x of teeth) if (x.kind === 'permanent' && (x.resto === 'missing' || x.resto === 'partial')) x.resto = 'denture';
        charge(life, P.fee.denture * 2, 'major', payer); c.dentures++;
        ctx.ev('fullClearance');
      } else if (appliance) {
        t.resto = appliance; charge(life, 300, 'major', payer); // add a tooth to the existing appliance
      } else if (missingCount + replacedCount >= 14) {
        if (!cheap && pl.treatment === 'follow' && life.wallet > 60000) {
          charge(life, P.fee.allOn4 * 2, 'major', payer); c.allOn4 = (c.allOn4 || 0) + 1;
          for (const x of teeth) if (x.kind === 'permanent' && x.present && x.resto !== 'implant') {
            if (!['missing', 'partial'].includes(x.resto)) { c.extractions++; x.stage = 0; x.needs = null; }
            x.resto = 'arch';
          }
          ctx.ev('allOn4');
        } else {
          charge(life, P.fee.denture * 2, 'major', payer); c.dentures++;
          for (const x of teeth) if (x.kind === 'permanent' && (x.resto === 'missing' || x.resto === 'partial')) x.resto = 'denture';
          ctx.ev('dentures');
        }
      } else if (!cheap && adult && pl.treatment === 'follow' && replacedCount < 4 && (life.wallet > 5000 || life.insNow !== 'none') && S.u(`${t.id}:implantChoice`) < 0.55) {
        charge(life, P.fee.graft, 'major', payer); charge(life, P.fee.implant, 'major', payer);
        t.resto = 'implant'; c.implants++; bump('implant');
        ctx.ev('implant', { tooth: t.id });
      } else if (missingCount >= 5 && !teeth.some(x => x.resto === 'partial' || x.resto === 'denture')) {
        charge(life, P.fee.partial, 'major', payer); markPartial();
      }
    }
    function markPartial() {
      c.partials++;
      for (const x of teeth) if (x.kind === 'permanent' && x.resto === 'missing') x.resto = 'partial';
      ctx.ev('partialDenture');
    }
  }
  if (kind === 'emergency') bump('emergency');
  if (age < 3 && worst === 'preventive' && firstEver) worst = 'preventive';
  const good = experience(life, S, pl, worst, age);
  if (!good) ctx.ev('scaryVisit', { what: worst });
}

function summarize(life, perm) {
  const at = a => life.yearly.find(y => y.age === a) || life.yearly[life.yearly.length - 1];
  const fv65 = life.oopBefore65.reduce((s, [a, x]) => s + x * Math.pow(1 + P.returnReal, 65 - a), 0);
  const y50 = at(50), y65 = at(65), y79 = at(79);
  const last = life.yearly[life.yearly.length - 1];
  return {
    seed: life.seed,
    plan: life.plan,
    traits: life.traits,
    counts: life.counts,
    lostBy: life.lostBy,
    missingAt: { 35: at(35).missing, 50: y50.missing, 65: y65.missing, 80: y79.missing },
    naturalAt80: last.natural,
    dmftAt: { 12: at(12).dmft, 19: at(19).dmft, 35: at(35).dmft, 50: y50.dmft, 65: y65.dmft },
    calAt: { 35: at(35).cal, 50: y50.cal, 65: y65.cal },
    money: {
      billed: Math.round(life.billed), insurancePaid: Math.round(life.insPaid), outOfPocket: Math.round(life.oop),
      parentsPaid: Math.round(life.parentsPaid), fv65: Math.round(fv65),
      walletAt65: y65.wallet, walletAt65NoDental: y65.walletNoDental,
    },
    painDays: Math.round(life.painDays), missedWork: Math.round(life.missedWork), sleepless: Math.round(life.sleepless),
    selfConsciousYears: +(life.selfConsciousMonths / 12).toFixed(1), gumDiseaseYears: +(life.gumDiseaseMonths / 12).toFixed(1),
    anxietyPeak: +life.anxietyPeak.toFixed(2), anxietyEnd: +last.anxiety.toFixed(2),
    diabetic: life.diabetic,
    events: life.events,
    yearly: life.yearly,
  };
}
