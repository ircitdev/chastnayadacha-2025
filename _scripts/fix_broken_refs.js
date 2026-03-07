/**
 * Перескачиваем страницы с живого сайта и заменяем только те HTML файлы
 * где остались сломанные ссылки без расширения (about13, rest15 и т.п.)
 * Применяем только URL-фикс (абсолютные → относительные), image renames не трогаем
 * (потому что year-folder файлы в 2021/ не переименовывались).
 */

const fs    = require('fs');
const path  = require('path');

const STATIC = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

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

// Таблица переименований root-uploads → images/ (только те что НЕ в year-папках)
const RENAMES = [
  ['room7-3mestn',          'images/rooms/room-07-triple'],
  ['room9-1',               'images/rooms/room-09-b'],
  ['room9',                 'images/rooms/room-09-a'],
  ['room12-1',              'images/rooms/room-12-exterior'],
  ['room12-spal',           'images/rooms/room-12-bedroom'],
  ['room12',                'images/rooms/room-12-living'],
  ['room17-gostin-1',       'images/rooms/room-17-living'],
  ['room17-s1',             'images/rooms/room-17-bedroom-a'],
  ['room17-spaln1',         'images/rooms/room-17-bedroom-b'],
  ['room17-spalna2-nolight','images/rooms/room-17-bedroom-c'],
  ['room19-spal3-1',        'images/rooms/room-19-bedroom-b'],
  ['room19-spal3-2',        'images/rooms/room-19-bedroom-c'],
  ['room19-spal3-3',        'images/rooms/room-19-bedroom-d'],
  ['room19-spal3',          'images/rooms/room-19-bedroom-a'],
  ['vip15-spaln1et-v2',     'images/rooms/room-15-vip-bedroom-a'],
  ['vip15-spaln1etaj2',     'images/rooms/room-15-vip-bedroom-b'],
  ['vip15spaln1et-v2',      'images/rooms/room-15-vip-bedroom-c'],
  ['vip19-gostin-1',        'images/rooms/room-19-vip-living-b'],
  ['vip19-gostin-2',        'images/rooms/room-19-vip-living-c'],
  ['vip19-gostin',          'images/rooms/room-19-vip-living-a'],
  ['vip19-spaln2',          'images/rooms/room-19-vip-bedroom-a'],
  ['vip19-spalna1',         'images/rooms/room-19-vip-bedroom-b'],
  ['preview-vip19-spalna1', 'images/rooms/room-19-vip-preview'],
  ['vip-room18-spalna2',    'images/rooms/room-18-vip-bedroom'],
  ['dom16prostovanna-1',    'images/rooms/room-16-bathroom-b'],
  ['dom16prostovanna',      'images/rooms/room-16-bathroom-a'],
  ['dom21-gostin',          'images/rooms/room-21-living'],
  ['dom21-spaln1-v1-1',     'images/rooms/room-21-bedroom-b'],
  ['dom21-spaln1-v1-2',     'images/rooms/room-21-bedroom-c'],
  ['dom21-spaln1-v1',       'images/rooms/room-21-bedroom-a'],
  ['dom21',                 'images/rooms/room-21-exterior'],
  ['domik444',              'images/rooms/room-guesthouse'],
  ['housetwentyone',        'images/rooms/room-21-house'],
  ['gostinica15',           'images/rooms/room-15-exterior'],
  ['gostinica16',           'images/rooms/room-16-exterior'],
  ['gostinica17',           'images/rooms/room-17-exterior'],
  ['gostinica18',           'images/rooms/room-18-exterior'],
  ['1srub-spal1et-v2',              'images/rooms/srub-01-bedroom-floor1'],
  ['1srub-spaln2et2-2row-v2-6000',  'images/rooms/srub-01-bedroom-floor2-row2'],
  ['1srub-spaln3et2-2row-v2-6000',  'images/rooms/srub-01-bedroom-floor2-row3'],
  ['1srub-spaln3et2-2row-v2-corr',  'images/rooms/srub-01-corridor'],
  ['srub-holl1et-v3-6000-1',        'images/rooms/srub-hall-floor1-b'],
  ['srub-holl1et-v3-6000-2',        'images/rooms/srub-hall-floor1-c'],
  ['srub-holl1et-v3-6000',          'images/rooms/srub-hall-floor1'],
  ['srub-spal1et-v2-1',             'images/rooms/srub-bedroom-floor1-b'],
  ['srub-spal1et-v2-2',             'images/rooms/srub-bedroom-floor1-c'],
  ['srub-spal1et-v2-3',             'images/rooms/srub-bedroom-floor1-d'],
  ['srub-spal1et-v2-4',             'images/rooms/srub-bedroom-floor1-e'],
  ['srub-spal1et-v2',               'images/rooms/srub-bedroom-floor1'],
  ['srub-spalnya',                  'images/rooms/srub-bedroom'],
  ['spaln2et2-2row-v1-2',           'images/rooms/srub-bedroom-floor2-row2-a'],
  ['spaln2et2-2row-v1-4',           'images/rooms/srub-bedroom-floor2-row2-b'],
  ['spaln3et2-2row-v1-2',           'images/rooms/srub-bedroom-floor2-row3-a'],
  ['spaln3et2-2row-v1-4',           'images/rooms/srub-bedroom-floor2-row3-b'],
  ['19vip-spal3',                   'images/rooms/room-19-vip-bedroom-c'],
  ['12spal-2',                      'images/rooms/room-12-bedroom-b'],
  ['c1-cover',                      'images/rooms/cottage-01-cover'],
  ['c1','images/rooms/cottage-01'],['c2','images/rooms/cottage-02'],
  ['c3','images/rooms/cottage-03'],['c4','images/rooms/cottage-04'],
  ['c5','images/rooms/cottage-05'],
  ['veranda9-1',                    'images/rooms/room-09-veranda'],
  ['steklashka-1',                  'images/rooms/steklashka-exterior'],
  ['restoran-top',                  'images/restaurant/restaurant-panorama'],
  ['restoran-etaj2-1',              'images/restaurant/restaurant-floor2-b'],
  ['restoran-etaj2',                'images/restaurant/restaurant-floor2-a'],
  ['panoram-rest-cover',            'images/restaurant/restaurant-cover'],
  ['panoram-rest',                  'images/restaurant/restaurant-pano'],
  ['vhod',                          'images/territory/entrance'],
  ['dacha-slide1','images/slides/slide-01'],
  ['dacha-slide2','images/slides/slide-02'],
  ['dacha-slide3','images/slides/slide-03'],
  ['dachamap',                      'images/territory/map-old'],
  ['dachatestmap',                  'images/territory/map'],
  ['torosy',                        'images/territory/toros-ice'],
  ['beach_vata',                    'images/territory/beach'],
  ['dachi-61','images/territory/aerial-01'],
  ['dachi-87','images/territory/aerial-02'],
  ['dachi-96','images/territory/aerial-03'],
  ['formsidebg',                    'images/territory/form-sidebar-bg'],
  ['about-3img',                    'images/territory/about-photo'],
  ['active',                        'images/territory/active-rest'],
  ['happy-children',                'images/playground/happy-children'],
  ['image-17-11-14-04-02-4',        'images/territory/territory-photo'],
  ['besedka1-ultrawide-pano-v1-1',  'images/territory/gazebo-01-pano-b'],
  ['besedka1-ultrawide-pano-v1',    'images/territory/gazebo-01-pano-a'],
  ['besedka2-ultrawide',            'images/territory/gazebo-02-pano'],
  ['ploshadka1-1',                  'images/playground/playground-01-b'],
  ['ploshadka1',                    'images/playground/playground-01'],
  ['ploshadka2',                    'images/playground/playground-02'],
  ['1_cube_equi-1','images/panoramas/pano-cube-01-b'],
  ['1_cube_equi',  'images/panoramas/pano-cube-01'],
  ['2_cube_equi-1','images/panoramas/pano-cube-02-b'],
  ['2_cube_equi',  'images/panoramas/pano-cube-02'],
  ['3_cube_equi-1','images/panoramas/pano-cube-03-b'],
  ['3_cube_equi-2','images/panoramas/pano-cube-03-c'],
  ['3_cube_equi',  'images/panoramas/pano-cube-03'],
  ['info-ico-2-200px', 'images/icons/info-200px'],
  ['3d-ico-200px',     'images/icons/3d-icon-200px'],
  ['3d-ico-50px',      'images/icons/3d-icon-50px'],
  ['Bathtub_64px',     'images/icons/bathtub-64px'],
];
for (let i = 1; i <= 28; i++) {
  const n = String(i).padStart(2,'0');
  RENAMES.push([`${i}img-1`, `images/rooms/gallery-room-${n}-b`]);
  RENAMES.push([`${i}img-2`, `images/rooms/gallery-room-${n}-c`]);
  RENAMES.push([`${i}img-3`, `images/rooms/gallery-room-${n}-d`]);
  RENAMES.push([`${i}img-4`, `images/rooms/gallery-room-${n}-e`]);
  RENAMES.push([`${i}img`,   `images/rooms/gallery-room-${n}`]);
}
for (let i = 1; i <= 11; i++) RENAMES.push([`4nomer-${i}`, `images/rooms/room-04-${String(i).padStart(2,'0')}`]);

