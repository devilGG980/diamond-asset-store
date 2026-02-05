# Diamond Assets Store

A premium marketplace for video creators to buy and download high-quality assets including overlays, transitions, sound effects, and more.

## Features

- 🛒 **Asset Marketplace** - Browse and purchase premium video assets
- 💎 **Diamond Currency** - Earn diamonds by watching ads, spend on assets
- ✂️ **Thumbnail Editor** - Create professional thumbnails with our built-in editor
- 🎨 **Customizable Assets** - Modify colors, text, and elements before downloading
- 📱 **Responsive Design** - Works on all devices
- 🔐 **User Authentication** - Secure login with email or Google
- 📈 **Purchase Tracking** - Download history and asset management

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Supabase account (free at https://supabase.com)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the project root:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase database**:
   Follow the instructions in `SUPABASE_SETUP.md` to create the required tables.

4. **Start the development server**:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## Available Scripts

### Development

- `npm start` - Starts the development server
- `npm test` - Runs the test suite

### Production

- `npm run build` - Creates a production build
- `npm run build:netlify` - Creates a Netlify-optimized build
- `npm run analyze` - Analyzes the bundle size

### Local Serving

- `npm run serve` - Serves the production build locally
- `npm run serve:build` - Builds and serves the production build locally

### Utilities

- `npm run optimize-images` - Optimizes images in the project
- `npm run generate-sitemap` - Generates a sitemap for SEO

## Project Structure

```
diamond-assets-store/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   ├── contexts/           # React contexts (Auth, Editor)
│   ├── data/               # Static data (assets, categories)
│   ├── pages/              # Page components
│   ├── services/           # Service functions (database, API)
│   └── ...
├── scripts/                # Utility scripts
├── build/                  # Production build (created after build)
├── .env                    # Environment variables (you need to create this)
├── package.json            # Project dependencies and scripts
└── ...
```

## Local Development

### Starting the Development Server

```bash
npm start
```

The development server includes:
- Hot reloading
- Error overlay
- Source maps
- Gzip compression

### Testing Production Builds Locally

To test the production build locally:

```bash
npm run serve:build
```

This will:
1. Create a production build
2. Start a local server to serve the build
3. Make the app available at `http://localhost:3000`

Alternatively, you can build and serve separately:

```bash
npm run build
npm run serve
```

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create a new account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: Diamond Assets Store
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**

### Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Click on **API** under Project Settings
3. Copy your project credentials:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **API Keys**: Copy the `anon` / `public` key (safe to use in browser)

### Step 3: Configure Your Environment Variables

1. Create a `.env` file in the root of your project (copy [.env.example](file:///C:/Users/VANSH%20SINGH/projects/website/diamond-assets-store/.env.example) if it exists)
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from [SUPABASE_TABLE_SETUP.sql](file:///C:/Users/VANSH%20SINGH/projects/website/diamond-assets-store/SUPABASE_TABLE_SETUP.sql) file in your project
4. Click **Run** (or press Ctrl+Enter)

### Step 5: Enable Authentication Providers

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. **Email Provider** is enabled by default
3. To enable **Google OAuth**:
   - Click on **Google** provider
   - Toggle **Enable Sign in with Google**
   - Set up Google OAuth credentials in the Google Cloud Console
   - Add authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
   - Click **Save**

### Step 6: Test Your Setup

1. Start your development server: `npm start`
2. Visit `http://localhost:3000` in your browser
3. Try creating a new account or logging in
4. Check the browser console for any errors

## Environment Variables

The application requires the following environment variables:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set the build command to: `npm run build:netlify`
3. Set the publish directory to: `build/`
4. Add environment variables in Netlify dashboard

### Other Platforms

1. Create a production build: `npm run build`
2. Deploy the contents of the `build/` directory
3. Ensure environment variables are set on the platform

## Performance Optimizations

- Code splitting with automatic vendor chunking
- Image optimization with automatic compression
- Gzip and Brotli compression
- Tree shaking for unused code elimination
- Runtime chunking for better caching
- Asset preloading and prefetching

## Browser Support

- Last 2 versions of modern browsers
- IE 11+ (with polyfills)
- Mobile browsers (iOS Safari, Android Chrome)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Troubleshooting

### Common Issues

1. **"Module not found" errors**:
   - Run `npm install` to ensure all dependencies are installed

2. **Supabase authentication not working**:
   - Verify your `.env` file contains correct Supabase credentials
   - Check that the database tables are created
   - Ensure you've restarted the development server after changing environment variables

3. **Development server not starting**:
   - Ensure Node.js version is 16 or higher
   - Check if port 3000 is already in use

4. **Build errors**:
   - Check the console for specific error messages
   - Ensure all environment variables are properly set

### Getting Help

- Check the console for error messages
- Review the documentation files in the repository
- Open an issue on GitHub if you encounter problems

## Documentation

- [SUPABASE_SETUP.md](file:///C:/Users/VANSH%20SINGH/projects/website/diamond-assets-store/SUPABASE_SETUP.md) - Supabase configuration guide
- [LOCAL_HOSTING_GUIDE.md](file:///C:/Users/VANSH%20SINGH/projects/website/diamond-assets-store/LOCAL_HOSTING_GUIDE.md) - Detailed local hosting guide
- [SETUP_INSTRUCTIONS.md](file:///C:/Users/VANSH%20SINGH/projects/website/diamond-assets-store/SETUP_INSTRUCTIONS.md) - Complete setup instructions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, TypeScript, and Supabase
- UI components from Heroicons
- Animation library Framer Motion
- Styling with Tailwind CSS