# Avoid the Dentist: Clinical Evidence Parameters

Research date: 2026-09-24. Purpose: literature-grounded parameters for the hidden life-course model (teeth, gums, pain, money over ~80 years). Numbers over prose.

## Read this first: verification status

- **WebFetch was egress-blocked** for every literature domain tried (PubMed, PMC, Europe PMC, Cochrane Library, cochrane.org, Springer, PLOS, Nature, CDC, Wikipedia). All verification came from **WebSearch result extracts** (search-engine summaries of abstracts and pages), not from opening the primary papers. Treat [V] as "confirmed against an abstract-level summary", not "read in full text".
- **The session's shared WebSearch budget (200 calls) ran out part-way through Topic 4.** Everything after that point (late Topic 4, all of Topics 5-9, most of 10-13) comes from prior knowledge of the literature and is tagged UNVERIFIED. For those rows the URL is a PubMed/Scholar **search link**, not a specific record, so that no record is invented.

| Tag | Meaning |
|---|---|
| [V] | Figure appeared in search-result text attributed to that source this session |
| [V-partial] | Figure seen in search text, but exact attribution or CI not fully pinned down |
| [UNVERIFIED, recall high/med/low] | Not web-checked. From prior knowledge; recall confidence stated. Confirm before shipping |
| [DESIGN] | My modelling assumption or conversion, not a literature value |

Evidence labels: **Strong** = consistent, moderate/high-certainty systematic review (SR) or landmark evidence; **Moderate** = decent SR or cohorts with limitations; **Emerging-Mixed** = low certainty, conflicting, or single study.

Conversion rules [DESIGN]:
- Prevented fraction (PF) to hazard multiplier: `m = 1 - PF`.
- OR to RR when baseline risk p0 is not rare: `RR = OR / (1 - p0 + p0*OR)`. Example: ECC with p0 = 0.3 and OR 2.0 gives RR 1.54.
- Multipliers combine multiplicatively on an age-specific baseline hazard unless stated.

---

## 0. Calibration targets (population baselines)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| ECC prevalence, global, <6 y | 48% | - | Uribe et al. 2021, Int J Paediatr Dent (WHO criteria; 125 studies) | https://onlinelibrary.wiley.com/doi/10.1111/ipd.12783 | Strong [V] |
| US children 2-5 y with caries experience (2011-16) | 23% | untreated 10% | CDC Oral Health Surveillance Report 2019 | https://www.cdc.gov/oral-health/media/pdfs/2024/07/Oral-Health-Surveillance-Report-2019-Web-h.pdf | Strong [V] |
| US untreated decay, permanent teeth, by age (2017-Mar 2020) | 3% (6-11 y), ~22% (20-34 y), 13% (65+ y) | - | CDC Oral Health Surveillance Report 2024 | https://www.cdc.gov/oral-health/php/2024-oral-health-surveillance-report/selected-findings.html | Strong [V] |
| US edentulism by age | 1.2% (35-49), 5.9% (50-64), 11.4% (65-74), 19.7% (75+) | 65+: current smokers 29.4%, high poverty 29.8%, <high school 33.4% | CDC OHSR 2024 | same | Strong [V] |
| US mean permanent teeth by age | 27 (20-34), 23.3 (50-64), 21.7 (65-74), 19.8 (75+) | - | CDC OHSR 2024 | same | Strong [V] |
| Pregnancy gingivitis | 60-75% of pregnant women | 47-89% across countries | CDC clinician guidance | https://www.cdc.gov/oral-health/hcp/conversation-tips/talking-to-pregnant-women-about-oral-health.html | Moderate [V] |
| Adult dental fear | 15% | 12-19% | Silveira et al. 2021, J Dent | https://pubmed.ncbi.nlm.nih.gov/?term=Silveira+2021+prevalence+dental+fear+adults+meta-analysis | Moderate [UNVERIFIED, recall med] |
| Traumatic dental injury (TDI), lifetime prevalence | permanent 15.2%, primary 22.7% | incidence 2.82/100 person-yr | Petti, Glendor & Andersson 2018, Dent Traumatol | https://pubmed.ncbi.nlm.nih.gov/?term=Petti+Glendor+Andersson+2018+one+billion+traumatic+dental+injuries | Strong [UNVERIFIED, recall high] |

---

## 1. Caries risk factors

### 1a. Fluoride, brushing, sealants, xylitol

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Fluoride toothpaste vs none, children/adolescents (caries-increment multiplier) | 0.76 (PF 24%) | 0.72-0.79 (PF 21-28%); 70 trials, 42,300 children | Marinho et al. 2003, Cochrane CD002278 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002278/full | Strong [V] |
| Fluoride toothpaste 1000-1100 ppm vs non-F, adults | DMFS increment -0.53 surfaces over trial period; use multiplier ~0.8 [DESIGN] | MD -1.02 to -0.04; 3 trials, 2,162 adults | Walsh et al. 2019, Cochrane CD007868.pub3 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007868.pub3/full | Moderate [V] |
| Higher-F paste (1450-1500+ ppm) vs 1000 ppm | extra multiplier ~0.9-0.95 [DESIGN] | dose-response confirmed in children; size not verified | Walsh et al. 2019 | same | Moderate [V existence; size UNVERIFIED] |
| Fluoride varnish (2-4x/yr), permanent teeth | 0.57 (PF 43%) | 0.43-0.70 (PF 30-57%); 13 trials | Marinho et al. 2013, Cochrane CD002279.pub2 (22 trials, 12,455 children) | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002279.pub2/full | Moderate [V] (moderate quality, high heterogeneity) |
| Fluoride varnish, primary teeth | 0.63 (PF 37%) | 0.49-0.76; 10 trials | same | same | Moderate [V] |
| Community water fluoridation (CWF), historic (mostly pre-1975) | dmft -35%, DMFT -26%; +15 percentage points (pp) caries-free (primary) | dmft -1.81 (1.31-2.31; 9 studies); DMFT -1.16 (0.72-1.61; 10 studies); caries-free +11 to +19 pp | Iheozor-Ejiofor et al. 2015, Cochrane CD010856.pub2 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010856.pub2/full | Moderate [V] (non-randomised, high risk of bias) |
| CWF, modern era (post-1975, with toothpaste fluoride) | dmft -0.24, DMFT -0.27 per child; caries-free +4 pp (primary), +3 pp (permanent); model multiplier ~0.90-0.95 [DESIGN] | dmft: 2 studies, 2,908 children; DMFT: 4 studies, 2,856; pre-1975 dmft -2.1 | Iheozor-Ejiofor et al. 2024, Cochrane CD010856.pub3 (157 non-randomised studies) | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010856.pub3/full ; summary: https://www.colgateoralhealthnetwork.com/article/further-updates-on-water-fluoridation-2024/ | Emerging-Mixed [V] (low certainty) |
| Brushing <2/day vs >=2/day | OR 1.45, i.e. RR ~1.3 [DESIGN conversion] | 1.21-1.74 | Kumar, Tadakamadla & Johnson 2016, J Dent Res 95:1230 (33 studies) | https://journals.sagepub.com/doi/abs/10.1177/0022034516655315 | Moderate [V] |
| Brushing <1/day vs >=1/day | OR 1.56, i.e. RR ~1.35 [DESIGN] | 1.37-1.78; any infrequent vs frequent OR 1.50 (1.34-1.69); increment SMD 0.28 (0.13-0.44) | same | same | Moderate [V] |
| Infrequent brushing, by dentition | primary OR 1.75; permanent OR 1.39 | 1.49-2.06; 1.29-1.49 | same | same | Moderate [V]. Caveat: self-reported and confounded by fluoride exposure: https://pubmed.ncbi.nlm.nih.gov/28088263/ |
| Resin sealant, molar occlusal surface (children) | OR 0.12 at 24 mo (40% of surfaces decayed without sealant falls to 6.25%); use x0.2-0.3 while retained [DESIGN] | 0.08-0.19 (7 trials, 1,548 children); absolute reduction 11-51 pp; benefit similar to 48 mo; persists to 9 yr (sparse data) | Ahovuo-Saloranta et al. 2017, Cochrane CD001830.pub5 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001830.pub5/full | Moderate [V] |
| Sealant retention loss | ~5-10% of sealants lost per year [DESIGN] | not verified | (retention data are in the Cochrane review but could not be opened) | - | [UNVERIFIED] |
| Xylitol (10% in F toothpaste vs F toothpaste) | 0.87 (-13%); recommend ~1.0 in-game (weak evidence) | 2 trials in the same Costa Rican population, 4,216 children, 2.5-3 yr; no conclusion for gum, syrups, lozenges or adults | Riley et al. 2015, Cochrane CD010743.pub2 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010743.pub2/abstract | Emerging-Mixed [V] (low / very low certainty) |

