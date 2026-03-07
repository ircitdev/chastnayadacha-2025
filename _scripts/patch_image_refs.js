/**
 * Финальный патч: заменяем ссылки на root-uploads файлы → images/category/name
 * Заменяем паттерн "wp-content/uploads/OLDBASE[-NNNxNNN][-scaled].EXT"
 * на "wp-content/uploads/images/CAT/NEWNAME[-NNNxNNN][-scaled].EXT"
 *
 * Работаем с уже перескачанными HTML страницами (чистые оригиналы).
 */
const fs   = require('fs');
const path = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// Копируем MAP из reorganize_images.js
// (только ключи с не-числовыми базовыми именами которые точно не конфликтуют)
const MAP = {
  'room7-3mestn':           { dir: 'rooms', name: 'room-07-triple' },
  'room9':                  { dir: 'rooms', name: 'room-09-a' },
  'room9-1':                { dir: 'rooms', name: 'room-09-b' },
  'room12':                 { dir: 'rooms', name: 'room-12-living' },
  'room12-1':               { dir: 'rooms', name: 'room-12-exterior' },
  'room12-spal':            { dir: 'rooms', name: 'room-12-bedroom' },
  'room17-gostin-1':        { dir: 'rooms', name: 'room-17-living' },
  'room17-s1':              { dir: 'rooms', name: 'room-17-bedroom-a' },
  'room17-spaln1':          { dir: 'rooms', name: 'room-17-bedroom-b' },
  'room17-spalna2-nolight': { dir: 'rooms', name: 'room-17-bedroom-c' },
  'room19-spal3':           { dir: 'rooms', name: 'room-19-bedroom-a' },
  'room19-spal3-1':         { dir: 'rooms', name: 'room-19-bedroom-b' },
  'room19-spal3-2':         { dir: 'rooms', name: 'room-19-bedroom-c' },
  'room19-spal3-3':         { dir: 'rooms', name: 'room-19-bedroom-d' },
  'vip15-spaln1et-v2':      { dir: 'rooms', name: 'room-15-vip-bedroom-a' },
  'vip15-spaln1etaj2':      { dir: 'rooms', name: 'room-15-vip-bedroom-b' },
  'vip15spaln1et-v2':       { dir: 'rooms', name: 'room-15-vip-bedroom-c' },
  'vip19-gostin':           { dir: 'rooms', name: 'room-19-vip-living-a' },
  'vip19-gostin-1':         { dir: 'rooms', name: 'room-19-vip-living-b' },
  'vip19-gostin-2':         { dir: 'rooms', name: 'room-19-vip-living-c' },
  'vip19-spaln2':           { dir: 'rooms', name: 'room-19-vip-bedroom-a' },
  'vip19-spalna1':          { dir: 'rooms', name: 'room-19-vip-bedroom-b' },
  'preview-vip19-spalna1':  { dir: 'rooms', name: 'room-19-vip-preview' },
  'vip-room18-spalna2':     { dir: 'rooms', name: 'room-18-vip-bedroom' },
  'dom16prostovanna':       { dir: 'rooms', name: 'room-16-bathroom-a' },
  'dom16prostovanna-1':     { dir: 'rooms', name: 'room-16-bathroom-b' },
  'dom21':                  { dir: 'rooms', name: 'room-21-exterior' },
  'dom21-gostin':           { dir: 'rooms', name: 'room-21-living' },
  'dom21-spaln1-v1':        { dir: 'rooms', name: 'room-21-bedroom-a' },
  'dom21-spaln1-v1-1':      { dir: 'rooms', name: 'room-21-bedroom-b' },
  'dom21-spaln1-v1-2':      { dir: 'rooms', name: 'room-21-bedroom-c' },
  'domik444':               { dir: 'rooms', name: 'room-guesthouse' },
  'housetwentyone':         { dir: 'rooms', name: 'room-21-house' },
  'gostinica15':            { dir: 'rooms', name: 'room-15-exterior' },
  'gostinica16':            { dir: 'rooms', name: 'room-16-exterior' },
  'gostinica17':            { dir: 'rooms', name: 'room-17-exterior' },
  'gostinica18':            { dir: 'rooms', name: 'room-18-exterior' },
  '1srub-spal1et-v2':            { dir: 'rooms', name: 'srub-01-bedroom-floor1' },
  '1srub-spaln2et2-2row-v2-6000':{ dir: 'rooms', name: 'srub-01-bedroom-floor2-row2' },
  '1srub-spaln3et2-2row-v2-6000':{ dir: 'rooms', name: 'srub-01-bedroom-floor2-row3' },
  '1srub-spaln3et2-2row-v2-corr':{ dir: 'rooms', name: 'srub-01-corridor' },
  'srub-holl1et-v3-6000':        { dir: 'rooms', name: 'srub-hall-floor1' },
  'srub-holl1et-v3-6000-1':      { dir: 'rooms', name: 'srub-hall-floor1-b' },
  'srub-holl1et-v3-6000-2':      { dir: 'rooms', name: 'srub-hall-floor1-c' },
  'srub-spal1et-v2':             { dir: 'rooms', name: 'srub-bedroom-floor1' },
  'srub-spal1et-v2-1':           { dir: 'rooms', name: 'srub-bedroom-floor1-b' },
  'srub-spal1et-v2-2':           { dir: 'rooms', name: 'srub-bedroom-floor1-c' },
  'srub-spal1et-v2-3':           { dir: 'rooms', name: 'srub-bedroom-floor1-d' },
  'srub-spal1et-v2-4':           { dir: 'rooms', name: 'srub-bedroom-floor1-e' },
  'srub-spalnya':                { dir: 'rooms', name: 'srub-bedroom' },
  'spaln2et2-2row-v1-2':         { dir: 'rooms', name: 'srub-bedroom-floor2-row2-a' },
  'spaln2et2-2row-v1-4':         { dir: 'rooms', name: 'srub-bedroom-floor2-row2-b' },
  'spaln3et2-2row-v1-2':         { dir: 'rooms', name: 'srub-bedroom-floor2-row3-a' },
  'spaln3et2-2row-v1-4':         { dir: 'rooms', name: 'srub-bedroom-floor2-row3-b' },
  '19vip-spal3':                 { dir: 'rooms', name: 'room-19-vip-bedroom-c' },
  '12spal-2':                    { dir: 'rooms', name: 'room-12-bedroom-b' },
  'c1':                          { dir: 'rooms', name: 'cottage-01' },
  'c2':                          { dir: 'rooms', name: 'cottage-02' },
  'c3':                          { dir: 'rooms', name: 'cottage-03' },
  'c4':                          { dir: 'rooms', name: 'cottage-04' },
  'c5':                          { dir: 'rooms', name: 'cottage-05' },
  'c1-cover':                    { dir: 'rooms', name: 'cottage-01-cover' },
  'veranda9-1':                  { dir: 'rooms', name: 'room-09-veranda' },
  'steklashka-1':                { dir: 'rooms', name: 'steklashka-exterior' },
  'restoran-top':                { dir: 'restaurant', name: 'restaurant-panorama' },
  'restoran-etaj2':              { dir: 'restaurant', name: 'restaurant-floor2-a' },
  'restoran-etaj2-1':            { dir: 'restaurant', name: 'restaurant-floor2-b' },
  'panoram-rest':                { dir: 'restaurant', name: 'restaurant-pano' },
  'panoram-rest-cover':          { dir: 'restaurant', name: 'restaurant-cover' },
  'vhod':                        { dir: 'territory', name: 'entrance' },
  'dacha-slide1':                { dir: 'slides',    name: 'slide-01' },
  'dacha-slide2':                { dir: 'slides',    name: 'slide-02' },
  'dacha-slide3':                { dir: 'slides',    name: 'slide-03' },
  'dachamap':                    { dir: 'territory', name: 'map-old' },
  'dachatestmap':                { dir: 'territory', name: 'map' },
  'torosy':                      { dir: 'territory', name: 'toros-ice' },
  'beach_vata':                  { dir: 'territory', name: 'beach' },
  'dachi-61':                    { dir: 'territory', name: 'aerial-01' },
  'dachi-87':                    { dir: 'territory', name: 'aerial-02' },
  'dachi-96':                    { dir: 'territory', name: 'aerial-03' },
  'formsidebg':                  { dir: 'territory', name: 'form-sidebar-bg' },
  'about-3img':                  { dir: 'territory', name: 'about-photo' },
  'active':                      { dir: 'territory', name: 'active-rest' },
  'happy-children':              { dir: 'playground', name: 'happy-children' },
  'image-17-11-14-04-02-4':      { dir: 'territory', name: 'territory-photo' },
  'besedka1-ultrawide-pano-v1':  { dir: 'territory', name: 'gazebo-01-pano-a' },
  'besedka1-ultrawide-pano-v1-1':{ dir: 'territory', name: 'gazebo-01-pano-b' },
  'besedka2-ultrawide':          { dir: 'territory', name: 'gazebo-02-pano' },
  'ploshadka1':                  { dir: 'playground', name: 'playground-01' },
  'ploshadka1-1':                { dir: 'playground', name: 'playground-01-b' },
  'ploshadka2':                  { dir: 'playground', name: 'playground-02' },
  '1_cube_equi':                 { dir: 'panoramas', name: 'pano-cube-01' },
  '1_cube_equi-1':               { dir: 'panoramas', name: 'pano-cube-01-b' },
  '2_cube_equi':                 { dir: 'panoramas', name: 'pano-cube-02' },
  '2_cube_equi-1':               { dir: 'panoramas', name: 'pano-cube-02-b' },
  '3_cube_equi':                 { dir: 'panoramas', name: 'pano-cube-03' },
  '3_cube_equi-1':               { dir: 'panoramas', name: 'pano-cube-03-b' },
  '3_cube_equi-2':               { dir: 'panoramas', name: 'pano-cube-03-c' },
  'info-ico-2-200px':            { dir: 'icons', name: 'info-200px' },
  '3d-ico-200px':                { dir: 'icons', name: '3d-icon-200px' },
  '3d-ico-50px':                 { dir: 'icons', name: '3d-icon-50px' },
  'Bathtub_64px':                { dir: 'icons', name: 'bathtub-64px' },
};

