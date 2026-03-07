/**
 * Восстанавливаем пути к файлам в year-папках (2021/2022/2023).
 * Скачиваем страницы с живого сайта и находим все правильные пути.
 * Затем исправляем HTML файлы: заменяем испорченные пути на правильные.
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// Список страниц для сканирования
const PAGES = [
  { url: 'https://chastnayadacha.ru/', local: 'index.html' },
  { url: 'https://chastnayadacha.ru/about/', local: 'about/index.html' },
  { url: 'https://chastnayadacha.ru/bronirovanie/', local: 'bronirovanie/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/', local: 'dacha-map/index.html' },
  { url: 'https://chastnayadacha.ru/service/', local: 'service/index.html' },
  { url: 'https://chastnayadacha.ru/service/restaurant/', local: 'service/restaurant/index.html' },
  { url: 'https://chastnayadacha.ru/service/territory/', local: 'service/territory/index.html' },
  { url: 'https://chastnayadacha.ru/service/pool/', local: 'service/pool/index.html' },
  { url: 'https://chastnayadacha.ru/service/playground/', local: 'service/playground/index.html' },
  { url: 'https://chastnayadacha.ru/service/event/', local: 'service/event/index.html' },
  { url: 'https://chastnayadacha.ru/karta/', local: 'karta/index.html' },
  { url: 'https://chastnayadacha.ru/pay/', local: 'pay/index.html' },
  { url: 'https://chastnayadacha.ru/pay/info/', local: 'pay/info/index.html' },
  { url: 'https://chastnayadacha.ru/polozhenie-o-bronirovanii-uslug/', local: 'polozhenie-o-bronirovanii-uslug/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-4-sruba/', local: 'dacha-map/derevyannyj-srub-4-sruba/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-srub-15/', local: 'dacha-map/derevyannyj-srub-srub-15/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/domik-s-vidom-na-volgu/', local: 'dacha-map/domik-s-vidom-na-volgu/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostevoj-domik/', local: 'dacha-map/gostevoj-domik/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa/', local: 'dacha-map/gostinitsa/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-3p/', local: 'dacha-map/gostinitsa-3p/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-4p/', local: 'dacha-map/gostinitsa-4p/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-17-18-1-etae/', local: 'dacha-map/gostinitsa-premium-klassa-17-18-1-etae/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-18-1-etazh/', local: 'dacha-map/gostinitsa-premium-klassa-18-1-etazh/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-19-20-2-etazh/', local: 'dacha-map/gostinitsa-premium-klassa-19-20-2-etazh/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytaja-besedka-1/', local: 'dacha-map/otkrytaja-besedka-1/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytye-besedki/', local: 'dacha-map/otkrytye-besedki/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/otkrytye-besedki-2/', local: 'dacha-map/otkrytye-besedki-2/index.html' },
  { url: 'https://chastnayadacha.ru/dacha-map/zakrytaya-besedka/', local: 'dacha-map/zakrytaya-besedka/index.html' },
  { url: 'https://chastnayadacha.ru/404-2/', local: '404-2/index.html' },
];

function get(url) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const req = https.request({ hostname: opts.hostname, path: opts.pathname, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400) return resolve(get(res.headers.location));
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.end();
  });
}

// Извлекаем все пути к year-папкам из HTML
function extractYearPaths(html) {
  const matches = html.match(/uploads\/202\d\/\d\d\/[^"'<>\s)]+/g) || [];
  return [...new Set(matches)];
}

async function main() {
  // Шаг 1: Собираем все правильные пути с живого сайта
  console.log('Fetching pages from live site...');
  const correctPaths = new Map(); // filename -> Set of correct full paths

  for (const { url, local } of PAGES) {
    process.stdout.write('.');
    try {
      const html = await get(url);
      const paths = extractYearPaths(html);
      for (const p of paths) {
        // Ключ = имя файла без -NxN суффикса и расширения
        const filename = p.split('/').pop();
        if (!correctPaths.has(p)) correctPaths.set(p, p);
      }
    } catch(e) {
      console.error('\nFailed:', url, e.message);
    }
  }
  console.log('\nCollected', correctPaths.size, 'correct year-folder paths');

  // Шаг 2: Для каждого локального HTML файла — исправляем испорченные пути
  // Стратегия: ищем паттерн "uploads/202x/xx/ANYTHING" где ANYTHING содержит "images/"
  // и заменяем на правильный вариант из correctPaths

  function findHtmlFiles(dir) {
    const files = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) files.push(...findHtmlFiles(full));
      else if (e.name.endsWith('.html')) files.push(full);
    }
    return files;
  }

  const htmlFiles = findHtmlFiles(STATIC);
  let totalFixed = 0;

  for (const f of htmlFiles) {
    let content = fs.readFileSync(f, 'utf8');
    const before = content;

    // Найти все испорченные пути (содержат "images/" внутри пути year-папки)
    const corruptedMatches = content.match(/uploads\/202\d\/\d\d\/[^"'<>\s)]*images\/[^"'<>\s)]*/g) || [];
    if (corruptedMatches.length === 0) continue;

    for (const corrupted of [...new Set(corruptedMatches)]) {
      // Извлечь префикс до "images/"
      const prefixMatch = corrupted.match(/^(uploads\/202\d\/\d\d\/)(.+?)images\/.+$/);
      if (!prefixMatch) continue;

      const yearDir = prefixMatch[1]; // "uploads/2021/09/"
      const corruptedBase = prefixMatch[2]; // что-то вроде "about1-300x17" или "aboutimages..."

      // Ищем в correctPaths совпадение по yearDir + начало имени
      // Берём самое подходящее совпадение
      let bestMatch = null;
      for (const [correct] of correctPaths) {
        if (!correct.startsWith(yearDir)) continue;
        const correctFile = correct.slice(yearDir.length);
        // Проверяем что испорченная строка начинается с правильного файлового имени
        // corruptedBase должен начинаться с correctFile (или его prefix)
        if (corruptedBase.startsWith(correctFile.replace(/\.[a-z]+$/, '').slice(0, Math.min(corruptedBase.length, 8)))) {
          if (!bestMatch || correctFile.length > bestMatch.length) {
            bestMatch = correct;
          }
        }
      }

      if (bestMatch) {
        const rx = new RegExp(corrupted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(rx, bestMatch);
      }
    }

    if (content !== before) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('Fixed:', path.relative(STATIC, f));
      totalFixed++;
    }
  }

  console.log('\nTotal fixed:', totalFixed);
}

main().catch(console.error);
