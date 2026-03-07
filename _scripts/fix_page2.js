const fs = require('fs');
const path = require('path');

const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const STATIC_UP = path.join(SD, 'wp-content/uploads');

const SKIP_NAMES = new Set(['youtube.png','github.svg','Itunes_podcast_icon_300.jpg']);
const SKIP_PATHS = ['clearfy','lazy-load','wp-content/plugins','wp-includes'];

const backupIndex = {};
function indexDir(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) indexDir(fp);
    else if (!backupIndex[e.name]) backupIndex[e.name] = fp;
  }
}
indexDir(BACKUP);

function fixPage(PAGE) {
  const pagePath = path.join(SD, PAGE, 'index.html');
  if (!fs.existsSync(pagePath)) { console.log('NOT FOUND: ' + PAGE); return; }
  const dir = path.join(SD, PAGE);
  const html = fs.readFileSync(pagePath, 'utf8');

  const imgs = new Set();
  // All attribute values with image extensions - src, srcset, href, data-src, data-bg, content
  for (const m of html.matchAll(/(?:src|srcset|href|data-src|data-bg|data-lazy-src|content)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  // CSS url()
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
    imgs.add(m[1]);

  let fixed = 0, missing = 0;

  for (const img of [...imgs].sort()) {
    if (img.startsWith('http') || img.startsWith('data:')) continue;
    if (SKIP_PATHS.some(s => img.includes(s))) continue;

    const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
    if (fs.existsSync(norm)) continue;

    const basename = path.basename(norm);
    if (SKIP_NAMES.has(basename)) continue;

    if (backupIndex[basename]) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(backupIndex[basename], norm);
      console.log('  FIXED: ' + basename);
      fixed++;
      continue;
    }

    const fullName = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullName !== basename) {
      if (backupIndex[fullName]) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(backupIndex[fullName], norm);
        console.log('  FIXED (full->thumb): ' + basename);
        fixed++;
        continue;
      }
      const staticFull = path.join(STATIC_UP, fullName);
      if (fs.existsSync(staticFull)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(staticFull, norm);
        console.log('  FIXED (static->thumb): ' + basename);
        fixed++;
        continue;
      }
    }

    console.log('  MISSING: ' + img);
    missing++;
  }

  console.log('  => Fixed: ' + fixed + ' | Missing: ' + missing);
}

// All site pages
const pages = [];
function walkPages(d, rel) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const name = e.name;
    const fp = path.join(d, name);
    const relp = rel ? rel + '/' + name : name;
    if (e.isDirectory()) {
      if (name === 'wp-content') continue;
      walkPages(fp, relp);
    } else if (name === 'index.html') {
      pages.push(rel);
    }
  }
}
walkPages(SD, '');

let totalFixed = 0, totalMissing = 0;
for (const pg of pages) {
  if (!pg) continue;
  const pagePath = path.join(SD, pg, 'index.html');
  const dir = path.join(SD, pg);
  const html = fs.readFileSync(pagePath, 'utf8');
  const imgs = new Set();
  for (const m of html.matchAll(/(?:src|srcset|href|data-src|data-bg|data-lazy-src|content)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
    imgs.add(m[1]);

  const pageMissing = [];
  for (const img of [...imgs].sort()) {
    if (img.startsWith('http') || img.startsWith('data:')) continue;
    if (SKIP_PATHS.some(s => img.includes(s))) continue;
    const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
    if (fs.existsSync(norm)) continue;
    const basename = path.basename(norm);
    if (SKIP_NAMES.has(basename)) continue;

    if (backupIndex[basename]) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(backupIndex[basename], norm);
      totalFixed++; continue;
    }
    const fullName = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullName !== basename) {
      if (backupIndex[fullName]) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(backupIndex[fullName], norm);
        totalFixed++; continue;
      }
      const sf = path.join(STATIC_UP, fullName);
      if (fs.existsSync(sf)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(sf, norm);
        totalFixed++; continue;
      }
    }
    pageMissing.push(img);
    totalMissing++;
  }
  if (pageMissing.length) {
    console.log('/' + pg);
    pageMissing.forEach(i => console.log('  MISSING: ' + i));
  }
}

console.log('\nTotal fixed: ' + totalFixed + ' | Total missing: ' + totalMissing);
