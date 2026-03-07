const fs = require('fs');
const cfgPath = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

// Fix internal links: /dacha-map/... -> ../../../../../dacha-map/
// config.json is at: static/wp-content/uploads/ipanorama/3/
// From there to static root: ../../../../../
// But links are used by the JS player running on /tur/ page
// Player is at /tur/ -> links should be ../dacha-map/ etc.
// Since the player fetches config.json and uses link values for navigation,
// we need paths relative to /tur/ page: ../slug/

function fixLinks(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const k of Object.keys(obj)) {
    if (k === 'link' && typeof obj[k] === 'string') {
      const v = obj[k];
      if (v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/wp-')) {
        // Internal page link: /dacha-map/gostinitsa/ -> ../dacha-map/gostinitsa/
        obj[k] = '..' + v;
        console.log('  link:', v, '->', obj[k]);
      }
    } else if (typeof obj[k] === 'object') {
      fixLinks(obj[k]);
    }
  }
  return obj;
}

fixLinks(cfg);
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
console.log('\nconfig.json links updated.');
