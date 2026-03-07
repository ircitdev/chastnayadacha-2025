const http = require('http');
const fs = require('fs');
const path = require('path');

const STATIC_DIR = path.join(__dirname, 'static');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.mp4':  'video/mp4',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
};

const server = http.createServer((req, res) => {
  // Clean URL: remove query string
  let urlPath = req.url.split('?')[0];

  // Decode URI
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}

  // Map to file
  let filePath = path.join(STATIC_DIR, urlPath);

  // If directory -> serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If no extension and no index.html found, try adding /index.html
  if (!fs.existsSync(filePath)) {
    const withIndex = filePath + '/index.html';
    if (fs.existsSync(withIndex)) {
      filePath = withIndex;
    } else {
      // 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      console.log('404', urlPath);
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
    console.log('200', urlPath);
  } catch(e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Error: ' + e.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n✓ Server running at http://localhost:${PORT}/`);
  console.log(`  Main site:      http://localhost:${PORT}/`);
  console.log(`  Virtual tour:   http://localhost:${PORT}/tur/`);
  console.log('\nPress Ctrl+C to stop.\n');
});
