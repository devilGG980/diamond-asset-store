import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import PageSEO from '../components/SEO/PageSEO';
import {
  SparklesIcon,
  PlayIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: SparklesIcon,
      title: 'Free Video Editing Assets',
      description: 'Professional video transitions, animations, and effects created by expert designers for YouTube, social media, and professional projects',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'No Subscription Required',
      description: 'Earn diamonds through ads or activities - completely free alternative to expensive editing asset subscriptions',
    },
    {
      icon: PlayIcon,
      title: 'Instant Download',
      description: 'Download editing assets immediately - compatible with Premiere Pro, After Effects, Final Cut Pro, and DaVinci Resolve',
    },
    {
      icon: UsersIcon,
      title: 'Content Creator Community',
      description: 'Join thousands of YouTubers, filmmakers, and content creators using our free video editing resources',
    },
  ];

  // Placeholder for featured assets - will be replaced with your custom assets
  const featuredAssets: any[] = [
    // Coming soon - your custom assets will appear here
  ];

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Video Forge - Free Video Editing Assets",
    "alternateName": ["VideoForge", "Free Editing Assets", "Video Assets Store"],
    "description": "Download free professional video editing assets including transitions, animations, music tracks, and backgrounds. Compatible with Premiere Pro, After Effects, Final Cut Pro, and DaVinci Resolve. No subscription required - earn diamonds to unlock premium editing resources.",
    "url": "https://videoforges.web.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://videoforges.web.app/store?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Free Video Editing Assets Categories",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Video Transitions",
          "description": "Professional video transitions for smooth scene changes"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Video Backgrounds",
          "description": "High-quality backgrounds for video projects"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Music Tracks",
          "description": "Royalty-free music for video editing"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Animations",
          "description": "Professional motion graphics and animations"
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Video Forge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://videoforges.web.app/logo.svg"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "offerCount": "100+",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <PageSEO 
        title="Free Video Editing Assets - Professional Transitions, Music & Backgrounds"
        description="Download FREE professional video editing assets! Get premium transitions, animations, music tracks, and backgrounds for YouTube, social media, and video projects. Compatible with Premiere Pro, After Effects, Final Cut Pro. No subscription required - earn diamonds to unlock assets!"
        keywords={[
          'free video editing assets download',
          'video editing resources free',
          'youtube editing assets',
          'premiere pro assets free',
          'after effects templates free',
          'video transitions free download',
          'video backgrounds free',
          'editing music free',
          'motion graphics free',
          'video effects free',
          'content creator resources',
          'editing assets store',
          'professional video assets',
          'royalty free video assets',
          'video editing templates',
          'final cut pro assets',
          'davinci resolve assets'
        ]}
        structuredData={homeStructuredData}
        canonicalUrl="https://videoforges.web.app/"
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 text-center overflow-hidden safe-area-top">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-8"
          >
            💎
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-gradient mb-4 sm:mb-6">
            Video Forge - Free Video Editing Assets
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            Download <strong>FREE professional video editing assets</strong> - transitions, animations, music tracks, and backgrounds for <strong>YouTube, social media, and video projects</strong>. Compatible with <strong>Premiere Pro, After Effects, Final Cut Pro, DaVinci Resolve</strong>.
            <br className="hidden sm:block" />
            <span className="text-yellow-400 block sm:inline mt-2 sm:mt-0">No Subscription • Earn Diamonds • Instant Download • Professional Quality</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            {currentUser ? (
              <Link to="/store" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-target">
                Browse Store
                <ArrowRightIcon className="inline-block w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-target">
                  Get Started Free
                  <ArrowRightIcon className="inline-block w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-target">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Optimized Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20 gpu-accelerate"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            >
              💎
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient mb-3 sm:mb-4">
              Free Video Editing Assets for Content Creators
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 px-2">
              Professional editing resources without subscriptions - download <strong>video transitions, royalty-free music, HD backgrounds</strong> and premium motion graphics for YouTube, TikTok, and social media content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Assets */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Featured Assets
            </h2>
            <p className="text-xl text-gray-400">
              Popular picks from our community
            </p>
          </motion.div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-8xl mb-6">📎</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Custom Assets Coming Soon!
            </h3>
            <p className="text-xl text-gray-400 text-center max-w-2xl mb-8">
              We're preparing amazing custom video editing assets just for you. 
              <br />Stay tuned for professional intros, transitions, and more!
            </p>
            <div className="flex items-center space-x-2 text-yellow-400">
              <span className="animate-pulse">🔧</span>
              <span className="font-medium">Currently in development</span>
              <span className="animate-pulse">🔧</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/store"
              className="btn-primary text-lg px-8 py-4"
            >
              View All Assets
              <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-br from-gray-800 to-gray-900"
          >
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators and start earning diamonds today!
            </p>
            
            {currentUser ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ads" className="btn-primary text-lg px-8 py-4">
                  Earn Diamonds
                </Link>
                <Link to="/store" className="btn-secondary text-lg px-8 py-4">
                  Browse Store
                </Link>
              </div>
            ) : (
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Join Now - It's Free!
                <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gradient mb-6">Why Choose Video Forge for Free Video Editing Assets?</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Professional Quality Assets</h3>
                <p className="text-gray-300 mb-4">
                  Our <strong>free video editing assets</strong> are created by professional designers and motion graphics artists. Each <strong>video transition, background, and animation</strong> meets industry standards and works seamlessly with popular editing software.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Universal Compatibility</h3>
                <p className="text-gray-300 mb-4">
                  All our <strong>editing assets</strong> are compatible with <strong>Adobe Premiere Pro, After Effects, Final Cut Pro, DaVinci Resolve</strong>, and other major video editing platforms. Perfect for YouTubers, content creators, and video professionals.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">No Subscription Fees</h3>
                <p className="text-gray-300 mb-4">
                  Unlike expensive subscription-based platforms, Video Forge offers <strong>completely free video editing resources</strong>. Simply earn diamonds through activities and unlock premium assets without monthly fees.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Regular Updates</h3>
                <p className="text-gray-300 mb-4">
                  We regularly add new <strong>video transitions, motion graphics, music tracks</strong>, and editing templates. Our growing library ensures you always have fresh content for your video projects.
                </p>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gradient mb-4">Perfect for Content Creators</h3>
            <p className="text-gray-300 mb-6">
              Whether you're a <strong>YouTube creator, social media influencer, filmmaker, or video editor</strong>, Video Forge provides the <strong>free editing assets</strong> you need to create engaging content. Our marketplace includes:
            </p>
            
            <ul className="text-gray-300 space-y-2 mb-8">
              <li>• <strong>Video Transitions:</strong> Smooth cuts, wipes, fades, and creative scene changes</li>
              <li>• <strong>Motion Graphics:</strong> Animated logos, text effects, and graphic elements</li>
              <li>• <strong>Background Videos:</strong> HD and 4K backgrounds for green screen and compositing</li>
              <li>• <strong>Royalty-Free Music:</strong> Background tracks, beats, and audio effects</li>
              <li>• <strong>Video Templates:</strong> Pre-made intros, outros, and complete video structures</li>
              <li>• <strong>Visual Effects:</strong> Overlays, particles, and special effects</li>
            </ul>
            
            <div className="text-center">
              <Link 
                to="/store" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center"
              >
                Start Downloading Free Assets
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;