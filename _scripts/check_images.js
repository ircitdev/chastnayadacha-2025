const fs = require('fs');
const path = require('path');
const SD = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
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
    if (!fs.existsSync(norm)) miss.push(img);
  }
  if (miss.length) res[pg] = [...new Set(miss)].sort();
}

walk(SD);
for (const [pg, imgs] of Object.entries(res).sort()) {
  console.log(pg);
  for (const i of imgs) console.log('  ' + i);
}
console.log('\nTotal pages with missing images:', Object.keys(res).length);
