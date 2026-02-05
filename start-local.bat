@echo off
title Diamond Assets Store - Local Server

echo ========================================
echo Diamond Assets Store - Local Server
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    echo Please install Node.js (which includes npm) from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version: 
node --version

echo npm version:
npm --version

echo.
echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Checking for build directory...
if not exist "build" (
    echo Creating production build...
    npm run build
    if %errorlevel% neq 0 (
        echo Error: Failed to create production build
        pause
        exit /b 1
    )
)

echo.
echo Starting local server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node scripts/local-server.cjs

pause