const fs = require('fs');
const path = require('path');

// Read blogSummaries.ts
const blogSummariesPath = 'src/data/blogSummaries.ts';
const blogSummariesContent = fs.readFileSync(blogSummariesPath, 'utf8');

// Extract all image paths
const imageMatches = blogSummariesContent.match(/image:\s*'([^']+)'/g);
const imagePaths = imageMatches ? imageMatches.map(match => {
    const pathMatch = match.match(/image:\s*'([^']+)'/);
    return pathMatch ? pathMatch[1] : null;
}).filter(Boolean) : [];

// Convert to filenames
const requiredImages = imagePaths.map(p => p.replace('/blog-images/', ''));

console.log('Required images from blogSummaries.ts:');
console.log(JSON.stringify(requiredImages, null, 2));

// Check which ones exist
const blogImagesDir = 'public/blog-images';
const existingFiles = fs.readdirSync(blogImagesDir);

console.log('\n\nExisting files in public/blog-images:');
console.log(JSON.stringify(existingFiles, null, 2));

// Find missing
const missing = requiredImages.filter(img => !existingFiles.includes(img));
console.log('\n\nMISSING FILES:');
console.log(JSON.stringify(missing, null, 2));
