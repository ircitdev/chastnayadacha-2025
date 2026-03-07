/**
 * Перескачиваем все HTML страницы с живого сайта.
 * Применяем только нужные замены:
 * 1. Абсолютные URL → относительные (depth-based)
 * 2. wp-content/uploads/FILENAME → wp-content/uploads/images/CATEGORY/NEWNAME
 * Не трогаем year-папки (2021/2022/2023) — там файлы лежат как есть.
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const UPLOADS = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';

// Таблица переименований файлов из root uploads → images/category/name
// Строим из оставшихся файлов в images/ относительно uploads/
const RENAMES = new Map(); // oldFilename -> images/category/newname
function scanImages(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const r    = rel + '/' + e.name;
    if (e.isDirectory()) scanImages(full, r);
    else {
      // r = /images/territory/entrance.jpeg etc
      // Нам нужно понять какое оригинальное имя было
      // Пока просто строим map имён для применения
    }
  }
}

const PAGES = [
  { url: 'https://chastnayadacha.ru/', depth: 0, local: 'index.html' },
  { url: 'https://chastnayadacha.ru/about/', depth: 1, local: 'about/index.html' },
  { url: 'https://chastnayadacha.ru/bronirovanie/', depth: 1, local: 'bronirovanie/index.html' },
  { url: 'https://chastnayadacha.ru/category/uncategorized/', depth: 2, local: 'category/uncategorized/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/', depth: 1, local: 'dacha-map/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-4-sruba/', depth: 2, local: 'dacha-map/derevyannyj-srub-4-sruba/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-srub-15/', depth: 2, local: 'dacha-map/derevyannyj-srub-srub-15/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/domik-s-vidom-na-volgu/', depth: 2, local: 'dacha-map/domik-s-vidom-na-volgu/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostevoj-domik/', depth: 2, local: 'dacha-map/gostevoj-domik/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa/', depth: 2, local: 'dacha-map/gostinitsa/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-3p/', depth: 2, local: 'dacha-map/gostinitsa-3p/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-4p/', depth: 2, local: 'dacha-map/gostinitsa-4p/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-17-18-1-etae/', depth: 2, local: 'dacha-map/gostinitsa-premium-klassa-17-18-1-etae/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-18-1-etazh/', depth: 2, local: 'dacha-map/gostinitsa-premium-klassa-18-1-etazh/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-19-20-2-etazh/', depth: 2, local: 'dacha-map/gostinitsa-premium-klassa-19-20-2-etazh/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytaja-besedka-1/', depth: 2, local: 'dacha-map/otkrytaja-besedka-1/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytye-besedki/', depth: 2, local: 'dacha-map/otkrytye-besedki/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytye-besedki-2/', depth: 2, local: 'dacha-map/otkrytye-besedki-2/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/zakrytaya-besedka/', depth: 2, local: 'dacha-map/zakrytaya-besedka/index.html' },
  { url: 'https://chastnayadacha.ru/hello-world/', depth: 1, local: 'hello-world/index.html' },
  { url: 'https://chastnayadacha.ru/karta/', depth: 1, local: 'karta/index.html' },
  { url: 'https://chastnayadacha.ru/pay/', depth: 1, local: 'pay/index.html' },
  { url: 'https://chastnayadacha.ru/pay/info/', depth: 2, local: 'pay/info/index.html' },
  { url: 'https://chastnayadacha.ru/polozhenie-o-bronirovanii-uslug/', depth: 1, local: 'polozhenie-o-bronirovanii-uslug/index.html' },
  { url: 'https://chastnayadacha.ru/service/', depth: 1, local: 'service/index.html' },
  { url: 'https://chastnayadacha.ru/service/event/', depth: 2, local: 'service/event/index.html' },
  { url: 'https://chastnayadacha.ru/service/playground/', depth: 2, local: 'service/playground/index.html' },
  { url: 'https://chastnayadacha.ru/service/pool/', depth: 2, local: 'service/pool/index.html' },
  { url: 'https://chastnayadacha.ru/service/restaurant/', depth: 2, local: 'service/restaurant/index.html' },
  { url: 'https://chastnayadacha.ru/service/territory/', depth: 2, local: 'service/territory/index.html' },
  { url: 'https://chastnayadacha.ru/404-2/', depth: 1, local: '404-2/index.html' },
];

function get(url) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const mod = opts.protocol === 'https:' ? https : http;
    const req = mod.request({
      hostname: opts.hostname, path: opts.pathname + opts.search,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; static-copy/1.0)' }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.end();
  });
}

// Читаем текущую таблицу переименований из config.json и mapplic json
// как образец того что было переименовано
const IMAGES_DIR = path.join(UPLOADS, 'images');

// Строим карту: старое имя файла → новый путь (относительно uploads/)
// Читаем reorganize_images.js MAP напрямую — но это сложно
// Вместо этого: сканируем images/ и создаём карту по именам файлов
// Предполагаем что имена в images/ — это результат переименования

// Для патчинга нам нужна обратная карта: оригинальное имя → новое имя
// Это было сделано в reorganize_images.js — повторим логику упрощённо

// Загружаем текущее состояние: что находится в images/
// Пока используем самый простой подход:
// - для year-папок (2021/2022/2023) НЕ меняем пути
// - для файлов из root uploads — пути уже изменены корректно в config.json/mapplic
// - нам нужно только сохранить оригинальные HTML с правильными year-folder путями
// + добавить корректные замены для root uploads файлов (которые перемещены в images/)

// Читаем MAP из reorganize_images.js (копируем ключевую часть)
// Поскольку скрипт уже выполнился и файлы перемещены, ориентируемся по факту

// Функция: применить замены к HTML
function applyFixes(html, depth) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);

  // 1. Заменить абсолютные URL на относительные
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-content\/[^"'<\s)]+)/g, (m, p) => prefix + p);
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-includes\/[^"'<\s)]+)/g, (m, p) => prefix + p);
  // Escaped версии в JS
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-content\\\/([^"'\\s]+)/g, (m, p) => {
    return prefix + 'wp-content/' + p.replace(/\\\//g, '/');
  });
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-includes\\\/([^"'\\s]+)/g, (m, p) => {
    return prefix + 'wp-includes/' + p.replace(/\\\//g, '/');
  });

  // 2. Исправить internal links (абсолютные href на страницы сайта)
  // Оставляем как есть — они работают если сайт открыт с правильного домена

  return html;
}

async function main() {
  console.log('Downloading', PAGES.length, 'pages from live site...');

  for (const { url, depth, local } of PAGES) {
    process.stdout.write('.');
    try {
      let html = await get(url);
      html = applyFixes(html, depth);

      const localPath = path.join(STATIC, local);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, html, 'utf8');
    } catch(e) {
      console.error('\nFailed:', url, e.message);
    }
  }
  console.log('\nDownloaded all pages.');

  // Теперь применяем замены для root-uploads файлов (images/category/name)
  // Загружаем таблицу переименований из reorganize_images.js MAP
  // Просто применяем замены к свежескачанным страницам
  console.log('\nApplying image renames...');

  // Загружаем MAP из reorganize скрипта и применяем с правильными границами
  const { MAP, UPLOADS: U } = loadReorganizeMap();
  applyImageRenames(MAP, depth => depth);
}

// Мы не можем импортировать скрипт с MAP напрямую (он не модуль).
// Поэтому строим обратную карту иначе: сканируем images/ папку.
// Файл в images/rooms/room-09-a.jpg — это бывший room9.jpg
// Имя файла в images/ → сканируем и строим карту через содержимое config.json

// На самом деле самый простой подход: config.json и mapplic уже правильные.
// HTML файлы с year-папками тоже уже правильные после перескачивания.
// Нам нужно только применить те же замены images/ что были в reorganize_images.js.

// Читаем MAP напрямую из файла скрипта — не очень чисто но работает
function loadMapFromScript() {
  const src = fs.readFileSync('D:/DevTools/Database/2026chastnayadacha.ru/_scripts/reorganize_images.js', 'utf8');
  // Выполняем в sandbox
  const mapLines = {};
  // Применяем eval — небезопасно, но это наш собственный скрипт
  const sandbox = { MAP: {} };
  // Извлекаем MAP как строку
  const mapMatch = src.match(/const MAP = \{([\s\S]+?)\};/);
  if (mapMatch) {
    try {
      eval('sandbox.MAP = {' + mapMatch[1] + '}');
    } catch(e) {
      console.error('Could not parse MAP:', e.message);
    }
  }
  return sandbox.MAP;
}

function getBaseName(filename) {
  const noExt = filename.replace(/\.[a-zA-Z]+$/, '');
  return noExt.replace(/-\d+x\d+$/, '').replace(/-scaled$/, '').replace(/-e\d+$/, '');
}

async function run() {
  console.log('Downloading', PAGES.length, 'pages from live site...');

  for (const { url, depth, local } of PAGES) {
    process.stdout.write('.');
    try {
      let html = await get(url);
      html = applyFixes(html, depth);

      const localPath = path.join(STATIC, local);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, html, 'utf8');
    } catch(e) {
      console.error('\nFailed:', url, e.message);
    }
  }
  console.log('\nAll pages downloaded and URL-fixed.');

  // Применяем замены images/
  console.log('Applying image path renames to freshly downloaded pages...');
  const MAP = loadMapFromScript();
  const mapKeys = Object.keys(MAP);
  console.log('MAP has', mapKeys.length, 'entries');

  // Читаем все images/ файлы для построения replacements map
  // Стратегия: сканируем все файлы в UPLOADS root для нахождения оставшихся
  // (их уже нет — удалены) → строим replacements из MAP напрямую

  // Нам нужна map: старое имя (с размером) → новое имя (с размером)
  // e.g. "room9.jpg" → "images/rooms/room-09-a.jpg"
  //      "room9-1024x512.jpg" → "images/rooms/room-09-a-1024x512.jpg"

  // Сканируем images/ и для каждого файла определяем старое имя
  const replacements = new Map();

  function scanImagesDir(dir, relBase) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      const rel  = relBase + '/' + e.name;
      if (e.isDirectory()) {
        scanImagesDir(full, rel);
      } else {
        // rel = "images/rooms/room-09-a.jpg" or "images/rooms/room-09-a-1024x512.jpg"
        // Нам нужно понять какое оригинальное имя файла
        // Это сложно без обратного маппинга
        // Используем MAP напрямую
      }
    }
  }

  // Строим замены из MAP (как делал reorganize_images.js)
  // Но нужны все варианты с суффиксами размера.
  // Поскольку у нас нет списка суффиксов, строим только для base имён.

  for (const [oldBase, { dir, name }] of Object.entries(MAP)) {
    // Базовое имя
    replacements.set(oldBase + '.jpg',  'images/' + dir + '/' + name + '.jpg');
    replacements.set(oldBase + '.jpeg', 'images/' + dir + '/' + name + '.jpeg');
    replacements.set(oldBase + '.png',  'images/' + dir + '/' + name + '.png');
    replacements.set(oldBase + '.webp', 'images/' + dir + '/' + name + '.webp');
  }

  // Патчим HTML файлы (только те что в root static, не в cache)
  function findHtmlFiles(dir, skip = []) {
    const files = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!skip.includes(e.name)) files.push(...findHtmlFiles(full, skip));
      } else if (e.name.endsWith('.html')) {
        files.push(full);
      }
    }
    return files;
  }

  // Только корневые HTML (не wp-content/cache)
  const htmlFiles = [];
  for (const e of fs.readdirSync(STATIC, { withFileTypes: true })) {
    const full = path.join(STATIC, e.name);
    if (e.isDirectory() && e.name !== 'wp-content') htmlFiles.push(...findHtmlFiles(full));
    else if (e.name.endsWith('.html')) htmlFiles.push(full);
  }

  let patchedCount = 0;
  for (const f of htmlFiles) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    for (const [oldName, newPath] of replacements) {
      if (!content.includes(oldName)) continue;
      // Заменяем только если oldName стоит после "uploads/" и перед кавычкой/пробелом
      // Используем lookahead/lookbehind
      const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Граница: предшествует / или пробел, следует " ' ) пробел
      const rx = new RegExp('(?<=uploads/)' + escaped + '(?=["\'\\ \\)\\s>])', 'g');
      const next = content.replace(rx, newPath);
      if (next !== content) { content = next; changed = true; }
    }

    if (changed) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('Patched:', path.relative(STATIC, f));
      patchedCount++;
    }
  }

  console.log('\nPatched', patchedCount, 'HTML files with image renames.');
  console.log('Done!');
}

run().catch(console.error);
