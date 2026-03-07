const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');

// Find sbi_js_locals config
let i = html.indexOf('sbi_js_locals');
if (i !== -1) {
  console.log('sbi_js_locals found:');
  console.log(html.substring(i - 20, i + 500));
}

// Find sbiajaxurl or similar
i = html.indexOf('sbiajax');
if (i !== -1) {
  console.log('\nsbiajax found:');
  console.log(html.substring(i - 20, i + 200));
}

// Find all sbi_item IDs - these are Instagram post IDs
const idRe = /id="sbi_(\d+)"/g;
let m, ids = [];
while ((m = idRe.exec(html)) !== null) ids.push(m[1]);
console.log('\nSBI post IDs found:', ids.length);
ids.forEach(id => console.log(' ', id));

// Find media URLs in json data
i = html.indexOf('"media_id"');
if (i !== -1) console.log('\nmedia_id:', html.substring(i, i + 200));

// Find photo urls in data attributes
const dataRe = /data-img="([^"]+)"/g;
while ((m = dataRe.exec(html)) !== null) console.log('data-img:', m[1]);
