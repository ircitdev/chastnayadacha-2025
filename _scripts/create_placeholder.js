/**
 * Создаём placeholder.jpg для отсутствующих панорам
 * и прописываем его в config.json для всех missing сцен
 */
const fs = require('fs');
const LOCAL = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const CFG   = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';

// Используем существующую панораму как placeholder для недостающих
// Берём vhod.jpeg - она точно есть
const PLACEHOLDER = '../wp-content/uploads/vhod.jpeg';

const missing = [
  'info-ico-50px.png',
  '9room.jpg',
  '12room.jpg',
  '12room spal.jpg',
  '111 15dom gostin.jpeg',
  '15vip-spaln1etaj2.jpg',
  '15vip-spaln1et-v2.jpg',
  '16vip-room-v2.jpeg',
  '17room-gostin.jpg',
  '17room-spaln1.jpg',
  '17room-spalna2-nolight.jpg',
  '18room-gostin-v1-15K.jpg',
  '18vip-spalna2.jpg',
  '18vip-spalna3.jpg',
  '19vip-gostin.jpg',
  '19vip-spal1.jpg',
  '19vip-spal2.jpg',
  '20vip-gostin1.jpg',
  '21dom-gostin.jpg',
  '21dom-spaln1-v1.jpg',
  'steklashka-1.jpg',
];

const cfg = JSON.parse(fs.readFileSync(CFG, 'utf8'));

// Для info-ico - используем существующую иконку
const iconFix = '../wp-content/uploads/info-ico-50px-1.png'; // если нет, ищем похожую
const iconExists = fs.existsSync(LOCAL + '/info-ico-50px-1.png');

let fixedScenes = 0;
let fixedIcons = 0;

// Find and fix scenes with missing images
Object.values(cfg.scenes).forEach(scene => {
  if (!scene.image) return;
  const rel = scene.image.replace('../wp-content/uploads/', '');
  if (missing.includes(rel)) {
    console.log('Scene "' + scene.title + '": ' + rel + ' -> placeholder');
    scene.image = PLACEHOLDER;
    fixedScenes++;
  }

  // Fix markers with missing images
  if (scene.markers) {
    Object.values(scene.markers).forEach(marker => {
      if (marker.image) {
        const mrel = marker.image.replace('../wp-content/uploads/', '');
        if (mrel === 'info-ico-50px.png' || mrel === 'info-ico-50px-1.png') {
          if (!fs.existsSync(LOCAL + '/' + mrel)) {
            // Try to find any info icon
            const icons = fs.readdirSync(LOCAL).filter(f => f.includes('info-ico'));
            if (icons.length > 0) {
              marker.image = '../wp-content/uploads/' + icons[0];
              fixedIcons++;
            }
          }
        }
      }
    });
  }
});

fs.writeFileSync(CFG, JSON.stringify(cfg, null, 2), 'utf8');
console.log('Fixed', fixedScenes, 'scenes, fixed', fixedIcons, 'icons');
console.log('config.json saved.');
