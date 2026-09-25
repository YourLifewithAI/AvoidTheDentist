// Avoid the Dentist: the patient app. Runs entirely on the phone: no accounts,
// no personal information, no network requests, nothing stored. A patient
// builds a life from everyday habits (or picks a story), watches it play out,
// and gets a Life Story with the Acid Clock, the garden and tool-shed tips.
import { Pix } from '../../art/lib/pix.js';
import { C, SKIN, HAIR, CLOTH } from '../../art/palette.js';
import * as P from '../../art/sprites/people.js';
import { PROP } from '../../art/sprites/props.js';
import { EMOTE } from '../../art/sprites/emotes.js';
import { drawHouse } from '../../art/scenes/house.js';
import { drawAcidStrip, hhmm } from '../../art/acidclock.js';
import { drawGarden } from '../../art/garden.js';
import { simulateLife } from '../../sim/model.js';
import { LIVES, MAYA_BOOK_IT, MAYA_LATER } from '../../sim/lives.js';
import { buildDay, simulateDay, mouthOf } from '../../sim/stephan.js';
import { TOOLS, BADGES } from '../../sim/toolshed.js';
import { LINKS, DISCLOSURE } from './links.js';

const $ = id => document.getElementById(id);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const money = v => '$' + Math.round(v).toLocaleString('en-US');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// pixel canvases, integer-scaled to their box

function blit(canvas, pix) {
  canvas.width = pix.w; canvas.height = pix.h;
  canvas.getContext('2d').putImageData(new ImageData(pix.data, pix.w, pix.h), 0, 0);
  fit(canvas);
}
function fit(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const avail = canvas.parentElement.clientWidth * dpr;
  const scale = Math.max(1, Math.floor(avail / canvas.width));
  canvas.style.width = (canvas.width * scale) / dpr + 'px';
  canvas.style.height = (canvas.height * scale) / dpr + 'px';
}
new ResizeObserver(() => document.querySelectorAll('canvas').forEach(c => c.width && fit(c))).observe(document.body);

function show(screen) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== screen;
  window.scrollTo(0, 0);
  const h = $(screen).querySelector('h1, h2');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

// ---------------------------------------------------------------------------
// the life builder: everyday habits, no personal information

