const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs   = require('fs');

const PAGE    = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';
const MAP_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/mapplic';
const MAP_JSON = MAP_DIR + '/map-1183.json';

const phpScript = `<?php
$m = new mysqli('localhost','u2383407_wp972','OX59b4]S.p','u2383407_wp972');
$m->set_charset('utf8mb4');
$r = $m->query("SELECT post_content FROM wpyk_posts WHERE ID=1183 LIMIT 1");
$row = $r->fetch_assoc();
echo $row['post_content'];
?>`;

const conn = new Client();
conn.on('ready', () => {
  // Upload PHP script
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }
    const remote = '/var/www/u2383407/data/www/chastnayadacha.ru/get_map.php';
    const stream = sftp.createWriteStream(remote);
    stream.on('close', () => {
      // Execute it
      conn.exec('php ' + remote, (err2, s) => {
        let out = '';
        s.on('data', d => out += d.toString());
        s.stderr.on('data', d => process.stderr.write(d.toString()));
        s.on('close', () => {
          // Delete the temp file
          sftp.unlink(remote, () => {});
          conn.end();

          // out = WordPress post_content which is the Mapplic shortcode or JSON
          // Extract JSON from [mapplic ... data='...']  or it's raw JSON
          let jsonStr = out.trim();

          // Try parsing directly
          let data;
          try {
            data = JSON.parse(jsonStr);
          } catch(e) {
            // May be escaped — try to find JSON object
            const m = jsonStr.match(/\{[\s\S]+\}/);
            if (m) {
              try { data = JSON.parse(m[0]); } catch(e2) {
                console.error('Could not parse JSON:', e2.message);
                console.log('Raw (first 500):', jsonStr.slice(0, 500));
                return;
              }
            } else {
              console.error('No JSON found in output');
              console.log('Raw:', jsonStr.slice(0, 300));
              return;
            }
          }

          console.log('Parsed JSON, locations:', data.locations ? data.locations.length : 0);

          // Fix URLs
          function fixUrls(obj) {
            if (!obj || typeof obj !== 'object') return;
            for (const k of Object.keys(obj)) {
              if (typeof obj[k] === 'string') {
                if (obj[k].startsWith('//chastnayadacha.ru/')) obj[k] = 'https:' + obj[k];
                if (obj[k].startsWith('https://chastnayadacha.ru/wp-content/uploads/'))
                  obj[k] = obj[k].replace('https://chastnayadacha.ru/wp-content/uploads/', '../wp-content/uploads/');
                else if (obj[k].startsWith('https://chastnayadacha.ru/'))
                  obj[k] = obj[k].replace('https://chastnayadacha.ru/', '../');
                if (obj[k].startsWith('/') && !obj[k].startsWith('//') && !obj[k].startsWith('/wp-'))
                  obj[k] = '..' + obj[k];
              } else if (typeof obj[k] === 'object') fixUrls(obj[k]);
            }
          }
          fixUrls(data);

          // Map image → absolute
          if (data.levels) data.levels.forEach(l => {
            if (l.map) l.map = l.map.replace('../wp-content/uploads/', '/wp-content/uploads/');
          });

          fs.mkdirSync(MAP_DIR, { recursive: true });
          fs.writeFileSync(MAP_JSON, JSON.stringify(data, null, 2), 'utf8');
          console.log('map-1183.json saved');

          injectMapplic(data);
        });
      });
    });
    stream.end(phpScript);
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });
conn.on('error', e => console.error(e.message));

function injectMapplic(data) {
  const jsonStr  = JSON.stringify(data);
  const dataJson = jsonStr.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const mapplicHtml =
    '<link rel="stylesheet" href="../wp-content/plugins/mapplic-wp/core/mapplic.css">\n' +
    '<mapplic-map id="mapplic-1183" data-json="' + dataJson + '" data-path="../wp-content/plugins/mapplic-wp/core/"></mapplic-map>\n' +
    '<script src="../wp-content/plugins/mapplic-wp/core/mapplic.js"><\/script>';

  let html = fs.readFileSync(PAGE, 'utf8');
  const scDiv  = '<div class="elementor-shortcode">';
  const idx    = html.indexOf(scDiv);
  if (idx === -1) { console.error('elementor-shortcode div not found'); return; }
  const endIdx = html.indexOf('</div>', idx + scDiv.length);
  html = html.substring(0, idx) + scDiv + '\n' + mapplicHtml + '\n</div>' + html.substring(endIdx + 6);
  fs.writeFileSync(PAGE, html, 'utf8');
  console.log('dacha-map/index.html updated');
}
