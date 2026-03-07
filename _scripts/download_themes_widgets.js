const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/plugins/ipanorama-pro/assets/js/lib/ipanorama';
const LOCAL  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/plugins/ipanorama-pro/assets/js/lib/ipanorama';

function sftpDownloadDir(sftp, remotePath, localPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(localPath, { recursive: true });
    sftp.readdir(remotePath, (err, list) => {
      if (err) { console.error('readdir ERR:', remotePath, err.message); return resolve(); }
      if (!list.length) return resolve();
      let done = 0;
      list.forEach(item => {
        const remoteItem = remotePath + '/' + item.filename;
        const localItem  = path.join(localPath, item.filename);
        const finish = () => { if (++done >= list.length) resolve(); };
        if (item.attrs.isDirectory()) {
          sftpDownloadDir(sftp, remoteItem, localItem).then(finish);
        } else {
          // Skip if already exists
          if (fs.existsSync(localItem)) { process.stdout.write('s'); finish(); return; }
          sftp.fastGet(remoteItem, localItem, (e) => {
            process.stdout.write(e ? 'x' : '.');
            finish();
          });
        }
      });
    });
  });
}

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error(err.message); conn.end(); return; }

    const subdirs = ['themes', 'widgets', 'transitions', 'icons', 'images'];

    (async () => {
      for (const sub of subdirs) {
        process.stdout.write('\n[SFTP] ' + sub + ' ');
        await sftpDownloadDir(sftp, REMOTE + '/' + sub, LOCAL + '/' + sub);
        console.log(' OK');
      }
      conn.end();
    })();
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
conn.on('close', () => console.log('\nDone.'));