const QUESTIONS = [
  { id: 'kid', q: 'Growing up, how often did you see a dentist?', options: [
    ['Regular checkups', { kidVisits: 'every6', firstVisit: 1 }], ['Now and then', { kidVisits: 'yearly', firstVisit: 3 }], ['Only for problems', { kidVisits: 'pain', firstVisit: 'pain' }]] },
  { id: 'snacks', q: 'Sweet snacks on a normal day?', help: 'Candy, cookies, pastries, chips, dried fruit.', options: [
    ['0 or 1', { sugar: 1 }], ['2 or 3', { sugar: 3 }], ['4 or more', { sugar: 5 }]] },
  { id: 'timing', q: 'When do the sweets usually happen?', options: [
    ['Mostly with meals', { withMeals: true }], ['Between meals', { withMeals: false }]] },
  { id: 'drinks', q: 'Sugary drinks a day?', help: 'Soda, sweet coffee or tea, juice, energy or sports drinks.', options: [
    ['None', { sodas: 0 }], ['One', { sodas: 1 }], ['Two or more', { sodas: 3 }]] },
  { id: 'sip', q: 'Do you sip drinks slowly, over an hour or more?', when: a => a.drinks !== 0, options: [
    ['Yes, usually', { sipping: true }], ['No, I finish them', { sipping: false }]] },
  { id: 'bedtime', q: 'A snack or sweet drink after brushing at night?', options: [
    ['Often', { bedtimeSnack: true }], ['Rarely', { bedtimeSnack: false }]] },
  { id: 'brush', q: 'How often do you brush?', options: [
    ['Twice a day', { brushing: 'twice', fluorideToothpaste: true }], ['Once a day', { brushing: 'once', fluorideToothpaste: true }], ['Some days', { brushing: 'rarely', fluorideToothpaste: true }]] },
  { id: 'floss', q: 'Clean between your teeth?', help: 'Floss, interdental brushes or picks.', options: [
    ['Daily', { interdental: 'daily' }], ['Sometimes', { interdental: 'sometimes' }], ['Rarely', { interdental: 'never' }]] },
  { id: 'visits', q: 'Dental checkups these days?', options: [
    ['Every 6 months', { visits: 'every6' }], ['Once a year', { visits: 'yearly' }], ['When something hurts', { visits: 'pain' }], ['Hardly ever', { visits: 'never' }]] },
  { id: 'job', q: 'What is your work like?', options: [
    ['Desk or office', { job: 'office' }], ['Food or baking', { job: 'baker' }], ['Physical, lifting', { job: 'warehouse' }], ['Night shifts', { job: 'nurse' }], ['Driving', { job: 'driver' }], ['Teaching', { job: 'teacher' }]] },
  { id: 'sport', q: 'Contact sports?', options: [
    ['No', { sport: 'none' }], ['Yes, with a mouthguard', { sport: 'hockey', sportUntil: 35, guard: 'boil' }], ['Yes, without one', { sport: 'hockey', sportUntil: 35, guard: 'none' }]] },
  { id: 'smoke', q: 'Smoke or vape?', options: [
    ['No', { smoking: 'never' }], ['Smoke', { smoking: 'smoker' }], ['Vape', { smoking: 'vaper' }]] },
  { id: 'body', q: 'Any of these? Tap all that apply.', multi: true, options: [
    ['Dry mouth, or a medication that dries it', { dryMouthMeds: true }], ['Heartburn or reflux', { reflux: true }], ['Snoring or sleep apnea', { sleepApnea: 'untreated' }], ['I clench or grind', { grinds: true }]] },
];

let answers = {}, qi = 0;
function visibleQuestions() { return QUESTIONS.filter(q => !q.when || q.when(answers)); }
function renderQuestion() {
  const qs = visibleQuestions(), q = qs[qi];
  $('q-progress').textContent = `${qi + 1} of ${qs.length}`;
  $('q-bar').style.width = `${Math.round(((qi + 1) / qs.length) * 100)}%`;
  $('q-text').textContent = q.q;
  $('q-help').textContent = q.help || '';
  const picked = answers[q.id];
  $('q-options').innerHTML = q.options.map(([label], i) => {
    const on = q.multi ? (picked || []).includes(i) : picked === i;
    return `<button type="button" class="opt" data-i="${i}" aria-pressed="${on}">${esc(label)}</button>`;
  }).join('') + (q.multi ? `<button type="button" class="opt primary" data-next="1">${(picked || []).length ? 'Next' : 'None of these'}</button>` : '');
  $('q-back').hidden = qi === 0;
}
$('q-options').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const qs = visibleQuestions(), q = qs[qi];
  if (b.dataset.next) return nextQuestion();
  const i = +b.dataset.i;
  if (q.multi) {
    const cur = new Set(answers[q.id] || []);
    cur.has(i) ? cur.delete(i) : cur.add(i);
    answers[q.id] = [...cur];
    renderQuestion();
  } else {
    answers[q.id] = i;
    if (q.id === 'drinks') answers.drinks = i === 0 ? 0 : i; // `when` reads this
    nextQuestion();
  }
});
$('q-back').addEventListener('click', () => { qi = Math.max(0, qi - 1); renderQuestion(); });
function nextQuestion() {
  const qs = visibleQuestions();
  if (qi < qs.length - 1) { qi++; renderQuestion(); return; }
  const plan = { ...LIVES.typical, name: 'Your life', sealants: true, phases: [] };
  for (const q of QUESTIONS) {
    if (q.when && !q.when(answers)) continue;
    const a = answers[q.id];
    if (a == null) continue;
    for (const i of q.multi ? a : [a]) Object.assign(plan, q.options[i][1]);
  }
  if (answers.drinks === 0) plan.sipping = false;
  startLife(plan, 'your life');
}

