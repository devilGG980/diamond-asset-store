# setup-table-curl.ps1
# PowerShell script to attempt setting up the table using cURL

Write-Host "Diamond Assets Store - Database Setup via cURL" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Get the Supabase credentials from the .env file
$envContent = Get-Content -Path ".env" | Where-Object { $_ -notmatch "^#" -and $_ -match "=" }
$supabaseUrl = ""
$supabaseAnonKey = ""

foreach ($line in $envContent) {
    if ($line -match "^REACT_APP_SUPABASE_URL\s*=\s*(.*)") {
        $supabaseUrl = $matches[1].Trim()
    }
    if ($line -match "^REACT_APP_SUPABASE_ANON_KEY\s*=\s*(.*)") {
        $supabaseAnonKey = $matches[1].Trim()
    }
}

if (-not $supabaseUrl -or -not $supabaseAnonKey) {
    Write-Host "Error: Could not find Supabase credentials in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "`nFound Supabase configuration:" -ForegroundColor Yellow
Write-Host "URL: $supabaseUrl" -ForegroundColor Gray
Write-Host "Anon Key: $($supabaseAnonKey.Substring(0, 7))..." -ForegroundColor Gray

# Unfortunately, cURL cannot directly create tables either
# The best we can do is provide clear instructions

Write-Host "`nUnfortunately, we cannot directly create tables using cURL or the JavaScript client." -ForegroundColor Red
Write-Host "Table creation requires running SQL commands in the Supabase SQL Editor." -ForegroundColor Yellow

Write-Host "`nEasiest solution:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "1. Open this URL in your browser:" -ForegroundColor White
Write-Host "   $supabaseUrl" -ForegroundColor Gray
Write-Host "2. Sign in to your Supabase account" -ForegroundColor White
Write-Host "3. Select your project" -ForegroundColor White
Write-Host "4. Click on 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "5. Copy and paste the following SQL into the editor:" -ForegroundColor White

$sqlScript = @"
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

CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_displayname ON users(displayName);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  USING (auth.uid()::text = uid);

GRANT ALL ON TABLE users TO authenticated;
"@

Write-Host "`nSQL to paste:" -ForegroundColor Magenta
Write-Host "=============" -ForegroundColor Magenta
Write-Host $sqlScript -ForegroundColor Gray

Write-Host "`n6. Click the 'Run' button" -ForegroundColor White
Write-Host "`nAfter running this SQL, your authentication should work properly!" -ForegroundColor Green

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")