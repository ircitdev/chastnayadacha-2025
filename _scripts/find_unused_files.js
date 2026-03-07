const fs   = require('fs');
const path = require('path');

const STATIC  = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const UPLOADS = STATIC + '/wp-content/uploads';

// 1. Читаем весь текстовый контент (HTML/JSON/CSS/JS) в один буфер
function readAllText(dir, exts, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) readAllText(full, exts, acc);
    else if (exts.some(x => e.name.endsWith(x))) acc.push(fs.readFileSync(full, 'utf8'));
  }
  return acc;
}

console.log('Reading content...');
const chunks = readAllText(STATIC, ['.html', '.json', '.css']);
const allContent = chunks.join('\n');
console.log('Content:', Math.round(allContent.length / 1024 / 1024), 'MB');

// 2. Сканируем все файлы в uploads/
function scanFiles(dir, base, result = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel  = base + '/' + e.name;
    if (e.isDirectory()) scanFiles(full, rel, result);
    else result.push({ full, rel, name: e.name });
  }
  return result;
}

const allFiles = scanFiles(UPLOADS, 'wp-content/uploads');
console.log('Files in uploads:', allFiles.length);

// 3. Для каждого файла ищем имя в контенте
const unused = [];
const used   = [];

for (const f of allFiles) {
  if (allContent.includes(f.name)) used.push(f);
  else unused.push(f);
}

console.log('Used:', used.length, ' Unused:', unused.length);

// 4. Группируем unused по папке
const byDir = {};
let totalBytes = 0;
for (const f of unused) {
  const dir = path.dirname(f.rel).replace(/\\/g, '/');
  if (!byDir[dir]) byDir[dir] = [];
  const sz = fs.statSync(f.full).size;
  totalBytes += sz;
  byDir[dir].push({ name: f.name, sz, full: f.full });
}

console.log('\n=== Unused files by directory ===');
for (const [dir, files] of Object.entries(byDir).sort()) {
  const dirSz = files.reduce((s, f) => s + f.sz, 0);
  console.log(`\n${dir}/ [${files.length} files, ${Math.round(dirSz/1024)}KB]`);
  files.forEach(f => console.log(`  ${f.name}  (${Math.round(f.sz/1024)}KB)`));
}
console.log('\nTotal unused:', Math.round(totalBytes/1024/1024), 'MB');

// 5. Удаляем
let deleted = 0, delBytes = 0;
for (const f of unused) {
  const sz = fs.statSync(f.full).size;
  fs.unlinkSync(f.full);
  deleted++;
  delBytes += sz;
}

// Удаляем пустые директории (рекурсивно снизу вверх)
function removeEmptyDirs(dir) {
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    if (fs.statSync(full).isDirectory()) removeEmptyDirs(full);
  }
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log('Removed empty dir:', dir);
  }
}
removeEmptyDirs(UPLOADS);

console.log(`\nDeleted ${deleted} files (${Math.round(delBytes/1024/1024)}MB)`);
