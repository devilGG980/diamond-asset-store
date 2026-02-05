#!/usr/bin/env node

// Simple local server for serving production builds
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server configuration
const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.join(__dirname, '../build');
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.log('Build directory not found. Attempting to create a production build...');
  
  try {
    // Try to run npm build
    console.log('Running: npm run build');
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('Build completed successfully.');
  } catch (buildError) {
    console.error('Failed to create production build.');
    console.error('Please run "npm run build" manually and then try again.');
    process.exit(1);
  }
}

// Verify build directory exists after attempted build
if (!fs.existsSync(BUILD_DIR)) {
  console.error('Build directory still not found after build attempt.');
  console.error('Please ensure the build process completed successfully.');
  process.exit(1);
}

// Create server
const server = http.createServer((req, res) => {
  // Parse the request URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  
  // Handle SPA routing - serve index.html for non-file requests
  if (!pathname.includes('.')) {
    pathname = '/index.html';
  }
  
  // Construct file path
  const filePath = path.join(BUILD_DIR, pathname);
  
  // Security check to prevent directory traversal
  if (!filePath.startsWith(BUILD_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found - try index.html for SPA
        if (pathname !== '/index.html') {
          fs.readFile(path.join(BUILD_DIR, 'index.html'), (err, content) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('500 Internal Server Error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content, 'utf-8');
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      // Success
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000' // 1 year for static assets
      });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
  console.log(`Serving files from: ${BUILD_DIR}`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});