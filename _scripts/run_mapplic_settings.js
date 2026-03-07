const fs   = require('fs');
const Client = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2').Client;

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const local  = 'D:/DevTools/Database/2026chastnayadacha.ru/_scripts/get_mapplic_settings.php';
    const remote = '/var/www/u2383407/data/www/chastnayadacha.ru/get_mapplic_tmp.php';
    sftp.fastPut(local, remote, {}, (err) => {
      if (err) throw err;
      console.log('PHP uploaded');
      conn.exec('php ' + remote, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', () => {
          console.log(out);
          sftp.unlink(remote, () => {
            console.log('Temp file removed');
            conn.end();
          });
        });
      });
    });
  });
});
conn.connect({
  host: '37.140.192.74',
  port: 22,
  username: 'u2383407',
  password: 'UGp723jgu9lGGlsI'
});
