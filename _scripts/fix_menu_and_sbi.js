const fs   = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

function findHtml(dir, skip = ['wp-content'], res = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !skip.includes(e.name)) findHtml(full, skip, res);
    else if (e.name === 'index.html') res.push(full);
  }
  return res;
}

const files = findHtml(STATIC);
let patchedUrls = 0, patchedSbi = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;

  // 1. Fix absolute URLs: href="https://chastnayadacha.ru/PATH" -> href="/PATH"
  //    Also src= and action= attributes
  const before = content;
  content = content.replace(
    /(href|src|action)="https:\/\/chastnayadacha\.ru(\/[^"]*)"/g,
    '$1="$2"'
  );
  // Also escaped versions in JSON: https:\/\/chastnayadacha.ru\/
  content = content.replace(
    /(href|src|action)=\\"https:\\\/\\\/chastnayadacha\.ru(\\\/[^\\]*)\\"/g,
    '$1=\\"$2\\"'
  );
  if (content !== before) patchedUrls++;

  // 2. Remove sbi (Instagram) section from index.html only
  if (f.endsWith('static\\index.html') || f.endsWith('static/index.html')) {
    const sbiIdx = content.indexOf('sbi_photo_wrap');
    if (sbiIdx !== -1) {
      // Find containing <section going backward
      let secStart = -1;
      for (let i = sbiIdx; i >= 0; i--) {
        if (content[i] === '<' && content.substring(i, i+8) === '<section') {
          secStart = i; break;
        }
      }
      if (secStart !== -1) {
        // Find section end counting nested sections
        let depth = 0, i = secStart;
        while (i < content.length) {
          if (content.substring(i, i+8) === '<section') depth++;
          else if (content.substring(i, i+10) === '</section>') {
            depth--;
            if (depth === 0) { i += 10; break; }
          }
          i++;
        }
        const secEnd = i;
        content = content.substring(0, secStart) + content.substring(secEnd);
        patchedSbi++;
        console.log('Removed sbi section (' + (secEnd - secStart) + ' chars) from', path.relative(STATIC, f));
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
  }
}

console.log('\nPatched URLs in:', patchedUrls, 'files');
console.log('Removed sbi sections:', patchedSbi);
