const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');
const i = html.indexOf('sbi_images');
if (i === -1) { console.log('sbi_images not found'); process.exit(); }
// Get surrounding context
console.log(html.substring(i - 200, i + 2000));
