const fs = require('fs');
const dst = 'D:/DevTools/Database/2026chastnayadacha.ru/static/tur/index.html';
let html = fs.readFileSync(dst, 'utf8');

// Fix ssl:true -> ssl:false
html = html.replace('"ssl":true', '"ssl":false');

// Fix escaped slashes \/ -> / in ipanorama_globals block only
const globalsStart = html.indexOf('var ipanorama_globals=');
const globalsEnd = html.indexOf('};', globalsStart) + 2;
let globals = html.substring(globalsStart, globalsEnd);

// In the file, backslash is literal \, forward slash is /
// So we need to replace backslash+slash with just slash
globals = globals.split('\\/').join('/');

html = html.substring(0, globalsStart) + globals + html.substring(globalsEnd);

fs.writeFileSync(dst, html, 'utf8');

// Verify
const gi = html.indexOf('ipanorama_globals');
console.log('Fixed globals:');
console.log(html.substring(gi, gi+600));
