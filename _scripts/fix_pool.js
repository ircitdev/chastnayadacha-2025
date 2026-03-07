const fs = require('fs');
const path = require('path');

const STATIC_UP = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';

// Check all service pages
const pages = [
  'D:/DevTools/Database/2026chastnayadacha.ru/static/service/pool/index.html',
  'D:/DevTools/Database/2026chastnayadacha.ru/static/service/index.html',
  'D:/DevTools/Database/2026chastnayadacha.ru/static/service/playground/index.html',
  'D:/DevTools/Database/2026chastnayadacha.ru/static/service/restaurant/index.html',
];

// Build index of all files in backup
const backupIndex = {};
function indexBackup(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) indexBackup(fp);
    else backupIndex[e.name] = fp;
  }
}
indexBackup(BACKUP);
console.log('Backup index size:', Object.keys(backupIndex).length);

let fixed = 0, missing = 0;

for (const pagePath of pages) {
  if (!fs.existsSync(pagePath)) continue;
  const html = fs.readFileSync(pagePath, 'utf8');
  const pg = pagePath.split('/static/')[1];
  const imgs = new Set();

  // All image filename references
  for (const m of html.matchAll(/[\w\-\.]{5,}\.(?:jpg|jpeg|png|gif|webp|svg)/gi)) {
    imgs.add(m[0]);
  }

  console.log('\n' + pg + ' (' + imgs.size + ' unique image refs)');

  for (const f of [...imgs].sort()) {
    const dst = path.join(STATIC_UP, f);
    if (fs.existsSync(dst)) continue; // already exists

    if (backupIndex[f]) {
      fs.copyFileSync(backupIndex[f], dst);
      console.log('  FIXED: ' + f);
      fixed++;
    } else {
      // Try full-size for thumbnail
      const fullName = f.replace(/-\d+x\d+(\.\w+)$/, '$1');
      if (fullName !== f && backupIndex[fullName]) {
        fs.copyFileSync(backupIndex[fullName], dst);
        console.log('  FIXED (full->thumb): ' + f);
        fixed++;
      } else {
        // Try in static uploads with full name
        const staticFull = path.join(STATIC_UP, fullName);
        if (fullName !== f && fs.existsSync(staticFull)) {
          fs.copyFileSync(staticFull, dst);
          console.log('  FIXED (static->thumb): ' + f);
          fixed++;
        } else {
          console.log('  MISSING: ' + f);
          missing++;
        }
      }
    }
  }
}

console.log('\nFixed:', fixed, '| Still missing:', missing);
