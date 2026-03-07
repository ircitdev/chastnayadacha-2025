const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs   = require('fs');
const path = require('path');

const PAGE     = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';
const MAP_DIR  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/mapplic';
const MAP_JSON = MAP_DIR + '/map-1183.json';

const conn = new Client();
conn.on('ready', () => {
  // Fetch map JSON from MySQL via wp-cli or direct cat
  conn.exec('cat /var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/mapplic/map-1183.json', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      conn.end();

      let data;
      try { data = JSON.parse(out); } catch(e) { console.error('Parse error:', e.message); return; }

      // Fix URLs
      function fixUrls(obj) {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === 'string') {
            if (obj[k].startsWith('//chastnayadacha.ru/')) obj[k] = 'https:' + obj[k];
            if (obj[k].startsWith('https://chastnayadacha.ru/wp-content/uploads/'))
              obj[k] = obj[k].replace('https://chastnayadacha.ru/wp-content/uploads/', '../wp-content/uploads/');
            else if (obj[k].startsWith('https://chastnayadacha.ru/'))
              obj[k] = obj[k].replace('https://chastnayadacha.ru/', '../');
          } else if (typeof obj[k] === 'object') fixUrls(obj[k]);
        }
      }
      fixUrls(data);

      // Map image → absolute path
      if (data.levels) {
        data.levels.forEach(l => {
          if (l.map) l.map = l.map.replace('../wp-content/uploads/', '/wp-content/uploads/');
        });
      }

      fs.mkdirSync(MAP_DIR, { recursive: true });
      fs.writeFileSync(MAP_JSON, JSON.stringify(data, null, 2), 'utf8');
      console.log('map-1183.json saved, locations:', data.locations ? data.locations.length : 0);

      // Inject into dacha-map page
      injectMapplic(data);
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => console.error(e.message));

function injectMapplic(data) {
  const jsonStr  = JSON.stringify(data);
  const dataJson = jsonStr.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const mapplicHtml =
    '<link rel="stylesheet" href="../wp-content/plugins/mapplic-wp/core/mapplic.css">\n' +
    '<mapplic-map id="mapplic-1183" data-json="' + dataJson + '" data-path="../wp-content/plugins/mapplic-wp/core/"></mapplic-map>\n' +
    '<script src="../wp-content/plugins/mapplic-wp/core/mapplic.js"><\/script>';

  let html = fs.readFileSync(PAGE, 'utf8');

  const scDiv  = '<div class="elementor-shortcode">';
  const idx    = html.indexOf(scDiv);
  if (idx === -1) { console.error('elementor-shortcode div not found'); return; }

  const endIdx = html.indexOf('</div>', idx + scDiv.length);
  html = html.substring(0, idx) + scDiv + '\n' + mapplicHtml + '\n</div>' + html.substring(endIdx + 6);

  fs.writeFileSync(PAGE, html, 'utf8');
  console.log('dacha-map/index.html updated with mapplic web component');
}
