const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const xml = fs.readFileSync('public/rewrite.xml', 'utf8');

parser.parseString(xml, (err, result) => {
    if (err) {
        console.error('XML Parsing Error:', err);
    } else {
        console.log('XML is valid.');
        console.log('Root element:', Object.keys(result));
    }
});