// ---------------------------------------------------------------------------
// stories: ready-made lives (also the clinician's scenario list)

const STORIES = [
  ['typical', 'A typical life', 'Three snacks, a soda, yearly checkups, an office job.', LIVES.typical],
  ['prevention', 'Prevention Pro', 'Sealants, few snacks, daily flossing, checkups every 6 months.', LIVES.prevention],
  ['mealtime', 'Sweets with meals', 'Same sweets, eaten as dessert, plus sugar-free gum after eating.', LIVES.mealtime],
  ['baker', 'The Baker', 'Tasting the bakes from 5 am, every workday.', LIVES.baker],
  ['soda', 'The Soda Sipper', 'Three sodas sipped all day, brushing once, visits only for pain.', LIVES.soda],
  ['nightSnacker', 'The night snacker', 'A snack after brushing, most nights.', LIVES.nightSnacker],
  ['avoider', 'The Avoider', 'A scary visit as a kid, then only for pain.', LIVES.avoider],
  ['lateBloomer', 'The Late Bloomer', 'Avoids the dentist, then comes back at 40.', LIVES.lateBloomer],
  ['grinder', 'The Grinder', 'Lifting at work, clenching, no night guard.', LIVES.grinder],
  ['hockey', 'Hockey, no mouthguard', 'Plays from 8 to 30 without a guard.', LIVES.hockey],
  ['smoker', 'The Smoker', 'Smokes from 18, quits at 50.', LIVES.smoker],
  ['dryMouth', 'Dry mouth at 55', 'A medication that dries the mouth, from 55.', LIVES.dryMouth],
  ['reflux', 'Reflux at night', 'Heartburn from 40, untreated.', { ...LIVES.typical, name: 'Reflux at night', phases: [{ age: 40, set: { reflux: true } }] }],
  ['apnea', 'Sleep apnea', 'Snoring and apnea from 45, untreated.', { ...LIVES.typical, name: 'Sleep apnea', phases: [{ age: 45, set: { sleepApnea: 'untreated' } }] }],
  ['bottle', 'The bedtime bottle', 'A juice bottle in bed as a toddler.', { ...LIVES.typical, name: 'The bedtime bottle', bedtimeBottle: true, firstVisit: 'pain' }],
  ['mayaBook', 'Maya at 34: "Book it"', 'The dentist calls. She books the visit.', MAYA_BOOK_IT],
  ['mayaLater', 'Maya at 34: "Later..."', 'The dentist calls. She puts it off.', MAYA_LATER],
];
$('story-list').innerHTML = STORIES.map(([id, t, d]) => `<button type="button" class="story" data-id="${id}"><strong>${esc(t)}</strong><span>${esc(d)}</span></button>`).join('');
$('story-list').addEventListener('click', e => {
  const b = e.target.closest('button[data-id]'); if (!b) return;
  const s = STORIES.find(x => x[0] === b.dataset.id);
  startLife({ ...s[3], phases: s[3].phases || [] }, s[1]);
});

// ---------------------------------------------------------------------------
// playing a life: the house, age by age, with the year's moments

let cur = null, timer = null;
const seedNow = () => 1 + Math.floor(Math.random() * 99999); // luck, not identity

function planAtAge(plan, age) {
  const e = { ...plan };
  for (const ph of plan.phases || []) if (age >= ph.age) Object.assign(e, ph.set);
  return e;
}

