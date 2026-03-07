/**
 * config.json загружается AJAX с страницы /tur/
 * Пути в image резолвятся относительно страницы /tur/
 * Текущие пути: ../../uploads/... -> резолвится в /uploads/ (НЕВЕРНО)
 * Нужные пути:  ../wp-content/uploads/... -> резолвится в /wp-content/uploads/ (ВЕРНО)
 */
const fs = require('fs');
const cfgPath = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

let fixed = 0;

function fixPaths(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === 'string') {
      // ../../uploads/ -> ../wp-content/uploads/
      if (obj[k].startsWith('../../uploads/')) {
        obj[k] = obj[k].replace('../../uploads/', '../wp-content/uploads/');
        fixed++;
      }
      // ../../../../plugins/ -> ../wp-content/plugins/
      else if (obj[k].startsWith('../../../../plugins/')) {
        obj[k] = obj[k].replace('../../../../plugins/', '../wp-content/plugins/');
        fixed++;
      }
      // ../../../../../ -> ../
      else if (obj[k].startsWith('../../../../../')) {
        obj[k] = obj[k].replace('../../../../../', '../');
        fixed++;
      }
    } else if (typeof obj[k] === 'object') {
      fixPaths(obj[k]);
    }
  }
}

fixPaths(cfg);
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
console.log('Fixed', fixed, 'paths');

// Verify first few scenes
Object.keys(cfg.scenes).slice(0, 5).forEach(k => {
  const s = cfg.scenes[k];
  console.log(' ', s.title, '->', s.image);
});
