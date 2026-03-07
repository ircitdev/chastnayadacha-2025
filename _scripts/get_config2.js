const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');

const LOCAL_PHP = 'D:/DevTools/Database/2026chastnayadacha.ru/get_tour.php';
const REMOTE_PHP = '/tmp/get_tour_cd.php';
const OUT_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3';

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error(err.message); conn.end(); return; }

    // Upload PHP script
    sftp.fastPut(LOCAL_PHP, REMOTE_PHP, (err) => {
      if (err) { console.error('Upload error:', err.message); conn.end(); return; }
      console.log('PHP script uploaded');

      // Run it
      conn.exec('php ' + REMOTE_PHP + ' 2>/dev/null', (err2, stream) => {
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => {
          const trimmed = out.trim();
          if (trimmed.startsWith('{')) {
            fs.mkdirSync(OUT_DIR, { recursive: true });
            fs.writeFileSync(OUT_DIR + '/config.json', trimmed, 'utf8');
            console.log('Saved config.json:', trimmed.length, 'bytes');
            const parsed = JSON.parse(trimmed);
            console.log('Tour title:', parsed.title);
            console.log('Scenes count:', parsed.scenes ? Object.keys(parsed.scenes).length : 'N/A');
          } else {
            console.log('Unexpected output (first 300):', trimmed.substring(0, 300));
          }
          conn.end();
        });
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
