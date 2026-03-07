const fs = require('fs');
const path = require('path');
const BACKUP = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';

let copied = 0;

for (const f of fs.readdirSync(BACKUP)) {
  const src = path.join(BACKUP, f);
  const dst = path.join(STATIC, f);
  if (fs.statSync(src).isDirectory()) continue;
  if (fs.existsSync(dst)) continue;
  fs.copyFileSync(src, dst);
  copied++;
  if (copied <= 20) console.log('  ' + f);
}

console.log('Total copied:', copied);