### 1b. Sugar and diet

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Free sugars <10% of energy | lower caries; <5% may add benefit | - | Moynihan & Kelly 2014, J Dent Res 93:8 (basis of WHO guideline) | https://journals.sagepub.com/doi/10.1177/0022034513508954 | Moderate [V] |
| Sugar-sweetened beverages (SSB) 1-2/day vs none, adults | x1.31 DMFT increment | 4 yr, n=939 Finnish adults; holds among fluoride-toothpaste users | Bernabé et al. 2014, J Dent 42:952 | https://pubmed.ncbi.nlm.nih.gov/24813370 | Moderate [V] |
| SSB >=3/day vs none, adults | x1.33 | (threshold-like, not linear) | same | same | Moderate [V] |
| Amount vs frequency, adults | amount (not frequency) predicted DMFT in mutually adjusted model; linear dose-response; weaker in daily F-toothpaste users | n=1,702, 11 yr | Bernabé et al. 2016, J Dent Res | https://journals.sagepub.com/doi/10.1177/0022034515616572 | Moderate [V] |
| Amount vs frequency, review | frequency and stickiness fit the mechanism; cutting amount without cutting frequency looks ineffective; with good fluoride use the sugar-caries link is "very low or absent" | - | van Loveren 2019, Caries Res 53:168 | https://karger.com/cre/article/53/2/168/97265/Sugar-Restriction-for-Caries-Prevention-Amount-and | Emerging-Mixed [V] |
| Frequency vs quantity, ages 2-18 | frequency was the stronger determinant; 32/37 studies positive | 34/37 cross-sectional; n=59,383 | Pombo-Lopes et al. 2026, BMC Public Health | https://link.springer.com/article/10.1186/s12889-026-27780-9 | Emerging-Mixed [V] |
| Sugar intake in early childhood leading to ECC | OR 1.59, i.e. RR ~1.35 [DESIGN] | 1.50-1.68 (9 of 17 cohorts pooled) | Echeverria et al. 2025, SR/MA of cohort studies | https://pubmed.ncbi.nlm.nih.gov/41259577/ | Moderate [V-partial] |
| Frequent between-meal snacking (sugar or cooked starch) | OR ~1.6 | - | quoted in search extract; primary source not pinned down | https://pmc.ncbi.nlm.nih.gov/articles/PMC4439697/ | Emerging-Mixed [V-partial] |
| Sticky sugar between meals (Vipeholm) | largest DMF increases; extra sugar at mealtimes caused small increases | 1945-53 institutional study, ethically indefensible | Gustafsson 1954; recollection: Krasse 2001, J Dent Res | https://journals.sagepub.com/doi/10.1177/00220345010800090201 | Strong (historic) [V] |
| Stephan curve: time to fall below pH 5.5 | 2-5 min | nadir at 5-20 min | Stephan 1944; dentalcare.com CE course | https://www.dentalcare.com/en-us/ce-courses/ce713/stephan-curve | Strong [V] |
| Stephan curve: time below critical pH per exposure | 30 min | 20-40 min; back to baseline in 30-60 min | same | same | Strong [V] (varies with plaque, saliva, food form) |

### 1c. Host, appliance, microbial and history factors

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Polypharmacy leading to dry mouth | OR 1.38 (4-6 drugs), 2.07 (7-10), 3.34 (>=11) vs 0-3 | - | quoted in SR/MA of multimorbidity, polypharmacy and oral conditions in older adults | https://pmc.ncbi.nlm.nih.gov/articles/PMC13498933/ | Moderate [V-partial] |
| Xerogenic drug classes | urologic antimuscarinics, antidepressants and psycholeptics most consistently implicated | - | Tan et al. 2018, J Am Geriatr Soc | https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.15151 | Moderate [V] |
| Hyposalivation (stimulated flow <0.7 mL/min) leading to root caries | OR 18.5 in a single study; use x2-3 [DESIGN] | 95% CI 2.0-172.8 | Risk indicators for root caries in independently living older adults, J Dent 2016 | https://www.sciencedirect.com/science/article/pii/S0300571216300926 | Emerging-Mixed [V-partial] |
| Multimorbidity count and root caries | OR 1.26 | 1.03-1.52 | NHANES analysis (older US adults) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12191492/ | Emerging [V] |
| Head and neck radiotherapy | xerostomia >80%; caries prevalence 24% after RT, 21% after chemoradiation | MASCC/ISOO review | summary of the MASCC/ISOO review (Dimensions of Dental Hygiene) | https://dimensionsofdentalhygiene.com/article/addressing-xerostomia-patients-undergoing-treatment-head-neck-cancer/ | Moderate [V-partial] |
| Fixed orthodontic appliances leading to white spot lesions | 45.8% of patients develop new WSL during treatment (per treatment course) | prevalence during treatment 68.4%; 14 studies | Sundararaj et al. 2015, J Int Soc Prev Community Dent 5:433 | https://doi.org/10.4103/2231-0762.167719 | Moderate [V] |
| Past caries experience | strongest single predictor at every age; use x2-3 [DESIGN] | preschool: sensitivity 0.21-0.94, specificity 0.20-1.0 | Mejàre et al. 2014, Acta Odontol Scand (SR) | https://medicaljournalssweden.se/actaodontologica/article/download/37073/42196/94621 | Strong (association) / Moderate (accuracy) [V] |
| Caries in primary teeth predicting caries in permanent teeth | RR 2.6 | 1.4-4.7; n=362, 8 yr; primary molar caries most predictive | Li & Wang 2002, J Dent Res 81:561 | https://doi.org/10.1177/154405910208100812 | Moderate [V] |
| Mutans streptococci (MS) in caries-free preschoolers | RR 3.85 (plaque test); 2.11 (saliva test) | 2.48-5.96; 1.47-3.02 | Thenisch et al. 2006, Caries Res 40:366 | https://pubmed.ncbi.nlm.nih.gov/16946603/ | Moderate [V] |
| MS count predicting future ECC | OR 4.13, i.e. RR ~2.5 [DESIGN] | 3.33-5.12; prediction interval 2.80-6.08; 12 studies | Manchanda et al. 2023, BMC Oral Health 23:648 | https://bmcoralhealth.biomedcentral.com/articles/10.1186/s12903-023-03346-8 | Moderate [V] |

### Topic 1 model notes [DESIGN]
- **"Acid clock" mechanic**: each sugar exposure is about 30 min below pH 5.5 (range 20-40, verified). Daily acid-minutes = exposures x 30. A bedtime exposure could count about x2 because salivary flow falls sharply during sleep [UNVERIFIED rationale].
- **Sugar multiplier**: any daily SSB or between-meal sugar habit x1.3 (Bernabé 2014); a high-frequency grazer (>=4 between-meal exposures/day) x1.6-2.0. Halve the excess (m-1) when the player brushes 2x/day with F toothpaste (Bernabé 2016; van Loveren 2019).
- Fluoride toothpaste 0.76; varnish 0.57 permanent / 0.63 primary; modern CWF ~0.93; sealed occlusal surface ~0.25 while retained.

---

