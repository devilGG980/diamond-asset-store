import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAssetById } from '../data/assets';
import { blogPosts } from '../data/blogPosts';
import { getRelatedPostsForAsset } from '../utils/recommendationUtils';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  StarIcon,
  CalendarIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OptimizedVideo from '../components/ui/OptimizedVideo';
import PageSEO from '../components/SEO/PageSEO';

const AssetPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(getAssetById(Number(id)));
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    if (!asset) {
      navigate('/store');
      return;
    }
  }, [asset, navigate]);

  const handleDownload = async () => {
    if (!asset) return;

    setDownloading(true);

    try {
      // Start the actual download
      const link = document.createElement('a');
      link.href = asset.downloadUrl || '#';
      link.download = asset.title.replace(/\s+/g, '-').toLowerCase() || 'asset';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Download started!`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download asset.');
    } finally {
      setDownloading(false);
    }
  };

  if (!asset) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageSEO
        title={`${asset.title} - Free Download | EditorVault`}
        description={`Download ${asset.title} for free. ${asset.description}`}
        keywords={[...asset.tags, asset.category, 'free download', 'video asset']}
        imageUrl={asset.thumbnail && !asset.thumbnail.startsWith('http') && !asset.thumbnail.startsWith('data:')
          ? `https://editorvault.web.app${asset.thumbnail}`
          : asset.thumbnail}

        pageType="product"
      />
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Store</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Asset Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="card">
                {/* Asset Display */}
                <div className="bg-gray-800 rounded-lg p-6 text-center mb-6 relative overflow-hidden">
                  {/* Video/Audio Preview - Optimized for Fast Loading */}
                  {asset.previewVideo ? (
                    <div className="w-full max-w-2xl mx-auto relative">
                      {/* Loading Overlay - Non-blocking */}
                      {videoLoading && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-3 z-10">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="text-2xl"
                            >
                              🔄
                            </motion.div>
                            <p className="text-white text-sm">Loading...</p>
                          </div>
                        </div>
                      )}

                      {asset.format === 'MP3 Audio' ? (
                        <div className="w-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-lg p-8 flex flex-col items-center justify-center" style={{ aspectRatio: '16/9' }}>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-8xl mb-6"
                          >
                            {asset.thumbnail}
                          </motion.div>
                          <audio
                            src={asset.previewVideo}
                            controls
                            autoPlay={false}
                            loop
                            className="w-full max-w-md"
                            style={{
                              filter: 'hue-rotate(280deg) saturate(1.5)',
                              borderRadius: '8px'
                            }}
                            onLoadStart={() => setVideoLoading(true)}
                            onLoadedData={() => setVideoLoading(false)}
                            onCanPlayThrough={() => setVideoLoading(false)}
                            onError={() => setVideoLoading(false)}
                          />
                        </div>
                      ) : (
                        <OptimizedVideo
                          src={asset.previewVideo}
                          className="w-full rounded-lg shadow-lg bg-gray-700"
                          controls
                          controlsList="nodownload nofullscreen noremoteplayback"
                          disablePictureInPicture
                          muted
                          playsInline
                          autoPlay={false}
                          loop
                          preload="metadata"
                          onLoadStart={() => {
                            console.log('Video load started');
                            setVideoLoading(true);
                          }}
                          onLoadedData={() => {
                            console.log('Video loaded');
                            setVideoLoading(false);
                          }}
                          onCanPlayThrough={() => {
                            console.log('Video ready to play');
                            setVideoLoading(false);
                          }}
                          onError={(e) => {
                            console.error('Video error:', e);
                            setVideoLoading(false);
                          }}
                          style={{
                            aspectRatio: '16/9',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    asset.thumbnail.startsWith('http') || asset.thumbnail.startsWith('/') || asset.thumbnail.startsWith('data:') ? (
                      <img
                        src={encodeURI(asset.thumbnail)}
                        alt={asset.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-8xl mb-4"
                      >
                        {asset.thumbnail}
                      </motion.div>
                    )
                  )}

                  {/* Featured Badge */}
                  {asset.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold flex items-center">
                        <StarIcon className="h-4 w-4 mr-1" />
                        Featured
                      </div>
                    </div>
                  )}
                </div>

                {/* Asset Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                      {asset.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <HeartIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-white mb-4">{asset.title}</h1>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {asset.description}
                  </p>

                  {/* Meta Information */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Downloads</p>
                        <p className="text-white font-medium">{asset.downloads.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Released</p>
                        <p className="text-white font-medium">{asset.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">File Size</p>
                        <p className="text-white font-medium">{asset.fileSize}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Format</p>
                        <p className="text-white font-medium">{asset.format}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Purchase Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="card sticky top-20">
                {/* Free Download Header */}
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-400 mb-2">
                    FREE
                  </div>
                  <p className="text-gray-400">Professional Asset</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {downloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download Now
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Instant Download</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Unlimited Downloads</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Commercial Use</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>24/7 Support</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>


        </div>

        {/* Related Tutorials Section */}
        <section className="mt-16 mb-12 border-t border-gray-800 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Learn to use this Asset</h3>
            <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 flex items-center">
              View All Tutorials <ShareIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {getRelatedPostsForAsset(asset, blogPosts, 3).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors group"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-gray-900">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {post.thumbnail || '📝'}
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <span className="text-sm text-gray-500">{post.readTime} min read</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AssetPreview;
