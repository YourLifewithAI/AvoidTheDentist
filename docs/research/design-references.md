# Avoid the Dentist: Design Research Report

Prepared 2026-09-24 to inform the design plan for *Avoid the Dentist*, a web-based, cozy, old-school pixel-art life-sim and idle game for dental patient education. The player starts as an infant in a cutaway house. Choices cover diet, work, sports, dental visits and dental anxiety. A hidden statistical model plays out consequences over a lifetime, including costs and opportunity costs. The art shows the person living their life, not close-ups of teeth.

## How to read this report

Verification tags:

- **[V]** Checked this session against the linked source. For game and app facts (Sections 1 and 2), this usually means text from the cited page as returned by web search.
- **[V\*]** Checked through a secondary or mirrored source rather than the original page. Examples: a paper that cites the original, an abstract stored in a public GitHub bibliography or OpenAlex dump, or a GitHub mirror of PubMed Central (PMC) full text. The quoted text came from the source, but the original page was not opened.
- **[UNVERIFIED]** Background knowledge that was not confirmed this session. Check it before citing.

**Research constraints.** The network proxy blocked WebFetch for nearly every domain, including Wikipedia, PubMed/PMC, JMIR, PLOS, Nature, MDN and Lospec. GitHub was the exception. The session-wide WebSearch budget also ran out partway through, after about 40 searches by this task. For Sections 3 to 5, I therefore checked most evidence through GitHub code search. That search returns exact source text from public bibliographies, OpenAlex abstract dumps, PMC full-text mirrors, MDN's source repositories and the google/fonts repository. One warning: when WebFetch summarised a very large file, its small summariser model once invented palette authors. I discarded that output and re-checked the authors against the raw text returned by code search.

---

## 1. Reference games: what to borrow

