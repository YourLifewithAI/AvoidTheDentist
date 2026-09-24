# Sources: what the game claims, and what backs it

One place to check any claim the game makes. Status:
- **V**: checked against the source's abstract or summary.
- **U**: recalled from the literature. The link is a search pointer until someone verifies it.
- **D**: a design estimate made in the frame of the cited evidence.

Model parameters carry the same tags in `sim/params.js` and `sim/stephan.js`. The full research notes, with more links, are in [research/](research/).

**Precision policy.** Population numbers drift as populations and care change. The model aims to land *near* current surveillance data: within a few percentage points is fine, and we don't tune decimals. What matters is that every claim points to a reputable source.

**Wording policy for medical-dental links.** Say "associates with" or "connects with", never "causes". The exception is a well-established mechanism, such as acidic drinks or reflux softening enamel.

## Decay, fluoride and prevention

| Claim in the game | Source | Status |
|---|---|---|
| Fluoride toothpaste prevents decay (RR ~0.76) | [Marinho 2003, Cochrane CD002278](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002278/full) | V |
| Fluoride varnish (×0.57 permanent / ×0.63 baby teeth) | [Marinho 2013, Cochrane CD002279](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002279.pub2/full) | V |
| Water fluoridation: small, low-certainty effect in the fluoride-toothpaste era | [Iheozor-Ejiofor 2024, Cochrane CD010856](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010856.pub3/full) | V |
| Brushing less than twice a day: OR ~1.45 | [Kumar 2016, J Dent Res](https://journals.sagepub.com/doi/abs/10.1177/0022034516655315) | V |
| Sealants protect chewing surfaces | [Ahovuo-Saloranta 2017, Cochrane CD001830](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001830.pub5/full) | V |
| Daily sugary drinks: ×1.31 | [Bernabé 2014](https://pubmed.ncbi.nlm.nih.gov/24813370) | V |
| Enamel lesions progress slowly (~6%/yr), faster in teens | [Mejàre 1999/2004](https://pubmed.ncbi.nlm.nih.gov/14767170/) | V |
| Only ~18% of decayed baby teeth ever hurt | [Levine 2002, BDJ](https://www.nature.com/articles/4801495) | V |
| Baby-tooth decay predicts adult decay (RR ~2.6) | [Li & Wang 2002, J Dent Res](https://doi.org/10.1177/154405910208100812) | V |
| C-section: small, low-certainty association with decay | [Boustedt 2021](https://link.springer.com/article/10.1007/s40368-021-00621-6) | V |
| Braces: ~46% develop white-spot lesions | [Sundararaj 2015](https://doi.org/10.4103/2231-0762.167719) | V |
| 6- vs. 12/24-month recalls: little difference for low-risk adults | [Clarkson 2020 (INTERVAL)](https://pubmed.ncbi.nlm.nih.gov/?term=Clarkson+2020+INTERVAL+dental+recalls+trial) | U |

## The Acid Clock (plaque pH through a day)

| Claim in the game | Source | Status |
|---|---|---|
| Plaque pH falls within minutes of sugar and recovers over 30–60 min (the Stephan curve) | Stephan 1944; [dentalcare.com CE713: Stephan curve](https://www.dentalcare.com/en-us/ce-courses/ce713/stephan-curve) | V |
| Enamel dissolves below ~pH 5.5; exposed roots below ~6.2–6.7 | [dentalcare.com CE713](https://www.dentalcare.com/en-us/ce-courses/ce713/stephan-curve) | V |
| "Tooth-friendly" = plaque pH doesn't fall below 5.7 during and for 30 min after eating (in-mouth telemetry) | [Toothfriendly International](https://www.toothfriendly.org/en/?id=13); [test guidelines (PDF)](https://www.toothfriendly.org/images/pHTelemetryGuidelines.pdf) | V |
| Sugar eaten between meals, especially sticky sweets, is far more damaging than sugar at meals | [Vipeholm study (Gustafsson 1954), dentalcare.com CE713](https://www.dentalcare.com/en-us/ce-courses/ce713/vipeholm-study) | V |
| Other foods in a meal blunt a sugary drink's pH fall | [Rugg-Gunn 1975, BDJ](https://www.nature.com/articles/4803614) | V |
| Cheese after sugar protects plaque pH | [Rugg-Gunn 1975, BDJ](https://www.nature.com/articles/4803614); [cooked cheese and plaque calcium, BDJ](https://www.nature.com/articles/4800362) | U |
| Sugar-free gum after eating speeds plaque-pH recovery | [Manning & Edgar 1993, BDJ](https://www.nature.com/articles/4808141) | V |
| Starchy snacks (chips, crackers) drop slower but stay low longer, worse with low saliva | [Lingström & Birkhed 1993](https://pubmed.ncbi.nlm.nih.gov/8304015/) | V |
| Saliva flow is negligible during sleep, so bedtime matters most | [Dawes 2008, JADA](https://pubmed.ncbi.nlm.nih.gov/18460676/) | V |
| Most US drinks are erosive: sodas and sports drinks ~pH 3, juices ~3.5 | [Reddy 2016, JADA](https://pubmed.ncbi.nlm.nih.gov/26653863/) | V |
| Dry mouth (hyposalivation) means lower flow and slower clearance | [research notes](https://www.sciencedirect.com/science/article/pii/S0300571216300926) | V/D |
| Per-food dip depths, linger times, gum and water effects | `sim/stephan.js` | D |
| A bottle in bed pools on the upper front teeth (nursing-caries pattern) | clinical pattern; ×3 in the model | D |

## Medical-dental connections

| Claim in the game ("connects with") | Source | Status |
|---|---|---|
| Acid reflux connects with dental erosion (pooled OR ~5) | [Meta-analysis, 2022 (PMC9316498)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9316498/); [overview of reviews, 2023](https://www.sciencedirect.com/science/article/abs/pii/S0300571223001069) | V |
| Reflux and decay: mixed evidence (the model shows only a small, indirect effect) | [Azar cohort, 2023 (PLOS One)](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0289802); [systematic review, 2020 (PLOS One)](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0237581) | V |
| Mouth breathing in sleep lowers intraoral pH (mean 6.6 vs 7.0; dips to 3.6) | [Choi 2016, J Oral Rehabil](https://pubmed.ncbi.nlm.nih.gov/26666708/) | V |
| Sleep apnea connects with sleep bruxism; causality unclear, evidence mixed | [Scoping review, SLEEP 2022](https://academic.oup.com/sleep/article/45/7/zsac073/6571501); [systematic review 2023](https://pubmed.ncbi.nlm.nih.gov/37422904/) | V |
| Treating sleep apnea (CPAP or a mandibular advancement appliance) connects with less sleep bruxism in many patients, but not all (fell in ~60%; wide variation) | [Pilot study, 38 adults with OSA (2023)](https://pubmed.ncbi.nlm.nih.gov/36867294/); [CPAP case report (2002)](https://www.sciencedirect.com/science/article/abs/pii/S1389945702001302) | V: small evidence base |
| Smoking and periodontitis (RR ~1.85) | [Leite 2018](https://pubmed.ncbi.nlm.nih.gov/29656920/) | V |
| Diabetes and periodontitis (RR ~1.86) | [Nascimento 2018](https://link.springer.com/article/10.1007/s00592-018-1120-4) | V |
| Gum treatment lowers HbA1c ~0.43 points | [Simpson 2022, Cochrane CD004714](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004714.pub4/full) | V |

## Gums, restorations, trauma

| Claim in the game | Source | Status |
|---|---|---|
| Gingivitis within ~2 weeks of no cleaning; clears within ~1 week | [Löe 1965](https://aap.onlinelibrary.wiley.com/doi/10.1902/jop.1965.36.3.177) | V |
| Gum susceptibility: 8% rapid / 81% moderate / 11% none | [Löe 1986](https://onlinelibrary.wiley.com/doi/10.1111/j.1600-051X.1986.tb01487.x) | V |
| Tooth loss under maintenance ~0.08 teeth/yr | [Hirschfeld & Wasserman 1978](https://aap.onlinelibrary.wiley.com/doi/10.1902/jop.1978.49.5.225) | V |
| Attachment loss ~0.1 mm/yr | [Needleman 2018](https://aap.onlinelibrary.wiley.com/doi/10.1002/JPER.17-0062) | V |
| Composite fillings fail ~2%/yr | [Opdam 2014](https://pubmed.ncbi.nlm.nih.gov/?term=Opdam+2014+longevity+posterior+composite+restorations+meta-analysis) | U |
| Implants ~96% at 10 yrs; peri-implantitis common | [Howe 2019](https://pubmed.ncbi.nlm.nih.gov/?term=Howe+Keys+Richards+2019+10-year+dental+implant+survival); [Derks & Tomasi 2015](https://pubmed.ncbi.nlm.nih.gov/?term=Derks+Tomasi+2015+peri-implant+health+disease+epidemiology) | U |
| Mouthguards cut dental injuries (×~0.55) | [Knapik 2007](https://pubmed.ncbi.nlm.nih.gov/?term=Knapik+2007+mouthguards+sport+injury+prevention+effectiveness) | U |
| Dental trauma is common (~15% permanent teeth) | [Petti 2018](https://pubmed.ncbi.nlm.nih.gov/?term=Petti+Glendor+Andersson+2018+one+billion+traumatic+dental+injuries) | U |

## Fear, behavior and design

| Claim | Source | Status |
|---|---|---|
| Dental fear in ~15% of adults | [Silveira 2021](https://pubmed.ncbi.nlm.nih.gov/?term=Silveira+2021+prevalence+dental+fear+adults+meta-analysis) | U |
| CBT for dental fear: most attend years later | [Kvale 2004](https://pubmed.ncbi.nlm.nih.gov/?term=Kvale+Berggren+Milgrom+2004+dental+fear+meta-analysis) | U |
| Embarrassment tracks years of avoidance | [Moore 2004](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC411042/) | V |
| Fear appeals work only when paired with a way out | [Tannenbaum 2015](https://doi.org/10.1037/a0039729); Witte 1992 | V |
| Habits take a median of ~66 days to become automatic | [Lally 2010](https://scholar.google.com/scholar?q=Lally+2010+How+are+habits+formed+modelling+habit+formation+in+the+real+world) | U |

## Population data and costs

| Claim | Source | Status |
|---|---|---|
| Decay, untreated decay, tooth loss, toothlessness by age (calibration targets) | [CDC Oral Health Surveillance Report 2024](https://www.cdc.gov/oral-health/php/2024-oral-health-surveillance-report/selected-findings.html); [CDC OHSR 2019 (PDF)](https://www.cdc.gov/oral-health/media/pdfs/2024/07/Oral-Health-Surveillance-Report-2019-Web-h.pdf) | V |
| Periodontitis prevalence (~42% of adults 30+) | Eke 2018 (NHANES) | U |
| Typical US fees without insurance | [CareCredit cost guides](https://www.carecredit.com/dentistry/costs/) and research notes | V |
| Traditional Medicare doesn't cover routine dental | [KFF](https://www.kff.org/medicare/coverage-of-dental-services-in-traditional-medicare/) | V |

## To add with the tool shed (next)

Silver diamine fluoride, resin infiltration (ICON), postbiotic toothpastes (*S. dentisani*), and microbiome testing. Each gets its own row and evidence badge before it appears in the game.
