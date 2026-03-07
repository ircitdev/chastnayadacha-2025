/**
 * Реорганизация изображений: переименование + раскладка по папкам в /images/
 * Все пути в HTML/JSON/CSS обновляются автоматически.
 *
 * Структура:
 *   images/
 *     rooms/           - номера и домики
 *     restaurant/      - ресторан
 *     territory/       - территория, общие виды
 *     playground/      - детская площадка, пляж
 *     panoramas/       - панорамные снимки (широкие, 360°)
 *     icons/           - иконки ui
 *     slides/          - слайдеры на главной
 *     social/          - instagram / socseti
 *     misc/            - всё остальное
 */

const fs   = require('fs');
const path = require('path');

const UPLOADS = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const IMAGES  = UPLOADS + '/images';
const STATIC  = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

// ─── Таблица переименования ───────────────────────────────────────────────────
// Формат: 'старое_имя (без -NNNxNNN/-scaled)': { dir, name }
// dir — папка внутри images/
// name — новое базовое имя (без расширения)
// Файлы с суффиксом размера (-300x225 и т.п.) будут скопированы/переименованы автоматически.

const MAP = {
  // ── Комнаты / номера ──────────────────────────────────────────────────────
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
  '4nomer-1':               { dir: 'rooms', name: 'room-04-01' },
  '4nomer-2':               { dir: 'rooms', name: 'room-04-02' },
  '4nomer-3':               { dir: 'rooms', name: 'room-04-03' },
  '4nomer-4':               { dir: 'rooms', name: 'room-04-04' },
  '4nomer-5':               { dir: 'rooms', name: 'room-04-05' },
  '4nomer-6':               { dir: 'rooms', name: 'room-04-06' },
  '4nomer-7':               { dir: 'rooms', name: 'room-04-07' },
  '4nomer-8':               { dir: 'rooms', name: 'room-04-08' },
  '4nomer-9':               { dir: 'rooms', name: 'room-04-09' },
  '4nomer-10':              { dir: 'rooms', name: 'room-04-10' },
  '4nomer-11':              { dir: 'rooms', name: 'room-04-11' },

  // Срубы (log houses)
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

  // Стеклянный домик
  'steklashka-1':   { dir: 'rooms', name: 'steklashka-exterior' },

  // ── Ресторан ──────────────────────────────────────────────────────────────
  'restoran-top':       { dir: 'restaurant', name: 'restaurant-panorama' },
  'restoran-etaj2':     { dir: 'restaurant', name: 'restaurant-floor2-a' },
  'restoran-etaj2-1':   { dir: 'restaurant', name: 'restaurant-floor2-b' },
  'panoram-rest':       { dir: 'restaurant', name: 'restaurant-pano' },
  'panoram-rest-cover': { dir: 'restaurant', name: 'restaurant-cover' },

  // ── Территория / общие виды ───────────────────────────────────────────────
  'vhod':                 { dir: 'territory', name: 'entrance' },
  'dacha-slide1':         { dir: 'slides',    name: 'slide-01' },
  'dacha-slide2':         { dir: 'slides',    name: 'slide-02' },
  'dacha-slide3':         { dir: 'slides',    name: 'slide-03' },
  'dachamap':             { dir: 'territory', name: 'map-old' },
  'dachatestmap':         { dir: 'territory', name: 'map' },
  'torosy':               { dir: 'territory', name: 'toros-ice' },
  'beach_vata':           { dir: 'territory', name: 'beach' },
  'dachi-61':             { dir: 'territory', name: 'aerial-01' },
  'dachi-87':             { dir: 'territory', name: 'aerial-02' },
  'dachi-96':             { dir: 'territory', name: 'aerial-03' },
  'formsidebg':           { dir: 'territory', name: 'form-sidebar-bg' },
  'about-3img':           { dir: 'territory', name: 'about-photo' },
  'active':               { dir: 'territory', name: 'active-rest' },
  'happy-children':       { dir: 'playground', name: 'happy-children' },
  'image-17-11-14-04-02-4': { dir: 'territory', name: 'territory-photo' },

  // dacha_na_volge серия (большая фотосессия территории)
  'dacha_na_volge-01102021-0004': { dir: 'territory', name: 'photo-2021-10-01-04' },
  'dacha_na_volge-01102021-0005': { dir: 'territory', name: 'photo-2021-10-01-05' },
  'dacha_na_volge-01102021-0006': { dir: 'territory', name: 'photo-2021-10-01-06' },
  'dacha_na_volge-01102021-0007': { dir: 'territory', name: 'photo-2021-10-01-07' },
  'dacha_na_volge-01102021-0008': { dir: 'territory', name: 'photo-2021-10-01-08' },
  'dacha_na_volge-01102021-0008-1': { dir: 'territory', name: 'photo-2021-10-01-08b' },
  'dacha_na_volge-01102021-0009': { dir: 'territory', name: 'photo-2021-10-01-09' },
  'dacha_na_volge-01102021-0010': { dir: 'territory', name: 'photo-2021-10-01-10' },
  'dacha_na_volge-01102021-0011': { dir: 'territory', name: 'photo-2021-10-01-11' },
  'dacha_na_volge-01102021-0012': { dir: 'territory', name: 'photo-2021-10-01-12' },
  'dacha_na_volge-01102021-0013': { dir: 'territory', name: 'photo-2021-10-01-13' },
  'dacha_na_volge-01102021-0014': { dir: 'territory', name: 'photo-2021-10-01-14' },
  'dacha_na_volge-01102021-0015': { dir: 'territory', name: 'photo-2021-10-01-15' },
  'dacha_na_volge-01102021-0016': { dir: 'territory', name: 'photo-2021-10-01-16' },
  'dacha_na_volge-01102021-0017': { dir: 'territory', name: 'photo-2021-10-01-17' },
  'dacha_na_volge-01102021-0018': { dir: 'territory', name: 'photo-2021-10-01-18' },
  'dacha_na_volge-01102021-0019': { dir: 'territory', name: 'photo-2021-10-01-19' },
  'dacha_na_volge-01102021-0020': { dir: 'territory', name: 'photo-2021-10-01-20' },
  'dacha_na_volge-01102021-0021': { dir: 'territory', name: 'photo-2021-10-01-21' },
  'dacha_na_volge-01102021-0022': { dir: 'territory', name: 'photo-2021-10-01-22' },
  'dacha_na_volge-01102021-0023': { dir: 'territory', name: 'photo-2021-10-01-23' },
  'dacha_na_volge-01102021-0024': { dir: 'territory', name: 'photo-2021-10-01-24' },
  'dacha_na_volge-01102021-0025': { dir: 'territory', name: 'photo-2021-10-01-25' },
  'dacha_na_volge-01102021-0026': { dir: 'territory', name: 'photo-2021-10-01-26' },
  'dacha_na_volge-01102021-0027': { dir: 'territory', name: 'photo-2021-10-01-27' },
  'dacha_na_volge-01102021-0028': { dir: 'territory', name: 'photo-2021-10-01-28' },
  'dacha_na_volge-01102021-0029': { dir: 'territory', name: 'photo-2021-10-01-29' },
  'dacha_na_volge-01102021-0030': { dir: 'territory', name: 'photo-2021-10-01-30' },
  'dacha_na_volge-01102021-0031': { dir: 'territory', name: 'photo-2021-10-01-31' },
  'dacha_na_volge-01102021-0032': { dir: 'territory', name: 'photo-2021-10-01-32' },
  'dacha_na_volge-01102021-0033': { dir: 'territory', name: 'photo-2021-10-01-33' },
  'dacha_na_volge-01102021-0034': { dir: 'territory', name: 'photo-2021-10-01-34' },
  'dacha_na_volge-01102021-0035': { dir: 'territory', name: 'photo-2021-10-01-35' },
  'dacha_na_volge-01102021-0036': { dir: 'territory', name: 'photo-2021-10-01-36' },
  'dacha_na_volge-01102021-0037': { dir: 'territory', name: 'photo-2021-10-01-37' },
  'dacha_na_volge-05102021-0002': { dir: 'territory', name: 'photo-2021-10-05-02' },
  'dacha_na_volge-05102021-0003': { dir: 'territory', name: 'photo-2021-10-05-03' },
  'dacha_na_volge-05102021-0004': { dir: 'territory', name: 'photo-2021-10-05-04' },
  'dacha_na_volge-05102021-0006': { dir: 'territory', name: 'photo-2021-10-05-06' },
  'dacha_na_volge-05102021-0007': { dir: 'territory', name: 'photo-2021-10-05-07' },
  'dacha_na_volge-05102021-0008': { dir: 'territory', name: 'photo-2021-10-05-08' },
  'dacha_na_volge-05102021-0009': { dir: 'territory', name: 'photo-2021-10-05-09' },
  'dacha_na_volge-05102021-0011': { dir: 'territory', name: 'photo-2021-10-05-11' },
  'dacha_na_volge-05102021-0012': { dir: 'territory', name: 'photo-2021-10-05-12' },
  'dacha_na_volge-05102021-0013': { dir: 'territory', name: 'photo-2021-10-05-13' },
  'dacha_na_volge-05102021-0014': { dir: 'territory', name: 'photo-2021-10-05-14' },
  'dacha_na_volge-05102021-0015': { dir: 'territory', name: 'photo-2021-10-05-15' },
  'dacha_na_volge-18092021-0095': { dir: 'territory', name: 'photo-2021-09-18-95' },
  'dacha_na_volge-18092021-0098': { dir: 'territory', name: 'photo-2021-09-18-98' },
  'dacha_na_volge-18092021-0109': { dir: 'territory', name: 'photo-2021-09-18-109' },

  // ── Беседки ───────────────────────────────────────────────────────────────
  'besedka1-ultrawide-pano-v1':   { dir: 'territory', name: 'gazebo-01-pano-a' },
  'besedka1-ultrawide-pano-v1-1': { dir: 'territory', name: 'gazebo-01-pano-b' },
  'besedka2-ultrawide':           { dir: 'territory', name: 'gazebo-02-pano' },

  // ── Детская площадка ──────────────────────────────────────────────────────
  'ploshadka1':   { dir: 'playground', name: 'playground-01' },
  'ploshadka1-1': { dir: 'playground', name: 'playground-01-b' },
  'ploshadka2':   { dir: 'playground', name: 'playground-02' },

  // ── Панорамы 360° / кубические ────────────────────────────────────────────
  '1_cube_equi':   { dir: 'panoramas', name: 'pano-cube-01' },
  '1_cube_equi-1': { dir: 'panoramas', name: 'pano-cube-01-b' },
  '2_cube_equi':   { dir: 'panoramas', name: 'pano-cube-02' },
  '2_cube_equi-1': { dir: 'panoramas', name: 'pano-cube-02-b' },
  '3_cube_equi':   { dir: 'panoramas', name: 'pano-cube-03' },
  '3_cube_equi-1': { dir: 'panoramas', name: 'pano-cube-03-b' },
  '3_cube_equi-2': { dir: 'panoramas', name: 'pano-cube-03-c' },

  // ── Иконки / UI ───────────────────────────────────────────────────────────
  'info-ico-2-200px':  { dir: 'icons', name: 'info-200px' },
  '3d-ico-200px':      { dir: 'icons', name: '3d-icon-200px' },
  '3d-ico-50px':       { dir: 'icons', name: '3d-icon-50px' },
  'Bathtub_64px':      { dir: 'icons', name: 'bathtub-64px' },

  // ── Социальные сети (Instagram) ───────────────────────────────────────────
  // Длинные числовые имена — Instagram ID
  '1238513420551483861':    { dir: 'social', name: 'instagram-01' },
  '1322437748048920155':    { dir: 'social', name: 'instagram-02' },
  '1322437748048920155-1':  { dir: 'social', name: 'instagram-02b' },
  '1824817790272688617':    { dir: 'social', name: 'instagram-03' },
  '1997802144620586773_1':  { dir: 'social', name: 'instagram-04' },
  '2002900320243317949':    { dir: 'social', name: 'instagram-05' },
  '2081193530841036601':    { dir: 'social', name: 'instagram-06' },
  '2082746685244552888':    { dir: 'social', name: 'instagram-07' },
  '2110937173860440032':    { dir: 'social', name: 'instagram-08' },
  '2204438296717905031':    { dir: 'social', name: 'instagram-09' },
  '2443656811680101045':    { dir: 'social', name: 'instagram-10' },
  '2574911870633729851':    { dir: 'social', name: 'instagram-11' },
  '2574911870633729851-1':  { dir: 'social', name: 'instagram-11b' },
  '2574911870633729851_1':  { dir: 'social', name: 'instagram-12' },
  '2574911870633729851_1-1':{ dir: 'social', name: 'instagram-12b' },
};

