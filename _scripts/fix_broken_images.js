const fs   = require('fs');
const path = require('path');

const STATIC  = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const UPLOADS = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';

// Build lookup: basename -> full path(s) in uploads/
function buildLookup(dir, map = {}) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) buildLookup(full, map);
    else {
      const name = e.name.toLowerCase();
      if (!map[name]) map[name] = [];
      map[name].push(full);
    }
  }
  return map;
}

// Find all HTML files
function findHtml(dir, skip = ['wp-content'], res = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !skip.includes(e.name)) findHtml(full, skip, res);
    else if (e.name === 'index.html') res.push(full);
  }
  return res;
}

console.log('Building uploads lookup...');
const lookup = buildLookup(UPLOADS);
console.log('Lookup entries:', Object.keys(lookup).length);

const htmlFiles = findHtml(STATIC);
console.log('HTML files:', htmlFiles.length);

const missing  = new Set();
const fixed    = new Map(); // src path -> dest path
let   copiedCount = 0;

// Extract all image src references from HTML
const IMG_RE = /(?:src|href|url\()=?["']([^"'()]+\.(?:jpg|jpeg|png|gif|webp|svg|JPG|PNG))["']/g;

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = IMG_RE.exec(content)) !== null) {
    const ref = m[1];
    // Normalize to relative path from STATIC
    let relPath = ref;
    if (relPath.startsWith('./')) relPath = relPath.substring(2);
    if (relPath.startsWith('/')) relPath = relPath.substring(1);
    if (relPath.startsWith('http')) continue; // absolute external URLs

    const fullPath = path.join(STATIC, relPath);
    if (!fs.existsSync(fullPath)) {
      missing.add(relPath);
    }
  }
}

console.log('\nMissing images:', missing.size);

// For each missing image, try to find it in uploads/
let notFound = [];
for (const relPath of missing) {
  const basename = path.basename(relPath).toLowerCase();
  const candidates = lookup[basename];
  if (candidates && candidates.length > 0) {
    // Pick the largest file (best quality)
    const best = candidates.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
    fixed.set(relPath, best);
  } else {
    notFound.push(relPath);
  }
}

console.log('Can fix:', fixed.size, '| Not found:', notFound.length);

// Copy missing files to static
for (const [relPath, src] of fixed) {
  const dest = path.join(STATIC, relPath);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  copiedCount++;
  console.log('Copied:', relPath, '<-', path.basename(src));
}

console.log('\nCopied:', copiedCount, 'files');

if (notFound.length > 0) {
  console.log('\nNOT FOUND IN UPLOADS:');
  notFound.forEach(p => console.log(' ', p));
}
