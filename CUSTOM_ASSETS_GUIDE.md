# 🎨 Custom Assets Guide

## How to Add Your Custom Assets

### 📁 Step 1: Prepare Your Asset Files

1. **Create asset packages** (ZIP files containing your video assets)
2. **Place them in**: `public/assets/` folder
3. **Naming convention**: Use kebab-case (e.g., `epic-intro-pack.zip`)

### 🏷️ Step 2: Add Asset Metadata

Edit `src/data/assets.ts` and add your assets to the `mockAssets` array:

```typescript
export const mockAssets: Asset[] = [
  {
    id: 1,
    title: 'Your Custom Intro Pack',
    description: 'Amazing custom intros for YouTube videos',
    price: 150, // Price in diamonds
    category: 'Intros', // Choose from available categories
    thumbnail: '🎬', // Emoji or use image URL later
    downloadUrl: '/assets/your-intro-pack.zip',
    tags: ['intro', 'youtube', 'custom', 'professional'],
    createdAt: new Date('2024-03-24'),
    downloads: 0,
    featured: true, // Show on homepage
    fileSize: '85 MB',
    format: 'After Effects Project'
  },
  // Add more assets here...
];
```

### 🗂️ Available Categories

- `'Intros'`
- `'Transitions'`
- `'Templates'`
- `'Effects'`
- `'Music'`
- `'Graphics'`
- `'Animations'`
- `'Logos'`
- `'Backgrounds'`
- `'Lower Thirds'`
- `'Overlays'`

### 📋 Asset Properties Explained

- **id**: Unique number for each asset
- **title**: Display name of your asset
- **description**: Detailed description for users
- **price**: Cost in diamonds (virtual currency)
- **category**: Must match one of the available categories
- **thumbnail**: Emoji or image URL for preview
- **downloadUrl**: Path to your ZIP file in public/assets/
- **tags**: Array of keywords for search functionality
- **createdAt**: Date when asset was added
- **downloads**: Number of downloads (start with 0)
- **featured**: true/false - shows on homepage if true
- **fileSize**: Display file size (e.g., "85 MB")
- **format**: Software/format type

### 🚀 Step 3: Deploy Updates

After adding your assets:

```bash
npm run build
firebase deploy --only hosting
```

### 💡 Tips

1. **Start with 3-5 assets** to test the system
2. **Use attractive thumbnails** - emojis work great for now
3. **Set reasonable prices** - consider your target audience
4. **Add good descriptions** - help users understand what they get
5. **Use relevant tags** - improves search functionality

### 🎯 Example Complete Asset

```typescript
{
  id: 1,
  title: 'Gaming Intro Collection',
  description: 'Professional gaming intros perfect for streamers and content creators. Includes 8 different styles with customizable text overlays.',
  price: 200,
  category: 'Intros',
  thumbnail: '🎮',
  downloadUrl: '/assets/gaming-intro-collection.zip',
  tags: ['gaming', 'intro', 'streaming', 'esports', 'customizable'],
  createdAt: new Date('2024-03-24'),
  downloads: 0,
  featured: true,
  fileSize: '120 MB',
  format: 'After Effects Project'
}
```

Your custom assets will automatically appear in:
- ✅ Store page with filtering
- ✅ Search functionality  
- ✅ Homepage (if featured: true)
- ✅ Purchase system with diamonds
- ✅ User download tracking

Ready to add your custom assets! 🚀