/**
 * 1. Скачать плагин mapplic-wp через SFTP
 * 2. Получить данные карты (post_id=1183) из БД
 * 3. Сгенерировать правильный HTML для dacha-map/index.html
 */
const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE_PLUGIN = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/plugins/mapplic-wp';
const LOCAL_PLUGIN  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/plugins/mapplic-wp';
const STATIC_DIR    = 'D:/DevTools/Database/2026chastnayadacha.ru/static';

function sftpDownloadDir(sftp, remotePath, localPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(localPath, { recursive: true });
    sftp.readdir(remotePath, (err, list) => {
      if (err) { console.error('readdir ERR:', remotePath, err.message); return resolve(); }
      if (!list.length) return resolve();
      let done = 0;
      list.forEach(item => {
        const ri = remotePath + '/' + item.filename;
        const li = path.join(localPath, item.filename);
        const finish = () => { if (++done >= list.length) resolve(); };
        if (item.attrs.isDirectory()) {
          sftpDownloadDir(sftp, ri, li).then(finish);
        } else {
          if (fs.existsSync(li)) { process.stdout.write('s'); finish(); return; }
          sftp.fastGet(ri, li, (e) => { process.stdout.write(e ? 'x' : '.'); finish(); });
        }
      });
    });
  });
}

const conn = new Client();
conn.on('ready', () => {
  // 1. Получим данные карты из БД
  conn.exec('mysql -u u2383407_wp972 -p"OX59b4]S.p" u2383407_wp972 --skip-column-names -B -e "SELECT meta_value FROM wpyk_postmeta WHERE post_id=1183 AND meta_key=\'_mapplic_data\';" 2>/dev/null', (err, stream) => {
    let mapData = '';
    stream.on('data', d => mapData += d.toString());
    stream.on('close', () => {
      console.log('Map data length:', mapData.length);

      // Сохраним сырые данные
      fs.mkdirSync(LOCAL_PLUGIN, { recursive: true });

      // PHP-скрипт для конвертации serialized -> JSON
      const phpScript = `<?php
$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");
$m->set_charset("utf8mb4");
$r = $m->query("SELECT meta_value FROM wpyk_postmeta WHERE post_id=1183 AND meta_key='_mapplic_data'")->fetch_assoc();
$data = maybe_unserialize($r['meta_value']);
if (!$data) $data = @unserialize($r['meta_value']);
if (!$data) { $data = json_decode($r['meta_value'], true); }
echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
`;
      fs.writeFileSync('D:/DevTools/Database/2026chastnayadacha.ru/_scripts/get_map.php', phpScript, 'utf8');

      conn.sftp((err2, sftp) => {
        sftp.fastPut(
          'D:/DevTools/Database/2026chastnayadacha.ru/_scripts/get_map.php',
          '/tmp/get_map.php',
          () => {
            conn.exec('php /tmp/get_map.php 2>/dev/null', (e3, s3) => {
              let json = '';
              s3.on('data', d => json += d.toString());
              s3.on('close', () => {
                console.log('JSON output start:', json.substring(0, 100));

                if (json.trim().startsWith('{') || json.trim().startsWith('[')) {
                  const dir = path.join(STATIC_DIR, 'wp-content/uploads/mapplic');
                  fs.mkdirSync(dir, { recursive: true });
                  fs.writeFileSync(dir + '/map-1183.json', json.trim(), 'utf8');
                  console.log('Saved map-1183.json');
                } else {
                  // Try to parse as raw serialized
                  fs.writeFileSync('D:/DevTools/Database/2026chastnayadacha.ru/_scripts/map_raw.txt', mapData, 'utf8');
                  console.log('Saved raw data to _scripts/map_raw.txt');
                }

                // 2. Download plugin
                console.log('\nDownloading mapplic-wp plugin...');
                sftpDownloadDir(sftp, REMOTE_PLUGIN, LOCAL_PLUGIN).then(() => {
                  console.log('\nPlugin downloaded!');
                  conn.end();
                });
              });
            });
          }
        );
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
