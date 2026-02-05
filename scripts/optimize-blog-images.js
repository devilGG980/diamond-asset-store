import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_IMAGES_DIR = path.join(__dirname, '../public/blog-images');
const MAX_WIDTH = 1200;
const QUALITY = 80;

async function optimizeBlogImages() {
    console.log('🖼️  Starting blog image optimization...');

    if (!fs.existsSync(BLOG_IMAGES_DIR)) {
        console.error(`❌ Directory not found: ${BLOG_IMAGES_DIR}`);
        return;
    }

    const files = fs.readdirSync(BLOG_IMAGES_DIR).filter(file => {
        return /\.(jpg|jpeg|png)$/i.test(file);
    });

    console.log(`Found ${files.length} images to process.`);

    let savedBytes = 0;

    for (const file of files) {
        const inputPath = path.join(BLOG_IMAGES_DIR, file);
        const tempPath = path.join(BLOG_IMAGES_DIR, `temp_${file}`);

        const stats = fs.statSync(inputPath);
        const originalSize = stats.size;

        // Skip small images (< 150KB) as they are likely already optimized or simple icons
        if (originalSize < 150 * 1024) {
            console.log(`Skipping ${file} - small enough (${(originalSize / 1024).toFixed(2)} KB)`);
            continue;
        }

        console.log(`Optimizing ${file} (${(originalSize / 1024).toFixed(2)} KB)...`);

        try {
            const metadata = await sharp(inputPath).metadata();
            const needsResize = metadata.width > MAX_WIDTH;

            let pipeline = sharp(inputPath);

            if (needsResize) {
                pipeline = pipeline.resize(MAX_WIDTH);
            }

            if (file.toLowerCase().endsWith('.png')) {
                pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8, palette: true });
            } else {
                pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
            }

            await pipeline.toFile(tempPath);

            const newStats = fs.statSync(tempPath);
            const newSize = newStats.size;

            if (newSize < originalSize) {
                fs.unlinkSync(inputPath);
                fs.renameSync(tempPath, inputPath);
                const saved = originalSize - newSize;
                savedBytes += saved;
                console.log(`✅ Optimized ${file}: Saved ${(saved / 1024).toFixed(2)} KB (-${((saved / originalSize) * 100).toFixed(1)}%)`);
            } else {
                // If optimization didn't help (rare), keep original
                fs.unlinkSync(tempPath);
                console.log(`⚠️  No savings for ${file}, keeping original.`);
            }

        } catch (err) {
            console.error(`❌ Error optimizing ${file}:`, err);
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    }

    console.log('🎉 Optimization complete!');
    console.log(`💾 Total space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

optimizeBlogImages();
