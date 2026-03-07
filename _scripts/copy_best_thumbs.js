const fs   = require('fs');
const path = require('path');
const UPLOADS = 'D:/DevTools/Database/2026chastnayadacha.ru/uploads';
const DEST    = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';

const missing = [
  'Image01','Image03','Image05','Image07','Image09','Image10','Image12','Image14','Image16',
  '2-1','2','3','SAM2104',
  'IMG_1943','IMG_1947','IMG_1951','IMG_2481','IMG_2550','IMG_2555','IMG_2558',
  'IMG_2563','IMG_2565','IMG_2568','IMG_8330-1','IMG_8341-1','IMG_0839','IMG_1848','IMG_5383',
  'dacha_na_volge-05102021-0003','dacha_na_volge-05102021-0006','dacha_na_volge-05102021-0008',
  'dacha_na_volge-18092021-0095',
  'dacha_na_volge-01102021-0017','dacha_na_volge-01102021-0031','dacha_na_volge-01102021-0004',
  'dacha_na_volge-01102021-0010','dacha_na_volge-01102021-0011','dacha_na_volge-01102021-0014',
];

const allUploads = fs.readdirSync(UPLOADS);
let copied = 0;

for (const base of missing) {
  const baseLow = base.toLowerCase();
  const candidates = allUploads.filter(f => {
    const fl = f.toLowerCase();
    return fl.startsWith(baseLow + '-') || fl === baseLow + '.jpg' || fl === baseLow + '.jpeg' || fl === baseLow + '.png';
  });
  if (candidates.length === 0) { console.log('NO CANDIDATES:', base); continue; }

  const sized = candidates.map(f => ({ f, size: fs.statSync(path.join(UPLOADS, f)).size }))
    .sort((a, b) => b.size - a.size);
  const best = sized[0];

  // Determine destination filename (use .jpg)
  const destFile = base + '.jpg';
  fs.copyFileSync(path.join(UPLOADS, best.f), path.join(DEST, destFile));
  console.log('Copied:', destFile, '<-', best.f, '(' + Math.round(best.size / 1024) + 'KB)');
  copied++;
}
console.log('\nTotal copied:', copied);