function get(url) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    https.request({ hostname: opts.hostname, path: opts.pathname, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400) return resolve(get(res.headers.location));
      const chunks = []; res.on('data', d => chunks.push(d)); res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject).end();
  });
}

function applyUrlFix(html, depth) {
  const p = depth === 0 ? './' : '../'.repeat(depth);
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-content\/[^"'<\s)]+)/g, (m,x) => p+x);
  html = html.replace(/https:\/\/chastnayadacha\.ru\/(wp-includes\/[^"'<\s)]+)/g, (m,x) => p+x);
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-content\\\/([^"'\\]+)/g, (m,x) => p+'wp-content/'+x.replace(/\\\//g,'/'));
  html = html.replace(/https:\\\/\\\/chastnayadacha\.ru\\\/wp-includes\\\/([^"'\\]+)/g, (m,x) => p+'wp-includes/'+x.replace(/\\\//g,'/'));
  return html;
}

function applyRenames(html) {
  for (const [oldBase, newPath] of RENAMES) {
    const esc = oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp('((?:wp-content/)?uploads/)' + esc + '((?:-\\d+x\\d+)?(?:-\\d+)?(?:-scaled)?(?:-e\\d+)?)(\\.[a-zA-Z]+)', 'g'),
      (m, pre, suf, ext) => pre + newPath + suf + ext.toLowerCase()
    );
  }
  return html;
}



(async () => {
  console.log('Downloading', PAGES.length, 'pages...');
  for (const { url, depth, local } of PAGES) {
    process.stdout.write('.');
    try {
      let html = await get(url);
      html = applyUrlFix(html, depth);
      html = applyRenames(html);
      const p = path.join(STATIC, local);
      require('fs').mkdirSync(path.dirname(p), { recursive: true });
      require('fs').writeFileSync(p, html, 'utf8');
    } catch(e) { console.error('\nFail:', url, e.message); }
  }
  console.log('\nDone.');

  // Проверяем оставшиеся сломанные ссылки
  const { execSync } = require('child_process');
  const broken = execSync(
    'grep -roh "uploads/2021/09/[a-z][^.\"\'<> )]*[0-9][\"\'<> ]" ' +
    '"D:/DevTools/Database/2026chastnayadacha.ru/static" --include="*.html" 2>/dev/null || true'
  ).toString().trim();
  console.log('\nStill broken:\n', broken || 'none');
})();
