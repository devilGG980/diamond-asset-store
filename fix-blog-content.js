const fs = require('fs');

// Read the file
const content = fs.readFileSync('src/data/blogContent.ts', 'utf8');

// Find where fortnite-thumbnail ends (the last working blog)
const fortniteEnd = content.indexOf("Creating legendary Fortnite thumbnails combines art, psychology, and technical skill. Use vibrant colors, dynamic poses, bold text, and always optimize for mobile viewing. Test continuously, stay updated with Fortnite seasons, and develop your unique style that viewers recognize instant ly.`");

if (fortniteEnd === -1) {
    console.log('Could not find end of fortnite blog');
    process.exit(1);
}

// Get the closing part
const closingPart = "\n};\n";

// Trim to working content + closing
const workingContent = content.substring(0, fortniteEnd + 199) + closingPart;

// Write back
fs.writeFileSync('src/data/blogContent.ts', workingContent, 'utf8');

console.log('Successfully cleaned blogContent.ts');
console.log('File now ends at fortnite-thumbnail');
