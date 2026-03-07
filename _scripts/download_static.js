const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROJECT_DIR = 'D:/DevTools/Database/2026chastnayadacha.ru';
const STATIC_DIR = path.join(PROJECT_DIR, 'static');
const SITE_ROOT = '/var/www/u2383407/data/www/chastnayadacha.ru';
const SSH_CONFIG = { host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' };

const pages = [
  'https://chastnayadacha.ru/',
  'https://chastnayadacha.ru/404-2/',
  'https://chastnayadacha.ru/about/',
  'https://chastnayadacha.ru/bronirovanie/',
  'https://chastnayadacha.ru/category/uncategorized/',
  'https://chastnayadacha.ru/dacha-map/',
  'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-4-sruba/',
  'https://chastnayadacha.ru/dacha-map/derevyannyj-srub-srub-15/',
  'https://chastnayadacha.ru/dacha-map/domik-s-vidom-na-volgu/',
  'https://chastnayadacha.ru/dacha-map/gostevoj-domik/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa-3p/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa-4p/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-17-18-1-etae/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-18-1-etazh/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa-premium-klassa-19-20-2-etazh/',
  'https://chastnayadacha.ru/dacha-map/gostinitsa/',
  'https://chastnayadacha.ru/dacha-map/otkrytaja-besedka-1/',
  'https://chastnayadacha.ru/dacha-map/otkrytye-besedki-2/',
  'https://chastnayadacha.ru/dacha-map/otkrytye-besedki/',
  'https://chastnayadacha.ru/dacha-map/zakrytaya-besedka/',
  'https://chastnayadacha.ru/hello-world/',
  'https://chastnayadacha.ru/karta/',
  'https://chastnayadacha.ru/pay/',
  'https://chastnayadacha.ru/pay/info/',
  'https://chastnayadacha.ru/polozhenie-o-bronirovanii-uslug/',
  'https://chastnayadacha.ru/service/',
  'https://chastnayadacha.ru/service/event/',
  'https://chastnayadacha.ru/service/playground/',
  'https://chastnayadacha.ru/service/pool/',
  'https://chastnayadacha.ru/service/restaurant/',
  'https://chastnayadacha.ru/service/territory/',
];

function urlToLocalPath(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\/$/, '');
  if (p === '') return path.join(STATIC_DIR, 'index.html');
  // Сохраняем структуру папок: /dacha-map/gostinitsa/ -> dacha-map/gostinitsa/index.html
  return path.join(STATIC_DIR, p, 'index.html');
}

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
  const u = new URL(pageUrl);
  // Глубина пути: / = 0, /about/ = 1, /dacha-map/gostinitsa/ = 2
  const depth = u.pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean).length;
  const root = depth === 0 ? './' : '../'.repeat(depth);

  return html
    .replace(/https:\/\/chastnayadacha\.ru\//g, root)
    .replace(/http:\/\/chastnayadacha\.ru\//g, root);
}

async function downloadPages() {
  console.log(`\nDownloading ${pages.length} HTML pages with proper folder structure...\n`);
  let ok = 0, fail = 0;

  for (const url of pages) {
    try {
      const { status, body } = await fetchUrl(url);
      const localPath = urlToLocalPath(url);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      const rewritten = rewriteHtml(body, url);
      fs.writeFileSync(localPath, rewritten, 'utf8');
      const rel = localPath.replace(STATIC_DIR, '').replace(/\\/g, '/');
      console.log(`  [${status}] ${url}`);
      console.log(`        -> ${rel}`);
      ok++;
    } catch (e) {
      console.error(`  [ERR] ${url}: ${e.message}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\nPages: ${ok} ok, ${fail} failed`);
}

function sftpDownloadDir(sftp, remotePath, localPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(localPath, { recursive: true });
    sftp.readdir(remotePath, (err, list) => {
      if (err) { console.error(`\n  readdir ERR ${remotePath}: ${err.message}`); return resolve(); }
      if (!list.length) return resolve();

      let done = 0;
      const total = list.length;

      list.forEach(item => {
        const remoteItem = `${remotePath}/${item.filename}`;
        const localItem = path.join(localPath, item.filename);

        const finish = () => { if (++done >= total) resolve(); };

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
      console.log('SSH connected for SFTP\n');
      conn.sftp((err, sftp) => {
        if (err) return reject(err);

        const tasks = [
          {
            name: 'uploads (media files)',
            remote: `${SITE_ROOT}/wp-content/uploads`,
            local: path.join(STATIC_DIR, 'wp-content/uploads')
          },
          {
            name: 'active theme files',
            remote: `${SITE_ROOT}/wp-content/themes/theme`,
            local: path.join(STATIC_DIR, 'wp-content/themes/theme')
          },
          {
            name: 'wp-includes/css',
            remote: `${SITE_ROOT}/wp-includes/css`,
            local: path.join(STATIC_DIR, 'wp-includes/css')
          },
          {
            name: 'wp-includes/js',
            remote: `${SITE_ROOT}/wp-includes/js`,
            local: path.join(STATIC_DIR, 'wp-includes/js')
          },
        ];

        (async () => {
          for (const task of tasks) {
            process.stdout.write(`\n[SFTP] ${task.name} `);
            await sftpDownloadDir(sftp, task.remote, task.local);
            console.log(` OK`);
          }
          conn.end();
          resolve();
        })();
      });
    });

    conn.on('error', e => { console.error('SSH error:', e.message); reject(e); });
    conn.connect(SSH_CONFIG);
  });
}

(async () => {
  console.log('=== Static Site Downloader for chastnayadacha.ru ===');
  console.log('Output:', STATIC_DIR);

  try {
    await downloadPages();

    console.log('\n--- Starting SFTP binary downloads ---');
    await downloadViaSFTP();

    // Итоговая статистика
    const { execSync } = require('child_process');
    try {
      const size = execSync(`du -sh "${STATIC_DIR.replace(/\//g, '/')}"`, { encoding: 'utf8' });
      console.log('\nTotal size:', size.trim());
    } catch(e) {}

    console.log('\n=== COMPLETE ===');
    console.log('Static site ready at:', STATIC_DIR);
  } catch(e) {
    console.error('\nFatal error:', e.message);
    process.exit(1);
  }
})();
