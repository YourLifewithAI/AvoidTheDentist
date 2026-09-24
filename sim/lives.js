// Preset lives: starting points for "What if?" play. Each is a plan for
// simulateLife(); anything not listed uses DEFAULT_PLAN.

const typical = {
  name: 'Typical',
  firstVisit: 3, kidVisits: 'yearly', kidSugar: 4, sealants: false,
  sugar: 3, sodas: 1, brushing: 'twice', interdental: 'sometimes', visits: 'yearly', job: 'office',
};

export const LIVES = {
  prevention: {
    ...typical, name: 'Prevention Pro',
    firstVisit: 1, kidVisits: 'every6', kidSugar: 2, sealants: true,
    sugar: 2, sodas: 0, interdental: 'daily', electricBrush: true, visits: 'every6', bookNext: true,
  },
  typical,
  baker: { ...typical, name: 'The Baker', job: 'baker' },
  soda: {
    ...typical, name: 'The Soda Sipper',
    sodas: 3, sipping: true, brushing: 'once', interdental: 'never', visits: 'pain', job: 'driver', treatment: 'defer',
  },
  grinder: { ...typical, name: 'The Grinder', job: 'warehouse', nightGuard: false },
  grinderGuard: { ...typical, name: 'Grinder + night guard', job: 'warehouse', nightGuard: 'auto' },
  hockey: { ...typical, name: 'Hockey, no guard', sport: 'hockey', sportFrom: 8, sportUntil: 30, guard: 'none' },
  hockeyGuard: { ...typical, name: 'Hockey + guard', sport: 'hockey', sportFrom: 8, sportUntil: 30, guard: 'custom' },
  avoider: {
    ...typical, name: 'The Avoider',
    firstVisit: 'pain', kidVisits: 'pain', kidDentist: 'general', parentsAnxious: true, visits: 'pain', treatment: 'defer',
  },
  lateBloomer: {
    ...typical, name: 'Late Bloomer (returns at 40)',
    firstVisit: 'pain', kidVisits: 'pain', kidDentist: 'general', parentsAnxious: true, visits: 'pain', treatment: 'defer',
    phases: [{ age: 40, set: { visits: 'every6', coping: 'cbt', bookNext: true, treatment: 'follow' } }],
  },
  microbiomeLow: { ...typical, name: 'Vaginal birth, healthy parents', birth: 'vaginal', parentsOral: 'healthy', salivaSharing: false },
  microbiomeHigh: { ...typical, name: 'C-section, parents w/ decay', birth: 'csection', parentsOral: 'poor', salivaSharing: true },
  smoker: { ...typical, name: 'Smoker (quits at 50)', smoking: 'smoker', phases: [{ age: 50, set: { smoking: 'never' } }] },
  nightSnacker: { ...typical, name: 'Night snacker', bedtimeSnack: true },
  mealtime: { ...typical, name: 'Sweets with meals + gum', withMeals: true, gum: true },
  dryMouth: { ...typical, name: 'Dry-mouth meds from 55', phases: [{ age: 55, set: { dryMouthMeds: true } }] },
};

// Maya, the pastry chef from the art samples. At 34 the dentist's office calls.
export const MAYA = {
  ...typical, name: 'Maya', job: 'baker', firstVisit: 1, kidVisits: 'every6', sealants: true,
};
export const MAYA_BOOK_IT = { ...MAYA, name: 'Maya: "Book it"' };
export const MAYA_LATER = {
  ...MAYA, name: 'Maya: "Later..."',
  phases: [{ age: 34, set: { visits: 'pain' } }],
};

// Maya's Acid Clock over a life (art sample, review page): the same person as
// her habits change. Juice bottle in bed as a toddler, sodas sipped from 13,
// tastings at the bakery from 22, gum after tastings and one soda with lunch
// after a hygienist's tip at 34, a medication that dries her mouth at 62.
export const MAYA_ACID = {
  ...MAYA, name: 'Maya: the Acid Clock over a life',
  bedtimeBottle: true, kidSugar: 4,
  phases: [
    { age: 13, set: { sodas: 2, sipping: true } },
    { age: 34, set: { sodas: 1, sipping: false, withMeals: true, gum: true } },
    { age: 62, set: { dryMouthMeds: true } },
  ],
};
export const MAYA_ACID_MARKERS = [
  { age: 1, icon: 'bottle', label: 'juice bottle in bed' },
  { age: 13, icon: 'soda', label: 'sips sodas' },
  { age: 22, icon: 'cupcake', label: 'bakery tastings' },
  { age: 34, icon: 'gum', label: 'sweets with meals, gum' },
  { age: 62, icon: 'pill', label: 'dry-mouth meds' },
];