// Числовые имена (01..28img серии) — галерея номеров
// Определяем автоматически
for (let i = 1; i <= 28; i++) {
  const n = String(i).padStart(2, '0');
  if (!MAP[`${i}img`]) MAP[`${i}img`] = { dir: 'rooms', name: `gallery-room-${n}` };
  if (!MAP[`${i}img-1`]) MAP[`${i}img-1`] = { dir: 'rooms', name: `gallery-room-${n}-b` };
  if (!MAP[`${i}img-2`]) MAP[`${i}img-2`] = { dir: 'rooms', name: `gallery-room-${n}-c` };
  if (!MAP[`${i}img-3`]) MAP[`${i}img-3`] = { dir: 'rooms', name: `gallery-room-${n}-d` };
  if (!MAP[`${i}img-4`]) MAP[`${i}img-4`] = { dir: 'rooms', name: `gallery-room-${n}-e` };
}

// Безымянные числа 01-09, 1-3 и т.п. — общие фото территории
const numericNames = ['01','02','03','04','05','05-1','06','07','08','09',
                      '1','1-1','2','2-1','3','3-1','8','9-1','10','11','12','12-1',
                      '19-2','55','3951'];
numericNames.forEach((n, i) => {
  if (!MAP[n]) MAP[n] = { dir: 'territory', name: `photo-${String(i+1).padStart(2,'0')}-${n}` };
});

