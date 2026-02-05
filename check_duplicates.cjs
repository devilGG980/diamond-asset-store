const fs = require('fs');
const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

const counts = {};
const duplicates = [];

urls.forEach(url => {
    counts[url] = (counts[url] || 0) + 1;
    if (counts[url] === 2) {
        duplicates.push(url);
    }
});

if (duplicates.length > 0) {
    console.log('Found duplicate URLs:');
    duplicates.forEach(d => console.log(d));
} else {
    console.log('No duplicate URLs found.');
}
