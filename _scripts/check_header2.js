const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');

// All script src
const re = /src=["']([^"']+)["']/g;
let m;
while ((m = re.exec(html)) !== null) {
  console.log(m[1]);
}
