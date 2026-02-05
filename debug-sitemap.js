import https from 'https';
import xml2js from 'xml2js';

const urls = [
    'https://editorvault.web.app/sitemap.xml',
    'https://editorvault.web.app/robots.txt'
];

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, 'debug_log.txt');
fs.writeFileSync(logFile, ''); // Clear file

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function checkUrl(url) {
    log(`\n🔍 Checking ${url}...`);
    return new Promise((resolve) => {
        https.get(url, (res) => {
            log('   Status: ' + res.statusCode);
            log('   Headers: ' + JSON.stringify(res.headers, null, 2));

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                log(`   Content Length: ${data.length}`);

                if (res.statusCode !== 200) {
                    log('   ❌ Status is not 200');
                    resolve();
                    return;
                }

                if (data.length === 0) {
                    log('   ❌ Body is empty');
                    resolve();
                    return;
                }

                // Check for X-Robots-Tag
                if (res.headers['x-robots-tag']) {
                    log('   ❌ X-Robots-Tag found: ' + res.headers['x-robots-tag']);
                } else {
                    log('   ✅ X-Robots-Tag NOT found.');
                }

                // Validate XML
                if (url.endsWith('.xml')) {
                    const parser = new xml2js.Parser();
                    parser.parseString(data, (err, result) => {
                        if (err) {
                            log('   ❌ Invalid XML: ' + err.message);
                            log('   First 100 chars: ' + data.substr(0, 100));
                        } else {
                            log('   ✅ XML is valid.');
                            if (result.urlset && result.urlset.url) {
                                log('   URL Count: ' + result.urlset.url.length);
                            } else {
                                log('   ⚠️ XML valid but weird structure (maybe empty urlset?)');
                                log(JSON.stringify(result).substr(0, 200));
                            }
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });

        }).on('error', (e) => {
            log('   ❌ Error fetching: ' + e);
            resolve();
        });
    });
}

async function run() {
    for (const u of urls) {
        await checkUrl(u);
    }
}

run();
