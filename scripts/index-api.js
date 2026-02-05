import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CONFIGURATION
const KEY_FILE_PATH = join(__dirname, '../sacred-lane-475014-v0-237bc14807c0.json');
const SITEMAP_URL = 'https://editorvault.web.app/sitemap.xml';

async function getSitemapUrls() {
    return new Promise((resolve, reject) => {
        https.get(SITEMAP_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                xml2js.parseString(data, (err, result) => {
                    if (err) reject(err);
                    else {
                        try {
                            const urls = result.urlset.url.map(u => u.loc[0]);
                            resolve(urls);
                        } catch (e) {
                            reject(new Error('Invalid sitemap structure'));
                        }
                    }
                });
            });
        }).on('error', reject);
    });
}

async function indexUrls() {
    try {
        console.log('🔑 Authenticating with Google...');
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const indexing = google.indexing({ version: 'v3', auth });

        console.log('🌐 Fetching sitemap...');
        const urls = await getSitemapUrls();
        console.log(`📋 Found ${urls.length} URLs to index.`);

        for (const url of urls) {
            try {
                console.log(`🚀 Submitting: ${url}`);
                const res = await indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED',
                    },
                });
                console.log(`   ✅ Status: ${res.status} ${res.statusText}`);
            } catch (error) {
                if (error.code === 429) {
                    console.log('   ⏳ Quota exceeded. Waiting 30s...');
                    await new Promise(r => setTimeout(r, 30000));
                } else {
                    console.error(`   ❌ Error submitting ${url}:`, error.message);
                }
            }
            // Small delay to be nice to the API
            await new Promise(r => setTimeout(r, 500));
        }
        console.log('✨ Indexing complete!');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

indexUrls();
