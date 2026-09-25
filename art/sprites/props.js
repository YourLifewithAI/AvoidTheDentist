// Small props: things people hold, use, and leave around the house.
// Each prop carries its own color key; 'o' is ink outline.
import { sprite } from '../lib/pix.js';

export const PROP = {};

PROP.mug = sprite(`
ooooo.
oyyyo.
oxxxoo
oxxxoo
.ooo..
`, { x: 'red2', y: 'wood1' });

PROP.steam = sprite(`
.k..
..k.
.k..
`, { k: 'mist' });

PROP.cupcake = sprite(`
..or..
.oxxo.
oxkxxo
oyYyYo
.oyYo.
..oo..
`, { r: 'red1', x: 'pink2', k: 'pink3', y: 'gold2', Y: 'gold1' });

PROP.donut = sprite(`
.oooo.
oxkxxo
xro.kx
oxxrxo
.oooo.
`, { x: 'pink2', k: 'cream', r: 'teal2' });

PROP.soda = sprite(`
.tt.
oxxo
oxwo
oxxo
oxxo
.oo.
`, { x: 'red1', w: 'cream', t: 'stone' });

PROP.dietSoda = sprite(`
.tt.
oxxo
oxwo
oxxo
oxxo
.oo.
`, { x: 'mist', w: 'red1', t: 'stone' });

PROP.energy = sprite(`
.tt.
oxxo
oyxo
oxyo
oxxo
.oo.
`, { x: 'ink2', y: 'green3', t: 'stone' });

PROP.water = sprite(`
.oo.
.xx.
oyyo
oyko
oyyo
oyyo
.oo.
`, { x: 'teal1', y: 'blue3', k: 'white' });

PROP.phone = sprite(`
oooo
obbo
obko
obbo
oooo
`, { b: 'blue2', k: 'blue4' });

PROP.phoneRing = sprite(`
k....k
.k..k.
......
`, { k: 'gold2' });

PROP.icepack = sprite(`
.oooo.
obkbbo
obbbbo
.oooo.
`, { b: 'blue3', k: 'blue4' });

PROP.icecream = sprite(`
.oo.
oxko
oxxo
oyyo
.oy.
.oo.
`, { x: 'pink3', k: 'white', y: 'wood4' });

PROP.spoon = sprite(`
.oo
oxo
.o.
.o.
.o.
`, { x: 'mist' });

PROP.toothbrush = sprite(`
okkoo...
.oooxxxx
`, { k: 'white', x: 'teal2' });

PROP.apple = sprite(`
..g.
.oo.
oxko
oxxo
.oo.
`, { x: 'red1', k: 'red3', g: 'green1' });

PROP.laptop = sprite(`
.oooooooo.
.obbbbbbo.
.obkbbbbo.
.obbbbbbo.
oooooooooo
otttttttto
.oooooooo.
`, { b: 'blue1', k: 'blue3', t: 'stone' });

PROP.balloon = sprite(`
.oooo.
oxkxxo
okxxxo
oxxxXo
oxxXXo
.oXXo.
..oo..
`, { x: 'teal2', k: 'teal3', X: 'teal1' });

PROP.sticker = sprite(`
.o.
oxo
.o.
`, { x: 'gold2' });

PROP.rattle = sprite(`
.oo.
oxko
oxxo
.oo.
..o.
..o.
`, { x: 'pink2', k: 'pink3' });

PROP.sippy = sprite(`
.oo.
oxxo
okko
okko
.oo.
`, { x: 'teal2', k: 'gold2' });

PROP.backpack = sprite(`
.oooo.
oxxxxo
oxkkxo
oxxxxo
.oooo.
`, { x: 'red1', k: 'red2' });

PROP.book = sprite(`
oooooo
oxkkxo
oxkkxo
oooooo
`, { x: 'teal1', k: 'cream' });

PROP.floss = sprite(`
.ooo.
oxkxo
oxxxo
.ooo.
`, { x: 'teal2', k: 'white' });

PROP.guard = sprite(`
.oooo.
oxkkxo
.oooo.
`, { x: 'blue3', k: 'blue4' });

PROP.gum = sprite(`
oooooo
oxkxxo
oooooo
`, { x: 'green3', k: 'white' });

PROP.candy = sprite(`
o.ooo.o
oxokoxo
o.ooo.o
`, { x: 'pink2', k: 'pink3' });

PROP.ticket = sprite(`
oooooooo
okkrkkko
okkrkkko
oooooooo
`, { k: 'cream', r: 'red1' });