## 2. Caries progression

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Sound surface to enamel lesion (approximal, age 11-22) | 3.9 new lesions/100 surface-yr | 75% of sound surfaces still lesion-free at 6.3 yr | Mejàre et al. 1999, Caries Res 33:93 (n=536, annual bitewings, Sweden) | https://karger.com/Article/Abstract/16502 | Moderate [V] |
| Enamel-lesion incidence by age | 4.3/100 surface-yr (12-15 y), falling to 2.7 (20-27 y) | - | Mejàre et al. 2004, Caries Res (15-yr cohort) | https://pubmed.ncbi.nlm.nih.gov/14767170/ | Moderate [V] |
| Inner enamel to outer dentin | 5.4/100 surface-yr | 75% not yet in dentin at 4.8 yr | Mejàre et al. 1999 | https://karger.com/Article/Abstract/16502 | Moderate [V] |
| Enamel-dentin junction (EDJ) just broken to obvious outer-dentin lesion | 20.3/100 surface-yr (all ages) | 32.5 (age 12-15) vs 10.9 (age 20-27) | Mejàre 1999; Mejàre 2004 | both above | Moderate [V] |
| Median time, untreated approximal enamel lesion to dentin | 73 months (~6 yr), i.e. ~11%/yr [DESIGN conversion] | - | quoted in "The dynamic behavior of the early dental caries lesion in caries-active adults" (2015) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4418491/ | Moderate [V] |
| Enamel lesions not reaching dentin within 11 yr | 86% with CWF; 65% without | - | same | same | Moderate [V] |
| High-risk adults, initial proximal lesions | 30.8% progressed over 0.5-6 yr; no enamel lesion reached inner dentin; 12/43 (28%) outer-dentin lesions reached inner dentin | 364 lesions, 105 adults aged 18-61 | Rate of initial proximal caries lesion progression in high caries-risk adults (2026) | https://pubmed.ncbi.nlm.nih.gov/42409382/ | Emerging [V] |
| Surface to EDJ, adolescent vs young adult | 26.4 mo (14-15 y) vs 32.3 mo (21-24 y) | 96 lesions in 51 patients | Arch Oral Biol 1976, longitudinal radiographic study | https://www.sciencedirect.com/science/article/abs/pii/0003996976900170 | Emerging [V-partial] |
| Primary molars, time through enamel | ~12 mo outer half + 10-12 mo inner half | US and Swedish cohorts | Shwartz et al. 1984, Arch Oral Biol 29:529 | https://www.sciencedirect.com/science/article/abs/pii/0003996984900748 | Moderate [V] |
| Primary teeth: outer enamel to EDJ; EDJ to inner dentin | 0.8 yr; then +1.4 yr | retrospective | J Clin Pediatr Dent 2017, "Caries progression rate in primary teeth" | https://www.jocpd.com/articles/10.17796/1053-4628-41.5.358 | Emerging [V] |
| Newly erupted first permanent molars (approximal) | 21-23 mo through outer enamel; 19 (US) to 28 (Sweden) mo through inner enamel | - | Shwartz et al. 1984 (as extracted) | same as Shwartz | Moderate [V-partial] |
| Unrestored carious primary teeth causing pain before exfoliation | 18% (82% exfoliate painlessly) | including symptomless extractions: 74% exfoliated painlessly; mean survival 1,332 days | Levine, Pitts & Nugent 2002, Br Dent J 193:99 (1,587 teeth) | https://www.nature.com/articles/4801495 | Moderate [V] |
| Permanent tooth, inner dentin to pulpitis/symptoms | 15-30%/yr [DESIGN placeholder] | no suitable cohort found | - | - | [UNVERIFIED] |

### Suggested state machine per surface [DESIGN, anchored to the rows above]
`Sound -> Enamel -> Outer dentin -> Inner dentin -> Pulpitis (pain) -> Necrosis/abscess`

| Transition (permanent, approximal) | Annual probability |
|---|---|
| Sound to enamel | 0.027-0.043 x risk multipliers (verified range) |
| Enamel to outer dentin | 0.05-0.11 (verified/derived); x2-3 in ages 12-15 |
| Enamel lesion arrests (stays put) | 65-86% never progress over 11 yr (verified) |
| Outer to inner dentin | ~0.10 (28% over 0.5-6 yr, high-risk adults) |
| Inner dentin to pulpitis | 0.15-0.30 (placeholder, UNVERIFIED) |
| Primary teeth | ~x3 faster (range x2-5); 18% of carious primary teeth ever hurt |

---

## 3. Early childhood

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| ECC prevalence | 48% global; US 23% (10% untreated) | - | Uribe 2021; CDC 2019 | see Topic 0 | Strong [V] |
| Breastfeeding up to 12 mo (longer vs shorter) | OR 0.50 (protective) | 0.25-0.99 | Tham et al. 2015, Acta Paediatr (63 papers) | https://onlinelibrary.wiley.com/doi/10.1111/apa.13118 | Moderate [V] |
| Breastfeeding >12 mo vs <12 mo | OR 1.99, i.e. RR ~1.5 [DESIGN] | 1.35-2.95 (7 studies) | same | same | Moderate [V] |
| Nocturnal/frequent breastfeeding after 12 mo | OR 7.14, i.e. RR ~2.5 [DESIGN] | 3.14-16.23 (5 studies, I2 77%) | same | same | Emerging-Mixed [V] |
| Breastfed vs bottle-fed | OR 0.43 | 0.23-0.80 | Avila et al. 2015, PLoS One | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0142922 | Moderate [V] |
| Bedtime bottle with sugary liquid | consensus "strong risk factor"; use x2-2.5 [DESIGN] (nocturnal OR 7.14 as upper bound) | breastfeeding to age 2 not shown to raise risk | AAPD-commissioned SR 2019 | https://pubmed.ncbi.nlm.nih.gov/30931717/ | Moderate [V qualitative; size UNVERIFIED] |
| Early preventive dental visit (<1 y): favourable | mean dental costs as cited: $262 (first visit <1 y) vs $339 (1-2 y), $449 (2-3 y), $546 (later); more later preventive use | North Carolina Medicaid, 5-yr follow-up; selection bias likely | Savage et al. 2004, Pediatrics 114:e418 | https://www.aapd.org/assets/news/upload/2005/803.pdf | Emerging-Mixed [V-partial] |
| Early preventive dental visit: unfavourable | dentist-delivered early prevention linked to MORE caries-related treatment visits and spending; no link for primary-care-delivered prevention | Alabama Medicaid, high-dimensional propensity scores | Blackburn, Morrisey & Sen 2017, **JAMA Pediatrics** 171:335 (not *Pediatrics*) | https://jamanetwork.com/journals/jamapediatrics/fullarticle/2604749 | Emerging-Mixed [V] |
| AAPD first-visit guidance | at first tooth eruption, no later than 12 mo | - | AAPD Periodicity guideline | https://www.aapd.org/globalassets/media/policies_guidelines/bp_periodicity.pdf | Guideline [V] |
| MS acquisition "window of infectivity" | median 26 mo | 19-31 mo (n=38) | Caufield, Cutter & Dasanayake 1993, J Dent Res 72:37 | https://journals.sagepub.com/doi/10.1177/00220345930720010501 | Moderate [V] (later work reports earlier colonisation, UNVERIFIED detail) |
| C-section and MS timing | acquired 11.7 mo earlier (among infected infants) | p=0.038; n=156 pairs; maternal MS level, caries score, STD history and income also predicted acquisition | Li et al. 2005, J Dent Res 84:806 | https://doi.org/10.1177/154405910508400905 | Emerging [V] |
| C-section and ECC | OR 1.48; use x1.1 (range 1.0-1.2) [DESIGN] | 1.07-2.05; 11 studies (10,994 C-section vs 47,688 vaginal); median prevalence 56.4% vs 45.9%; authors: "weak trend, no firm association" | Boustedt et al. 2021, Eur Arch Paediatr Dent 22:765 | https://link.springer.com/article/10.1007/s40368-021-00621-6 | Emerging-Mixed [V] |
| Do not use: larger null meta-analysis | OR 1.05 (0.86-1.30), 24 studies | **retracted** | PLOS One 2024 | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0310405 | [V] retracted |
| Maternal oral health and the child's caries into adulthood | graded; highest when mother rated her oral health poor or was edentulous | Dunedin cohort, age 5 to 32; adjusted for SES and plaque | Shearer et al. 2011, J Dent Res 90:672 | https://pubmed.ncbi.nlm.nih.gov/21248361/ | Moderate [V] |
| Low maternal education | OR 1.82 for ECC | 1.65-2.02 | Celeste et al., Community Dent Oral Epidemiol (SR/MA) | https://onlinelibrary.wiley.com/doi/10.1111/cdoe.70110 | Moderate [V] |
| Maternal smoking in pregnancy | OR 1.78 for child caries | 1.55-2.05 | SR/MA (2024) | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11241989/ | Moderate [V] |
| Poor maternal mental health | OR 1.35 for ECC | 1.05-1.73 | BDJ Open 2026 SR/MA | https://www.nature.com/articles/s41405-026-00429-w | Emerging [V] |
| Saliva-sharing (kissing on lips, shared spoon, pre-chewing) | common (lip-kissing 38%, spoon-sharing 14% in one survey); effect size not established; use x1.1-1.2 [DESIGN] | evidence is mostly strain-matching within families | various | - | Emerging-Mixed [V-partial] |

### Topic 3 model notes [DESIGN]
- Child MS colonisation = f(caregiver caries level, saliva sharing, C-section as an earlier-timing shift), inside a 19-31 month window. Colonised children get x2.5 ECC risk.
- Parent-controlled levers matter most: sugar in a night-time bottle (x2-2.5), brushing with F paste (x0.76), varnish at visits (x0.63).
- Age-1 visit: present it as contested. Suggest a small benefit (varnish plus advice) that works only through the prevention actions it triggers.

---

