const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  // Write PHP script to server, run it, get JSON output
  const phpScript = [
    '<?php',
    '$m = new mysqli("localhost", "u2383407_wp972", "OX59b4]S.p", "u2383407_wp972");',
    '$r = $m->query("SELECT config FROM wpyk_ipanorama WHERE id=3")->fetch_assoc();',
    '$c = unserialize($r["config"]);',
    'echo json_encode($c, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);'
  ].join('\n');

  // First write PHP file to server
  conn.exec('cat > /tmp/get_tour.php << \'PHPEOF\'\n' + phpScript + '\nPHPEOF', (err, stream) => {
    stream.on('close', () => {
      // Run it
      conn.exec('php /tmp/get_tour.php 2>/dev/null', (err2, stream2) => {
        let out = '';
        stream2.on('data', d => out += d.toString());
        stream2.stderr.on('data', d => process.stderr.write(d.toString()));
        stream2.on('close', () => {
          if (out.trim().startsWith('{')) {
            const dir = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3';
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(dir + '/config.json', out, 'utf8');
            console.log('Saved config.json:', out.length, 'bytes');
            console.log('Preview:', out.substring(0, 200));
          } else {
            console.log('Unexpected output:', out.substring(0, 500));
          }
          conn.end();
        });
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
