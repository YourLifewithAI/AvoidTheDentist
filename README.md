# Avoid the Dentist

*A cozy pixel-art life-sim about the everyday choices that add up to a lifetime of teeth, comfort, confidence and money.*

![Key art](docs/art/keyart.png)

You live one life, from the first tooth to the rocking chair, in a dollhouse cutaway. Time runs by itself; you set habits,
pick a job, play sports, answer life's little prompts, and watch a *person* (not their teeth) live with the results.
Replay any moment with the same luck and one different choice, and see your life as one of 100 lives like it.

**Status: planning checkpoint (M0).**

- **[Game plan](docs/GAME_PLAN.md):** vision, loops, choice systems, the hidden model, money, art direction, ethics, tech, roadmap, open questions
- **[Simulation report](docs/SIM_REPORT.md):** calibration vs. CDC data, preset lives, which choices matter most, Maya's "same luck" pair
- **[Research notes](docs/research/):** the evidence base, with verification tags
- **Art samples:** `docs/art/` (house, UI mockup, life lineup, cast, feelings, work & play, two lives, clinic, props, palette)

## Run it

Requires Node 18+. The art and the model have no dependencies.

```bash
npm run art           # render every art sample to docs/art/
npm run sim           # preset lives, 500 each
node sim/levers.mjs   # one choice at a time, same luck
node sim/calibrate.mjs  # model vs. US surveillance data
node sim/report.mjs   # regenerate docs/SIM_REPORT.md
npm install && npm run review   # build docs/review.html: live art, the chart and a What-If Lab in one page (needs esbuild)
```

## Layout

- `art/`: pixel-art toolkit (framebuffer, role-based palette sprites, bitmap font) and every sprite and scene. It runs in Node and the browser.
- `sim/`: the deterministic life model, with evidence-tagged parameters and "same luck" random streams.
- `web/`: the single-file review page (live house demo, gallery, What-If Lab running the real model in a Web Worker).
- `tools/`: art export, preview and the review-page build.

Not medical advice. Costs are typical 2024–26 US figures.