// IMG_xxxx серия — оригинальные фото с камеры
// Разбиваем на территорию / номера по диапазонам (эвристически)
[
  'DSC00975','DSC00980','DSC01149',
  'SAM2104','SAM2118',
].forEach(n => { if (!MAP[n]) MAP[n] = { dir: 'territory', name: n.toLowerCase() }; });

[
  'IMG_0016','IMG_0126','IMG_0126-scaled-e1655463240811',
  'IMG_0157','IMG_0286','IMG_0312','IMG_0328','IMG_0371','IMG_0376','IMG_0380',
  'IMG_0391','IMG_0392','IMG_0398','IMG_0414','IMG_0434','IMG_0446','IMG_0452',
  'IMG_0712','IMG_0839','IMG_0844','IMG_0852','IMG_1051','IMG_1115','IMG_1718',
  'IMG_1740.JPG','IMG_1848','IMG_1851','IMG_1854','IMG_1855','IMG_1939','IMG_1943',
  'IMG_1947','IMG_1951',
].forEach(n => {
  const key = n.replace('.JPG','');
  if (!MAP[key]) MAP[key] = { dir: 'territory', name: 'photo-' + key.replace('IMG_','').toLowerCase() };
});

[
  'IMG_20211105_174148','IMG_20211105_174202','IMG_20211105_174215',
  'IMG_20211105_175826','IMG_20211105_175859','IMG_20211105_183038',
  'IMG_20211105_190648','IMG_20211105_194018','IMG_20211105_194031',
  'IMG_20211120_132057','IMG_20211120_132106','IMG_20211120_135628',
  'IMG_20211120_135713','IMG_20211120_135757','IMG_20211120_135803',
  'IMG_20211120_140322',
].forEach(n => {
  const date = n.replace('IMG_','').replace(/_/g,'-');
  if (!MAP[n]) MAP[n] = { dir: 'territory', name: 'photo-' + date.toLowerCase() };
});

