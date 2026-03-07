/**
 * Download Google Fonts woff2 from the original CSS files
 * The CSS files reference fonts by hashed filename - we need to find the original Google URLs
 *
 * Alternative approach: re-request fonts from Google Fonts API directly
 * and save them with the same hashed filenames
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOCAL_BASE = 'D:/DevTools/Database/2026chastnayadacha.ru/static/wp-content/uploads/elementor/google-fonts';
const FONTS_DIR = path.join(LOCAL_BASE, 'fonts');
const CSS_DIR = path.join(LOCAL_BASE, 'css');

if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });

// Read all CSS files to get font filenames
const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));

// Collect font filenames that we need
const neededFonts = new Set();
for (const cf of cssFiles) {
  const content = fs.readFileSync(path.join(CSS_DIR, cf), 'utf8');
  const matches = content.match(/\.\.\/fonts\/([^)'"]+\.woff2)/g) || [];
  matches.forEach(m => {
    const fname = m.replace('../fonts/', '');
    if (!fs.existsSync(path.join(FONTS_DIR, fname))) {
      neededFonts.add(fname);
    }
  });
}

console.log('Need to download', neededFonts.size, 'font files');

// Font family -> Google Fonts API name mapping
// We'll download fresh CSS from Google with woff2 format and map filenames
const FONT_REQUESTS = [
  { family: 'Ubuntu', weights: '300,300i,400,400i,500,500i,700,700i' },
  { family: 'Montserrat', weights: '100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i' },
  { family: 'Playfair+Display', weights: '400,400i,500,500i,600,600i,700,700i,800,800i,900,900i' },
  { family: 'Dosis', weights: '200,300,400,500,600,700,800' },
  { family: 'Roboto+Slab', weights: '100,200,300,400,500,600,700,800,900' },
];

// User agent that returns woff2
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const req = https.request({
      hostname: opts.hostname,
      path: opts.pathname + opts.search,
      headers: { 'User-Agent': UA, ...headers },
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpsGet(res.headers.location, headers));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function downloadFont(url, localPath) {
  const r = await httpsGet(url, {});
  if (r.status === 200) {
    fs.writeFileSync(localPath, r.body);
    return true;
  }
  return false;
}

// Parse Google Fonts CSS to get actual font URLs
async function getFontUrls(family, weights) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,${weights.split(',').filter(w=>!w.includes('i')).join(';0,')};1,${weights.split(',').filter(w=>w.includes('i')).map(w=>w.replace('i','')).join(';1,')}&display=swap`;

  // Simpler URL
  const simpleUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights.replace(/i/g,'').replace(/,,/g,',')}&display=swap`;

  try {
    const r = await httpsGet(simpleUrl, { 'User-Agent': UA });
    if (r.status !== 200) return [];
    const css = r.body.toString('utf8');
    const matches = css.match(/https:\/\/fonts\.gstatic\.com[^)'"]+\.woff2/g) || [];
    return matches;
  } catch(e) {
    console.error('Error fetching', family, e.message);
    return [];
  }
}

// Since we can't easily match Google's hashed filenames, let's try a different approach:
// Download ALL fonts from Google and save them with filenames that Elementor expects
// The hash is based on the font URL, let's figure out the pattern

// Actually, let's look at what CSS says about which font each file is for
// and download with the correct filename by fetching Google's CSS and matching

async function main() {
  // Read the CSS to understand what we have
  // ubuntu.css has ../fonts/ubuntu-4icp...woff2
  // These are Google's CDN URLs hashed - Elementor downloads them from fonts.gstatic.com
  // and saves with their own naming scheme

  // The best approach: download Google's CSS, get the actual woff2 URLs,
  // then download those files and figure out the correct local filenames

  // Elementor naming: they take the URL hash from fonts.gstatic.com
  // e.g. https://fonts.gstatic.com/s/ubuntu/v20/4iCp6KVjbNBYlgoKejZftVyCN4ffgg.woff2
  // -> ubuntu-4icp6kvjbnbylgokejzftvycn4ffgg.woff2
  // Pattern: {family}-{path_hash_lowercase}.woff2

  function urlToFilename(fontFamily, gstaticUrl) {
    // Extract path part after /s/fontname/version/
    const match = gstaticUrl.match(/\/s\/[^/]+\/[^/]+\/(.+)\.woff2/);
    if (!match) return null;
    const hash = match[1].replace(/\//g, '').toLowerCase();
    return fontFamily.toLowerCase() + '-' + hash + '.woff2';
  }

  const downloaded = new Map(); // url -> localFilename
  let totalOk = 0, totalFail = 0;

  for (const { family, weights } of FONT_REQUESTS) {
    const familyClean = family.replace(/\+/g, ' ');
    const familyKey = family.replace(/\+/g, '').toLowerCase();

    console.log('\nFetching CSS for', familyClean);

    // Get all variants
    const url = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;
    let r;
    try {
      r = await httpsGet(url, {});
    } catch(e) {
      console.error('Failed to fetch Google CSS:', e.message);
      continue;
    }
    if (r.status !== 200) { console.error('Status:', r.status); continue; }

    const css = r.body.toString('utf8');
    const fontUrls = css.match(/https:\/\/fonts\.gstatic\.com[^)'"]+\.woff2/g) || [];
    console.log('Found', fontUrls.length, 'font URLs');

    for (const fUrl of fontUrls) {
      const localName = urlToFilename(familyKey, fUrl);
      if (!localName) { console.log('Could not determine filename for:', fUrl); continue; }

      const localPath = path.join(FONTS_DIR, localName);

      if (fs.existsSync(localPath)) {
        process.stdout.write('s');
        continue;
      }

      // Check if this file is needed
      // (skip if not referenced by any CSS)

      try {
        const ok = await downloadFont(fUrl, localPath);
        if (ok) { process.stdout.write('.'); totalOk++; }
        else { process.stdout.write('x'); totalFail++; }
      } catch(e) {
        process.stdout.write('x');
        totalFail++;
      }
    }
    console.log('');
  }

  console.log('\nDone. Downloaded:', totalOk, 'failed:', totalFail);

  // Check coverage
  let stillMissing = 0;
  for (const fname of neededFonts) {
    if (!fs.existsSync(path.join(FONTS_DIR, fname))) {
      console.log('Still missing:', fname);
      stillMissing++;
    }
  }
  if (stillMissing === 0) console.log('All needed fonts are now available!');
  else console.log('Still missing', stillMissing, 'fonts');
}

main().catch(console.error);
