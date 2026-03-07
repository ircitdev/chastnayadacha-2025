/**
 * Download Google Fonts woff2 files from server and fix CSS to use relative paths
 */
const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const REMOTE_BASE = '/var/www/u2383407/data/www/chastnayadacha.ru/wp-content/uploads/elementor/google-fonts';
const LOCAL_BASE  = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/elementor/google-fonts';
const CSS_DIR = LOCAL_BASE + '/css';

// Collect all font URLs from CSS files
const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));
const fontUrls = new Set();

for (const cf of cssFiles) {
  const content = fs.readFileSync(path.join(CSS_DIR, cf), 'utf8');
  const matches = content.match(/https:\/\/chastnayadacha\.ru\/wp-content\/uploads\/elementor\/google-fonts\/fonts\/[^)'"\s]+/g) || [];
  matches.forEach(u => fontUrls.add(u));
}

const fontFiles = [...fontUrls].map(url => {
  const filename = url.split('/').pop();
  return { url, filename, remotePath: REMOTE_BASE + '/fonts/' + filename, localPath: path.join(LOCAL_BASE, 'fonts', filename) };
});

console.log('Total font files to download:', fontFiles.length);

// Create fonts dir
const fontsDir = path.join(LOCAL_BASE, 'fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }

    let done = 0, ok = 0, skip = 0, fail = 0;
    const total = fontFiles.length;

    if (total === 0) { fixCss(); conn.end(); return; }

    fontFiles.forEach(({ remotePath, localPath, filename }) => {
      if (fs.existsSync(localPath)) {
        process.stdout.write('s');
        skip++;
        if (++done >= total) { console.log('\nDownload done. ok:', ok, 'skip:', skip, 'fail:', fail); fixCss(); conn.end(); }
        return;
      }
      sftp.fastGet(remotePath, localPath, (e) => {
        if (e) { process.stdout.write('x'); console.error('\nFAIL:', filename, e.message); fail++; }
        else   { process.stdout.write('.'); ok++; }
        if (++done >= total) { console.log('\nDownload done. ok:', ok, 'skip:', skip, 'fail:', fail); fixCss(); conn.end(); }
      });
    });
  });
}).connect({ host: '37.140.192.74', port: 22, username: 'u2383407', password: 'UGp723jgu9lGGlsI' });

conn.on('error', e => { console.error(e.message); process.exit(1); });

function fixCss() {
  console.log('\nFixing CSS files to use relative paths...');
  for (const cf of cssFiles) {
    const cfPath = path.join(CSS_DIR, cf);
    let content = fs.readFileSync(cfPath, 'utf8');
    // CSS is in /css/ subfolder, fonts are in /fonts/ subfolder - so ../fonts/
    content = content.replace(/https:\/\/chastnayadacha\.ru\/wp-content\/uploads\/elementor\/google-fonts\/fonts\//g, '../fonts/');
    fs.writeFileSync(cfPath, content, 'utf8');
    console.log('Fixed:', cf);
  }
}
