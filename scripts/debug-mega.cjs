const { Storage } = require('megajs');
const fs = require('fs');

const MEGA_EMAIL = 'informeryt0@gmail.com';
const MEGA_PASSWORD = 'darkdevil980';

async function test() {
    console.log('1. Logging in...');
    try {
        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD
        }).ready;
        console.log('✅ Logged in.');

        console.log('2. Listing root files...');
        const files = storage.root.children;
        console.log(`✅ Found ${files.length} files/folders.`);
        files.forEach(f => console.log(`- ${f.name} (${f.directory ? 'DIR' : 'FILE'})`));

        console.log('3. Trying to create folder "DEBUG_TEST"...');
        let folder = files.find(f => f.name === 'DEBUG_TEST');
        if (!folder) {
            folder = await storage.mkdir('DEBUG_TEST');
        }
        console.log('✅ Folder ready.');

        console.log('4. Uploading tiny file...');
        const buffer = Buffer.from('Hello MEGA!');
        const upload = await storage.upload({
            name: 'hello.txt',
            size: buffer.length
        }, buffer, folder).complete;

        console.log('✅ Upload finished.');
        console.log('5. Getting link...');
        const link = await upload.link();
        console.log('✅ Link:', link);

    } catch (e) {
        console.error('❌ ERROR:', e);
    }
}

test();
