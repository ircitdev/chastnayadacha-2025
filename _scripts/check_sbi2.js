const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');

// Find all sbi_item blocks and extract img src
const imgRe = /<img[^>]+src="([^"]+sb-instagram[^"]+)"/g;
let m;
const imgs = [];
while ((m = imgRe.exec(html)) !== null) imgs.push(m[1]);
console.log('Direct img srcs:', imgs.length);
imgs.forEach(s => console.log(' ', s));

// Find data-img-src or data-src (lazy loading)
const dataRe = /data-(?:img-src|src)="([^"]*(?:sb-instagram|instagram)[^"]*)"/g;
while ((m = dataRe.exec(html)) !== null) console.log('data-src:', m[1]);

// Find sbi_photo div with background-image
const bgRe = /sbi_photo[^>]+style="([^"]+)"/g;
let count = 0;
while ((m = bgRe.exec(html)) !== null) {
  if (++count <= 5) console.log('bg style:', m[1].substring(0, 120));
}
console.log('Total sbi_photo divs:', count);
