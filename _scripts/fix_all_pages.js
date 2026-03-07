/**
 * Фиксим все HTML страницы:
 * 1. Заменяем экранированные абсолютные URL в JS (https:\/\/chastnayadacha.ru\/) на относительные
 * 2. Скачиваем недостающие ассеты Elementor
 */
const fs = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// Рекурсивно находим все index.html
function findHtmlFiles(dir) {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !item.startsWith('_') && item !== 'wp-content' && item !== 'wp-includes') {
      files.push(...findHtmlFiles(full));
    } else if (item === 'index.html' || item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

// Для каждого HTML определяем глубину и исправляем пути
function fixHtml(filePath) {
  const rel = filePath.replace(STATIC, '').replace(/\\/g, '/');
  // Глубина от корня static/
  const depth = rel.replace(/^\//, '').split('/').length - 1; // -1 за имя файла
  const root = depth === 0 ? './' : '../'.repeat(depth);

  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.length;

  // Исправляем экранированные URL в JS-блоках (https:\/\/chastnayadacha.ru\/)
  html = html
    .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/plugins\\/elementor-pro\\/assets\\/').join(root + 'wp-content/plugins/elementor-pro/assets/')
    .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/plugins\\/elementor\\/assets\\/').join(root + 'wp-content/plugins/elementor/assets/')
    .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/uploads\\/').join(root + 'wp-content/uploads/')
    .split('https:\\/\\/chastnayadacha.ru\\/wp-content\\/').join(root + 'wp-content/')
    .split('https:\\/\\/chastnayadacha.ru\\/wp-admin\\/').join(root + 'wp-admin/')
    .split('https:\\/\\/chastnayadacha.ru\\/wp-json\\/').join(root + 'wp-json/')
    .split('https:\\/\\/chastnayadacha.ru\\/').join(root);

  if (html.length !== before || html !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

const files = findHtmlFiles(STATIC);
// Also check tur/index.html
const turFile = path.join(STATIC, 'tur/index.html');
if (fs.existsSync(turFile) && !files.includes(turFile)) files.push(turFile);

console.log(`Found ${files.length} HTML files`);
let fixed = 0;
for (const f of files) {
  const changed = fixHtml(f);
  if (changed) {
    console.log('  Fixed:', f.replace(STATIC, ''));
    fixed++;
  }
}
console.log(`\nFixed ${fixed} files`);
