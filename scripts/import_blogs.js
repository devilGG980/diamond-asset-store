import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentFactoryPath = path.join(__dirname, '../Content_Factory');
const outputPath = path.join(__dirname, '../src/data/imported_data.json');

// Static Keyword Mapping for "Crazy" Internal Linking to Money Pages
const staticKeywordLinks = {
    'store': '/store',
    'shop': '/store',
    'assets': '/store',
    'download': '/store',
    'template': '/store',
    'preset': '/store',
    'transition': '/store',
    'thumbnail maker': '/editor',
    'editor': '/editor',
    'free tool': '/editor',
    'about us': '/about',
    'contact': '/contact'
};

// Category-Specific Tags to Boost Keyword Density
const categoryTags = {
    'YouTube Growth': ['channel growth', 'views', 'subscribers', 'content strategy', 'algorithm'],
    'Video Editing': ['post-production', 'editing tips', 'workflow', 'filmmaking', 'storytelling'],
    'VFX': ['visual effects', 'compositing', 'motion design', 'cgi', 'after effects'],
    'Hardware': ['pc build', 'gear review', 'tech specs', 'setup', 'equipment'],
    'Software': ['productivity', 'apps', 'creative tools', 'software review', 'tech stack'],
    'Career': ['freelancing', 'client work', 'business', 'monetization', 'career advice'],
    'Social Media': ['instagram reels', 'tiktok', 'viral content', 'social strategy', 'engagement'],
    'Design': ['graphic design', 'branding', 'typography', 'color theory', 'visual identity'],
    'Audio': ['sound design', 'mixing', 'podcasting', 'audio gear', 'music production'],
    'Other': ['general', 'tips', 'tricks']
};

function getCategoryFromKeywords(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('youtube') || lowerText.includes('subscriber') || lowerText.includes('channel')) return 'YouTube Growth';
    if (lowerText.includes('edit') || lowerText.includes('cut') || lowerText.includes('premiere') || lowerText.includes('davinci')) return 'Video Editing';
    if (lowerText.includes('vfx') || lowerText.includes('effect') || lowerText.includes('animation') || lowerText.includes('3d')) return 'VFX';
    if (lowerText.includes('pc') || lowerText.includes('laptop') || lowerText.includes('monitor') || lowerText.includes('camera') || lowerText.includes('mic') || lowerText.includes('gpu') || lowerText.includes('cpu')) return 'Hardware';
    if (lowerText.includes('software') || lowerText.includes('app') || lowerText.includes('tool') || lowerText.includes('plugin')) return 'Software';
    if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('money') || lowerText.includes('freelance') || lowerText.includes('client')) return 'Career';
    if (lowerText.includes('tiktok') || lowerText.includes('instagram') || lowerText.includes('social') || lowerText.includes('shorts')) return 'Social Media';
    if (lowerText.includes('design') || lowerText.includes('thumbnail') || lowerText.includes('art') || lowerText.includes('photoshop')) return 'Design';
    if (lowerText.includes('audio') || lowerText.includes('sound') || lowerText.includes('music') || lowerText.includes('mic')) return 'Audio';
    return 'Other';
}

function cleanExcerpt(text) {
    // Remove Markdown symbols (*, #, [, ], links)
    return text
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links keep text
        .replace(/[*#_`]/g, '') // Remove symbols
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

function processFiles() {
    try {
        if (!fs.existsSync(contentFactoryPath)) {
            console.error(`Directory not found: ${contentFactoryPath}`);
            return;
        }

        const files = fs.readdirSync(contentFactoryPath).filter(file => file.endsWith('.md'));
        const posts = [];
        const internalLinksMap = new Map(); // Title -> Slug

        console.log(`Found ${files.length} files. Processing for SEO...`);

        // Pass 1: Extract Metadata
        files.forEach(file => {
            const content = fs.readFileSync(path.join(contentFactoryPath, file), 'utf-8');
            const lines = content.split('\n');

            let title = lines[0].replace(/^#\s*/, '').trim();
            if (!title) title = file.replace('.md', '').replace(/_/g, ' ');

            const slug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            // Extract Excerpt (First non-empty, non-header paragraph)
            let excerpt = '';
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#') && !line.startsWith('![')) {
                    excerpt = cleanExcerpt(line);
                    break;
                }
            }
            if (excerpt.length > 155) excerpt = excerpt.substring(0, 152) + '...'; // Standard SEO Meta Description length

            const category = getCategoryFromKeywords(title + ' ' + content);

            // Add Category-Specific Tags
            const extraTags = categoryTags[category] || [];
            const manualTags = title.split(' ').filter(w => w.length > 4).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
            const tags = [...new Set([category, ...extraTags, ...manualTags])].slice(0, 8); // Limit to 8 relevant tags

            internalLinksMap.set(title.toLowerCase(), slug);

            posts.push({
                id: slug,
                title,
                excerpt,
                category,
                readTime: Math.ceil(content.split(' ').length / 200),
                publishDate: new Date().toISOString().split('T')[0],
                tags,
                featured: false,
                author: 'Vansh Singh',
                views: Math.floor(Math.random() * 500),
                likes: Math.floor(Math.random() * 50),
                difficulty: 'Beginner',
                content: content
            });
        });

        // Pass 2: "Crazy" Internal Linking
        console.log('Generating smart internal links...');

        // Combine Blog Titles + Static Keywords
        const dynamicLinkKeys = Array.from(internalLinksMap.keys()).sort((a, b) => b.length - a.length);
        const staticLinkKeys = Object.keys(staticKeywordLinks).sort((a, b) => b.length - a.length);

        posts.forEach(post => {
            let linkedContent = post.content;
            let linksAdded = 0;
            const maxLinks = 8; // Increased limit for "Crazy" SEO

            // 2.1 Link Static Pages (Store, Editor, etc.) - Priority
            for (const key of staticLinkKeys) {
                if (linksAdded >= maxLinks) break;

                // Regex to match whole word, case insensitive, not already in a link
                const regex = new RegExp(`\\b(${key})\\b(?![^\\[]*\\])`, 'i');
                if (regex.test(linkedContent)) {
                    if (!linkedContent.includes(`](${staticKeywordLinks[key]})`)) {
                        linkedContent = linkedContent.replace(regex, `[$1](${staticKeywordLinks[key]})`);
                        linksAdded++;
                    }
                }
            }

            // 2.2 Link Other Blog Posts
            for (const key of dynamicLinkKeys) {
                if (linksAdded >= maxLinks) break;
                if (key === post.title.toLowerCase()) continue;

                // Simple check to avoid linking common words if they match a title exactly but usually wouldn't desire a link? 
                // Actually, if a blog title is "Editing", we want to link "editing".
                const regex = new RegExp(`\\b(${key})\\b(?![^\\[]*\\])`, 'i');
                if (regex.test(linkedContent)) {
                    if (!linkedContent.includes(`](${internalLinksMap.get(key)})`) && !linkedContent.includes(`](/blog/${internalLinksMap.get(key)})`)) {
                        linkedContent = linkedContent.replace(regex, `[$1](/blog/${internalLinksMap.get(key)})`);
                        linksAdded++;
                    }
                }
            }
            post.content = linkedContent;
        });

        // Separate Summaries and Content
        const summaries = posts.map(({ content, ...summary }) => summary);
        const contentMap = {};
        posts.forEach(p => contentMap[p.id] = p.content);

        const output = {
            summaries,
            contentMap
        };

        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`Successfully processed ${posts.length} posts with SEO enhancements. Data written to ${outputPath}`);
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

processFiles();
