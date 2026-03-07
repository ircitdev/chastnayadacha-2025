/**
 * Fix all remaining absolute https://chastnayadacha.ru/ URLs in HTML files
 * Replaces them with relative paths based on file depth
 */
const fs = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const DOMAIN = 'https://chastnayadacha.ru';

function getDepth(filePath) {
  const rel = path.relative(STATIC, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');
  return parts.length - 1; // depth = number of directories above file
}

function getPrefix(depth) {
  return depth === 0 ? './' : '../'.repeat(depth);
}

function fixHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const depth = getDepth(filePath);
  const prefix = getPrefix(depth);

  let changes = 0;

  // Replace https://chastnayadacha.ru/wp-content/ -> ../wp-content/ (or ./wp-content/)
  const before = html.length;

  // Replace in href, src, content attributes (plain URLs)
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-content\/[^"'<\s)]+)/g, (m, p1) => {
    changes++;
    return prefix + p1;
  });
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-includes\/[^"'<\s)]+)/g, (m, p1) => {
    changes++;
    return prefix + p1;
  });

  // Replace escaped URLs in JS: https:\/\/chastnayadacha.ru\/wp-content\/
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-content\\\/([^"'\\s]+)/g, (m, p1) => {
    // p1 has \/ separators
    const clean = p1.replace(/\\\//g, '/');
    changes++;
    return prefix + 'wp-content/' + clean;
  });
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-includes\\\/([^"'\\s]+)/g, (m, p1) => {
    const clean = p1.replace(/\\\//g, '/');
    changes++;
    return prefix + 'wp-includes/' + clean;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Fixed ' + changes + ' URLs in:', path.relative(STATIC, filePath));
  }
  return changes;
}

function findHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(full));
    } else if (e.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(STATIC);
let totalChanges = 0;
let totalFiles = 0;

for (const f of htmlFiles) {
  const c = fixHtml(f);
  if (c > 0) { totalFiles++; totalChanges += c; }
}

console.log('\nTotal:', totalChanges, 'replacements in', totalFiles, 'files out of', htmlFiles.length);
