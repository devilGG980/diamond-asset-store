# Firebase to Supabase Migration Guide

This document outlines the changes made to migrate from Firebase to Supabase.

## Overview

The application has been successfully migrated from Firebase to Supabase. This migration brings several benefits:

- **Better Performance**: PostgreSQL database with optimized queries
- **Cost-Effective**: More generous free tier
- **Open Source**: Full control and transparency
- **Modern Stack**: Better developer experience
- **SQL Database**: Easier data management and querying

## What Changed

### 1. Authentication System

**Before (Firebase Auth):**
```typescript
import { auth } from './register';
import { signInWithEmailAndPassword } from 'firebase/auth';

await signInWithEmailAndPassword(auth, email, password);
```

**After (Supabase Auth):**
```typescript
import { supabase } from './config/supabase';

await supabase.auth.signInWithPassword({ email, password });
```

### 2. Database Structure

**Before (Firebase Realtime Database):**
- NoSQL structure
- Data stored as JSON
- Path-based queries: `/users/${uid}`

**After (Supabase PostgreSQL):**
- SQL relational database
- Structured tables with typed columns
- Query-based access with Row Level Security

### 3. User Profile Storage

**Before:**
```typescript
import { ref, set } from 'firebase/database';
import { db } from './register';

const userRef = ref(db, `users/${uid}`);
await set(userRef, userData);
```

**After:**
```typescript
import { supabase } from './config/supabase';

await supabase.from('users').insert([userData]);
```

### 4. User ID Reference

**Before:**
- User ID accessed via: `user.uid`

**After:**
- User ID accessed via: `user.id`

## Files Changed

### Created Files
- `src/config/supabase.ts` - Supabase configuration and client
- `SUPABASE_SETUP.md` - Complete setup instructions
- `.env.example` - Environment variables template

### Modified Files
- `src/services/database.ts` - Completely rewritten for PostgreSQL
- `src/contexts/AuthContext.tsx` - Updated to use Supabase Auth
- `src/components/FetchAuthUser.tsx` - Updated auth state listener
- `src/components/ui/FirebaseStatus.tsx` - Renamed to SupabaseStatus
- `src/components/editor/DownloadModal.tsx` - Updated to use AuthContext
- `src/pages/LoginTest.tsx` - Updated database queries
- `package.json` - Removed Firebase, added Supabase
- `README.md` - Updated documentation

### Deleted Files
- `src/register.ts` - Firebase initialization (replaced by supabase.ts)
- `src/firebase.ts` - Legacy Firebase config
- `src/config/firebase.ts` - Firebase exports
- `src/services/firestore.ts` - Firestore service (not needed)
- `src/services/FirestoreService.tsx` - Firestore helper
- `firebase.json` - Firebase hosting config
- `database.rules.json` - Firebase security rules
- `FIREBASE_SETUP.md` - Firebase setup guide

## Setup Instructions

### 1. Install Dependencies

The migration has already handled this, but for reference:
```bash
npm uninstall firebase
npm install @supabase/supabase-js
```

### 2. Set Up Supabase

Follow the complete guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md):

1. Create a Supabase project at https://app.supabase.com
2. Get your project URL and anon key
3. Create `.env` file with your credentials
4. Run the SQL schema to create tables
5. Configure authentication providers

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:
```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Schema

Run this SQL in your Supabase SQL Editor to create the users table:

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_displayname ON users(displayName);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can delete own data"
  ON users FOR DELETE
  USING (auth.uid()::text = uid);
```

## Key Differences

### Authentication Flow

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Sign Up | `createUserWithEmailAndPassword()` | `supabase.auth.signUp()` |
| Sign In | `signInWithEmailAndPassword()` | `supabase.auth.signInWithPassword()` |
| Sign Out | `signOut(auth)` | `supabase.auth.signOut()` |
| Auth State | `onAuthStateChanged()` | `supabase.auth.onAuthStateChange()` |
| Google OAuth | `signInWithPopup()` | `supabase.auth.signInWithOAuth()` |

### Database Operations

| Operation | Firebase | Supabase |
|-----------|----------|----------|
| Create | `set(ref(...))` | `supabase.from().insert()` |
| Read | `get(ref(...))` | `supabase.from().select()` |
| Update | `update(ref(...))` | `supabase.from().update()` |
| Delete | `remove(ref(...))` | `supabase.from().delete()` |

## Migration Benefits

1. **Better Type Safety**: PostgreSQL provides strong typing
2. **SQL Queries**: More powerful and flexible data queries
3. **Row Level Security**: Built-in security at database level
4. **Better Pricing**: More generous free tier
5. **Easier Scaling**: PostgreSQL scales better for larger datasets
6. **Open Source**: No vendor lock-in

## Testing the Migration

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Test authentication:**
   - Try signing up with a new account
   - Try logging in with email/password
   - Try username login
   - Test Google OAuth (if configured)

3. **Test database operations:**
   - Visit `/login-test` to test database connectivity
   - Check user profile creation
   - Test username search functionality

4. **Test the app features:**
   - Browse the store
   - Test the thumbnail editor
   - Test purchasing assets with diamonds
   - Test the diamond balance updates

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your `.env` file
   - Verify you're using the `anon` key, not `service_role`
   - Restart the development server after changing `.env`

2. **"Row Level Security" errors**
   - Verify RLS policies are set up correctly
   - Check that the user is authenticated
   - Ensure `uid` field matches the auth user ID

3. **"Email not confirmed" error**
   - Disable email confirmation in Supabase dashboard (for development)
   - Or check your email for the confirmation link

4. **Google OAuth not working**
   - Configure Google OAuth in Supabase dashboard
   - Set up Google Cloud Console credentials
   - Add redirect URIs correctly

## Support

If you encounter issues:

1. Check the [SUPABASE_SETUP.md](SUPABASE_SETUP.md) guide
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for detailed error messages
4. Visit Supabase Discord: https://discord.supabase.com

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Create database tables
4. Test authentication flow
5. Migrate existing user data (if any)
6. Configure OAuth providers
7. Set up production environment

---

**Migration completed successfully!** 🚀

Your app is now powered by Supabase instead of Firebase.
