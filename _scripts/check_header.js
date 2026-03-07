const fs = require('fs');
const html = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/static/index.html', 'utf8');

// Find all script srcs
const re = /src=["']([^"']+)["']/g;
let m;
const scripts = [];
while ((m = re.exec(html)) !== null) {
  if (m[1].includes('elementor') || m[1].includes('frontend')) {
    scripts.push(m[1]);
  }
}
console.log('Elementor scripts:');
scripts.slice(0, 20).forEach(s => console.log(' ', s));

// Check if frontend.min.js exists locally
const frontendPath = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/plugins/elementor/assets/js/frontend.min.js';
console.log('\nfrontend.min.js exists:', fs.existsSync(frontendPath));

// Check elementor-invisible usage
const idx = html.indexOf('elementor-invisible');
console.log('\nelementor-invisible found:', idx !== -1);
console.log('Context:', html.substring(idx - 50, idx + 100));