## 4. Periodontal disease

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Gingivitis onset after stopping oral hygiene | ~14 days | 9-21 days | Löe, Theilade & Jensen 1965, J Periodontol 36:177 | https://aap.onlinelibrary.wiley.com/doi/10.1902/jop.1965.36.3.177 | Strong [V] |
| Gingivitis resolution after resuming hygiene | 7 days | ~1 week | same | same | Strong [V] |
| Natural-history susceptibility classes (no dental care) | Rapid 8%, Moderate 81%, None 11% | n=480 Sri Lankan tea labourers, age 14-46 | Löe et al. 1986, J Clin Periodontol 13:431 | https://onlinelibrary.wiley.com/doi/10.1111/j.1600-051X.1986.tb01487.x | Strong (landmark; one population) [V] |
| Annual clinical attachment loss (CAL) by class | Rapid 0.1-1.0 mm/yr; Moderate 0.05-0.5 mm/yr; None <0.1 | mean CAL at age 45: Rapid ~13 mm, Moderate ~7 mm | same | same | Strong [V] ("None" rate UNVERIFIED) |
| Tooth loss by class (no care) | Rapid: 12 teeth lost by 35, 20 by 40, all by 45. Moderate: losses start after 30, mean 7 teeth by 45 | - | same | same | Strong [V] |
| Population mean CAL progression | 0.1 mm/yr | 0.068-0.132; I2 99% | Needleman et al. 2018, J Periodontol / J Clin Periodontol (SR) | https://aap.onlinelibrary.wiley.com/doi/10.1002/JPER.17-0062 | Moderate [V] |
| Population mean tooth loss | 0.2 teeth/person/yr | 0.10-0.33; I2 94% | same | same | Moderate [V] |
| Stage thresholds (interdental CAL at worst site) | I: 1-2 mm; II: 3-4 mm; III: >=5 mm (up to 4 teeth lost to perio); IV: >=5 mm plus >=5 teeth lost or complex rehab | radiographic bone loss <15% (I), 15-33% (II), mid-third of root or beyond (III/IV) | Tonetti, Greenwell & Kornman 2018, J Periodontol 89:S159 (AAP/EFP 2017) | https://aap.onlinelibrary.wiley.com/doi/full/10.1002/JPER.18-0006 | Consensus [V for CAL; bone-loss % UNVERIFIED, recall high] |
| Grade (rate) thresholds | A: no loss over 5 yr; B: <2 mm per 5 yr; C: >=2 mm per 5 yr. Bone-loss %/age: <0.25 / 0.25-1.0 / >1.0. Smoking >=10 cig/day or HbA1c >=7% moves to C | - | same | same | Consensus [V for modifiers; rate cut-offs UNVERIFIED, recall high] |
| Smoking and periodontitis incidence/progression | RR 1.85 | 1.5-2.2 | Leite et al. 2018, Am J Prev Med 54:831 | https://pubmed.ncbi.nlm.nih.gov/29656920/ | Strong for direction; magnitude rated low-quality (https://pubmed.ncbi.nlm.nih.gov/30029763/) [V] |
| Diabetes and periodontitis incidence/progression | RR 1.86 | 1.30-2.80 | Nascimento et al. 2018, Acta Diabetol 55:653 | https://link.springer.com/article/10.1007/s00592-018-1120-4 | Moderate [V] |
| Periodontal treatment and HbA1c (people with diabetes) | -0.43 percentage points at 3-4 mo | -0.59 to -0.28 (30 RCTs, n=2,443); 6 mo -0.30 (-0.52 to -0.08; 12 RCTs); 12 mo -0.50 (1 RCT, n=264) | Simpson et al. 2022, Cochrane CD004714.pub4 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004714.pub4/full | Moderate [V] |
| Psychological stress and periodontitis | x1.2-1.5 [DESIGN] | 57% of 14 studies positive, 28.5% mixed, 14% negative | Peruzzo et al. 2007, J Periodontol 78:1491 | https://aap.onlinelibrary.wiley.com/doi/10.1902/jop.2007.060371 | Emerging-Mixed [V] |
| Pregnancy gingivitis | 60-75% probability during pregnancy (transient) | 47-89% | CDC | see Topic 0 | Moderate [V] |
| Tooth loss under maintenance after perio therapy (avg 22 yr) | 1.8 teeth/patient (~0.08/yr) | 83% lost 0-3 teeth ("well maintained"); 12.7% lost 4-9 ("downhill"); 4.2% lost 10-23 ("extreme downhill") | Hirschfeld & Wasserman 1978, J Periodontol 49:225 (n=600) | https://aap.onlinelibrary.wiley.com/doi/10.1902/jop.1978.49.5.225 | Moderate [V] |
| 30-yr intensive plaque-control programme | 0.4 / 0.7 / 1.8 teeth lost per person over 30 yr (age groups 20-35 / 36-50 / 51-65); most losses from root fracture; few new caries | recalls every 2-3 mo early, then 3-12 mo by need | Axelsson, Nyström & Lindhe 2004, J Clin Periodontol 31:749 | https://pubmed.ncbi.nlm.nih.gov/?term=Axelsson+Nystrom+Lindhe+2004+plaque+control+30+years | Moderate [UNVERIFIED, recall med-high] |
| Tooth-level risk from residual pocket depth (PD) during maintenance | tooth-loss OR rises steeply: roughly 3-10 for PD 5-6 mm, much higher for >=7 mm (vs <=3 mm) | - | Matuliene et al. 2008, J Clin Periodontol | https://pubmed.ncbi.nlm.nih.gov/?term=Matuliene+2008+residual+pockets+tooth+loss+11+years | Moderate [UNVERIFIED, recall low-med] |

### Topic 4 model notes [DESIGN]
- Draw a hidden **perio-susceptibility class** at birth: Rapid 0.08 / Moderate 0.81 / None 0.11. Annual CAL: Rapid ~0.45 mm/yr (13 mm by 45), Moderate ~0.23 mm/yr (7 mm by 45), None ~0.03 mm/yr. Multiply by smoking 1.85, diabetes 1.86 (both verified) and stress 1.3.
- Gingivitis state: switches on after 2-3 weeks of neglect and clears 1 week after hygiene resumes. It is a prerequisite for attachment loss, but most gingivitis never progresses.
- Tooth loss, untreated: Moderate class ~0.5 teeth/yr from age 30-45; Rapid class 2-3 teeth/yr from age 35-45. Treated plus maintained: ~0.08 teeth/yr (Hirschfeld), roughly an 80% cut. That comparison crosses populations, so treat it as illustrative.
- Diabetes feedback loop: treating periodontitis lowers HbA1c by 0.3-0.5 points.

---

