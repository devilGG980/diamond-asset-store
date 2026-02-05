// This file will append the 10 new blogs to the working original
const fs = require('fs');

// Read the clean working content (first 1552 lines)
const workingContent = fs.readFileSync('src/data/blogContent_backup.ts', 'utf8');

// Find the last blog ending
const lastBlogEnd = workingContent.indexOf("A properly calibrated $400 monitor beats an uncalibrated $1000 monitor. Invest in calibration tools, not just screen size.`");

if (lastBlogEnd === -1) {
    console.error('Could not find end marker');
    process.exit(1);
}

// Get content up to end of last blog
const baseContent = workingContent.substring(0, lastBlogEnd + 121); // 121 is length of the marker string

// New simple blog content (no inline code backticks to avoid conflicts)
const newBlogs = `,
    'youtube-thumbnail-size-new': \`# YouTube Thumbnail Size 2024

The perfect thumbnail starts with correct dimensions. YouTube requires 1280x720 pixels at 16:9 ratio with a 2MB maximum file size.

## Standard Specifications

YouTube officially recommends 1280 x 720 pixels for all thumbnails. This size works across desktop mobile and TV without cropping. The 16:9 aspect ratio matches the video player perfectly.

Minimum width is 640 pixels but this will appear pixelated on larger screens. Always use at least 1280x720 for professional quality. Higher resolutions like 1920x1080 work but must stay under the 2MB file limit.

## File Formats

JPG format works best for most thumbnails giving smaller file sizes with good quality. PNG supports transparency but creates larger files. Avoid GIF for static images.

## Mobile Considerations

Over 70 percent of YouTube views happen on mobile where thumbnails shrink to 168x94 pixels. Design with this in mind using large text minimum 60 point fonts and high contrast colors.

Test your thumbnail at small sizes before uploading. If text is unreadable at mobile size simplify your design.

## Design Best Practices

Use bold vibrant colors that stand out in search results. Include faces with clear expressions as these increase clicks by 35 percent. Limit text to 3-5 words maximum.

Keep the most important elements in the center as edges may get cropped on some displays. Maintain consistent branding with logo placement and color schemes.

## Common Mistakes

Wrong aspect ratios like 1:1 or 4:3 will have black bars added. Files over 2MB won't upload. Tiny text becomes invisible on mobile.

Poor contrast makes thumbnails blend into YouTube's interface. Test against both light and dark backgrounds.

Master these thumbnail size specifications and your videos will look professional across all devices and screen sizes.\`
};

// Combine and add closing
const finalContent = baseContent + newBlogs + '\n';

// Write the new file
fs.writeFileSync('src/data/blogContent.ts', finalContent, 'utf8');
console.log('Successfully created new blogContent.ts with 1 sample blog');
console.log('File is ready for build test');
