const fs = require('fs');
const path = require('path');

const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const STATIC_UP = path.join(SD, 'wp-content/uploads');
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';

// Skip these — plugin assets, not content
const SKIP_NAMES = new Set(['youtube.png','github.svg','Itunes_podcast_icon_300.jpg','youtube.svg']);
const SKIP_PATHS = ['clearfy','lazy-load','wp-content/plugins','wp-includes'];

// Build full index of backup
const backupIndex = {};
function indexDir(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) indexDir(fp);
    else if (!backupIndex[e.name]) backupIndex[e.name] = fp;
  }
}
indexDir(BACKUP);
console.log('Backup index:', Object.keys(backupIndex).length, 'files');

let totalFixed = 0, totalMissing = 0;
const stillMissing = [];

function processPage(pagePath) {
  if (!fs.existsSync(pagePath)) return;
  const html = fs.readFileSync(pagePath, 'utf8');
  const dir = path.dirname(pagePath);
  const pg = pagePath.slice(SD.length).split(path.sep).join('/');

  const imgs = new Set();
  // src/srcset attributes
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  // CSS url()
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

    // Try backup
    if (backupIndex[basename]) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(backupIndex[basename], norm);
      totalFixed++;
      continue;
    }

    // Try stripping thumbnail suffix -> find full size in backup
    const fullName = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullName !== basename) {
      if (backupIndex[fullName]) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(backupIndex[fullName], norm);
        totalFixed++;
        continue;
      }
      // Full size already in static uploads
      const staticFull = path.join(STATIC_UP, fullName);
      if (fs.existsSync(staticFull)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(staticFull, norm);
        totalFixed++;
        continue;
      }
    }

    pageMissing.push(img);
    totalMissing++;
  }

  if (pageMissing.length) {
    stillMissing.push({pg, imgs: pageMissing});
  }
}

function walk(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) {
      if (fp.includes('wp-content' + path.sep + 'cache')) continue;
      walk(fp);
    } else if (e.name === 'index.html') {
      processPage(fp);
    }
  }
}

walk(SD);

if (stillMissing.length) {
  console.log('\n=== STILL MISSING ===');
  for (const {pg, imgs} of stillMissing) {
    console.log(pg);
    for (const i of imgs) console.log('  ' + i);
  }
}

console.log('\nFixed:', totalFixed, '| Still missing:', totalMissing);