PROP.pill = sprite(`
.oo.
oxko
okko
.oo.
`, { x: 'red1', k: 'white' });

PROP.guitar = sprite(`
.....oo.
.....ok.
....oxo.
....oxo.
...oxo..
..oyyo..
.oyyyyo.
.oykkyo.
.oyyyyo.
oyyooyyo
oyyooyyo
oyyyyyyo
.oyyyyo.
..oooo..
`, { x: 'wood1', y: 'gold1', k: 'wood0' });

PROP.suitcase = sprite(`
...ooo....
...o.o....
.oooooooo.
oxxkxxkxxo
oxxkxxkxxo
oxxkxxkxxo
oxxxxxxxxo
.oooooooo.
`, { x: 'teal1', k: 'teal2' });

PROP.soup = sprite(`
.k.k.
..k..
ooooo
oyyyo
.ooo.
`, { y: 'gold2', k: 'mist' });

PROP.billStack = sprite(`
.ooooo.
okkrkko
ooooooo
okkkkko
ooooooo
okrrkko
ooooooo
`, { k: 'cream', r: 'red1' });

PROP.eBrush = sprite(`
.ww.
.ww.
.oo.
oxko
oxxo
oxko
oxxo
oxxo
oyyo
oooo
`, { w: 'white', x: 'white', k: 'teal2', y: 'teal1' });

PROP.paste = sprite(`
..oo....
.okkoooo
oxxxxkko
oxxxxkko
.oooooooo
`, { x: 'red1', k: 'white' });

PROP.picks = sprite(`
o..o..o.
k..k..k.
ok.ok.ok
.x..x..x
.x..x..x
.o..o..o
`, { k: 'white', x: 'teal2' });

PROP.sportsDrink = sprite(`
.oo.
.xx.
oyyo
oyko
oyyo
oyyo
oooo
`, { x: 'blue1', y: 'blue2', k: 'blue4' });

PROP.iceCup = sprite(`
.kwkw.
okkkkko
.oxxxo.
.oxxxo.
..ooo..
`, { k: 'blue4', w: 'white', x: 'red2' });

PROP.calendar = sprite(`
.o..o.
oooooo
orrrro
okkkko
okrkko
okkkko
oooooo
`, { r: 'red1', k: 'cream' });

PROP.bike = sprite(`
.........oo.
..oooo..o...
.o.o..oooooo
o..oooo.o..o
o.o.o.o.oo.o
.o...o...oo.
`, { o: 'ink' });

PROP.car = sprite(`
...oooo...
..oxkkxo..
.oxxxxxxo.
oxxxxxxxxo
oxoooooxxo
.o.o..o.o.
`, { x: 'teal2', k: 'blue4' });

PROP.key = sprite(`
.oo......
oxxo.....
oxxooooo.
.oo..o.o.
`, { x: 'gold2' });

// --- Acid Clock foods
PROP.cookie = sprite(`
.ooo.
oxkxo
oxxko
okxxo
.ooo.
`, { x: 'wood3', k: 'wood0' });

PROP.chips = sprite(`
ooooo
oxxxo
oxkxo
oxxxo
ooooo
`, { x: 'gold2', k: 'red1' });

PROP.juiceBox = sprite(`
...o
oooo
oxxo
okxo
oxxo
oooo
`, { x: 'gold1', k: 'green3' });

PROP.bottle = sprite(`
.oo.
.xx.
oooo
okko
okko
.oo.
`, { x: 'gold3', k: 'gold2' });

PROP.cheese = sprite(`
....oo
..ooxo
ooxkxo
oooooo
`, { x: 'gold2', k: 'gold1' });

PROP.plate = sprite(`
..oooo..
.oygrgo.
oxxxxxxo
.oooooo.
`, { x: 'white', y: 'wood3', g: 'green2', r: 'red2' });

// --- toothpaste amounts on a brush head (for the toddler-paste choice)
PROP.brushSmear = sprite(`
..p.........
.wwwwoxxxxxx
.wwwwo......
`, { w: 'white', p: 'blue3', x: 'teal2' });
PROP.brushPea = sprite(`
..pp........
.pppp.......
.wwwwoxxxxxx
.wwwwo......
`, { w: 'white', p: 'blue3', x: 'teal2' });
PROP.brushRibbon = sprite(`
pkpkpk......
kpkpkpk.....
.wwwwoxxxxxx
.wwwwo......
`, { w: 'white', p: 'blue3', k: 'white', x: 'teal2' });
