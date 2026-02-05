const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const FOLDERS_TO_REMOVE = ['assets', 'videos', 'thumbnails', 'thumbnail', 'blog-images', 'stickers', 'backgrounds'];

console.log('🧹 Cleaning build directory to reduce size...');

FOLDERS_TO_REMOVE.forEach(folder => {
    const folderPath = path.join(BUILD_DIR, folder);
    if (fs.existsSync(folderPath)) {
        console.log(`❌ Removing: ${folderPath}`);
        fs.rmSync(folderPath, { recursive: true, force: true });
    } else {
        console.log(`ℹ️  Not found (already clean): ${folder}`);
    }
});

console.log('✨ Build directory cleaned! Ready for Firebase deployment.');
