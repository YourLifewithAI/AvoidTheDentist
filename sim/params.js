// Model parameters for the hidden simulation.
//
// Tags: [V] verified against a source abstract/summary in research (2026-09);
//       [U] recalled from literature, verify before shipping;
//       [D] design assumption / calibration knob.
// Full source list: docs/GAME_PLAN.md, "Evidence table".

export const P = {
  lifespan: 80,
  returnReal: 0.05, // [D] long-run real return used for "what else it could have been"
  debtRate: 0.10, // [D]
  networkDiscount: 0.25, // [D] insured patients pay negotiated in-network fees

  // --- caries: initiation (sound -> enamel lesion), per tooth per year at RR = 1
  // Mejàre 1999/2004: 2.7-4.3 new enamel lesions /100 approximal surface-years [V]
  // (per-tooth rates here are calibration knobs; see sim/calibrate.mjs)
  cariesInit: {
    primary: { incisor: 0.0086, canine: 0.0067, molar: 0.040 },
    permanent: { incisor: 0.0038, canine: 0.0045, premolar: 0.0135, molar: 0.034 },
  },
  // age curve for permanent teeth (adolescents highest, adults lower) [D];
  // root caries in later life comes from exposed roots + the Acid Clock (rootInit)
  cariesAge: a => (a < 12 ? 0.95 : a < 20 ? 0.8 : a < 40 ? 0.6 : a < 60 ? 0.55 : 0.6),
  // root caries on a tooth with fully exposed roots, per year at root-acid RR = 1 [U/D]
  // (older adults: roughly 0.5-1 new root lesions per person-year in cohort studies)
  rootInit: 0.02,

  // --- caries: progression, per year at RR = 1 (adult permanent teeth)
  prog: {
    enamelToDentin: 0.06, // [V] 5-11%/yr; 65-86% never reach dentin in 11 yrs
    dentinToDeep: 0.11, // [V] 10.9%/yr ages 20-27 (32.5%/yr ages 12-15)
    deepToPulp: 0.20, // [D] placeholder 15-30%/yr (no cohort found)
    pulpToAbscess: 0.50, // [D]
    arrest: 0.04, // [D] enamel lesion remineralizes / arrests
  },
  teenProgFactor: 2.5, // [V] adolescents ~3x faster
  primaryProgFactor: 3.0, // [V] primary teeth ~3x faster
  progRiskExponent: 0.6, // [D] progression is less sensitive to risk than initiation

  // --- caries risk multipliers
  rr: {
    fluorideToothpaste: 0.76, // [V] Marinho 2003
    varnishPermanent: 0.57, // [V] Marinho 2013
    varnishPrimary: 0.63, // [V]
    waterFluoride: 0.93, // [V/D] Cochrane 2024: small modern effect, low certainty
    // brushing: OR 1.45 (once) / 1.56 (rarely) -> RR ~1.3 / ~1.55 in total [V/D]. Thicker
    // plaque already deepens the Acid Clock (~x1.24 / ~x1.7), so these are the remainder.
    brushOnce: 1.08, // [V/D]
    brushRarely: 1.05, // [V/D]
    sealant: 0.25, // [V/D] OR 0.12 at 24 months, occlusal surfaces
    sealantLossPerYear: 0.07, // [U]
    braces: 1.6, // [V] 46% develop white-spot lesions during fixed appliances
    // dry mouth: RR ~2.5 in total [V/D]; slower Acid Clock recovery gives ~x2.2, the rest
    // is lost remineralization and antimicrobial saliva
    dryMouthResidual: 1.15, // [D]
    vaping: 1.3, // [U] emerging
    cSection: 1.1, // [V/D] OR 1.48, low certainty; kept deliberately small
    salivaSharing: 1.1, // [D] emerging
    // a bottle in bed: the Acid Clock carries the all-night acid; on top of that the drink
    // pools on the upper front teeth (the classic nursing-caries pattern) [V/D]
    bottlePooling: 3.0, // [D]
    xylitol: 1.0, // [V] 13%, low certainty -> no effect in game
    erosionPerRef: 0.075, // [U] acid-softened enamel: +7.5% per two sodas' worth of acid bath (cap +15%)
  },
  // Sugar, bacteria, plaque and saliva act through the Acid Clock (sim/stephan.js):
  // caries pressure = (daily acid dose below pH 5.5 / reference day)^0.75, excess
  // halved by good fluoride use [V]. Calibrated shape: +1 separate sweet snack a day
  // ~ +25-30%; a high mutans load (ms 2) ~x1.8 (RR ~2-2.5 reported [V]).
  saliva: { dry: 0.35, meds: 0.5 }, // [V/D] hyposalivation: unstimulated flow <0.1 vs ~0.3-0.4 mL/min

  // --- symptoms (episodes per year while in a state) [D]
  symptoms: {
    2: { rate: 0.2, days: 1, severe: false },
    3: { rate: 1.0, days: 2, severe: false },
    4: { rate: 4.0, days: 4, severe: true },
    5: { rate: 6.0, days: 7, severe: true },
  },
  primaryPainFactor: 0.3, // [V] only ~18% of decayed baby teeth ever hurt

  // --- detection sensitivity at a routine exam with bitewings [D]
  detect: { 1: 0.45, 2: 0.75, 3: 0.95, 4: 1, 5: 1 },
  detectEmergency: { 1: 0, 2: 0.2, 3: 0.5, 4: 1, 5: 1 },

  // --- restorations: annual failure [U] (Opdam 2014, Pjetursson 2007, Ng 2010, Howe 2019)
  fail: { fillS: 0.02, fillL: 0.035, crown: 0.012, rct: 0.028, implant: 0.004, bridge: 0.011, partial: 0.12, denture: 0.12 },
  periImplantitis: 0.02, // [U] ~20% of patients over ~10 yrs

  // --- periodontal (Löe 1965, Löe 1986, Needleman 2018, AAP/EFP 2017)
  perioClass: [
    ['rapid', 0.08, 0.36], // [V] 8% rapid: all teeth lost by ~45 without care
    ['moderate', 0.81, 0.22], // [V] 81% moderate: ~7 teeth lost by 45 without care
    ['resistant', 0.11, 0.03], // [V] 11% no progression beyond gingivitis
  ],
  plaque: { twice: 0.40, once: 0.55, rarely: 0.80 }, // [D]
  interdental: { daily: 0.12, sometimes: 0.05, never: 0 }, // [U] small gum effect, low certainty
  electricBrush: 0.05, // [U] 11-21% less plaque
  calculusPerMonth: 0.035, // [D]
  smokingPerio: 1.85, // [V] Leite 2018
  diabetesPerio: 1.86, // [V] Nascimento 2018
  stressPerio: 1.3, // [D]
  perioToothLoss: cal => (cal <= 2 ? 0 : Math.min(0.6, 0.0022 * Math.exp((cal - 4) / 0.9))), // [D] tuned to Löe/Hirschfeld
  maintainedFactor: 0.5, // [V/D] maintained patients ~0.08 teeth/yr (Hirschfeld 1978)

  // --- bruxism & cracks [U/D]
  bruxBase: [[0.05, 0.70], [0.30, 0.20], [0.60, 0.10]], // [U] ~13% sleep, ~25% awake bruxism
  nightGuardProtection: 0.8, // [U] protects teeth; doesn't stop the habit
  nightGuardAdherence: 0.7, // [D]
  crackBase: 0.0007, // [D] per posterior tooth-year

  // --- trauma [U] (Petti 2018; Knapik 2007)
  trauma: { toddler: 0.06, kid: 0.012, adult: 0.004 },
  sports: { none: 0, hockey: 0.10, boxing: 0.15, basketball: 0.05, football: 0.02, soccer: 0.025, skate: 0.03, running: 0 },
  guardRR: { none: 1, boil: 0.55, custom: 0.45 }, // [U] RR 1.6-1.9 without a guard
  avulsionKeptWithFirstAid: 0.6, // [U] IADT: milk + dentist within 60 min

  // --- anxiety (Berggren & Meynert 1984; Armfield 2013; Kvale 2004) [U/D]
  negExperience: { preventive: 0.03, filling: 0.10, rct: 0.20, extraction: 0.30, emergency: 0.30, ga: 0.40, implant: 0.20 },
  cbtFactor: 0.4, // [U] large fear reduction; ~77% attend regularly years later

  // --- fees, 2024-26 US typical, uninsured (CareCredit 2024 study, Delta Dental, ADA HPI) [V]
  fee: {
    allOn4: 22000,
    exam: 60, newExam: 105, emergencyExam: 120, cleaning: 110, kidCleaning: 85, bitewings: 65, pano: 130,
    fluoride: 35, sealant: 42, fillS: 210, fillL: 300, bonding: 250,
    rctAnterior: 950, rctPremolar: 1050, rctMolar: 1175, core: 300, crown: 1300, retreat: 1200,
    extraction: 200, surgicalExtraction: 345, graft: 500, implant: 4500, bridge: 3800, partial: 2000, denture: 1750,
    srp: 970, perioMaint: 160, nightGuard: 400, mouthguardCustom: 300, mouthguardBoil: 25,
    braces: 6000, wisdom: 2750, ga: 10000, er: 1900, cbt: 900, sedation: 350, flipper: 500, periImplant: 900,
  },
  insurance: {
    none: { prev: 0, basic: 0, major: 0, max: 0, ded: 0 },
    employer: { prev: 1, basic: 0.8, major: 0.5, max: 1500, ded: 50 }, // [V] 100/80/50, $1,000-2,000 max
    medicaidChild: { prev: 1, basic: 1, major: 1, max: Infinity, ded: 0 },
    medicaidAdult: { prev: 0, basic: 0, major: 0, emergency: 1, max: Infinity, ded: 0 }, // emergency-only states
    medicare: { prev: 0, basic: 0, major: 0, max: 0, ded: 0 }, // [V] traditional Medicare excludes routine dental
    advantage: { prev: 1, basic: 0.5, major: 0.5, max: 1300, ded: 0 }, // [V] typical MA dental cap ~$1,300
  },
};

// Jobs: extra daily sugar exposures, bruxism, shift work, savings capacity ($/yr real), insurance.
export const JOBS = {
  office: { label: 'Office', sugar: 1, energy: 0, brux: 0.10, shift: false, savings: 6000, insurance: 'employer' },
  baker: { label: 'Baker', sugar: 4, energy: 0, brux: 0.05, shift: true, savings: 3500, insurance: 'employer' },
  warehouse: { label: 'Warehouse', sugar: 1, energy: 1, brux: 0.25, shift: false, savings: 4000, insurance: 'employer', trauma: 0.004 },
  nurse: { label: 'Night nurse', sugar: 1, energy: 1, brux: 0.10, shift: true, savings: 7000, insurance: 'employer' },
  driver: { label: 'Rideshare', sugar: 1, energy: 0, brux: 0.05, shift: false, savings: 2500, insurance: 'none' },
  teacher: { label: 'Teacher', sugar: 1, energy: 0, brux: 0.10, shift: false, savings: 5000, insurance: 'employer' },
  hygienist: { label: 'Hygienist', sugar: 0, energy: 0, brux: 0.05, shift: false, savings: 5500, insurance: 'employer', knowsRisk: true },
};