[
  'IMG_2053','IMG_2053-scaled-e1655462088111',
  'IMG_2059','IMG_2103','IMG_2103-scaled-e1655462809361',
  'IMG_2128','IMG_2128-scaled-e1655462256627',
  'IMG_2330','IMG_2331','IMG_2352','IMG_2408','IMG_2429','IMG_2481',
  'IMG_2549','IMG_2550','IMG_2551','IMG_2552','IMG_2554','IMG_2555',
  'IMG_2557','IMG_2558','IMG_2560','IMG_2561','IMG_2562','IMG_2562-1',
  'IMG_2563','IMG_2565','IMG_2568','IMG_2572',
].forEach(n => {
  if (!MAP[n]) MAP[n] = { dir: 'rooms', name: 'photo-' + n.replace('IMG_','').toLowerCase() };
});

[
  'IMG_3197','IMG_5383','IMG_5835','IMG_6073','IMG_6088','IMG_6090',
  'IMG_6097','IMG_6099','IMG_7050','IMG_7062','IMG_8230','IMG_8231-1',
  'IMG_8232','IMG_8330-1','IMG_8341-1','IMG_9935','IMG_9978','IMG_9987','IMG_9991',
].forEach(n => {
  if (!MAP[n]) MAP[n] = { dir: 'territory', name: 'photo-' + n.replace('IMG_','').toLowerCase() };
});

