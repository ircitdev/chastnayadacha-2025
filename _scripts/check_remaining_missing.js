const fs   = require('fs');
const path = require('path');

const STATIC  = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const UPLOADS = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';

function findHtml(dir, skip = ['wp-content', 'cache'], res = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !skip.includes(e.name)) findHtml(full, skip, res);
    else if (e.name === 'index.html') res.push(full);
  }
  return res;
}

// Build basename lookup from uploads/ dir
function buildLookup(dir, map = {}) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) buildLookup(full, map);
    else {
      const k = e.name.toLowerCase();
      if (!map[k]) map[k] = [];
      map[k].push(full);
    }
  }
  return map;
}

const uploadsLookup = buildLookup(UPLOADS);
const htmlFiles = findHtml(STATIC);
const IMG_RE = /(?:src|href|url\()=?["']([^"'()]+\.(?:jpg|jpeg|png|gif|webp|svg|JPG|PNG|JPEG))["']/g;

const missing = new Set();
for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = IMG_RE.exec(content)) !== null) {
    const ref = m[1];
    if (ref.startsWith('http') || ref.startsWith('data:')) continue;
    let relPath = ref.replace(/^\.\//, '').replace(/^\//, '');
    // Resolve relative to HTML file's directory
    const htmlDir = path.dirname(f);
    const fullPath = path.resolve(htmlDir, ref.replace(/^\//, STATIC + '/'));
    if (!fs.existsSync(fullPath)) {
      // Try to find by basename in uploads lookup
      const base = path.basename(ref).toLowerCase();
      if (uploadsLookup[base]) {
        // Can be fixed from uploads
        const best = uploadsLookup[base].sort((a,b) => fs.statSync(b).size - fs.statSync(a).size)[0];
        const destAbs = path.normalize(path.join(htmlDir, ref));
        if (!fs.existsSync(destAbs)) {
          const destDir = path.dirname(destAbs);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(best, destAbs);
          console.log('FIXED:', path.relative(STATIC, destAbs), '<-', path.basename(best));
        }
      } else {
        missing.add(ref + ' | from: ' + path.relative(STATIC, f));
      }
    }
  }
}

if (missing.size > 0) {
  console.log('\nSTILL MISSING (' + missing.size + '):');
  [...missing].slice(0, 30).forEach(m => console.log(' ', m));
}
