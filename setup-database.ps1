# setup-database.ps1
# PowerShell script to help set up the database table

Write-Host "Diamond Assets Store - Database Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`nThis script will help you set up the required database table in Supabase." -ForegroundColor Yellow

# Display the SQL that needs to be run
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

Write-Host "`nPlease follow these steps:" -ForegroundColor Cyan
Write-Host "1. Go to your Supabase dashboard at: https://app.supabase.com" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Go to SQL Editor in the left sidebar" -ForegroundColor White
Write-Host "4. Copy and paste the following SQL into the editor:" -ForegroundColor White

Write-Host "`nSQL Script to Run:" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta
Write-Host $sqlScript -ForegroundColor Gray

Write-Host "`n5. Click 'Run' to execute the query" -ForegroundColor White
Write-Host "`nAfter running this SQL, your authentication should work properly!" -ForegroundColor Green

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")