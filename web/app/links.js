// Product links for the patient app's tool shed picks.
//
// Empty for now, on purpose. Fill these in after reviewing the clinical
// scenarios. Rules (docs/GAME_PLAN.md §14):
// - a link never changes what gets recommended; picks come from the life's drivers
//   and the evidence badges in sim/toolshed.js, before any link is attached
// - prefer a generic option when one exists
// - dentist-only tools get no product link; they point to the dental team
//
// Format: toolId: { url: 'https://...', label: 'What the button says', affiliate: true }
// An entry with `affiliate: true` makes the app show the disclosure line.

export const LINKS = {
  // gum: { url: '', label: 'Sugar-free gum', affiliate: true },
  // electricBrush: { url: '', label: 'An electric toothbrush with a timer', affiliate: true },
  // interdental: { url: '', label: 'Interdental brushes', affiliate: true },
  // waterBottle: { url: '', label: 'A reusable water bottle', affiliate: true },
  // postbiotic: { url: '', label: 'A postbiotic toothpaste', affiliate: true },
  // microbiomeTest: { url: '', label: 'An oral microbiome test', affiliate: true },
  // mouthguard: { url: '', label: 'A boil-and-bite mouthguard', affiliate: true },
};

export const DISCLOSURE = 'Some links may earn us a small commission. It never changes what we suggest: suggestions come from your life story and the evidence.';
