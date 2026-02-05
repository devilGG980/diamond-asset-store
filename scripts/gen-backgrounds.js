/*
Generates a manifest of local background images and copies them to public/backgrounds.
Usage:
  node scripts/gen-backgrounds.js [SOURCE_DIR]
Defaults SOURCE_DIR to "THUMBNAIL BACKGROUND" at project root.
*/

import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const srcArg = process.argv[2];
const sourceDir = srcArg
  ? path.resolve(srcArg)
  : path.resolve(projectRoot, 'THUMBNAIL BACKGROUND');
const outDir = path.resolve(projectRoot, 'public', 'backgrounds');
const manifestPath = path.resolve(projectRoot, 'public', 'backgrounds.json');
const indexJsonPath = path.resolve(projectRoot, 'public', 'backgrounds', 'index.json');

const exts = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`[gen-backgrounds] Source directory not found: ${sourceDir}`);
    process.exit(1);
  }
  ensureDir(outDir);

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name);

  const items = [];
  for (const name of files) {
    const src = path.join(sourceDir, name);
    const dest = path.join(outDir, name);
    // Copy file
    fs.copyFileSync(src, dest);
    items.push({ name, url: `backgrounds/${name}` });
  }

  fs.writeFileSync(manifestPath, JSON.stringify({ items }, null, 2));
  // Simple array form identical to stickers loader
  fs.writeFileSync(indexJsonPath, JSON.stringify(items.map(i => i.name), null, 2));
  console.log(`[gen-backgrounds] Copied ${items.length} images to public/backgrounds and wrote backgrounds.json and backgrounds/index.json`);
}

main();