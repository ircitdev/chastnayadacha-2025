// Scan ALL pages for missing thumbnails and create them from full-size
const fs = require('fs');
const path = require('path');

const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const STATIC_UP = path.join(SD, 'wp-content/uploads');

const SKIP_NAMES = new Set(['youtube.png','github.svg','Itunes_podcast_icon_300.jpg']);
const SKIP_PATHS = ['clearfy','lazy-load','wp-content/plugins','wp-includes'];

// Index backup
const backupIndex = {};
function scanBackup(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const fp=path.join(d,e.name);if(e.isDirectory())scanBackup(fp);else if(!backupIndex[e.name])backupIndex[e.name]=fp;}}
scanBackup(BACKUP);

let fixed = 0, missing = 0;
const stillMissing = [];

function processPage(pagePath) {
  const html = fs.readFileSync(pagePath, 'utf8');
  const dir = path.dirname(pagePath);
  const imgs = new Set();

  for (const m of html.matchAll(/(?:src|srcset|href|data-src|data-bg|data-lazy-src|data-original|content)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
    imgs.add(m[1]);

  for (const img of imgs) {
    if (img.startsWith('http') || img.startsWith('data:')) continue;
    if (SKIP_PATHS.some(s => img.includes(s))) continue;

    const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
    if (fs.existsSync(norm)) continue;

    const basename = path.basename(norm);
    if (SKIP_NAMES.has(basename)) continue;

    // Try backup exact
    if (backupIndex[basename]) {
      fs.copyFileSync(backupIndex[basename], norm);
      fixed++; continue;
    }

    // Strip thumb suffix -> find full size
    const fullName = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullName !== basename) {
      // from backup
      if (backupIndex[fullName]) {
        fs.copyFileSync(backupIndex[fullName], norm);
        fixed++; continue;
      }
      // from static uploads
      const sf = path.join(STATIC_UP, fullName);
      if (fs.existsSync(sf)) {
        fs.copyFileSync(sf, norm);
        fixed++; continue;
      }
    }

    stillMissing.push(img + ' [' + path.basename(pagePath.slice(SD.length), '/index.html') + ']');
    missing++;
  }
}

function walk(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === 'wp-content') continue;
      walk(fp);
    } else if (e.name === 'index.html') processPage(fp);
  }
}

walk(SD);

if (stillMissing.length) {
  console.log('Still missing:');
  [...new Set(stillMissing)].sort().forEach(f => console.log('  ' + f));
}
console.log('\nFixed:', fixed, '| Missing:', missing);
