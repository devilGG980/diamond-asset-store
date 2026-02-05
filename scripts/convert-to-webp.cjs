const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to convert
const TARGET_DIRS = ['public', 'src/assets'];

// WebP quality
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1280;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function convertToWebP(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    // Only process JPEG and PNG
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return { skipped: true, reason: 'not convertible' };
    }

    const dir = path.dirname(filePath);
    const name = path.basename(filePath, ext);
    const webpPath = path.join(dir, name + '.webp');

    // Skip if WebP already exists
    if (fs.existsSync(webpPath)) {
        return { skipped: true, reason: 'webp exists' };
    }

    try {
        const originalSize = fs.statSync(filePath).size;

        await sharp(filePath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

        const webpSize = fs.statSync(webpPath).size;

        // Only keep WebP if it's smaller
        if (webpSize < originalSize) {
            return {
                converted: true,
                originalSize,
                webpSize,
                saved: originalSize - webpSize,
                path: webpPath
            };
        } else {
            fs.unlinkSync(webpPath);
            return { skipped: true, reason: 'webp larger' };
        }
    } catch (error) {
        console.error(`Error converting ${filePath}:`, error.message);
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
            await processDirectory(path.join(dirPath, file));
        } else {
            if (/\.(jpg|jpeg|png)$/i.test(file)) {
                console.log(`Converting: ${path.join(dirPath, file)}`);
                const result = await convertToWebP(filePath);

                if (result.converted) {
                    console.log(`✅ Converted ${file}: ${formatBytes(result.originalSize)} -> ${formatBytes(result.webpSize)} (Saved ${formatBytes(result.saved)})`);
                } else if (result.skipped) {
                    console.log(`⏭️  Skipped ${file}: ${result.reason}`);
                }
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting WebP conversion...');

    const rootDirs = ['public', 'src/assets'];

    for (const dir of rootDirs) {
        await processDirectory(dir);
    }

    console.log('✨ WebP conversion complete!');
}

main();
