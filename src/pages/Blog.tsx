import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import PageSEO from '../components/SEO/PageSEO';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishDate: string;
  tags: string[];
  featured: boolean;
}

const Blog: React.FC = () => {
  // Sample blog posts - in a real app, these would come from a CMS or database
  const blogPosts: BlogPost[] = [
    {
      id: 'ultimate-guide-free-video-editing-assets',
      title: 'Ultimate Guide to Free Video Editing Assets for YouTube Creators',
      excerpt: 'Discover how to find, download, and use professional video editing assets without breaking the bank. Perfect for YouTube creators, content makers, and video editors.',
      content: 'Complete guide content here...',
      category: 'Video Editing',
      readTime: 8,
      publishDate: '2024-01-15',
      tags: ['video editing', 'youtube', 'free assets', 'content creation'],
      featured: true
    },
    {
      id: 'best-premiere-pro-transitions',
      title: 'Best Free Premiere Pro Transitions for Professional Videos',
      excerpt: 'Elevate your video projects with these professional-grade transitions for Adobe Premiere Pro. Learn how to install and use them effectively.',
      content: 'Transition guide content here...',
      category: 'Premiere Pro',
      readTime: 6,
      publishDate: '2024-01-10',
      tags: ['premiere pro', 'transitions', 'adobe', 'video effects'],
      featured: true
    },
    {
      id: 'after-effects-templates-guide',
      title: 'Free After Effects Templates: Complete Beginner\'s Guide',
      excerpt: 'Master the art of using After Effects templates with our comprehensive guide. From installation to customization, we cover it all.',
      content: 'After Effects guide content here...',
      category: 'After Effects',
      readTime: 10,
      publishDate: '2024-01-05',
      tags: ['after effects', 'templates', 'motion graphics', 'animation'],
      featured: false
    },
    {
      id: 'royalty-free-music-video-editing',
      title: 'How to Find Perfect Royalty-Free Music for Video Editing',
      excerpt: 'Learn how to choose the right background music for your videos without copyright issues. Tips for selecting tracks that enhance your content.',
      content: 'Music selection guide content here...',
      category: 'Music',
      readTime: 5,
      publishDate: '2023-12-28',
      tags: ['royalty free music', 'background music', 'copyright', 'audio'],
      featured: false
    },
    {
      id: 'video-backgrounds-green-screen',
      title: 'Creating Stunning Videos with Free Backgrounds and Green Screen',
      excerpt: 'Transform your videos with professional backgrounds. Learn compositing techniques and best practices for green screen usage.',
      content: 'Background compositing guide content here...',
      category: 'Backgrounds',
      readTime: 7,
      publishDate: '2023-12-20',
      tags: ['video backgrounds', 'green screen', 'compositing', 'visual effects'],
      featured: false
    },
    {
      id: 'motion-graphics-beginners',
      title: 'Motion Graphics for Beginners: Free Assets and Tools',
      excerpt: 'Get started with motion graphics using free assets and tools. Perfect introduction for content creators wanting to add animated elements.',
      content: 'Motion graphics beginner guide content here...',
      category: 'Motion Graphics',
      readTime: 12,
      publishDate: '2023-12-15',
      tags: ['motion graphics', 'animation', 'beginner guide', 'free tools'],
      featured: true
    }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 4);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Video Forge Blog - Free Video Editing Tips and Resources",
    "description": "Learn video editing techniques, discover free assets, and master professional video creation with our comprehensive guides and tutorials.",
    "url": "https://videoforges.web.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Video Forge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://videoforges.web.app/logo.svg"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishDate,
      "author": {
        "@type": "Organization",
        "name": "Video Forge"
      },
      "publisher": {
        "@type": "Organization", 
        "name": "Video Forge",
        "logo": {
          "@type": "ImageObject",
          "url": "https://videoforges.web.app/logo.svg"
        }
      },
      "url": `https://videoforges.web.app/blog/${post.id}`,
      "keywords": post.tags.join(', '),
      "articleSection": post.category,
      "wordCount": post.readTime * 200 // Approximate words
    }))
  };

  return (
    <>
      <PageSEO 
        title="Free Video Editing Blog - Tips, Tutorials & Resources"
        description="Learn professional video editing techniques with our comprehensive blog. Discover free assets, master Premiere Pro and After Effects, and create stunning content for YouTube and social media."
        keywords={[
          'video editing blog',
          'video editing tutorials',
          'premiere pro tips',
          'after effects tutorials',
          'free video editing resources',
          'youtube video editing',
          'video editing techniques',
          'content creation tips',
          'video editing guides',
          'motion graphics tutorials',
          'video editing for beginners'
        ]}
        structuredData={blogStructuredData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' }
        ]}
      />
      
      <div className="min-h-screen p-4 safe-area-top">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              Video Editing Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Master <strong>video editing</strong> with our comprehensive guides, tutorials, and tips. 
              Learn to create professional content with <strong>free editing assets</strong> and industry techniques.
            </p>
          </motion.div>

          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Featured Articles
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 text-sm font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>
                    <time className="text-gray-500 text-sm">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </time>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs flex items-center"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center transition-colors"
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Recent Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <BookOpenIcon className="w-6 h-6 mr-2 text-blue-400" />
              Recent Articles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-blue-500 pl-6 py-4 hover:bg-gray-900 rounded-r-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-sm font-medium">
                      {post.category}
                    </span>
                    <time className="text-gray-500 text-sm">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </time>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {post.readTime} min read
                    </div>
                    
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Browse by Category</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Video Editing', 'Premiere Pro', 'After Effects', 'Music', 'Backgrounds', 'Motion Graphics'].map((category) => (
                <Link
                  key={category}
                  to={`/blog?category=${encodeURIComponent(category)}`}
                  className="card text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">
                    {category === 'Video Editing' && '🎬'}
                    {category === 'Premiere Pro' && '🎥'}
                    {category === 'After Effects' && '✨'}
                    {category === 'Music' && '🎵'}
                    {category === 'Backgrounds' && '🖼️'}
                    {category === 'Motion Graphics' && '🌟'}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {category}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {blogPosts.filter(post => post.category === category).length} articles
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"
          >
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Put your new knowledge to use with our <strong>free video editing assets</strong>. 
              Download professional transitions, backgrounds, and music tracks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store" className="btn-primary text-lg px-8 py-4">
                Browse Free Assets
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/about" className="btn-secondary text-lg px-8 py-4">
                Learn More About Us
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Blog;