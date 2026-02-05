const https = require('https');

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log(`\nChecking: ${url}`);
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Headers:');
            console.log(JSON.stringify(res.headers, null, 2));

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\nFirst 100 characters of body:\n${data.substring(0, 100)}`);
                resolve();
            });
        }).on('error', (e) => {
            console.error(e);
            resolve();
        });
    });
};

async function run() {
    await checkUrl('https://editorvault.web.app/rewrite.xml');
    await checkUrl('https://editorvault.web.app/robots.txt');
}

run();
