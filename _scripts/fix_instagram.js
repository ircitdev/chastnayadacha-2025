const fs = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const SRC = 'D:/DevTools/Database/2026grigory-gorbunov.ru/static/uploads/sb-instagram-feed-images';
const DST = path.join(STATIC, 'wp-content/uploads/sb-instagram-feed-images');

// 1. Копируем все файлы из источника
fs.mkdirSync(DST, { recursive: true });
const srcFiles = fs.readdirSync(SRC);
let copied = 0, skipped = 0;
for (const f of srcFiles) {
  const dst = path.join(DST, f);
  if (!fs.existsSync(dst)) {
    fs.copyFileSync(path.join(SRC, f), dst);
    copied++;
  } else {
    skipped++;
  }
}
console.log(`Copied: ${copied}, Skipped (exists): ${skipped}`);

// 2. Найдём все HTML с sbi_images и посмотрим что они ожидают
function findHtml(dir) {
  let r = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) r = r.concat(findHtml(full));
    else if (item.name.endsWith('.html')) r.push(full);
  }
  return r;
}

const htmlFiles = findHtml(STATIC);
let pagesWithFeed = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('sbi_images') || html.includes('sb-instagram')) {
    pagesWithFeed.push(path.relative(STATIC, file));
  }
}

console.log('\nPages with Instagram feed:', pagesWithFeed.length);
pagesWithFeed.forEach(p => console.log(' ', p));

// 3. Найдём какие конкретные файлы ожидаются в HTML
const neededFiles = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const re = /sb-instagram-feed-images\/([^\s"')<]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    neededFiles.add(m[1].split('?')[0]);
  }
}

console.log('\nReferenced Instagram files:', neededFiles.size);
let missing = 0;
for (const f of neededFiles) {
  const exists = fs.existsSync(path.join(DST, f));
  if (!exists) {
    console.log('  MISSING:', f);
    missing++;
  }
}
if (missing === 0) console.log('  All present!');