// Добавляем img галерею
for (let i = 1; i <= 28; i++) {
  const n = String(i).padStart(2, '0');
  MAP[`${i}img`]   = { dir: 'rooms', name: `gallery-room-${n}` };
  MAP[`${i}img-1`] = { dir: 'rooms', name: `gallery-room-${n}-b` };
  MAP[`${i}img-2`] = { dir: 'rooms', name: `gallery-room-${n}-c` };
  MAP[`${i}img-3`] = { dir: 'rooms', name: `gallery-room-${n}-d` };
  MAP[`${i}img-4`] = { dir: 'rooms', name: `gallery-room-${n}-e` };
}

// Добавляем 4nomer
for (let i = 1; i <= 11; i++) {
  MAP[`4nomer-${i}`] = { dir: 'rooms', name: `room-04-${String(i).padStart(2,'0')}` };
}

// Instagram
const instagram = {
  '1238513420551483861':'instagram-01','1322437748048920155':'instagram-02',
  '1322437748048920155-1':'instagram-02b','1824817790272688617':'instagram-03',
  '1997802144620586773_1':'instagram-04','2002900320243317949':'instagram-05',
  '2081193530841036601':'instagram-06','2082746685244552888':'instagram-07',
  '2110937173860440032':'instagram-08','2204438296717905031':'instagram-09',
  '2443656811680101045':'instagram-10','2574911870633729851':'instagram-11',
  '2574911870633729851-1':'instagram-11b','2574911870633729851_1':'instagram-12',
  '2574911870633729851_1-1':'instagram-12b',
};
for (const [k,v] of Object.entries(instagram)) MAP[k] = { dir: 'social', name: v };

