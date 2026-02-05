import fs from 'fs';
import { parseStringPromise } from 'xml2js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateSitemap() {
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    try {
        const xml = fs.readFileSync(sitemapPath, 'utf8');
        const result = await parseStringPromise(xml);
        console.log('Valid XML');
        console.log('URL Count:', result.urlset.url.length);
    } catch (err) {
        console.error('Invalid XML:', err);
        process.exit(1);
    }
}

validateSitemap();