| # | Game (developer, year) | What to borrow for *Avoid the Dentist* | Check |
|---|---|---|---|
| 1 | **BitLife: Life Simulator** (Candywriter LLC, released 29 Sep 2018) | A text-based life from birth to death, advanced year by year through event prompts and choices, with dry humour. Use the yearly "age up" tick as the core loop, with short event cards such as first sweets, first job or a sports injury. | [V] (the exact "Age" button UI is [UNVERIFIED]) |
| 2 | **The Sims** (Maxis, Will Wright, 4 Feb 2000) | A dollhouse cutaway with wall modes (walls down, cutaway, walls up), plus needs ("motives"), careers and household finances. Show wants as icons, for example a soda can or a toothache bolt in a thought bubble, instead of numbers. | [V] (thought-bubble details for the 2000 original are [UNVERIFIED]) |
| 3 | **Little Computer People** (Activision, David Crane and Rich Gold, 1985) | A side-view, three-storey "House on a Disk" where you watch one little person live their routine. This is the closest ancestor of our cutaway house, and a flat side view is much cheaper to draw in pixel art than isometric. | [V] |
| 4 | **Tiny Tower** (NimbleBit, iOS 23 Jun 2011; Apple iPhone Game of the Year 2011) | A vertical stack of floor-rooms with tiny pixel residents and gentle idle income. Map floors to life domains: kitchen for diet, bathroom and bedroom for hygiene and sleep, office for work, garage for sport. | [V] |
| 5 | **Kairosoft sims: Game Dev Story** (Windows Apr 1997 in Japan; iOS/Android Oct 2010) and **Dream House Days** (year [UNVERIFIED]) | Dense but readable micro-pixel cutaways and stats that grow over time. In Dream House Days, tenants marry and have children. Borrow tiny-sprite readability and a multi-generation epilogue in which children inherit household habits. | [V] |
| 6 | **Fallout Shelter** (Bethesda Game Studios with Behaviour Interactive, iOS 14 Jun 2015) | A side-view grid of rooms, people dragged into rooms, and resource meters. Let players set routines by dragging the character into the gym, kitchen or dentist; each room produces over time. | [V] |
| 7 | **Unpacking** (Witch Beam; Humble Games; 2 Nov 2021) | A wordless life told through belongings over several moves, starting in 1997. Use toothbrushes, floss, mouthguards, retainer cases, soda cans and appointment cards as quiet props that change across decades, so teeth never need to be shown. | [V] |
| 8 | **The Oregon Trail** (Don Rawitsch, Bill Heinemann, Paul Dillenberger, 1971; distributed by MECC from 1975) | Edutainment with hidden probabilities. The program calculated chances of success from the player's supplies instead of a dice roll, and Rawitsch checked the content against pioneer diaries. Our equivalent: habits, fluoride and visits quietly shift event odds, and outcomes are announced plainly. | [V] |
| 9 | **Reigns** (Nerial, designer François Alliot; Devolver Digital; 11 Aug 2016) | Left/right swipe cards, each nudging one or more of four kingdom meters, which add up to long-term consequences. Use fast binary lifestyle cards ("Soda or water with lunch?") whose effects build up out of sight. | [V] |
| 10 | **Spent** (McKinney for Urban Ministries of Durham, Feb 2011) | Survive a month on $1,000 by choosing between equally bad options, such as a healthy meal or working electricity. Played more than 4 million times. Model money and time trade-offs (skip the check-up to pay rent) so structural barriers are visible and nobody is blamed. | [V] |
| 11 | **Papers, Please** (Lucas Pope, 8 Aug 2013) | Pay per person processed, minus penalties for mistakes, set against the needs of a family at home. Use an end-of-year ledger: income, dental spending, hours off work, days in pain, meals avoided. | [V] (the ledger's line items, such as rent, food, heat and medicine, are [UNVERIFIED]) |
| 12 | **Florence** (Mountains; Annapurna Interactive; iOS 14 Feb 2018) and **Before Your Eyes** (GoodbyeWorld Games; Skybound Games; 8 Apr 2021) | Florence tells a relationship through short playable vignettes. Before Your Eyes covers a life "from his very first to his very last breath", moving forward when the player blinks (webcam). Use 20–40 second vignettes at milestones (first dentist visit, prom photo, first paycheque, a grandchild) and keep the feeling that time slips away. | [V] |
| 13 | **Passage** (Jason Rohrer, 2007; in MoMA's collection since 2012) | A whole life in five minutes. The pixel character ages as they walk, with one major choice (partner or solo treasure-hunting). A precedent for a compressed lifetime, age shown through sprite changes, and a gentle memento mori tone. | [V] |
| 14 | **Idle and incremental games:** Cookie Clicker (Julien "Orteil" Thiennot, 8 Aug 2013); Universal Paperclips (Frank Lantz, 9 Oct 2017); A Dark Room (Doublespeak Games / Michael Townsend, 10 Jun 2013) | Clicking gives way to automation and upgrades (Cookie Clicker, Paperclips). Systems are revealed gradually from a single button, "stoke fire" (A Dark Room). Treat habits as automators: once formed, brushing "runs itself". Unlock systems such as insurance, meal planning and an anxiety toolkit only when they become relevant. | [V] |
| 15 | **Stardew Valley** (Eric "ConcernedApe" Barone, 26 Feb 2016) | Cozy daily routines, seasons and relationships in warm pixel art. Borrow the tone: routine as comfort, not chore. | [V] |
| 16 | **Tamagotchi** (Bandai; Aki Maita and Akihiro Yokoi of WiZ; 23 Nov 1996) | A care loop in which growth depends on the quality of care. Caution: avoid guilt mechanics like "your pet died", given the evidence on dental shame (Section 4.2). | [V] |
| 17 | **Plague Inc.** (Ndemic Creations, James Vaughan; iOS 26 May 2012) | A visible, legible stat model. The CDC invited the developer to speak about its disease models in 2013. Offer an optional "model view" after each life that shows which risk drivers mattered. | [V] |

**Also relevant**

- **Princess Maker** (Gainax, 1991) [V]. The player raises a daughter over eight in-game years through a schedule system, and endings depend on her stats (Princess Maker 2 has 74 endings). Borrow schedule slots for school, work and sport, and epilogues driven by stats.
- **Alter Ego** (Activision; Peter J. Favaro, a psychologist; 1986) [V]. Starts in infancy; the player picks "experiences" at each life stage. It was built from interviews about important life events and came in male and female editions. A precedent for psychologically grounded life events.
- **Real Lives** (Educational Simulations, 2001; now run by Neeti Solutions) [V]. Generates random births in about 190 countries weighted by real statistics, followed by random life events. Borrow the birth lottery (water fluoridation, family income, insurance) grounded in real data.
- **The Evolution of Trust** (Nicky Case; CC0) [V; year UNVERIFIED]. An interactive guide to the game theory of cooperation that runs visible simulations. A template for an end-of-life "why did this happen?" explainer with replays.
- **Health games with randomized-trial evidence** [V]:
  - *Packy & Marlon* (Raya Systems). Six-month RCT in children aged 8–16 with diabetes (31 intervention, 28 control); players had fewer urgent diabetes visits.
  - *Re-Mission* (HopeLab). RCT with 375 cancer patients aged 13–29 at 34 centres, published in *Pediatrics* in 2008; improved treatment adherence, knowledge and self-efficacy.

---

## 2. Existing dental and oral-health games and apps

| Product | Maker, year | What it does | Audience | Evidence and notes |
|---|---|---|---|---|
| **Plaque Attack** | Activision (Steve Cartwright), 1983, Atari 2600 | The player is a toothpaste tube firing at junk food (hamburgers, fries) to defend eight teeth. Cartwright said it was meant to build good dental habits. | Children and general | A retro "food vs teeth" precedent. Our concept deliberately avoids the tooth-centric view. [V] |
| **Tooth Protectors** | DSD/Camelot for Johnson & Johnson, 1983, Atari 2600 | An early advergame, available only by mail order with J&J proofs of purchase. | General | [V] |
| **Toothsavers** | Ad Council and the Partnership for Healthy Mouths, Healthy Lives; launched 15 Jan 2014 on web, iOS and Android | Brush for two minutes, twice a day, to rescue fairy-tale characters from a sorceress who casts cavity spells. Part of the Kids' Healthy Mouths campaign (launched Aug 2012; 2min2x.org). | Ages 3–6 | [V] |
| **Brush DJ** | Dr Ben Underwood, a UK dentist | Plays two minutes of music from the user's own library or playlist to time brushing. | All ages (audience [UNVERIFIED]) | *British Dental Journal* (BDJ) 2015 user survey: 70% said their teeth felt cleaner, 88% said the app motivated them to brush longer, 90% would recommend it. Self-report with no control group. [V] |
| **Disney Magic Timer by Oral-B** | Oral-B and Disney; launch year [UNVERIFIED] | Challenges children to brush for the full two minutes; children typically brush for about one minute. | Children | [V] |
| **Colgate Magik** | Colgate, with technology from Kolibree; year [UNVERIFIED], probably 2018 | A smart connector tracks brushing; augmented-reality (AR) games where children brush away monsters; AR masks as rewards; a parent dashboard. | About ages 5–11 | [V] |
| **Pokémon Smile** | The Pokémon Company and LITALICO; 17 Jun 2020 | Camera-based AR: brush away bacteria holding Pokémon captive, then catch the Pokémon. | Children | [V] |
| **Adult-targeted oral-health apps** | Various | Tiffany et al. 2018 reviewed 33 apps for adults. 61% (20/33) had a brushing timer; the rest mostly offered tips, reminders and general education. | Adults | *JMIR mHealth and uHealth* 2018;6(9):e11432 [V] |
| **App quality** | — | Reviews using the Mobile App Rating Scale (MARS) rate most oral-hygiene apps poor. One reported a mean MARS of 2.48 (SD 0.77); another found 24 of 40 apps low quality. | — | BDJ 2019; *JMIR mHealth* 2021; *MJIRI*. Search summaries only; figures not matched to individual reviews. [V\*] |
| **Dental-anxiety tools** | Research prototypes | Smartphone exposure therapy (pilot RCT, *J Public Health Dent* 2020, Arias et al.); a CBT-based mobile app (*PLOS Digital Health*); online CBT (12-month RCT, PubMed 40514778); a computerized anxiety tool (RCT, PubMed 26202996); VR exposure therapy (RCT, *BMC Oral Health* 2016); VR support design (arXiv 2609.15867, 2026); CALM guided self-help CBT for children (trial protocol). | Anxious adults; some child programmes | Titles verified; details [UNVERIFIED]. These are therapy tools, not everyday education or life-sims. |
| **Gamified education for parents** | Research app (Iran) | Simple app compared with a gamified app for mothers of preschoolers. | Parents | Zolfaghari et al. 2021; see Section 3. [V\*] |
| **Board game for adults with intellectual disability** | Pilot study | Oral-hygiene board game; outcomes were knowledge and plaque index. | Adults with intellectual disability | PMC7908306; title verified. |

**The gap *Avoid the Dentist* fills**

1. **Adults.** Dental games target young children and brushing duration: Toothsavers for ages 3–6, Colgate Magik for about 5–11, Pokémon Smile for children. Apps for adults are mostly brushing timers and reminders (61% timers in Tiffany et al. 2018).
2. **Lifetime consequences.** Every product found is a two-minute session tool. None shows effects compounding over decades, such as the loop of fear, delayed care and larger treatment.
3. **Costs and opportunity costs.** No dental game was found that models treatment costs, time off work, days in pain, or trade-offs against rent and food. Only one targeted search was run, so treat this absence as provisional.
4. **Anxiety and shame.** These are addressed by clinical therapy tools (exposure, CBT, VR), not by mainstream education. Nothing lets a player watch avoidance play out, or safely rehearse going back after years away.
5. **Everyday context.** No product connects diet environment, work schedules, sport (mouthguards, sports drinks) and money or insurance. Spent-style trade-offs would.
6. **Independence.** Many existing products are tied to a brand or device (Oral-B, Colgate/Kolibree, and J&J back in 1983). There is room for an independent game reviewed by clinicians.
7. **Evidence.** Existing trials are short and involve children, parents or orthodontic teenagers (Section 3). An adult life-choices game would be new territory.

---

## 3. Evidence on serious games and gamification for oral health (2018–2025)

### 3.1 Systematic reviews and meta-analyses found

- **Toniazzo, Nodari, Muniz and Weidlich (2019).** "Effect of mHealth in improving oral hygiene: a systematic review with meta-analysis." *J Clin Periodontol* 46(3):297–309. [citation V\*]
  - Citing papers describe its findings this way. Zolfaghari et al. 2021: mHealth "could work as additional tool for enhancing oneself oral hygiene, in particular to manage gingivitis, and to improve oral health knowledge." Musa et al. 2024: the review "demonstrated a significant improvement in dental plaque and gingivitis resulting from the use of mobile apps." [V\*]
  - Pooled effect sizes: [UNVERIFIED].
  - Caveat: "mHealth" here means mostly text messages and apps, not games.
- **Fernández et al. (2021).** "Teledentistry and mHealth for promotion and prevention of oral health: a systematic review and meta-analysis." *J Dent Res* 100(9). [citation V\*; findings UNVERIFIED]
- **Fijačko et al. (2020).** A systematic app-store search for gamified oral-hygiene apps for children. It catalogued gamification features, checked consistency with evidence-based dentistry, and rated quality with the user version of MARS (uMARS). *JMIR mHealth uHealth* 8(7):e16365. [V] Zolfaghari et al. 2021 describe it as finding 612 oral-health apps in a 2019 search. [V\*]
- **"Gamification and Oral Health in Children and Adolescents: Scoping Review."** *Interact J Med Res* 2024, e35132. [title V; findings UNVERIFIED]
- **"The Application of Gamification in Children's Oral Health Management: Systematic Review."** *J Med Internet Res* 2025, e75541. [title V; findings UNVERIFIED] This is the most recent and most relevant review. Obtaining its full text is the top follow-up.
- **Other reviews identified by title only (findings UNVERIFIED):**
  - "The Use of Patient-Oriented Mobile Phone Apps in Oral Health: Scoping Review" (*JMIR mHealth* 2023, e46143).
  - An app-based early-childhood-caries review (PMC10036826).
  - Apps and social media for orthodontic patients (PubMed 36882496).
  - Reviews of apps for adolescents (PMC13408725) and for older adults and caregivers (PMC13409649).

### 3.2 Representative trials (figures checked against source text)

| Study | Design and audience | Intervention | Results |
|---|---|---|---|
| **Zolfaghari et al. 2021**, *BMC Oral Health* | RCT; mothers of preschoolers (children's mean age 4.7); 58 dyads; 1-month follow-up | Simple app vs. gamified app | Mothers' knowledge rose from 10.5 to 13.1 (simple) and 11.3 to 14.3 (gamified). Practice rose from 4.4 to 8.5 and 4.8 to 8.0. Child plaque index fell from 0.8 to 0.5 and 1.0 to 0.5. "Children had better Plaque control in gamified app group (P < 0.05)". [V\*] |
| **Shirmohammadi et al. 2022**, *Eur Arch Paediatr Dent* | RCT; mothers of children aged 2–6; 51 dyads; 1 and 3 months | App vs. usual in-clinic education | Plaque improved in both groups with no difference between them. Gingival index was better in the app group at 3 months (p < 0.001); the usual-education group had worsened by then. [V\*] |
| **Scheerman et al. 2020** ("WhiteTeeth"), *Int J Dent Hyg* 18(1):73–83 | RCT; 132 adolescents aged 12–16 with fixed braces | App plus usual care vs. usual care | At 6 weeks: gingival bleeding B = −3.74 (95% CI −6.84 to −0.65). At 12 weeks: plaque accumulation B = −11.32 (−20.57 to −2.07); plaque-covered sites B = −6.77 (−11.67 to −1.87). This is a coaching app, not a game. [V\*] |
| **Underwood et al. 2015**, BDJ (Brush DJ) | Uncontrolled user survey | Music timer app | Self-reported benefits only (see Section 2). [V] |

### 3.3 Context from general gamification meta-analyses

Secondary source: a GitHub research summary. [V\*]

- **Mazeas et al. 2022** (*JMIR*; 16 RCTs; 2,407 people; physical activity). g = 0.42 (0.14–0.69) at the end of the intervention, falling to g = 0.15 (0.07–0.23) at about 14 weeks of follow-up.
- **Johnson et al. 2016** (*Internet Interventions*; 19 health and wellbeing studies). 59% positive results, 41% mixed, study quality moderate to low.
- **Sailer and Homner 2020** (*Educ Psychol Rev*; learning outcomes). Cognitive g = 0.49, motivational g = 0.36, behavioural g = 0.25. Fiction or narrative and social interaction were important moderators.

### 3.4 Who has been studied

- Oral-health game and gamification studies focus on **children**, often reached through parents, and on **adolescents in orthodontic treatment**.
- Evidence for the general adult population mostly concerns non-game mHealth such as text messages and coaching apps.
- No evaluated game was found about adults' lifetime choices, dental costs or dental anxiety.
- Follow-up is usually 1–3 months. Typical outcomes are knowledge, self-reported practice, and plaque and gingival indices. Caries and behaviour measured over years are rare.

### 3.5 Implications for the design and its evaluation

- Expect reliable gains in knowledge. Improvements in plaque and gingival indices are real but short-term, and gamification effects fade after the intervention (Mazeas et al. 2022).
- Aim the game at understanding, attitudes and intentions, and turn intentions into real-world one-time actions: book a cleaning, tell the dentist you are nervous, buy a mouthguard.
- Rely on narrative and social features, not just points (Sailer and Homner's moderators).
- Evaluate with pre/post knowledge and intention measures plus a follow-up at about 3 months, such as self-reported booking. Do not claim clinical outcomes.

---

## 4. Health-communication principles and what they mean for the design

### 4.1 Fear appeals and self-efficacy

**Extended Parallel Process Model** (EPPM; Witte 1992, *Communication Monographs* 59:329–349). The model explains why fear appeals fail, puts fear back at the centre, and specifies how threat and efficacy interact. It builds on Leventhal's danger-control / fear-control framework. [V\*]

**Witte and Allen 2000 meta-analysis**, as quoted in Kok et al. 2018: "strong fear appeals and high-efficacy messages produce the greatest behaviour change, whereas strong fear appeals with low-efficacy messages produce the greatest levels of defensive responses." [V\*]

**Tannenbaum et al. 2015** (*Psychol Bull* 141(6):1178–1204; doi 10.1037/a0039729). [V\*]
- 127 articles, 248 samples, N = 27,372; overall d = 0.29 on a composite of attitudes, intentions and behaviours.
- Fear appeals worked better when they included efficacy statements, depicted high susceptibility and severity, recommended one-time rather than repeated behaviours, and reached audiences with more women.
- The authors found "no identified circumstances under which they backfire".

**Counterpoint: Kok, Peters, Kessels, ten Hoor and Ruiter 2018** (*Health Psychol Rev* 12(2):111–125). [V\*]
- If efficacy is low, people react defensively.
- Peters et al. (2013) found only six rigorous studies. Among them, high threat changed behaviour only when efficacy was high.
- Tannenbaum et al. combined attitudes, intentions and behaviours into one effect size rather than reporting behaviour on its own.

**Design rules**

1. Pair every consequence on screen, in the same moment, with a concrete step that is doable (self-efficacy) and works (response efficacy).
2. Make calls to action one-time behaviours: book, ask, buy, set a reminder. Handle repeated behaviours such as brushing through habit and automation mechanics.
3. Keep threat personal but not gory: no rotten-teeth close-ups.
4. Playtest for defensive reactions such as skipping, quitting or mocking the message.

### 4.2 Dental anxiety, embarrassment and avoidance

**Prevalence**
- A 2021 meta-analysis (Silveira et al., *J Dent* 108:103632) estimated global dental anxiety at 15.3% (95% CI 10.2–21.2). [V\*]
- The UK Adult Dental Health Survey (ADHS) 2009 reported 36% moderate and 12% extreme dental anxiety. [V\*]

**Vicious cycle** (Armfield, Stewart and Spencer 2007, *BMC Oral Health*). People with high dental fear are more likely to delay treatment. That leads to more extensive problems and symptom-driven visits, which in turn maintain or worsen the fear. [V\*]

**Embarrassment** (Moore, Brødsgaard and Rosenberg 2004, *BMC Psychiatry* 4:10). [V]
- Participants were 30 specialist-clinic patients who had avoided care for a mean of 12.7 years. All but three reported embarrassment.
- Intense embarrassment about poor dental status or perceived neglect was linked to hiding the mouth (lips, hands, head position), secrecy and "taboo-thinking".
- Embarrassment intensity correlated with years of avoidance and with mouth-hiding.
- After many years of avoidance, embarrassment led to "self-punishment, poor self-image/esteem" in a vicious circle.
- Negative dentist remarks, such as "Dentist tells you that you have bad teeth", were among the most intense anxiety triggers.

**Design rules**

1. **Never scold.** The dentist character welcomes returning patients warmly ("Glad you came in"). No judgmental remarks.
2. **Make going back after years easy.** Treat it as a milestone worth celebrating, with no penalty dialogue.
3. **Show the fear → delay → bigger-treatment loop, and the exits from it.** Exits include telling the dentist you are nervous, agreeing a stop signal, starting with a cleaning, and shorter visits. The clinical content needs review.
4. **Show embarrassment through the person, not the teeth.** For example, a character who covers their mouth when laughing or dodges photos. Recovery is an open laugh in the family photo.
5. **Anxiety is a stat that can fall** after good experiences, like graded exposure.

### 4.3 Gain and loss framing

- **Rothman and Salovey 1997** (*Psychol Bull* 121(1):3; doi 10.1037/0033-2909.121.1.3). Whether gain-framed or loss-framed appeals work better "depends, in part, on whether a behavior serves an illness-detecting or a health-affirming function." [V\*]
- **O'Keefe and Jensen 2007** (*J Health Commun* 12(7); doi 10.1080/10810730701615198). [V\*]
  - 93 studies, N = 21,656. Gain frames were slightly more persuasive for prevention (r = .03).
  - The advantage "appears attributable to a relatively large (and statistically significant) effect for messages advocating dental hygiene behaviors".
  - There was no difference for safer sex, skin-cancer prevention, or diet and nutrition.
- **Gallagher and Updegraff 2012** (*Ann Behav Med* 43(1):101–116; doi 10.1007/s12160-011-9308-7). [V\*]
  - 189 effect sizes from 94 studies. Gain frames increased prevention *behaviour* (r = 0.083, p = 0.002), especially skin-cancer prevention, smoking cessation and physical activity.
  - No framing effect on attitudes or intentions, or on detection behaviours.
- **Detection behaviours.** [V\*]
  - Loss-framed videos increased mammography uptake at 12 months (Banks et al. 1995, *Health Psychol*).
  - A 2021 cancer-messaging meta-analysis (doi 10.2196/27634) found loss frames improved detection behaviour (OR 0.76) but found no framing effects on attitudes or intentions.
  - O'Keefe and Jensen's 2009 meta-analysis on detection: details [UNVERIFIED].
- **Prevention example.** Gain-framed brochures got more beach-goers to request sunscreen (*Health Psychol* 1999; doi 10.1037/0278-6133.18.2.189). [V\*]

**Design rules**

1. Frame daily hygiene and diet messages as gains: comfortable eating, a confident smile in photos, money saved for a trip.
2. Check-ups partly serve detection, so a "small now vs. big later" loss frame may fit. Always pair it with efficacy, and A/B test it for effects on anxiety.
3. Framing effects are small. Mechanics and lived experience should do most of the work.

### 4.4 Present bias and the value of showing delayed consequences

- **Present-biased preferences** (O'Donoghue and Rabin 1999, "Doing It Now or Later", *AER* 89(1):103–124; doi 10.1257/aer.89.1.103) [citation V\*]. The model describes procrastination on tasks with immediate costs and delayed rewards [summary from background knowledge, UNVERIFIED]. A check-up fits exactly: money, time and fear now; benefits later.
- **Future self-continuity** (Hershfield 2011, *Annals NYAS* 1235:30–43). People make more choices that benefit their future self when that self seems similar, vivid and realistic, and positive. Seeing age-progressed renderings of themselves increased students' and working adults' allocations to hypothetical retirement savings (Hershfield et al. 2011, *J Mark Res*; doi 10.1509/jmkr.48.spl.s23). [V\*]
- **Habit formation** (Lally et al. 2010). Among 96 participants over 84 days, the median time to automaticity was 66 days, ranging from 18 to 254. [V\*, secondary summary]

**Design rules**

1. Compress time so delayed effects arrive within minutes of play.
2. Show the same sprite aged at checkpoints ("You at 45"), keeping continuity with the younger self.
3. Make habit formation visible: a habit bar fills over about two in-game months, then automates.
4. Express "cost now vs. cost later" as concrete personal events, not percentages.

### 4.5 Counterfactual and side-by-side comparison

- **Contrasting cases.** Cases that differ in one critical feature are shown side by side, and learners are prompted to name the difference. Comparing cases beats studying them one after another. Source: the Learning Design Alliance wiki, summarising Schwartz and Bransford 1998 and Alfieri, Nokes-Malach and Schunn 2013. [V\*]
  - Alfieri et al. 2013, *Educational Psychologist* 48(2):87–113; doi 10.1080/00461520.2013.775712 [citation V; effect size UNVERIFIED].
  - Gentner, Loewenstein and Thompson 2003, *J Educ Psychol* 95(2):393–408 [citation V].
- **Icon arrays** help people with low numeracy understand medical risks (Galesic, Garcia-Retamero and Gigerenzer 2009, *Health Psychol* 28(2):210–216; doi 10.1037/a0014474) [citation V; details UNVERIFIED].

**Design rules**

1. **"Twin life" replay.** Use the same random seed with one decision changed, for example check-ups every 6–12 months vs. avoidance. Show two cutaway houses side by side, years in sync, each with a running ledger of money, hours off work and days in pain.
2. Ask the player "What changed?" before revealing the answer.
3. Show the outcome distribution across 100 simulated lives as an icon array of 100 tiny pixel people.

### 4.6 One-page message rulebook

1. Pair every threat with an action that is doable and works.
2. Prefer one-time calls to action; turn repeated behaviours into habits.
3. No shaming, no gore, no scolding dentist. Welcome people back after long gaps.
4. Gain-frame prevention; for check-ups, test a detection-style frame paired with efficacy.
5. Bring consequences forward in time and make the future self vivid.
6. Teach through contrast: twin lives, one difference, and a prompt to name it.
7. Be transparent about the model: an optional "why" view and icon arrays after each life.
8. Show structural barriers (money, time, access) without blaming the player.

---

## 5. Pixel-art technical notes for a web game

### 5.1 Native resolution and integer scaling

| Base | ×2 | ×3 | ×4 | ×5 | ×6 | ×8 | Exact fits |
|---|---|---|---|---|---|---|---|
| **320×180** | 640×360 | 960×540 | 1280×720 | 1600×900 | 1920×1080 | 2560×1440 | 720p, 1080p, 1440p; 4K at ×12 |
| 384×216 | 768×432 | 1152×648 | 1536×864 | 1920×1080 | 2304×1296 | 3072×1728 | 1080p; 4K at ×10 |
| 480×270 | 960×540 | 1440×810 | 1920×1080 | 2400×1350 | 2880×1620 | 3840×2160 | 1080p, 4K |
| 640×360 | 1280×720 | 1920×1080 | 2560×1440 | 3200×1800 | 3840×2160 | — | 720p, 1080p, 1440p, 4K |

- **Recommendation: 320×180 landscape** (a 20×11.25 grid of 16-px tiles).
  - Draw the cutaway as three floors of 48 px (144 px) plus 36 px for roof, sky and HUD.
  - Characters of about 16×24 px; furniture 16–32 px.
- **Phones in portrait:** a 180×320 layout works. On a 1080×2340 screen, ×6 gives 1080×1920 with letterboxing.
- **Laptops at 1366×768:** ×4 gives 1280×720, with bars.
- Commonly cited game resolutions, such as Celeste at 320×180, are [UNVERIFIED].

**How to scale**

- Keep the canvas backing store at native resolution.
- Scale by the largest integer that fits the viewport in device pixels.
- Letterbox the remainder.
- Snap sprites to whole pixels.

```js
const BASE_W = 320, BASE_H = 180;
const canvas = document.querySelector('canvas');
canvas.width = BASE_W; canvas.height = BASE_H;   // native backing store
const ctx = canvas.getContext('2d');
function fit() {
  const dpr = window.devicePixelRatio || 1;
  const scale = Math.max(1, Math.floor(Math.min(innerWidth * dpr / BASE_W, innerHeight * dpr / BASE_H)));
  canvas.style.width  = (BASE_W * scale / dpr) + 'px';  // => BASE_W*scale device pixels
  canvas.style.height = (BASE_H * scale / dpr) + 'px';
  ctx.imageSmoothingEnabled = false;                    // re-assert after any canvas reset
}
addEventListener('resize', fit); fit();
```

```css
canvas { image-rendering: pixelated; }  /* nearest-neighbour upscaling */
body   { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #1a1c2c; }
```

**Verified details**

- **`image-rendering`** (MDN content on GitHub) [V].
  - `pixelated` scales with nearest neighbour to the nearest integer multiple, then smooths the remainder. Non-integer scales therefore get slightly soft edges; integer scaling avoids that.
  - `crisp-edges` uses nearest-neighbour-type algorithms to preserve edges.
  - The property only affects scaled images.
- **Browser support** (MDN browser-compat-data) [V].
  - `pixelated`: Chrome 41, Firefox 93, Safari 10.
  - `crisp-edges`: Firefox 65 (`-moz-` prefix from 3.6), Safari 7 (`-webkit-optimize-contrast` from 6), Chrome 148 (`-webkit-optimize-contrast` from 13).
- **Canvas `imageSmoothingEnabled`** defaults to `true`. Set it to `false` so scaled sprites stay sharp. [V]
- **`devicePixelRatio`** is the ratio of physical pixels to CSS pixels; size canvases with it on high-DPI screens. [V]
- **Phaser** `pixelArt: true` uses nearest-neighbour texture filtering and sets `antialias: false` and `roundPixels: true` (Phaser `Config.js`). [V]
- **Text:** canvas `fillText` is anti-aliased. For crisp text inside the canvas, use a bitmap font atlas, or render DOM text overlays at integer-scaled pixel-font sizes. This is practical guidance rather than a sourced claim.

### 5.2 Free cozy palettes on Lospec

| Palette | Creator | Colours | Notes |
|---|---|---|---|
| **Sweetie 16** | GrafxKid | 16 | TIC-80's default palette. Hex: `1a1c2c 5d275d b13e53 ef7d57 ffcd75 a7f070 38b764 257179 29366f 3b5dc9 41a6f6 73eff7 f4f4f4 94b0c2 566c86 333c57` (from the TIC-80 wiki). [V] |
| **Resurrect 64** | Kerrie Lake | 64 | Wide, warm ramps suited to interiors. [V] |
| **Pear36** | PineappleOnPizza | 36 | Soft and friendly; about 82k downloads on Lospec at the time of search. [V] |
| **vanilla milkshake** | Space Sandwich | 16 | Soft pastel: lavender, coral pink, sage, peach, cream, warm beige. Description taken from a third-party theme repo. [V\*] |
| **Apollo** | AdamCYounis | Count [UNVERIFIED] | Naturalistic ramps. [V] |
| **ENDESGA 32** | ENDESGA | 32 | Very popular but high saturation and contrast, so less "cozy". [V\*] |

**Licence note.** A search snippet from Lospec's palette list says palettes are "free for any use - it's just colors (crediting authors is optional)". The page itself could not be opened [V\*]. Credit the palette authors on the About screen anyway. For accessibility, check text contrast and never signal health states by colour alone; add icons or patterns.

### 5.3 Open pixel fonts on Google Fonts

All six fonts are in the google/fonts `ofl/` directory, and their METADATA lists `license: "OFL"`. Pixelify Sans's OFL.txt confirms "SIL OPEN FONT LICENSE Version 1.1". [V]

| Font | Designer | Added to Google Fonts | Notes |
|---|---|---|---|
| **Pixelify Sans** | Stefie Justprince | 2023-09-13 | Variable weight 400–700; Latin, Latin Extended, Cyrillic. Good for UI and body text. |
| **Silkscreen** | Jason Kottke | 2022-06-23 | Regular 400 and Bold 700. Designed for small web type; also works large. |
| **Press Start 2P** | CodeMan38 | 2012-04-04 | Based on 1980s Namco arcade fonts. Best at 8, 16, or other multiples of 8 px. Use for headings. |
| **VT323** | Peter Hull | 2011-03-02 | Monospace, from DEC VT320 terminal glyphs with a simulated CRT smear. Good for ledgers and numbers. |
| **Tiny5** | Stefan Schmidt | 2024-04-19 | 5-pixel-high, variable-width; Latin, Greek, Cyrillic. For tiny labels. A "Tiny5 Duo" family was added 2026-09-03. |
| **Jersey 10** | Sarah Cadigan-Fried | 2024-02-23 | The number is the cap height in pixels. From a knitting-chart family (Jersey 10/15/20/25, plus "Charted" versions). Sporty display face. |

---

## Sources

**Section 1: games** (facts confirmed from these pages via web-search text)
- BitLife: https://bitlife-life-simulator.fandom.com/wiki/BitLife:_Life_Simulator ; https://handwiki.org/wiki/Software:BitLife
- The Sims: https://en.wikipedia.org/wiki/The_Sims_(video_game) ; https://forums.ea.com/discussions/the-sims-4-general-discussion-en/sims-1-type-cutaway-walls/309286/replies/309306
- Little Computer People: https://en.wikipedia.org/wiki/Little_Computer_People ; https://c64universe.com/2025/06/18/little-computer-people-1985-activision/
- Tiny Tower: https://en.wikipedia.org/wiki/Tiny_Tower
- Game Dev Story and Kairosoft: https://kairosoft.wiki.gg/wiki/Game_Dev_Story ; https://en.wikipedia.org/wiki/Game_Dev_Story ; https://www.pockettactics.com/kairosoft-history
- Dream House Days: https://kairosoft.fandom.com/wiki/Dream_House_Days ; https://www.nintendo.com/us/store/products/dream-house-days-dx-switch/
- Fallout Shelter: https://en.wikipedia.org/wiki/Fallout_Shelter
- Unpacking: https://en.wikipedia.org/wiki/Unpacking_(video_game) ; https://www.thelamron.com/arts-and-entertainment/unpacking-2021-storytelling-in-details
- The Oregon Trail: https://en.wikipedia.org/wiki/The_Oregon_Trail_(1971_video_game) ; https://www.carleton.edu/news/stories/carl-creators-of-oregon-trail-celebrate-50th-anniversary/
- Reigns: https://en.wikipedia.org/wiki/Reigns_(video_game) ; https://www.appunwrapper.com/2016/08/17/interview-with-reigns-developer-francois-alliot/
- Spent: https://en.wikipedia.org/wiki/Spent_(video_game) ; https://playspent.org/ ; https://www.wunc.org/business-economy/2014-07-30/spent-hit-game-about-money-and-resources-goes-mobile
- Papers, Please: https://en.wikipedia.org/wiki/Papers,_Please ; https://www.gamedeveloper.com/design/designing-the-bleak-genius-of-i-papers-please-i-
- Florence: https://en.wikipedia.org/wiki/Florence_(video_game) ; https://annapurnainteractive.com/games/florence
- Before Your Eyes: https://en.wikipedia.org/wiki/Before_Your_Eyes ; https://store.steampowered.com/app/1082430/Before_Your_Eyes/
- Passage: https://www.moma.org/collection/works/145533 ; https://hcsoftware.sourceforge.net/passage/statement.html
- Cookie Clicker: https://en.wikipedia.org/wiki/Cookie_Clicker
- Universal Paperclips: https://en.wikipedia.org/wiki/Universal_Paperclips ; http://www.franklantz.net/universal-paperclips/
- A Dark Room: https://press.doublespeakgames.com/adr/index.html ; https://en.wikipedia.org/wiki/A_Dark_Room
- Stardew Valley: https://en.wikipedia.org/wiki/Stardew_Valley ; https://www.stardewvalley.net/press/
- Tamagotchi: https://en.wikipedia.org/wiki/Tamagotchi ; https://tamagotchi.fandom.com/wiki/Tamagotchi_(1996_Pet)
- Plague Inc.: https://en.wikipedia.org/wiki/Plague_Inc. ; https://plagueinc.fandom.com/wiki/Ndemic_Creations
- Princess Maker: https://en.wikipedia.org/wiki/Princess_Maker_(video_game)
- Alter Ego: https://en.wikipedia.org/wiki/Alter_Ego_(1986_video_game) ; https://www.hardcoregaming101.net/alter-ego/
- Real Lives: https://en.wikipedia.org/wiki/Real_Lives_(video_game)
- The Evolution of Trust: https://github.com/ncase/trust
- Packy & Marlon: https://pubmed.ncbi.nlm.nih.gov/9183781/
- Re-Mission: https://en.wikipedia.org/wiki/Re-Mission ; https://clinicaltrials.gov/study/NCT00425139

**Section 2: dental games and apps**
- Plaque Attack: https://en.wikipedia.org/wiki/Plaque_Attack ; https://www.atarimania.com/games/atari-2600-games-plaque-attack-7755
- Tooth Protectors: https://en.wikipedia.org/wiki/Tooth_Protectors ; https://atariage.com/software_page.php?SoftwareLabelID=564
- Toothsavers: https://www.prnewswire.com/news-releases/new-gaming-app-inspires-kids-to-brush-two-minutes-twice-a-day-240284891.html ; https://www.2min2x.org/toothsavers/
- Brush DJ: https://www.nature.com/articles/sj.bdj.2015.660 ; https://www.plymouth.ac.uk/news/two-apps-a-day-keep-the-dentist-away
- Disney Magic Timer: https://www.mobihealthnews.com/news/oral-b-disney-launch-health-app-extend-brushing-time-kids ; https://oralb.com/en-us/disney-magic-timer/
- Colgate Magik: https://www.shropshirestar.com/news/science/augmented-reality-used-in-new-colgate-kids-toothbrush-6547498
- Pokémon Smile: https://en.wikipedia.org/wiki/Pok%C3%A9mon_Smile ; https://www.nintendolife.com/news/2020/06/pokemon_smile_is_a_new_free_app_designed_to_provide_a_fun_toothbrushing_experience
- Tiffany et al. 2018: https://mhealth.jmir.org/2018/9/e11432/ ; https://pubmed.ncbi.nlm.nih.gov/30181114/
- App quality (MARS): https://www.nature.com/articles/s41415-019-0665-0 ; https://mhealth.jmir.org/2021/1/e19958/ ; https://pubmed.ncbi.nlm.nih.gov/42021819/
- Dental-anxiety tools:
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC7885165/
  - https://journals.plos.org/digitalhealth/article?id=10.1371%2Fjournal.pdig.0000690
  - https://pubmed.ncbi.nlm.nih.gov/40514778/
  - https://pubmed.ncbi.nlm.nih.gov/26202996/
  - https://bmcoralhealth.biomedcentral.com/articles/10.1186/s12903-016-0186-z
  - https://arxiv.org/pdf/2609.15867
  - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9817252/
- Board game for adults with intellectual disability: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7908306/

**Section 3: oral-health evidence**
- Fijačko 2020: https://mhealth.jmir.org/2020/7/e16365/
- Gamification in children's oral health (2025): https://www.jmir.org/2025/1/e75541
- Scoping review (2024): https://www.i-jmr.org/2024/1/e35132
- Patient-oriented apps scoping review (2023): https://mhealth.jmir.org/2023/1/e46143
- Other reviews: https://pmc.ncbi.nlm.nih.gov/articles/PMC10036826/ ; https://pubmed.ncbi.nlm.nih.gov/36882496 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC13408725/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC13409649/
- Trials (source text read through GitHub mirrors of PMC XML at https://github.com/choxos/dentalcariestrials):
  - Zolfaghari 2021: https://pmc.ncbi.nlm.nih.gov/articles/PMC7791794/ (its reference list confirms the Toniazzo 2019 and Fijačko 2020 citations)
  - Shirmohammadi 2022: https://pmc.ncbi.nlm.nih.gov/articles/PMC9287817/
  - Scheerman 2020: https://pmc.ncbi.nlm.nih.gov/articles/PMC7004072/
- Musa 2024 protocol (describes Toniazzo's findings): https://pmc.ncbi.nlm.nih.gov/articles/PMC11325127/ (mirror: https://github.com/A1C1NY/tooth_VLM_APP)
- General gamification effect sizes (secondary): https://github.com/andrlut/perceva/blob/3ccf471abb07a10cc32b769cdfcceb47bc5d1c37/docs/brand/research/evid-recompensas.md ; DOIs 10.2196/26779, 10.1016/j.invent.2016.10.002, 10.1007/s10648-019-09498-w

**Section 4: health communication**
- Witte 1992 (abstract): https://github.com/myndtrust/CMU-Thesis-master/blob/b922c40208b7af6bdca9db9a7718c3cfea7015d5/content/references_from_template.bib
- Tannenbaum 2015 (abstract): https://github.com/Henry-Ash-Williams/ANLE-Propaganda/blob/a5bcc397ae6bed680946cb9d3a3f08b4adf3c4b6/writeup/references.bib ; https://doi.org/10.1037/a0039729
- Kok et al. 2018 (full text): https://github.com/qpec/Altmetric_17K_Top_Articles (file "Kok et al. - 2018 - Ignoring theory and misinterpreting evidence the .txt")
- Moore et al. 2004: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC411042/ (read via https://github.com/UCLA-BD2K/heartCases)
- Armfield vicious cycle and ADHS 2009 figures, as cited in https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3978097/ (mirror: https://github.com/choxos/funded-trials)
- Silveira 2021 prevalence, as cited in https://pmc.ncbi.nlm.nih.gov/articles/PMC10288821/
- Framing abstracts (OpenAlex dump): https://github.com/Moranetz/closing-evidence-atlas
  - O'Keefe and Jensen 2007: doi 10.1080/10810730701615198
  - Gallagher and Updegraff: doi 10.1007/s12160-011-9308-7
  - Rothman and Salovey 1997: doi 10.1037/0033-2909.121.1.3
  - Banks 1995: doi 10.1037//0278-6133.14.2.178
  - Sunscreen study 1999: doi 10.1037/0278-6133.18.2.189
  - Cancer framing meta-analysis 2021: doi 10.2196/27634
- O'Donoghue and Rabin 1999: doi 10.1257/aer.89.1.103
- Hershfield 2011 (Annals NYAS text): https://github.com/powxenv/arcus/blob/56611cd2e838db02526c646cad452affd09516c4/research/sources/hershfield2011.txt ; Hershfield et al. 2011 *J Mark Res*: doi 10.1509/jmkr.48.spl.s23
- Lally 2010 (secondary summary): https://github.com/4444J99/styx-public (docs/thesis/02-literature-review.md)
- Contrasting cases: https://github.com/Learning-Design-Alliance/learning-wiki/blob/91f6dae22d285b290e22673b6b5b823012d573d6/strategies/contrasting-cases.md ; Alfieri 2013: doi 10.1080/00461520.2013.775712 ; Gentner 2003: doi 10.1037/0022-0663.95.2.393
- Galesic 2009: doi 10.1037/a0014474

**Section 5: technical**
- MDN image-rendering: https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/properties/image-rendering/index.md ; https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
- Browser compatibility data: https://github.com/mdn/browser-compat-data/blob/main/css/properties/image-rendering.json
- imageSmoothingEnabled: https://github.com/mdn/content/blob/main/files/en-us/web/api/canvasrenderingcontext2d/imagesmoothingenabled/index.md
- devicePixelRatio: https://github.com/mdn/content/blob/main/files/en-us/web/api/window/devicepixelratio/index.md
- Phaser config: https://github.com/phaserjs/phaser/blob/master/src/core/Config.js
- Palettes: https://lospec.com/palette-list/sweetie-16 ; https://lospec.com/palette-list/resurrect-64 ; https://lospec.com/palette-list/pear36 ; https://lospec.com/palette-list/vanilla-milkshake ; https://lospec.com/palette-list/apollo ; https://lospec.com/palette-list/user/endesga ; https://lospec.com/palette-list
- Palette authors and colours: https://github.com/nesbox/TIC-80/wiki/palette ; https://github.com/mdgriffith/elm-all-docs (rafraser.elm-lospec docs)
- Fonts: https://github.com/google/fonts/tree/main/ofl/ (folders pixelifysans, silkscreen, pressstart2p, vt323, tiny5, jersey10) ; https://fonts.google.com/

## Verification log and open items

- **Unverified and worth checking before external use:**
  - Launch years for Disney Magic Timer, Colgate Magik and Dream House Days.
  - The Sims thought-bubble detail and the Papers, Please ledger line items.
  - Findings of the 2024 and 2025 gamification reviews, Fernández 2021, and Toniazzo's pooled effect sizes.
  - Alfieri's effect size.
  - The content summary of O'Donoghue and Rabin (only the citation was confirmed).
  - The Celeste resolution example.
  - Apollo's colour count.
- **Top follow-ups:**
  1. Get the full text of the JMIR 2025 review on gamification in children's oral health and the 2024 scoping review.
  2. Collect country-specific data on dental costs and disease progression to parameterise the hidden model.
  3. Have clinicians review the anxiety-management content and the dentist character's scripts.
