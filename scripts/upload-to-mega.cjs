const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directories to upload
const UPLOAD_DIRS = [
    { local: 'public/assets', remote: '/assets' },
    { local: 'public/thumbnails', remote: '/thumbnails' },
    { local: 'src/assets/blog', remote: '/blog' }
];

// Track uploaded files and their URLs
const urlMapping = {};

function uploadToMega(localPath, remotePath) {
    console.log(`📤 Uploading: ${localPath} -> ${remotePath}`);

    try {
        // Upload file to MEGA
        execSync(`mega-put "${localPath}" "${remotePath}"`, { stdio: 'inherit' });

        // Get public link
        const remoteFile = `${remotePath}/${path.basename(localPath)}`;
        const output = execSync(`mega-export -a "${remoteFile}"`).toString();

        // Extract URL from output
        const match = output.match(/https:\/\/mega\.nz\/[^\s]+/);
        if (match) {
            const megaUrl = match[0];
            console.log(`✅ Uploaded: ${path.basename(localPath)}`);
            console.log(`   URL: ${megaUrl}`);
            return megaUrl;
        }
    } catch (error) {
        console.error(`❌ Failed to upload ${localPath}:`, error.message);
        return null;
    }
}

function processDirectory(localDir, remoteDir) {
    const fullPath = path.resolve(__dirname, '..', localDir);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Directory not found: ${localDir}`);
        return;
    }

    const files = fs.readdirSync(fullPath);

    for (const file of files) {
        const localFilePath = path.join(fullPath, file);
        const stat = fs.statSync(localFilePath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            processDirectory(path.join(localDir, file), `${remoteDir}/${file}`);
        } else {
            // Upload file
            const relativePath = path.relative(path.dirname(fullPath), localFilePath).replace(/\\/g, '/');
            const megaUrl = uploadToMega(localFilePath, remoteDir);

            if (megaUrl) {
                // Store mapping for code updates
                urlMapping[relativePath] = megaUrl;
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting MEGA upload...\n');

    // Check if MEGA is logged in
    try {
        execSync('mega-whoami', { stdio: 'pipe' });
    } catch (error) {
        console.error('❌ Not logged in to MEGA. Please run: mega-login your-email@example.com');
        process.exit(1);
    }

    // Upload all directories
    for (const dir of UPLOAD_DIRS) {
        console.log(`\n📁 Processing: ${dir.local}`);
        processDirectory(dir.local, dir.remote);
    }

    // Save URL mapping to file
    const mappingPath = path.join(__dirname, 'mega-url-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(urlMapping, null, 2));

    console.log(`\n✨ Upload complete!`);
    console.log(`📄 URL mapping saved to: ${mappingPath}`);
    console.log(`\nNext: I will update your code to use these MEGA URLs.`);
}

main();
