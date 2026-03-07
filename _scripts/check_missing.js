const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json', 'utf8'));
const uploadsLocal = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const missing = new Set();

function checkPaths(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === 'string' && obj[k].includes('../wp-content/uploads/')) {
      const rel = obj[k].replace('../wp-content/uploads/', '').split('?')[0];
      const local = uploadsLocal + '/' + rel;
      if (!fs.existsSync(local)) missing.add(rel);
    } else if (typeof obj[k] === 'object') {
      checkPaths(obj[k]);
    }
  }
}

checkPaths(cfg);
console.log('Missing files:', missing.size);
[...missing].forEach(f => console.log(' ', f));
