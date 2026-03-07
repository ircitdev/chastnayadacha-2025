/**
 * Восстанавливает испорченные пути в HTML файлах.
 * Проблема: короткие имена (01, 13, 15, 17, 19, 20, 21...) были заменены
 * внутри более длинных строк (about1, about13, rest15, playground17 и т.п.)
 *
 * Стратегия: находим все вхождения паттерна "uploads/202x/xx/...images/..."
 * и восстанавливаем их до корректного вида.
 */
const fs   = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// Карта испорченных суффиксов → что было до замены
// Ключ: то что вставил скрипт (images/territory/photo-XX-N)
// Значение: оригинальный фрагмент который был заменён
const UNDO_MAP = [
  // "images/territory/photo-01-01" <- "01"  (в uploads/2021/09/dacha_na_volge-18092021-00images/...)
  { bad: /(\d+x\d+x?)images\/territory\/photo-17-8\.jpg/g,       fix: (m,p1) => p1 + '5.jpg' },
  { bad: /(\d+x\d+x?)images\/territory\/photo-17-8\.jpg/g,       fix: (m,p1) => p1 + '5.jpg' },
  { bad: /about1-300x17images\/territory\/photo-17-8\.jpg/g,     fix: () => 'about1-300x175.jpg' },
  { bad: /about5-300x17images\/territory\/photo-17-8\.jpg/g,     fix: () => 'about5-300x175.jpg' },
  { bad: /child_cover-768x76images\/territory\/photo-17-8\.jpg/g,fix: () => 'child_cover-768x768.jpg' },
  { bad: /playground3-768x76images\/territory\/photo-17-8\.jpg/g,fix: () => 'playground3-768x768.jpg' },
  { bad: /pool_cover-768x76images\/territory\/photo-17-8\.jpg/g, fix: () => 'pool_cover-768x768.jpg' },
  { bad: /aboutimages\/territory\/photo-13-2\.jpg/g,             fix: () => 'about13.jpg' },
  { bad: /aboutimages\/territory\/photo-15-3\.jpg/g,             fix: () => 'about15.jpg' },
  { bad: /aboutimages\/territory\/photo-13-2/g,                  fix: () => 'about13' },
  { bad: /playgroundimages\/territory\/photo-13-2/g,             fix: () => 'playground13' },
  { bad: /playgroundimages\/territory\/photo-15-3/g,             fix: () => 'playground15' },
  { bad: /playgroundimages\/territory\/photo-17-8/g,             fix: () => 'playground17' },
  { bad: /restimages\/territory\/photo-13-2/g,                   fix: () => 'rest13' },
  { bad: /restimages\/territory\/photo-15-3/g,                   fix: () => 'rest15' },
  { bad: /restimages\/territory\/photo-17-8/g,                   fix: () => 'rest17' },
  { bad: /restimages\/territory\/photo-19-10/g,                  fix: () => 'rest19' },
  { bad: /restimages\/territory\/photo-20-11/g,                  fix: () => 'rest20' },
  { bad: /restimages\/territory\/photo-21-12/g,                  fix: () => 'rest21' },
  { bad: /rest1images\/territory\/photo-15-3/g,                  fix: () => 'rest15' },
  { bad: /terrimages\/territory\/photo-15-3/g,                   fix: () => 'terr15' },
  { bad: /cropped-Favicon-Green-Heart-300x300-1-192x19images\/territory\/photo-13-2/g, fix: () => 'cropped-Favicon-Green-Heart-300x300-1-192x192' },
  { bad: /cropped-Favicon-Green-Heart-300x300-1-32x3images\/territory\/photo-13-2/g,  fix: () => 'cropped-Favicon-Green-Heart-300x300-1-32x32' },
  { bad: /dacha_na_volge-18092021-00images\/territory\/photo-01-01/g, fix: () => 'dacha_na_volge-18092021-009' },
  // rest21-12 with extra
  { bad: /restimages\/territory\/photo-21-1images\/territory\/photo-13-2/g, fix: () => 'rest21' },
];

// Более умный подход — найти все испорченные шаблоны через regex и восстановить
// Паттерн испорченного пути: что-то + "images/territory/photo-NN-NN" посередине строки
// Восстановление: убрать "images/territory/photo-NN-NN" и то что после него до следующего /

function findHtmlFiles(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...findHtmlFiles(full));
    else if (e.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = findHtmlFiles(STATIC);
let totalFixed = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Универсальное правило: убрать вставленный "images/CATEGORY/NAME" из середины старого пути
  // Паттерн: (uploads/202x/xx/...)(images/territory|rooms|etc/photo-XX-XX)(остаток)
  // Нужно восстановить оригинальное имя файла — без вставки
  //
  // Подход: найти "...images/(territory|rooms|...)/[^/]+" внутри пути uploads/202x
  // и удалить эту вставку вместе с тем что после неё до конца имени файла

  const before = content;

  // Паттерн 1: число из цифр перед "images/" → это был числовой суффикс размера
  // e.g. "about1-300x17images/territory/photo-17-8.jpg" → "about1-300x175.jpg"
  // Восстанавливаем: находим "(\d+)images/territory/photo-(\d+)-(\d+)\.(\w+)"
  // → первые цифры это суффикс который был обрезан, восстанавливаем из второго числа

  // Правило: "NNimages/territory/photo-NN-N.ext" → NNN.ext  (NN + N = полное число)
  content = content.replace(
    /(\w[^"' \/]*?)(\d{1,4}x?)images\/(territory|rooms|misc|playground|social|restaurant|panoramas|icons|slides)\/photo-(\d+)-(\d+)\./g,
    (m, prefix, partial, cat, n1, n2) => {
      // partial = то что осталось от числа перед "images/"
      // n1 = первое число в photo-N1-N2 (это индекс)
      // n2 = второе число (это то что было заменено, исходный фрагмент)
      // Восстанавливаем: prefix + partial + n2 + "."
      return prefix + partial + n2 + '.';
    }
  );

  // Правило 2: "wordimages/category/name" где word — буквенная часть имени файла
  // e.g. "aboutimages/territory/photo-13-2.jpg" → "about13.jpg"
  content = content.replace(
    /([a-zA-Z_-]+)images\/(territory|rooms|misc|playground|social|restaurant|panoramas|icons|slides)\/(?:photo-|gallery-|room-|photo-image-)?(\d+)[^"' )>]*/g,
    (m, prefix, cat, num) => {
      return prefix + num;
    }
  );

  if (content !== before) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed:', path.relative(STATIC, f));
    changed = true;
    totalFixed++;
  }
}

console.log('\nTotal fixed files:', totalFixed);
