const fs = require('fs');
const path = require('path');
const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const html = fs.readFileSync(path.join(STATIC, 'index.html'), 'utf8');

// CSS links
const cssRe = /href="([^"]+\.css[^"]*)"/g;
let m;
console.log('=== CSS ===');
while ((m = cssRe.exec(html)) !== null) {
  const href = m[1];
  const localPath = path.join(STATIC, href.replace('./', '/'));
  const exists = fs.existsSync(localPath);
  if (!exists) console.log('MISSING:', href);
}

// JS scripts
const jsRe = /src="([^"]+\.js[^"]*)"/g;
console.log('\n=== JS ===');
while ((m = jsRe.exec(html)) !== null) {
  const src = m[1];
  if (src.startsWith('http')) { console.log('EXTERNAL:', src); continue; }
  const localPath = path.join(STATIC, src.replace('./', '/'));
  const exists = fs.existsSync(localPath);
  if (!exists) console.log('MISSING:', src);
  else console.log('OK:', src);
}