## 5. Restoration longevity (all UNVERIFIED: search budget exhausted)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Posterior composite annual failure rate (AFR) | 1.8%/yr (to 5 yr); 2.4%/yr (to 10 yr) | higher with high caries risk and more surfaces; failures mostly secondary caries and fracture | Opdam et al. 2014, J Dent Res 93:943 | https://pubmed.ncbi.nlm.nih.gov/?term=Opdam+2014+longevity+posterior+composite+restorations+meta-analysis | Moderate [UNVERIFIED, recall high] |
| Composite vs amalgam | composite failure RR ~1.9; secondary caries RR ~2.1 | - | Moraschini et al. 2015, J Dent 43:1043 | https://pubmed.ncbi.nlm.nih.gov/?term=Moraschini+2015+amalgam+resin+composite+longevity+posterior | Moderate [UNVERIFIED, recall med] |
| AFR ranges, posterior stress-bearing | amalgam 0-7.4%/yr; direct composite 0-9%/yr; glass ionomer highest (up to ~14%/yr) | - | Manhart et al. 2004, Oper Dent 29:481 | https://pubmed.ncbi.nlm.nih.gov/?term=Manhart+2004+Buonocore+clinical+survival+direct+indirect+restorations | Moderate [UNVERIFIED, recall med] |
| Single crown survival | 5-yr ~94-96% (metal-ceramic); 10-yr ~90% [DESIGN, from ~1%/yr] | 85-95% at 10 yr | Pjetursson et al. 2007, Clin Oral Implants Res 18(S3):73; Sailer et al. 2015, Dent Mater | https://pubmed.ncbi.nlm.nih.gov/?term=Pjetursson+2007+single+crowns+survival+all-ceramic+metal-ceramic | Moderate [UNVERIFIED, recall med] |
| Conventional bridge (fixed partial denture) | 10-yr survival 89.1%; complication-free 71.1% | 81-93.8% | Tan et al. 2004, Clin Oral Implants Res 15:654 | https://pubmed.ncbi.nlm.nih.gov/?term=Tan+Pjetursson+Lang+2004+fixed+partial+dentures+survival | Moderate [UNVERIFIED, recall high] |
| Root-canal-treated tooth survival | 86% (2-3 yr), 93% (4-5 yr), 87% (8-10 yr) | better with a crown after RCT, proximal contacts both sides, not a bridge/denture abutment, non-molar | Ng, Mann & Gulabivala 2010, Int Endod J 43:171 | https://pubmed.ncbi.nlm.nih.gov/?term=Ng+Mann+Gulabivala+2010+tooth+survival+root+canal+treatment | Moderate [UNVERIFIED, recall high] |
| RCT tooth retention, insurance data | 97% retained at 8 yr | n ~1.46 million teeth | Salehrabi & Rotstein 2004, J Endod 30:846 | https://pubmed.ncbi.nlm.nih.gov/?term=Salehrabi+Rotstein+2004+endodontic+treatment+outcomes | Moderate [UNVERIFIED, recall med] |
| Implant 10-yr survival | 96.4% | 95.2-97.5% | Howe, Keys & Richards 2019, J Dent 84:9 | https://pubmed.ncbi.nlm.nih.gov/?term=Howe+Keys+Richards+2019+10-year+dental+implant+survival | Moderate [UNVERIFIED, recall med-high] |
| Implant survival, >=10 yr (alternative estimate) | 94.6% | success 89.7% | Moraschini et al. 2015, Int J Oral Maxillofac Surg 44:377 | https://pubmed.ncbi.nlm.nih.gov/?term=Moraschini+2015+survival+success+dental+implants+10+years | Moderate [UNVERIFIED, recall med] |
| Peri-implant mucositis / peri-implantitis | 43% / 22% (weighted means) | 32-54% / 14-30% | Derks & Tomasi 2015, J Clin Periodontol 42(S16):S158 | https://pubmed.ncbi.nlm.nih.gov/?term=Derks+Tomasi+2015+peri-implant+health+disease+epidemiology | Moderate [UNVERIFIED, recall high] |
| Peri-implantitis, patient vs implant level | ~19.5% of patients; ~12.5% of implants | - | Diaz et al. 2022 (SR/MA) | https://pubmed.ncbi.nlm.nih.gov/?term=Diaz+2022+prevalence+peri-implantitis+meta-analysis | Moderate [UNVERIFIED, recall med] |
| Restorative cycle | each replacement tends to enlarge the restoration; replacements make up a large share of operative work (often quoted 50-70%); secondary caries is the main reason | - | Elderton 1990, Adv Dent Res 4:4; Brantley et al. 1995, JADA 126:1407 | https://pubmed.ncbi.nlm.nih.gov/?term=Brantley+1995+cycle+of+rerestoration+larger+restorations | Moderate (concept) [UNVERIFIED] |
| "Death spiral" of a tooth | textbook chapter "Longevity of restorations: the 'death spiral'" | - | Qvist 2008, in Fejerskov & Kidd, *Dental Caries* (2nd ed.) | https://scholar.google.com/scholar?q=Qvist+%22death+spiral%22+longevity+of+restorations | Concept [UNVERIFIED, recall med] |

### Topic 5 model notes [DESIGN]
State chain: `sound -> 1-2 surface filling -> larger filling (each redo +1 surface) -> crown (at >=3-4 surfaces or cusp loss) -> RCT -> retreatment or extraction -> implant / bridge / denture`.
Suggested annual failure probabilities: composite 2%, amalgam ~1%, crown ~1%, RCT tooth loss ~1.3%, bridge loss ~1.1% (complications ~3%/yr), implant loss ~0.4%, plus ~20% of implant patients developing peri-implantitis over ~10 yr. Multiply failures by the caries-risk multipliers from Topic 1, because secondary caries dominates.

---

## 6. Bruxism and TMD (all UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Awake bruxism, adults | 25% | 22-31% | Manfredini et al. 2013, J Orofac Pain 27:99 | https://pubmed.ncbi.nlm.nih.gov/?term=Manfredini+2013+epidemiology+bruxism+adults+systematic+review | Moderate [UNVERIFIED, recall med] |
| Sleep bruxism, adults | 13% | 10-16%; ~8% at least weekly (Ohayon 2001) | Manfredini 2013; Ohayon et al. 2001, Chest 119:53 | https://pubmed.ncbi.nlm.nih.gov/?term=Ohayon+2001+risk+factors+sleep+bruxism+general+population | Moderate [UNVERIFIED, recall med] |
| Bruxism, newer global meta-analysis | sleep ~21%, awake ~23% | self-report heavy | Zieliński et al. 2024, J Clin Med | https://pubmed.ncbi.nlm.nih.gov/?term=Zielinski+2024+global+prevalence+sleep+bruxism+awake+bruxism | Emerging-Mixed [UNVERIFIED, recall low-med] |
| TMD prevalence | adults 31%; children/adolescents 11% | disc displacement most common | Valesan et al. 2021, Clin Oral Investig 25:441 | https://pubmed.ncbi.nlm.nih.gov/?term=Valesan+2021+prevalence+temporomandibular+joint+disorders+meta-analysis | Moderate [UNVERIFIED, recall med] |
| Stress and bruxism | OR ~2 | - | Chemelo et al. 2020, Front Neurol (SR/MA) | https://pubmed.ncbi.nlm.nih.gov/?term=Chemelo+2020+stress+bruxism+meta-analysis | Emerging-Mixed [UNVERIFIED, recall low-med] |
| Alcohol and tobacco, sleep bruxism | OR ~2 each | caffeine only at very high intake (>8 cups/day, OR ~1.5) | Bertazzo-Silveira et al. 2016, JADA 147:859 | https://pubmed.ncbi.nlm.nih.gov/?term=Bertazzo-Silveira+2016+sleep+bruxism+alcohol+caffeine+tobacco | Emerging-Mixed [UNVERIFIED, recall med] |
| General-population sleep-bruxism risk factors | OSA OR ~1.8; loud snoring ~1.4; alcohol ~1.8; caffeine ~1.4; smoking ~1.3; highly stressful life ~1.3 | telephone survey, n ~13,000 | Ohayon et al. 2001, Chest | (link above) | Emerging [UNVERIFIED, recall med] |
| OSA and sleep bruxism | inconsistent association | - | Jokubauskas & Baltrušaitytė 2017, J Oral Rehabil 44:144 | https://pubmed.ncbi.nlm.nih.gov/?term=Jokubauskas+2017+obstructive+sleep+apnoea+sleep+bruxism | Emerging-Mixed [UNVERIFIED, recall med] |
| SSRIs/SNRIs and bruxism | case-report level; onset within weeks of starting or raising the dose; buspirone often reverses it | - | Garrett & Hawley 2018, Neurol Clin Pract 8:135 | https://pubmed.ncbi.nlm.nih.gov/?term=Garrett+Hawley+2018+SSRI-associated+bruxism | Emerging-Mixed [UNVERIFIED, recall med] |
| Occupational exertion / clenching (heavy lifting, strength sport) | no quantitative epidemiology known; x1.2 on wear/crack risk [DESIGN] | - | - | - | [UNVERIFIED / no data] |
| Cracked-tooth risk factors | molars (especially mandibular 2nd and maxillary 1st), age 40-60, large intracoronal restorations, clenching/grinding, wear facets, hard foods/ice | - | National Dental PBRN Cracked Tooth Registry (Hilton, Ferracane et al. 2017-2020) | https://pubmed.ncbi.nlm.nih.gov/?term=National+Dental+PBRN+cracked+tooth+registry+Hilton | Moderate (descriptive) [UNVERIFIED] |
| Occlusal splint for sleep bruxism | insufficient evidence that it reduces bruxism; plausibly protects against tooth wear | - | Macedo et al. 2007, Cochrane CD005514 | https://pubmed.ncbi.nlm.nih.gov/?term=Macedo+2007+occlusal+splints+sleep+bruxism+Cochrane | Emerging-Mixed [UNVERIFIED, recall med-high] |
| Splints for TMD/bruxism | very low certainty; no clear benefit over minimal treatment | - | Riley et al. 2020, Health Technol Assess 24(7) | https://pubmed.ncbi.nlm.nih.gov/?term=Riley+2020+oral+splints+temporomandibular+disorders+bruxism | Emerging-Mixed [UNVERIFIED, recall med] |

---

