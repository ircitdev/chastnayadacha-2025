const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ls /var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/elementor/ 2>&1', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log('elementor/:\n', out);
      conn.exec('ls /var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/elementor/google-fonts/ 2>&1', (err2, s2) => {
        let o2 = '';
        s2.on('data', d => o2 += d.toString());
        s2.on('close', () => {
          console.log('google-fonts/:\n', o2);
          conn.exec('ls /var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/elementor/google-fonts/fonts/ 2>&1 | head -20', (err3, s3) => {
            let o3 = '';
            s3.on('data', d => o3 += d.toString());
            s3.on('close', () => {
              console.log('fonts/:\n', o3);
              conn.end();
            });
          });
        });
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => { console.error(e.message); process.exit(1); });
