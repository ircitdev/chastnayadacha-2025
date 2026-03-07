const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE_BASE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/plugins';
const LOCAL_BASE  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/plugins';

const DIRS = [
  'elementor/assets',
  'elementor-pro/assets',
];

const conn = new Client();

function mkdirp(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function downloadDir(sftp, remoteDir, localDir, cb) {
  mkdirp(localDir);
  sftp.readdir(remoteDir, (err, list) => {
    if (err) { console.error('readdir error:', remoteDir, err.message); return cb(); }
    let pending = list.length;
    if (pending === 0) return cb();

    list.forEach(item => {
      const remPath = remoteDir + '/' + item.filename;
      const locPath = path.join(localDir, item.filename);

      if (item.attrs.isDirectory()) {
        downloadDir(sftp, remPath, locPath, () => { if (--pending === 0) cb(); });
      } else {
        if (fs.existsSync(locPath) && fs.statSync(locPath).size === item.attrs.size) {
          process.stdout.write('s');
          if (--pending === 0) cb();
        } else {
          sftp.fastGet(remPath, locPath, (e) => {
            if (e) { process.stdout.write('x'); console.error('\nFAIL:', remPath, e.message); }
            else   { process.stdout.write('.'); }
            if (--pending === 0) cb();
          });
        }
      }
    });
  });
}

conn.on('ready', () => {
  console.log('Connected. Starting download...');
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }

    let idx = 0;
    function next() {
      if (idx >= DIRS.length) { console.log('\nAll done!'); conn.end(); return; }
      const d = DIRS[idx++];
      const remDir = REMOTE_BASE + '/' + d;
      const locDir = path.join(LOCAL_BASE, d);
      console.log('\nDownloading:', d);
      downloadDir(sftp, remDir, locDir, next);
    }
    next();
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });

conn.on('error', e => { console.error(e.message); process.exit(1); });
