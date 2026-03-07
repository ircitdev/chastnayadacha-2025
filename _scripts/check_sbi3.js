const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');

// Find all sbi_item elements and get surrounding HTML
const re = /sbi_item[^<]{0,200}/g;
let m, count = 0;
while ((m = re.exec(html)) !== null && count < 3) {
  count++;
  // Get full element context
  const start = m.index - 50;
  const chunk = html.substring(start, start + 600);
  console.log('--- SBI ITEM', count, '---');
  console.log(chunk);
  console.log();
}
