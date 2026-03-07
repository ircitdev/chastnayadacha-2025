const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const STATIC_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru/static';
const SITE_ROOT = '/var/www/u2383407/data/www/chastnayadacha.ru';
const SSH_CONFIG = { host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' };

let downloaded = 0, skipped = 0, errors = 0;

function sftpDownloadDir(sftp, remotePath, localPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(localPath, { recursive: true });
    sftp.readdir(remotePath, (err, list) => {
      if (err) { console.error(`\n  readdir ERR ${remotePath}: ${err.message}`); return resolve(); }
      if (!list.length) return resolve();

      let done = 0;
      list.forEach(item => {
        const remoteItem = `${remotePath}/${item.filename}`;
        const localItem = path.join(localPath, item.filename);
        const finish = () => { if (++done >= list.length) resolve(); };

        if (item.attrs.isDirectory()) {
          sftpDownloadDir(sftp, remoteItem, localItem).then(finish);
        } else {
          // Пропускаем если файл уже есть и размер совпадает
          if (fs.existsSync(localItem)) {
            const localSize = fs.statSync(localItem).size;
            if (localSize === item.attrs.size) {
              skipped++;
              finish();
              return;
            }
          }
          sftp.fastGet(remoteItem, localItem, (e) => {
            if (e) { errors++; process.stdout.write('x'); }
            else { downloaded++; process.stdout.write('.'); }
            finish();
          });
        }
      });
    });
  });
}

async function run() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      console.log('Connected\n');
      conn.sftp((err, sftp) => {
        if (err) return reject(err);

        const tasks = [
          // Подпапки uploads (год/месяц)
          { name: 'uploads/2021', remote: `${SITE_ROOT}/wp-content/uploads/2021`, local: path.join(STATIC_DIR, 'wp-content/uploads/2021') },
          { name: 'uploads/2022', remote: `${SITE_ROOT}/wp-content/uploads/2022`, local: path.join(STATIC_DIR, 'wp-content/uploads/2022') },
          { name: 'uploads/2023', remote: `${SITE_ROOT}/wp-content/uploads/2023`, local: path.join(STATIC_DIR, 'wp-content/uploads/2023') },
          // Elementor google-fonts (кешируются в uploads)
          { name: 'uploads/elementor', remote: `${SITE_ROOT}/wp-content/uploads/elementor`, local: path.join(STATIC_DIR, 'wp-content/uploads/elementor') },
          // Essential addons assets
          { name: 'uploads/essential-addons-elementor', remote: `${SITE_ROOT}/wp-content/uploads/essential-addons-elementor`, local: path.join(STATIC_DIR, 'wp-content/uploads/essential-addons-elementor') },
          // Essential grid
          { name: 'uploads/essential-grid', remote: `${SITE_ROOT}/wp-content/uploads/essential-grid`, local: path.join(STATIC_DIR, 'wp-content/uploads/essential-grid') },
          // SB Instagram feed images cache
          { name: 'uploads/sb-instagram-feed-images', remote: `${SITE_ROOT}/wp-content/uploads/sb-instagram-feed-images`, local: path.join(STATIC_DIR, 'wp-content/uploads/sb-instagram-feed-images') },
        ];

        (async () => {
          for (const task of tasks) {
            process.stdout.write(`\n[SFTP] ${task.name} `);
            await sftpDownloadDir(sftp, task.remote, task.local);
            console.log(' OK');
          }
          conn.end();
          resolve();
        })();
      });
    });
    conn.on('error', e => { console.error('SSH error:', e.message); reject(e); });
    conn.connect(SSH_CONFIG);
  });
}

run().then(() => {
  console.log(`\n=== DONE ===`);
  console.log(`Downloaded: ${downloaded}, Skipped (already exists): ${skipped}, Errors: ${errors}`);
}).catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
