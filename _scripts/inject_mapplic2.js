const fs = require('fs');

const MAP_JSON = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/mapplic/map-1183.json';
const PAGE     = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';

// Read and fix map JSON
let mapData = JSON.parse(fs.readFileSync(MAP_JSON, 'utf8'));

// Fix all URLs (relative to /dacha-map/ page: depth=1, root=../)
function fixUrls(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === 'string') {
      if (obj[k].startsWith('//chastnayadacha.ru/')) {
        obj[k] = 'https:' + obj[k];
      }
      if (obj[k].startsWith('https://chastnayadacha.ru/wp-content/uploads/')) {
        obj[k] = obj[k].replace('https://chastnayadacha.ru/wp-content/uploads/', '../wp-content/uploads/');
      } else if (obj[k].startsWith('https://chastnayadacha.ru/')) {
        obj[k] = obj[k].replace('https://chastnayadacha.ru/', '../');
      }
      if (obj[k].startsWith('/') && !obj[k].startsWith('//') && !obj[k].startsWith('/wp-')) {
        obj[k] = '..' + obj[k];
      }
    } else if (typeof obj[k] === 'object') {
      fixUrls(obj[k]);
    }
  }
  return obj;
}

fixUrls(mapData);
const jsonStr = JSON.stringify(mapData);
fs.writeFileSync(MAP_JSON, JSON.stringify(mapData, null, 2), 'utf8');
console.log('map-1183.json fixed, locations:', mapData.locations.length);

// Build the correct HTML using web component syntax
// data-json = JSON encoded as HTML entities (like WordPress does)
const dataJson = jsonStr.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const mapplicHtml = `<link rel="stylesheet" href="../wp-content/plugins/mapplic-wp/core/mapplic.css">
<mapplic-map id="mapplic-1183" data-json="${dataJson}" data-path="../wp-content/plugins/mapplic-wp/core/"></mapplic-map>
<script src="../wp-content/plugins/mapplic-wp/core/mapplic.js"><\/script>`;

// Replace shortcode in page
let html = fs.readFileSync(PAGE, 'utf8');

const scDiv = '<div class="elementor-shortcode">';
const idx = html.indexOf(scDiv);
if (idx === -1) { console.error('elementor-shortcode div not found'); process.exit(1); }

const endIdx = html.indexOf('</div>', idx + scDiv.length);
html = html.substring(0, idx) +
  scDiv + '\n' + mapplicHtml + '\n</div>' +
  html.substring(endIdx + 6);

fs.writeFileSync(PAGE, html, 'utf8');
console.log('dacha-map/index.html updated with web component');
