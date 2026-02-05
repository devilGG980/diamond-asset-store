const { Storage } = require('megajs');
const fs = require('fs');
const path = require('path');

// MEGA credentials
const MEGA_EMAIL = 'informeryt0@gmail.com';
const MEGA_PASSWORD = 'darkdevil980';

// Directories to upload
const UPLOAD_DIRS = [
    { local: 'public/assets', remote: 'assets' },
    { local: 'public/thumbnails', remote: 'thumbnails' },
    { local: 'src/assets/blog', remote: 'blog' }
];

// File to store mapping
const MAPPING_FILE = path.join(__dirname, 'mega-url-mapping.json');

// Load existing mapping if available
let urlMapping = {};
if (fs.existsSync(MAPPING_FILE)) {
    try {
        urlMapping = JSON.parse(fs.readFileSync(MAPPING_FILE));
        console.log(`📂 Loaded existing mapping with ${Object.keys(urlMapping).length} files.`);
    } catch (e) {
        console.error('⚠️ Could not parse existing mapping file.');
    }
}

let uploadCount = 0;

function saveMapping() {
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2));
}

async function uploadToMega(storage, localPath, remoteFolderName, fileName) {
    // Retry loop
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`📤 Uploading: ${fileName} (Attempt ${attempt}/3)`);

            // Read file
            const fileBuffer = fs.readFileSync(localPath);

            // Get or create remote folder
            let folder = storage.root.children.find(f => f.name === remoteFolderName);
            if (!folder) {
                folder = await storage.mkdir(remoteFolderName);
                console.log(`📁 Created folder: ${remoteFolderName}`);
            }

            // Upload file
            const uploadedFile = await storage.upload({
                name: fileName,
                size: fileBuffer.length
            }, fileBuffer, folder).complete;

            // Get shareable link
            const link = await uploadedFile.link();

            uploadCount++;
            console.log(`✅ [${uploadCount}] Uploaded: ${fileName}`);
            console.log(`   URL: ${link}`);

            return link;
        } catch (error) {
            console.error(`❌ Failed to upload ${fileName} (Attempt ${attempt}):`, error.message);
            if (attempt === 3) return null;
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
        }
    }
    return null;
}

async function processDirectory(storage, localDir, remoteFolderName) {
    const fullPath = path.resolve(__dirname, '..', localDir);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Directory not found: ${localDir}`);
        return;
    }

    const files = fs.readdirSync(fullPath);

    for (const file of files) {
        const localFilePath = path.join(fullPath, file);
        const stat = fs.statSync(localFilePath);

        /*
         * Skip already uploaded files
         */
        const relativePath = path.relative(path.resolve(__dirname, '..'), localFilePath).replace(/\\/g, '/');
        if (urlMapping[relativePath]) {
            // console.log(`⏭️  Skipping already uploaded: ${file}`);
            // Reducing log noise for already uploaded files
            continue;
        }

        if (stat.isFile()) {
            const megaUrl = await uploadToMega(storage, localFilePath, remoteFolderName, file);

            if (megaUrl) {
                urlMapping[relativePath] = megaUrl;
                saveMapping(); // Save after each successful upload
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting MEGA upload (Resumable)...');

    try {
        console.log('🔐 Logging in to MEGA...');
        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD
        }).ready;

        console.log('✅ Logged in successfully!\n');

        for (const dir of UPLOAD_DIRS) {
            console.log(`\n📁 Processing: ${dir.local}`);
            await processDirectory(storage, dir.local, dir.remote);
        }

        console.log(`\n✨ Upload complete!`);
        console.log(`📄 URL mapping saved to: ${MAPPING_FILE}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Critical Error:', error.message);
        process.exit(1);
    }
}

main();
