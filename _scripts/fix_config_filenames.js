const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads';
const LOCAL  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
const CFG    = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';

// Маппинг: старое имя -> новое имя на сервере
// Принцип: пробелы -> дефисы, смотрим что реально есть
const nameMap = {
  'restholl.jpg':                    'restoran-top-2048x1024.jpg',      // холл ресторана - ближайший аналог
  'restoran 1.jpg':                  'restoran-top-2048x1024.jpg',
  'restoran etaj2.jpg':              'restoran-etaj2.jpg',
  '1srub-spaln3et2-2row-v2-6000-scaled.jpg': '1srub-spaln3et2-2row-v2-6000-2048x1062.jpg',
  '9room.jpg':                       null,  // нет аналога
  '12room.jpg':                      null,
  '12room spal.jpg':                 null,
  '111 15dom gostin.jpeg':           null,
  '15vip spaln1etaj2.jpg':           '15vip-spaln1etaj2.jpg',
  '15vip-spaln1etaj2.jpg':           '15vip-spaln1etaj2.jpg',
  '15vip spaln1et v2.jpg':           '15vip-spaln1et-v2.jpg',
  '16vip room v2.jpeg':              '16vip-room-v2.jpeg',
  '17room gostin.jpg':               '17room-gostin.jpg',
  '17room spaln1.jpg':               '17room-spaln1.jpg',
  '17room spalna2 nolight.jpg':      '17room-spalna2-nolight.jpg',
  '18room-gostin-v1 15K.jpg':        '18room-gostin-v1-15K.jpg',
  '18vip spalna2.jpg':               '18vip-spalna2.jpg',
  '18vip-spalna3.jpg':               '18vip-spalna3.jpg',
  '19vip gostin.jpg':                '19vip-gostin.jpg',
  '19vip spal1.jpg':                 '19vip-spal1.jpg',
  '19vip spal2.jpg':                 '19vip-spal2.jpg',
  '20vip-gostin1.jpg':               '20vip-gostin1.jpg',
  '21dom-gostin.jpg':                '21dom-gostin.jpg',
  '21dom spaln1 v1.jpg':             '21dom-spaln1-v1.jpg',
  'steklashka.jpg':                  'steklashka-1.jpg',
  'info-ico-50px-1.png':             'info-ico-50px.png',
};

const conn = new Client();
conn.on('ready', () => {
  // Сначала проверим что реально есть на сервере из нашего маппинга
  const checkFiles = [...new Set(Object.values(nameMap).filter(Boolean))];
  conn.exec('ls ' + checkFiles.map(f => '"' + REMOTE + '/' + f + '"').join(' ') + ' 2>&1', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      // Определяем какие файлы реально существуют
      const existing = new Set();
      out.split('\n').forEach(line => {
        if (line.includes('/uploads/') && !line.includes('No such')) {
          existing.add(path.basename(line.trim()));
        }
      });
      console.log('Confirmed existing on server:', [...existing]);

      conn.sftp((err2, sftp) => {
        if (err2) { console.error(err2); conn.end(); return; }

        // Скачиваем подтверждённые файлы
        let pending = 0;
        const downloadQueue = [];

        for (const [oldName, newName] of Object.entries(nameMap)) {
          if (!newName) continue;
          const localNew = path.join(LOCAL, newName);
          const localOld = path.join(LOCAL, oldName);
          if (!fs.existsSync(localNew) && !fs.existsSync(localOld)) {
            downloadQueue.push({ oldName, newName, localNew, localOld });
          }
        }

        if (downloadQueue.length === 0) {
          console.log('All files already local, updating config...');
          updateConfig(nameMap);
          conn.end();
          return;
        }

        downloadQueue.forEach(({ oldName, newName, localNew, localOld }) => {
          pending++;
          sftp.fastGet(REMOTE + '/' + newName, localNew, (e) => {
            if (e) {
              console.log('FAIL:', newName, e.message);
            } else {
              console.log('OK:', newName);
              // Also create copy with old name if different
              if (oldName !== newName && !fs.existsSync(localOld)) {
                fs.copyFileSync(localNew, localOld);
              }
            }
            if (--pending === 0) {
              updateConfig(nameMap);
              conn.end();
            }
          });
        });
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });

function updateConfig(nameMap) {
  let raw = fs.readFileSync(CFG, 'utf8');

  for (const [oldName, newName] of Object.entries(nameMap)) {
    if (newName && oldName !== newName) {
      // Replace in config: old filename -> new filename
      raw = raw.split(oldName).join(newName);
    }
  }

  fs.writeFileSync(CFG, raw, 'utf8');
  console.log('\nconfig.json updated with new filenames');

  // Final check
  const cfg = JSON.parse(raw);
  const missing = new Set();
  function checkPaths(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string' && obj[k].includes('../wp-content/uploads/')) {
        const rel = obj[k].replace('../wp-content/uploads/', '').split('?')[0];
        if (!fs.existsSync(LOCAL + '/' + rel)) missing.add(rel);
      } else if (typeof obj[k] === 'object') checkPaths(obj[k]);
    }
  }
  checkPaths(cfg);
  console.log('Still missing:', missing.size);
  [...missing].forEach(f => console.log(' ', f));
}

conn.on('error', e => { console.error(e.message); process.exit(1); });
