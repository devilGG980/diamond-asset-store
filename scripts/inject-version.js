import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate version based on timestamp
const version = Date.now().toString();

console.log(`[inject-version] Injecting version: ${version}`);

// Path to the built index.html
const indexPath = path.join(__dirname, '..', 'build', 'index.html');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace placeholder with actual version
  content = content.replace(/__BUILD_VERSION__/g, version);
  
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`[inject-version] Version ${version} injected successfully`);
} else {
  console.error('[inject-version] build/index.html not found');
  process.exit(1);
}
