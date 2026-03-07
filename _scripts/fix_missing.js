const fs = require('fs');
const path = require('path');

const DST = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const SRC_EXTRA = 'D:/DevTools/Database/2026grigory-gorbunov.ru/static/uploads';

// Файлы которые ещё не найдены
const stillMissing = [
  'active-268x300.jpg',
  'dachi-61.jpg',
  'IMG_0392.jpg','IMG_0392-300x225.jpg',
  'IMG_1718.jpg',
  'Image03.jpg','Image01.jpg','Image05.jpg','Image05-300x225.jpg',
  'Image07.jpg','Image09.jpg','Image09-300x225.jpg',
  'Image10.jpg','Image11-300x225.jpg','Image12.jpg','Image14.jpg',
  'Image16.jpg','Image16-300x225.jpg',
  'IMG_6099-768x576.jpg','IMG_6090-300x225.jpg',
  '9-1-300x225.jpg','2-1.jpg',
  '04-300x225.jpg','06-300x225.jpg','05-1-768x576.jpg',
  '2.jpg','2-300x225.jpg','3.jpg',
  'gostinica16.jpg','gostinica16-208x300.jpg',
  '12-225x300.jpg',
  '4nomer-1-200x300.jpg','4nomer-3.jpg','4nomer-3-300x200.jpg',
  '4nomer-9.jpg','4nomer-10-300x200.jpg','4nomer-11.jpg','4nomer-11-300x200.jpg',
  'IMG_0380-300x200.jpg','IMG_9935-300x200.jpg',
  '1img-1.jpg','2img-1-300x200.jpg','3img-1.jpg',
  '10img-1-300x200.jpg','10img-1-768x512.jpg',
  '3img-2-300x200.jpg',
  '4img-2.jpg','4img-2-300x200.jpg','5img-2.jpg','6img-2-300x200.jpg',
  '7img-1-300x200.jpg','8img-1-300x200.jpg','12img-1-300x200.jpg','16img-1.jpg',
  '4img-4.jpg','1img-4.jpg',
  'dacha_na_volge-05102021-0003.jpg','dacha_na_volge-05102021-0006.jpg',
  'dacha_na_volge-05102021-0004-300x300.jpg',
  'dacha_na_volge-05102021-0008.jpg','dacha_na_volge-05102021-0008-300x300.jpg',
  '1img-3.jpg','1img-3-300x200.jpg','3img-3-300x200.jpg',
  'dacha_na_volge-18092021-0098-240x300.jpg','dacha_na_volge-18092021-0095.jpg',
  'SAM2104.jpg','SAM2104-300x225.jpg',
  'DSC00980-300x225.jpg','image-17-11-14-04-02-4-300x225.jpg',
  'IMG_1939-225x300.jpg','IMG_1943.jpg','IMG_1943-300x225.jpg',
  'IMG_1947.jpg','IMG_1951.jpg','IMG_2481.jpg','IMG_2550.jpg',
  'IMG_2555.jpg','IMG_2557-300x225.jpg','IMG_2558.jpg',
  'IMG_2563.jpg','IMG_2565.jpg','IMG_2568.jpg','IMG_2568-300x225.jpg',
  'IMG_8230-169x300.jpg','IMG_8330-1.jpg','IMG_8341-1.jpg','IMG_8341-1-300x225.jpg',
  'dacha_na_volge-01102021-0015-240x300.jpg',
  'dacha_na_volge-01102021-0017.jpg','dacha_na_volge-01102021-0026-300x300.jpg',
  'dacha_na_volge-01102021-0028-300x203.jpg','dacha_na_volge-01102021-0031.jpg',
  'dacha_na_volge-01102021-0004.jpg','dacha_na_volge-01102021-0005-289x300.jpg',
  'dacha_na_volge-01102021-0009-300x300.jpg','dacha_na_volge-01102021-0010.jpg',
  'dacha_na_volge-01102021-0011.jpg','dacha_na_volge-01102021-0011-300x200.jpg',
  'dacha_na_volge-01102021-0014.jpg','dacha_na_volge-01102021-0014-300x192.jpg',
  'IMG_0839.jpg','IMG_0839-300x200.jpg','IMG_0844-300x200.jpg',
  'IMG_7062-300x225.jpg',
  '1322437748048920155-1-300x300.jpg','2081193530841036601-240x300.jpg',
  '2img.jpg','4img.jpg','6img.jpg','8img.jpg','10img.jpg',
  '11img-300x200.jpg','12img.jpg','14img.jpg','17img.jpg','17img-300x200.jpg',
  '20img-300x225.jpg','21img.jpg','22img-300x225.jpg',
  '23img.jpg','23img-300x225.jpg',
  'IMG_1848.jpg','IMG_1848-169x300.jpg','IMG_1855-300x169.jpg',
  'IMG_5383.jpg','IMG_6097-300x225.jpg',
];

// Все доступные файлы в DST (плоский корень) и SRC_EXTRA
function listFlat(dir) {
  const files = new Map(); // basename without size suffix -> [full paths]
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.isFile()) {
      const name = item.name;
      // Базовое имя без суффикса размера типа -300x225
      const base = name.replace(/-\d+x\d+(\.\w+)$/, '$1');
      if (!files.has(base)) files.set(base, []);
      files.get(base).push(path.join(dir, name));
    }
  }
  return files;
}

const dstFlat = listFlat(DST);
const srcFlat = listFlat(SRC_EXTRA);

// Объединяем: приоритет DST, потом SRC_EXTRA
const allFlat = new Map([...srcFlat, ...dstFlat]);

let fixed = 0, unfixed = [];

for (const rel of stillMissing) {
  if (rel === '*') continue;
  const dstPath = path.join(DST, rel);
  if (fs.existsSync(dstPath)) { fixed++; continue; } // уже есть

  const ext = path.extname(rel);
  const base = rel.replace(/-\d+x\d+(\.\w+)$/, '$1');

  // Ищем в обоих источниках
  const candidates = allFlat.get(base) || [];

  if (candidates.length > 0) {
    // Берём наибольший файл как лучшее качество
    const best = candidates.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
    fs.copyFileSync(best, dstPath);
    console.log(`  FIXED: ${rel} <- ${path.basename(best)}`);
    fixed++;
  } else {
    unfixed.push(rel);
  }
}

console.log(`\nFixed: ${fixed} | Still unfixed: ${unfixed.length}`);
if (unfixed.length) {
  console.log('Unfixed:');
  unfixed.forEach(f => console.log(' ', f));
}
