import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../src/data/imported_data.json');
const tsPath = path.join(__dirname, '../src/data/importedBlogs.ts');

try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const tsContent = `import { BlogPost } from './blogSummaries';

export const importedSummaries: BlogPost[] = ${JSON.stringify(data.summaries, null, 2)};

export const importedContent: Record<string, string> = ${JSON.stringify(data.contentMap, null, 2)};
`;

    fs.writeFileSync(tsPath, tsContent);
    console.log(`Successfully created ${tsPath}`);
} catch (error) {
    console.error('Error converting JSON to TS:', error);
}
