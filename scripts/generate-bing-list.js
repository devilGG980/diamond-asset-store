import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateBingList() {
    try {
        const hostname = 'https://editorvault.web.app';
        const urls = [];

        // Static pages
        const staticPages = [
            '/',
            '/store',
            '/blog',
            '/about',
            '/contact',
            '/privacy-policy',
            '/terms-of-service',
            '/faq',
            '/editor',
            '/pen-crop'
        ];

        staticPages.forEach(page => {
            urls.push(`${hostname}${page}`);
        });

        // Add category pages
        const categories = ['Transitions', 'Backgrounds', 'Music', 'Animations'];
        categories.forEach(category => {
            urls.push(`${hostname}/store?category=${encodeURIComponent(category)}`);
        });

        // Add Assets dynamically
        try {
            const assetsPath = resolve(__dirname, '../src/data/assets.ts');
            const assetsContent = readFileSync(assetsPath, 'utf8');
            const assetIdRegex = /id:\s*(\d+),/g;

            let match;
            console.log('📝 Scanning for assets...');
            while ((match = assetIdRegex.exec(assetsContent)) !== null) {
                const assetId = match[1];
                urls.push(`${hostname}/asset/${assetId}`);
            }
        } catch (err) {
            console.warn('⚠️ Could not read assets.ts:', err.message);
        }

        // Add Blog Posts dynamically
        try {
            const blogSummariesPath = resolve(__dirname, '../src/data/blogSummaries.ts');
            const blogContent = readFileSync(blogSummariesPath, 'utf8');
            const idRegex = /id:\s*['"`]([^'"`]+)['"`]/g;

            let match;
            console.log('📝 Scanning for blog posts...');
            while ((match = idRegex.exec(blogContent)) !== null) {
                const blogId = match[1];
                urls.push(`${hostname}/blog/${blogId}`);
            }
        } catch (err) {
            console.warn('⚠️ Could not read blogSummaries.ts:', err.message);
        }

        // Write bing.txt
        const bingListPath = resolve(__dirname, '../bing.txt');
        const content = urls.join('\n');
        writeFileSync(bingListPath, content, 'utf8');
        console.log(`✅ bing.txt generated successfully with ${urls.length} URLs`);

    } catch (error) {
        console.error('❌ Error generating bing list:', error);
    }
}

// Run the script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    generateBingList();
}

export { generateBingList };
