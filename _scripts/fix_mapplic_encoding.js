const fs = require('fs');

const HTML = 'D:/DevTools/Database/2026chastnayadacha.ru/static/dacha-map/index.html';

let html = fs.readFileSync(HTML, 'utf8');

// Find the mapplic-map tag start
const tagStart = html.indexOf('<mapplic-map');
if (tagStart === -1) { console.log('No mapplic-map found'); process.exit(1); }

// Find data-json=" start
const djStart = html.indexOf(' data-json="', tagStart) + 12; // after data-json="

// Find the correct end of data-json value
// The value starts after data-json=" and ends at the next unescaped "
// Since it's HTML, " is encoded as &quot; inside the value
// So the first raw " after djStart ends the attribute
let djEnd = djStart;
while (djEnd < html.length && html[djEnd] !== '"') djEnd++;

const rawJson = html.substring(djStart, djEnd);
console.log('Current data-json length:', rawJson.length);

// Decode &quot; -> "
const decoded = rawJson.replace(/&quot;/g, '"');

// Parse and validate JSON
let obj;
try {
  obj = JSON.parse(decoded);
  console.log('JSON valid, locations:', obj.locations.length);
} catch(e) {
  console.log('JSON parse failed at current state:', e.message);
  // Try to find where JSON ends (first raw >)
  const firstGt = rawJson.indexOf('>');
  if (firstGt !== -1) {
    console.log('First > at position:', firstGt);
    const snippet = rawJson.substring(Math.max(0,firstGt-50), firstGt+50);
    console.log('Context:', snippet);
  }
  process.exit(1);
}

// Re-encode properly: replace " with &quot;, < with &lt;, > with &gt;
const properEncoded = JSON.stringify(obj)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

console.log('New data-json length:', properEncoded.length);

// Find the full opening tag properly (respecting quoted attributes)
const tagStartPos = tagStart;
let i = tagStartPos + 1;
let inQuote2 = false;
while (i < html.length) {
  const c = html[i];
  if (!inQuote2 && c === '"') inQuote2 = true;
  else if (inQuote2 && c === '"') inQuote2 = false;
  else if (!inQuote2 && c === '>') break;
  i++;
}
const actualTagEnd = i + 1;
console.log('Actual tag end pos:', actualTagEnd);
console.log('After tag:', JSON.stringify(html.substring(actualTagEnd, actualTagEnd + 30)));

// Replace old data-json value with properly encoded one
const before = html.substring(0, djStart);
const after = html.substring(djEnd);
html = before + properEncoded + after;

fs.writeFileSync(HTML, html, 'utf8');
console.log('Fixed! Written to', HTML);

// Verify
const verifyHtml = fs.readFileSync(HTML, 'utf8');
const verifyStart = verifyHtml.indexOf('data-json="', verifyHtml.indexOf('<mapplic-map')) + 11;
let verifyEnd = verifyStart;
while (verifyEnd < verifyHtml.length && verifyHtml[verifyEnd] !== '"') verifyEnd++;
const verifyRaw = verifyHtml.substring(verifyStart, verifyEnd);
const hasUnencodedAngles = verifyRaw.includes('<') || verifyRaw.includes('>');
console.log('Verification - has unencoded angles:', hasUnencodedAngles);
console.log('data-json starts with:', verifyRaw.substring(0, 30));
