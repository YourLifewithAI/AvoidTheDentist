// Build the patient app into a static folder (default site/): index.html with
// the bundled app inlined, a web manifest, icons, an offline service worker and
// the QR code for the public URL.
// usage: node tools/build-app.mjs [outDir] [publicUrl]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { encodePNG } from '../art/lib/png.js';
import { appIcon, qrPoster, qrPix } from '../art/qr.js';

const root = new URL('../', import.meta.url).pathname;
const out = (process.argv[2] || `${root}site`).replace(/\/$/, '') + '/';
const url = process.argv[3] || 'https://yourlifewithai.github.io/AvoidTheDentist/';
mkdirSync(out, { recursive: true });

const js = (await build({ entryPoints: [root + 'web/app/app.js'], bundle: true, format: 'iife', minify: true, write: false, target: 'es2019' })).outputFiles[0].text;
let html = readFileSync(root + 'web/app/index.html', 'utf8');
html = html.replace('/*APP*/', () => js.replace(/<\/script/gi, '<\\/script'));
writeFileSync(out + 'index.html', html);
const version = Date.now().toString(36);

writeFileSync(out + 'manifest.webmanifest', JSON.stringify({
  name: 'Avoid the Dentist', short_name: 'Avoid the Dentist', start_url: './', scope: './', display: 'standalone',
  background_color: '#1b2040', theme_color: '#1b2040', description: 'A cozy life-sim about everyday choices and a lifetime of teeth.',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));
writeFileSync(out + 'icon-192.png', encodePNG(appIcon().scaled(6)));
writeFileSync(out + 'icon-512.png', encodePNG(appIcon().scaled(16)));

// offline: cache the whole app on first visit (clinic Wi-Fi is often poor)
writeFileSync(out + 'sw.js', `const CACHE = 'atd-${version}';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
`);

// the QR code and a printable waiting-room poster
const require = createRequire(import.meta.url);
const QRCode = require('qrcode');
const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
writeFileSync(out + 'qr.png', encodePNG(qrPix(qr.modules).scaled(12)));
writeFileSync(out + 'poster.png', encodePNG(qrPoster(qr.modules, url).scaled(5)));
writeFileSync(out + '.nojekyll', '');
console.log(`wrote ${out} (index.html ${(html.length / 1024).toFixed(0)} KB) for ${url}`);