## 7. Dental trauma and sports (all UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| TDI prevalence | permanent 15.2%; primary 22.7% | 12-year-olds 18.1% | Petti, Glendor & Andersson 2018, Dent Traumatol 34:71 | https://pubmed.ncbi.nlm.nih.gov/?term=Petti+Glendor+Andersson+2018+one+billion+traumatic+dental+injuries | Strong [UNVERIFIED, recall high] |
| TDI incidence | 2.82 per 100 person-yr | - | same | same | Moderate [UNVERIFIED, recall high] |
| Peak ages and sex | primary: 2-3 y (falls); permanent: 8-12 y; boys ~1.5-2x girls | - | Glendor 2008, Dent Traumatol (review) | https://pubmed.ncbi.nlm.nih.gov/?term=Glendor+2008+epidemiology+traumatic+dental+injuries+12+year+review | Moderate [UNVERIFIED, recall med] |
| Share of dental injuries that are sports-related | 13-39% | - | Newsome, Tran & Cooke 2001, Int J Paediatr Dent 11:396 | https://pubmed.ncbi.nlm.nih.gov/?term=Newsome+Tran+Cooke+2001+mouthguard+sports-related+dental+injuries | Moderate [UNVERIFIED, recall med] |
| No mouthguard and orofacial injury | RR 1.6-1.9, i.e. a mouthguard is ~x0.55 on injury risk | no clear effect on concussion | Knapik et al. 2007, Sports Med 37:117 | https://pubmed.ncbi.nlm.nih.gov/?term=Knapik+2007+mouthguards+sport+injury+prevention+effectiveness | Moderate [UNVERIFIED, recall high] |
| Sport risk tiers [DESIGN] | High: boxing/MMA/martial arts, ice hockey without full cage, basketball, rugby, field hockey, lacrosse. Medium: soccer, handball, baseball/softball, water polo, skateboarding/cycling. American football: high exposure, but mandatory facemask plus mouthguard (since the 1960s) sharply cut orofacial injuries | no per-sport incidence verified | FDI/ADA statements; Knapik 2007 | (link above) | Emerging-Mixed [UNVERIFIED] |
| Avulsion storage medium | replant immediately if possible; otherwise milk, HBSS, saliva or saline; never water | - | Fouad et al. 2020, Dent Traumatol 36:331 (IADT guideline) | https://pubmed.ncbi.nlm.nih.gov/?term=Fouad+2020+IADT+guidelines+avulsion+permanent+teeth | Guideline [UNVERIFIED, recall high] |
| Avulsion, extra-alveolar dry time | best periodontal-ligament (PDL) healing within a few minutes; >60 min dry means PDL cells are non-viable and ankylosis/replacement resorption is expected | - | IADT 2020; Andreasen et al. 1995, Endod Dent Traumatol 11:76 (400 replanted incisors) | https://pubmed.ncbi.nlm.nih.gov/?term=Andreasen+1995+replantation+400+avulsed+permanent+incisors+periodontal+ligament+healing | Moderate [UNVERIFIED, recall med] |
| Survival of ankylosed replanted teeth | children: often lost in ~3-7 yr; adults: can last decades | - | Andersson et al. 1989, Endod Dent Traumatol 5:38 | https://pubmed.ncbi.nlm.nih.gov/?term=Andersson+1989+root+resorption+replantation+extended+extraoral+storage | Moderate [UNVERIFIED, recall low-med] |

---

## 8. Dental anxiety (all UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Adult dental fear/anxiety | 15.3% | 12.0-19.0% | Silveira et al. 2021, J Dent 108:103632 | https://pubmed.ncbi.nlm.nih.gov/?term=Silveira+2021+prevalence+dental+fear+adults+meta-analysis | Moderate [UNVERIFIED, recall med] |
| Child/adolescent dental anxiety | 23.9% | 20.4-27.3% | Grisolia et al. 2021, Int J Paediatr Dent 31:168 | https://pubmed.ncbi.nlm.nih.gov/?term=Grisolia+2021+prevalence+dental+anxiety+children+adolescents+meta-analysis | Moderate [UNVERIFIED, recall med] |
| UK adults, moderate / extreme anxiety | 36% / 12% (MDAS >=19) | - | Adult Dental Health Survey 2009 (NHS Information Centre, 2011) | https://pubmed.ncbi.nlm.nih.gov/?term=Adult+Dental+Health+Survey+2009+dental+anxiety | Moderate [UNVERIFIED, recall med] |
| Dental phobia (DSM level) | ~3-4% | - | Oosterink et al. 2009, Eur J Oral Sci 117:135 | https://pubmed.ncbi.nlm.nih.gov/?term=Oosterink+2009+prevalence+dental+fear+phobia | Moderate [UNVERIFIED, recall low-med] |
| Age of onset | ~50% childhood, ~20% adolescence, ~25-30% adulthood | - | Locker et al. 1999, J Dent Res 78:790 | https://pubmed.ncbi.nlm.nih.gov/?term=Locker+1999+age+of+onset+dental+anxiety | Moderate [UNVERIFIED, recall med] |
| Parent-child fear link | small-to-moderate correlation (r ~0.2); stronger at age <=8 | - | Themessl-Huber et al. 2010, Int J Paediatr Dent 20:83 | https://pubmed.ncbi.nlm.nih.gov/?term=Themessl-Huber+2010+parental+child+dental+fear+meta-analysis | Moderate [UNVERIFIED, recall low-med] |
| Vicious cycle | fear, then avoidance or symptom-only visits, then worse oral health, then shame and more fear; partly supported empirically | - | Berggren & Meynert 1984, JADA 109:247; Armfield, Stewart & Spencer 2007, BMC Oral Health 7:1; Armfield 2013, CDOE 41:279 | https://pubmed.ncbi.nlm.nih.gov/?term=Armfield+2013+what+goes+around+comes+around+dental+fear | Moderate [UNVERIFIED] |
| Avoidance among high-fear adults | ~2x more likely to attend irregularly or only when in pain [DESIGN estimate] | - | Armfield 2007/2013 | (link above) | Emerging [UNVERIFIED] |
| CBT outcome | large fear reduction; ~77% attending regularly ~4 yr later | - | Kvale, Berggren & Milgrom 2004, CDOE 32:250 | https://pubmed.ncbi.nlm.nih.gov/?term=Kvale+Berggren+Milgrom+2004+dental+fear+meta-analysis | Moderate [UNVERIFIED, recall med] |
| CBT vs sedation | CBT cuts fear long-term; sedation or GA gets treatment done but does not reduce fear | - | Wide Boman et al. 2013, Eur J Oral Sci 121:225; Willumsen et al. 2001 | https://pubmed.ncbi.nlm.nih.gov/?term=Wide+Boman+2013+psychological+treatment+dental+anxiety+systematic+review | Moderate [UNVERIFIED, recall med] |

---

## 9. Occupational and lifestyle (all UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Confectionery/bakery workers | higher DMFS than other workers (tasting, sugar/flour dust); historically recognised as an occupational disease ("Bäckerkaries"); model as +2-4 sugar exposures/day [DESIGN] | - | Anaise 1980, CDOE 8:142; Petersen 1983, CDOE 11:337; Masalin et al. 1990, CDOE 18:126 | https://pubmed.ncbi.nlm.nih.gov/?term=confectionery+workers+dental+caries | Emerging-Mixed [UNVERIFIED] |
| Shift work | limited cross-sectional data; x1.1-1.2 on caries and perio [DESIGN] | - | - | https://pubmed.ncbi.nlm.nih.gov/?term=shift+work+periodontitis+OR+dental+caries | Emerging-Mixed [UNVERIFIED] |
| Elite athletes (London 2012) | caries 55%, erosion 45%, gingivitis 76%, periodontitis 15%; 18% said oral health hurt training or performance | n ~278 | Needleman et al. 2013, Br J Sports Med 47:1054 | https://pubmed.ncbi.nlm.nih.gov/?term=Needleman+2013+oral+health+London+2012+Olympic+Games | Moderate [UNVERIFIED, recall med] |
| Endurance training (triathletes vs controls) | more erosion; caries risk rises with weekly training time; salivary flow falls during exercise | 35 vs 35 | Frese et al. 2015, Scand J Med Sci Sports 25:e319 | https://pubmed.ncbi.nlm.nih.gov/?term=Frese+2015+endurance+training+dental+erosion+caries+saliva | Emerging [UNVERIFIED, recall med] |
| Erosive tooth wear, children/adolescents | ~30% | - | Salas et al. 2015, J Dent 43:42 | https://pubmed.ncbi.nlm.nih.gov/?term=Salas+2015+prevalence+erosive+tooth+wear+children+adolescents | Moderate [UNVERIFIED, recall med] |
| Soft, sports and energy drinks and erosion | OR ~1.5-2.5 (frequent vs infrequent); milk/yoghurt protective | - | Li, Zou & Ding 2012, PLoS One 7:e42626; Salas et al. 2015, J Dent 43:865 | https://pubmed.ncbi.nlm.nih.gov/?term=Li+Zou+Ding+2012+dietary+factors+dental+erosion+meta-analysis | Moderate [UNVERIFIED, recall low-med] |
| Diet vs regular soda | diet removes the sugar (caries) risk but not erosion; both have pH ~2.5-3.5 | in vitro | von Fraunhofer & Rogers 2004, Gen Dent 52:308 | https://pubmed.ncbi.nlm.nih.gov/?term=von+Fraunhofer+Rogers+2004+dissolution+dental+enamel+soft+drinks | Moderate (in vitro) [UNVERIFIED] |
| Vaping and caries | 79% of e-cigarette users rated high caries risk vs ~60% of non-users (clinic records) | cross-sectional | Irusa et al. 2022, JADA | https://pubmed.ncbi.nlm.nih.gov/?term=Irusa+2022+caries+risk+vapes+electronic+cigarettes | Emerging [UNVERIFIED, recall med] |
| Vaping and periodontal health | users worse than never-smokers, better than smokers; inconsistent | - | several SRs 2019-2024 | https://pubmed.ncbi.nlm.nih.gov/?term=electronic+cigarettes+periodontal+systematic+review | Emerging-Mixed [UNVERIFIED] |
| Alcohol and periodontitis | RR ~1.6 (drinkers vs non-drinkers); dose-response | - | Wang et al. 2016, J Clin Periodontol 43:572 | https://pubmed.ncbi.nlm.nih.gov/?term=Wang+2016+alcohol+consumption+periodontitis+meta-analysis | Moderate [UNVERIFIED, recall med] |
| Ice chewing and cracks | no epidemiological effect size; case reports only; pagophagia is linked to iron deficiency | - | - | - | [UNVERIFIED / no data] |

