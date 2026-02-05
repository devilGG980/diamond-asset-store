# MEGA Cloud Storage Setup

## Step 1: Create MEGA Account (2 minutes)

1. Go to: https://mega.nz/register
2. Enter:
   - Email address
   - Password
   - First name, Last name
3. Click **"Create Account"**
4. Check email and verify account
5. Login at: https://mega.nz/login

**Free Storage:** 20 GB (enough for all your assets!)

---

## Step 2: Install MEGA Command-Line Tool (3 minutes)

We need MEGAcmd to upload files automatically.

**For Windows:**
1. Download from: https://mega.nz/cmd
2. Click **"Download for Windows"**
3. Run the installer (`MEGAcmdSetup.exe`)
4. Complete installation (keep all defaults)
5. Restart your computer (important!)

**After restart, verify installation:**
```bash
mega-version
```
You should see version info like `MEGAcmd version: 1.x.x`

---

## Step 3: Login to MEGA via Command Line (1 minute)

Open PowerShell and run:
```bash
mega-login your-email@example.com your-password
```

Replace with your actual MEGA email and password.

You should see: `[API:info] Fetched nodes`

---

## Step 4: Create Folders in MEGA (1 minute)

```bash
mega-mkdir /assets
mega-mkdir /videos  
mega-mkdir /blog
```

This creates organized folders in your MEGA cloud storage.

---

## Step 5: Upload Assets (I'll automate this)

Once you've completed Steps 1-4, I'll create a script that:
1. Uploads all images from `public/assets/` to MEGA
2. Uploads all videos to MEGA
3. Gets public share links for each file
4. Updates your code to use MEGA URLs

**Let me know when you've completed Steps 1-4!**
