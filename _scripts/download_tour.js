/**
 * Download virtual tour pages + plugin assets + panoramic images
 * Tour URL: https://chastnayadacha.ru/ipanorama/virtualtour/3
 * Also tours 1, 2, 4 for completeness
 */
const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROJECT_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru';
const STATIC_DIR = path.join(PROJECT_DIR, 'static');
const SITE_ROOT = '/var/www/u2383407/data/www/chastnayadacha.ru';
const SSH_CONFIG = { host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' };

// Tour page URLs to download
const tourPages = [
  'https://chastnayadacha.ru/ipanorama/virtualtour/1',
  'https://chastnayadacha.ru/ipanorama/virtualtour/2',
  'https://chastnayadacha.ru/ipanorama/virtualtour/3',
  'https://chastnayadacha.ru/ipanorama/virtualtour/4',
];

function fetchUrl(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error('Too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0' },
      timeout: 30000
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const loc = res.headers.location;
        const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
        return fetchUrl(next, redirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function rewriteHtml(html, pageUrl) {
  // /ipanorama/virtualtour/3 -> depth = 3
  const u = new URL(pageUrl);
  const depth = u.pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean).length;
  const root = depth === 0 ? './' : '../'.repeat(depth);
  return html
    .replace(/https:\/\/chastnayadacha\.ru\//g, root)
    .replace(/http:\/\/chastnayadacha\.ru\//g, root);
}

async function downloadTourPages() {
  console.log('\nDownloading virtual tour HTML pages...\n');
  for (const url of tourPages) {
    try {
      const { status, body } = await fetchUrl(url);
      const u = new URL(url);
      const localPath = path.join(STATIC_DIR, u.pathname, 'index.html');
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, rewriteHtml(body, url), 'utf8');
      console.log(`  [${status}] ${url}`);
      console.log(`        -> ${u.pathname}/index.html`);
    } catch (e) {
      console.error(`  [ERR] ${url}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

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
          sftp.fastGet(remoteItem, localItem, (e) => {
            process.stdout.write(e ? 'x' : '.');
            finish();
          });
        }
      });
    });
  });
}

async function downloadViaSFTP() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      console.log('\nSSH connected\n');
      conn.sftp((err, sftp) => {
        if (err) return reject(err);

        const tasks = [
          {
            name: 'ipanorama-pro plugin (JS/CSS/assets)',
            remote: `${SITE_ROOT}/wp-content/plugins/ipanorama-pro`,
            local: path.join(STATIC_DIR, 'wp-content/plugins/ipanorama-pro')
          },
        ];

        // Also download panoramic images that may be missing
        // Check which of the extracted URLs we need
        const missingPanoFiles = [
          '1_cube_equi-1.jpeg',
          '2_cube_equi-1.jpeg',
          '1srub-spal1et-v2-scaled.jpg',
          '1srub-spaln2et2-2row-v2-6000-scaled.jpg',
          '1srub-spaln3et2-2row-v2-6000-scaled.jpg',
          'besedka2-ultrawide-scaled.jpg',
          'housetwentyone.jpg',
          'room7-3mestn-1536x768.jpg',
          'room19-spal3-1-scaled.jpg',
          'room19-spal3-3.jpg',
        ];

        (async () => {
          for (const task of tasks) {
            process.stdout.write(`\n[SFTP] ${task.name} `);
            await sftpDownloadDir(sftp, task.remote, task.local);
            console.log(' OK');
          }

          // Download missing individual files
          console.log('\n[SFTP] Downloading missing panorama images...');
          const uploadsLocal = path.join(STATIC_DIR, 'wp-content/uploads');
          const uploadsRemote = `${SITE_ROOT}/wp-content/uploads`;
          let downloaded = 0, skipped = 0;

          for (const fname of missingPanoFiles) {
            const localFile = path.join(uploadsLocal, fname);
            if (fs.existsSync(localFile)) {
              process.stdout.write('s');
              skipped++;
              continue;
            }
            await new Promise(res => {
              sftp.fastGet(`${uploadsRemote}/${fname}`, localFile, (e) => {
                process.stdout.write(e ? 'x' : '.');
                if (!e) downloaded++;
                res();
              });
            });
          }
          console.log(`\n  Downloaded: ${downloaded}, Skipped (exist): ${skipped}`);

          conn.end();
          resolve();
        })();
      });
    });
    conn.on('error', e => { console.error('SSH error:', e.message); reject(e); });
    conn.connect(SSH_CONFIG);
  });
}

// Also get the tour config JSON that the player needs
async function downloadTourConfig() {
  console.log('\n[MySQL→JSON] Exporting tour configs...');
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      // Export all tour data as JSON via PHP
      const phpScript = `php -r "
define('ABSPATH', '/var/www/u2383407/data/www/chastnayadacha.ru/');
define('WPINC', 'wp-includes');
\\\$mysqli = new mysqli('localhost', 'u2383407_wp972', 'OX59b4]S.p', 'u2383407_wp972');
\\\$res = \\\$mysqli->query('SELECT id, title, config, data FROM wpyk_ipanorama WHERE deleted=0');
\\\$tours = [];
while (\\\$row = \\\$res->fetch_assoc()) { \\\$tours[] = \\\$row; }
echo json_encode(\\\$tours, JSON_UNESCAPED_UNICODE);
"`;
      conn.exec(phpScript, (err, stream) => {
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => {
          try {
            const tours = JSON.parse(out);
            const outPath = path.join(PROJECT_DIR, 'static/ipanorama-tours.json');
            fs.writeFileSync(outPath, JSON.stringify(tours, null, 2), 'utf8');
            console.log(`  Saved ${tours.length} tours to static/ipanorama-tours.json`);
          } catch(e) {
            console.error('  JSON parse error:', e.message);
            // Save raw anyway
            fs.writeFileSync(path.join(PROJECT_DIR, 'tour_raw.txt'), out, 'utf8');
          }
          conn.end();
          resolve();
        });
      });
    });
    conn.on('error', e => { console.error('SSH error:', e.message); reject(e); });
    conn.connect(SSH_CONFIG);
  });
}

(async () => {
  console.log('=== Virtual Tour Downloader ===');
  try {
    await downloadTourPages();
    await downloadTourConfig();
    await downloadViaSFTP();
    console.log('\n=== COMPLETE ===');
  } catch(e) {
    console.error('Fatal:', e.message);
    process.exit(1);
  }
})();
