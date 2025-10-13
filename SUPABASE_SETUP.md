# Supabase Setup Guide for Diamond Assets Store

This guide will walk you through setting up Supabase for authentication and database for your Diamond Assets Store.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create a new account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: Diamond Assets Store
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is perfect for getting started
5. Click **"Create new project"**

Wait a few minutes for your project to be set up.

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Click on **API** under Project Settings
3. You'll see your project credentials:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **API Keys**:
     - `anon` / `public` key (safe to use in browser)
     - `service_role` key (keep this secret, never expose to client)

## Step 3: Configure Your Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual credentials from Step 2.

## Step 4: Set Up Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. **Email Provider** is enabled by default
3. To enable **Google OAuth**:
   - Click on **Google** provider
   - Toggle **Enable Sign in with Google**
   - You'll need to set up Google OAuth credentials:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
     - Copy Client ID and Client Secret to Supabase
   - Click **Save**

## Step 5: Create Database Tables

Run the following SQL in the Supabase **SQL Editor**:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  displayName TEXT,
  diamondBalance INTEGER DEFAULT 0,
  purchasedAssets TEXT[] DEFAULT '{}',
  downloadPurchases JSONB DEFAULT '[]',
  lastAdWatch BIGINT,
  adsWatchedToday INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on displayName for username lookups
CREATE INDEX IF NOT EXISTS idx_users_displayname ON users(displayName);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = uid);

-- Policy: Users can insert their own data (for profile creation)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = uid);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  USING (auth.uid()::text = uid);
```

## Step 6: Configure Email Settings (Optional)

By default, Supabase requires email confirmation. To disable this for development:

1. Go to **Authentication** → **Settings**
2. Scroll down to **Email Auth**
3. Toggle off **"Enable email confirmations"** (for development only)
4. For production, keep it enabled and configure your email templates

## Step 7: Set Up Realtime (Optional)

If you want real-time updates for user profiles:

1. Go to **Database** → **Replication**
2. Find the `users` table
3. Toggle **"Enable Realtime"**

## Step 8: Test Your Setup

1. Start your development server: `npm start`
2. Check the browser console for Supabase connection status
3. Try creating a new account
4. Try logging in with existing account
5. Check the Supabase dashboard → **Authentication** → **Users** to see registered users
6. Check **Database** → **Table Editor** → **users** to see user profiles

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `uid` | TEXT | Supabase Auth user ID (unique) |
| `email` | TEXT | User's email address |
| `displayName` | TEXT | User's display name/username |
| `diamondBalance` | INTEGER | Virtual currency balance |
| `purchasedAssets` | TEXT[] | Array of purchased asset IDs (legacy) |
| `downloadPurchases` | JSONB | Array of purchase records with download limits |
| `lastAdWatch` | BIGINT | Timestamp of last ad watched |
| `adsWatchedToday` | INTEGER | Count of ads watched today |
| `createdAt` | TIMESTAMP | Account creation timestamp |

### Download Purchase Record Structure (JSONB)

```json
{
  "assetId": "string",
  "purchaseTime": 1234567890,
  "downloadsUsed": 0,
  "maxDownloads": 2,
  "cost": 100
}
```

## Security Rules

The Row Level Security (RLS) policies ensure that:
- Users can only read, update, and delete their own data
- Users can create their own profile when they sign up
- No user can access another user's data

## Troubleshooting

### Common Issues:

**"Invalid API key"**
- Check that your `REACT_APP_SUPABASE_ANON_KEY` is correct
- Make sure you're using the `anon` key, not the `service_role` key

**"Row Level Security" errors**
- Verify that RLS policies are set up correctly
- Check that the user is authenticated before making database calls
- Ensure the `uid` field matches the authenticated user's ID

**"Email not confirmed"**
- Either disable email confirmations in development (Step 6)
- Or check your email for the confirmation link

**Google OAuth not working**
- Verify redirect URIs are correctly set in Google Cloud Console
- Check that Client ID and Secret are correct in Supabase
- Make sure Google+ API is enabled

## Migration from Firebase

The codebase has been updated to use Supabase instead of Firebase. Key changes:

1. **Authentication**: Now uses `supabase.auth` instead of Firebase Auth
2. **Database**: PostgreSQL with Supabase instead of Firebase Realtime Database
3. **Data Structure**: Similar schema maintained for compatibility
4. **User IDs**: Changed from `user.uid` to `user.id`

## Next Steps

1. Set up email templates in **Authentication** → **Email Templates**
2. Configure custom SMTP server for production emails
3. Set up database backups in **Settings** → **Database**
4. Monitor usage in **Settings** → **Usage**
5. Set up additional OAuth providers (GitHub, Facebook, etc.)

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
