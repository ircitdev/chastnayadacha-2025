const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads';
const LOCAL  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';

const missing = [
  'info-ico-50px-1.png',
  'restholl.jpg',
  'restoran 1.jpg',
  'restoran etaj2.jpg',
  '1srub-spaln3et2-2row-v2-6000-scaled.jpg',
  '9room.jpg',
  '12room.jpg',
  '12room spal.jpg',
  '111 15dom gostin.jpeg',
  '15vip spaln1etaj2.jpg',
  '15vip-spaln1etaj2.jpg',
  '15vip spaln1et v2.jpg',
  '16vip room v2.jpeg',
  '17room gostin.jpg',
  '17room spaln1.jpg',
  '17room spalna2 nolight.jpg',
  '18room-gostin-v1 15K.jpg',
  '18vip spalna2.jpg',
  '18vip-spalna3.jpg',
  '19vip gostin.jpg',
  '19vip spal1.jpg',
  '19vip spal2.jpg',
  '20vip-gostin1.jpg',
  '21dom-gostin.jpg',
  '21dom spaln1 v1.jpg',
  'steklashka.jpg',
];

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error(err.message); conn.end(); return; }

    let ok = 0, fail = 0;
    let done = 0;

    missing.forEach(fname => {
      const localPath = path.join(LOCAL, fname);
      if (fs.existsSync(localPath)) {
        process.stdout.write('s');
        if (++done >= missing.length) { console.log('\nDone. ok:', ok, 'fail:', fail); conn.end(); }
        return;
      }
      sftp.fastGet(REMOTE + '/' + fname, localPath, (e) => {
        if (e) {
          process.stdout.write('x');
          console.log('\n  FAIL:', fname, e.message);
          fail++;
        } else {
          process.stdout.write('.');
          ok++;
        }
        if (++done >= missing.length) { console.log('\nDone. ok:', ok, 'fail:', fail); conn.end(); }
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
