const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const OUT_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    sftp.fastPut(
      'D:/DevTools/Database/2026chastnayadacha.ru/get_tour3.php',
      '/tmp/get_tour3.php',
      () => {
        conn.exec('php /tmp/get_tour3.php 2>&1', (err2, stream) => {
          let out = '';
          stream.on('data', d => out += d.toString());
          stream.on('close', () => {
            const trimmed = out.trim();
            if (trimmed.startsWith('{')) {
              fs.mkdirSync(OUT_DIR, { recursive: true });
              fs.writeFileSync(OUT_DIR + '/config.json', trimmed, 'utf8');
              const parsed = JSON.parse(trimmed);
              console.log('OK! Saved config.json', trimmed.length, 'bytes');
              console.log('Title:', parsed.title);
              console.log('Scenes:', parsed.scenes ? Object.keys(parsed.scenes).length : 0);
            } else {
              console.log('Output:', trimmed.substring(0, 500));
            }
            conn.end();
          });
        });
      }
    );
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
