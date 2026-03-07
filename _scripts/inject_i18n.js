const fs   = require('fs');
const path = require('path');
const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

function findHtml(dir, skip, res) {
  skip = skip || ['wp-content'];
  res  = res  || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !skip.includes(e.name)) findHtml(full, skip, res);
    else if (e.name === 'index.html') res.push(full);
  }
  return res;
}

const files = findHtml(STATIC);
let patched = 0;

for (const f of files) {
  const rel    = path.relative(STATIC, f).replace(/\\/g, '/');
  const depth  = rel.split('/').length - 1;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);

  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('wp-i18n-js-after')) continue;

  // Remove any previous partial injection
  content = content.replace(/<script src="[^"]*wp-includes\/js\/dist\/hooks[^"]*"[^>]*><\/script>/g, '');
  content = content.replace(/<script src="[^"]*wp-includes\/js\/dist\/i18n[^"]*"[^>]*><\/script>/g, '');

  const hooksTag = `<script src="${prefix}wp-includes/js/dist/hooks.min.js" id="wp-hooks-js"></script>`;
  const i18nTag  = `<script src="${prefix}wp-includes/js/dist/i18n.min.js" id="wp-i18n-js"></script>`;
  const MARKER   = '<script type="text/javascript" id="wp-i18n-js-after">';

  const fixed = content.replace(MARKER, hooksTag + i18nTag + MARKER);

  if (fixed !== content) {
    fs.writeFileSync(f, fixed, 'utf8');
    patched++;
    console.log('Patched:', rel);
  }
}
console.log('Total patched:', patched);
