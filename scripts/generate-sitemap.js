import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSitemapXml() {
  try {
    const hostname = 'https://editorvault.web.app';
    const urls = [];
    const today = new Date().toISOString().split('T')[0];

    // Helper to create XML entry
    const createEntry = (url, priority = '0.80', changefreq = 'weekly') => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

    // Static pages
    const staticPages = [
      { path: '/', priority: '1.00', changefreq: 'daily' },
      { path: '/store', priority: '0.90', changefreq: 'daily' },
      { path: '/blog', priority: '0.90', changefreq: 'daily' },
      { path: '/about', priority: '0.60', changefreq: 'monthly' },
      { path: '/contact', priority: '0.60', changefreq: 'monthly' },
      { path: '/privacy-policy', priority: '0.30', changefreq: 'yearly' },
      { path: '/terms-of-service', priority: '0.30', changefreq: 'yearly' },
      { path: '/faq', priority: '0.50', changefreq: 'monthly' },
      { path: '/editor', priority: '0.70', changefreq: 'monthly' },
      { path: '/pen-crop', priority: '0.60', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      urls.push(createEntry(`${hostname}${page.path}`, page.priority, page.changefreq));
    });

    // Add category pages
    const categories = ['Transitions', 'Backgrounds', 'Music', 'Animations'];
    categories.forEach(category => {
      urls.push(createEntry(`${hostname}/store?category=${encodeURIComponent(category)}`, '0.85', 'weekly'));
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
        urls.push(createEntry(`${hostname}/asset/${assetId}`, '0.80', 'monthly'));
      }
    } catch (err) {
      console.warn('⚠️ Could not read assets.ts:', err.message);
    }

    // Add Blog Posts dynamically
    try {
      const blogSummariesPath = resolve(__dirname, '../src/data/blogSummaries.ts');
      const blogContent = readFileSync(blogSummariesPath, 'utf8');
      const idRegex = /id:\s*['"`]([^'"`]+)['"`]/g;

      // Try to match dates too if possible, but for now default to today
      // In a real scenario, we'd parse the full object, but regex is faster for this script

      let match;
      console.log('📝 Scanning for blog posts...');
      while ((match = idRegex.exec(blogContent)) !== null) {
        const blogId = match[1];
        urls.push(createEntry(`${hostname}/blog/${blogId}`, '0.80', 'monthly'));
      }
      // Manually add blog posts that might have been missed or if regex fails (safety)
      // but regex should catch the IDs as they are standard string literals

    } catch (err) {
      console.warn('⚠️ Could not read blogSummaries.ts:', err.message);
    }

    // Generate XML content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('')}
</urlset>`;

    // Write sitemap.xml
    const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
    writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`✅ sitemap.xml generated successfully with ${urls.length} URLs`);

    // Cleanup old files
    const oldFiles = [
      '../public/sitemap.txt',
      '../public/rewrite.xml',
      '../public/sitemap-images.xml'
    ];

    oldFiles.forEach(file => {
      const filePath = resolve(__dirname, file);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log(`🗑️  Removed old file: ${file}`);
      }
    });

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Run the sitemap generation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemapXml();
}

export { generateSitemapXml };