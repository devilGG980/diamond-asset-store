import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PageSEO from '../components/SEO/PageSEO';

import {
  SparklesIcon,
  PlayIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { blogSummaries } from '../data/blogSummaries';
import BannerAd from '../components/ads/BannerAd';
import LeaderboardAd from '../components/ads/LeaderboardAd';

const Home: React.FC = () => {
  const features = [
    { icon: SparklesIcon, title: 'Video Editing Assets', description: 'Download professional video editing assets including transitions, templates, motion graphics & effects. Free resources for all creators.' },
    { icon: CurrencyDollarIcon, title: 'Free Thumbnail Maker', description: 'Create stunning YouTube thumbnails with our free online thumbnail maker. No watermark, no signup - design eye-catching thumbnails instantly.' },
    { icon: PlayIcon, title: 'YouTube Creator Tools', description: 'Complete toolkit for YouTube creators: video editing assets, thumbnail maker, transitions, backgrounds and templates - all free!' },
    { icon: UsersIcon, title: 'Content Creator Resources', description: 'Free video editing assets and thumbnail maker trusted by thousands of creators on YouTube, TikTok & Instagram.' },
  ];



  // Load featured assets from CDN
  const [featured, setFeatured] = useState<string[]>([]);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const BASE_CDN = 'https://cdn.jsdelivr.net/gh/devilGG980/diamond-asset-store@main/public';

  // Featured Assets loading
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BASE_CDN}/assets/index.json`, { cache: 'no-store' });
        if (!res.ok) return;
        const files: string[] = await res.json();
        const imgs = (files || []).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
        if (!cancelled) setFeatured(imgs.slice(0, 12));
      } catch { }
      finally { if (!cancelled) setAssetsLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, []);


  return (
    <>
      <PageSEO
        title="Free Thumbnail Maker & Video Editing Assets | EditorVault"
        description="Create YouTube thumbnails instantly with our FREE thumbnail maker (no watermark). Download 500+ free video editing assets, transitions & templates. Perfect for Premiere Pro, After Effects & DaVinci Resolve. Join 1000+ creators today!"
        keywords={[
          // FASTEST RANKING PRIMARY (KD: 10-14, Volume: 1500-4200/month)
          'free youtube thumbnail maker',           // KD: 12, Vol: 2,400
          'thumbnail maker no watermark',           // KD: 14, Vol: 1,800
          'free video editing assets',              // KD: 11, Vol: 4,200 - HIGHEST
          'video editing resources free',           // KD: 10, Vol: 2,600 - EASIEST
          'youtube thumbnail maker free',           // KD: 13, Vol: 1,500

          // SECONDARY FAST RANKING (KD: 12-16, Vol: 1800+)
          'free video assets download',             // KD: 12, Vol: 3,800
          'free video transitions',                 // KD: 16, Vol: 3,200
          'best free video assets',                 // KD: 12, Vol: 2,100
          'free video editing templates',           // KD: 15, Vol: 2,100

          // THUMBNAIL KEYWORDS
          'youtube thumbnail template free',        // KD: 13, Vol: 1,500
          'thumbnail maker online free',            // KD: 14, Vol: 1,400
          'thumbnail design tool free',             // KD: 13, Vol: 1,000
          'online thumbnail maker',                 // KD: 14, Vol: 1,100

          // LONG-TAIL EASY (KD: 6-10)
          'how to make youtube thumbnails free',    // KD: 10, Vol: 950
          'free youtube thumbnail design',          // KD: 9, Vol: 850
          'where to find free video editing assets' // KD: 7, Vol: 1,400
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "EditorVault",
          "url": "https://editorvault.web.app/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://editorvault.web.app/store?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}

      />

      {/* News Banner for Google Discover/News */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 text-center text-sm font-semibold">
        🔥 NEW: 500+ Free Video Editing Assets Released! Create YouTube Thumbnails Instantly — Join 1000+ Creators
      </div>

      {/* Top Leaderboard Ad - High Visibility */}
      <LeaderboardAd className="max-w-7xl mx-auto" />

      {/* Top Banner Ad - Component removed to improve visible hero area */}
      {/* <BannerAd className="max-w-7xl mx-auto px-4" /> */}

      {/* Enhanced gradient background with animated particles */}
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/30 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        </div>

        {/* Hero */}
        <section className="relative pt-32 pb-24 px-4 safe-area-top">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Professional Assets for Creators
                </span>
              </motion.div>

              {/* Main Headline - H1 for SEO */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="block text-white mb-2">Best Free Video Editing Assets Download 2024</span>
                <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Create YouTube Thumbnails with Our Free Thumbnail Maker Online
                </span>
              </h1>

              {/* Subtitle with Keywords and Internal Links - PA OPTIMIZED */}
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                Download <Link to="/store" className="text-white font-semibold hover:text-cyan-300 transition-colors underline">free video editing assets, transitions, templates & effects</Link> for Premiere Pro, After Effects & DaVinci Resolve. Use our <Link to="/editor" className="text-cyan-300 hover:text-cyan-400 underline">best thumbnail maker for YouTube</Link> to create professional thumbnails instantly with no watermark.
                <br className="hidden sm:block" />
                Get <Link to="/store?category=Overlays" className="text-purple-300 hover:text-purple-200 transition-colors underline">free video overlays, motion graphics, video backgrounds</Link> and premium editing resources. Perfect for YouTube creators, TikTok makers & video editors!
              </p>

              {/* CTA Buttons - PA OPTIMIZED with keyword anchors */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  to="/store"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                  title="Download free video editing assets"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Free Assets
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/editor"
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  title="Create YouTube thumbnails"
                >
                  Thumbnail Editor
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                {[
                  { label: 'Active Creators', value: '1,000+', icon: UsersIcon },
                  { label: 'Free Assets', value: '500+', icon: SparklesIcon },
                  { label: 'Downloads', value: '10K+', icon: PlayIcon }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold">{stat.value}</div>
                      <div className="text-gray-500 text-xs">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-5xl mx-auto"
            >



              {/* Main showcase card with glassmorphism */}
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl p-2 shadow-2xl">
                <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

                  {/* Center content removed per request (large EV logo). Keeping subtle glow only. */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute top-8 left-8 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-sm text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    ✨ Premium Quality
                  </motion.div>
                  <motion.div
                    className="absolute top-8 right-8 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-sm text-white"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    🚀 Instant Download
                  </motion.div>
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-sm text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    💎 No Subscriptions
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mid-Content Ad - Removed per user request */}
        {/* <BannerAd label="Sponsored" className="max-w-4xl mx-auto px-4" /> */}


        {/* Feature grid */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Best Free Video Editing Assets & Templates Download - YouTube Creator Tools 2024
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Download <strong className="text-white">best free video editing assets including transitions, templates, overlays & effects</strong> for Premiere Pro, After Effects, DaVinci Resolve. All resources compatible with YouTube, TikTok & Instagram. Free video backgrounds, motion graphics & professional templates for content creators seeking high-quality editing resources.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm p-6 h-full hover:border-white/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <f.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured assets grid */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Popular Free Video Assets & Templates - Download Now</h2>
              <Link to="/store" className="text-cyan-400 hover:text-cyan-300 text-sm">Browse all video editing templates →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featured.map((name, idx) => (
                <motion.div key={name + idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <LazyLoadImage
                    src={`${BASE_CDN}/assets/${encodeURIComponent(name)}`}
                    alt={name}
                    effect="blur"
                    wrapperClassName="w-full h-28"
                    className="w-full h-28 object-cover"
                    width="100%"
                    height="100%"
                  />
                </motion.div>
              ))}
              {!assetsLoaded && Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl h-28 animate-pulse bg-white/5 border border-white/10" />
              ))}
            </div>
          </div>
        </section>


        {/* How it works */}
        <section className="relative py-16 px-4 bg-gradient-to-b from-transparent to-black/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-white">How to Download Best Free Video Editing Assets & Create YouTube Thumbnails - Step by Step</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  t: 'Browse Free Assets',
                  e: 'Download free video transitions, templates, backgrounds & effects instantly.',
                  link: '/store'
                },
                {
                  t: 'Create Thumbnails',
                  e: 'Use our free thumbnail maker to design professional YouTube thumbnails.',
                  link: '/editor'
                }
              ].map((s, idx) => (
                <Link
                  key={idx}
                  to={s.link}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 text-center block hover:bg-white/10 transition-all hover:scale-105"
                  title={s.t}
                >
                  <div className="text-2xl text-yellow-400 mb-2">{idx + 1}️⃣</div>
                  <h3 className="text-white font-semibold text-lg">{s.t}</h3>
                  <p className="text-gray-300 text-sm mt-1">{s.e}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/store" className="btn-primary px-8 py-3">Explore the library</Link>
            </div>
          </div>
        </section>

        {/* Featured Blog Posts Section - SEO Internal Linking */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm mb-4">
                <BookOpenIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Learning Resources</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Featured Video Editing Guides & Tutorials
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Expert guides on video editing, thumbnail creation, and content creation tips
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogSummaries.slice(0, 6).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="group block h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Blog Image */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-900/30 to-cyan-900/30">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-cyan-300 font-semibold">
                        {post.category}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-xl font-semibold text-white hover:from-purple-600/30 hover:to-cyan-600/30 transition-all duration-300"
              >
                View All Blog Posts
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl p-8 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-3xl font-bold text-white">Start Creating Now - Download Best Free Video Editing Assets</h3>
            <p className="text-gray-300 mt-2">Best free video editing templates for Premiere Pro, After Effects & DaVinci Resolve. Get professional transitions, overlays, backgrounds & effects. Use our free thumbnail maker for YouTube. No subscriptions, instant download!</p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Link
                to="/store"
                className="btn-primary px-7 py-3"
                title="Download free video editing assets"
              >
                Browse Free Assets
              </Link>
              <Link
                to="/editor"
                className="btn-primary px-7 py-3"
                title="Create YouTube thumbnails"
              >
                Create Thumbnails
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Leaderboard Ad */}
        <LeaderboardAd className="max-w-7xl mx-auto mb-8" />

        {/* Bottom Ad - Before Footer */}
        {/* TODO: Replace 'placeholder-bot' with a new unique Ad Unit ID from your provider */}
        <BannerAd
          adId="placeholder-bot"
          className="max-w-7xl mx-auto px-4 mb-20"
        />
      </div>
    </>
  );
};

export default Home;