// Image01..Image16 (с заглавной)
for (let i = 1; i <= 16; i++) {
  const key = 'Image' + String(i).padStart(2,'0');
  if (!MAP[key]) MAP[key] = { dir: 'territory', name: 'photo-image-' + String(i).padStart(2,'0') };
}

// photo_2022 серия
[
  'photo_2022-06-17-12.06.58','photo_2022-06-17-12.07.02','photo_2022-06-17-12.07.05',
  'photo_2022-06-17-12.20.06','photo_2022-06-17-12.20.09',
  'photo_2022-06-17-13.24.21','photo_2022-06-17-13.24.39',
  'photo_2022-06-17_13-49-03','photo_2022-06-17_14-10-11',
].forEach((n, i) => {
  if (!MAP[n]) MAP[n] = { dir: 'territory', name: 'photo-2022-06-17-' + String(i+1).padStart(2,'0') };
});

// ─── Конец таблицы ────────────────────────────────────────────────────────────

// Создаём директории
const DIRS = ['rooms','restaurant','territory','playground','panoramas','icons','slides','social','misc'];
DIRS.forEach(d => {
  const p = path.join(IMAGES, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Функция: получить базовое имя файла (без суффиксов размера и расширения)
function getBaseName(filename) {
  const noExt = filename.replace(/\.[a-zA-Z]+$/, '');
  // Убрать -NNNxNNN суффикс
  return noExt.replace(/-\d+x\d+$/, '').replace(/-scaled$/, '').replace(/-e\d+$/, '');
}

// Читаем все файлы из uploads (только в корне, не в подпапках)
const uploadsFiles = fs.readdirSync(UPLOADS).filter(f => {
  const stat = fs.statSync(path.join(UPLOADS, f));
  if (stat.isDirectory()) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f);
});

// Строим карту переименований: старый путь → новый путь
const renames = []; // { from, to, oldRel, newRel }
const unmapped = [];

for (const filename of uploadsFiles) {
  const base = getBaseName(filename);
  const ext  = filename.match(/\.[a-zA-Z]+$/)?.[0]?.toLowerCase() || '';

  if (!MAP[base]) {
    unmapped.push(filename);
    continue;
  }

  const { dir, name } = MAP[base];

  // Суффикс размера (если есть)
  const noExt = filename.replace(/\.[a-zA-Z]+$/, '');
  const suffix = noExt.slice(base.length); // e.g. '-300x225' or '' or '-scaled'

  const newName = name + suffix + ext;
  const from = path.join(UPLOADS, filename);
  const to   = path.join(IMAGES, dir, newName);

  // Относительные пути от /tur/ глубины 2 (../wp-content/uploads/...)
  const oldRel = filename;  // относительно uploads/
  const newRel = 'images/' + dir + '/' + newName;

  renames.push({ from, to, oldRel, newRel });
}

console.log('Files to rename/move:', renames.length);
console.log('Unmapped files:', unmapped.length);
if (unmapped.length > 0) {
  console.log('Unmapped (will go to misc/):');
  unmapped.slice(0, 20).forEach(f => console.log(' ', f));
  if (unmapped.length > 20) console.log('  ... and', unmapped.length - 20, 'more');
}

// Переносим unmapped → misc/
for (const filename of unmapped) {
  const from = path.join(UPLOADS, filename);
  const to   = path.join(IMAGES, 'misc', filename.toLowerCase());
  renames.push({ from, to, oldRel: filename, newRel: 'images/misc/' + filename.toLowerCase() });
}

// Выполняем копирование (не удаление — чтобы не сломать старые ссылки пока не пропатчим)
let copied = 0;
for (const { from, to } of renames) {
  if (!fs.existsSync(from)) continue;
  if (fs.existsSync(to)) { copied++; continue; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied++;
}
console.log('\nCopied', copied, 'files to images/');

// Обновляем все HTML/JSON/CSS файлы
// Строим map: старый basename → новый путь relative to uploads/
// В файлах пути имеют вид: ../wp-content/uploads/FILENAME или wp-content/uploads/FILENAME
const replacements = new Map();
for (const { oldRel, newRel } of renames) {
  // Нормализуем - ключ = именно то что стоит после "uploads/"
  replacements.set(oldRel, newRel);
}

function patchContent(content) {
  let changed = false;
  for (const [oldRel, newRel] of replacements) {
    if (content.includes(oldRel)) {
      // Заменяем точно (с границами - не заменяем подстроки)
      const escaped = oldRel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped, 'g');
      const next = content.replace(rx, newRel);
      if (next !== content) { content = next; changed = true; }
    }
  }
  return { content, changed };
}

function patchDir(dirPath, exts) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let total = 0;
  for (const e of entries) {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) {
      total += patchDir(full, exts);
    } else if (exts.some(x => e.name.endsWith(x))) {
      const content = fs.readFileSync(full, 'utf8');
      const { content: patched, changed } = patchContent(content);
      if (changed) {
        fs.writeFileSync(full, patched, 'utf8');
        console.log('Patched:', path.relative(STATIC, full));
        total++;
      }
    }
  }
  return total;
}

console.log('\nPatching HTML/JSON/CSS files...');
const totalPatched = patchDir(STATIC, ['.html', '.json', '.css']);
console.log('Total patched files:', totalPatched);

// Удаляем оригиналы из uploads/ (только те что успешно скопированы)
let deleted = 0;
for (const { from, to } of renames) {
  if (fs.existsSync(from) && fs.existsSync(to)) {
    fs.unlinkSync(from);
    deleted++;
  }
}
console.log('Deleted originals:', deleted);
console.log('\nDone! Images are now in:', IMAGES);
