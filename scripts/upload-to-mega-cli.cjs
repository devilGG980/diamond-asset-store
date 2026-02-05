const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Logic to find MEGAcmd
const MEGA_CMD_DIR = 'c:\\Users\\VANSH SINGH\\AppData\\Local\\MEGAcmd';
const MEGA_PUT = `"${path.join(MEGA_CMD_DIR, 'mega-put.bat')}"`;
const MEGA_EXPORT = `"${path.join(MEGA_CMD_DIR, 'mega-export.bat')}"`;

// Directories to upload
const UPLOAD_DIRS = [
    { local: 'public/assets', remote: '/assets' },
    { local: 'public/thumbnails', remote: '/thumbnails' },
    { local: 'public/videos', remote: '/videos' },
    { local: 'public/blog-images', remote: '/blog-images' },
    { local: 'src/assets/blog', remote: '/blog' }
];

// File to store mapping
const MAPPING_FILE = path.join(__dirname, 'mega-url-mapping.json');

// Load existing mapping
let urlMapping = {};
if (fs.existsSync(MAPPING_FILE)) {
    try {
        urlMapping = JSON.parse(fs.readFileSync(MAPPING_FILE));
        console.log(`📂 Loaded existing mapping with ${Object.keys(urlMapping).length} files.`);
    } catch (e) {
        console.error('⚠️ Could not parse existing mapping file.');
    }
}

function saveMapping() {
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2));
}

function uploadToMega(localPath, remotePath) {
    try {
        const fileName = path.basename(localPath);
        console.log(`📤 Uploading: ${fileName}`);

        // Upload
        // -c = create remote path if missing (though we made dirs already)
        execSync(`${MEGA_PUT} -c "${localPath}" "${remotePath}"`, { stdio: 'pipe' });

        // Export (get link)
        const remoteFile = `${remotePath}/${fileName}`;
        const output = execSync(`${MEGA_EXPORT} -a "${remoteFile}"`).toString();

        // Output format: "Exported /assets/file.jpg: https://mega.nz/..."
        const match = output.match(/https:\/\/mega\.nz\/[^\s]+/);
        if (match) {
            const link = match[0];
            console.log(`✅ Uploaded: ${fileName}`);
            console.log(`   URL: ${link}`);
            return link;
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
        const relativePath = path.relative(path.resolve(__dirname, '..'), localFilePath).replace(/\\/g, '/');

        // Skip if already mapped
        if (urlMapping[relativePath]) {
            // console.log(`⏭️  Skipping: ${file}`);
            continue;
        }

        if (stat.isFile()) {
            const megaUrl = uploadToMega(localFilePath, remoteDir);

            if (megaUrl) {
                urlMapping[relativePath] = megaUrl;
                saveMapping();
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting MEGA upload (CLI Version)...');

    for (const dir of UPLOAD_DIRS) {
        console.log(`\n📁 Processing: ${dir.local} -> ${dir.remote}`);
        processDirectory(dir.local, dir.remote);
    }

    console.log(`\n✨ Upload complete!`);
    console.log(`📄 URL mapping saved to: ${MAPPING_FILE}`);
}

main();
