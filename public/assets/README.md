# Assets Directory

This directory contains all the downloadable video editing assets for the Diamond Assets Store.

## Structure

```
assets/
├── cinematic-intro-pack.zip
├── neon-transitions.zip
├── social-media-pack.zip
├── particle-effects.zip
├── corporate-presentation.zip
├── epic-music.zip
├── minimal-graphics.zip
├── logo-animations.zip
├── gaming-hud.zip
├── weather-graphics.zip
└── README.md
```

## Asset Guidelines

- All assets should be properly packaged in ZIP files
- Include documentation/instructions inside each package
- Maintain consistent naming convention (lowercase with hyphens)
- Each asset should include preview images or videos
- License information should be included in each package

## File Size Recommendations

- Keep individual packages under 500MB when possible
- Optimize file sizes while maintaining quality
- Include multiple format options when applicable

## Adding New Assets

When adding new assets:
1. Package the asset files in a ZIP archive
2. Update the assets data in `src/data/assets.ts`
3. Add appropriate thumbnails/previews
4. Test the download functionality
5. Update pricing and metadata

## Security Notes

- All downloads are served statically from this directory
- No executable files should be included
- Only allow trusted asset formats (videos, images, project files, etc.)