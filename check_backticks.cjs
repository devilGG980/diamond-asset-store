
const fs = require('fs');
const content = fs.readFileSync('src/data/blogContent.ts', 'utf8');

const lines = content.split('\n');
let insideString = false;
let stringStartLine = 0;

console.log('Checking for unescaped backticks...');

// The file structure is: export const blogContent... = { 'key': `value`, ... }
// We expect backticks to delimit the values.
// So we should find:
// 1. Key: '...'
// 2. Colon :
// 3. Opening Backtick `
// 4. Content... (with escaped backticks \`)
// 5. Closing Backtick `
// 6. Comma ,

let backtickCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find all backticks in the line
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '`') {
            // Check if escaped
            const isEscaped = (j > 0 && line[j - 1] === '\\');

            if (!isEscaped) {
                backtickCount++;
                console.log(`Found unescaped backtick at Line ${i + 1}, Column ${j + 1}`);

                // Context
                console.log(`Line: ${line.substring(Math.max(0, j - 10), Math.min(line.length, j + 10))}`);
            }
        }
    }
}

console.log(`Total unescaped backticks: ${backtickCount}`);
// We expect exactly 2 * number_of_posts backticks (one start, one end for each post).
// If we have extra, those are the errors.
