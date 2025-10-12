const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg').default || require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant').default || require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp').default || require('imagemin-webp');
const fs = require('fs');
const path = require('path');

const THUMBNAIL_DIR = path.join(__dirname, '../public/thumbnail');
const OPTIMIZED_DIR = path.join(__dirname, '../public/thumbnails/optimized');

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');

  try {
    // Get all image files from thumbnails directory
    const files = fs.readdirSync(THUMBNAIL_DIR).filter(file => {
      return /\.(jpg|jpeg|png)$/i.test(file);
    });

    console.log(`Found ${files.length} images to optimize`);

    for (const file of files) {
      const inputPath = path.join(THUMBNAIL_DIR, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);
      const webpPath = path.join(OPTIMIZED_DIR, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      // Skip if already optimized
      if (fs.existsSync(outputPath) && fs.existsSync(webpPath)) {
        console.log(`⏭️  Skipping ${file} (already optimized)`);
        continue;
      }

      console.log(`🔧 Optimizing ${file}...`);

      // Create multiple sizes for responsive images
      const sizes = [
        { suffix: '', width: 400, height: 300 },
        { suffix: '@2x', width: 800, height: 600 },
        { suffix: '_thumb', width: 200, height: 150 }
      ];

      for (const size of sizes) {
        const sizedFileName = file.replace(
          /\.(jpg|jpeg|png)$/i,
          `${size.suffix}.$1`
        );
        const sizedOutputPath = path.join(OPTIMIZED_DIR, sizedFileName);
        const sizedWebpPath = path.join(OPTIMIZED_DIR, sizedFileName.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

        // Generate optimized JPEG/PNG
        await sharp(inputPath)
          .resize(size.width, size.height, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85, progressive: true })
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(sizedOutputPath);

        // Generate WebP version
        await sharp(inputPath)
          .resize(size.width, size.height, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 80, effort: 6 })
          .toFile(sizedWebpPath);
      }

      console.log(`✅ Optimized ${file}`);
    }

    // Sharp already provides good compression, skipping additional imagemin step

    console.log('🎉 Image optimization complete!');
    console.log(`📊 Optimized images saved to: ${OPTIMIZED_DIR}`);

  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

// Generate manifest file with image info
async function generateImageManifest() {
  const manifest = {};
  const files = fs.readdirSync(OPTIMIZED_DIR);

  for (const file of files) {
    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const filePath = path.join(OPTIMIZED_DIR, file);
      const stats = fs.statSync(filePath);
      const baseName = file.replace(/(@2x|_thumb)?\.(jpg|jpeg|png|webp)$/i, '');

      if (!manifest[baseName]) {
        manifest[baseName] = {};
      }

      const sizeKey = file.includes('@2x') ? 'large' : 
                      file.includes('_thumb') ? 'thumbnail' : 'medium';
      const format = path.extname(file).substring(1);

      if (!manifest[baseName][sizeKey]) {
        manifest[baseName][sizeKey] = {};
      }

      manifest[baseName][sizeKey][format] = {
        path: `/thumbnails/optimized/${file}`,
        size: stats.size
      };
    }
  }

  fs.writeFileSync(
    path.join(OPTIMIZED_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('📋 Generated image manifest');
}

if (require.main === module) {
  optimizeImages().then(() => generateImageManifest());
}

module.exports = { optimizeImages, generateImageManifest };