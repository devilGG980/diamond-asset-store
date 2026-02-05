
import { Asset } from '../data/assets';
import { BlogPost } from '../data/blogSummaries';

/**
 * Calculates a relevance score based on tag intersection.
 * @param itemTags Tags of the item being checked
 * @param targetTags Tags of the target/context (e.g., current blog post)
 * @returns number of matching tags
 */
const calculateRelevance = (itemTags: string[], targetTags: string[]): number => {
    if (!itemTags || !targetTags) return 0;
    const lowerItemTags = itemTags.map(t => t.toLowerCase());
    const lowerTargetTags = targetTags.map(t => t.toLowerCase());
    return lowerItemTags.filter(tag => lowerTargetTags.includes(tag)).length;
};

/**
 * Get recommended assets for a blog post.
 * @param post The current blog post
 * @param allAssets List of all available assets
 * @param limit Number of recommendations to return
 */
export const getRecommendedAssetsForPost = (
    post: BlogPost,
    allAssets: Asset[],
    limit: number = 2
): Asset[] => {
    // SCORE BASED SORTING
    const scoredAssets = allAssets.map(asset => ({
        asset,
        score: calculateRelevance(asset.tags, post.tags) + (asset.category === post.category ? 1 : 0) // Boost for matching category implicitly if we mapped them
    }));

    // Sort by score (descending)
    scoredAssets.sort((a, b) => b.score - a.score);

    // Return top N assets, filtering out those with 0 score if possible, unless we need to fill slots
    // If no matches, fall back to 'Featured' assets
    const topAssets = scoredAssets
        .filter(item => item.score > 0)
        .slice(0, limit)
        .map(item => item.asset);

    if (topAssets.length < limit) {
        const featured = allAssets.filter(a => a.featured && !topAssets.includes(a)).slice(0, limit - topAssets.length);
        return [...topAssets, ...featured];
    }

    return topAssets;
};

/**
 * Get related blog posts for a store asset.
 * @param asset The current asset
 * @param allPosts List of all blog posts
 * @param limit Number of recommendations to return
 */
export const getRelatedPostsForAsset = (
    asset: Asset,
    allPosts: BlogPost[],
    limit: number = 3
): BlogPost[] => {
    const scoredPosts = allPosts.map(post => ({
        post,
        score: calculateRelevance(post.tags, asset.tags)
    }));

    scoredPosts.sort((a, b) => b.score - a.score);

    // Filter 0 scores only if we have enough matches, otherwise keep them to fill UI? 
    // Better to show latest posts if no relevance.
    let topPosts = scoredPosts
        .filter(item => item.score > 0)
        .slice(0, limit)
        .map(item => item.post);

    if (topPosts.length < limit) {
        // Fill with latest featured posts
        const filler = allPosts
            .filter(p => !topPosts.includes(p))
            .slice(0, limit - topPosts.length);
        topPosts = [...topPosts, ...filler];
    }

    return topPosts;
};

/**
 * Specific check for Thumbnail Editor promotion
 */
export const shouldPromoteThumbnailEditor = (post: BlogPost): boolean => {
    const triggerTags = ['thumbnail', 'youtube', 'design', 'cover', 'image', 'picture', 'graphics'];
    return post.tags.some(tag => triggerTags.some(trigger => tag.toLowerCase().includes(trigger))) ||
        post.title.toLowerCase().includes('thumbnail');
};