const EVENT_TEXT = {
  firstVisit: 'First dental visit', advice: e => `The dentist's tip: ${e.what}`, trauma: 'An accident knocks a tooth', fall: 'A tumble chips a baby tooth',
  wisdomTeeth: 'Wisdom teeth out', braces: 'Braces!', scaryVisit: 'A scary visit', enduredPain: e => `Puts up with ${e.why || 'a toothache'}`,
  er: 'ER visit for tooth pain (it can\'t fix the tooth)', extraction: e => `A tooth is pulled${e.cause === 'perio' ? ' (gum disease)' : ''}`, implant: 'An implant replaces a tooth',
  crack: 'A tooth cracks', diabetes: 'Diagnosed with diabetes', deepCleaning: 'Deep cleaning for gum disease', nightGuard: 'Gets a night guard',
  dentures: 'Dentures', partialDenture: 'A partial denture', fullClearance: 'All remaining teeth removed', generalAnesthesia: 'Dental work under anesthesia',
  cbt: 'Works on dental fear with a therapist', sdf: 'A cavity painted with SDF: no drill', infiltration: 'An early cavity sealed with resin',
  fluorosis: e => (e.grade === 'moderate' ? 'Fluorosis patches on the front teeth' : null), cosmeticFix: 'Fluorosis spots fixed', replacementFails: 'A replacement fails', prosthesisRedo: 'Denture remade',
};
const eventText = e => { const t = EVENT_TEXT[e.type]; return typeof t === 'function' ? t(e) : t || null; };

function lookAt(age) {
  const base = { skin: SKIN.tan, shoes: CLOTH.brown };
  if (age < 1) return { head: 'baby', body: 'baby', arms: null, look: { ...base, hair: HAIR.black, top: CLOTH.butter, bottom: CLOTH.butter } };
  if (age < 4) return { head: 'toddler', body: 'toddler', arms: null, look: { ...base, hair: HAIR.black, top: CLOTH.rose, bottom: CLOTH.denim } };
  if (age < 13) return { head: 'pigtails', body: 'kidDress', arms: 'kid', look: { ...base, hair: HAIR.black, top: CLOTH.mint, bottom: CLOTH.mint } };
  if (age < 19) return { head: 'long', back: 'long', body: 'teenHoodie', arms: 'teen', look: { ...base, hair: HAIR.black, top: CLOTH.lilac, bottom: CLOTH.denim } };
  if (age < 50) return { head: 'bun', body: 'tee', arms: 'down', look: { ...base, hair: HAIR.black, top: CLOTH.teal, bottom: CLOTH.denim } };
  if (age < 68) return { head: 'bob', body: 'cardigan', arms: 'down', glasses: true, look: { ...base, hair: HAIR.pepper, top: CLOTH.white, bottom: CLOTH.brown, acc: CLOTH.sage } };
  return { head: 'curlyShort', body: 'cardigan', arms: 'cane', glasses: true, look: { ...base, hair: HAIR.white, top: CLOTH.white, bottom: CLOTH.grey, acc: CLOTH.plum } };
}

function drawScene(age, life, plan) {
  const y = life.yearly[Math.min(79, Math.floor(age))], prev = life.yearly[Math.max(0, Math.floor(age) - 1)];
  const pl = planAtAge(plan, age);
  const counter = [];
  if (age >= 13 && pl.sodas >= 2) counter.push('soda:3'); else if (age >= 13 && pl.sodas === 1) counter.push('soda:1'); else counter.push('fruit');
  if (age >= 13 && (pl.sugar >= 4 || pl.bedtimeSnack)) counter.push('cookies'); else counter.push('water');
  if (y.oop - prev.oop > 1500) counter.push('bills');
  const ratio = y.walletNoDental > 0 ? Math.max(0, y.wallet) / y.walletNoDental : 1;
  const dreams = age < 25 ? 1 : Math.round(Math.min(4, age / 15) * Math.min(1, ratio));
  const pix = new Pix(320, 180);
  drawHouse(pix, { time: age % 10 < 5 ? 'day' : 'dusk', moon: [300, 58], cat: age > 25, counter, fridgeNotes: pl.visits === 'pain' || pl.visits === 'never' ? ['postcards'] : ['calendar'], dreams, savings: Math.min(1, ratio) });
  const pain = y.painDays - prev.painDays >= 3, hiding = y.selfConscious > prev.selfConscious && age >= 13;
  const spec = lookAt(age);
  const face = pain ? 'wince' : hiding ? 'sad' : age < 4 ? 'happy' : 'smile';
  const arms = spec.arms === null ? null : pain ? 'cheek' : hiding ? 'cover' : spec.arms;
  const res = P.drawPerson(pix, 176, 154, { ...spec, face: face === 'happy' && age >= 1 ? 'smile' : face, arms });
  if (pain) pix.sprite(EMOTE.pain, 193, res.headY + 6);
  return pix;
}

