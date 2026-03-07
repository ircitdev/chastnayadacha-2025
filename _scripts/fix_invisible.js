const fs = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// CSS фикс — добавляем в конец каждого HTML
const fixCSS = `<style id="static-fix">
.elementor-invisible { visibility: visible !important; }
.elementor-invisible.elementor-section,
.elementor-invisible.elementor-widget { opacity: 1 !important; }
</style>`;

function findHtml(dir) {
  let r = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) r = r.concat(findHtml(full));
    else if (item.name.endsWith('.html')) r.push(full);
  }
  return r;
}

const files = findHtml(STATIC);
let fixed = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('id="static-fix"')) continue; // уже есть
  if (!html.includes('elementor-invisible')) continue; // не нужно
  html = html.replace('</head>', fixCSS + '\n</head>');
  fs.writeFileSync(file, html, 'utf8');
  fixed++;
  console.log('Fixed:', path.relative(STATIC, file));
}

console.log('\nTotal fixed:', fixed);
