const fs = require('fs');
const dst = 'D:/DevTools/Database/2026chastnayadacha.ru/static/tur/index.html';
let html = fs.readFileSync(dst, 'utf8');

// In the file: https:\/\/chastnayadacha.ru\/wp-content\/...
// In JS string: backslash is \\, so pattern is 'https:\\/\\/chastnayadacha.ru\\/'
const count = (html.split('https:\\/\\/chastnayadacha.ru\\/').length - 1);
console.log('Domain occurrences found:', count);

html = html
  .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/plugins\\/ipanorama-pro\\/assets\\/').join('../wp-content/plugins/ipanorama-pro/assets/')
  .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/uploads\\/ipanorama\\/').join('../wp-content/uploads/ipanorama/')
  .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/').join('../wp-content/')
  .split('https:\\/\\/chastnayadacha.ru\\/').join('../');

fs.writeFileSync(dst, html, 'utf8');

const remaining = (html.split('chastnayadacha.ru').length - 1);
console.log('Domain remaining after fix:', remaining);

// Show ipanorama_globals
const gi = html.indexOf('ipanorama_globals');
console.log('\nipanorama_globals:\n', html.substring(gi, gi+500));
