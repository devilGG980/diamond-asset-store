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

/**
 * Parses content to find "Step X" or numbered lists that function as steps.
 * Returns a HowTo Schema object or null.
 */
function extractHowToSchema(content, title) {
    const lines = content.split('\n');
    const steps = [];

    // Regex for "Step 1:", "Step 1.", "1. ", "## Step 1"
    const stepRegex = /^(?:#+\s*)?(?:Step\s+\d+|[1-9]\.)[:.]?\s+(.+)/i;

    // Iterate lines to find steps
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(stepRegex);
        if (match) {
            steps.push({
                "@type": "HowToStep",
                "name": match[1].trim(),
                "text": match[1].trim(), // Could fetch next lines for description, but complex
                "url": `https://editorvault.web.app/blog#step-${steps.length + 1}`
            });
        }
    }

    if (steps.length >= 3) {
        return {
            "@type": "HowTo",
            "name": title,
            "step": steps
        };
    }
    return null;
}

/**
 * Parses content to find an "FAQ" section.
 * Returns an FAQPage Schema object or null.
 */
function extractFAQSchema(content) {
    const lines = content.split('\n');
    const faqs = [];
    let inFAQ = false;
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect FAQ Header
        if (/^#+\s*FAQ/i.test(line)) {
            inFAQ = true;
            continue;
        }

        if (inFAQ) {
            // Header implies Question
            if (line.startsWith('#')) {
                // Save previous if exists
                if (currentQuestion) {
                    faqs.push(currentQuestion);
                }
                currentQuestion = {
                    "@type": "Question",
                    "name": line.replace(/^#+\s*/, '').trim(),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": ""
                    }
                };
            } else if (currentQuestion && line.length > 0) {
                // Append text to Answer
                currentQuestion.acceptedAnswer.text += line + " ";
            }
        }
    }
    // Push last question
    if (currentQuestion) {
        faqs.push(currentQuestion);
    }

    if (faqs.length >= 2) {
        return {
            "@type": "FAQPage",
            "mainEntity": faqs
        };
    }
    return null;
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

        console.log(`Found ${files.length} files. Processing for SEO + Schema...`);

        // Pass 1: Extract Metadata & Schema
        files.forEach(file => {
            const content = fs.readFileSync(path.join(contentFactoryPath, file), 'utf-8');
            const lines = content.split('\n');

            let title = lines[0].replace(/^#\s*/, '').trim();
            if (!title) title = file.replace('.md', '').replace(/_/g, ' ');

            const slug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            let excerpt = '';
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#') && !line.startsWith('![')) {
                    excerpt = cleanExcerpt(line);
                    break;
                }
            }
            if (excerpt.length > 155) excerpt = excerpt.substring(0, 152) + '...';

            const category = getCategoryFromKeywords(title + ' ' + content);

            const extraTags = categoryTags[category] || [];
            const manualTags = title.split(' ').filter(w => w.length > 4).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
            const tags = [...new Set([category, ...extraTags, ...manualTags])].slice(0, 8);

            internalLinksMap.set(title.toLowerCase(), slug);

            // Schema Extraction
            const schemas = [];
            const howTo = extractHowToSchema(content, title);
            if (howTo) schemas.push(howTo);

            const faq = extractFAQSchema(content);
            if (faq) schemas.push(faq);

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
                content: content,
                schema: schemas.length > 0 ? schemas : null // Store detected schemas
            });
        });

        // Pass 2: "Crazy" Internal Linking
        console.log('Generating smart internal links...');

        const dynamicLinkKeys = Array.from(internalLinksMap.keys()).sort((a, b) => b.length - a.length);
        const staticLinkKeys = Object.keys(staticKeywordLinks).sort((a, b) => b.length - a.length);

        posts.forEach(post => {
            let linkedContent = post.content;
            let linksAdded = 0;
            const maxLinks = 8;

            for (const key of staticLinkKeys) {
                if (linksAdded >= maxLinks) break;
                const regex = new RegExp(`\\b(${key})\\b(?![^\\[]*\\])`, 'i');
                if (regex.test(linkedContent)) {
                    if (!linkedContent.includes(`](${staticKeywordLinks[key]})`)) {
                        linkedContent = linkedContent.replace(regex, `[$1](${staticKeywordLinks[key]})`);
                        linksAdded++;
                    }
                }
            }

            for (const key of dynamicLinkKeys) {
                if (linksAdded >= maxLinks) break;
                if (key === post.title.toLowerCase()) continue;

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

        const summaries = posts.map(({ content, ...summary }) => summary);
        const contentMap = {};
        posts.forEach(p => contentMap[p.id] = p.content);

        const output = {
            summaries,
            contentMap
        };

        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`Successfully processed ${posts.length} posts with SEO Schema enhancements. Data written to ${outputPath}`);
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

processFiles();