---

## 10. Systemic links (associations; causal caveats apply)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Diabetes and periodontitis (bidirectional) | diabetes RR 1.86 for periodontitis; perio treatment lowers HbA1c 0.3-0.5 points | - | Nascimento 2018; Simpson 2022 (see Topic 4) | links in Topic 4 | Moderate [V] |
| Periodontitis and atherosclerotic cardiovascular disease | RR ~1.2 for coronary heart disease; association independent of known confounders; causation and treatment benefit unproven | 1.01-1.51 | Lockhart et al. 2012, Circulation 125:2520 (AHA statement); Humphrey et al. 2008, J Gen Intern Med 23:2079 | https://pubmed.ncbi.nlm.nih.gov/?term=Lockhart+2012+periodontal+disease+atherosclerotic+vascular+disease | Moderate (association) [UNVERIFIED, recall med] |
| Periodontitis and preterm birth | OR ~1.6 | - | e.g. Manrique-Corredor et al. 2019, CDOE | https://pubmed.ncbi.nlm.nih.gov/?term=Manrique-Corredor+2019+maternal+periodontitis+preterm+birth | Moderate (association) [UNVERIFIED, recall low-med] |
| Treating periodontitis in pregnancy | preterm birth <37 wk RR 0.87 (0.70-1.10, not significant); low birth weight RR 0.67 (0.48-0.95); low certainty | - | Iheozor-Ejiofor et al. 2017, Cochrane CD005297 | https://pubmed.ncbi.nlm.nih.gov/?term=Iheozor-Ejiofor+2017+treating+periodontal+disease+adverse+birth+outcomes | Emerging-Mixed [UNVERIFIED, recall med] |
| Tooth loss and cognitive impairment / dementia | RR 1.48 / 1.28; +1.4% / +1.1% risk per extra tooth lost; worse when edentulous without dentures | - | Qi et al. 2021, J Am Med Dir Assoc 22:1615 | https://pubmed.ncbi.nlm.nih.gov/?term=Qi+2021+dose-response+tooth+loss+cognitive+impairment+dementia | Emerging-Mixed (reverse causation likely) [UNVERIFIED, recall med] |
| Periodontitis and cognitive decline / dementia | RR ~1.2 | - | Asher et al. 2022, J Am Geriatr Soc | https://pubmed.ncbi.nlm.nih.gov/?term=Asher+2022+periodontal+health+cognitive+decline+dementia | Emerging-Mixed [UNVERIFIED, recall low] |
| Tooth loss and diet quality | fewer teeth: lower fruit, vegetable and fibre intake, higher malnutrition risk; longitudinal evidence limited | - | Gaewkhiew, Sabbah & Bernabé 2017, J Dent; Zelig et al. 2022, JDR Clin Transl Res | https://pubmed.ncbi.nlm.nih.gov/?term=Gaewkhiew+2017+tooth+loss+dietary+intake+nutritional+status | Emerging-Mixed [UNVERIFIED] |

Game framing: present these as "linked with", never "causes". The only well-supported two-way effect is diabetes and gums.

---

## 11. Knowing your risk (caries risk assessment, saliva and pathogen tests)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Best single predictor | past caries experience | - | Mejàre et al. 2014 (SR) | https://medicaljournalssweden.se/actaodontologica/article/download/37073/42196/94621 | Strong/Moderate [V] |
| Salivary/plaque MS test | associated with future caries (RR/OR ~2-4) but only modestly accurate as a screening test | - | Thenisch 2006; Manchanda 2023; Mejàre 2014 | links in Topic 1c | Moderate [V] |
| Accuracy of risk tools (Cariogram, CAMBRA, etc.) | no tool is well validated; multivariable tools are moderately accurate at best | - | Senneby et al. 2015, "Diagnostic accuracy of different caries risk assessment methods" (SR); Tellez et al. 2013, CDOE 41:67 | https://pubmed.ncbi.nlm.nih.gov/26493112/ | Moderate [Senneby existence V; conclusions UNVERIFIED] |
| CAMBRA risk category and incidence | graded: high/extreme-risk patients develop markedly more cavities | - | Doméjean et al. 2011, J Calif Dent Assoc 39:709; Chaffee et al. 2015, J Dent 43:518 | https://pubmed.ncbi.nlm.nih.gov/?term=Domejean+2011+validation+CDA+CAMBRA | Moderate [UNVERIFIED] |
| Does testing change outcomes? | no RCT shows risk assessment alone improves outcomes; risk-based recall performed like 6-month recall in the INTERVAL trial | - | Clarkson et al. 2020; Fee et al. 2020 (Topic 12) | links in Topic 12 | Emerging-Mixed [UNVERIFIED] |
| Risk-stratified cleaning frequency | high-risk adults (smoker, diabetic or IL-1 genotype positive) had fewer extractions with 2 vs 1 preventive visits/yr; no difference in low-risk adults | 16-yr insurance claims, n ~5,117; industry funded | Giannobile et al. 2013, J Dent Res 92:694 | https://pubmed.ncbi.nlm.nih.gov/?term=Giannobile+2013+patient+stratification+preventive+care+dentistry | Emerging-Mixed [UNVERIFIED, recall med] |
| Periodontal pathogen / genetic tests | no evidence that routine testing improves tooth retention | - | AAP statements; SRs | https://pubmed.ncbi.nlm.nih.gov/?term=microbiological+testing+periodontitis+clinical+utility | Emerging-Mixed [UNVERIFIED] |
| ECC risk tools | limited evidence | - | SR 2019, Eur Arch Paediatr Dent | https://pubmed.ncbi.nlm.nih.gov/31559535/ | Emerging [V existence only] |

Game framing [DESIGN]: a "risk test" should mostly **reveal** hidden multipliers (information value) rather than improve health directly. Health gains come from the preventive actions it prompts.

---

## 12. Recall intervals (UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| 6-month vs 24-month vs risk-based recall (UK NHS adults) | little or no difference in caries, gingival bleeding or oral-health quality of life over 4 yr | n=2,372, 3 arms | Clarkson et al. 2020, INTERVAL trial, Health Technol Assess 24(60) | https://pubmed.ncbi.nlm.nih.gov/?term=Clarkson+2020+INTERVAL+dental+recalls+trial | Moderate [UNVERIFIED, recall med-high] |
| Cochrane review of recall intervals | same conclusion for adults; evidence in children very limited | - | Fee et al. 2020, Cochrane CD004346.pub5 | https://pubmed.ncbi.nlm.nih.gov/?term=Fee+2020+recall+intervals+oral+health+primary+care | Moderate [UNVERIFIED, recall med-high] |
| NICE recall interval | adults 3-24 months; under-18s 3-12 months; set by risk | - | NICE CG19 (2004) | https://www.nice.org.uk/guidance/cg19 | Guideline [UNVERIFIED, recall high] |

Game implication [DESIGN]: for a low-risk adult, going every 2 years is roughly as good as every 6 months. The value of a visit scales with hidden risk: the chance of catching a lesion before it reaches dentin (Topic 2), varnish (x0.57), and scaling for periodontitis.

---

## 13. Habit formation and hygiene (UNVERIFIED)

