const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const outputPath = path.join(__dirname, '../urls_for_indexing.txt');

const content = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = content.match(/\u003cloc\u003e(.*?)\u003c\/loc\u003e/g);

if (urlMatches) {
    const urls = urlMatches.map(match => match.replace(/\u003cloc\u003e|\u003c\/loc\u003e/g, ''));
    fs.writeFileSync(outputPath, urls.join('\n'), 'utf8');
    console.log(`✅ Extracted ${urls.length} URLs to urls_for_indexing.txt`);
    console.log('\nFirst 10 URLs:');
    urls.slice(0, 10).forEach(url => console.log(url));
} else {
    console.log('❌ No URLs found in sitemap');
}
