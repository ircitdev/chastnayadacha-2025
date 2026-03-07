const fs = require('fs');
const path = require('path');

const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const UPLOADS_BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const STATIC_UPLOADS = path.join(SD, 'wp-content/uploads');

// Find all missing images across all pages
const res = {};

function walk(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.name === 'index.html') check(fp);
  }
}

function check(fp) {
  const html = fs.readFileSync(fp, 'utf8');
  const pg = fp.slice(SD.length).split(path.sep).join('/');
  if (pg.includes('/wp-content/cache/')) return;
  const dir = path.dirname(fp);
  const imgs = new Set();

  for (const m of html.matchAll(/(?:src|srcset)="([^"]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"]*)"/gi))
    for (const p of m[1].split(',')) { const u = p.trim().split(' ')[0]; if (u) imgs.add(u); }
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi))
    imgs.add(m[1]);

  const miss = [];
  for (const img of imgs) {
    if (img.startsWith('http') || img.startsWith('data:')) continue;
    if (img.includes('clearfy') || img.includes('lazy-load')) continue;
    const norm = path.normalize(img.startsWith('/') ? path.join(SD, img) : path.join(dir, img));
    if (!fs.existsSync(norm)) miss.push({img, norm});
  }
  if (miss.length) res[pg] = miss;
}

walk(SD);

console.log('=== MISSING IMAGES ===');
let totalMissing = 0, copied = 0, notFound = 0;

for (const [pg, items] of Object.entries(res).sort()) {
  console.log('\n' + pg);
  for (const {img, norm} of items) {
    totalMissing++;
    const basename = path.basename(norm);

    // Try direct match in uploads backup
    const src1 = path.join(UPLOADS_BACKUP, basename);
    if (fs.existsSync(src1)) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(src1, norm);
      console.log('  FIXED: ' + basename);
      copied++;
      continue;
    }

    // Try finding in subdirs of uploads backup
    let found = null;
    function findInBackup(dir) {
      if (found) return;
      for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
        const fp = path.join(dir, e.name);
        if (e.isDirectory()) findInBackup(fp);
        else if (e.name === basename) { found = fp; return; }
      }
    }
    findInBackup(UPLOADS_BACKUP);

    if (found) {
      fs.mkdirSync(path.dirname(norm), {recursive: true});
      fs.copyFileSync(found, norm);
      console.log('  FIXED (subdir): ' + basename);
      copied++;
      continue;
    }

    // Try stripping thumbnail suffix to find full-size, then copy as thumb
    const fullBase = basename.replace(/-\d+x\d+(\.\w+)$/, '$1');
    if (fullBase !== basename) {
      const src2 = path.join(UPLOADS_BACKUP, fullBase);
      if (fs.existsSync(src2)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(src2, norm);
        console.log('  FIXED (full->thumb): ' + basename);
        copied++;
        continue;
      }
      // also check static uploads for full size
      const src3 = path.join(STATIC_UPLOADS, fullBase);
      if (fs.existsSync(src3)) {
        fs.mkdirSync(path.dirname(norm), {recursive: true});
        fs.copyFileSync(src3, norm);
        console.log('  FIXED (static full->thumb): ' + basename);
        copied++;
        continue;
      }
    }

    console.log('  MISSING: ' + img);
    notFound++;
  }
}

console.log(`\nTotal: ${totalMissing} | Fixed: ${copied} | Still missing: ${notFound}`);
