const { Client } = require('D:/DevTools/NodeJS/global_modules/node_modules/ssh2');
const https = require('https');

// Просто скачаем страницу about через HTTPS
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

(async () => {
  const html = await get('https://chastnayadacha.ru/about/');
  const matches = html.match(/uploads\/2021\/09\/about[^"'<> ]*/g) || [];
  const unique = [...new Set(matches)].sort();
  console.log('About paths on live site:');
  unique.forEach(u => console.log(' ', u));
})().catch(console.error);
