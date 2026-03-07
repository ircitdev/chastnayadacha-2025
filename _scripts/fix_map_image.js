const fs = require('fs');
const MAP_JSON = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/mapplic/map-1183.json';
const PAGE     = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';

// Fix map image to use absolute path from server root
const map = JSON.parse(fs.readFileSync(MAP_JSON, 'utf8'));
map.levels.forEach(l => {
  if (l.map) {
    // Use absolute path from site root - works regardless of where Mapplic resolves from
    l.map = l.map.replace('../wp-content/uploads/', '/wp-content/uploads/');
  }
  if (l.minimap) {
    l.minimap = l.minimap.replace('../wp-content/uploads/', '/wp-content/uploads/');
  }
});

// Also fix location thumbnails
map.locations.forEach(loc => {
  ['thumbnail', 'image'].forEach(k => {
    if (loc[k]) {
      loc[k] = loc[k].replace('../wp-content/uploads/', '/wp-content/uploads/');
    }
  });
});

fs.writeFileSync(MAP_JSON, JSON.stringify(map, null, 2), 'utf8');
console.log('map-1183.json: map image path fixed to:', map.levels[0].map);

// Re-inject into page with updated JSON
const jsonStr = JSON.stringify(map);
const dataJson = jsonStr.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const mapplicHtml = `<link rel="stylesheet" href="../wp-content/plugins/mapplic-wp/core/mapplic.css">
<mapplic-map id="mapplic-1183" data-json="${dataJson}" data-path="../wp-content/plugins/mapplic-wp/core/"></mapplic-map>
<script src="../wp-content/plugins/mapplic-wp/core/mapplic.js"><\/script>`;

let html = fs.readFileSync(PAGE, 'utf8');

// Replace everything between elementor-shortcode div tags
const scDiv = '<div class="elementor-shortcode">';
const idx = html.indexOf(scDiv);
const endIdx = html.indexOf('</div>', idx + scDiv.length);

html = html.substring(0, idx) +
  scDiv + '\n' + mapplicHtml + '\n</div>' +
  html.substring(endIdx + 6);

fs.writeFileSync(PAGE, html, 'utf8');
console.log('dacha-map/index.html updated');
