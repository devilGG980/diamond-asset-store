import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ArrowDownIcon,
  StarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { categories, mockAssets, getAssetsByCategory, searchAssets, Asset } from '../data/assets';
import OptimizedVideo from '../components/ui/OptimizedVideo';
import OptimizedImage from '../components/ui/OptimizedImage';
import PageSEO from '../components/SEO/PageSEO';

const Store: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, downloads, newest
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null);

  const filteredAssets = useMemo(() => {
    let assets: Asset[] = [];

    // Apply search filter
    if (searchQuery.trim()) {
      assets = searchAssets(searchQuery);
    } else {
      assets = getAssetsByCategory(selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        assets.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        assets.sort((a, b) => b.price - a.price);
        break;
      case 'downloads':
        assets.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        assets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'featured':
      default:
        assets.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.downloads - a.downloads;
        });
        break;
    }

    return assets;
  }, [selectedCategory, searchQuery, sortBy]);

  // Dynamic SEO based on search and category
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}" - Free Video Editing Assets`;
    }
    if (selectedCategory !== 'All') {
      return `Free ${selectedCategory} Assets - Video Editing Resources`;
    }
    return 'Free Video Editing Assets Store - Download Transitions, Music & Backgrounds';
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Find free video editing assets for "${searchQuery}". Download professional transitions, animations, music tracks, and backgrounds. Compatible with Premiere Pro, After Effects, Final Cut Pro.`;
    }
    if (selectedCategory !== 'All') {
      return `Download free ${selectedCategory.toLowerCase()} assets for video editing. Professional ${selectedCategory.toLowerCase()} compatible with major editing software. No subscription required - earn diamonds to unlock.`;
    }
    return 'Browse our complete collection of free video editing assets. Download professional transitions, animations, music tracks, and backgrounds for YouTube, social media, and video projects. Compatible with all major editing software.';
  };

  const getKeywords = () => {
    const baseKeywords = ['free video editing assets', 'video editing resources', 'asset store'];
    if (searchQuery) {
      baseKeywords.push(`${searchQuery} assets`, `free ${searchQuery}`);
    }
    if (selectedCategory !== 'All') {
      baseKeywords.push(`free ${selectedCategory.toLowerCase()}`, `${selectedCategory.toLowerCase()} assets`, `video ${selectedCategory.toLowerCase()}`);
    }
    return baseKeywords;
  };

  const storeStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": getPageTitle(),
    "description": getPageDescription(),
    "url": `https://videoforges.web.app/store${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": filteredAssets.length,
      "itemListElement": filteredAssets.slice(0, 10).map((asset, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": asset.title,
          "description": asset.description,
          "category": `Video Editing ${asset.category}`,
          "offers": {
            "@type": "Offer",
            "price": asset.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://videoforges.web.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Store",
          "item": "https://videoforges.web.app/store"
        }
      ]
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Store', url: '/store' }
  ];

  if (selectedCategory !== 'All') {
    breadcrumbs.push({ name: selectedCategory, url: `/store?category=${selectedCategory}` });
  }

  return (
    <>
      <PageSEO 
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={getKeywords()}
        structuredData={storeStructuredData}
        breadcrumbs={breadcrumbs}
        canonicalUrl={`https://videoforges.web.app/store${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}${selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`}
      />
    <div className="min-h-screen p-2 sm:p-4 safe-area-top">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-gradient mb-3 sm:mb-4">Free Video Editing Assets Store</h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8 px-2">
            Download professional video editing assets including <strong>free transitions</strong>, animations, music tracks, and backgrounds for YouTube, social media, and content creation
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative px-2">
            <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 sm:pl-12 pr-3 py-3 sm:py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm sm:text-lg touch-target"
              placeholder="Search assets..."
            />
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <div className="flex flex-col space-y-4 mb-6 sm:mb-8 px-2">
          {/* Categories */}
          <div className="w-full">
            <div className="flex items-center space-x-2 mb-3">
              <AdjustmentsHorizontalIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <span className="text-gray-400 font-medium text-sm sm:text-base">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm touch-target ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-gray-400 font-medium text-sm sm:text-base">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base touch-target flex-1 sm:flex-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="downloads">Most Downloaded</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2"
          >
            {filteredAssets.map((asset, index) => {
              console.log('Asset:', asset.title, 'Thumbnail:', asset.thumbnail);
              return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card group hover:scale-105 transition-all duration-300 relative"
                onMouseEnter={() => setHoveredAsset(asset.id)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                {/* Featured Badge */}
                {asset.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Asset Thumbnail/Video/Audio Preview */}
                <div className="relative mb-4 bg-gray-800 rounded-lg overflow-hidden aspect-video">
                  {hoveredAsset === asset.id && asset.previewVideo ? (
                    asset.format === 'MP3 Audio' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                        <div className="text-6xl mb-4 animate-pulse">{asset.thumbnail}</div>
                        <audio 
                          src={asset.previewVideo}
                          autoPlay
                          loop
                          controls
                          className="w-3/4"
                          style={{ filter: 'hue-rotate(280deg) saturate(1.5)' }}
                        />
                      </div>
                    ) : (
                      <OptimizedVideo
                        src={asset.previewVideo}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                        playsInline
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full group-hover:scale-110 transition-transform duration-300">
                      {asset.thumbnail && (asset.thumbnail.startsWith('data:') || asset.thumbnail.startsWith('/')) ? (
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.title}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('✅ Thumbnail loaded:', asset.thumbnail)}
                          onError={(e) => {
                            console.error('❌ Thumbnail failed:', asset.thumbnail);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🎬</div>';
                          }}
                        />
                      ) : (
                        <div className="text-6xl">{asset.thumbnail}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Play icon overlay when not hovering */}
                  {hoveredAsset !== asset.id && asset.previewVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        {asset.format === 'MP3 Audio' ? (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Tag */}
                <span className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm mb-3">
                  {asset.category}
                </span>

                {/* Asset Info */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {asset.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {asset.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>{asset.downloads.toLocaleString()}</span>
                </div>
                  <div>{asset.fileSize}</div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-400">
                    💎 {asset.price}
                  </span>
                  <Link
                    to={`/asset/${asset.id}`}
                    className="btn-primary text-sm"
                  >
                    View Details
                  </Link>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {asset.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{asset.tags.length - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No assets found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No assets match your search for "${searchQuery}"`
                : `No assets found in ${selectedCategory} category`
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredAssets.length >= 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button className="btn-secondary px-8 py-4">
              Load More Assets
              <ArrowDownIcon className="inline-block w-5 h-5 ml-2" />
            </button>
          </motion.div>
        )}
      </div>
      
      {/* SEO Content Section */}
      <section className="py-12 px-4 bg-gray-900 mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
            {selectedCategory !== 'All' 
              ? `Professional ${selectedCategory} Assets for Video Editing`
              : 'Complete Video Editing Assets Collection'
            }
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Why Choose Our Assets?</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Professional Quality:</strong> Industry-standard assets created by experts</li>
                <li>• <strong>Universal Compatibility:</strong> Works with all major editing software</li>
                <li>• <strong>Instant Download:</strong> Get your assets immediately after earning diamonds</li>
                <li>• <strong>Regular Updates:</strong> New assets added frequently</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Perfect For</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>YouTube Creators:</strong> Enhance your video content</li>
                <li>• <strong>Social Media:</strong> Create engaging posts and stories</li>
                <li>• <strong>Professional Projects:</strong> High-quality assets for clients</li>
                <li>• <strong>Content Creators:</strong> Stand out with premium effects</li>
              </ul>
            </div>
          </div>
          
          {selectedCategory !== 'All' && (
            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">
                Explore our {selectedCategory.toLowerCase()} collection featuring professional assets 
                compatible with <strong>Premiere Pro, After Effects, Final Cut Pro, and DaVinci Resolve</strong>.
              </p>
              <Link to="/store" className="text-blue-400 hover:text-blue-300 underline">
                Browse All Categories →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default Store;
