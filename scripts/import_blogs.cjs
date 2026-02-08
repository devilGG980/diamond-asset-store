const fs = require('fs');
const path = require('path');

const contentFactoryPath = path.join(__dirname, '../Content_Factory');
const outputPath = path.join(__dirname, '../src/data/imported_data.json');

// Category Color Map (Tailwind classes or pure CSS gradients)
const categoryGradients = {
    'YouTube Growth': 'from-red-600 to-red-900',
    'Video Editing': 'from-purple-600 to-blue-900',
    'VFX': 'from-green-600 to-emerald-900',
    'Hardware': 'from-gray-700 to-black',
    'Software': 'from-blue-600 to-cyan-800',
    'Career': 'from-yellow-600 to-orange-900',
    'Social Media': 'from-pink-600 to-rose-900',
    'Design': 'from-indigo-600 to-violet-900',
    'Audio': 'from-teal-600 to-cyan-900',
    'Other': 'from-gray-600 to-gray-900'
};

function getCategoryFromKeywords(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('youtube') || lowerText.includes('subscriber') || lowerText.includes('channel')) return 'YouTube Growth';
    if (lowerText.includes('edit') || lowerText.includes('cut') || lowerText.includes('premiere') || lowerText.includes('davinci')) return 'Video Editing';
    if (lowerText.includes('vfx') || lowerText.includes('effect') || lowerText.includes('animation') || lowerText.includes('3d')) return 'VFX';
    if (lowerText.includes('pc') || lowerText.includes('laptop') || lowerText.includes('monitor') || lowerText.includes('camera') || lowerText.includes('mic')) return 'Hardware';
    if (lowerText.includes('software') || lowerText.includes('app') || lowerText.includes('tool')) return 'Software';
    if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('money') || lowerText.includes('freelance')) return 'Career';
    if (lowerText.includes('tiktok') || lowerText.includes('instagram') || lowerText.includes('social')) return 'Social Media';
    if (lowerText.includes('design') || lowerText.includes('thumbnail') || lowerText.includes('art')) return 'Design';
    if (lowerText.includes('audio') || lowerText.includes('sound') || lowerText.includes('music')) return 'Audio';
    return 'Other';
}

function processFiles() {
    const files = fs.readdirSync(contentFactoryPath).filter(file => file.endsWith('.md'));
    const posts = [];
    const internalLinksMap = new Map(); // Title -> Slug

    console.log(`Found ${files.length} files. Processing...`);

    // Pass 1: Extract Metadata
    files.forEach(file => {
        const content = fs.readFileSync(path.join(contentFactoryPath, file), 'utf-8');
        const lines = content.split('\n');

        let title = lines[0].replace(/^#\s*/, '').trim();
        // Remove special chars from title for slug
        // Ensure title is clean
        if (!title) title = file.replace('.md', '').replace(/_/g, ' ');

        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        // Extract Excerpt (first non-empty paragraph)
        let excerpt = '';
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() && !lines[i].startsWith('#')) {
                excerpt = lines[i].trim();
                break;
            }
        }
        if (excerpt.length > 150) excerpt = excerpt.substring(0, 147) + '...';

        const category = getCategoryFromKeywords(title + ' ' + content);

        // internalLinksMap (using shorter keys for better matching chances)
        internalLinksMap.set(title.toLowerCase(), slug);
        // Add some keywords to map if title is long? Maybe later.

        posts.push({
            id: slug,
            title,
            excerpt,
            category,
            readTime: Math.ceil(content.split(' ').length / 200),
            publishDate: new Date().toISOString().split('T')[0], // Today
            tags: [category, ...title.split(' ').filter(w => w.length > 4)],
            featured: false,
            author: 'Vansh Singh',
            views: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 50),
            thumbnail: '📝', // Fallback
            difficulty: 'Beginner',
            content: content // Temporary storage
        });
    });

    // Pass 2: Internal Linking
    console.log('Generating internal links...');

    // Convert map keys to array for sorting (longest first to avoid partial matches)
    const linkKeys = Array.from(internalLinksMap.keys()).sort((a, b) => b.length - a.length);

    posts.forEach(post => {
        let linkedContent = post.content;
        let linksAdded = 0;

        for (const key of linkKeys) {
            if (linksAdded > 5) break; // Max 5 internal links per post to avoid spam
            if (key === post.title.toLowerCase()) continue; // Don't link to self

            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(linkedContent)) {
                // Check if already linked (simple check)
                if (!linkedContent.includes(`](${internalLinksMap.get(key)})`)) {
                    linkedContent = linkedContent.replace(regex, match => `[${match}](/blog/${internalLinksMap.get(key)})`);
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
    console.log(`Successfully processed ${posts.length} posts. Data written to ${outputPath}`);
}

processFiles();
