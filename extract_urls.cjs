const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'public', 'rewrite.xml');
const content = fs.readFileSync(sitemapPath, 'utf8');

const regex = /<loc>(.*?)<\/loc>/g;
let match;
const urls = [];

while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
}

fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
console.log('URLs written to urls.json');
