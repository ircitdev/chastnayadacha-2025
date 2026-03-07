const fs = require('fs');
const cfgPath = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';

let raw = fs.readFileSync(cfgPath, 'utf8');

// config.json загружается JS-плеером который стоит на странице /tur/
// Все URL в config.json используются плеером как есть (через fetch или img.src)
// Плеер на /tur/ -> базовый путь ../wp-content/uploads/...
// Заменяем абсолютные URL на относительные от корня static/

const count = (raw.split('https://chastnayadacha.ru/').length - 1);
console.log('Absolute URLs to replace:', count);

raw = raw
  .split('https://chastnayadacha.ru/wp-content/uploads/').join('../../uploads/')
  .split('https://chastnayadacha.ru/wp-content/plugins/ipanorama-pro/assets/').join('../../../../plugins/ipanorama-pro/assets/')
  .split('https://chastnayadacha.ru/wp-content/').join('../../../../')
  .split('https://chastnayadacha.ru/').join('../../../../../');

const remaining = (raw.split('chastnayadacha.ru').length - 1);
console.log('Remaining absolute URLs:', remaining);

// Check first scene image URL
const parsed = JSON.parse(raw);
const firstScene = parsed.scenes[Object.keys(parsed.scenes)[0]];
console.log('First scene imageUrl:', firstScene.imageUrl);
console.log('First scene title:', firstScene.title);

fs.writeFileSync(cfgPath, raw, 'utf8');
console.log('\nconfig.json updated.');