function startLife(plan, label) {
  cur = { plan, label, seed: seedNow() };
  cur.life = simulateLife(plan, cur.seed, { log: true });
  show('play');
  $('play-title').textContent = label === 'your life' ? 'Your life' : label;
  $('feed').innerHTML = '';
  let age = 0, lastYear = -1;
  const lifeEvents = cur.life.events;
  const step = () => {
    const yr = Math.min(79, Math.floor(age));
    if (yr !== lastYear) {
      for (let a = lastYear + 1; a <= yr; a++) {
        const ys = cur.life.yearly[a], yp = cur.life.yearly[Math.max(0, a - 1)];
        const lines = lifeEvents.filter(e => Math.floor(e.age) === a).map(eventText).filter(Boolean);
        if (a > 0 && ys.missing > yp.missing && !lines.some(l => /pulled|removed|knocks/.test(l))) lines.push(ys.missing - yp.missing === 1 ? 'A tooth is lost' : `${ys.missing - yp.missing} teeth lost`);
        for (const l of [...new Set(lines)].slice(0, 2)) {
          const li = document.createElement('li');
          li.innerHTML = `<span class="age">${a}</span> ${esc(l)}`;
          $('feed').prepend(li);
          while ($('feed').children.length > 6) $('feed').lastChild.remove();
        }
      }
      lastYear = yr;
      $('play-age').textContent = `Age ${yr}`;
      $('play-bar').style.width = `${Math.round((yr / 79) * 100)}%`;
      blit($('scene'), drawScene(age, cur.life, plan));
    }
    age += reduceMotion ? 2 : 0.35;
    if (age >= 80) { clearInterval(timer); timer = null; setTimeout(() => story(), reduceMotion ? 0 : 700); }
  };
  clearInterval(timer);
  timer = setInterval(step, 90);
  step();
}
$('skip').addEventListener('click', () => { clearInterval(timer); timer = null; story(); });

// ---------------------------------------------------------------------------
// the Life Story

