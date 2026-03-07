const fs     = require('fs');
const path   = require('path');
const Client = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2').Client;

const DEST_BASE   = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/';
const REMOTE_BASE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/';
const YEAR_DIRS   = ['', '2021/09/', '2022/', '2021/', '2023/', '2022/06/'];

const allFiles = [
  'Image01.jpg','Image03.jpg','Image05.jpg','Image07.jpg',
  'Image09.jpg','Image10.jpg','Image12.jpg','Image14.jpg','Image16.jpg',
  '2-1.jpg','2.jpg','3.jpg',
  'dacha_na_volge-05102021-0003.jpg','dacha_na_volge-05102021-0006.jpg',
  'dacha_na_volge-05102021-0008.jpg','dacha_na_volge-18092021-0095.jpg',
  'SAM2104.jpg',
  'IMG_1943.jpg','IMG_1947.jpg','IMG_1951.jpg','IMG_2481.jpg',
  'IMG_2550.jpg','IMG_2555.jpg','IMG_2558.jpg','IMG_2563.jpg',
  'IMG_2565.jpg','IMG_2568.jpg','IMG_8330-1.jpg','IMG_8341-1.jpg',
  'IMG_0839.jpg','IMG_1848.jpg','IMG_5383.jpg',
  'dacha_na_volge-01102021-0017.jpg','dacha_na_volge-01102021-0031.jpg',
  'dacha_na_volge-01102021-0004.jpg','dacha_na_volge-01102021-0010.jpg',
  'dacha_na_volge-01102021-0011.jpg','dacha_na_volge-01102021-0014.jpg',
  'images/territory/territory-photo.jpg',
];

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    let pending = allFiles.length, downloaded = 0, failed = 0;
    function tryDownload(relDest, candidates, idx) {
      if (idx >= candidates.length) {
        console.log('NOT FOUND:', relDest); failed++;
        if (--pending === 0) { console.log('\nDone. Downloaded:', downloaded, 'Failed:', failed); conn.end(); }
        return;
      }
      const destPath = DEST_BASE + relDest;
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      sftp.fastGet(REMOTE_BASE + candidates[idx], destPath, {}, (e) => {
        if (e) tryDownload(relDest, candidates, idx + 1);
        else {
          console.log('OK:', relDest); downloaded++;
          if (--pending === 0) { console.log('\nDone. Downloaded:', downloaded, 'Failed:', failed); conn.end(); }
        }
      });
    }
    for (const f of allFiles) {
      const basename = path.basename(f);
      tryDownload(f, YEAR_DIRS.map(d => d + basename), 0);
    }
  });
});
conn.connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
