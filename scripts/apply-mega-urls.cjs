const fs = require('fs');
const path = require('path');

const MAPPING_FILE = path.join(__dirname, 'mega-url-mapping.json');
const ASSETS_FILE = path.join(__dirname, '../src/data/assets.ts');
const BLOG_FILE = path.join(__dirname, '../src/data/blogSummaries.ts');

if (!fs.existsSync(MAPPING_FILE)) {
    console.error('❌ Mapping file not found!');
    process.exit(1);
}

const urlMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
console.log(`📂 Loaded ${Object.keys(urlMapping).length} mappings.`);

// Helper to normalize paths for comparison
function normalizeEntry(entryPath) {
    // entryPath is like "public/assets/file.jpg" or "src/assets/blog/file.jpg"
    return entryPath.replace(/\\/g, '/');
}

// 1. Update assets.ts
let assetsContent = fs.readFileSync(ASSETS_FILE, 'utf8');
let assetsChanged = 0;

// Replaces:
// thumbnail: '/thumbnail/foo.png' -> thumbnail: 'https://mega...'
// downloadUrl: '/videos/foo.mp4' -> downloadUrl: 'https://mega...'
// previewVideo: '/videos/foo.mp4' -> previewVideo: 'https://mega...'
// thumbnail: '/assets/foo.jpg' -> (if any)

// Strategy: Iterate over mapping and replace exact filenames if they match specific patterns
// Be careful not to replace partial matches incorrectly.

for (const [localPath, megaUrl] of Object.entries(urlMapping)) {
    const normalized = normalizeEntry(localPath);
    const filename = path.basename(normalized);

    // Pattern 1: /thumbnail/FILENAME
    if (normalized.includes('public/thumbnails/')) {
        const search = `/thumbnail/${filename}`;
        if (assetsContent.includes(search)) {
            assetsContent = assetsContent.split(search).join(megaUrl);
            assetsChanged++;
            // console.log(`Updated assets.ts: ${search} -> MEGA`);
        }
    }

    // Pattern 2: /videos/FILENAME
    if (normalized.includes('public/videos/')) {
        const search = `/videos/${filename}`;
        if (assetsContent.includes(search)) {
            assetsContent = assetsContent.split(search).join(megaUrl);
            assetsChanged++;
            // console.log(`Updated assets.ts: ${search} -> MEGA`);
        }
    }

    // Pattern 3: /assets/FILENAME (if used)
    if (normalized.includes('public/assets/')) {
        const search = `/assets/${filename}`;
        if (assetsContent.includes(search)) {
            assetsContent = assetsContent.split(search).join(megaUrl);
            assetsChanged++;
        }
    }
}

fs.writeFileSync(ASSETS_FILE, assetsContent);
console.log(`✅ Updated assets.ts with ${assetsChanged} replacements.`);

// 2. Update blogSummaries.ts
let blogContent = fs.readFileSync(BLOG_FILE, 'utf8');
let blogChanged = 0;

for (const [localPath, megaUrl] of Object.entries(urlMapping)) {
    const normalized = normalizeEntry(localPath);
    const filename = path.basename(normalized);

    // Pattern: /blog-images/FILENAME
    // Mapping might come from 'public/blog-images/foo.jpg' OR 'src/assets/blog/foo.jpg'

    let search = '';
    if (normalized.includes('public/blog-images/')) {
        search = `/blog-images/${filename}`;
    } else if (normalized.includes('src/assets/blog/')) {
        // Some might be referenced as /blog-images/ even if source is here, 
        // or maybe referenced differently.
        // Let's assume standard usage is /blog-images/ mapped to public
        search = `/blog-images/${filename}`;
    }

    if (search && blogContent.includes(search)) {
        blogContent = blogContent.split(search).join(megaUrl);
        blogChanged++;
        // console.log(`Updated blogSummaries.ts: ${search} -> MEGA`);
    }
}

fs.writeFileSync(BLOG_FILE, blogContent);
console.log(`✅ Updated blogSummaries.ts with ${blogChanged} replacements.`);
