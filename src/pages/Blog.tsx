import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
  PlayIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import PageSEO from '../components/SEO/PageSEO';
import { blogSummaries as blogPosts } from '../data/blogSummaries';
import BannerAd from '../components/ads/BannerAd';
import LeaderboardAd from '../components/ads/LeaderboardAd';
import { getCategoryGradient } from '../utils/styleUtils';
const Blog: React.FC = () => {
  // Popunder removed from listing page per user request
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts; // Show all posts


  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "EditorVault Blog - Free Video Editing Tips and Resources",
    "description": "Learn video editing techniques, discover free assets, and master professional video creation with our comprehensive guides and tutorials.",
    "url": "https://editorvault.web.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "EditorVault",
      "logo": {
        "@type": "ImageObject",
        "url": "https://editorvault.web.app/logo.svg"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishDate,
      "author": {
        "@type": "Organization",
        "name": "EditorVault"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EditorVault",
        "logo": {
          "@type": "ImageObject",
          "url": "https://editorvault.web.app/logo.svg"
        }
      },
      "url": `https://editorvault.web.app/blog/${post.id}`,
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

      <div className="min-h-screen relative">


        <div className="max-w-6xl mx-auto px-4 py-8 safe-area-top">
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

          {/* Top Leaderboard Ad */}
          <LeaderboardAd className="mb-8" />

          {/* Featured Posts */}
          <section className="mb-16">
            <BannerAd className="mb-12" />
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Latest Articles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-4">
                    {/* Image or Thumbnail */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-gray-800 relative">
                      {post.image ? (
                        <LazyLoadImage
                          src={post.image}
                          alt={post.title}
                          effect="blur"
                          wrapperClassName="w-full h-full"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          width="100%"
                          height="100%"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-6xl">${post.thumbnail || '📝'}</div>`;
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${getCategoryGradient(post.category)}`}>
                          <div className="text-4xl mb-2">{post.thumbnail || '📝'}</div>
                          <div className="text-white font-bold text-center leading-tight opacity-90 line-clamp-2">
                            {post.title}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                        {post.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </div>
                      <time className="text-gray-500 text-sm">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </time>
                    </div>
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
        </div >
      </div >
    </>
  );
};

export default Blog;