# Avoid the Dentist: economy and calibration research (US, compiled 2026-09-24)

## 0. How this was researched (read first)

- **Web access was limited.** WebFetch and curl were blocked by the egress proxy for every domain tried: CareCredit, ADA, CDC, NIH/PMC, Wikipedia and Guardian. So **every "verified" figure below comes from WebSearch result summaries** of the cited pages. I could not open the full pages. About 70 searches were run before the session's WebSearch budget ran out (the budget is shared across the session). As a result, Sections 3 and 4 are mostly **background knowledge, marked `U`**.
- **Status codes used in every table:**
  - `V`: the figure appears in search-result summaries attributed to the cited page.
  - `V*`: the figure appears in search summaries, but the summary blended several pages, so the exact attribution is uncertain.
  - `U`: **unverified.** It comes from background knowledge or is a midpoint I chose. Check it before shipping.
  - `D`: derived. My own arithmetic on figures in this document.
- **Why there is no "ADA 2024 fee survey":** the ADA Survey of Dental Fees was biennial through 2022 and paywalled. Search summaries report that **the ADA discontinued it in 2023** after a legal change removed the antitrust "safe harbor" for sharing fee data (`V*`: https://www.vadental.org/home/2022/11/22/11-22-2022-10-07-PM-2022-Survey-of-Dental-Fees-now-available , https://www.nassaudental.org/news-publications-classified-ads/2024/04/08/2022-survey-of-dental-fees-now-available). FAIR Health publishes only ZIP-level consumer lookups (https://www.fairhealthconsumer.org/dental), not national tables.
- **The main national benchmark is therefore the CareCredit national cost study.** ASQ360 conducted it in 2024 (some items 2023-24) across all 50 states plus DC. It is cross-checked against Delta Dental's "typical charges" pages, Humana cost pages, ADA 2020 survey figures, GoodRx, and 2026 cost aggregators. CareCredit is a medical-financing company (Synchrony), so its figures may lean high. Aggregators such as realdentalcosts.com often re-publish CareCredit numbers, so they are not independent confirmation.
- **Regional spread for the game:** the average crown price by state runs from **$1,046 (Alabama) to $2,331 (California)** against a $1,369 national average (`V*`, https://realdentalcosts.com/en/dental-crowns/). That suggests multipliers of about **0.75x for low-cost areas and 1.7x for high-cost areas** (`D`). One cost guide says urban practices charge 30-60% more (`V*`).

---

## 1. US fees without insurance (cash / "usual" fees, 2024-2026)

### 1A. Diagnostic and preventive

| Item (CDT) | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Periodic exam (D0120) | $40 | ~$60 | $75 (up to ~$100 in high-cost metros, `U`) | https://mednfly.com/blog/mednfly-academy/what-is-d0120-dental-code ; Coast Dental non-member fee $59: https://www.coastdental.com/wp-content/uploads/smileplusfeeschedule.pdf | 2025 | `V*`. For comparison, Medicaid pays much less: TN child $29.24 (https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/advocacy/medicaid/medicaid-fee-schedule/medicaid_fee_schedule_2025_tn_child.pdf); SD adult $44.47 (https://dss.sd.gov/docs/medicaid/providers/feeschedules/Dental/Adult_Current.pdf) |
| Comprehensive exam, new patient (D0150) | $75 | ~$105 | $200 | https://transcure.net/medical-billing/code/cdt/d0150/ ($75-$150); https://payormap.com/rates/d0150/ (national average *negotiated* rate $107); Coast Dental non-member $102; https://realdentalcosts.com/en/dental-checkup-cost/ ($75-$200) | 2025-26 | `V*`. Historical anchor: the ADA 2013 survey mean was $72.92 (https://www.aapd.org/assets/1/7/PolicyCenter-2013_Survey_of_Dental_Fees.pdf) |
| Limited / emergency exam (D0140) | $80 | ~$120 | $185 | https://realdentalcosts.com/en/emergency-dentist-cost-no-insurance/ ; https://medicalcostinfo.com/dental/emergency-dental-visit-cost/ | 2026 | `V*`. Exam plus one periapical x-ray (D0220, $30-$60) comes to about **$100-$250 before any treatment** |
| **Routine checkup bundle** (exam + cleaning + x-rays) | $50 | **$203** | $350 | https://www.carecredit.com/dentistry/costs/ ; https://www.carecredit.com/well-u/health-wellness/dental-cleaning-cost-financing/ | 2024 study | `V`. The best single national anchor. A new-patient first visit runs about $300-$700 (average about $531) per realdentalcosts (`V*`) |
| Adult prophylaxis / cleaning (D1110) | $75 | ~$110 | $200 | ADA-based national median of about $104-$110, cited in cost guides: https://realdentalcosts.com/en/dental-checkup-cost/ , https://hotalinginsurance.com/hotaling-insurance-blog/how-much-is-a-dental-cleaning-without-insurance ; Humana $80-$109 (Orlando): https://www.humana.com/dental-insurance/dental-resources/how-much-does-dental-cleaning-cost ; $75-$200: https://www.healthinsurance.org/blog/how-much-do-dental-cleanings-cost-without-insurance/ | 2024-26 | `V*`. One 2026 aggregator gives about $167 on average; use $110-$130 as typical |
| Child prophylaxis (D1120) | $50 | ~$85 (`U` midpoint) | $150 | https://teethcleaningcost.com/ ; https://kidcodent.dental/blogs/pediatric-dentistry/how-much-is-a-dental-cleaning-without-insurance-for-kids ; https://www.goodrx.com/conditions/dental-care/dental-cleaning-cost-without-insurance | 2025-26 | `V*`. Guides give $60-$150, $50-$150 and $75-$150 |
| Bitewing x-rays (D0272 two films / D0274 four films) | $25 | ~$65 (`U`) | $150 | CareCredit national average range $52-$120: https://www.carecredit.com/well-u/health-wellness/dental-x-ray-cost/ ; D0274 $25-$150: https://realdentalcosts.com/en/dental-x-rays-cost/ | 2024-26 | `V*` |
| Panoramic x-ray (D0330) | $60 | ~$130 (`U`) | $250 | https://xraycost.com/dental-x-ray-cost/ ; https://www.authoritydental.org/dental-x-ray ; https://sunbit.com/knowledge-center/dental/dental-tips/dental-x-ray-cost-guide/ | 2025-26 | `V*`. Also: full-mouth series (D0210) $100-$428; cone-beam CT $200-$879 (realdentalcosts, `V*`) |
| Fluoride varnish (D1206) | $20 | ~$35 | $50 (foam up to $60) | https://health.costhelper.com/fluoride-treatment.html ; https://www.ameriplanusa.com/flouride-treatment-cost/ | 2025 | `V*`. MaineCare pays about $12. Under the ACA, most plans must cover varnish at no cost for children through age 5: https://publications.aap.org/pediatrics/article/154/5/e2024066638/199657/Affordable-Care-Act-s-Preventive-Services-Coverage (`V`) |
| Sealant, per tooth (D1351) | $30 | ~$42 | $82 | https://www.humana.com/dental-insurance/dental-resources/dental-sealants ; https://www.carecredit.com/well-u/health-wellness/what-are-dental-sealants/ ; https://www.elocal.com/resources/medical/dental/cost-guide/dental-sealants/ | 2025 | `V*`. One guide gives an average of $42 with a range of $33-$82; most guides agree on $30-$60 |

### 1B. Restorative

| Item (CDT) | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Composite, 1 surface, **anterior** (D2330) | $145 | ~$180-$200 | ~$300 | Delta Dental front-teeth range $145-$480: https://www.deltadental.com/protect-my-smile/procedures/tooth-filling/cost-and-insurance-coverage/ ; example office fee schedules list D2330 at $182-$197 (the document is probably https://www.coastdental.com/wp-content/uploads/smileplusfeeschedule.pdf or https://woodcountyhealth.org/wp-content/uploads/2024/01/Dental-Price-List-01-2020.pdf) | 2024-26 | `V` for the Delta range; `V*` for the code-level fees |
| Composite, 2-3 surfaces, **anterior** (D2331/D2332) | $220 | ~$240-$295 | $480 | Same sources: D2331 $220-$239, D2332 $269-$294; Delta upper bound $480 | 2024-26 | `V*` |
| Composite, 1 surface, **posterior** (D2391) | $150 | ~$200-$215 | $350 | Delta back-teeth range $165-$530; D2391 $150-$350: https://realdentalcosts.com/en/dental-procedure-cost-list/ ; office fees $197-$212 | 2024-26 | `V*` |
| Composite, 2-3 surfaces, **posterior** (D2392/D2393) | $250 | ~$250-$335 | $530 | Delta; office fees D2392 $248-$271, D2393 $304-$333 | 2024-26 | `V*`. Insurers often **downgrade** posterior composites to the amalgam rate and bill the patient the difference (Delta, `V`) |
| Composite, all types (national average) | $173 | **$226** | $439 | https://www.carecredit.com/well-u/health-wellness/dental-tooth-fillings-cost-dental-fillings-financing/ | 2024 study | `V` |
| Amalgam (silver) filling | $108 | **$139** | $256 | https://www.carecredit.com/well-u/health-wellness/dental-filling-types/ | 2024 study | `V`. By surfaces: one surface about $50-$250; three or more about $120-$400 (cost guides, `V*`). A $110-$455 range by surface count is probably Delta Dental (`V*`) |
| Core buildup (D2950) | $150 | ~$300 | $450 | https://mednfly.com/blog/mednfly-academy/what-is-d2950-dental-code ; https://transcure.net/medical-billing/code/cdt/d2950/ | 2025-26 | `V*`. Insurers frequently deny it when billed with a crown |
| Crown, porcelain-fused-to-metal (PFM) | $770 | **$1,114** | $2,454 | https://www.carecredit.com/well-u/health-wellness/dental-crown-cost-dental-crown-financing/ | 2024 study | `V*` (summary attributes it to CareCredit). CareCredit's full-metal crown average is $1,211 |
| Crown, all-ceramic / porcelain (D2740) | $800 | **$1,369-$1,399** | $2,500 (state average up to $2,331 in CA) | CareCredit porcelain average $1,399 (same URL); $1,369 cash average from ASQ360/CareCredit, with state averages from $1,046 (AL) to $2,331 (CA): https://realdentalcosts.com/en/dental-crowns/ | 2024-26 | `V*`. ADA 2020 survey regional means for D2740 were $1,146-$1,408 (`V*`) |
| Crown, zirconia | $1,000 | ~$1,300-$1,500 (`U`) | $2,500-$2,700 | https://realdentalcosts.com/en/dental-crown-cost-materials/ | 2026 | `V*` for the range; the typical value is `U` |

### 1C. Endodontics (root canal; the final crown is **not** included)

| Item (CDT) | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Root canal, anterior (D3310) | $620 | ~$900-$1,000 | $1,200 | Humana $900: https://www.humana.com/dental-insurance/dental-resources/root-canals ; Delta Dental "typical charge" about $1,200: https://www.deltadental.com/protect-my-smile/procedures/root-canal/treatment-cost/ ; $620-$1,100: https://realdentalcosts.com/en/root-canal/ , https://www.goodrx.com/health-topic/oral/root-canal-cost ; $912 front tooth: https://www.valuepenguin.com/average-cost-root-canal | 2024-26 | `V` (Humana, Delta); `V*` (others) |
| Root canal, premolar (D3320) | $720 | ~$1,000-$1,050 | $1,300 | Humana $1,017; Delta about $1,300; guides $720-$1,300 | 2024-26 | `V`/`V*` |
| Root canal, molar (D3330) | $890 | **~$1,100-$1,250** | $1,500 (up to about $1,733) | ADA 2020 survey mean **$1,109** (regional $1,042-$1,219), via https://ebusiness.ada.org/Assets/docs/85994.pdf and https://pmc.ncbi.nlm.nih.gov/articles/PMC10902936/table/Tab1 ; Humana $1,175; a FAIR Health figure of $1,111 quoted in cost guides; ValuePenguin $1,246; Delta about $1,500; CareCredit national root-canal range $679-$1,733 (average $978): https://www.carecredit.com/well-u/health-wellness/what-is-a-root-canal/ , https://www.carecredit.com/well-u/health-wellness/common-dental-emergency-costs/ | 2020-26 | `V`/`V*`. Specialist endodontist fees sit at the high end (`U`) |

### 1D. Oral surgery

| Item (CDT) | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Simple extraction (D7140) | $137 | **$177-$225** | ~$300 (CareCredit's upper bound is $835) | CareCredit average $177, range $137-$835: https://www.carecredit.com/well-u/health-wellness/tooth-extraction-cost-financing/ ; Humana $225: https://www.humana.com/dental-insurance/dental-resources/tooth-extraction ; ADA 2020 survey mean $190 (regional $158-$209) | 2020-24 | `V`/`V*` |
| Surgical extraction (D7210) | $281 | **$325-$363** | $702 | CareCredit surgical / impacted average $363 per tooth, range $281-$702: https://www.carecredit.com/well-u/health-wellness/impacted-wisdom-teeth/ ; Humana $325 | 2024 | `V*` |
| Sedation add-on to an extraction | - | average **$349** (sedation) or **$639** (general anesthesia) | - | CareCredit extraction page (above) | 2024 | `V` |
| **Wisdom teeth, all 4, with sedation** | $1,200 | **~$2,750** (`D`; range $1,800-$3,700) | $4,175 (more in high-cost metros, `U`) | $1,200-$4,175 for all four: https://www.carecredit.com/well-u/health-wellness/wisdom-teeth-removal/ , https://www.dentalplans.com/learning/wisdom-tooth-removal-cost-without-insurance/ ; four complicated impactions average about $3,340 *before* sedation: https://www.goodrx.com/conditions/dental-care/wisdom-teeth-removal-cost | 2024 | `V*`. Typical derived as 4 x $363 + $349 = about $1,800 (simple) up to $3,340 + $349 = about $3,700 (impacted) |
| Socket-preservation bone graft (D7953) | $300 | ~$500 (`U` midpoint) | $800 | https://www.daydream.dental/blog-post/understanding-dental-code-d7953 ; https://medsdental.com/d7953-bone-replacement-graft-for-ridge-preservation ; CareCredit average range across *all* graft types is $549-$5,148: https://www.carecredit.com/well-u/health-wellness/bone-grafting-cost/ | 2025-26 | `V*`. Larger ridge grafts using donor or the patient's own bone run about $2,000-$3,500 |

### 1E. Replacing missing teeth

| Item | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| **Dental implant, single tooth, total** (implant + abutment + crown) | $3,000 | **~$4,500** | $5,733 (more with grafting or CT scan) | $3,760-$5,733: https://realdentalcosts.com/en/dental-implants/ ; $3,000-$5,000: https://smartarchesdental.com/resources/single-tooth-implant-cost-without-insurance/ ; average about $4,500: https://dentalsavingsguide.com/cost-of-dental-care ; CareCredit implant post only, average $2,143 (range $1,646-$4,157): https://www.carecredit.com/well-u/health-wellness/dental-implants-cost-dental-implants-financing/ | 2024-26 | `V`/`V*`. Components: post $1,000-$3,000, abutment $300-$1,000, crown $1,000-$3,000 |
| 3-unit fixed bridge | $2,000 | **~$3,600-$4,000** | $5,200 | Delta Dental out-of-network average about $3,600 (one summary says $3,965): https://www.deltadental.com/protect-my-smile/procedures/dental-bridges/treatment-cost/ ; averages of $3,965-$5,197: https://realdentalcosts.com/en/dental-bridge-cost/ | 2025-26 | `V*`. A Maryland (resin-bonded) bridge costs $1,500-$2,500; an implant bridge $5,000-$15,000 |
| Partial denture (cast metal) | $950 | ~$1,800-$2,230 | $3,100 | https://realdentalcosts.com/en/dentures/partial-dentures-cost/ ; https://www.goodrx.com/health-topic/oral/cost-of-dentures | 2026 | `V*`. Acrylic "flipper" $300-$900; flexible nylon $900-$2,000 (average about $1,760) |
| Complete denture, **per arch** | $500 (economy) | **$1,500-$2,000** | $3,600 (premium) | https://realdentalcosts.com/en/dentures/ ; https://www.theseniorlist.com/dentures/cost/ | 2025-26 | `V*`. Practices price per arch, so a "$499 denture" advertisement covers one plate |
| Complete dentures, **full set** (upper + lower) | ~$1,000 | **~$3,000-$4,000** | ~$6,500+ | CareCredit denture range $452-$6,514 (2023-24 study), per realdentalcosts (above) | 2024-26 | `V*`. A "traditional full set average $1,968" is also attributed to the CareCredit study. That conflicts with per-arch pricing, so treat the $1,968 as `U` |
| Implant-supported snap-in overdenture, per arch | `U` | `U` | `U` | not retrieved | - | `U`. Commonly quoted at roughly $5k-$15k per arch; verify before use |
| **All-on-4 fixed hybrid, per arch** | $15,000 | **~$20,000-$25,000** (acrylic) | $38,000 (zirconia; some quotes about $40k) | https://realdentalcosts.com/en/all-on-4/ ; https://globaldentalcomplex.com/all-on-4-cost-pricing-guide/ ; https://www.drarocha.com/all-on-4-dental-implants-cost | 2025-26 | `V*`. Both arches come to about $40k-$50k (`D`) |

### 1F. Gum (periodontal) care

| Item (CDT) | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| **Scaling and root planing, per quadrant** (D4341) | $185 | **$242** | $444 | CareCredit 2024 ASQ360 study: https://www.carecredit.com/well-u/health-wellness/scaling-and-root-planing-cost-financing/ ; Humana $235-$303 (Orlando): https://www.humana.com/dental-insurance/dental-resources/scaling-root-planing-cost | 2024 | `V`. D4342 (1-3 teeth) costs $150-$320 (`V*`) |
| Scaling and root planing, **full mouth** (4 quadrants) | $600 | **~$970** (`D`: 4 x $242) | $1,600 (about $1,780 at CareCredit's high end) | Same sources plus https://realdentalcosts.com/en/deep-cleaning-cost-scaling-root-planing/ | 2024-26 | `V*`/`D` |
| Periodontal maintenance visit (D4910) | $100 | ~$150-$175 | $300 | https://www.stluciedentist.com/blog/how-much-does-a-dental-cleaning-cost-without-insurance/ ; https://boomcloudapps.com/dental-code-d4910-stop-letting-ppos-steal-your-profits-start-growing-your-practice-smarter/ ; cash price about $98: https://www.carepriceguide.com/procedures/D4910 | 2025-26 | `V*`. Usually every 3-4 months, so about **$450-$1,000 per year**, versus about $220 per year for two routine cleanings |
| Osseous (pocket-reduction) surgery, per quadrant (D4260) | $500 | ~$1,000-$2,000 (`U`) | $3,000 | CareCredit says "from $120 per tooth up to $3,000 per quadrant": https://www.carecredit.com/well-u/health-wellness/osseous-surgery/ ; other guides $500-$2,000 per quadrant | 2024-26 | `V*`; the typical value is `U` |
| Gum graft (connective tissue, D4273), first tooth | $600 | ~$1,100 | $1,470 per tooth | $600-$1,200: https://realdentalcosts.com/en/gum-graft-cost/ ; average $1,120 ($770-$1,470 by city) per a D4273 price guide (drbestprice.com) | 2024-26 | `V*`. Multi-tooth areas cost $1,500-$3,000. The "gum graft surgery" national average is $2,742 (range $2,120-$4,982), probably from CareCredit: https://www.carecredit.com/well-u/health-wellness/gum-graft-cost-financing/ (`V*`) |

### 1G. Mouthguards and night guards

| Item | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Custom night guard from a dentist | $200 | **$300-$500** | $1,000 | https://www.goodrx.com/conditions/dental-care/night-guard-cost | 2025 | `V` |
| Custom night guard, online lab kit | $50 | ~$175 | $200 | Same | 2025 | `V` |
| Over-the-counter night guard | $15 | **$20-$30** | $100 | Same (CVS-type price $20-$30) | 2025 | `V` |
| Custom sports mouthguard from a dentist | $100-$150 | ~$250 (`U` midpoint) | $500 (up to $700) | https://www.gumgear.com/blog/custom-mouthguard-cost-worth-it ; https://mydentalhome.com/blog/how-much-are-mouthguards/ | 2025-26 | `V*` (non-authoritative guides) |
| Boil-and-bite or stock mouthguard | $10 | **$25-$30** | $40 | American Association of Orthodontists (AAO): https://aaoinfo.org/whats-trending/how-much-should-mouthguards-cost/ | ~2025 | `V` |

### 1H. Orthodontics

| Item | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Metal braces (comprehensive) | $3,000 | **$6,343** (CareCredit average) | $7,500 (complex cases up to about $9k+, `U`) | https://www.carecredit.com/well-u/health-wellness/dental-braces-cost-dental-braces-financing/ ; https://www.dentalplans.com/blog/how-much-do-braces-cost-without-insurance/ | 2023-24 study | `V`. Another summary gives $6,352. CareCredit: ceramic $5,834, lingual $9,221 |
| Clear aligners (Invisalign etc.) | $2,000 (mild cases) | **$5,108** (CareCredit average); Invisalign about $5,000-$7,000 | $8,000-$9,500 | https://www.carecredit.com/well-u/health-wellness/invisalign-cost-invisalign-financing/ ; https://www.invisalign.com/invisalign-cost | 2024-26 | `V*`. The AAO is quoted in guides as saying $3,000-$7,000 (`V*`) |

### 1I. Sedation, emergencies and the hospital

| Item | Low | Typical | High | Source URL | Year | Status / notes |
|---|---|---|---|---|---|---|
| Nitrous oxide / laughing gas (D9230), per visit | $50 | ~$80-$125 | $200 | https://health.costhelper.com/dental-sedation.html ; https://serenitydentalbloom.com/blog/laughing-gas-at-the-dentist ; https://biologyinsights.com/how-much-does-laughing-gas-cost-at-the-dentist/ | 2025-26 | `V*` |
| IV moderate sedation (D9239 plus D9243 increments) | $300 | ~$500-$700 per hour-long case (`U`) | $1,000 (some quote up to $800 per hour) | https://www.pearldentalgroup.com/cost-of-iv-sedation-dentist/ ; https://www.katycypressoralsurgery.com/how-much-does-sedation-dentistry-cost/ ; https://realdentalcosts.com/en/dental-costs/sedation-dentistry-cost/ ; CareCredit sedation average $349, general anesthesia $639 (see 1D) | 2024-26 | `V*`/`U` |
| **Child's full-mouth treatment under general anesthesia in a hospital OR** (facility + anesthesia + dentistry) | `U` (about $2,500+) | **$7,303 in 2012** (about **$10,000 in 2024 dollars**, `D`) | `U` ($10k-$15k+) | Rashewsky et al., Anesthesia Progress 2012 (Stony Brook): https://pmc.ncbi.nlm.nih.gov/articles/PMC3522492 , https://www.researchgate.net/publication/233929543_Time_and_Cost_Analysis_Pediatric_Dental_Rehabilitation_with_General_Anesthesia_in_the_Office_and_the_Hospital_Settings ; older component costs (anesthesia $145 for the first 30 minutes plus $73 per additional 30 minutes; recovery room $110 per hour): https://www.aapd.org/globalassets/media/publications/archives/lee-22-01.pdf | 2012 (2001) | `V` for the study figure; the current range is `U`. In the same study, office-based anesthesia cost a small fraction (summary says about $414, `U`). Operating-room treatment of early childhood decay took **25% of Medicaid dental spending for 2% of children** (`V*`) |
| **Emergency-room visit for dental pain** (not admitted) | $400 | **$749 average cost in 2012** (about $1,000 in 2024 dollars, `D`). Average *charges* are now about **$1,900-$2,400 per visit** (`D`, from CareQuest totals) | $1,500-$2,000+ | ADA Health Policy Institute (HPI) 2015 figures via https://www.astdd.org/docs/reducing-emergency-department-utilization-for-non-traumatic-dental-conditions-january-2020.pdf ; https://www.carequest.org/resource-library/recent-trends-hospital-emergency-department-visits-non-traumatic-dental-conditions ; ER $400-$1,500 versus $90-$200 at a dentist: https://www.dentalplans.com/learning/dental-emergency-no-insurance-toothache-er-visits/ , https://www.baptisthealth.com/blog/emergency-care/emergency-room-for-dental-pain | 2012-2022 | `V`/`D`. **ERs usually cannot fix the problem.** They give pain relief and/or antibiotics plus a referral. Antibiotics do not cure a tooth infection, and definitive treatment (filling, root canal, extraction) still has to happen at a dentist: https://www.goodrx.com/conditions/dental-care/can-you-go-to-the-er-for-tooth-pain , https://www.adventhealth.com/blogs/can-you-go-emergency-room-a-toothache (`V`). One guide claims about 40% of patients return to the ER for the same problem (`U`) |

### 1J. Suggested in-game default prices (rounded from the Typical column; `D`)

| Game action | Default price | | Game action | Default price |
|---|---|---|---|---|
| Checkup (exam + cleaning + x-rays) | $200 | | Root canal, molar | $1,200 |
| Periodic exam alone | $60 | | Core buildup | $300 |
| Adult cleaning / child cleaning | $110 / $85 | | Crown (PFM / ceramic or zirconia) | $1,100 / $1,370 |
| Bitewings / panoramic x-ray | $65 / $130 | | Simple / surgical extraction | $200 / $350 |
| Fluoride varnish / sealant per tooth | $35 / $42 | | Wisdom teeth, all 4, with sedation | $2,750 |
| Emergency exam + x-ray | $165 | | Socket graft | $500 |
| Filling: composite small / large | $210 / $300 | | Implant, all-in | $4,500 |
| Filling: amalgam | $140 | | 3-unit bridge | $3,800 |
| Root canal, front tooth / premolar | $950 / $1,050 | | Partial denture | $2,000 |
| Deep cleaning, per quadrant / full mouth | $242 / $970 | | Complete dentures, per arch / set | $1,750 / $3,500 |
| Periodontal maintenance visit | $160 | | All-on-4, per arch | $22,500 |
| Osseous surgery, per quadrant (`U`) | $1,500 | | Gum graft, per tooth | $1,100 |
| Night guard: custom / OTC | $400 / $25 | | Braces / aligners | $6,300 / $5,100 |
| Sports guard: custom / boil-and-bite | $250 / $25 | | Nitrous / IV sedation (`U`) | $100 / $600 |
| ER visit for toothache (no fix) | $1,000 (range $750-$2,400) | | Child's treatment under anesthesia in hospital | $10,000 |

**Cost-of-delay ladders for early-versus-late treatment (`D`; uninsured, typical prices)**

- **Prevention:** 2 exams + 2 cleanings + 1 bitewing set is about **$405 per year**. That matches 2 x CareCredit's $203 checkup.
- **Decay track on one molar:**
  1. Sealant or fluoride: about $40.
  2. Small filling: about $210.
  3. Large filling: about $300, or a crown at about $1,100-$1,400.
  4. Nerve infection: root canal $1,200 + buildup $300 + crown $1,300, about **$2,800**.
  5. Tooth lost: extraction $250 + graft $500 + implant $4,500, about **$5,250**. Alternatives are a bridge (about $3,800), a partial denture (about $2,000), or leaving a gap.
  - An ER detour along the way adds about $750-$2,400 in charges and fixes nothing.
- **Gum track:**
  1. Gingivitis: routine cleanings, about $220 per year.
  2. Periodontitis: deep cleaning about $970, then maintenance about $640 per year (4 x $160) indefinitely.
  3. Advanced disease: osseous surgery about $1,500 per quadrant (`U`) plus grafts about $1,100 per tooth.
- **End state:** complete dentures about $3,500 per set, or All-on-4 about $45,000 for both arches.
- **Insured example** (100/80/50 plan, $50 deductible, $1,500 annual maximum) for a molar root canal + buildup + crown at $2,800: the plan share would be $920 + $150 + $650 = $1,720. The $1,500 cap cuts that, so **the patient still pays about $1,300** (`D`). In-network negotiated fees are lower than the cash fees above; how much lower was not retrieved (`U`).

---

## 2. Dental insurance norms

| Topic | Finding | Source URL | Year | Status |
|---|---|---|---|---|
| Coinsurance tiers | Most PPO plans use **100/80/50**: 100% preventive (exams, cleanings, x-rays), 80% basic (fillings, simple extractions), 50% major (crowns, bridges, dentures). This applies in-network after the deductible | https://www.humana.com/dental-insurance/dental-resources/what-does-dental-insurance-cover ; https://realdentalcosts.com/en/dental-insurance/ | 2025-26 | `V*` |
| Deductibles | **$50-$150 per person**, $150-$300 per family; usually waived for preventive care | Same | 2025-26 | `V*` |
| Annual maximums | Typically **$1,000-$2,000** per person per year. Some newer plans offer $2,000+, but many still market $1,000 | https://adanews.ada.org/ada-news/2025/december/dear-ada-annual-maximums/ | Dec 2025 | `V` |
| History of maximums | The $1,000 maximum was "established some 40 years ago" and has not kept pace with inflation or care costs. In **2024 the ADA adopted policy opposing annual and lifetime maximums** | Same ADA News piece | 2025 | `V` |
| Maximums in today's dollars | $1,000 in 1973 is about **$7,065** in 2024 dollars; in 1975 about $5,831; in 1980 about $3,807 (CPI-U). Popular articles say "$7,000-$8,000 today". One blog says a 1980 maximum covered 5-6 crowns and today's covers about one | My CPI-U arithmetic (`D`; the CPI index values are from memory, `U`); https://www.grantspasstribune.com/dental-insurance-stuck-in-the-1970s-as-american-households-absorb-the-rising-cost-of-care/ ; https://policyzen.ai/learn/understanding-dental-insurance.html | - | `D`/`U`; `V*` for the article claims. Note the ADA piece says about 40 years (1980s), while the popular framing says the 1970s |
| Waiting periods | Preventive: none. Basic: about **3-6 months**. Major: about **6-12 months**, typical of individual plans; employer plans often waive them (`U`) | https://realdentalcosts.com/en/dental-insurance/ ; https://www.humana.com/dental-insurance/complete-dental-plan | 2025-26 | `V*` |
| Other plan limits | Posterior composites are "downgraded" to the amalgam rate. Frequency limits (2 cleanings per year) and missing-tooth clauses are common (`U`) | https://www.deltadental.com/protect-my-smile/procedures/tooth-filling/cost-and-insurance-coverage/ | 2025 | `V` for the downgrade |
| **Adults without dental insurance** | **27% of US adults (about 72 million)**, nearly **3x** the number without health insurance (CareQuest SOHEA survey, reported May 2025). Earlier estimates: 68.5 million (2023 survey), 77 million (2022 report) | https://www.businesswire.com/news/home/20250521166187/en/New-Report-72-Million-Adults-in-the-US-Lack-Dental-Insurance-Nearly-Three-Times-the-Number-Without-Health-Insurance ; https://carequest.org/press-release/new-report-68-5-million-adults-in-the-us-dont-have-dental-insurance-may-rise-to-91-4-million-by-end-of-year/ ; https://www.carequest.org/about/press-release/new-report-77-million-adults-do-not-have-dental-insurance | 2022-25 | `V` |
| Industry enrollment count (all ages) | National Association of Dental Plans (NADP): about **284 million Americans (about 83%) had some dental benefit in 2024**, so roughly 1 in 6 had none. Enrollment is declining. Mix: 51% employer, 28% Medicaid/CHIP, 8% Medicare, 3% individual | https://www.nadp.org/nadp-report-shows-continued-decline-in-dental-benefits-enrollment/ ; https://www.globenewswire.com/news-release/2024/12/11/2995493/0/en/NADP-Report-Reveals-Overall-Decrease-in-Dental-Benefits-Enrollment.html | 2025 report (2024 data) | `V*`. One summary said "13% have no coverage", which conflicts with 83% covered (`U`) |
| Adults with private dental coverage | **62%** of adults had private dental insurance in 2022 (ADA HPI) | https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/national_trends_dental_use_benefits_barriers_2024.pdf | 2024 report (2022 data) | `V*` |
| Adult Medicaid dental | Adult dental is **optional** in Medicaid and varies by state: none, emergency-only, limited, or extensive. Roughly half of states offer "extensive" benefits; exact counts were not retrieved. State trackers: CareQuest coverage checker; Center for Health Care Strategies (CHCS) fact sheet | https://carequest.org/resource/medicaid-adult-dental-coverage-checker/ ; CHCS (URL from memory): https://www.chcs.org/resource/medicaid-adult-dental-benefits-an-overview/ | - | `U` |
| Dental visits: Medicaid vs private | **18% of Medicaid adults vs 57% of privately insured adults** saw a dentist in 2022 (ADA HPI) | ADA HPI 2024 PDF (above) | 2022 | `V*` |
| Children: Medicaid and CHIP | Medicaid's EPSDT benefit requires comprehensive dental care for enrollees under 21. CHIPRA (2009) made dental coverage mandatory in CHIP. The ACA made pediatric dental an essential health benefit, which can be sold stand-alone | not retrieved | - | `U` (well-established law; cite primary sources before publishing) |
| Traditional Medicare | Does **not** cover routine preventive dental (exams, cleanings, x-rays) or restorative care (fillings, crowns, dentures). Only narrow medically necessary exceptions apply | https://www.kff.org/medicare/coverage-of-dental-services-in-traditional-medicare/ ; https://www.kff.org/medicare/medicare-and-dental-coverage-a-closer-look/ | 2021-25 | `V`; the list of exceptions is `U` |
| Medicare Advantage (MA) dental | **98%** of individual MA plans offer some dental (2026). **Average annual dental limit about $1,300; most common $1,000.** 64% of enrollees with preventive benefits pay $0 for them. **50% coinsurance** is most common for fillings, extractions and root canals (range 20-70%). About 10% of enrollees must pay a separate premium for dental | https://www.kff.org/medicare/medicare-advantage-in-2026-premiums-out-of-pocket-limits-supplemental-benefits-and-prior-authorization/ ; https://www.kff.org/medicare/drilling-down-on-dental-coverage-and-costs-for-medicare-beneficiaries/ | 2024-26 | `V*` (these figures come from 2024-26 KFF analyses) |
| Seniors' dental use and spending | **47% of Medicare beneficiaries had no dental visit** in the past year. Among users, average out-of-pocket spending on dental was **$874** in 2018 ($992 traditional Medicare, $766 MA). The top 10% spent **$2,136 or more** | https://www.kff.org/health-costs/dental-hearing-and-vision-costs-and-coverage-among-medicare-beneficiaries-in-traditional-medicare-and-medicare-advantage/ ; https://www.kff.org/medicare/most-medicare-beneficiaries-lack-dental-coverage-and-many-go-without-needed-care/ | 2018 data | `V` |
| **Cost as the top barrier** | ADA HPI (National Health Interview Survey, NHIS, analyses): cost is the most-cited reason adults skip dental care, and financial barriers are higher for dental care than for medical care, prescriptions, mental health care or eyeglasses (Vujicic, Buchmueller & Klein, *Health Affairs* 2016). CareQuest: lower-income adults are significantly more likely to report cost as a barrier | ADA HPI 2024 PDF (above); https://carequest.org/resource/uninsured-and-in-need/ | 2016-25 | `U` for the HPI specifics; `V*` for the CareQuest statement |

---

## 3. Population calibration statistics

> Most of this section is **`U`**: the search budget ran out before it could be checked. The values are what I understand the named sources to report. Verify them against the listed primary sources, which are CDC/NCHS/NIDCR pages; those URLs are from memory where marked.

| Metric | Value | Population / years | Source | Status |
|---|---|---|---|---|
| Caries experience (treated or untreated), youth | **45.8%** (ages 2-19). By age: **21.4%** (2-5), **50.5%** (6-11), **53.8%** (12-19) | NHANES 2015-16 | NCHS Data Brief 307 (Fleming & Afful 2018), https://www.cdc.gov/nchs/products/databriefs/db307.htm (URL from memory) | `U` |
| Untreated caries, youth | **13.0%** (ages 2-19) | NHANES 2015-16 | Same | `U` |
| Caries experience in primary teeth, ages 2-5 | about **23%** (roughly 1 in 4 to 1 in 5) | NHANES 2011-16 | CDC Oral Health Surveillance Report 2019 | `U` |
| Caries in primary teeth, ages 6-8 | **more than 50%** (about 52%) have had a cavity in baby teeth | NHANES 2011-16 | CDC children's oral-health facts | `U` |
| Caries in permanent teeth, ages 12-19 | about **57%** | NHANES 2011-16 | CDC | `U` |
| Untreated decay, children | about **20%** of ages 5-11 (1 in 5); about **13%** of ages 12-19 (1 in 7). Low-income 5-19-year-olds: 25% vs 11% for higher-income | NHANES 2011-14/16 | CDC children's oral-health facts | `U` |
| **Adults 20-64 with caries experience** in permanent teeth | about **90%** (91% in 2011-12) | NHANES 2011-12 and 2011-16 | NCHS Data Brief 197 (Dye et al. 2015), https://www.cdc.gov/nchs/products/databriefs/db197.htm (URL from memory); CDC OHSR 2019 | `U` (matches the brief's ~90%) |
| Untreated decay, adults 20-64 | about **26-27%** (about 1 in 4) | 2011-16 | Same | `U` |
| Adults 65+: caries experience / untreated | about **96%** / about **16-19%** | 2011-16 | CDC | `U` |
| Newer data cycle | The CDC Oral Health Surveillance Report covering **2017-March 2020** (published about 2024) updates caries and tooth-loss figures. **Not retrieved** | NHANES 2017-Mar 2020 | CDC (URL not verified) | `U` |
| Mean DMFT (decayed, missing, filled teeth) by age | **Not retrieved.** Rough prior from older NHANES: about 1-2 in teens, about 6-8 at 20-34, about 10-12 at 35-49, about 14-16 at 50-64, about 17-20 at 65+ | NHANES 1999-2004 (NIDCR tables) | https://www.nidcr.nih.gov/research/data-statistics/dental-caries/adults (URL from memory) | `U`, **low confidence; verify before using** |
| **Periodontitis, adults 30+** | **42.2% total; 7.8% severe**; 34.4% mild or moderate | NHANES 2009-14 | Eke et al., JADA 2018;149(7):576-588 | `U` (matches the brief) |
| Periodontitis, earlier estimate | **47.2%** of adults 30+; **about 70%** of adults 65+ | NHANES 2009-10 | Eke et al., J Dent Res 2012 (as cited on CDC's periodontal page) | `U` |
| **Edentulism (no natural teeth)** | 65+: about **17%** (about 1 in 6). **65-74: about 13%; 75+: about 26%** | NHANES 2011-16 | CDC adult oral-health facts / OHSR 2019 | `U` |
| Edentulism, adults 20-64 | about **2%** | NHANES 2011-12 | NCHS Data Brief 197 | `U` |
| Mean remaining teeth | about **25.5** (ages 20-64); about **18.9** (65+) | NHANES 1999-2004 | NIDCR tooth-loss tables | `U` |
| Dental visit in past year: children 2-17 | about **85%** | NHIS 2019-22 | CDC FastStats "Oral and Dental Health" | `U` |
| Dental visit in past year: adults 18-64 | about **63-65%** | NHIS 2019-22 | CDC FastStats / NCHS | `U` |
| Dental visit in past year: Medicare beneficiaries | **53%** used dental care, i.e. **47% had no visit** | MCBS 2018 | KFF (URLs in Section 2) | `V` |
| Dental visit by coverage type | **57%** privately insured vs **18%** Medicaid adults (ADA HPI; this measure runs lower than NHIS) | 2022 | ADA HPI 2024 PDF | `V*` |
| Dental anxiety | about **36%** have some dental fear or anxiety; about **12%** have extreme fear | Review of surveys | Beaton, Freeman & Humphris, *Prim Dent J* 2014 | `U` |
| School hours lost | **More than 34 million school hours per year** lost to unplanned (emergency) dental care | NHIS 2008 | CDC oral-health facts (Naavaal & Kelekar 2018) | `U` |
| Work hours lost | about **92 million work hours per year** lost to unplanned dental care. An older CDC figure was 164 million (1990s data) | NHIS 2008 | Kelekar & Naavaal, *Prev Chronic Dis* 2018 | `U` |
| Productivity loss | **More than $45 billion per year** in lost US productivity from untreated dental disease | 2015 | CDC, citing Righolt et al., *J Dent Res* 2018 | `U` |
| **ER visits for non-traumatic dental conditions** | **2.11M (2010) rising to 2.18M (2012)**; cost **$1.6B**, average **$749 per visit** (2012) | 2010-12 | ADA HPI 2015 brief via https://www.astdd.org/docs/reducing-emergency-department-utilization-for-non-traumatic-dental-conditions-january-2020.pdf | `V` |
| ER dental visits (ADA framing) | "**Every 14 seconds**", about **2.2M visits per year**, costs **over $2.4B**. The ADA estimates about **80%** could be handled in community dental settings | ADA | https://www.ada.org/resources/community-initiatives/action-for-dental-health/emergency-department-referrals | `V*` |
| ER dental visits | about **2.4M** visits in 2014 (Nationwide Emergency Department Sample); a search summary gave an average charge of about $992 | 2014 | https://jada.ada.org/article/S0002-8177(18)30800-6/abstract | `V*` for visits; `U` for the charge |
| **ER dental visits (latest)** | **1.8M visits costing $3.4B (2019)**; **1.6M visits costing $3.9B (2022)**. Average annual charges rose **62% since 2014** even as the visit rate fell. Heaviest users: ages 25-34, uninsured or Medicaid, rural, income under $48k | 2019-22 | https://www.carequest.org/resource-library/recent-trends-hospital-emergency-department-visits-non-traumatic-dental-conditions ; https://www.carequest.org/system/files/CareQuest-Institute-MDAC-Report-on-ED-Trends.pdf | `V` |
| ER dental *spending* (paid amounts, not charges) | about **$800M in 2016**, up **216%** since 1996; the growth was mainly adults and publicly paid | 1996-2016 | JADA 2022: https://pubmed.ncbi.nlm.nih.gov/35753834/ | `V` |

---

## 4. Opportunity-cost framing ("what else the money could have bought")

### 4A. Return assumptions (all `U`)
- Financial-education tools commonly assume about **7% per year nominal** for a diversified US stock index fund. That is about **4-5% real** after 2-3% inflation, and **5% real** is a common conservative teaching figure.
- Historical US large-company stocks returned about 10% nominal and about 6.5-7% real per year since 1926 (Ibbotson/SBBI; Siegel).
- **Recommendation for the game:** use **5% real** as the default so all amounts stay in today's dollars, and optionally show the 7% nominal figure.

### 4B. Compounding reference (`D`)
| $1,000 today grows to... | 10 yrs | 20 yrs | 30 yrs | 40 yrs | 50 yrs |
|---|---|---|---|---|---|
| at 5% real | $1,629 | $2,653 | $4,322 | $7,040 | $11,467 |
| at 7% nominal | $1,967 | $3,870 | $7,612 | $14,974 | $29,457 |

- $400 per year (about the uninsured prevention budget) invested at 5% real reaches **$13,226 after 20 years** or **$48,320 after 40 years**. At 7% it reaches $16,398 or $79,854.
- A $2,800 root canal + crown avoided at age 30 would be worth **$15,445 at 65** at 5% real ($29,894 at 7%). A $5,250 extraction + implant would be worth **$28,683** at 5% real ($55,518 at 7%).

### 4C. Relatable 2025 price benchmarks (all `U`; verify before shipping)
| Benchmark | Approximate 2025 value | Where to verify | Status |
|---|---|---|---|
| Average used-car price | about **$25,000-$26,000** (average listing or transaction price) | Cox Automotive / Kelley Blue Book; Edmunds used-vehicle reports | `U` |
| Average monthly rent | about **$1,700** median asking rent. Zillow's rent index is about $2,000; Apartment List's median is about $1,400; the Census 2023 median gross rent was about $1,400 | Realtor.com / Redfin rental reports; Zillow ZORI; Census ACS | `U` |
| Average family vacation | about **$4,000-$6,000** for a family of four for one week | Bankrate / ValuePenguin vacation-cost surveys | `U` |

- Example comparison (`D`, using the `U` benchmarks): a $2,800 molar rescue equals about **1.6 months of rent**, about **11% of a used car**, or about **half to two-thirds of a family vacation**.

---

## 5. UK / Canada / Australia (one line, `U`, not researched)
- **UK:** NHS England patient charges are banded, at about £27 (Band 1: exam), £75 (Band 2: fillings, root canals) and £327 (Band 3: crowns, dentures) for 2025-26.
- **Canada:** the federal Canadian Dental Care Plan, rolled out 2024-25, covers uninsured residents with family income under C$90k.
- **Australia:** the Child Dental Benefits Schedule gives eligible children a capped benefit of about A$1,000+ over two years.
- All of this is `U`.

## 6. Gaps to close when web access is available
1. CDC/NCHS primary pages for every `U` row in Section 3, especially the **2017-March 2020 CDC surveillance report** and the NIDCR DMFT and remaining-teeth tables.
2. Current state counts for Medicaid adult dental coverage (CHCS / CareQuest checker), and the ADA HPI cost-barrier percentages from NHIS 2022-24.
3. Section 4C benchmarks: Cox/KBB used-car average, a rent index, and a vacation survey.
4. FAIR Health ZIP-level lookups for a few representative ZIPs, to anchor regional multipliers.
5. The full CareCredit cost list page (carecredit.com/dentistry/costs), to confirm the exact averages quoted here from search summaries.
