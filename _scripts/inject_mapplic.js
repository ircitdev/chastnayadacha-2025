const fs = require('fs');

const MAP_JSON = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/mapplic/map-1183.json';
const PAGE     = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';

// 1. Fix URLs in map JSON (relative to /dacha-map/ page depth=1 -> ../)
let mapRaw = fs.readFileSync(MAP_JSON, 'utf8');
mapRaw = mapRaw
  .split('//chastnayadacha.ru/wp-content/uploads/').join('../wp-content/uploads/')
  .split('https://chastnayadacha.ru/wp-content/uploads/').join('../wp-content/uploads/')
  .split('https://chastnayadacha.ru/').join('../')
  .split('http://chastnayadacha.ru/').join('../');

// Fix internal links in locations
const map = JSON.parse(mapRaw);
map.locations.forEach(loc => {
  if (loc.link && loc.link.startsWith('/') && !loc.link.startsWith('//')) {
    loc.link = '..' + loc.link;
  }
});
const fixedJson = JSON.stringify(map, null, 2);
fs.writeFileSync(MAP_JSON, fixedJson, 'utf8');
console.log('map-1183.json fixed');

// 2. Build Mapplic HTML block to replace the shortcode
const mapplicHtml = `<link rel="stylesheet" href="../wp-content/plugins/mapplic-wp/core/mapplic.css">
<div id="mapplic-map" style="width:100%;max-width:100%;"></div>
<script src="../wp-content/plugins/mapplic-wp/core/mapplic.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  var mapData = ${fixedJson};
  // Fix map URL to be absolute from page
  if (mapData.levels) {
    mapData.levels.forEach(function(l) {
      if (l.map && l.map.startsWith('../')) l.map = l.map;
    });
  }
  new Mapplic({
    element: '#mapplic-map',
    json: '../wp-content/uploads/mapplic/map-1183.json',
    height: 'auto'
  });
});
<\/script>`;

// 3. Replace shortcode in HTML
let html = fs.readFileSync(PAGE, 'utf8');

// The shortcode appears as: [mapplic id="1183" h="auto"]
const shortcode = '[mapplic id=&quot;1183&quot; h=&quot;auto&quot;]';
const shortcodeRaw = '[mapplic id="1183" h="auto"]';

if (html.includes(shortcodeRaw)) {
  html = html.replace(shortcodeRaw, mapplicHtml);
  console.log('Replaced raw shortcode');
} else if (html.includes(shortcode)) {
  html = html.replace(shortcode, mapplicHtml);
  console.log('Replaced encoded shortcode');
} else {
  // Find the elementor-shortcode div and replace its content
  const scStart = html.indexOf('<div class="elementor-shortcode">');
  const scEnd   = html.indexOf('</div>', scStart);
  if (scStart !== -1) {
    html = html.substring(0, scStart) +
      '<div class="elementor-shortcode">' + mapplicHtml + '</div>' +
      html.substring(scEnd + 6);
    console.log('Replaced via elementor-shortcode div');
  } else {
    console.log('WARNING: shortcode div not found!');
  }
}

fs.writeFileSync(PAGE, html, 'utf8');
console.log('dacha-map/index.html updated');
