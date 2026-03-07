const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    sftp.fastPut(
      'D:/DevTools/Database/2026chastnayadacha.ru/get_tour2.php',
      '/tmp/get_tour2.php',
      (err) => {
        conn.exec('php /tmp/get_tour2.php 2>&1', (err2, stream) => {
          let out = '';
          stream.on('data', d => out += d.toString());
          stream.on('close', () => {
            console.log(out.substring(0, 1000));
            conn.end();
          });
        });
      }
    );
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