function story() {
  const { life, plan } = cur;
  show('story');
  $('story-title').textContent = cur.label === 'your life' ? 'Your life story' : `${cur.label}: the life story`;
  const spent = life.money.outOfPocket + life.money.parentsPaid;
  const tiles = [
    ['Spent on teeth', money(spent), 'out of pocket, over a lifetime'],
    ['Teeth lost by 80', String(life.missingAt[80]), life.missingAt[80] === 0 ? 'kept every one' : 'of 28 adult teeth'],
    ['Days in pain', String(life.painDays), 'toothaches, sensitivity, sore jaw'],
    ['Years hiding a smile', String(life.selfConsciousYears), 'covering a gap or a stain'],
  ];
  $('tiles').innerHTML = tiles.map(([l, v, s]) => `<div class="tile"><span class="label">${l}</span><span class="value">${v}</span><span class="sub">${s}</span></div>`).join('');
  $('whatelse').textContent = life.money.fv65 > 2000
    ? `The dental bills before 65, invested at 5% a year instead, would be worth about ${money(life.money.fv65)} at 65. That's a lot of trips, guitars or rent.`
    : 'Barely any dental bills before 65: the money went to the rest of life.';

  // the Acid Clock on a working day at 35
  const pl = planAtAge(plan, 35);
  const d = buildDay(pl, { age: 35, job: pl.job, working: true, sportActive: pl.sport !== 'none' && 35 < (pl.sportUntil || 22) });
  const brushPI = { twice: 0.4, once: 0.55, rarely: 0.8 }[pl.brushing] - ({ daily: 0.12, sometimes: 0.05, never: 0 }[pl.interdental] || 0);
  const res = simulateDay(d.intakes, mouthOf({ PI: brushPI, saliva: pl.dryMouthMeds ? 0.5 : 1, nightDry: pl.sleepApnea === 'untreated' ? 0.4 : 1 }), d.sleep);
  const acid = new Pix(240, 60).clear(C.paper);
  drawAcidStrip(acid, 12, 18, 216, 30, { intakes: d.intakes, sleep: d.sleep, result: res }, { axis: false });
  blit($('acid'), acid);
  $('acid-note').textContent = `On a workday at 35, your teeth spend ${hhmm(res.acidMinutes)} below pH 5.5, where enamel dissolves${res.sleepAcid ? `, ${hhmm(res.sleepAcid)} of it asleep, when saliva nearly stops` : ''}. The longest stretch is ${res.longest} minutes. Frequent sipping and snacking keep the line down; dessert with meals, gum and water bring it back up.`;

  // the garden at 35 and 70
  for (const [id, age] of [['garden35', 35], ['garden70', 70]]) {
    const g = life.yearly[age].garden, pix = new Pix(160, 80);
    drawGarden(pix, 0, 0, 160, 80, g);
    blit($(id), pix);
    $(id + '-cap').textContent = `At ${age}: sugar weeds ${Math.round(g.sugar * 100)}%, gum weeds ${Math.round(g.gum * 100)}%${g.dry > 0.3 ? ', dry soil' : ''}`;
  }

  renderChanges();
  renderTools();
  $('hundred-out').innerHTML = '';
  $('hundred').disabled = false;
}