| Parameter | Model value | Range | Source | URL | Evidence |
|---|---|---|---|---|---|
| Time to habit automaticity | median 66 days | 18-254 days; missing one day did not derail it | Lally et al. 2010, Eur J Soc Psychol 40:998 | https://scholar.google.com/scholar?q=Lally+2010+How+are+habits+formed+modelling+habit+formation+in+the+real+world | Moderate [UNVERIFIED, recall high] |
| US adults >=30, flossing | daily ~32%; less than daily ~37%; never ~30% | NHANES 2011-14 | Fleming et al. 2018, J Periodontol 89:933 | https://pubmed.ncbi.nlm.nih.gov/?term=Fleming+2018+prevalence+daily+flossing+adults+United+States | Moderate [UNVERIFIED, recall med] |
| Floss plus brushing vs brushing alone | small gingivitis reduction at 1-6 mo (SMD ~0.3-0.6), low certainty; no caries evidence | - | Worthington et al. 2019, Cochrane CD012018.pub2 (also Sambunjak 2011) | https://pubmed.ncbi.nlm.nih.gov/?term=Worthington+2019+interdental+cleaning+devices+Cochrane | Emerging-Mixed [UNVERIFIED, recall med] |
| Interdental brushes plus brushing | gingivitis reduced at 1 mo (low certainty); likely best for open embrasures | - | same | same | Emerging-Mixed [UNVERIFIED] |
| Powered vs manual toothbrush | plaque -11% (1-3 mo), -21% (>3 mo); gingivitis -6% (1-3 mo), -11% (>3 mo) | 56 trials, ~5,000 participants | Yaacob et al. 2014, Cochrane CD002281.pub3 | https://pubmed.ncbi.nlm.nih.gov/?term=Yaacob+2014+powered+versus+manual+toothbrushing+Cochrane | Moderate [UNVERIFIED, recall high] |

Game mechanic [DESIGN]: habit strength rises along an asymptotic curve (about 95% of its ceiling by ~66 days, range 18-254), so a missed day costs little. Flossing gives a small gum bonus and no proven caries effect.

---

## 14. Starter parameter block (for code)

```yaml
# Status per line: V = verified this session, V~ = partial, U = unverified recall, D = design assumption
caries:
  acid_minutes_per_exposure: 30          # V  (20-40) Stephan curve
  multipliers:
    fluoride_toothpaste_daily: 0.76      # V  Marinho 2003 PF 24%
    fluoride_varnish_permanent: 0.57     # V  Marinho 2013 PF 43%
    fluoride_varnish_primary: 0.63       # V  PF 37%
    water_fluoridation_modern: 0.93      # D  from Cochrane 2024 small modern effect (V)
    water_fluoridation_historic: 0.70    # V~ 35% dmft / 26% DMFT (pre-1975)
    brushing_lt_2_per_day: 1.30          # D  converted from OR 1.45 (V)
    brushing_lt_1_per_day: 1.35          # D  converted from OR 1.56 (V)
    ssb_daily_adult: 1.31                # V  Bernabe 2014 (1.33 if >=3/day)
    early_childhood_sugar: 1.35          # D  converted from OR 1.59 (V~)
    grazing_ge4_between_meal: 1.8        # D
    fluoride_attenuates_sugar_excess: 0.5  # D  halve (m-1) if brushing 2x/day with F paste
    nocturnal_feeding_after_12mo: 2.5    # D  converted from OR 7.14 (V)
    bedtime_sugary_bottle: 2.0           # D
    hyposalivation: 2.5                  # D  (single-study OR 18.5, V~)
    prior_caries: 2.6                    # V  Li & Wang 2002 (primary -> permanent)
    mutans_high_preschool: 2.5           # D  from RR 2.1-3.9 / OR 4.1 (V)
    c_section: 1.1                       # D  OR 1.48 low certainty (V)
    xylitol: 1.0                         # D  13% effect, low certainty (V)
    sealed_occlusal_surface: 0.25        # D  from OR 0.12 at 24 mo (V)
  ortho_fixed_appliance_wsl_prob: 0.46   # V  per treatment course
  progression_per_year_permanent_approximal:
    sound_to_enamel: [0.027, 0.043]      # V  Mejare 1999/2004
    enamel_to_outer_dentin: [0.05, 0.11] # V/D
    edj_to_outer_dentin_age_12_15: 0.325 # V
    edj_to_outer_dentin_age_20_27: 0.109 # V
    outer_to_inner_dentin: 0.10          # D  (28% over <=6 yr, V)
    inner_dentin_to_pulpitis: 0.20       # D/U placeholder
    enamel_never_progress_11y: [0.65, 0.86]  # V
  primary_teeth_speed_factor: 3          # D  (~1 yr through enamel, V)
  primary_carious_tooth_pain_prob: 0.18  # V  Levine 2002
perio:
  gingivitis_onset_days: [9, 21]         # V  Loe 1965
  gingivitis_resolution_days: 7          # V
  susceptibility: {rapid: 0.08, moderate: 0.81, none: 0.11}      # V  Loe 1986
  cal_mm_per_year: {rapid: 0.45, moderate: 0.23, none: 0.03}     # D  consistent with V ranges
  multipliers: {smoking: 1.85, diabetes: 1.86, stress: 1.3}      # V, V, D
  hba1c_drop_after_treatment: 0.43       # V  (0.30 at 6 mo)
  tooth_loss_per_year: {population_mean: 0.2, maintained_after_therapy: 0.08}  # V
  pregnancy_gingivitis_prob: 0.65        # V (0.60-0.75)
restorations_annual_failure:             # all U
  composite: 0.02
  amalgam: 0.01
  crown: 0.01
  rct_tooth_loss: 0.013
  bridge_loss: 0.011
  implant_loss: 0.004
  peri_implantitis_10yr_patient_prob: 0.2
trauma:
  mouthguard_injury_multiplier: 0.55     # U  Knapik 2007 (RR 1.6-1.9 without)
anxiety:
  adult_prevalence: 0.15                 # U
  child_prevalence: 0.24                 # U
  cbt_regular_attendance_after: 0.77     # U
habits:
  automaticity_median_days: 66           # U  (18-254)
```

---

## 15. Controversies and surprises (useful for in-game "did you know")

1. **Water fluoridation's modern effect is small.** Pre-1975 studies showed a 35% dmft reduction; post-1975 studies show about 0.24 fewer decayed/missing/filled baby teeth and +3-4 pp caries-free children, at low certainty (Cochrane 2024) [V].
2. **The age-1 dental visit has conflicting observational evidence**: lower costs in NC Medicaid (Savage 2004) vs more treatment and spending in Alabama Medicaid (Blackburn 2017, *JAMA Pediatrics*) [V]. Both studies are prone to selection bias.
3. **C-section**: babies born this way acquire MS about 11.7 months earlier (Li 2005), but the caries link is weak (OR 1.48, low certainty), and a larger null meta-analysis was **retracted** [V].
4. **Frequency vs amount of sugar is unresolved**: Bernabé 2016 favours amount, while van Loveren 2019 and Pombo-Lopes 2026 favour frequency. With regular fluoride the sugar effect weakens [V].
5. **Most early lesions are slow or arrest**: the median enamel-to-dentin time is ~6 yr, and 65-86% of lesions never reach dentin within 11 yr. Adolescents progress about 3x faster than adults [V]. This supports a "watch and remineralise" mechanic.
6. **82% of unrestored carious baby teeth fall out without ever hurting** (Levine 2002) [V].
7. **Periodontal susceptibility varies hugely**: with no care at all, 11% never progress while 8% lose every tooth by 45 (Löe 1986) [V]. Model it as a hidden trait.
8. **Brushing-frequency effects are confounded** with fluoride exposure and self-report (OR 1.45-1.56) [V].
9. **Xylitol's evidence is weak**: a 13% effect from two trials in one population, low certainty [V].
10. **Diabetes-gum feedback is real**: periodontal treatment lowers HbA1c by 0.43 points (Cochrane 2022, moderate certainty) [V]. Other systemic "links" are associations only [UNVERIFIED].
11. **Six-monthly checkups are not better than 24-monthly for low-risk adults** (INTERVAL / Cochrane 2020) [UNVERIFIED, recall med-high]. This fits the game's premise, as long as it is gated by hidden risk.
12. **Flossing evidence is low certainty**, with small gum effects only [UNVERIFIED].

## 16. Verification to-do (when search budget is available)

- Topic 1: Walsh 2019 children PF for 1000-1250 ppm; sealant retention curve; primary source for "snacking OR 1.6"; confirm the exact 2024 CWF DMFT MD and CI.
- Topic 2: any permanent-tooth cohort on dentin lesion to pulpitis/symptoms.
- Topic 4: Axelsson 2004 numbers; Matuliene 2008 PD-level ORs; Löe 1986 no-progression-group rate.
- Topics 5-9 and 12-13: every row (all recalled).
- Topic 10: Humphrey 2008 RR; Cochrane 2017 pregnancy RRs; Qi 2021 RRs.
- Topic 11: Chaffee 2015 / Doméjean 2011 CAMBRA incidence by risk level; Giannobile 2013 effect size.
