const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

async function generateSitemap() {
  try {
    const hostname = 'https://videoforges.web.app';
    
    // Create sitemap stream
    const sitemap = new SitemapStream({ hostname });
    const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap.xml'));
    sitemap.pipe(writeStream);

    // Static pages with priority and frequency
    const pages = [
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        url: '/store',
        changefreq: 'daily', 
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        url: '/about',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      },
      {
        url: '/contact',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString()
      },
      {
        url: '/privacy-policy',
        changefreq: 'yearly',
        priority: 0.4,
        lastmod: new Date().toISOString()
      },
      {
        url: '/terms-of-service',
        changefreq: 'yearly',
        priority: 0.4,
        lastmod: new Date().toISOString()
      },
      {
        url: '/ads',
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: new Date().toISOString()
      },
      {
        url: '/quick-ads',
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: new Date().toISOString()
      }
    ];

    // Add category pages
    const categories = ['Transitions', 'Backgrounds', 'Music', 'Animations'];
    categories.forEach(category => {
      pages.push({
        url: `/store?category=${encodeURIComponent(category)}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString()
      });
    });

    // Add pages to sitemap
    pages.forEach(page => {
      sitemap.write(page);
    });

    // Note: In a real application, you would also add dynamic asset pages here
    // For example:
    // mockAssets.forEach(asset => {
    //   sitemap.write({
    //     url: `/asset/${asset.id}`,
    //     changefreq: 'weekly',
    //     priority: 0.7,
    //     lastmod: asset.updatedAt || new Date().toISOString()
    //   });
    // });

    // Add common search terms as pages
    const popularSearches = [
      'video transitions',
      'video backgrounds', 
      'royalty free music',
      'motion graphics',
      'youtube assets',
      'premiere pro assets',
      'after effects templates'
    ];

    popularSearches.forEach(search => {
      pages.push({
        url: `/store?search=${encodeURIComponent(search)}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString()
      });
    });

    // End sitemap
    sitemap.end();

    // Wait for sitemap generation to complete
    await streamToPromise(sitemap);
    
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    
    // Generate additional sitemaps for different content types
    await generateImageSitemap();
    await generateVideoSitemap();
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

async function generateImageSitemap() {
  try {
    const hostname = 'https://videoforges.web.app';
    const sitemap = new SitemapStream({ 
      hostname,
      xmlns: {
        image: 'http://www.google.com/schemas/sitemap-image/1.1'
      }
    });
    const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap-images.xml'));
    sitemap.pipe(writeStream);

    // Add image entries - in a real app, you'd iterate through actual assets
    const sampleImages = [
      {
        url: '/',
        img: [
          {
            url: `${hostname}/og-image.jpg`,
            title: 'Video Forge - Free Video Editing Assets',
            caption: 'Professional video editing assets marketplace'
          }
        ]
      },
      {
        url: '/store',
        img: [
          {
            url: `${hostname}/store-hero.jpg`,
            title: 'Free Video Editing Assets Store',
            caption: 'Browse professional editing resources'
          }
        ]
      }
    ];

    sampleImages.forEach(page => {
      sitemap.write(page);
    });

    sitemap.end();
    await streamToPromise(sitemap);
    console.log('✅ Image sitemap generated successfully');
  } catch (error) {
    console.error('❌ Error generating image sitemap:', error);
  }
}

async function generateVideoSitemap() {
  try {
    const hostname = 'https://videoforges.web.app';
    const sitemap = new SitemapStream({ 
      hostname,
      xmlns: {
        video: 'http://www.google.com/schemas/sitemap-video/1.1'
      }
    });
    const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap-videos.xml'));
    sitemap.pipe(writeStream);

    // Add video entries - in a real app, you'd iterate through actual video assets
    const sampleVideos = [
      {
        url: '/store',
        video: [
          {
            thumbnail_loc: `${hostname}/video-preview-thumb.jpg`,
            title: 'Free Video Editing Assets Preview',
            description: 'Preview of professional video editing assets available on Video Forge',
            content_loc: `${hostname}/preview-video.mp4`,
            duration: 30,
            publication_date: new Date().toISOString(),
            family_friendly: 'yes',
            live: 'no'
          }
        ]
      }
    ];

    sampleVideos.forEach(page => {
      sitemap.write(page);
    });

    sitemap.end();
    await streamToPromise(sitemap);
    console.log('✅ Video sitemap generated successfully');
  } catch (error) {
    console.error('❌ Error generating video sitemap:', error);
  }
}

// Run the sitemap generation
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };