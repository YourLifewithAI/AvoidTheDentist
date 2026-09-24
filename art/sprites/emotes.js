// Emote overlays: the little comic marks that carry feelings.
import { sprite } from '../lib/pix.js';

export const EMOTE = {
  sweat: sprite(`
.o.
obo
okb
.o.
`, { b: 'blue3', k: 'blue4' }),
  pain: sprite(`
..r
.r.
...
rrr
...
.r.
..r
`, { r: 'red1' }),
  shiver: sprite(`
b.
.b
b.
.b
`, { b: 'blue3' }),
  grr: sprite(`
w.w.w
.w.w.
`, { w: 'white' }),
  zzz: sprite(`
kkk....
..k....
.k.kkk.
kkk..k.
....k..
....kkk
`, { k: 'cream' }),
  sparkle: sprite(`
..y..
..y..
yykyy
..y..
..y..
`, { y: 'gold2', k: 'gold3' }),
  sparkleSm: sprite(`
.y.
yky
.y.
`, { y: 'gold2', k: 'gold3' }),
  note: sprite(`
..oo
..oo
..o.
.oo.
ooo.
.o..
`, { o: 'ink2' }),
  heart: sprite(`
.r.r.
rrrrr
.rrr.
..r..
`, { r: 'red2' }),
  exclaim: sprite(`
oo
oo
oo
..
oo
`, { o: 'red1' }),
  dollar: sprite(`
.g.
ggg
g..
ggg
..g
ggg
.g.
`, { g: 'green1' }),
};
