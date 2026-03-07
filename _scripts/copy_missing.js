const fs = require('fs');
const path = require('path');

const SRC = 'D:/DevTools/Database/2026grigory-gorbunov.ru/static/uploads';
const DST = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

function findHtml(dir) {
  let r = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) r = r.concat(findHtml(full));
    else if (item.name.endsWith('.html')) r.push(full);
  }
  return r;
}

function listFilesRel(dir, base) {
  let r = new Set();
  if (!fs.existsSync(dir)) return r;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? base + '/' + item.name : item.name;
    if (item.isDirectory()) {
      for (const f of listFilesRel(path.join(dir, item.name), rel)) r.add(f);
    } else {
      r.add(rel);
    }
  }
  return r;
}

const srcFiles = listFilesRel(SRC, '');
console.log('Source files available:', srcFiles.size);

const htmlFiles = findHtml(STATIC);
const needed = new Set();

for (const html of htmlFiles) {
  const content = fs.readFileSync(html, 'utf8');
  const re = /wp-content\/uploads\/([^\s"')\\\u003e]+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const p = m[1].split('?')[0].split('#')[0];
    if (!fs.existsSync(path.join(DST, p))) needed.add(p);
  }
}

console.log('Missing files needed:', needed.size);

let copied = 0, notFound = [];

for (const rel of needed) {
  const srcPath = path.join(SRC, rel);
  const dstPath = path.join(DST, rel);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    copied++;
    process.stdout.write('.');
  } else {
    notFound.push(rel);
  }
}

console.log('\nCopied:', copied, '| Not found in source:', notFound.length);

if (notFound.length > 0) {
  console.log('\nStill missing:');
  notFound.forEach(f => console.log(' ', f));
}
