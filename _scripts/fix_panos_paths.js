const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');

// Сначала узнаем какие файлы реально есть в uploads на сервере
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ls /var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/ | grep -v "^2" | grep -v "/"', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      const serverFiles = out.trim().split('\n').map(f => f.trim().toLowerCase());
      console.log('Server uploads files count:', serverFiles.length);

      const cfgPath = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/ipanorama/3/config.json';
      let raw = fs.readFileSync(cfgPath, 'utf8');

      // Убираем panos/ из путей - файлы лежат прямо в uploads/
      raw = raw.split('../wp-content/uploads/panos/').join('../wp-content/uploads/');

      fs.writeFileSync(cfgPath, raw, 'utf8');

      // Теперь проверим что ещё missing
      const cfg = JSON.parse(raw);
      const uploadsLocal = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads';
      const missing = new Set();

      function checkPaths(obj) {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === 'string' && obj[k].includes('../wp-content/uploads/')) {
            const rel = obj[k].replace('../wp-content/uploads/', '').split('?')[0];
            const local = uploadsLocal + '/' + rel;
            if (!fs.existsSync(local)) missing.add(rel);
          } else if (typeof obj[k] === 'object') checkPaths(obj[k]);
        }
      }
      checkPaths(cfg);

      console.log('\nStill missing after panos/ fix:', missing.size);
      [...missing].forEach(f => console.log(' ', f));
      conn.end();
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
