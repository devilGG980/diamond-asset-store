const fs = require('fs');
const path = require('path');

const ASSETS_FILE = path.join(__dirname, '../src/data/assets.ts');
const BLOG_FILE = path.join(__dirname, '../src/data/blogSummaries.ts');

const BASE_CDN = 'https://cdn.jsdelivr.net/gh/devilGG980/diamond-asset-store@main';

const args = process.argv.slice(2);
const IS_REVERT = args.includes('--revert');

function createBackup(filePath) {
    const backupPath = filePath + '.bak';
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`📦 Created backup: ${path.basename(backupPath)}`);
    }
}

function restoreBackup(filePath) {
    const backupPath = filePath + '.bak';
    if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        console.log(`↩️ Restored from backup: ${path.basename(filePath)}`);
    } else {
        console.warn(`⚠️ No backup found for: ${path.basename(filePath)}`);
    }
}

// Helper to replace paths
function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    if (IS_REVERT) {
        restoreBackup(filePath);
        return;
    }

    createBackup(filePath);

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix: In assets.ts, it uses "/thumbnail/". On disk it's "public/thumbnail" AND "public/thumbnails"?
    // Update assets.ts specific patterns
    // We use a specific regex replacement to avoid double-replacing if ran multiple times (though backup handles idempotent runs mostly)

    // Replace '/assets/...' with '${BASE_CDN}/public/assets/...'
    // But only if it doesn't already start with http

    const replacements = [
        { find: /'\/assets\//g, replace: `'${BASE_CDN}/public/assets/` },
        { find: /'\/videos\//g, replace: `'${BASE_CDN}/public/videos/` },
        { find: /'\/thumbnail\//g, replace: `'${BASE_CDN}/public/thumbnail/` },
        { find: /'\/thumbnails\//g, replace: `'${BASE_CDN}/public/thumbnails/` },
        { find: /'\/blog-images\//g, replace: `'${BASE_CDN}/public/blog-images/` }
    ];

    replacements.forEach(({ find, replace }) => {
        content = content.replace(find, replace);
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${path.basename(filePath)} with CDN URLs.`);
    } else {
        console.log(`ℹ️ No changes needed for ${path.basename(filePath)}`);
    }
}

console.log(IS_REVERT ? '⏪ Reverting CDN URLs...' : '🚀 Applying jsDelivr CDN URLs...');

replaceInFile(ASSETS_FILE);
replaceInFile(BLOG_FILE);

console.log(IS_REVERT ? '✨ Revert complete.' : '✨ CDN update complete.');
