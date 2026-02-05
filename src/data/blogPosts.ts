import { blogSummaries, BlogPost } from './blogSummaries';
import { blogContent } from './blogContent';

export interface FullBlogPost extends BlogPost {
    content: string;
}

export const blogPosts: FullBlogPost[] = blogSummaries.map(post => ({
    ...post,
    content: blogContent[post.id] || ''
}));

export type { BlogPost };
