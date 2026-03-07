const fs = require('fs');
const path = require('path');
const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const html = fs.readFileSync(path.join(SD, 'service/territory/index.html'), 'utf8');

// Find all JS/CSS references
const assets = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)[^"]*)"/gi))
  assets.add(m[1]);

const dir = path.join(SD, 'service/territory');
for (const asset of [...assets].sort()) {
  if (asset.startsWith('http') || asset.startsWith('data:')) continue;
  const norm = path.normalize(asset.startsWith('/') ? path.join(SD, asset) : path.join(dir, asset));
  if (!fs.existsSync(norm)) console.log('MISSING JS/CSS:', asset);
}

// Check images too
const imgs = new Set();
for (const m of html.matchAll(/(?:src|srcset|href|data-src|data-bg|data-lazy-src|data-original|content)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
  for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
  imgs.add(m[1]);

const SKIP_PATHS = ['clearfy','lazy-load','wp-content/plugins','wp-includes'];
const SKIP_NAMES = new Set(['youtube.png','github.svg','Itunes_podcast_icon_300.jpg','youtube.svg']);

let missing = 0;
for (const img of [...imgs].sort()) {
  if (img.startsWith('http') || img.startsWith('data:')) continue;
  if (SKIP_PATHS.some(s => img.includes(s))) continue;
  const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
  if (fs.existsSync(norm)) continue;
  const basename = path.basename(norm);
  if (SKIP_NAMES.has(basename)) continue;
  console.log('MISSING IMG:', basename);
  missing++;
}
if (!missing) console.log('All images OK');
