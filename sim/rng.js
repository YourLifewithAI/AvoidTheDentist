// Deterministic random streams.
//
// Every stochastic process (each tooth's decay, each tooth's restoration,
// sports injuries, visit skipping, ...) draws from its OWN named stream.
// Hazards are applied with the cumulative-hazard method: a process fires when
// its accumulated hazard crosses an Exp(1) threshold drawn from its stream.
// Result: two lives with the same seed share the same "luck" process by
// process, so changing one choice (e.g. soda at 34) changes outcomes only
// through that choice. This is what powers the game's "Same luck, one
// choice" replay.

// cyrb53-style string hash -> 32-bit seed
export function hash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

// sfc32: small, fast, good-quality PRNG
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export class Streams {
  constructor(seed) {
    this.seed = seed >>> 0;
    this.map = new Map();
  }
  get(name) {
    let s = this.map.get(name);
    if (!s) {
      const h = hash(name, this.seed);
      s = sfc32(h, hash(name + '#1', this.seed), hash(name + '#2', this.seed), this.seed ^ 0x9e3779b9);
      for (let i = 0; i < 12; i++) s(); // warm up
      this.map.set(name, s);
    }
    return s;
  }
  u(name) { return this.get(name)(); }
  exp(name) { return -Math.log(1 - this.get(name)()); }
  pick(name, weights) {
    const r = this.u(name) * weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    for (let i = 0; i < weights.length; i++) { acc += weights[i]; if (r < acc) return i; }
    return weights.length - 1;
  }
}

// A hazard clock: accumulate hazard (per-year rate * dt years); fire when it
// crosses an Exp(1) threshold from the process's own stream.
export class Clock {
  constructor(streams, name) {
    this.streams = streams;
    this.name = name;
    this.acc = 0;
    this.threshold = streams.exp(name);
  }
  tick(ratePerYear, dtYears) {
    if (ratePerYear <= 0) return false;
    this.acc += ratePerYear * dtYears;
    if (this.acc >= this.threshold) {
      this.acc = 0;
      this.threshold = this.streams.exp(this.name);
      return true;
    }
    return false;
  }
  reset() { this.acc = 0; }
}
