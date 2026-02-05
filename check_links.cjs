const fs = require('fs');
const http = require('http');

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
const baseUrl = 'http://localhost:3000';

const checkUrl = (path) => {
    return new Promise((resolve) => {
        // Convert https://editorvault.web.app/path to /path
        const localPath = path.replace('https://editorvault.web.app', '');
        const url = baseUrl + localPath;

        http.get(url, (res) => {
            resolve({ path: localPath, status: res.statusCode });
        }).on('error', (e) => {
            resolve({ path: localPath, status: 'ERROR', error: e.message });
        });
    });
};

async function checkAll() {
    console.log('Checking URLs...');
    const results = [];
    for (const url of urls) {
        const result = await checkUrl(url);
        results.push(result);
        // console.log(`${result.status} - ${result.path}`);
    }

    const failures = results.filter(r => r.status !== 200);
    console.log('\n--- Failures ---');
    if (failures.length === 0) {
        console.log('None. All URLs returned 200.');
    } else {
        failures.forEach(f => console.log(`${f.status} - ${f.path}`));
    }

    const successes = results.filter(r => r.status === 200);
    console.log(`\nVerified ${successes.length} valid URLs.`);
}

checkAll();
