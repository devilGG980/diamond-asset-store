const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg').default || require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant').default || require('imagemin-pngquant');

// Directories to scan for images
const TARGET_DIRS = [
    'public',
    'public/assets',
    'public/assets/blog', // Added based on find_by_name results
    'public/blog-images',
    'public/backgrounds',
    'public/stickers',
    'src/assets'
];

// Configuration
const QUALITY_JPEG = 75;
const QUALITY_PNG = 75; // 0-100, used by pngquant (converted to 0-1 range)
const QUALITY_WEBP = 75;
const MAX_WIDTH = 1280; // Down from 1600px for stricter 1MB limit

// Helper to get formatted file size using 1024 for KB
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function compressImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const tempPath = filePath + '.tmp';

    try {
        const stats = fs.statSync(filePath);
        const originalSize = stats.size;

        // Skip small files (< 10KB) to avoid overhead
        if (originalSize < 10 * 1024) {
            return { skipped: true, reason: 'too small' };
        }

        let buffer;

        if (ext === '.jpg' || ext === '.jpeg') {
            // Use sharp for resizing/optimizing first, then imagemin for final squeeze if needed, 
            // but sharp's mozjpeg integration is usually best alone.
            // Let's stick effectively to Sharp for consistency and speed, 
            // but use imagemin if sharp fails or for specific pngquant needs.
            // Actually, sharp has mozjpeg and pngquant built-in/linked usually.
            // Let's try sharp first.

            await sharp(filePath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .jpeg({ quality: QUALITY_JPEG, mozjpeg: true })
                .toFile(tempPath);

        } else if (ext === '.png') {
            await sharp(filePath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .png({ quality: QUALITY_PNG, compressionLevel: 9, palette: true }) // palette: true enables pngquant-like behavior
                .toFile(tempPath);

        } else if (ext === '.webp') {
            await sharp(filePath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: QUALITY_WEBP })
                .toFile(tempPath);
        } else {
            return { skipped: true, reason: 'unsupported format' };
        }

        const newStats = fs.statSync(tempPath);
        const newSize = newStats.size;

        if (newSize < originalSize) {
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            return {
                compressed: true,
                originalSize,
                newSize,
                saved: originalSize - newSize
            };
        } else {
            fs.unlinkSync(tempPath); // Discard if larger
            return { skipped: true, reason: 'already optimized' };
        }

    } catch (error) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.error(`Error processing ${filePath}:`, error.message);
        return { error: true, message: error.message };
    }
}

async function processDirectory(dirPath) {
    const fullPath = path.resolve(__dirname, '..', dirPath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(fullPath);

    for (const file of files) {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursive? The list has specific subdirs, but let's be safe and just do one level for now
            // unless it matches our target list logic. 
            // For now, let's just stick to the top level of the provided directories list 
            // to avoid accidental processing of node_modules or build dirs if misconfigured.
            // However, 'public/assets' might have deeper structures.
            // Let's add a simple check: if it's a directory and NOT in our exclusion list, verify?
            // Actually, safely Recurse if it's a subdirectory of a target dir.
            await processDirectory(path.join(dirPath, file));
        } else {
            if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
                console.log(`Processing: ${path.join(dirPath, file)}`);
                const result = await compressImage(filePath);

                if (result.compressed) {
                    console.log(`✅ Optimized ${file}: ${formatBytes(result.originalSize)} -> ${formatBytes(result.newSize)} (Saved ${formatBytes(result.saved)})`);
                } else if (result.skipped) {
                    console.log(`⏭️  Skipped ${file}: ${result.reason}`);
                }
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting project-wide image compression...');

    // We iterate over the ROOT targets. The recursive function handles subdirectories.
    // But wait, `processDirectory` takes a relative path.
    // We should be careful not to process the same dir twice if one is a child of another in TARGET_DIRS.
    // TARGET_DIRS contains 'public' and 'public/assets'. Processing 'public' recursively will cover 'public/assets'.
    // So we should just start with 'public' and 'src/assets'?

    // Let's refine the starting points.
    const rootDirs = ['public', 'src/assets'];

    for (const dir of rootDirs) {
        await processDirectory(dir);
    }

    console.log('✨ All done!');
}

main();