// Строим replacements: "OLDBASE[-suffix].EXT" → "images/CAT/NEWNAME[-suffix].EXT"
// Сортируем по убыванию длины ключа чтобы более длинные заменялись первыми
const entries = Object.entries(MAP).sort((a,b) => b[0].length - a[0].length);

function patchHtml(content) {
  let changed = false;
  for (const [oldBase, { dir, name }] of entries) {
    // Ищем: "uploads/" + oldBase + суффикс_размера + "." + ext
    // Суффикс: может быть "-NNNxNNN", "-NNNxNNN-2", "-scaled", "-e12345", или пустой
    const escaped = oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Граница: после "uploads/" и перед кавычкой/пробелом/закрывающим символом
    const rx = new RegExp(
      '((?:wp-content/)?uploads/)' + escaped + '((?:-\\d+x\\d+)?(?:-\\d+)?(?:-scaled)?(?:-e\\d+)?)(\\.[a-zA-Z]+)',
      'g'
    );
    const next = content.replace(rx, (m, pre, suffix, ext) => {
      changed = true;
      return pre + 'images/' + dir + '/' + name + suffix + ext.toLowerCase();
    });
    if (next !== content) content = next;
  }
  return { content, changed };
}

function findHtmlFiles(dir, skip = ['wp-content']) {
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

const htmlFiles = findHtmlFiles(STATIC);
let patched = 0;

for (const f of htmlFiles) {
  const raw = fs.readFileSync(f, 'utf8');
  const { content, changed } = patchHtml(raw);
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Patched:', path.relative(STATIC, f));
    patched++;
  }
}

console.log('\nTotal patched:', patched, 'HTML files');
