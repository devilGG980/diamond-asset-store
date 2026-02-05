# Diamond Assets Store - Local Server Script
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diamond Assets Store - Local Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js (which includes npm) from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
}

# Check if build directory exists
if (-not (Test-Path "build")) {
    Write-Host "Creating production build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create production build" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "Starting local server..." -ForegroundColor Green
Write-Host "Server will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Green
Write-Host ""

node scripts/local-server.js

pause