// change one thing: same luck, one different choice
const CHANGES = [
  ['Sweets with meals instead of snacks', p => !p.withMeals && p.sugar >= 2, { withMeals: true }],
  ['Sugar-free gum after eating', p => !p.gum, { gum: true }],
  ['Finish drinks instead of sipping', p => p.sipping, { sipping: false }],
  ['No snack after brushing', p => p.bedtimeSnack, { bedtimeSnack: false }],
  ['Brush twice a day', p => p.brushing !== 'twice', { brushing: 'twice' }],
  ['Clean between teeth daily', p => p.interdental !== 'daily', { interdental: 'daily' }],
  ['Checkups every year', p => p.visits === 'pain' || p.visits === 'never', { visits: 'yearly' }],
  ['A mouthguard for sports', p => p.sport !== 'none' && p.guard === 'none', { guard: 'custom' }],
  ['A night guard', p => p.grinds || p.job === 'warehouse', { nightGuard: true }],
  ['Quit smoking at 30', p => p.smoking === 'smoker', { phases: [{ age: 30, set: { smoking: 'never' } }] }],
  ['Checkups every 6 months', p => p.visits === 'yearly', { visits: 'every6' }],
];
function renderChanges() {
  const p = planAtAge(cur.plan, 40);
  const list = CHANGES.filter(([, ok]) => ok(p)).slice(0, 4);
  $('changes').innerHTML = list.length
    ? list.map(([label], i) => `<button type="button" class="opt" data-c="${CHANGES.findIndex(c => c[0] === label)}">${esc(label)}</button>`).join('')
    : '<p>This life is already doing the big things. Try a story to see what changes.</p>';
  $('change-out').textContent = '';
}
// One pair of lives can be swung by luck, so each change is judged over 40
// same-luck pairs (each pair: the same person, with and without the change).
$('changes').addEventListener('click', e => {
  const b = e.target.closest('button[data-c]'); if (!b) return;
  const [label, , set] = CHANGES[+b.dataset.c];
  const phases = [...(cur.plan.phases || []), ...(set.phases || [])];
  const changed = { ...cur.plan, ...set, phases };
  for (const x of document.querySelectorAll('#changes button')) { x.setAttribute('aria-pressed', String(x === b)); x.disabled = true; }
  $('change-out').textContent = 'Living 40 pairs of lives...';
  const N = 40, acc = { cost: 0, teeth: 0, pain: 0, better: 0, worse: 0 }; let s = 1;
  const cost = l => l.money.outOfPocket + l.money.parentsPaid;
  const chunk = () => {
    for (let k = 0; k < 5 && s <= N; k++, s++) {
      const A = simulateLife(cur.plan, 5000 + s, { log: false }), B = simulateLife(changed, 5000 + s, { log: false });
      acc.cost += cost(B) - cost(A); acc.teeth += A.missingAt[80] - B.missingAt[80]; acc.pain += A.painDays - B.painDays;
      if (B.missingAt[80] < A.missingAt[80]) acc.better++; else if (B.missingAt[80] > A.missingAt[80]) acc.worse++;
    }
    if (s <= N) { setTimeout(chunk, 0); return; }
    for (const x of document.querySelectorAll('#changes button')) x.disabled = false;
    const dCost = acc.cost / N, dTeeth = acc.teeth / N, dPain = Math.round(acc.pain / N);
    const bits = [dCost < -100 ? `${money(-dCost)} less spent` : dCost > 100 ? `${money(dCost)} more spent` : 'about the same money'];
    if (Math.abs(dTeeth) >= 0.1) bits.push(dTeeth > 0 ? `${dTeeth.toFixed(1)} more teeth kept` : `${(-dTeeth).toFixed(1)} more teeth lost`);
    if (Math.abs(dPain) >= 2) bits.push(dPain > 0 ? `${dPain} fewer days in pain` : `${-dPain} more days in pain`);
    $('change-out').textContent = `${label}: on average across 40 same-luck pairs, ${bits.join(', ')}. It kept more teeth in ${acc.better} of 40 lives and fewer in ${acc.worse}.`;
  };
  chunk();
});

// 100 lives like this one
$('hundred').addEventListener('click', () => {
  const btn = $('hundred'); btn.disabled = true; btn.textContent = 'Living 100 lives...';
  const res = []; let s = 1;
  const chunk = () => {
    for (let k = 0; k < 10 && s <= 100; k++, s++) res.push(simulateLife(cur.plan, 1000 + s, { log: false }));
    if (s <= 100) { setTimeout(chunk, 0); return; }
    btn.textContent = 'Live it 100 times';
    const kept = res.filter(l => l.missingAt[80] === 0).length, rct = res.filter(l => l.counts.rct > 0).length, gum = res.filter(l => l.lostBy.perio > 0).length;
    const med = res.map(l => l.money.outOfPocket + l.money.parentsPaid).sort((a, b) => a - b)[50];
    const pix = new Pix(181, 61), css = getComputedStyle(document.documentElement);
    const good = css.getPropertyValue('--better').trim(), bad = css.getPropertyValue('--worse').trim();
    const PERSON = ['..###..', '.#####.', '.#####.', '..###..', '.#####.', '#######', '#.###.#', '..#.#..', '..#.#..'];
    res.forEach((l, i) => {
      const c = l.missingAt[80] === 0 ? good : bad, ox = (i % 20) * 9 + 1, oy = Math.floor(i / 20) * 12 + 2;
      PERSON.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') pix.px(ox + x, oy + y, c); }));
    });
    $('hundred-out').innerHTML = `<canvas id="hundred-canvas" width="181" height="61" aria-label="100 people: ${kept} kept every tooth."></canvas>
      <p><strong>${kept} of 100</strong> kept every tooth to 80 (blue). ${rct} needed a root canal. ${gum} lost a tooth to gum disease. Typical lifetime cost: ${money(med)}.</p>`;
    blit($('hundred-canvas'), pix);
  };
  chunk();
});

