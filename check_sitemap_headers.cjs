const https = require('https');

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log(`\nChecking: ${url}`);
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Headers:');
            console.log(JSON.stringify(res.headers, null, 2));
            resolve();
        }).on('error', (e) => {
            console.error(e);
            resolve();
        });
    });
};

checkUrl('https://editorvault.web.app/sitemap.xml');
