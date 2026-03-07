const fs = require('fs');
const path = require('path');

const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const STATIC_UP = path.join(SD, 'wp-content/uploads');

const SKIP_NAMES = new Set(['youtube.png','github.svg','Itunes_podcast_icon_300.jpg','youtube.svg']);
const SKIP_PATHS = ['clearfy','lazy-load','wp-content/plugins','wp-includes'];

// Build backup index (files only, flat)
const backupIndex = {};
for (const f of fs.readdirSync(BACKUP)) {
  const fp = path.join(BACKUP, f);
  if (fs.statSync(fp).isFile()) backupIndex[f] = fp;
}
console.log('Backup index:', Object.keys(backupIndex).length, 'files\n');

let totalFixed = 0, totalMissing = 0;
const allMissing = [];

function processPage(pagePath) {
  const html = fs.readFileSync(pagePath, 'utf8');
  const pg = pagePath.slice(SD.length).split(path.sep).join('/');
  const dir = path.dirname(pagePath);
  const imgs = new Set();

  // ALL attributes that can contain image URLs
  for (const m of html.matchAll(/(?:src|srcset|href|data-src|data-bg|data-lazy-src|data-original|content)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
    imgs.add(m[1]);

  const pageMissing = [];

  for (const img of imgs) {
    if (img.startsWith('http') || img.startsWith('data:')) continue;
    if (SKIP_PATHS.some(s => img.includes(s))) continue;

    const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
    if (fs.existsSync(norm)) continue;

    const basename = path.basename(norm);
    if (SKIP_NAMES.has(basename)) continue;

    // 1. Exact match in backup
    if (backupIndex[basename]) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(backupIndex[basename], norm);
      totalFixed++;
      continue;
    }

    // 2. Strip thumbnail suffix, find full size in backup
    const fullName = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullName !== basename && backupIndex[fullName]) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(backupIndex[fullName], norm);
      totalFixed++;
      continue;
    }

    // 3. Full size already in static/uploads
    if (fullName !== basename) {
      const sf = path.join(STATIC_UP, fullName);
      if (fs.existsSync(sf)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(sf, norm);
        totalFixed++;
        continue;
      }
    }

    pageMissing.push({img, basename});
    totalMissing++;
  }

  if (pageMissing.length) allMissing.push({pg, items: pageMissing});
}

function walk(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === 'wp-content') continue;
      walk(fp);
    } else if (e.name === 'index.html') {
      processPage(fp);
    }
  }
}

walk(SD);

if (allMissing.length) {
  console.log('=== STILL MISSING ===');
  for (const {pg, items} of allMissing) {
    console.log(pg);
    for (const {img} of items) console.log('  ' + img);
  }
}

console.log('\nFixed:', totalFixed, '| Still missing:', totalMissing);