// tool shed picks: from what drove this life, filtered by evidence
function pickTools() {
  const p = planAtAge(cur.plan, 40), ids = [];
  const add = id => { if (!ids.includes(id)) ids.push(id); };
  if (!p.withMeals && p.sugar >= 2) add('withMeals');
  if (p.sipping || p.sodas >= 2) add('waterBottle');
  if (!p.gum) add('gum');
  if (p.brushing !== 'twice' || !p.fluorideToothpaste) add('fluoridePaste');
  if (p.visits === 'pain' || p.visits === 'never') add('riskCheck');
  if (p.dryMouthMeds || planAtAge(cur.plan, 70).dryMouthMeds) { add('dryMouthCare'); add('highFluoride'); }
  if (p.reflux || planAtAge(cur.plan, 70).reflux) add('refluxCare');
  if (p.sleepApnea || planAtAge(cur.plan, 70).sleepApnea) add('sleepCare');
  if (p.grinds || p.job === 'warehouse') add('nightGuard');
  if (p.sport !== 'none' && p.guard === 'none') add('mouthguard');
  if (p.interdental !== 'daily') add('interdental');
  add('kidPaste');
  return ids.slice(0, 6).map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
}
function toolCard(t) {
  const link = LINKS[t.id];
  const action = t.dentistOnly ? '<p class="ask">Ask your dental team about this.</p>'
    : link && link.url ? `<a class="buy" href="${esc(link.url)}" target="_blank" rel="noopener sponsored">${esc(link.label || 'See an example')}</a>` : '';
  return `<article class="tool"><span class="badge" style="--c: var(--b-${t.badge})">${BADGES[t.badge].label}</span>
    <h3>${esc(t.name)}</h3><p>${esc(t.what)}</p>
    <p class="known"><strong>What's known:</strong> ${esc(t.known)} <a href="${esc(t.source.url)}" target="_blank" rel="noopener">Source</a></p>${action}</article>`;
}
function renderTools() {
  const picks = pickTools();
  $('tools').innerHTML = picks.map(toolCard).join('');
  $('emerging').innerHTML = TOOLS.filter(t => t.badge === 'emerging').map(toolCard).join('');
  const anyAffiliate = [...picks, ...TOOLS.filter(t => t.badge === 'emerging')].some(t => LINKS[t.id]?.url && LINKS[t.id]?.affiliate);
  $('disclosure').textContent = anyAffiliate ? DISCLOSURE : '';
  $('disclosure').hidden = !anyAffiliate;
}

// ---------------------------------------------------------------------------
// navigation

$('go-build').addEventListener('click', () => { answers = {}; qi = 0; renderQuestion(); show('build'); });
$('go-stories').addEventListener('click', () => show('stories'));
for (const b of document.querySelectorAll('[data-home]')) b.addEventListener('click', () => { clearInterval(timer); show('welcome'); });
$('again').addEventListener('click', () => startLife(cur.plan, cur.label));

// welcome scene
{
  const pix = new Pix(320, 180);
  drawHouse(pix, { time: 'dusk', moon: [300, 58], cat: true, counter: ['fruit', 'water'], fridgeNotes: ['calendar'], dreams: 3, savings: 0.7 });
  P.drawPerson(pix, 176, 154, { ...lookAt(30), face: 'grin', arms: 'hold', after: [{ spr: PROP.mug, dx: 5, dy: 0 }] });
  P.drawPerson(pix, 176, 100, { ...lookAt(7), face: 'content', arms: 'kidBrush' });
  blit($('welcome-scene'), pix);
}
show('welcome');
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
