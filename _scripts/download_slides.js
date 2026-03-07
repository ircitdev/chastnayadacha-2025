const fs = require('fs');
const Client = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2').Client;

const DEST = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/';
const files = ['dacha-slide1.jpg', 'dacha-slide2.jpg', 'dacha-slide3.jpg'];
const REMOTE_BASE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    let done = 0;
    for (const f of files) {
      sftp.fastGet(REMOTE_BASE + f, DEST + f, {}, (err) => {
        if (err) {
          console.log('MISS:', f, err.message);
          // try in subdirs
          sftp.readdir(REMOTE_BASE, (e2, list) => {
            if (e2) { console.log('readdir failed'); return; }
            // search in year subdirs
            const dirs = list.filter(e => e.attrs.isDirectory && /^\d{4}$/.test(e.filename));
            let found = false;
            let checked = 0;
            for (const d of dirs) {
              sftp.fastGet(REMOTE_BASE + d.filename + '/' + f, DEST + f, {}, (e3) => {
                checked++;
                if (!e3 && !found) {
                  found = true;
                  console.log('Downloaded from', d.filename + '/', f);
                }
                if (checked === dirs.length && !found) console.log('NOT FOUND:', f);
              });
            }
          });
        } else {
          console.log('Downloaded:', f);
        }
        if (++done === files.length) setTimeout(() => conn.end(), 3000);
      });
    }
  });
});
conn.connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
