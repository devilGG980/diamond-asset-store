const fs = require('fs');
const path = require('path');

const sitemapTxtPath = path.join(__dirname, '../public/sitemap.txt');
const sitemapXmlPath = path.join(__dirname, '../public/sitemap.xml');

try {
    const content = fs.readFileSync(sitemapTxtPath, 'utf8');
    const urls = content.split('\n').filter(url => url.trim() !== '');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(sitemapXmlPath, xmlContent);
    console.log('Successfully created sitemap.xml with ' + urls.length + ' URLs.');
} catch (err) {
    console.error('Error converting sitemap:', err);
    process.exit(1);
}
